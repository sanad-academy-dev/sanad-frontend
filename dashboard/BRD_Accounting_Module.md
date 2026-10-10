# BRD — Accounting Module (ERPNext-Parity)
**Product:** Positive Accounting Core · **Reference system:** ERPNext v16 (`erpnext/accounts`, develop branch, analyzed Aug 2026)
**Audience:** AI coding agents + engineering team. **UI:** ALL screens must follow the Positive design system (this document is design-system-agnostic; it specifies fields, behavior, and logic only — never visual style).
**Companion file:** `IMPLEMENTATION_PHASES.md` (phase-by-phase build plan).

---

## 0. How to use this document (instructions for the AI agent)
1. Requirements are numbered `FR-x.y` (functional), `BR-x.y` (business rule), `NFR-x` (non-functional). Reference them in commits/PRs.
2. Entity field tables define the **canonical data model**. Names are `snake_case` and map 1:1 to DB columns.
3. "Posting map" tables define **exactly** which debit/credit rows a voucher generates. These are the source of truth — do not invent postings.
4. Anything marked **[P2]** is deferrable to a later phase (see phases file). Everything else is core.
5. Stack-agnostic: assumes a relational DB (PostgreSQL or SQL Server), a REST/RPC API layer, and a web UI in the Positive design system.

---

## 1. Purpose & Scope

### 1.1 Goal
Build a full double-entry accounting module functionally equivalent to ERPNext's `accounts` module: chart of accounts, general ledger, receivables/payables sub-ledger, sales & purchase invoicing with a multi-mode tax engine, payments with allocation & reconciliation, multi-currency, budgeting, dimensions, period closing, banking, and a complete financial reporting engine.

### 1.2 In scope (parity target)
- Masters: Company defaults, Fiscal Year, Chart of Accounts (tree), Cost Centers (tree) + Cost Center Allocation, Accounting Dimensions + Dimension Filters, Finance Books, Currencies + Exchange Rates, Modes of Payment, Payment Terms & Templates, Tax templates (Sales/Purchase), Item Tax Templates, Tax Category, Tax Rule, Tax Withholding Categories.
- Ledgers: GL Entry (immutable), Payment Ledger Entry (AR/AP sub-ledger), Advance Payment Ledger Entry [P2], Account Closing Balance.
- Vouchers: Journal Entry (all voucher types), Sales Invoice (incl. returns/credit notes, POS mode, write-off, discounts, deferred revenue), Purchase Invoice (incl. debit notes, hold, TDS), Payment Entry (Receive / Pay / Internal Transfer), Period Closing Voucher, Exchange Rate Revaluation, Dunning [P2], Invoice Discounting [P2].
- Tools: Payment Reconciliation (manual + auto), Unreconcile, Opening Invoice Creation Tool, Chart of Accounts Importer, Ledger Merge [P2], Repost Accounting Ledger [P2], Process Statement of Accounts [P2].
- Banking: Bank, Bank Account, Bank Transaction, Bank Reconciliation Tool, Bank Transaction Rules, Bank Clearance, Statement Import.
- Recurring: Subscriptions / Auto-repeat invoices [P2].
- Budgeting: Budget vs Cost Center/Project/Dimension with monthly distribution and Stop/Warn/Ignore actions.
- POS: POS Profile, POS Invoice, Opening/Closing Entry, Invoice consolidation (Merge Log) [P2 unless POS is launch-critical].
- Reports: General Ledger, Trial Balance, Trial Balance for Party, Balance Sheet, P&L, Cash Flow, AR/AP + Summaries (ageing), Sales/Purchase Register, Item-wise registers, Gross Profit, Deferred Rev/Exp, Budget Variance, Customer/Supplier Ledger Summary, Bank Reconciliation Statement, Payment Ledger, Financial Ratios [P2], Consolidated Financial Statements [P2].

### 1.3 Out of scope (ERPNext features we intentionally drop for v1)
Share management, Loyalty programs, Coupon/Promotional schemes, Shipping Rules, South-Africa/India regional VAT doctypes, Cheque Print Template, Payment Gateway accounts, Invoice Discounting (unless required), Cashier Closing (legacy), Ledger Health Monitor, Bisect Accounting tool. Pricing Rules live in the Selling module, not here.

### 1.4 Dependencies on other modules
Customer/Supplier masters, Item master (for invoice lines), Project, Warehouse/Stock (only if `update_stock` invoices are enabled — stock valuation GL entries are Phase-gated), Sales Order / Purchase Order / Delivery Note / Purchase Receipt linkage (billing status updates).

---

## 2. Glossary
| Term | Meaning |
|---|---|
| GLE | General Ledger Entry — one immutable debit or credit line |
| PLE | Payment Ledger Entry — AR/AP sub-ledger row driving outstanding amounts |
| CoA | Chart of Accounts |
| Voucher | Any document that posts to the ledger (invoice, payment, JE, …) |
| Party | Customer, Supplier, Employee, Shareholder — anyone with a receivable/payable relationship |
| Base currency | Company default currency; all GLE `debit/credit` are stored in it |
| Account currency | Currency of the ledger account (may differ from base) |
| Transaction currency | Currency of the source document |
| docstatus | 0 = Draft, 1 = Submitted (posted), 2 = Cancelled |
| Against voucher | The document a payment/credit is allocated against |
| Ageing | Bucketing outstanding amounts by days overdue (default 30/60/90/120) |

---

## 3. Architecture Principles

### AR-1: Draft → Submit → Cancel lifecycle (`docstatus`)
Every voucher has `docstatus`: **0 Draft** (editable, no ledger impact), **1 Submitted** (posts GLEs/PLEs, mostly immutable — only whitelisted fields editable after submit), **2 Cancelled**. Submitting is the ONLY event that writes to the ledger. Amending a cancelled document creates a new document with `amended_from` pointing to the original.

### AR-2: Immutable ledger
GLEs are never edited or deleted. Two supported cancellation strategies (system setting `enable_immutable_ledger`):
- **Legacy mode (default off in ERPNext, choose ONE mode for our system):** on cancel, original GLEs get `is_cancelled = 1` AND mirrored reversal GLEs (debit↔credit swapped) are inserted also with `is_cancelled = 1`, remarks = "On cancellation of {voucher_no}". All reports filter `is_cancelled = 0`, so the voucher net-disappears while full audit history remains.
- **Immutable mode:** originals stay `is_cancelled = 0`; true reversal GLEs are inserted with `is_cancelled = 0` at the **cancellation date** (not the original posting date). Ledger totals stay auditable across closed periods.
**Decision for Positive:** implement the flag with Legacy as default; immutable mode is the compliance option.
- **BR-3.1:** Cancellation must respect the same period locks as posting (frozen date, accounting period, period-closing voucher) validated against the reversal posting date.
- **BR-3.2:** PLEs mirror the same behavior: legacy → original PLE `delinked = 1` + reversal PLE `delinked = 1`; immutable → reversal PLE with `delinked = 0` at cancel date.

### AR-3: Dual ledger
1. **GL Entry** — the accounting truth for every account.
2. **Payment Ledger Entry** — a *derived* AR/AP sub-ledger created automatically from GLEs that hit Receivable/Payable accounts. PLE is the ONLY source for outstanding amounts, AR/AP reports, and reconciliation. Never compute outstanding from GLE directly.

### AR-4: One posting engine
All vouchers build a `gl_map` (list of dicts) and pass it through ONE central function `make_gl_entries(gl_map, cancel, merge_entries, update_outstanding)`. No voucher writes GLE rows directly. The engine pipeline (§6) handles validation, dimension offsetting, cost-center allocation splits, merging, negative flipping, rounding, PLE creation, and persistence.

### AR-5: Tri-currency storage on every GLE
Each GLE stores amounts three ways: base (`debit`/`credit`), account currency (`debit_in_account_currency` / `credit_...`), and transaction currency (`debit_in_transaction_currency` / `credit_...` + `transaction_currency`, `transaction_exchange_rate`). Optional 4th: reporting currency [P2].

### AR-6: Multi-company, single database
Every ledger row, account, cost center, and voucher carries `company`. Accounts and cost centers are company-specific trees. Fiscal Years can be global or restricted to listed companies.

### AR-7: Background-safe heavy operations
Period Closing Voucher, invoice consolidation, auto-reconciliation, deferred accounting, and reposting run as queued background jobs with a `gle_processing_status` (In Progress / Completed / Failed) + stored `error_message`.

### AR-8: Extension hooks
Provide hook points equivalent to ERPNext's: regional GL entries (`make_regional_gl_entries`), custom taxable-base resolvers per custom `charge_type`, and dimension injection into all vouchers.

---

## 4. Master Data Requirements

### 4.1 Company accounting defaults (FR-4.1)
Company record must carry these accounting defaults (used as fallbacks everywhere):
`default_currency`, `default_receivable_account`, `default_payable_account`, `default_income_account`, `default_expense_account`, `default_cash_account`, `default_bank_account`, `round_off_account`, `round_off_cost_center`, `round_off_for_opening_account`, `write_off_account`, `exchange_gain_loss_account`, `unrealized_exchange_gain_loss_account`, `unrealized_profit_loss_account` (internal transfers), `default_discount_account`, `default_advance_received_account` [P2], `default_advance_paid_account` [P2], `default_deferred_revenue_account`, `default_deferred_expense_account`, `default_finance_book`, `cost_center` (default), `default_payment_terms_template`, plus `credit_limit` policy fields.
- **BR-4.1.1:** Any posting that needs a default and finds it unset must fail with a clear message naming the missing Company field.

### 4.2 Fiscal Year (FR-4.2)
| Field | Type | Notes |
|---|---|---|
| year | varchar PK | e.g. "2026" or "2026-2027" |
| year_start_date / year_end_date | date, reqd | ≤ 12 months (`is_short_year` allows shorter) |
| disabled | bool | |
| companies | child table | if empty → global; else restricted |
| auto_created | bool | system may auto-create next FY on rollover |
- **BR-4.2.1:** No overlapping fiscal years for the same company. **BR-4.2.2:** Every GLE must resolve its `fiscal_year` from `posting_date`; posting outside any FY fails.

### 4.3 Account / Chart of Accounts (FR-4.3)
Tree structure using **nested set** (`lft`, `rgt`) + `parent_account` for O(1) subtree aggregation.
| Field | Type | Notes |
|---|---|---|
| account_name | varchar reqd | |
| account_number | varchar | optional numeric code; display "{number} - {name}" |
| company | FK reqd | tree is per company |
| parent_account | FK | reqd unless root |
| is_group | bool | groups cannot receive postings |
| root_type | enum | Asset, Liability, Income, Expense, Equity |
| report_type | enum | Balance Sheet, Profit and Loss (derived from root_type) |
| account_type | enum | Bank, Cash, Receivable, Payable, Tax, Stock, Fixed Asset, Accumulated Depreciation, Depreciation, Expense Account, Income Account, Chargeable, Round Off, Round Off for Opening, Temporary, Equity, Direct/Indirect Income, Direct/Indirect Expense, Cost of Goods Sold, Current Asset/Liability, Capital Work in Progress, Asset Received But Not Billed, Stock Received But Not Billed, Service Received But Not Billed, Stock Adjustment |
| account_currency | FK Currency | defaults to company currency; non-base makes it a "foreign currency account" |
| tax_rate | float | default rate when used in tax rows |
| balance_must_be | enum | '', Debit, Credit — validated on every posting |
| freeze_account | enum Yes/No | Yes → no postings allowed |
| disabled | bool | posting to disabled account fails |
| lft, rgt | int | nested set |
- **BR-4.3.1:** Postings only to leaf (non-group), non-frozen, non-disabled accounts of the same company.
- **BR-4.3.2:** `root_type` fixed once transactions exist; moving an account re-computes lft/rgt.
- **BR-4.3.3:** Receivable/Payable account types REQUIRE `party_type` + `party` on every GLE; all other types must NOT carry a party (except configurable "party_not_required" JEs).
- **BR-4.3.4:** Account currency can only change while balance = 0.
- **FR-4.3.5:** CoA Importer: CSV/XLSX upload with columns (Account Name, Parent Account, Account Number, Is Group, Account Type, Root Type, Currency) + downloadable template + validation preview. Ship 2 seed charts: Standard, Standard with Numbers (localizable AR).

### 4.4 Cost Center + Allocation (FR-4.4)
Cost Center: tree (lft/rgt), per company, `is_group`, `disabled`, `cost_center_number`.
**Cost Center Allocation** (submittable): `main_cost_center`, `valid_from`, child rows `{cost_center, percentage}` summing to exactly 100.
- **BR-4.4.1 (engine behavior, verified in source):** during posting, if a GLE's cost center is a main cost center of an active allocation (latest `valid_from` ≤ posting_date), the engine REPLACES that GLE with N copies — one per child cost center — each amount = original × pct/100, rounded to currency precision. Round-off account rows are not split (assigned to first child). Budget validation runs against the main cost center before the split.
- **BR-4.4.2:** A main cost center with an active allocation cannot be used… actually it CAN be used on transactions (that's the point); it cannot be a child of another allocation (no chains), and allocation children must be leaf cost centers.

### 4.5 Accounting Dimensions (FR-4.5) [P2 mechanism, design DB for it now]
User-defined analytical tags (e.g. Branch, Department) applied across ALL vouchers and GLEs.
- Dimension master: `label`, `fieldname`, `document_type` (source master), `disabled`, per-company defaults child table `{company, default_dimension, mandatory_for_bs, mandatory_for_pl, automatically_post_balancing_accounting_entry, offsetting_account}`.
- **BR-4.5.1:** Creating a dimension adds a nullable column (or JSON key — decide once; ERPNext adds real custom columns; recommend a fixed set of 4 generic dimension columns `dim1..dim4` mapped by config for SQL-Server friendliness) to every voucher table + GL Entry + Budget.
- **BR-4.5.2:** If mandatory_for_bs/pl is set, block posting when the dimension is empty on GLEs whose account report_type matches.
- **BR-4.5.3 (offsetting):** if `automatically_post_balancing_accounting_entry`, the engine appends balancing GLEs against `offsetting_account` so each dimension is internally balanced (verified: debit=credit/N per dimension, party stripped).
- **Accounting Dimension Filter:** per dimension+company: allow/deny lists of accounts vs dimension values; engine validates each GLE against the filter map.

### 4.6 Finance Book (FR-4.6) [P2]
Simple master (`finance_book_name`). GLEs may carry `finance_book`; reports filter by it (or include only entries with empty FB + selected FB). Main use: parallel depreciation books.

### 4.7 Currency & Exchange Rates (FR-4.7)
- Currency master with `fraction_units` (precision) and symbol.
- **Currency Exchange** table: `{date, from_currency, to_currency, exchange_rate, for_buying, for_selling}` manual entries.
- **Currency Exchange Settings:** pluggable rate provider (frankfurter.dev / exchangerate.host / custom endpoint) with request params + result key path; daily fetch job. `allow_stale` + `stale_days` setting: if latest stored rate older than N days and stale not allowed → block transaction until refreshed.
- Rate resolution order for a document: manual rate on doc → latest Currency Exchange on/before date (buying for purchase side, selling for sales side) → provider API → error.
- Pegged currencies [P2]: fixed-rate currency pairs bypassing providers.

### 4.8 Mode of Payment (FR-4.8)
`mode_of_payment`, `type` (Cash | Bank | General | Phone), `enabled`, child `accounts` `{company, default_account}`. Used by POS payments, Payment Entry defaults, payment schedules.

### 4.9 Payment Terms (FR-4.9)
**Payment Term:** `{payment_term_name, invoice_portion %, due_date_based_on (Day(s) after invoice date | Day(s) after the end of the invoice month | Month(s) after the end of the invoice month), credit_days, credit_months, mode_of_payment, discount_type (Percentage|Amount), discount, discount_validity_based_on, discount_validity}` → early-payment discount support.
**Payment Terms Template:** ordered child rows of the above; `allocate_payment_based_on_payment_terms` flag.
- **BR-4.9.1:** On invoice save, if a template is set (doc → party default → company default) and schedule empty → generate `payment_schedule` rows; portions must total 100% and Σ payment_amount = grand_total (rounding delta pushed to last row). Due date of the invoice = max(schedule due dates). Manual schedules allowed when `ignore_default_payment_terms_template`.
- **BR-4.9.2:** Due date cannot precede posting date (configurable bypass per template validation).

### 4.10 Party accounting config (FR-4.10)
- Customer/Supplier carry: child `accounts` `{company, account}` (per-company Receivable/Payable override), `default_currency`, `default_price_list`, `payment_terms_template`, `credit_limit` child `{company, credit_limit, bypass_credit_limit_check}`, `is_internal` + `represents_company` (for inter-company), `is_frozen`, `disabled`, `tax_category`, `tax_withholding_category` (supplier).
- **BR-4.10.1 (party account resolution):** doc-level `debit_to`/`credit_to` → party's per-company account → company default receivable/payable. Resolved account MUST be of matching account_type and company.
- **BR-4.10.2 (party GL currency):** once a party has ledger entries in an account currency, further transactions must use the same party-account currency unless `allow_multi_currency_invoices_against_single_party_account` is on.
- **BR-4.10.3:** Frozen party → only users with the configured Credit Controller role may post. Credit limit check on Sales Invoice/SO submit: outstanding + current > limit → block unless bypass.
- **Party Link (Common Party) [P2]:** link Customer↔Supplier as one legal party; when enabled in settings, invoices auto-create a JE moving the balance to the primary party's account.

### 4.11 Tax masters (FR-4.11) — see §8 for engine
- **Sales Taxes and Charges Template** / **Purchase ... Template**: `{title, company, is_default, disabled, tax_category, taxes[]}`.
- **Item Tax Template:** `{title, company, taxes: [{tax_type(account), tax_rate}]}` + Item/Item Group assignment with validity dates.
- **Tax Category:** plain label linked from templates, parties, addresses, POS profile.
- **Tax Rule:** auto-picks a template by best match: filters (tax_type Sales/Purchase, customer/supplier/group, item/item group, billing & shipping geo fields, tax_category, company, from/to dates) + `priority`; most-specific-then-highest-priority wins. Setting: determine address tax category from Billing vs Shipping address.
- **Tax Withholding Category (TDS/TCS):** rates by fiscal-year window `{from_date,to_date,tax_withholding_rate,single_threshold,cumulative_threshold}`, per-company `accounts`, `tax_deduction_basis` (Gross|Net Total), `tax_on_excess_amount`, `round_off_tax_amount`, disable single/cumulative thresholds flags.

---

## 5. Ledger Data Model (canonical)

### 5.1 GL Entry (table `gl_entry`) — append-only
| Column | Type | Notes |
|---|---|---|
| id / name | PK | |
| posting_date | date, idx | ledger date |
| transaction_date | date | source doc date (optional) |
| fiscal_year | varchar | resolved from posting_date |
| company | FK, idx | |
| account | FK Account, idx | leaf account |
| account_currency | FK Currency | |
| debit, credit | decimal(21,9) | **base currency** |
| debit_in_account_currency, credit_in_account_currency | decimal | account currency |
| transaction_currency | FK | source doc currency |
| transaction_exchange_rate | float | |
| debit_in_transaction_currency, credit_in_transaction_currency | decimal | |
| party_type | varchar | 'Customer','Supplier','Employee',… only for Receivable/Payable accounts |
| party | varchar, idx | |
| against | text | human-readable other side (account/party names) |
| voucher_type | varchar, idx | source doctype |
| voucher_subtype | varchar | e.g. JE voucher_type, Credit Note, Debit Note |
| voucher_no | varchar, idx | source doc id |
| voucher_detail_no | varchar | source child-row id (item/tax/reference row) |
| against_voucher_type, against_voucher | varchar | allocation target (invoice for a payment; return_against for a CN; self for invoice) |
| cost_center | FK, idx | |
| project | FK | |
| finance_book | FK | |
| dim1..dim4 (or dynamic) | FK | accounting dimensions |
| is_opening | enum No/Yes | opening entries excluded from P&L period figures |
| is_advance | enum No/Yes | |
| is_cancelled | bool, idx | see AR-2 |
| due_date | date | copied for AR/AP convenience |
| remarks | text | length-capped via settings |
Composite indexes: (voucher_type, voucher_no), (account, posting_date, company, is_cancelled), (party_type, party, company).

### 5.2 Payment Ledger Entry (table `payment_ledger_entry`) — append-only
| Column | Type | Notes |
|---|---|---|
| posting_date, company, due_date | | |
| account_type | enum Receivable/Payable | |
| account | FK | the AR/AP control account |
| party_type, party | | required |
| voucher_type, voucher_no | | the doc creating this row |
| against_voucher_type, against_voucher_no | | what it is allocated against; **an invoice's own row has against = itself** |
| amount | decimal signed | Receivable: invoice + / payment − ; Payable mirrored. Sign convention: debit to receivable ⇒ +amount; credit ⇒ −amount (reverse for payable). |
| amount_in_account_currency | decimal signed | |
| account_currency | FK | |
| delinked | bool | 1 = neutralized by cancel/unreconcile (legacy mode) |
| cost_center, project, finance_book, voucher_detail_no, remarks | | |
**Derivation rule (BR-5.2.1, from source):** whenever a batch of GLEs is saved (except Period Closing Voucher), every GLE hitting a Receivable/Payable account generates a PLE. `against_voucher` on the GLE becomes PLE.against_voucher_no; if empty, against = own voucher.
**Outstanding of an invoice (BR-5.2.2):** Σ amount of all non-delinked PLEs where against_voucher_no = invoice, in account currency. Invoice fully paid ⇔ outstanding rounds to 0 at currency precision.

### 5.3 Account Closing Balance [perf, P2]
Snapshot per (closing PCV, account, party, cost_center, dims): cumulative debit/credit at period end. Balance-sheet reports for dates after the last closing read: closing snapshot + GLEs after closing date. Setting `ignore_account_closing_balance` bypasses.

---

## 6. Posting Engine (the single pipeline) — FR-6

`make_gl_entries(gl_map, cancel=False, adv_adj=False, merge_entries=True, update_outstanding='Yes')`

**Submit path (cancel = False), in exact order:**
1. **Budget validation** (skip for Period Closing Voucher): evaluate expense GLEs against Budgets (§13) → Stop/Warn/Ignore.
2. **Dimension offsetting entries** (§4.5 BR-4.5.3) appended if configured.
3. **Validate accounting period** (§12): any submitted Accounting Period covering posting_date that closes this voucher_type → throw.
4. **Validate disabled accounts:** any GLE against a disabled account → throw listing accounts.
5. **process_gl_map:**
   a. **Cost-center allocation split** (BR-4.4.1) — skipped for PCV.
   b. **Merge similar entries** (if merge_entries): merge key = (account, cost_center, party, party_type, voucher_detail_no, against_voucher, against_voucher_type, project, finance_book, voucher_no, + all dimension values). Amounts summed across all 3 currencies. Rows may set `_skip_merge`. After merge, drop rows where debit and credit both round to 0 — EXCEPT Exchange Gain Or Loss JEs (kept even at zero).
   c. **Toggle negative:** any negative debit becomes positive credit and vice versa (per currency-triplet). If `post_net_value`, collapse rows having both sides to the net side.
6. **Create PLEs** for the batch (§5.2) — skipped for PCV.
7. **Persist GLEs**; each insert re-validates: account frozen (`freeze_account`), balance_must_be direction (account running balance must keep the required sign), fiscal year contains posting_date, frozen-upto date (postings on/before `accounts_frozen_upto` blocked unless user has the frozen-entries role), against-PCV check (non-opening postings on/before last Period Closing Voucher date are blocked; opening entries exempt; option to ignore for reporting), dimension filters, mandatory dimensions.
8. **Debit=Credit validation:** compute Σdebit−Σcredit at base precision. Allowance: Journal Entry & Payment Entry → 5/10^precision; all other vouchers → 0.5 (absorbable). If |diff| > allowance → throw "Debit and Credit not equal for {voucher} #{no}. Difference is {d}" (exempt: Exchange Gain Or Loss JEs). If 1/10^precision ≤ |diff| ≤ allowance → auto-append **round-off GLE**: account = Company.round_off_account (or `round_off_for_opening` when batch contains opening entries — mandatory then), cost_center = Company.round_off_cost_center, party stripped, transaction-currency diff mirrored. If a row already targets the round-off account, absorb the diff there (drop it if it nets to zero). Re-validate after.

**Cancel path (cancel = True):** `make_reverse_gl_entries` — lock & load original non-cancelled GLEs (SELECT … FOR UPDATE), create reversal PLEs, validate accounting period + freeze + PCV against the **reversal date** (immutable mode: today; legacy: original posting_date), then per AR-2 either flag originals + insert flagged mirrors (legacy) or insert live reversals dated today (immutable). Mirrors swap debit↔credit in all three currencies; remarks "On cancellation of {voucher_no}". `partial_cancel` supports advance-unlink flows: only rows matching (account, party, voucher, against_voucher, voucher_detail_no).

**Repost (FR-6.9) [P2]:** "Repost Accounting Ledger" tool: for allowed voucher types (settings child `repost_allowed_types`), delete-and-recreate or reverse-and-repost that voucher's GLEs/PLEs after account edits on submitted docs (invoices detect edited account fields via `on_update_after_submit` and trigger repost).

---

## 7. Vouchers

### 7.1 Journal Entry (FR-7.1)
Header: `voucher_type` enum: **Journal Entry, Inter Company Journal Entry, Bank Entry, Cash Entry, Credit Card Entry, Debit Note, Credit Note, Contra Entry, Excise Entry, Write Off Entry, Opening Entry, Depreciation Entry, Exchange Rate Revaluation, Exchange Gain Or Loss, Deferred Revenue, Deferred Expense**; `posting_date`, `company`, `finance_book`, `multi_currency`, `is_opening`, `cheque_no/date` (reference no/date — mandatory for Bank Entry), `due_date`, `bill_no/date` (for Debit/Credit Note), write-off block (`write_off_based_on` AR/AP, `write_off_amount`), `tax_withholding_category` + `apply_tds` [P2], `inter_company_journal_entry_reference`, `reversal_of`, totals (`total_debit`, `total_credit`, `difference`), `remark`, `is_system_generated`, `from_template`.
Child **Journal Entry Account** rows: `account` (reqd), auto `account_type`, `account_currency`, `exchange_rate` (editable when multi_currency & foreign account), `debit/credit_in_account_currency` (user input) → computed base `debit/credit`, `party_type/party` (mandatory for Receivable/Payable accounts unless `party_not_required`), `cost_center`, `project`, `is_advance`, `reference_type` (Sales Invoice | Purchase Invoice | Journal Entry | Sales Order | Purchase Order | Expense Claim | Asset | Loan | Payroll Entry | Employee Advance | Exchange Rate Revaluation | Company | Fees | Dunning) + `reference_name` + `reference_due_date` + `reference_detail_no`, `bank_account`, `user_remark`.
Business rules:
- **BR-7.1.1:** Σdebit must equal Σcredit (within JE allowance) before submit; each row has exactly one side.
- **BR-7.1.2:** Rows referencing an invoice reduce that invoice's outstanding via PLE (`against_voucher` = reference). Validate: reference belongs to same company & party, is submitted, not fully paid, and allocation ≤ outstanding. Credit Note JE against Sales Invoice must credit the customer; etc.
- **BR-7.1.3:** Opening Entry sets `is_opening = Yes` on all GLEs; balancing side typically Temporary account.
- **BR-7.1.4:** Multi-currency: exchange_rate per row; base totals must balance; a small residue books to Exchange Gain/Loss automatically via the engine allowance.
- **BR-7.1.5:** Contra = both rows Bank/Cash. Write Off Entry can pull a party's small outstanding invoices and book difference to write-off account.
- **FR-7.1.6:** Journal Entry Template master: preset voucher_type + account list for fast entry.
- **FR-7.1.7:** Inter Company JE: counterpart company selection; "Make Inter Company Entry" creates the mirrored JE in the other company, cross-linked; amounts equal, accounts mapped.
- **Posting map:** exactly what the rows say (this is the raw voucher).

### 7.2 Sales Invoice (FR-7.2)
Key header fields (beyond commerce data): `customer`, `company`, `posting_date/time` + `set_posting_time`, `due_date`, `currency` + `conversion_rate`, `debit_to` (receivable account) + `party_account_currency`, `is_return` + `return_against` + `update_outstanding_for_self`, `is_debit_note`, `is_pos` + `pos_profile` + `payments[]` + `account_for_change_amount` + `change_amount`, `update_stock`, `is_opening`, `is_consolidated`, `is_internal_customer` + `represents_company` + `unrealized_profit_loss_account`, `taxes_and_charges` template + `taxes[]`, `tax_category`, discount block (`apply_discount_on` Grand/Net, `additional_discount_percentage`, `discount_amount`, `additional_discount_account`, `is_cash_or_non_trade_discount`), totals (`total`, `net_total`, `total_taxes_and_charges`, `grand_total`, `rounding_adjustment`, `rounded_total`, `disable_rounded_total`, base_* mirrors, `in_words`), advances (`allocate_advances_automatically`, `only_include_allocated_payments`, `advances[]`, `total_advance`), `outstanding_amount`, write-off (`write_off_amount`, `write_off_account`, `write_off_cost_center`, `write_off_outstanding_amount_automatically`), payment terms (`payment_terms_template`, `payment_schedule[]`, `ignore_default_payment_terms_template`), `status`, `remarks`, `subscription`/`auto_repeat`, `inter_company_invoice_reference`, `apply_tds` (TCS) [P2].
Item rows: `item_code/name/description`, `qty`, `uom` + `conversion_factor` + `stock_qty`, pricing (`price_list_rate`, `margin_type/rate`, `discount_percentage/amount`, `rate`, `amount`, `net_rate`, `net_amount`, base mirrors), `income_account` (reqd), `cost_center` (reqd), `item_tax_template` + `item_tax_rate`, deferred (`enable_deferred_revenue`, `deferred_revenue_account`, `service_start/end/stop_date`), `warehouse` + `expense_account` (stock invoices), `discount_account`, `is_free_item`, SO/DN linkage (`sales_order/so_detail`, `delivery_note/dn_detail`), `project`, asset fields.
Statuses: Draft, Submitted, Paid, Partly Paid, Unpaid, Overdue, Partly Paid and Discounted, Unpaid and Discounted, Overdue and Discounted, Return, Credit Note Issued, Internal Transfer, Consolidated, Cancelled.
- **BR-7.2.1 status calc:** on submit & every payment event: outstanding==0 → Paid; 0<out<grand → Partly Paid; out==grand → Unpaid; Unpaid/Partly + due_date < today → Overdue; is_return → Return; a submitted return exists against it & outstanding covered → Credit Note Issued; internal → Internal Transfer.
- **BR-7.2.2 returns (credit note):** `is_return` flips sign of qty/amounts (stored negative); `return_against` optional (standalone CN allowed); GLEs post reversed; PLE against = return_against (so it offsets the original invoice's outstanding) unless `update_outstanding_for_self`. Return qty per item ≤ billed qty of original.
- **BR-7.2.3 duplicate control:** warn/block same customer + same PO no (configurable); supplier-invoice uniqueness applies on purchase side.
- **BR-7.2.4 credit limit** check per §4.10.
- **BR-7.2.5 rounding:** `rounded_total` = round(grand_total) per currency rounding rule; `rounding_adjustment` = rounded−grand; disable flag per doc or globally.

**Posting map — Sales Invoice (exact GL composition order, from `SalesInvoiceGLComposer`):**
| # | Entry | Debit | Credit | Notes |
|---|---|---|---|---|
| 1 | Customer | `debit_to` (party) = base_rounded_total (or grand) | — | against_voucher = self (or return_against for CN); skipped if total 0 |
| 2 | Taxes | — | each tax row `account_head` = base_tax_amount_after_discount_amount | account-currency aware; negative → auto-flip |
| 3 | Internal transfer | — | `unrealized_profit_loss_account` | only internal customer invoices |
| 4 | Items income | — | item `income_account` per row = base_net_amount | per item; fixed-asset rows post disposal logic instead [P2]; deferred rows post to `deferred_revenue_account` instead of income |
| 5 | Stock (if update_stock) | COGS `expense_account` | Stock/warehouse account | valuation from stock ledger [phase-gated] |
| 6 | Precision loss | round_off account (dr) | — | base_net_total − net_total×rate residue |
| 7 | Discount accounting | `discount_account` dr per item; `additional_discount_account` for doc-level | income side gross | only when discount accounting enabled |
| 8 | Loyalty redemption [OUT of scope v1] | | | |
| 9 | POS payments | each MoP account dr = amount | Customer cr (reduces outstanding) | change amount: cr cash / dr `account_for_change_amount` |
| 10 | Write-off | `write_off_account` dr | Customer cr | |
| 11 | Rounding adjustment | round_off account | Customer | direction by sign of rounding_adjustment |
Merge similar runs before POS rows are added. `against` text = customer; income rows `against` = customer.

### 7.3 Purchase Invoice (FR-7.3)
Mirror of Sales Invoice with these deltas:
- `supplier`, `credit_to` (payable), `bill_no` + `bill_date` (**BR-7.3.1:** uniqueness per supplier+company when `check_supplier_invoice_uniqueness`), `is_paid` + `mode_of_payment` + `cash_bank_account` + `paid_amount` (immediate payment), `on_hold` + `release_date` + `hold_comment` (**BR-7.3.2:** held invoices excluded from Payment Entry pulls & outstanding-to-pay lists until released/date passed), `is_subcontracted`, `apply_tds` + `tax_withholding_category` + TDS child entries, `provisional_expense_account` [P2], `is_internal_supplier`.
- Purchase tax rows add: `category` (Valuation and Total | Valuation | Total), `add_deduct_tax` (Add | Deduct), `allocate_full_amount_to_stock_items`. **BR-7.3.3:** Valuation taxes load into item cost (stock) and do NOT hit the tax account for payable purposes; Deduct subtracts from totals.
- Items carry `expense_account` (reqd; or stock received account when update_stock/PR-linked), `deferred_expense_account` + enable flag, `wip/asset` fields [P2].
**Posting map — Purchase Invoice:**
| # | Debit | Credit |
|---|---|---|
| 1 | — | Supplier `credit_to` = base_rounded_total (against_voucher self) |
| 2 | Item expense/stock/asset accounts = base_net_amount per row | — |
| 3 | Tax rows (Add, category includes Total) account_head dr | Deduct rows cr |
| 4 | Stock received but not billed reconciliation (PR-linked) [phase-gated] | |
| 5 | TDS: — | withholding account cr (reduces supplier payable) — net payable = grand − TDS |
| 6 | is_paid: Supplier dr = paid_amount | cash_bank_account cr |
| 7 | Write-off: Supplier dr | write_off_account cr |
| 8 | Rounding adjustment & precision loss like sales, mirrored |

### 7.4 Payment Entry (FR-7.4)
Header: `payment_type` **Receive | Pay | Internal Transfer**; `party_type/party` (reqd unless internal), `posting_date`, `company`, `mode_of_payment`, `paid_from` + `paid_from_account_currency`, `paid_to` + `paid_to_account_currency`, `paid_amount` + `source_exchange_rate` + `base_paid_amount`, `received_amount` + `target_exchange_rate` + `base_received_amount`, `references[]`, `total_allocated_amount`, `unallocated_amount`, `difference_amount`, `deductions[]` `{account, cost_center, amount, is_exchange_gain_loss}`, `reference_no` + `reference_date` (mandatory for bank-type accounts), `clearance_date` (bank rec), taxes-on-advance [P2] (`purchase/sales_taxes_and_charges_template`, `taxes[]`, after-tax amounts), `apply_tds` [P2], `bank_account`, `party_bank_account`, `payment_order_status`, `is_opening`, `book_advance_payments_in_separate_party_account` [P2], `status` (Draft/Submitted/Cancelled).
Reference rows: `reference_doctype` (Sales Invoice, Purchase Invoice, Sales/Purchase Order, Journal Entry, Dunning, Fees, POS Invoice) + `reference_name`, `due_date`, `bill_no`, `total_amount`, `outstanding_amount`, `allocated_amount`, `exchange_rate` (rate at invoice), `exchange_gain_loss`, `payment_term` (term-level allocation), `account`.
Rules:
- **BR-7.4.1 account semantics:** Receive → paid_from = party receivable, paid_to = bank/cash. Pay → paid_from = bank/cash, paid_to = party payable. Internal Transfer → both company bank/cash accounts (party optional).
- **BR-7.4.2 amounts:** same-currency ⇒ received_amount = paid_amount. Cross-currency uses the two exchange rates; base amounts derived. `unallocated_amount` = whatever of the payment isn't allocated (stays as party advance, `is_advance` GLE). `difference_amount` = base_paid − base_received − Σdeductions; must be zero-able via deductions (typically Exchange Gain/Loss row auto-suggested).
- **BR-7.4.3 allocation validation:** allocated ≤ current outstanding per reference (re-check at submit with latest data — concurrency guard); positive invoices need positive allocation (negatives for returns/CN pulls); order references cap at order advance-eligible amount.
- **BR-7.4.4 exchange gain/loss:** per reference, gain/loss = allocated × (payment rate − invoice rate). Booked EITHER inside this PE's GL (deduction row) or as a separate system JE "Exchange Gain Or Loss" per settings `exchange_gain_loss_posting_date` (Invoice | Payment | Reconciliation date). On unlink/cancel, those JEs auto-cancel/delete.
- **BR-7.4.5 duplicate guard:** same party + same reference_no + same doc pulled twice → warn.
- **BR-7.4.6:** `status` mirrors docstatus; cancellation obeys `unlink_payment_on_cancellation_of_invoice` setting when the referenced invoice is cancelled first.
**Posting map — Payment Entry (Receive):** Dr bank/cash (paid_to) base_received; Cr party receivable (paid_from) one GLE per reference row with against_voucher = reference (base allocated at invoice-rate) + one GLE for unallocated remainder (is_advance = Yes, against self); deductions Dr/Cr by sign; TDS & advance-tax rows [P2]. Pay is the mirror. Internal Transfer: Dr paid_to, Cr paid_from.

### 7.5 Payment lifecycle integrations
- **FR-7.5.1 "Get Outstanding Invoices" dialog:** filter by date range, min/max amount; pulls submitted, unpaid, not-held invoices + unallocated JEs/credit notes for the party (from PLE), plus orders with advances allowed.
- **FR-7.5.2 Payment Request [P2]:** request-to-pay doc (email/gateway) generated from invoice/order, tracks `outstanding` per request; PE references it.
- **FR-7.5.3 Payment Order / Bulk payments [P2].**
- **FR-7.5.4 Auto-set from Mode of Payment:** default account per company.

---

## 8. Tax & Totals Calculation Engine (FR-8) — must match to the cent

One shared calculator used by both invoice types (and orders/quotes later). Execution order:

1. **Item values:** rate resolution (price_list_rate → margin → discount% / discount_amount → `rate`); `amount = rate × qty`; free items amount 0. Base mirrors via `conversion_rate`.
2. **Initialize taxes:** validate rows (`charge_type` required; `row_id` required & < current row for On Previous Row types; account_head required; inclusive not allowed on Actual/On Item Quantity; cost_center default).
3. **Determine exclusive rate (inclusive taxes):** if any row `included_in_print_rate = 1`, back-compute each item's `net_rate/net_amount` from the tax-inclusive rate by iterating rows to get the cumulative inclusive fraction, so that item net + inclusive taxes = entered rate. Non-inclusive rows unaffected.
4. **Net totals:** `net_total = Σ net_amount`; `total = Σ amount`.
5. **Per-row, per-item tax computation** (`charge_type` semantics — verified against source):
   - **Actual:** row's entered `tax_amount` distributed to items proportionally to net_amount (current_tax = item.net × actual / net_total).
   - **On Net Total:** rate% × item.net_amount (uses unrounded net for inclusive rows to avoid double-rounding).
   - **On Previous Row Amount:** rate% × previous row's per-item tax amount (row_id 1-based).
   - **On Previous Row Total:** rate% × previous row's per-item cumulative total (net + taxes up to that row).
   - **On Item Quantity:** rate × qty (fixed amount per unit).
   - **Custom charge types via resolver hook** [P2]: rate% × resolver-provided base.
   - Item Tax Template override: if item's template lists the row's account, the template's rate replaces the row rate for that item; an explicit 0 in template means 0; account absent from template with `add_taxes_from_item_tax_template` behavior per settings. Rate "NOT_APPLICABLE" → skip item.
6. **Row totals:** `tax_amount` = Σ per-item; `total` = running cumulative (net_total + taxes so far). Row-wise rounding optional (`round_row_wise_tax`). Store per-item breakdown in `item_wise_tax_detail` rows `{item_row, tax_row, rate, amount, taxable_amount}` (drives tax breakup print + item-wise registers).
7. **Purchase specifics:** apply `add_deduct_tax` sign; `category` Valuation → excluded from grand total, loaded to item valuation; Valuation and Total → both.
8. **Doc-level discount (`apply_discount_on`):** Net Total → distribute discount into item net amounts pro-rata then recompute taxes; Grand Total → compute `grand_total`, subtract `discount_amount`, then scale non-Actual taxes so the discount effectively spreads across net + taxes (Actual rows untouched); `is_cash_or_non_trade_discount` posts discount to `additional_discount_account` instead of reducing income.
9. **Grand totals:** `grand_total = net_total + Σ taxes (Total categories, after add/deduct)`; inclusive-tax adjustment ensures grand equals Σ item amounts when all taxes inclusive; `rounded_total` per currency rounding (nearest fraction unit; ILS/JOD/USD standard 0.01 — keep rounding rule per currency table); `rounding_adjustment` posted per §7 maps.
10. **Outstanding:** grand (or rounded) − total_advance − paid − write_off, in party-account currency.
- **BR-8.1:** All intermediate math at high precision; only display/storage rounding at defined precisions (amount fields default 2, rates 6, qty 3 — configurable system precisions). Base-vs-doc currency residues route to round-off account (precision-loss entry).
- **BR-8.2 TDS/TCS engine [P2]:** on qualifying purchase invoices/payments: rate from category by posting-date window; basis Gross vs Net; single-transaction threshold and cumulative-per-fiscal-year threshold (sum prior qualifying txns); `tax_on_excess_amount` only taxes above threshold; generates withholding tax row + certificate-number tracking; TCS mirrored on sales.

---

## 9. Multi-Currency (FR-9)
- **FR-9.1:** Document currency free per invoice; `conversion_rate` fetched by §4.7 resolution, editable (unless `maintain_same_internal_transaction_rate` for internal deals).
- **FR-9.2:** Foreign-currency accounts: GLE amounts in account currency must be provided; base = account_amount × exchange_rate. Party-account currency rules per BR-4.10.2.
- **FR-9.3 Exchange gain/loss:** realized per BR-7.4.4; **unrealized** via **Exchange Rate Revaluation**: pick date + accounts → for every foreign-currency account (and party sub-balances) compute new base value at current rate vs booked base; on submit generate JE (voucher_type Exchange Rate Revaluation): Dr/Cr each account (in account currency delta 0, base delta = gain/loss) against `unrealized_exchange_gain_loss_account`. Handles zero-balance-in-foreign / nonzero-base rows via `rounding_loss_allowance` (default 0.05) — differences within allowance go to round-off. Gain/loss booked vs unbooked tracked.
- **FR-9.4 [P2] Reporting currency:** optional 4th amount set on GLE + presentation-currency financial reports (translate at report time).

## 10. Reconciliation & Unreconcile (FR-10)
- **FR-10.1 Payment Reconciliation tool:** inputs (company, party_type, party, receivable/payable account, optional cost_center/project, date & amount filters, row limits). Left: unreconciled payments + credit notes (negative PLE rows not fully allocated). Right: outstanding invoices. User (or auto-matcher) creates allocation rows (payment, invoice, allocated_amount, optional difference account/amount for write-off). On reconcile: for JE-sourced credits → update JE row references; for PE → append/adjust reference rows; engine adjusts PLE `against_voucher_no` accordingly (delink+relink or additive rows), books exchange gain/loss JEs when invoice-rate ≠ payment-rate, and recomputes invoice statuses. Runs in batches (queue size setting) as background job with a Process log doc when auto.
- **FR-10.2 Auto-reconcile [P2]:** scheduled `Process Payment Reconciliation` for configured parties/accounts.
- **FR-10.3 Unreconcile Payment:** pick a payment voucher → select which allocations to break → creates delink adjustments (partial_cancel path) restoring invoice outstanding, cancels linked gain/loss JEs.
- **BR-10.4:** `unlink_payment_on_cancellation_of_invoice` and `unlink_advance_payment_on_cancelation_of_order` settings govern whether cancelling an invoice auto-breaks payment links or blocks cancellation.

## 11. Advances (FR-11)
- **FR-11.1:** Unallocated Payment Entries / JE rows flagged `is_advance` appear in the invoice's **Get Advances** fetch; `allocate_advances_automatically` pulls them FIFO on save. Invoice `advances[]` rows: reference (PE/JE + row), advance_amount, allocated_amount, ref_exchange_rate, exchange_gain_loss.
- **BR-11.2:** On invoice submit, allocated advances immediately reduce outstanding: PLE rows re-pointed from advance(self) to the invoice (delink advance row + create against-invoice row), gain/loss per §9.
- **FR-11.3 [P2] Advances in separate liability/asset account:** `book_advance_payments_in_separate_party_account` — advance posts to Advance Received (liability) / Advance Paid (asset) instead of AR/AP; on allocation, system moves it to AR/AP via partial-cancel + advance GL entries; tracked in `advance_payment_ledger_entry`.

## 12. Period Control (FR-12)
- **FR-12.1 Frozen date:** `accounts_frozen_upto` (settings) blocks any posting/cancel with posting_date ≤ date, except role `frozen_accounts_modifier`.
- **FR-12.2 Accounting Period:** named period (start, end, company) + child `closed_documents` {document_type, closed bool}. Submitted period blocks listed voucher types within range (both posting and cancelling). Overlap of same doc-type periods forbidden.
- **FR-12.3 Period Closing Voucher:** inputs period_start/end (within one FY), company, `closing_account_head` (Retained Earnings, Liability/Equity root). On submit (background job): (a) build closing GLEs transferring every P&L account's period net (per dimensions/cost-center granularity, config) to the closing account — voucher_type = Period Closing Voucher, bypasses PLE; (b) write Account Closing Balance snapshots for ALL accounts (BS accounts cumulative). `gle_processing_status` tracked; failure → status Failed + error. Cancel reverses closing GLEs + deletes snapshots (also queued).
- **BR-12.4:** After a submitted PCV, back-dated non-opening postings ≤ its period_end are blocked (with settings escape hatch for reporting-only `ignore_is_opening_check_for_reporting`). PCVs must be cancelled newest-first.
- **FR-12.5 Fiscal-year rollover:** auto-create next FY (setting), carry nothing physically — opening balances derive from ledger (BS accounts) since P&L was zeroed by PCV.

## 13. Budgets (FR-13)
Budget doc (submittable): against Cost Center | Project [| dimension P2], fiscal-year span, per-account child rows with `budget_amount`, optional `monthly_distribution` (12 percentage rows summing 100) or equal split, applicability toggles + actions (Stop | Warn | Ignore) for: Material Request, Purchase Order, Actual booking; separate annual vs accumulated-monthly checks; cumulative-expense option.
- **BR-13.1 (engine hook):** during posting (§6 step 1), for each expense GLE (net debit) matching a submitted budget's account + against-target: compute already-booked actual (GLE) [+ ordered/requested amounts for PO/MR checks] + current; compare vs annual and vs Σ distribution through posting month; violate → action. Warn posts a message; Stop throws.
- **FR-13.2 Budget Variance report:** monthly columns budget vs actual vs variance per account/target.

## 14. Banking (FR-14)
- Masters: **Bank**, **Bank Account** (company or party accounts; `is_company_account`, linked GL `account`, IBAN/branch, integration id), account type/subtype.
- **Bank Transaction** (submittable feed row): date, bank_account, deposit/withdrawal, currency, description, reference_number, transaction_id (unique per bank), status Pending/Unreconciled/Reconciled/Settled/Cancelled, party guess fields, child `payment_entries` allocations {payment_document, payment_entry, allocated_amount, clearance date effect}, `allocated_amount`/`unallocated_amount`.
- **FR-14.1 Import:** CSV/XLSX statement import with column mapping template per bank + dedupe by transaction_id.
- **FR-14.2 Reconciliation Tool workspace:** filters (bank account, dates); shows unreconciled bank transactions vs candidate system vouchers (Payment Entries, Journal Entries touching the bank GL, Sales Invoice POS payments, Purchase Invoice is_paid) matched by amount/date/reference fuzzy rules (`enable_party_matching`, `enable_fuzzy_matching` settings); actions: match (allocate), create PE/JE from transaction, mark internal transfer (pairing opposite legs within `transfer_match_days`). Allocating sets voucher `clearance_date` = bank transaction date.
- **FR-14.3 Bank Transaction Rules [P2]:** ordered rules (description contains / amount ranges / account) → auto-classify & auto-create vouchers; `automatically_run_rules_on_unreconciled_transactions` toggle.
- **FR-14.4 Bank Clearance (legacy manual):** list bank-account vouchers in range, set clearance dates in bulk.
- **FR-14.5 Bank Reconciliation Statement report:** GL balance vs bank-cleared balance: GL balance + payments not cleared = bank balance breakdown.

## 15. Deferred Revenue & Expense (FR-15) [P2]
Item-level `enable_deferred_revenue/expense` + account + `service_start_date`/`service_end_date` (+ stop). Invoice posts item amount to the deferred balance-sheet account (§7 maps). A monthly job (`Process Deferred Accounting` doc: type, period, company) computes recognized amount per item row = amount × recognized_days(or months per setting `book_deferred_entries_based_on`)/total, already-booked tracked; posts either direct GLEs against the invoice or system JEs (voucher_type Deferred Revenue/Expense) per `book_deferred_entries_via_journal_entry` (+`submit_journal_entries`). Idempotent per period; stop-date halts. Report: Deferred Revenue & Expense (posted vs pending schedule).

## 16. POS (FR-16) [phase-gated]
- **POS Profile** per §schema (payments methods child with default flag, warehouse, price list, accounts, rounding & rate-edit permissions, write_off_limit for small residues).
- **POS Opening Entry:** cashier + profile + opening cash per MoP → required before billing. **POS Invoice:** lightweight sales invoice (same calc engine) held locally, statuses Paid/Consolidated/Return; stock reserved not posted [design decision: we may post immediately instead — decide in phases]. **POS Closing Entry:** period totals per MoP, expected vs counted, difference posting. **Merge Log:** consolidation job groups POS invoices per customer (or group) into consolidated Sales Invoices (+ consolidated credit note for returns) which do the real GL posting; `is_consolidated` marks POS invoices done.
- **Simplification option for Positive:** run POS as `is_pos` Sales Invoices posting directly (skip POS Invoice/consolidation) — keep Opening/Closing for cash control. The BRD supports both; phases pick the simple path first.

## 17. Ancillary vouchers
- **FR-17.1 Dunning [P2]:** per customer, pull overdue invoices (child overdue_payments with interest days), `rate_of_interest` + `dunning_fee` → dunning_amount; statuses Draft/Unresolved/Resolved/Cancelled; on payment through PE (reference Dunning) income posts to `income_account` for fee/interest. Dunning Type master holds default fee/interest + letter text per language.
- **FR-17.2 Subscription [P2]:** party, plans (item+qty+price rule), billing interval, trial, `generate_invoice_at` prepaid/postpaid, days_until_due, follow_calendar_months, tax template, statuses (Trialing/Active/Past Due/Unpaid/Cancelled/Completed); daily job generates draft/submitted invoices per period, links back.
  **[MI-P1] extensions (owner decisions 2026-08-23, tests in
  `subscription-mi-extensions.test.ts`):** subscription plan rows carry
  (a) `firstPeriodOnly` — the row bills only while NO invoice was ever generated for the
  subscription (a DB fact, catch-up-safe; carries the membership `enrollmentFee`), and
  (b) `enableDeferredRevenue` + `deferredAccountId` — passed through to the generated
  `SalesInvoiceItem` with service dates = the billing period bounds, so the §15/[P12.2]
  engine owns recognition. Both default off; existing subscriptions are untouched.
- **FR-17.3 Opening Invoice Creation Tool:** grid (party, temp opening account counterpart, posting date, invoice number, outstanding) → mass-creates `is_opening=Yes` invoices with a single item against **Temporary Opening** account so AR/AP detail migrates with ageing.
- **FR-17.4 Process Statement of Accounts [P2]:** saved config (customers, GL vs AR view, frequency, PDF template, CC) → scheduled email of statements/ageing.
- **FR-17.5 Invoice Discounting [P2], Bank Guarantee [P2], Payment Order [P2].**

## 18. Reports (FR-18) — engine + catalog

### 18.1 Financial statement engine (shared)
Inputs: company (+children for consolidated), FY range or dates, periodicity (Monthly, Quarterly, Half-Yearly, Yearly), `accumulated_values` bool, cost_center/project/dimension/finance_book filters, presentation currency, include-default-FB-entries.
Algorithm (verified): build period list; load account tree (per root_type) ordered by lft; sum GLE (is_cancelled=0) per account per period via range scan on (posting_date) with root lft/rgt filter; **opening** for BS = everything before from_date (+closing-balance snapshot fast path); P&L excludes `is_opening=Yes` rows and (optionally) PCV closing entries; accumulate leaf → parents via tree; drop all-zero rows (toggle); indent by depth; totals row per root; `balance_must_be` drives sign presentation (credit-nature shown positive).
- **Balance Sheet:** Assets / Liabilities / Equity + "Provisional P&L (unclosed FY)" line so it balances pre-PCV; optional debug row Total(Dr−Cr).
- **Profit & Loss:** Income − Expense per period + Net Profit row.
- **Cash Flow:** indirect method from net profit + deltas of mapped BS buckets (default mapper; custom templates [P2]).
- **Trial Balance:** per account: opening dr/cr, period dr/cr, closing dr/cr; option show unclosed-FY opening; must foot to equal debits/credits.
- **Consolidated statements [P2]:** multi-company translate + combine.
- **Custom Financial Statement / Financial Report Template [P2]:** user-defined row formulas over account sets.

### 18.2 Ledger reports
- **General Ledger:** filters (company, dates, account(s) incl. group expansion, voucher, party, cost_center incl. children, project, dimensions, finance_book, group-by: Voucher/Account/Party/none, show opening/closing per group, show cancelled toggle, presentation currency, include dimensions columns). Columns: posting_date, account, debit, credit, balance (running), voucher_type/no link, against, party, remarks. Opening row + Total + Closing per grouping.
- **Trial Balance for Party:** party-wise opening/period/closing within selected AR or AP account type.
- **Payment Ledger report:** raw PLE view for audit.
- **Customer / Supplier Ledger Summary:** opening, invoiced, paid, returned, closing per party.

### 18.3 AR / AP (built on PLE — verified)
Row per outstanding voucher (or per payment-term row when term-allocation enabled): posting_date, due_date, invoice, party (+name), invoiced amount, paid, credit-notes, outstanding, ageing buckets by `ageing_based_on` (Posting | Due | Bill date) with configurable ranges (default 30,60,90,120), future-payments column (post-report-date receipts) [P2], currency (party-account currency + base), sales person/territory (AR), bill_no (AP), delivery-note refs. Summary variants group per party with bucket totals. `range` labels auto (0-30, 31-60, …, 121-Above).

### 18.4 Registers & analysis
Sales Register / Purchase Register (invoice-level, one column per tax account, net/grand/outstanding, mode of payment, dims); Item-wise Sales/Purchase Register (line-level with per-tax columns from item_wise_tax_detail); Gross Profit (per invoice/item/group: selling vs valuation buying cost, profit & %); Sales/Purchase Invoice Trends; Payment Period Based on Invoice Date; Sales Payment Summary; Budget Variance; Deferred schedules; TDS Computation Summary + Tax Withholding Details [P2]; Bank Clearance Summary; Voucher-wise Balance (debug); Invalid Ledger Entries (debug: orphan/imbalanced).

## 19. Settings (Accounts Settings singleton) — implement as feature flags table
Ship with ERPNext-equivalent keys (all listed in §source analysis): frozen date + roles, credit controller role, over_billing_allowance + over-bill role, supplier invoice uniqueness, make_payment_via_journal_entry, unlink flags (invoice/order), delete_linked_ledger_entries (hard-delete GLE on doc delete — dangerous, default off), book_asset_depreciation_entry_automatically [assets], deferred processing (auto flag, via-JE flag, submit-JE flag, Days/Months basis), determine_address_tax_category_from, add_taxes_from_item_tax_template, add_taxes_from_taxes_and_charges_template, show_inclusive_tax_in_print, show_payment_schedule_in_print, show_taxes_as_table_in_print, currency stale (allow + days), automatically_fetch_payment_terms, common party enable, allow_multi_currency_invoices_against_single_party_account, book_tax_discount_loss, merge_similar_account_heads, auto_reconcile (enable, cron trigger minutes, queue size), enable_party_matching + fuzzy, ignore_account_closing_balance, round_row_wise_tax, remarks length caps (GL, AR/AP), enable_immutable_ledger, exchange_gain_loss_posting_date (Invoice|Payment|Reconciliation Date), maintain_same_internal_transaction_rate (+action+override role), enable_common_party_accounting, show_balance_in_coa, default_ageing_range, enable flags: dimensions, subscriptions, loyalty (off), discounts&margin, repost_allowed_types child, pcv job timeout, confirm_before_resetting_posting_date.

## 20. Non-Functional Requirements
- **NFR-1 Integrity:** every submit runs in ONE DB transaction (voucher + GLEs + PLEs + status updates). Debit=credit enforced at engine level. Row locks (`SELECT … FOR UPDATE`) on referenced invoices during payment submit/cancel & on GLE reversal.
- **NFR-2 Precision:** decimal(21,9) storage; currency-precision rounding at boundaries; per-currency fraction units.
- **NFR-3 Performance:** GL posting for a 100-line invoice < 1.5s; AR report for 10k open invoices < 5s (PLE unbuffered-cursor path for huge datasets); BS via closing snapshots for >1M GLE.
- **NFR-4 Audit:** created/modified by+at on all rows; amended_from chains; ledger remarks; optional version log of voucher edits pre-submit.
- **NFR-5 Security/Roles:** role-gated: submit/cancel per voucher, frozen-entries modifier, credit controller, over-billing, repost. Company-level user permissions filter every list/report.
- **NFR-6 i18n:** full AR/EN UI, RTL layouts (Positive design system), Hijri-independent (Gregorian fiscal calendars), Arabic number-to-words for `in_words`.
- **NFR-7 API:** every voucher exposes create/read/submit/cancel endpoints + the dialogs' data endpoints (outstanding invoices, advances, exchange rate, party details, tax template resolve).
- **NFR-8 Idempotent jobs:** deferred posting, subscriptions, auto-reconcile, PCV are re-runnable without duplication (period-keys/status guards).

## 21. Acceptance criteria (samples — full suite in phases file)
- AC-1: Post SINV 1,000 + 16% VAT → GLEs: Dr AR 1,160 / Cr Income 1,000 / Cr VAT 160; PLE +1,160 against self; TB balanced; AR report shows 1,160 outstanding ageing bucket 0-30.
- AC-2: PE Receive 1,160 allocated → invoice status Paid, outstanding 0, PLE −1,160 against invoice; cancel PE → invoice back to Unpaid, PLE reversal rows exist per configured mode.
- AC-3: Multi-currency: invoice USD 100 @3.7, payment @3.6 → exchange loss 10 base booked per settings target; AR in USD shows 0.
- AC-4: Credit Note against invoice reduces the ORIGINAL's outstanding (against_voucher = original) and status → Credit Note Issued when covered.
- AC-5: Inclusive 16% tax, item rate 116 → net 100, tax 16, grand 116 exactly; item-wise breakup matches.
- AC-6: PCV closes FY: P&L accounts zero opening next FY; retained earnings delta = net profit; back-dated JE before PCV blocked.
- AC-7: Budget Stop on cost center blocks an expense JE exceeding accumulated monthly budget.
- AC-8: Cancel invoice in legacy mode → GL report clean; audit query with show-cancelled reveals 2× rows.

## 22. ERPNext parity matrix (traceability)
| ERPNext piece | Our section | Status target |
|---|---|---|
| general_ledger.py pipeline | §6 | Full parity |
| GL Entry / Payment Ledger Entry doctypes | §5 | Full (minus to_rename/reporting-currency [P2]) |
| Account, CoA importer, CC + Allocation | §4.3–4.4 | Full |
| Dimensions + filters + offsetting | §4.5 | Mechanism P2, schema day-1 |
| Journal Entry (all voucher types) | §7.1 | Full |
| Sales / Purchase Invoice + GL composers | §7.2–7.3 | Full (asset & stock-valuation legs phase-gated) |
| Payment Entry + references + gain/loss | §7.4 | Full |
| taxes_and_totals.py | §8 | Full incl. inclusive + item templates |
| Payment Reconciliation / Unreconcile | §10 | Full (auto P2) |
| ERR (revaluation) | §9.3 | Full |
| PCV + Accounting Period + freeze + closing balance | §12 | Full (snapshot P2) |
| Budgets | §13 | Full |
| Banking suite | §14 | Full (rules P2) |
| Deferred, Dunning, Subscription, PSOA, Opening tool | §15,17 | P2 except Opening tool |
| POS suite | §16 | Simplified path first |
| Reports (56) | §18 | 20 core v1, rest P2 |
| Accounts Settings | §19 | Full flag set |
| Dropped: shares, loyalty, coupons, shipping rules, regional | §1.3 | Out |

*End of BRD.*

---

## Appendix A — Canonical Table Inventory (build checklist)
Counts: **68 core** (P0–P11) + 3 optional + **41 extended** (P12) + 4 full-POS optional = **109–116 tables total**. ERPNext's 192 doctypes reduce to this because: child grids are plain tables here, ~49 doctypes are excluded per §1.3, dimensions are fixed columns (`dim1..dim4`), tools (Bank Clearance, Payment Reconciliation screen, CoA Importer) are stateless, and settings are key-value rows. `ALTER` = extend an existing platform table, not a new one.

| Phase | # | Tables |
|---|---|---|
| P0 | 3 | accounts_settings · naming_series · currency — plus ALTER company (accounting-default columns §4.1) |
| P1 | 13 | account · fiscal_year · fiscal_year_company · cost_center · cost_center_allocation · cost_center_allocation_percentage · mode_of_payment · mode_of_payment_account · currency_exchange · currency_exchange_settings · accounting_dimension · accounting_dimension_detail · finance_book |
| P2 | 5 | **gl_entry** · journal_entry · journal_entry_account · journal_entry_template · journal_entry_template_account |
| P3 | 6 | **payment_ledger_entry** · party_account · party_credit_limit · payment_term · payment_terms_template · payment_terms_template_detail — plus ALTER customer/supplier (§4.10 fields) |
| P4 | 9 | sales_taxes_and_charges_template · sales_taxes_and_charges · purchase_taxes_and_charges_template · purchase_taxes_and_charges · item_tax_template · item_tax_template_detail · tax_category · tax_rule · item_wise_tax_detail |
| P5 | 5 | sales_invoice · sales_invoice_item · payment_schedule (shared child) · sales_invoice_advance · sales_invoice_payment |
| P6 | 3 | purchase_invoice · purchase_invoice_item · purchase_invoice_advance |
| P7 | 5 | payment_entry · payment_entry_reference · payment_entry_deduction · unreconcile_payment · unreconcile_payment_entries |
| P8 | 2 | exchange_rate_revaluation · exchange_rate_revaluation_account |
| P9 | 0 | — (reports are read-only over gl_entry / payment_ledger_entry) |
| P10 | 10 | accounting_period · closed_document · period_closing_voucher · account_closing_balance · budget · budget_account · budget_distribution · accounting_dimension_filter · dimension_filter_allowed_value · dimension_filter_account |
| P11 | 7 (+3) | bank · bank_account · bank_account_type · bank_transaction · bank_transaction_payments · bank_statement_mapping · bank_statement_import_log — optional rules pack: bank_transaction_rule · bank_transaction_rule_account · bank_transaction_rule_condition |
| **Core total** | **68 (+3)** | |
| P12 | 41 (+4) | process_deferred_accounting · dunning · overdue_payment · dunning_type · dunning_letter_text · subscription · subscription_plan · subscription_plan_detail · subscription_invoice · advance_payment_ledger_entry · advance_taxes_and_charges · tax_withholding_category · tax_withholding_rate · tax_withholding_account · tax_withholding_entry · tax_withholding_group · pos_profile · pos_payment_method · pos_profile_user · pos_opening_entry · pos_opening_entry_detail · pos_closing_entry · pos_closing_entry_detail · pos_closing_entry_taxes · payment_request · payment_order · payment_order_reference · repost_accounting_ledger · repost_accounting_ledger_items · ledger_merge · ledger_merge_accounts · process_statement_of_accounts · psoa_customer · psoa_cost_center · psoa_project · process_payment_reconciliation · payment_reconciliation_log · payment_reconciliation_log_allocation · party_link · opening_invoice_creation_tool · opening_invoice_creation_tool_item — full-POS optional: pos_invoice · pos_invoice_item · pos_invoice_reference · pos_invoice_merge_log |
| **Grand total** | **109 (–116)** | |

Coverage vs ERPNext: ~143 of 192 doctypes mapped into the above (core or [P2]); ~49 excluded by declared decision (§1.3): shares (4), loyalty (4), coupons/promotional schemes (4), pricing rules + applicability children (11 → Selling module), shipping rules (3), regional (1), gateway/cheque-print (2), invoice discounting (2), cashier closing (2), diagnostics — ledger health, bisect, transaction deletion (6), custom financial report builder (2), pegged currencies (2), POS misc config (3), bank clearance & guarantee (3).
