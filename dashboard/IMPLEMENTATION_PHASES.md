# Implementation Phases — Accounting Module (ERPNext-Parity)

> ## ⏸️ PAUSED — 2026-08-20
>
> Work stopped at `51245e0` on `claude/accounting-module-kickoff-rigti8`, by owner
> request, to start another task. **Phases 0→12B done; 12C, the tail of 12, and 13
> remain — nine open items, only two of them unblocked.**
>
> **`docs/planning/accounting-module-handover.md` is the entry point**: state, what is
> and is not CI-verified, why PR #101 is a draft, and the resume order.
>
> The single blocker above all others: **GitHub Actions is blocked on billing**, so no
> work after the Phase-12B exit has any CI evidence.

Companion to `BRD_Accounting_Module.md`. All `FR/BR/NFR/§` references point there.

## How the AI agent must work with this file
1. Execute phases **in order**; do not start a phase before its dependencies' exit criteria pass.
2. Every task is agent-sized (one PR). Format: `[P{phase}.{n}]`. Reference the BRD sections listed under *Scope*.
3. **UI rule:** build every screen with the Positive design system components/tokens. This file only defines screens' fields, actions, and states — never styling.
4. **Definition of Done per task:** code + migration + API + unit tests + the phase's acceptance checks touching that task pass + seeded demo data updated.
5. Ledger safety invariant (never break, any phase): a submitted voucher's Σdebit = Σcredit; drafts never touch `gl_entry`/`payment_ledger_entry`; cancels only append (per BRD AR-2 mode).
6. Naming: DB `snake_case`; voucher numbers by naming series `{prefix}-{YYYY}-{#####}` per company (e.g. `JV-2026-00001`, `SINV-`, `PINV-`, `PAY-`, `PCV-`).

## Dependency graph
```
P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9 → P10 → P11 → P12 → P13
                >         (P5,P6 can run in parallel after P4)
```
Milestones: **M1 "Books open"** = end P2 · **M2 "Invoice-to-cash"** = end P7 · **M3 "Full financials"** = end P10 · **M4 "Parity"** = end P12.

---

## Phase 0 — Platform Foundations
**Goal:** the skeleton every voucher relies on. **Scope:** BRD §3 (AR-1..AR-8), §19, NFR-1/4/5.
**Tasks**
- [P0.1] Core tables: `company` accounting-default columns (§4.1), `currency` (+fraction_units), `naming_series` counters per (doctype, company, year).
- [P0.2] `docstatus` framework: base voucher behavior draft/submit/cancel/amend (`amended_from`), submit hooks pipeline, single-transaction guarantee (NFR-1), audit columns everywhere.
- [P0.3] Roles & permissions matrix: per-doctype read/write/submit/cancel + special roles placeholders (frozen-modifier, credit controller, over-billing, repost).
- [P0.4] Settings service: `accounts_settings` key-value (typed) with ALL §19 keys seeded to defaults; admin screen (grouped toggles).
- [P0.5] Background-job runner + `job_status` pattern (In Progress/Completed/Failed + error_message) per AR-7.
- [P0.6] Number-to-words (EN + AR) utility; currency formatting per precision.
**Screens:** Settings page; generic list-view + form-view shells with Draft/Submitted/Cancelled badges and Submit/Cancel/Amend actions.
**Exit:** create→submit→cancel→amend works on a dummy voucher with full audit trail; settings persist; a queued job reports status.

## Phase 1 — Chart of Accounts & Structural Masters
**Goal:** all §4 masters except taxes & parties. **Scope:** §4.2–4.8. **Depends:** P0.
**Tasks**
- [P1.1] `account` table + nested-set service (insert/move/delete recompute lft,rgt) + all BR-4.3.x validations.
- [P1.2] CoA tree screen: expandable tree, add child/sibling, edit, disable, drag-move (group-only targets), balance column behind `show_balance_in_coa` (wired later in P2).
- [P1.3] CoA Importer (FR-4.3.5): template download, upload, dry-run diff preview, commit; seed charts (Standard, Standard with Numbers, Arabic labels file).
- [P1.4] `fiscal_year` + company link + overlap validation + resolver `get_fiscal_year(date, company)` + auto-create-next job stub.
- [P1.5] `cost_center` tree (reuse nested-set service) + screen.
- [P1.6] `cost_center_allocation` (submittable, 100% validation, valid_from versioning) — engine hook lands in P2.
- [P1.7] `mode_of_payment` + per-company default accounts.
- [P1.8] Currency Exchange manual table + rate resolver (manual → stored → provider stub) + stale-rate guard (§4.7).
- [P1.9] Schema-only: `dim1..dim4` columns + dimension config master (§4.5) — validation logic deferred to P10.
- [P1.10] Finance Book master [flag off].
**Tests:** tree ops keep lft/rgt consistent under 1k accounts; importer round-trips seed chart; FY resolver edge dates.
**Exit:** a company can be fully configured: chart imported, FY 2026 open, cost centers ready.

## Phase 2 — GL Engine + Journal Entry + First Reports  → **M1**
**Goal:** money moves. **Scope:** §5.1, §6 (full pipeline minus PLE/budget/dimension hooks), §7.1, §18.2 (GL, simple TB), FR-12.1 freeze.
**Tasks**
- [P2.1] `gl_entry` table + indexes exactly per §5.1 (PLE columns included but unused).
- [P2.2] `make_gl_entries` pipeline: steps 3,4,5(b,c),7,8 of §6 — accounting-period & budget hooks stubbed, cost-center-allocation split (5a) included, merge-similar with §6 merge-key, negative toggle, debit=credit allowance table, auto round-off GLE (incl. opening-account branch), per-insert validations (frozen account, balance_must_be, FY, frozen-upto date).
- [P2.3] Cancellation engine `make_reverse_gl_entries`: BOTH modes behind `enable_immutable_ledger` (BRD AR-2), row-locking, partial_cancel signature ready.
- [P2.4] Journal Entry doc (§7.1): full field set, child rows, all 16 voucher_type behaviors that don't need parties/invoices yet (Bank/Cash/Contra/Opening/plain JE), multi-currency rows OFF until P8 (hide flag), templates (FR-7.1.6).
- [P2.5] JE screen: grid entry with account typeahead, per-row Dr/Cr, live totals + difference, quick-balance button, cheque/reference block, remarks.
- [P2.6] **General Ledger report** (§18.2): all filters that exist so far, grouping, running balance, opening/closing rows, show-cancelled toggle, export.
- [P2.7] **Trial Balance (simple)**: opening/period/closing per account, foots equal.
- [P2.8] Frozen-upto setting enforcement + role bypass (FR-12.1).
**Acceptance:** AC-8; JE 3-line entry posts & cancels correctly in both ledger modes; GL running balance matches TB; round-off auto-line appears on a crafted 0.004 diff.
**Exit:** an accountant can keep complete books using JEs alone.

## Phase 3 — Parties, Payment Ledger & Receivable/Payable Core
**Goal:** who owes whom. **Scope:** §4.10, §5.2, JE party rules (BR-7.1.2 partially), §18.2 Trial Balance for Party.
**Tasks**
- [P3.1] Party accounting fields on Customer/Supplier (per-company account, currency, terms template link, credit limit child, frozen/disabled, internal flags) + resolution service BR-4.10.1/2/3.
- [P3.2] `payment_ledger_entry` table + derivation inside the engine (§5.2 BR-5.2.1) incl. cancel/delink behavior for both ledger modes; `update_voucher_outstanding` service (BR-5.2.2).
- [P3.3] Enforce BR-4.3.3 (party mandatory on AR/AP accounts) across the engine + JE UI (party fields appear when account_type is Receivable/Payable).
- [P3.4] JE references to vouchers: `reference_type/name` plumbing + validation shell (targets arrive in P5/P6); against_voucher wiring into GLE/PLE.
- [P3.5] Payment Terms + Templates masters (§4.9) + due-date calculator (all 3 bases + months) + early-discount fields.
- [P3.6] Reports: **Trial Balance for Party**, **Payment Ledger (audit)**.
**Tests:** posting to Receivable without party throws; PLE signs per convention (unit matrix Receivable/Payable × Dr/Cr); outstanding of a party JE = its PLE sum.
**Exit:** party balances queryable & auditable before invoices exist.

## Phase 4 — Tax & Totals Engine (headless)
**Goal:** the calculator, fully tested standalone. **Scope:** §8 (steps 1–9), §4.11 masters, BR-8.1.
**Tasks**
- [P4.1] Masters: Sales/Purchase Taxes & Charges Templates (+child rows per BRD schemas incl. purchase category/add_deduct), Item Tax Template + item/group assignment, Tax Category, Tax Rule with best-match resolver (+priority, geo fields optional v1).
- [P4.2] Calculator service `calculate(doc)` implementing §8 order: item values → inclusive back-computation → all 5 charge types (+row_id validation) → item-tax-template overrides → purchase add/deduct & valuation categories → doc-level discount both modes (Net redistribute / Grand scale, Actual rows untouched) → grand/rounded/rounding_adjustment → `item_wise_tax_detail` rows.
- [P4.3] Golden-file test suite: ≥40 fixtures (exclusive, inclusive, mixed, previous-row chains, per-qty, actual-distribution, item template override incl. explicit-0, discount on net vs grand, purchase deduct, rounding edge .005, zero-tax) — each asserts every intermediate field to 1e-9 vs expected JSON. **This suite gates P5/P6.**
- [P4.4] Tax template admin screens + "preview calc" sandbox screen (paste items → see full breakdown) for QA.
**Exit:** calculator is provably ERPNext-equivalent on the fixture set.

## Phase 5 — Sales Invoice (incl. Credit Notes)
**Goal:** revenue. **Scope:** §7.2 full (POS legs stubbed, stock legs stubbed), §4.9 BR-4.9.1 schedule generation, §11 advances placeholders, §18.4 Sales Register.
**Tasks**
- [P5.1] `sales_invoice` + items + taxes + payment_schedule + advances tables per §7.2 schemas; naming series; statuses enum.
- [P5.2] Validations: BR-7.2.2..7.2.5, party frozen/credit-limit, due-date rules, item account/cost-center mandatory, opening-invoice rules (`is_opening` → against Temporary Opening, no taxes… allow taxes but recommend not).
- [P5.3] GL composer per the §7.2 posting-map order rows 1,2,4,6,7,10,11 (skip 3 internal until P12? — no: implement 3 too, it's cheap; skip 5 stock, 8 loyalty, 9 POS).
- [P5.4] Payment schedule auto-generation (BR-4.9.1) + due_date derivation; print flag hooks.
- [P5.5] Status engine (BR-7.2.1) + outstanding recompute subscription on PLE changes.
- [P5.6] Credit Note flow: "Create Return" action pre-fills negated copy, `return_against`, qty caps, against_voucher targeting, status propagation to original.
- [P5.7] Screens: invoice form (customer header, item grid with rate/discount/tax-template, taxes panel with add-row + template apply, discount block, totals card, schedule tab, advances tab placeholder, status ribbon), list with status filters, "Get Items from Sales Order" hook stub.
- [P5.8] Reports: **Sales Register**, **Item-wise Sales Register** (uses item_wise_tax_detail columns).
- [P5.9] Print: tax-invoice layout (AR/EN, RTL) with inclusive-tax display flag + schedule + in_words.
**Acceptance:** AC-1, AC-4, AC-5.
**Exit:** quote-to-invoice booking works; CN offsets original; registers reconcile with GL income+tax accounts.

## Phase 6 — Purchase Invoice (incl. Debit Notes)
**Goal:** spend. **Scope:** §7.3, TDS stub, Purchase Register.
**Tasks**
- [P6.1] Tables per §7.3 (bill_no/date, hold block, is_paid block); supplier-invoice uniqueness (BR-7.3.1).
- [P6.2] GL composer rows 1,2,3,6,7,8 of the §7.3 map (+ is_paid immediate-payment leg 6); valuation-category behavior stubbed to "Total" until stock phase.
- [P6.3] Hold/release logic + exclusion from payable pulls (BR-7.3.2).
- [P6.4] Debit Note (return) mirror of P5.6.
- [P6.5] Screens: PI form (supplier header, bill ref block prominent, hold banner, item grid with expense account), list; **Purchase Register + Item-wise**.
**Exit:** AP mirrors AR; uniqueness & hold verified.

## Phase 7 — Payment Entry, Advances & Reconciliation  → **M2**
**Goal:** cash in/out and matching. **Scope:** §7.4, §7.5.1, §10.1/10.3 (manual), §11.1–11.2, BR-10.4.
**Tasks**
- [P7.1] `payment_entry` + references + deductions tables; type semantics BR-7.4.1; MoP account defaulting.
- [P7.2] "Get Outstanding" service (FR-7.5.1) reading PLE (invoices, unallocated credits, JE rows), hold-aware, currency-aware.
- [P7.3] Allocation math: BR-7.4.2/3 incl. re-validation at submit with row locks; unallocated remainder → advance GLE (is_advance).
- [P7.4] GL map per §7.4 (same-currency first; multi-currency legs activate in P8), deductions rows, PLE per reference.
- [P7.5] Invoice-side advances: fetch + auto-allocate FIFO + BR-11.2 relink on submit.
- [P7.6] Payment Reconciliation screen (FR-10.1): two-pane fetch, manual allocate rows, difference write-off row, reconcile action updating JE/PE references + PLE; batched commits.
- [P7.7] Unreconcile tool (FR-10.3) using partial_cancel path.
- [P7.8] Cancellation interlocks per BR-10.4 settings; status recompute cascade.
- [P7.9] Reports: **Payment Period Based on Invoice Date**, **Sales Payment Summary**.
**Acceptance:** AC-2; advance received → invoice → auto-allocation → Paid; reconcile a JE credit note against 3 invoices; unreconcile restores outstanding exactly.
**Exit:** full invoice-to-cash and procure-to-pay loops close.

## Phase 8 — Multi-Currency & Revaluation
**Goal:** foreign currency correct to the agora. **Scope:** §9, BR-7.4.4, BR-4.10.2, FR-9.3.
**Tasks**
- [P8.0] Audit-first (P8 dossier risk 1, owner-approved at M2): FX-proportional PLE slice math in the BR-11.2 relink — consumption in account currency, base column derived via `splitPleSlice` with exact-remainder discipline; unreconcile/interlock movers verified whole-row-safe (no change needed); pure split suite + FX-shaped DB regression.
- [P8.1] Foreign-currency accounts end-to-end: JE multi_currency rows (per-row exchange_rate, account-currency amounts), invoice `conversion_rate` + party-account-currency invoices, engine tri-currency persistence audit.
- [P8.2] Payment Entry cross-currency: dual rates, base derivations, per-reference `exchange_gain_loss`, auto-suggested gain/loss deduction row, settings-driven posting target & date (`exchange_gain_loss_posting_date`), system "Exchange Gain Or Loss" JEs + their auto-cancel on unlink (§10 hooks).
- [P8.3] Party GL-currency guard (BR-4.10.2) + multi-currency-against-single-account setting.
- [P8.4] Exchange Rate Revaluation doc (FR-9.3): account scan (incl. party sub-balances), new-rate editing, gain_loss booked/unbooked, JE generation, `rounding_loss_allowance` handling, zero-foreign/nonzero-base sweep rows.
- [P8.5] Rate provider integration (frankfurter-style) + daily fetch job + stale enforcement live.
**Acceptance:** AC-3; ERR on USD receivable moves unrealized G/L; realized on payment reverses unrealized correctly (documented pattern).
**Exit:** USD/ILS/JOD books reconcile in both currencies.

## Phase 9 — Financial Reporting Engine  → prerequisites for **M3**
**Goal:** the statements. **Scope:** §18.1, §18.3, §18.2 remainder, §18.4 remainder.
**Tasks**
- [P9.0] Pre-M3 hardening (pre-M3 audit F4/F5, owner-scheduled at the M2 gate): direct amend/update-after-submit suites for Sales Invoice, Purchase Invoice and Payment Entry (cancel→amend→submit round-trips asserting cloned child rows, recomputed totals, GL parity, amendedFrom chain); test suites for the register/report services (sales register, purchase register, payment reports — pivots, totals, item-wise sums). These vouchers and reports are what the P9 engine builds on.
- [P9.1] Shared statement engine: period-list builder (4 periodicities, FY-aware), tree aggregation via lft/rgt, opening logic (BS: pre-range; P&L: exclude is_opening + optional PCV-closing exclusion), accumulated_values mode, zero-row filter, depth indent, per-root totals, presentation of credit-nature accounts.
- [P9.2] **Balance Sheet** (+ provisional-profit line), **Profit & Loss**, **Cash Flow** (indirect, default bucket mapping), **Trial Balance** upgraded onto the engine.
- [P9.3] **Accounts Receivable / Payable + Summary** on PLE per §18.3: bucket engine (configurable ranges, based-on selector), credit-note & payment columns, party-currency + base columns, term-level rows behind template flag [P2 subfeature], drill-through to GL.
- [P9.4] **Customer / Supplier Ledger Summary**, **Gross Profit** (valuation source = purchase rate until stock module; pluggable), **Sales/Purchase Invoice Trends**, **Voucher-wise Balance + Invalid Ledger Entries** (debug pair).
- [P9.5] Report platform features: column presets, export XLSX/PDF, saved filters, scheduled email hook [P2].
**Acceptance:** BS balances every day of demo dataset; P&L + BS tie to TB; AR total = Σ open PLE; ageing buckets sum to outstanding.
**Exit:** monthly close pack producible.

## Phase 10 — Period Control, Budgets & Dimensions  → **M3**
**Goal:** governance. **Scope:** §12 full, §13, §4.5 activation.
**Tasks**
- [P10.1] Accounting Period + closed-doc-types enforcement in engine step 3 (post & cancel paths).
- [P10.2] Period Closing Voucher: background build of closing GLEs per §12.3 (dimension/CC granularity flag), status tracking, cancel-newest-first guard, BR-12.4 back-posting block; Account Closing Balance snapshots + BS fast-path + ignore setting.
- [P10.3] Budget doc + distribution + BudgetValidation hook in engine step 1 (annual & accumulated-monthly, three actions, MR/PO applicability points exposed as service for other modules) + **Budget Variance report**.
- [P10.4] Accounting Dimensions activation: config-driven labels for dim1..dim4, per-company defaults, BS/PL mandatory enforcement, Dimension Filter validation map, offsetting balancing entries (BR-4.5.3), dimension columns in GL/TB/statement filters + **Dimension-wise Accounts Balance** report.
- [P10.5] Fiscal-year auto-rollover job live.
**Acceptance:** AC-6, AC-7; dimension-mandatory blocks a P&L JE missing Branch; PCV cancel restores P&L.
**Exit:** a full fiscal year opens, runs, closes, reopens next year cleanly — verified against a SEEDED scenario (M3-gate rule, owner 2026-08-15: milestone-gate walkthrough data is seeded, not hand-entered, so cross-checks test real figures).

## Phase 11 — Banking
**Goal:** bank truth = book truth. **Scope:** §14.
**Tasks**
- [P11.1] Bank, Bank Account (+type/subtype), link to GL accounts; clearance_date columns live on PE/JE.
- [P11.2] Bank Transaction doc + statement import (mapping template per bank, dedupe) — support the common Palestinian bank CSV/XLSX layouts as first mappings.
- [P11.3] Reconciliation workspace: unmatched list, candidate matcher (amount/date/reference; party & fuzzy flags), actions match/allocate, create-PE, create-JE (charges), internal-transfer pairing within `transfer_match_days`; allocation writes clearance dates + transaction status flow Pending→Unreconciled→Reconciled.
- [P11.4] **Bank Reconciliation Statement** + **Bank Clearance Summary** reports; manual Bank Clearance screen.
- [P11.5] Bank Transaction Rules engine [flagged].
- [P11.6] «شاشات الحوكمة» (M3-gate follow-up, owner 2026-08-15): screens for الفترات المحاسبية · إقفال الفترة (PCV create/run/monitor with job status + cancel) · الموازنات · إعدادات الأبعاد (incl. the enable_accounting_dimensions flag — dimension config was API-only after P10.4). Rationale: banking outranks a once-a-year close, but dogfooding needs a PCV screen before launch.
**Acceptance:** import 100-row statement, auto-match ≥ the exact-amount subset, reconcile to zero unmatched; BRS explains GL vs bank delta.
**Exit:** daily bank rec ≤ minutes.

## Phase 12A — Dogfooding Gate (**Bucket A, part 1 of 2**, owner 2026-08-15)
**Goal:** make internal dogfooding (Positive Solutions' own books) and the external clinic
pilot technically possible. Ordered: A1 → A4. CI-accepted with a lighter pass EXCEPT
[P12A.2] — its zero-diff reports get the owner's full manual review before merge.
- [P12A.1] Opening Invoice Creation Tool (FR-17.3) + opening-balance flow + migration
  guide ([P12.1] pulled forward — no migration without it).
- [P12A.2] **C3 posting adapters** (the first-class task contract §C3 always implied but
  never scheduled): clinic Invoice + Expense post into the ledger through a SHARED
  source-module adapter interface (POS pluggable later without reshaping the first two).
  Additive & reversible: operational modules untouched, adapter posts alongside, one
  kill-switch flag per adapter (names logged in contract §8). **The parallel-run
  ZERO-DIFF reconciliation report is the deliverable**, proven on the seeded scenario AND
  a generated realistic-volume dataset (~1 year: thousands of clinic invoices across 12
  months with mixed paid/partial/unpaid/cancelled/refunded statuses, expenses, multiple
  owners) via a DEV-ONLY generator script re-runnable at any volume — never wired into
  the normal demo seed.
- [P12A.3] Bank Transaction Rules management screen behind `enable_bank_transaction_rules`
  + a seeded demo rule matching «رسوم» so the auto-close path is demonstrable (P11 gap 1).
- [P12A.4] PE-from-transaction workspace button + party picker (P11 gap 2, PR #95 D5).
**Acceptance:** rule-10 trio; both adapters' reports show ZERO diff on both datasets;
the rules flag is exercisable end-to-end on screen; a bank row books to a party PE from
the workspace.
**Exit:** Positive Solutions can keep its own books on the module; an external clinic's
operational activity reaches the ledger behind flags. Buckets B/C (owner 2026-08-15):
B = P12.4 POS · P12.2 deferred · P12.3 TDS · P12.5 subscription/auto-repeat (dunning→C) ·
P12.7 · P12.9 repost · P12.11; C = P12.8 · P12.6 · P12.10 · ledger merge · offline POS.

## Phase 12B — Revenue integrity: reversal, POS tax, POS posting (**Bucket A, part 2 of 2**)
**Settled by the owner 2026-08-15:** (a) POS usage today is **zero** — no production data
exists anywhere, no seed creates a `Sale`, so there is no hotfix and no wrong-rate
disclosure question; (b) **counter-selling IS in scope** — the POS ships in the product, so
any clinic can use it and the ledger must not omit counter revenue → the POS pack is
**Bucket A**; (c) **COGS is Bucket A** — honest margins from day one, and it must survive
the return path (a returned item reverses revenue AND cost).
**Execution order:** [P12B.1]+[P12B.2] (reversal pair) → [P12B.3] (POS through the P4
engine) → [P12B.5] (COGS) → [P12B.4] (POS adapter + zero-diff report) → [P12B.6] (tests +
seed). Everything in Phase 12 below is Bucket B/C.
**Context (owner, 2026-08-15):** the app already HAS a POS — `src/server/sales/` (`Sale` +
`SaleItem`), cashier UI as a tab inside Inventory. A POS sale is a SEPARATE document: it
never creates an `Invoice`, so the P12A adapters cover **zero counter revenue**. Three
defects make POS unpostable as-is, and one of them (tax) is a live correctness risk.

- [P12B.1] ✅ **Refund/credit path for PAID clinic invoices + adapter reversal** (contract
  KL-4). (owner
  directive 2026-08-15, contract KL-4 — the P12A review found a paid clinic invoice can
  never be reversed: the operational module rightly refuses to VOID a paid invoice, and
  that is the only state the adapter's reversal recognises, so wrong revenue stays in the
  ledger forever). Operational side: a refund/credit action on a paid invoice that
  REVERSES rather than erases (the ledger already carries it), with its own screen,
  permission and state. Accounting side: the `clinic_invoice` adapter recognises that
  state and posts an AR-2 append reversal — same semantics already proven for expenses
  (nets to zero, nothing deleted, report re-zeroes). Placed at the head of 12B rather than
  the tail of 12A because it changes operational-module behaviour, not just accounting.
  **Acceptance:** through the UI — pay an invoice, refund it, run the adapter, watch the
  zero-diff report return to 0 with the reversal named.

- [P12B.2] ✅ **POS return/refund state** — `SaleStatus` is `PENDING|PAID` only: no void, no
  refund, no return route, no restock; a mis-keyed PAID sale is terminal and immutable
  through the API. Add the reversing state (+ restock) so the adapter has a trigger. Ships
  WITH [P12B.1]: they are one problem — "a revenue document that cannot be reversed" —
  wearing two hats, and solving them separately would duplicate the design twice.
- [P12B.3] ✅ **POS priced and taxed through the P4 engine** (owner directive 2026-08-15 —
  supersedes any per-rate patch). Today POS does its own arithmetic in `sales.dao.ts`
  (`taxAmount = discounted * taxRate / 100`) against a rate hardcoded in **FOUR** unlinked
  places (the audit said three and missed one): `Sale.taxRate @default(15)` (schema),
  `args.taxRate ?? 15` (dao), `taxRate: z.coerce.number().default(15)` (create schema) and
  `const TAX_RATE = 15` (`cart-panel.tsx`) — plus a literal «(15%)» in the cart's summary
  label. And the create endpoint TRUSTED the browser's rate, so any client could sell at 0%. A single blended rate can never be right for a
  mixed basket, and the rate is a per-clinic, per-jurisdiction setting the clinic owns.
  Scope: (a) POS builds a `CalcDoc` and calls the SAME `calculate()` §8 engine the sales
  invoice uses (`src/server/accounting/tax/tax-calculator.ts`, guarded by the P4 45-fixture
  suite) via a POS wrapper mirroring `sales-invoice.calc.ts`; (b) the clinic's default
  Sales Taxes & Charges template supplies the tax rows, with **Item Tax Template overriding
  per item** so exempt/zero-rated lines are correct; (c) inclusive-vs-exclusive follows the
  TEMPLATE, never a UI assumption; (d) all three constants are DELETED — an unconfigured
  rate is a setup error surfaced to the user, never a silent default — **the sale is
  REFUSED when no template is configured** (absorbed from the former [P12B.0]: routing
  through the P4 engine deletes the three constants by construction, so no separate hotfix
  exists — POS usage is zero, confirmed by the owner); (e) the resulting per-tax-row
  breakdown is persisted on the sale so posting can use it.
- [P12B.4] ✅ **POS adapter** — register `pos_sale` as the THIRD entry on the [P12A.2] shared
  `SourceModuleAdapter` interface (no new pipeline): Dr cash/bank by payment method, Cr
  income, **Cr each tax account from the [P12B.3] breakdown exactly as the §7.2 sales-invoice
  composer does** (so mixed-rate baskets land on the right accounts), with the existing
  runner, kill-switch flag, AR-2 reversal pass and zero-diff report. Idempotency needs no
  schema change — `adapter_posting` already anti-joins on (adapterKey, sourceId). Depends
  on [P12B.2] (reversal trigger) and [P12B.3] (tax breakdown). Size S–M.
- [P12B.5] ✅ **POS COGS capture (Bucket A — owner 2026-08-15)** — `issueStock` is called without a rate,
  so no cost lands on `Sale`, `SaleItem` or `StockLedgerEntry`; the Dr COGS / Cr Inventory
  leg has no source number and the P9.4 gross-profit report is fiction for counter sales.
  Snapshot the valuation rate at issue time so the adapter can post Dr COGS / Cr Inventory.
  **Must survive the return path**: a returned item reverses revenue AND cost, so the cost
  snapshot has to be recoverable from the reversing document ([P12B.2]) — design the two
  together.
- [P12B.6] ✅ POS write-path test coverage + demo seed — `salesDao.create`/`markPaid`, the
  tax/discount math and the stock-issue side effect have ZERO tests today, and no seed
  creates a `Sale`; any posting work would otherwise land on an untested, unseeded surface.

**As built (Phase 12B, 2026-08-19).** Delivered as scoped, with these decisions recorded:
- **D13** — a refund is a document STATE (`REFUNDED`), not a new payment document: neither
  `Invoice` nor `Sale` has a payment child table, so a refund document would have nothing
  to hang off. `VOIDED` keeps its meaning (unpaid, cancelled).
- **D14** — full refund/return only in v1. The adapters post on document totals, so a
  partial refund without a per-line GL map is a number with no entry behind it.
- **D15** — POS returns restock; clinic-invoice refunds do not. `Sale` has `SaleItem` with
  `inventoryItemId`; the clinic `Invoice` has no line items at all.
- **[P12B.3] refuses rather than defaults.** Any fallback constant would be the fifth copy
  of the number this task exists to delete, so an unconfigured clinic gets a surfaced setup
  error. Safe because POS usage is zero (owner scoping); it would NOT have been safe against
  live traffic.
- **Per-item overrides needed a new link.** A sales invoice takes an Item Tax Template per
  line by user choice; a cashier has no such field, so `InventoryItem.itemTaxTemplateId` was
  added and the product form gained the picker. Without it "routed through the engine" would
  still have meant one blended rate for the whole basket.
- **COGS rides the revenue voucher** ([P12B.4] map), which is what makes "must survive the
  return path" structural instead of a thing to remember.
- **[P12B.6-fix] — the first-run path is part of the deliverable** (owner UI pass, 2026-08-19).
  Three defects, all of the same class: the product behaved correctly, but the path a
  brand-new clinic walks did not, and the test fixture builds clinics directly so CI could
  not see any of them. (a) The demo seed provisioned FY 2024 + FY 2025 and nothing covering
  **today**, so a fresh clinic could post nothing dated now — fixed by
  `provisionClinicFirstRun` — the SINGLE call both first-run paths make, deriving the year
  FROM the date, never a literal. **Onboarding provisions it too** (owner directive, same
  day): fixing the seed alone would have left a wizard-created clinic in the same hole, which
  is the shape KL-7 keeps producing. Provisioning beats reporting for anything derivable; the
  [P12C.2] panel reports what is a real choice (chart of accounts, §4.1 defaults). (b) The 12%
  demo template and the Tax Rule that made it win resolution are **deleted**: once
  `[P12B.3-fix]` made onboarding create a genuine 15% template, a seeded 12 proved nothing
  about the deleted constant, and it made seeded and onboarded clinics quote DIFFERENT
  figures — the canonical proof is changing the rate (walkthrough step 13), now executed in
  CI. (c) `InventoryItem.code` is `@unique` **globally**, so a literal demo code could seed
  only one clinic in the whole database. **Rule for future seeds: a seed is only done when it
  runs on a clinic the product itself could have just created, twice.**

**Known POS limitations NOT scoped here** (documented, not worked around): no split tender
(single `paymentMethod` enum, no payments child — a part-cash/part-card sale cannot be
represented); no party link (the picked Owner id is discarded, only `customerName` survives
— acceptable for walk-in cash sales, blocks any POS receivable); no cashier shift/drawer/
daily close and no `createdById`, so cash-on-hand cannot be reconciled to a drawer; no
`currencyCode`; no `branchId`, so multi-branch cost-centre posting is impossible.

- [P12.13] ✅ **Pin the adapter value leg on `adapter_posting`** (from the [P12B.4-fix]).
  The zero-diff report's GL leg is now summed over the accounts each adapter DECLARES as
  its value leg, which fixed a certain bug (the POS COGS debit was being counted as
  document value, so the residual sat permanently at −cogs). But the legs are read as
  configured *now*: repointing a clinic's default cash/bank/expense account after documents
  were posted makes the historical rows invisible to that sum. Record the value-leg
  account id on `adapter_posting` at post time and have the report use it. Small, additive,
  Bucket B.

  **As built.** `adapter_posting.valueAccountIds` is written from `adapter.glValueAccountIds(legs)` at post time, and the report sums the GL leg over the accounts RECORDED on the postings in range rather than the ones configured today. Rows written before the column exists carry an empty array; for those — and only those — the current legs are still used, because dropping them from the sum would put a permanent residual on every clinic that ran an adapter before this migration. Pinned by the scenario itself: post, repoint the clinic's default cash account, re-read the report, still zero. That test fails against the previous code, which is what makes it worth its runtime.

## Phase 12C — Clinic-invoice tax through the P4 engine (**Bucket A**, owner 2026-08-19) → next

**Runs FIRST after Phase 12B merges — before Extended, before P13** (owner directive):
"four more `DEFAULT_VAT_RATE = 15` on the clinic-invoice side means the SAME class of bug we
just spent a phase fixing still lives in the path that generates most clinic revenue."

- [P12C.1] ✅ **Route clinic-invoice pricing through the §8 engine** (contract KL-6). Same
  shape as [P12B.3], which is the worked example to copy (`sale-pricing.service.ts` +
  `runInvoiceCalculation`). Four call sites each hold their own constant and compute
  `vatAmount` themselves off `ClinicSettings.vatRate`: `invoices.dao.ts`,
  `lab-invoice.service.ts`, `radiology-invoice.service.ts`, `operations-invoice.service.ts`.
  Scope, per the owner: (a) all four priced by the P4 calculator against a Sales Taxes and
  Charges Template resolved by the P4.1 rule engine; (b) **every constant deleted** —
  `DEFAULT_VAT_RATE` in all four files and the reliance on a single blended
  `ClinicSettings.vatRate`; (c) **no fallback** — an unconfigured clinic is refused with a
  surfaced setup error, exactly as POS now does (the [P12B.3-fix] onboarding guarantee means
  no clinic starts unconfigured); (d) **per-item Item Tax Template overrides honoured**, so a
  mixed basket of exempt and standard-rated services is right — this is the reason the task
  exists, since one blended rate can never be.
  Note the ordering constraint: `Invoice` carries `vatRate`/`vatAmount` scalars and no tax
  child table, so this needs the `SaleTax` treatment (`InvoiceTax` rows + `taxTemplateId`)
  before the adapter can credit each charge to its own account head.
  **Acceptance:** through the UI — a mixed basket on a clinic invoice taxes only the
  standard-rated lines; changing the template rate moves the figures with no code change;
  the clinic_invoice adapter still zero-diffs.

  **As built.** All four constants deleted. One shared resolver
  (`resolveSalesTaxTemplateOrThrow`) now serves POS and clinic invoices — extracted from the
  POS copy rather than duplicated, because a rule written twice is the defect this phase pair
  exists to delete. `Invoice` gained `taxTemplateId` + `InvoiceTax`; the adapter credits each
  row to its own head, with a documented fallback to the single VAT leg for invoices paid
  before the migration (they have no rows, and dropping them would put a permanent residual
  in the zero-diff report on every existing clinic). Per-line overrides live on
  **`ClinicServiceConfig.itemTaxTemplateId`** — all four order-item tables carry `serviceId`,
  but a `Service` may be global while an Item Tax Template is per-clinic. The refusal class is
  registered in `app.ts`'s `CLIENT_ERROR_NAMES` so the Arabic message reaches the operator as
  a 400 from any of the four paths, and an HTTP test pins exactly that (a masked 500 is the
  failure mode nothing else would catch).

- [P12C.2] ✅ **Accounting readiness surface for a new clinic** (contract KL-7, checked at the
  owner's prompt 2026-08-19). Every setup step IS reachable from the product — chart of
  accounts «تطبيق الشجرة القياسية», fiscal-year create sheet, «إعدادات الشركة» §4.1 defaults,
  adapter legs and flags on «الحوكمة ← المحولات» — so this is **not** the CLI-only launch
  blocker it first looked like. What is missing is guidance: nothing orders those five steps,
  nothing says which are done, and most gaps surface only at posting time as an Arabic error
  naming a screen. Scope: a readiness panel (or checklist on «الحوكمة») that reads the actual
  state — CoA non-empty, an open fiscal year covering today, §4.1 defaults set, adapter legs
  set, a default sales tax template present ([P12B.3-fix] guarantees this one) — and links
  each unmet item to the screen that fixes it. No new posting logic; it reads what already
  exists. Bucket A, ships with 12C because both are first-run correctness.

  **As built.** `GET /accounting/readiness` + tab «الجاهزية» on the governance hub, made the
  DEFAULT tab: nothing else on that screen means anything to someone who cannot post yet.
  Five items, each reading real state — chart of accounts, a fiscal year covering today, the
  §4.1 posting defaults, a default sales tax template, adapter legs. **Severity is not
  decoration:** `blocking` means no document posts at all, `warning` means one flow refuses
  later; the adapter legs are a warning because adapters post what is already recorded, so a
  missing leg delays the ledger rather than stopping the clinic. Reporting an optional leg as
  a blocker would train the owner to ignore the panel, which is worse than no panel.
  The **route lives in the UI**, not the response — a typed `<Link to>` breaks at compile
  time on a route rename, where a server-supplied string would be cast past the router's
  typing and fail silently in front of an owner who is already stuck. Two of the five are
  guaranteed by `provisionClinicFirstRun` and so normally read ✅, but they still APPEAR,
  because a person can disable or delete either afterwards.

## Phase 12 — Extended Parity Pack (**Buckets B/C** — Bucket A is 12A + 12B)  → **M4**
**Goal:** the long tail. Ship behind feature flags; order within phase is free.
- [P12.1] Opening Invoice Creation Tool (FR-17.3) + migration guide (balances + open-invoice detail from POSitiveDB/legacy). **→ pulled forward to [P12A.1].**
- [P12.2] ✅ Deferred Revenue & Expense (§15): item flags, deferred posting job, via-JE option, report.
  **As built.** Invoice-time redirect first: a flagged row credits the balance-sheet deferred
  account instead of income (§7.2 row 4), because an invoice must never recognise revenue it
  has not earned — deferring afterwards would mean booking income and taking it back. The
  monthly job then moves it out over the service window. Idempotency is the DATABASE'S: one
  `DeferredScheduleEntry` per (item, periodEnd), unique-indexed, and `alreadyBooked` summed
  from those same rows so a re-run cannot double-recognise even if the index were dropped.
  **The closing period absorbs the rounding remainder** — without it a schedule leaves a few
  piastres parked for ever, which is the classic version of this bug and survives any
  "does it roughly add up" test; the DB suite asserts the deferred account reaches exactly
  zero over twelve months. A half-configured row (flag without account or dates) is refused
  and posts as ordinary income: the money lands where it would have anyway and the operator
  sees the flag did not take, rather than revenue vanishing into an account nothing drains.
  Days/Months basis and the via-JE + submit flags come from the §19 keys shipped at P0.
- [P12.3] ✅ Tax Withholding (BR-8.2): categories, thresholds incl. cumulative, PI/PE/JE integration, TDS reports.
  **As built.** Pure threshold engine (`tax-withholding.rules.ts`) + a resolver that supplies
  the two things arithmetic cannot know: which category applies, and the party's qualifying
  total THIS FISCAL YEAR — cumulative thresholds reset with the year, so summing across all
  time withholds on a supplier who crossed the line three years ago. Prior totals count only
  SUBMITTED invoices and exclude the document being priced.
  **The withheld amount is snapshot at submit, never recomputed.** Rates, thresholds and the
  running total all move; restating a submitted invoice would change a figure the supplier
  has been paid against and a certificate already quotes.
  GL shape: the supplier is credited the FULL invoice and debited back the withheld part
  (row 6b), so the payable left is what will actually be paid while the expense stays gross.
  Netting it into row 1 would understate the expense and lose the withheld figure from the
  supplier's ledger — the exact number a certificate has to reconcile against.
  Overlapping rate windows are refused by name: order-dependent rates are how a supplier and
  an auditor get different answers. PE/JE integration deferred with the advance work
  ([P12.6]); the PI path is where withholding actually arises in this product.
- [P12.4] ✅ POS simplified path (§16): POS Profile, Opening/Closing entries, POS Register report.
  **Scope read, and it differs from a literal reading of the line.** The `is_pos` Sales
  Invoice route exists in §16 as ONE of two options; the BRD itself names the simplification
  («run POS posting directly, keep Opening/Closing for cash control»). This product already
  posts POS sales straight to the ledger through the [P12B.4] `pos_sale` adapter, so adding a
  parallel POS-Invoice document plus a consolidation job would create a SECOND revenue
  pipeline for the same money — more to reconcile, not less. Full consolidation is for
  offline tills and remains unbuilt until someone needs one.
  **What was genuinely missing is what got built:** the KL-5 limitation recorded at 12B —
  «no cashier shift/drawer/daily close and no `createdById`, so cash-on-hand cannot be
  reconciled to a drawer». Profiles, shift open/close, per-method expected-vs-counted, the
  difference posting, and the POS Register. The expected figure is DERIVED (float + this
  shift's own sales, refunds excluded) and never typed; a cashier who could type it would
  type it to match the count. A difference beyond the profile's write-off limit is refused —
  a large shortfall is a management decision, not a silent journal. One open shift per
  cashier, and the cashier comes from the session, never the request body.
- [P12.5] ✅ Dunning (FR-17.1) + Subscription (FR-17.2) + Auto-repeat.

  **As built.** Dunning Type master (default rate/fee/letter/income account), the overdue
  pull, and a snapshot dunning document — the figures freeze at creation, because a letter
  that re-prices itself when the customer pays half contradicts the paper they are holding.
  Interest is simple, annual, pro-rated by days PAST THE DUE DATE (never from the invoice
  date — that would turn a payment term into a penalty), and the fee is charged **once per
  dunning, not per invoice**.

  **BRD deviation, stated rather than smuggled.** FR-17.1 says the income posts «on payment
  through PE (reference Dunning)». Nothing in this codebase can collect a document that has
  no PLE, and a PLE needs a posting — so the fee + interest post at SUBMIT as
  `Dr party-AR / Cr income` through a real Journal Entry, which the existing P7 payment flow
  already knows how to collect (`journal_entry` is a registered reference type). The
  principal is NOT re-booked — it is already receivable, and re-booking it would bill the
  customer twice; a DB test pins exactly that. A dunning with no fee and no interest posts
  no journal entry at all.

  **Subscriptions derive every period from the START DATE, never from "today".** A missed
  run catches up (three weeks down ⇒ three invoices) and a repeated run is a no-op — guarded
  twice: `lastInvoicedPeriodEnd` plus a unique key on (subscription, periodEnd) in the
  database, because "billed the customer twice" is the failure that costs a clinic its
  customer. Month-end anniversaries are computed from the original anchor rather than the
  previous clamped cursor, so 31 Jan → 28 Feb → **31 Mar**, not the 28th for ever. Generated
  invoices default to DRAFT: an invoice that posts to the ledger unattended, on data nobody
  looked at, is how a wrong price becomes a wrong tax return. Auto-repeat is the
  `subscription_billing` handler on the P0.5 job runner, running as SYSTEM.
- [P12.6] ✅ **Advances in a separate party account (FR-11.3)** + `advance_payment_ledger_entry`.
  Owner delegated the A/B/C fork back (2026-08-20); the BRD then settled it, and the earlier
  recommendation of (B) was WRONG on a closer reading. **FR-11.3 names
  `advance_payment_ledger_entry` explicitly** and the table is listed in the §Appendix P12
  table plan — so (A) is not a workaround invented here, it is the law document's own answer,
  and rule 1 binds. The objection to (A) («a second source of truth for outstanding») also
  fails on inspection: an advance in a separate account **is not a receivable at all** until
  it is released, so the two ledgers describe different states of the same money, never the
  same state twice.

  **The safety property that let this ship without CI** (the GitHub Actions billing block was
  live all day): every behavioural change is behind
  `book_advance_payments_in_separate_party_account`, **default OFF**. With the flag off not a
  single row of the P7 allocation core behaves differently — and that claim is not asserted,
  it is *tested*, by a pure map test that diffs the two posting maps row for row.

  **How it works.** With the flag on, the unallocated remainder of a payment credits «دفعات
  مقدمة مقبوضة» (a liability) — or debits «دفعات مقدمة مدفوعة» (an asset) — carrying **no
  party**, because BR-4.3.3 forbids one on an account that is not RECEIVABLE/PAYABLE. §5.2
  therefore derives nothing, which is exactly the invisibility the sub-ledger exists to fix:
  the party's claim, the amount and the allocation target live in
  `advance_payment_ledger_entry`, with §5.2's own sign convention (a customer advance is
  negative) and the same delink-and-re-insert discipline as the payment ledger.

  **Release is a real posting, not a re-pointing** — the one place this genuinely differs from
  BR-11.2. A PLE advance is consumed by moving an existing row's against-target, which is
  legitimate because the money was already sitting in the receivable. A separate-account
  advance is sitting somewhere else, so applying it MOVES it: Dr the advance account (flat),
  Cr the receivable **against the invoice, with the party** — so §5.2 derives the settlement
  exactly as for any other payment and the invoice's outstanding drops by precisely the
  allocation. No second definition of "settled".

  **The branch lives inside `relinkAdvanceToInvoice`**, the single entry point invoice submit,
  reconciliation and auto-reconciliation already call. No caller learns which regime a payment
  was written under, and a caller added later cannot forget to ask.

  **The regime is snapshotted on the document** (`PaymentEntry.bookAdvanceInSeparateAccount`,
  resolved at DRAFT creation), never re-read live: a flag toggled between draft and submit
  would post the money somewhere other than where the operator was told. A missing advance
  account is refused at SAVE, when it can still be fixed, not at submit when the money is in.

  **Cancel refuses a spent advance** before reversing anything — cancelling a payment whose
  advance is funding a submitted invoice would unfund it, and the customer would find out
  before the clinic did. An unspent advance cancels normally and its sub-ledger rows delink.

  **Also fixed on the way through:** the accounts-settings screen rendered the five
  `*_account_id` keys as bare text inputs asking an operator to paste a `cuid()`. They now get
  an account picker, keyed off the suffix so a sixth such key is handled the day it is added.

  **Reachability, caught before it shipped.** The forward and reverse paths both worked and
  no operator could have used either: the [P7.6] two-pane reconciliation screen reads its
  credits from `getOutstandingForParty`, which is PLE-only, so a customer with 500 sitting in
  «دفعات مقدمة مقبوضة» showed an EMPTY credits pane — and `openCreditBalance` would have
  refused every allocation with «رصيد الدائن المفتوح (0)», true of the ledger it happened to
  read and false about the clinic. Both now consult the sub-ledger. The same fix nearly
  introduced the worst bug in this task — the advance appearing in BOTH the fetch's own query
  and the credits pane, i.e. allocatable twice — so the fetch no longer queries the sub-ledger
  at all and reads the union once. One reader, one answer, pinned by a test that asserts the
  credits pane returns exactly ONE row for a separate-account advance.

  **Unreconcile closes the loop (FR-10.3).** A released advance is un-released by REVERSING
  the transfer posting (AR-2 append, the original stays visible), not by re-pointing a row —
  the mirror image of why release had to post in the first place. The reversal runs before the
  sub-ledger moves, so a closed period or frozen account rolls the whole thing back with the
  advance still correctly shown as spent; the opposite order would produce an advance that was
  available again *and* still funding an invoice. Pinned end to end: outstanding 300 → 0 → 300
  and the advance 500 → 200 → 500, then the payment cancels cleanly — the door is not one-way.

  **Known limitations, recorded rather than guessed (rule 6):** (a) FR-11.3 runs **single-currency**
  in v1 (the release posts at the ledger's own rate), consistent with the C4 phasing;
  (b) **advance taxes on PE remain unbuilt.** FR-11.3 says nothing about them; only the
  ERPNext table name `advance_taxes_and_charges` implies them, and the reversal semantics on
  consumption are unspecified. A provisional design exists (carve the tax out of the advance
  leg — the §7.4 map stays balanced because Σcredits is unchanged) but it is NOT built.

  **Rule-10 trio, two of three parts:** (a) a seeded scenario in `db:seed:accounting-demo` —
  the two advance accounts on DEDICATED demo accounts, idempotent, and it deliberately stops
  one step short of flipping the flag, because the flag changes where real money lands on
  every subsequent payment and a seed that flipped it silently would rewrite the posting
  behaviour of a clinic that ran the seed to look at POS data; (b) the CI suite pinning the
  figures. (c) the manual walkthrough is WRITTEN
  (`docs/planning/P12.6-advance-account-walkthrough.md`) but **carries a banner saying it has
  not been executed** — rule 12 means it is a verification plan, not evidence, until someone
  runs it against a database. Its figures are marked expected, not observed.

  **Verification status:** pure map test 8/8 green locally and in the fast tier; the
  `advance-account.db.test.ts` lifecycle suite (flag-off untouched · flag-on books elsewhere ·
  release settles the invoice to zero · unreconcile restores it exactly · spent advance blocks
  cancel · unspent cancels and delinks · missing account refused at save) runs only in the FULL
  tier, which was
  **billing-blocked** when this landed. Per rule 11 its CI cell stays ⏳ until a concluded
  green full run covers this commit.
- [P12.7] ✅ Auto Payment Reconciliation job (FR-10.2); Process Statement of Accounts (FR-17.4).

  **Auto-reconciliation pairs oldest-against-oldest and does nothing that needs judgement.**
  It never writes off a difference, never picks a difference account, and never allocates
  beyond what BOTH sides can absorb — every pair it proposes is one an operator would have
  made by hand without thinking. Anything else (a 2-riyal shortfall wanting a write-off, a
  credit that might belong to a sister party) is left for the [P7.6] two-pane screen, where a
  human can see it. It posts through `reconcilePayments`, not its own path: that function
  already owns the row locks, the live re-validation and the §5.2 delink/relink discipline,
  and a second posting path for the same operation is a second place for the ledger to be
  wrong — this one unattended, where nobody would notice. Safe to run twice: it reads the
  LIVE outstanding, so a second run finds nothing left to pair. The pairing policy is a pure
  module with its own tests, so it runs in the FAST CI tier on every push.

  **Statements read the ledgers that already exist.** «حركة الطرف» is the [P3.6] payment
  ledger filtered to one party; «أعمار الديون» is the [P9.3] AR report filtered the same way.
  Neither re-derives a balance — a statement that disagreed with the AR report the clinic
  reads internally would be worse than sending nothing, because the customer would be arguing
  against a number the clinic cannot reproduce. Build and send are SEPARATE endpoints with
  different permissions: previewing is a read, sending leaves the building and cannot be
  recalled. Periods derive from the run date's calendar position, not by subtracting days, so
  consecutive monthly statements tile exactly — pinned by a test, because a gap hides an
  invoice from every statement a customer ever receives. A customer with no email is
  REPORTED, never skipped silently: "sent 4 of 7" with no reason is how a clinic discovers in
  three months that its biggest debtor got nothing.
- [P12.8] 🟡 **PARTLY DONE** — Internal/inter-company: internal parties, unrealized P&L leg,
  inter-company JE/invoice mirroring, Party Link common-party.

  **✅ Done: the unrealized P&L leg is now ALIVE.** §7.2 row 3 and the
  `isInternalCustomer` / `unrealizedProfitLossAccountId` columns have existed since [P5.3] —
  but nothing ever SET the flag, so the row could never fire and a sale to a party inside the
  same group posted as ordinary revenue. That is a defect you only discover by consolidating
  two entities and finding the group's revenue counted twice. The flag is now resolved at
  prepare time from the party's own `is_internal` configuration — never from the request,
  because "is this party part of my own group?" is a configuration fact, not something a
  caller should be able to assert. An internal party with no unrealized account configured
  REFUSES at save time and names the setting, rather than silently posting to income exactly
  as before. Pinned by a DB test on all three paths (ordinary → income, internal → unrealized,
  misconfigured → refusal).

  Note: the BRD's purchase map (§7.3) has NO internal row, so none was added — the sales-side
  redirect is the whole of what the BRD specifies here.

  **⛔ Deferred to the same decision as [P12.6]: the auto-JE-against-an-in-flight-document
  problem.** Both the inter-company mirroring (FR-7.1.7) and the Party Link common-party
  auto-JE (§4.2) need a SYSTEM journal entry that settles against a document being submitted
  in the same transaction — and BR-7.1.2 validates that the referenced document is already
  SUBMITTED with outstanding available. That ordering question is the same root cause that
  stopped [P12.6], and it should be answered once, not three times in three different ways.

  **⛔ Inter-company mirroring additionally needs a TENANCY decision that is the owner's.**
  Company = `clinicId` (contract C5), so "create the mirrored document in the counterpart
  company" means one clinic's transaction WRITING INTO another clinic's data. That is the
  single most dangerous operation in a multi-tenant product. The conservative rule —
  the acting user must be a member of BOTH clinics, and the counterpart must name this clinic
  back — is implementable, but it is a security posture, not a detail, and it is not being
  chosen unilaterally.
- [P12.9] 🟡 **PARTLY DONE** — Repost Accounting Ledger + on_update_after_submit account-edit
  detection (FR-6.9); Ledger Merge.

  **✅ Repost Accounting Ledger.** REVERSE-AND-REPOST, never delete-and-recreate. The BRD
  offers both; only one is defensible — deleting the original entries erases the evidence that
  the ledger ever said something else, which is exactly what an auditor is looking for when
  they ask why a balance moved. Appending reversals then fresh entries costs more rows and
  answers the question, and it is the same AR-2 discipline every cancel in this module already
  follows, so it needed no new machinery.

  **The implementation is small because of one observation:** every voucher already carries
  its ledger construction in the lifecycle's `onSubmit` hook. A repost is therefore *reverse,
  then run onSubmit again* — not a second posting path. That matters beyond brevity: a repost
  that rebuilt the GL through repost-specific code would drift from the submit path the moment
  either changed, and the drift would surface as a ledger that disagrees with itself only for
  vouchers someone happened to repost. The four config factories are now exported and
  registered; the registry is explicit rather than discovered, because which doctypes are
  repost-safe is a DECISION (BRD `repost_allowed_types`), not a capability.

  One transaction per voucher (NFR-1): a voucher that failed mid-repost with its old entries
  reversed and no new ones would have silently vanished from the trial balance. A failure
  rolls that voucher back completely and is recorded on its row while the batch continues.
  Drafts and cancelled vouchers refuse. **A reason is mandatory** — reposting rewrites what
  the ledger says about a document someone already signed off, and a sentence is the cheapest
  possible audit trail.

  **⛔ Ledger Merge is NOT built, and that is a rule-6 call.** The BRD names it in the tool
  list and nowhere else — one word, no behaviour. And the obvious implementation (re-point
  every historical GL/PLE row from account A to account B) MUTATES posted ledger rows, which
  contradicts the append-only invariant this module holds everywhere else. The counter-argument
  is real — a merge changes which node the amounts hang from, never the amounts, so every
  balance stays identical — but "we broke immutability, and here is why it was fine" is an
  owner's call, not one to make inside a task with a one-word specification.

  **⛔ `on_update_after_submit` auto-detection deferred with it.** The lifecycle already has
  the `updatableAfterSubmit` whitelist seam for it, and the repost tool it would trigger now
  exists — what is missing is the decision about which account fields may be edited on a
  submitted document at all, which is the same class of question as the Ledger Merge one.
- [P12.14] ✅ **Screens for the Extended bucket — the debt is paid.** [P12.2] deferred,
  [P12.3] withholding, [P12.4] POS shifts, [P12.5] dunning/subscriptions, [P12.7] statements
  and [P12.9] repost all shipped server-side only; an owner could not click any of them, which
  under rule 12 meant no Extended walkthrough could be run at all.

  **ONE hub, seven tabs** (`/management/accounting/extended`, §7.8 hub rule, الحوكمة pill
  precedent) rather than seven sidebar entries. These are periodic or exceptional operations —
  recognise deferred revenue, bill subscriptions, chase overdue invoices, mail statements,
  check the till, review withholding, repost a corrected document — and seven top-level
  entries would bury the daily screens they sit beside. **Tab order is by how often a clinic
  touches them**, not by phase number: the till is daily, subscriptions and deferred monthly,
  reposting is the rare correction nobody should reach for first.

  **Owner UI pass, 2026-08-20 — what it found.** All seven tabs are RTL-correct and every
  empty state is a real sentence. But four of them (POS shifts, dunning, statements, repost)
  are READ-ONLY reports with no path in the product to create the data they display, and the
  POS-shifts empty state actively instructed an action that does not exist («تُفتح الوردية من
  نقطة البيع») — the shift service and tables are live, but no shift UI was ever built inside
  the POS. Three of the pass's five checks were therefore unverifiable, not failed. The empty
  states now say plainly that creation is API-only so far; **the create surfaces are [P12.15]**,
  and until they exist this hub is a reporting surface, not a workflow.

  Deliberate choices worth recording: the shared table shell / loading / empty-state live in
  ONE module because seven hand-copied variants means the seventh differs from the first on
  the tab nobody demoed; every empty state is a SENTENCE explaining what would populate it,
  since «لا بيانات» cannot tell an owner whether the feature is broken or merely quiet; the
  POS difference column shows «٠» rather than «—» because "counted exactly right" and "not
  counted" are different facts; and the statements tab has no send button — an emailed
  statement cannot be recalled, so sending stays behind the preview flow the server already
  separates.
- [P12.15] ✅ **Create surfaces for the read-only Extended tabs** (owner UI pass 2026-08-20).
  Every Phase-12 Extended feature is now reachable end-to-end through the product.

  **Where each surface landed, and why there.** POS **profiles** are created in the accounting
  hub (`ورديات نقطة البيع`) because their two meaningful fields are accounting decisions — which
  account absorbs a drawer difference and how large a difference may be absorbed silently — and
  a cashier must not be able to raise their own write-off limit. The **shift itself** opens and
  closes from a strip inside the till (`pos-shift-bar.tsx`), where the cashier and the drawer
  are; asking them to navigate into a management screen first is how the feature goes unused and
  the register stays permanently empty, which is precisely the state the owner's pass found. The
  strip never BLOCKS selling — a sale without an open shift still goes through and attaches to no
  shift, exactly as `sales.dao` already behaved — and it says so, because a till that refuses a
  customer over a missing bookkeeping document is a worse product than one whose register has a
  gap. **Dunning**, **statements**, **subscriptions** and **repost** each got a create sheet in
  their own tab, on the shared `AccountingFormSheet`.

  **Decisions worth recording.** The close dialog shows the expected drawer figure beside each
  field but never types it into the field: a prefilled count is not a count, it is a default a
  tired cashier confirms, and catching the shifts where drawer and system disagree is the entire
  point. Its live difference is computed in integer nano-units (C2), so the number the cashier
  approves is byte-identical to the one the server will post. The dunning sheet is built around
  the OVERDUE PULL rather than around its two numbers — the operator's real decision is which
  late invoices the letter chases — and it states that the fee is charged once per letter, not
  once per invoice, because an operator expecting per-invoice fees reads the total as a bug.
  Statements ship a **preview→send** flow rather than a row-level send button, mirroring the
  server's own read/submit permission split: an emailed statement cannot be recalled. The
  subscription sheet exists specifically because the owner's pass could not verify billing
  idempotency — not because the run failed, but because no subscription could be created — and
  the repost sheet puts the mandatory REASON first, as a textarea, since that sentence is the
  whole audit trail for a rewritten ledger.

  **One new endpoint:** `GET /accounting/repost/candidates?voucherType=` returns submitted
  vouchers of one repostable type in a uniform shape. The four list endpoints each have their own
  idea of "the amount" (grand total, total debit, paid amount); resolving that server-side beside
  the registry that decides what is repostable means a fifth type costs one `case`, not a branch
  in the UI. Drafts and cancelled documents are not offered, because `repostVoucher` refuses them
  — a picker listing a document the action will reject is a trap, not a choice.

  **Rule-12 coverage:** `pos-shift/p1215.controller.test.ts` exercises every newly-reachable gate
  twice (authorized ≠ 401/403, unauthorized = exactly 403) and drives the real flows over HTTP:
  profile → open → expectation → over-limit close REFUSED → matching close at zero difference
  with no `pos_closing` GL row → register shows it CLOSED; and draft-invisible → submit →
  candidate visible at 250 → repost request → run OK.

  **Known gap, deliberately not invented (rule 6):** a POS profile cannot yet be restricted to
  named cashiers. The server treats an empty user list as "any user may open a shift", which is
  the right default and the only behavior with an endpoint behind it; restricting it needs a
  clinic-users lookup that does not exist.
- [P12.10] 🟡 **PARTLY DONE** — Remaining reports: Financial Ratios, Consolidated statements,
  Custom financial templates, Profitability Analysis, Payment Ledger variants, TDS summaries.

  **✅ Financial Ratios.** Current, quick, debt-to-equity, gross and net margin, receivable
  and payable days. Two decisions worth stating: (a) a zero denominator returns **null**,
  never Infinity, NaN or 0 — a clinic with no current liabilities has an UNDEFINED current
  ratio, and printing «∞» or «0» tells the reader something false; (b) DSO/DPO scale to the
  REQUESTED period rather than assuming a year, so a quarterly report is not four times worse
  than the annual one for identical performance. **The input figures ship alongside the
  ratios** — a ratio nobody can trace back to a number is a number to argue with, not one to
  act on. Liquidity is classified by `accountType` (CURRENT_ASSET / BANK / CASH / RECEIVABLE /
  STOCK vs CURRENT_LIABILITY / PAYABLE / TAX), reusing the types that already drive posting,
  so the ratios cannot drift from the ledger's own idea of what an account is.

  **✅ Profitability Analysis** by cost center or project — the same GL rows the P&L reads,
  cut a different way. Rows with no dimension are reported as «غير موزّع» rather than dropped:
  an unassigned cost is exactly what a profitability report exists to surface. (`projectId` is
  still a plain dimension column with no master behind it, so its value is its own label —
  resolving a name that does not exist would print «undefined» in a report an owner reads.)

  **✅ Tax-withholding summary** over the [P12.3] entries, grouped by category and party, with
  a **missing-certificate count** as the actionable column.

  **✅ Payment Ledger variants** — already served by the [P3.6] payment-ledger report plus the
  [P12.7] statement views built on it; no new report earned its place.

  **⛔ Consolidated statements** need the SAME tenancy decision as the [P12.8] inter-company
  mirroring: company = `clinicId`, so consolidating means reading across clinics.

  **⛔ Custom financial templates** are one BRD line — «user-defined row formulas over account
  sets» — and a formula language is not something to invent from that. A constrained version
  (a row = label + account set + sign, no expressions) would cover most real use and is the
  obvious counter-proposal, but which one to build is a scoping call.
- [P12.11] ✅ Report platform backlog (M3-gate follow-up, owner 2026-08-15): persisted named report presets (saved filters/column presets, client-side Zustand-persisted) + PDF export for the financial statements ([P9.5] shipped CSV + lazy XLSX only — accountants will eventually ask for PDF statements).

  **As built.** Presets are client-side (Zustand `persist`), per the M3-gate scoping: a
  preset is "how I like to look at this report", not a company record — no audit meaning, no
  permission story. Cost stated: they do not follow an accountant to another machine; the
  store is the seam if that ever changes. Values are a plain string map so ONE store serves
  every report and adding a filter needs no migration.

  **PDF goes through the browser's print pipeline, deliberately.** A JS PDF library needs an
  embedded Arabic font (~1MB+ against the client-bundle guard) plus its own RTL shaping — two
  failure modes that surface as mangled Arabic in an accountant's hands, not in CI.
  `window.print()` reuses the engine that already renders the screen, so Arabic, RTL and
  fonts are right for free. Honest limitation: it opens a print dialog where the operator
  picks "Save as PDF"; it does not write a file. Server-side headless rendering is a
  different task with a real cost and nobody has asked for it.

## Phase 13 — Hardening, Migration & Launch
- [P13.1] 🟡 **PARTLY DONE** — Load tests vs NFR-3 targets (1M+ GLE dataset generator);
  index tuning; AR unbuffered-cursor path.

  **✅ The dataset generator and the load suite.** `generateLedgerDataset` writes balanced GL
  pairs (plus a proportional slice of party-ledger rows) shaped exactly like engine output,
  through `createMany` rather than the posting engine — going through `makeGlEntries` would
  take hours and would measure the WRITE path, when NFR-3 is about the READ paths. It is never
  wired into `db:seed`: hundreds of thousands of meaningless rows in the first database anyone
  demos is its own kind of defect.

  **What the suite asserts is deliberately NOT a wall-clock threshold.** A CI runner's clock
  is not a customer's server — shared vCPUs, cold cache, noisy neighbours — and a flaky
  performance test gets "fixed" by loosening the threshold until it asserts nothing. So the
  assertions are the machine-independent ones: the trial balance still FOOTS over the
  generated volume (what actually breaks when someone adds an unbounded join or a client-side
  aggregation), and the AR report's output stays bounded by the open-document count rather
  than the ledger size. Elapsed milliseconds are LOGGED against the NFR-3 budget so a
  ten-fold regression is visible to a human without failing the build on noise. `NFR3_ROWS`
  raises the volume for a real soak against a production-shaped database, which is the only
  place a wall-clock number means anything.

  **⛔ Index tuning and the AR unbuffered-cursor path are NOT done** — and deliberately not
  guessed at. Both are answers to measurements taken on real hardware with real data
  distribution; adding indexes speculatively costs write throughput on every posting to buy
  a read that may already be fast. The generator above is the tool that makes that
  measurement possible; the tuning itself waits for a run against production-shaped data.
- [P13.2] ✅ Concurrency suite: parallel payments on one invoice never over-allocate (row
  locks proven); double-submit idempotency.

  **This is not a duplicate of [P7.3].** That suite proves the guard AT ITS SEAM —
  `lockAndRevalidateReferences` rejects an over-allocation when handed one. This suite proves
  the property the CLINIC cares about: two cashiers hitting «ترحيل» on the same invoice at the
  same instant cannot, between them, settle more than the invoice is worth. The seam can be
  correct while the surrounding transaction lets a racing pair slip past it, and no unit test
  would notice.

  **The assertion is deliberately NOT «one wins with error X».** Under Serializable isolation
  the loser fails EITHER with the BR-7.4.3 business error OR with a serialization abort, and
  which one depends on timing that varies per run and per machine. Pinning the message would
  make the test flaky — and a flaky money test invites someone to "fix" it by weakening the
  guard. What is pinned is the invariant that protects the money: exactly one submission
  succeeds and outstanding never goes below zero. Four cases: 2×full, the loser leaving NO
  ledger rows behind, double-submit of one document producing ONE set of entries, and 3×partial
  against a smaller balance.
- [P13.3] Reconciliation-with-ERPNext test: run the P4 fixture pack + a 500-voucher scripted scenario in a real ERPNext v16 site, diff GL/TB/BS/P&L/AR outputs to zero.
- [P13.4] ✅ Data migration tooling (CoA map, opening TB, open AR/AP via P12A.1, first-year
  parallel-run checklist).

  **Scope read.** The line names Positive ERP, but nothing here can depend on their schema —
  and it does not need to. Every ERP exports the same two artefacts, and those artefacts ARE
  the interface: a chart of accounts and a trial balance. The CoA half already existed
  ([P1.3] CSV importer) and open AR/AP already existed ([P12A.1] tool); what was missing was
  the opening trial balance, which is now a CSV importer of its own.

  **It refuses an unbalanced file, and that refusal is the feature.** An opening entry that
  does not foot makes the clinic's very first balance sheet wrong, and it stays wrong through
  every period after it because nothing downstream re-derives an opening — importing "most
  of" a trial balance is strictly worse than importing none, because the books then look
  plausible and are not. The difference is reported with both totals rather than absorbed
  into a rounding account: a mismatch is a fact about THEIR data that only they can resolve.
  Rows carrying both a debit and a credit are refused too (almost always a leaked spreadsheet
  formula — netting it silently hides the mistake inside a correct-looking total). Addition is
  exact decimal string arithmetic, never floats, so `0.1 + 0.2` balances against `0.3`.

  **The parallel-run checklist** is in `docs/migration-opening-balances.md`: nine signed-off
  checks over the first month — opening TB, temporary account empty, revenue, AR and AP
  ageing, bank, tax, adapter zero-diff, and a clean period close — with the rule that a
  disagreement is investigated, never adjusted away, since an adjusting entry that makes a
  report agree without explaining why is how a migration error becomes permanent.
- [P13.5] 🟡 **PARTLY DONE** — Permission audit, penetration pass on APIs, Arabic
  localization QA, **full-EN i18n pass**, user docs + onboarding wizard.

  **✅ The permission audit.** Two guards, covering the two failures that look nothing alike:

  1. **No ungated route.** The existing controller test checks that every DECLARED gate is
     coherent; it cannot see a route with no `requireAccounting` at all. That route is not
     403-for-everyone (the [P12A] bug) — it is **200-for-anyone**, which is worse and
     completely silent: nothing in the types, the tests, or a review diff makes an omitted
     gate look wrong. The new audit counts route registrations per controller and requires at
     least as many gates. Deliberately crude — it names the file, not the route — because a
     precise check needs a parser and would rot against Elysia's chaining, while this one
     cannot be fooled by accident. It passes today, so it is a regression guard, not a fix.
  2. **Cross-tenant isolation, over HTTP.** Permission checks answer «may this user do this
     KIND of thing?» and say nothing about «…to THIS clinic's data». An admin of clinic A
     calling a read endpoint is perfectly authorised; the only thing between them and clinic
     B's ledger is that every query is scoped by `activeClinicId`. One `where` missing its
     `clinicId` and a customer reads a competitor's books with a 200 and no trace. Two
     populated clinics, one ADMIN session in the first, asserting the chart of accounts, the
     party list and the general ledger return nothing belonging to the second — plus the case
     people actually miss: fetching a FOREIGN document by its explicit id must not return it.

  **✅ The dormant `labelKey`s are live.** F10's specific finding — 24 keys declared in
  `accounting-status.ts` that existed in NEITHER locale — is closed: all 24 are in both files,
  and the eight screens that read the hardcoded `.label` sibling now translate through
  `useStatusLabel()`. Status badges are the most-read strings in the module, so they were the
  right slice to convert first.

  **The conversion is non-breaking by construction:** the hook passes the Arabic string as
  i18next's `defaultValue`, so a missing key renders the word it always showed rather than the
  raw key («accounting.salesInvoice.status.paid» where «مدفوعة» belongs). A parity test keeps
  that fallback from becoming load-bearing — it fails if any declared key is absent from either
  locale, or present but blank.

  **⛔ The bulk pass is NOT done, and the real number is bigger than F10's.** Measured on this
  head: **2,687 Arabic-bearing lines across 125 UI files** in `src/features/accounting` — F10's
  ~1,249 predates Phases 10–12, and the module has roughly doubled since. That is a genuinely
  large mechanical change, and the honest constraint is that it cannot be verified the way it
  needs to be: no visual pass, and CI currently blocked on billing. Standing rule 5 keeps the
  module Arabic-first until it is scheduled with room to verify. User docs and the onboarding
  wizard are likewise open.

- [P13.6] ✅ **DONE** — TypeScript project references, to cut the typecheck working set.
  One `tsc` invocation used to hold the entire app, and the whole-program typecheck stopped
  fitting a standard 16GB CI runner. The 2026-08-18 measurements below are preserved as the
  justification — they are still accurate about the MONOLITH:

  > **⚠️ Re-read every figure in this entry knowing what was found on 2026-09-04.** All of
  > them were measured with the lockfile's `prisma@7.7.0`. Pinning `7.10.0` cut the cold
  > whole-graph typecheck from **44m13s to 5m31s** on one head (~8×, measured on CI — see
  > [P13.9]). So a large share of what these numbers attribute to *program size* was a
  > dependency the compiler could not chew: Prisma's payload generics. The split done here
  > remains sound and worth having — it is what makes an incremental check cheap, and the
  > layering guard stands on its own — but it was NOT the only thing standing between this
  > repo and a typecheck that fits. Nobody should cite these figures as the settled cost of
  > the codebase without re-measuring on the current pin.

  **What landed here:** the layering GUARD. A referenced-projects split is only mechanical
  while the import graph is acyclic across the boundary being drawn — and today it is:
  production code under `src/server/**` imports `@/lib`, `@/generated` and itself, and never
  reaches into `@/features/**` or `@/routes/**`. Measured, not assumed. That property is also
  exactly the kind that rots silently: one convenient import of a client constant from a
  controller and the split becomes a rewrite, with nothing noticing until someone tries it.
  The guard costs one cheap test and keeps the option open. (Server TESTS may cross the
  boundary and are exempt — a server test asserting a server enum agrees with the client
  constant it drives is a good test, and under project references such tests live in their
  own project referencing both, the standard arrangement.)

  **What did NOT land, and why:** the `tsconfig` surgery itself. It is build infrastructure
  whose failure mode blocks every other task, it delivers no product capability, and rule 14
  records that the incremental fast typecheck is the ACCEPTED answer today rather than a
  stopgap — «do not "restore purity" without reading this». It deserves a dedicated session
  with room to iterate, not the tail of a long one.

  | `--max-old-space-size` | result |
  |---|---|
  | 12288 | peak **10,046 MB**; passes locally; **SIGKILLed three times** on a 16GB runner |
  | 7168 | **FATAL V8 "heap out of memory", exit 134**, peak 7,350 MB — the live set genuinely exceeds 7GB |
  | 9216 | passes, peak **9,071 MB**, **5m26s** locally — but **33 minutes** on CI as V8 trades memory for GC |

  `skipLibCheck` is already on, so that was never the lever, and splitting the job onto its
  own clean runner (no build, no Postgres) did NOT fix it — the ceiling was the cause, not
  contention.

  **What the cause actually was.** Not "the app got big": `generated/` is **885 `.ts` files
  / 63 MB**, and they are *sources, not declarations*, which is precisely why `skipLibCheck`
  could never skip them. Every program parsed, bound and checked all of it, every run.
  `generated/prisma/models/Clinic.ts` alone is 11 MB and every model with a `Clinic`
  back-relation re-expands it — the mechanism behind "five models tipped it over".

  **What shipped.** `tsconfig.base.json` (shared options, not a project) + three programs:
  `generated` (the only `composite` one, emitting `.d.ts` to `tsbuild/`), `server` and
  `client` (both `noEmit`, referencing it with `disableSourceOfProjectReferenceRedirect` so
  they read those `.d.ts` instead of the sources), and `tsconfig.json` reduced to a solution
  file. `bun run typecheck` runs the three in sequence, one process each — so peak is the
  **max, not the sum**. Zero runtime code changed. Full numbers in CLAUDE.md rule 14; the
  graph and its load-bearing constraints in rule 15.

  **Acceptance — met, with one criterion restated rather than met as written.** Every
  program passes deterministically at a 9216 ceiling on a 16 GB box (max 8.66 GB), and the
  cold whole-graph check IS restored to CI as the `typecheck-cold` job in `pr-full-checks.yml`.
  The original wording — "a cold `tsc --build` completes inside the fast job's budget" — is
  not met and was the wrong target: cold is ~944 s, which belongs in the label-gated full
  tier on its own runner, not on every push. What every push gets instead is the incremental
  check: **38 s** when no TypeScript changed, ~**259 s** for an ordinary edit.

- [P13.7] **Classify the fast test suite by resolved import graph, not file text**
  (filed at the [P13.6] exit, owner-directed). `vitest.fast.config.ts` decides which tests
  are DB-backed by searching each file's TEXT for markers (`@/lib/db`, `createGlFixture`, …)
  plus two filename rules. That cannot see a test which reaches `@/lib/db` **transitively**
  through a service or audit module several levels down: the file is textually clean and
  its name matches nothing, so it lands in the fast job and dies at import on «Invalid
  environment variables» — the fast job has no `DATABASE_URL` by design.

  Two real cases were caught this way and are currently pinned by hand in a
  `TRANSITIVE_DB_TESTS` list: `reference-doctype-parity.audit.test.ts` (MI-P5.3) and
  `mobile-retention.service.test.ts` (MC3.6). **That list is a patch, and it rots exactly
  the way the hand-maintained include list the config's own header warns about rots** —
  the next such test is found by a red CI run rather than by the classifier.

  Fix: resolve each test's import graph (the bundler already builds one) and mark it
  DB-backed if `@/lib/db` is reachable at any depth. Note `.service.test.ts` can never
  become a filename rule — most service tests are pure and belong in the fast suite, which
  is precisely why the text heuristic was chosen and precisely why it is insufficient.
  Safety property is unchanged either way: this suite is a strict SUBSET, so a
  misclassification can only make the fast job noisy, never drop coverage silently.

- [P13.8] **Give `pr-checks.yml` and `migrate-check.yml` a `workflow_dispatch` trigger**
  (filed at the CRM-P3 exit, owner-directed). Both declare only `on: pull_request`, so the
  ONLY way to fire them is a push (`synchronize`) or a PR state change. That was invisible
  until an Actions outage forced a re-dispatch on an unchanged head: `pr-full-checks.yml`
  could be dispatched and the other two could not — verified by attempting it, which
  returned «Workflow does not have 'workflow_dispatch' trigger».

  Consequence at a gate: re-running the checks without moving the head is impossible, and
  the workarounds are both bad — an empty commit moves the phase head off the SHA under
  test, and close/reopen fired nothing on the one occasion it was tried (cause unproven;
  `reopened` IS in the default type set for both, so the trigger list is not the
  explanation). CRM-P3 exited on the full run alone, which subsumes both jobs, but that
  should be a deliberate choice rather than the only option available.

  Fix: add `workflow_dispatch:` to both `on:` blocks. One line each, no job changes.

- [P13.9] **Self-hosted runner on our own VPS** (filed at the CRM-P3 exit, owner-directed —
  and framed by the owner as an ECONOMIC decision now, not a nicety).

  Two forces: this month's Actions bill reached **$28** (the account limit was raised
  $10 → $40 mid-CRM-P3 after a repo-wide outage where every workflow died in 5 seconds with
  zero steps executed), and the cold whole-graph typecheck is both slow and WIDELY variable
  on hosted runners — measured on three CRM heads: **20m58s (`f4fabf2`) → 31m44s
  (`79fa3ae`) → 43m32s (`8c171d0`)**, same graph, ±2 columns of change. That variance is
  the hosted runner's, not the code's, and it is billed per minute.

  **⚠️ READ THIS BEFORE THE NUMBERS BELOW — the ceiling saga was substantially a STALE
  TOOLCHAIN, not project size (2026-09-04).** Pinning `prisma@7.10.0` in place of the
  lockfile's `7.7.0` took the cold whole-graph typecheck from **44m13s (cancelled at the cap)
  to 5m31s** on the same head — roughly 8×, measured on CI, not inferred. 7.7.0's payload
  generics were what the compiler was drowning in; the schema had merely grown enough (627
  model/enum declarations after the CRM↔main merge) to cross the threshold where that
  mattered. Every duration recorded in this entry and in [P13.6] was taken under 7.7.0 and
  therefore measures a compiler struggling with a fixable dependency, not the honest cost of
  the codebase. The memory ceiling raises, the 90-minute cap, and much of the case built on
  those figures should be re-read in that light before anyone treats them as settled history.
  The self-hosted-runner argument is NOT dead — the runner-to-runner variance was real and
  independent — but it is now a far weaker economic case than these numbers made it look.

  **Fourth data point (CRM-P4 gate, 2026-09-03):** on `ab9e1bd` the full tier's
  `typecheck-cold` job ran 44m13s and was then **cancelled by its own
  `timeout-minutes: 45`** — no type error, just the cap. The same head had already passed
  the forced-fresh pre-push typecheck locally, and the sibling job (build + the ENTIRE
  suite incl. DB and walkthrough e2e) was green in the same run. The cap was raised
  45 → 90 (owner-authorized, one line in `pr-full-checks.yml`) because a cancelled run is
  not evidence in either direction under rule 11, so a ceiling the job routinely reaches
  manufactures ambiguity rather than preventing waste. Note what that costs on hosted
  runners: the ceiling that now permits a healthy run to finish also permits a thrashing
  one to bill 90 minutes. On our own runner the wall-clock is ours and the question stops
  being «how long may we afford to let it run».

  **Fifth and sixth data points (CRM-P6 closing runs, 2026-09-05) — the pin holds under a
  bigger graph, and the RUNNER VARIANCE is now the whole story.** Two cold whole-graph runs
  two heads apart, both from scratch with no cache restored: **7m07s** on `7f96efb`
  ([33981659322](https://github.com/hos321/elite-vet/actions/runs/33981659322)) and
  **5m18s** on `754c5ae` ([33983163439](https://github.com/hos321/elite-vet/actions/runs/33983163439)),
  the second differing from the first by one string constant. Set beside the CRM-P4 head's
  44m13s-at-the-cap and the 5m31s measured immediately after the pin, this says the 8×
  improvement was not a lucky measurement on a quiet runner: two more phases of code have
  landed since and the cold check still finishes in single-digit minutes. What remains
  visible is the ±34 % spread between two runs of the same graph — the hosted runner's
  variance, unchanged and still billed per minute. The 90-minute cap is now enormous headroom rather than a ceiling
  anything approaches, and the economic case for a self-hosted runner rests on
  runner-to-runner VARIANCE and on the build/test job — no longer on the typecheck, which
  was where most of the bill came from.

  Note the interaction with [P13.6] and [P13.7]: project references cut the working set,
  but the ceiling problem documented in CLAUDE.md rule 14 was always partly about the
  runner's memory. Owning the runner changes what is affordable to check, which may reopen
  decisions taken purely because a 16GB hosted box could not hold the program.

- [P13.10] **Path-filter the pre-push hook, mirroring rule 13's pre-commit filter**
  (filed at the CRM-P3 exit, owner-approved). The pre-COMMIT hook has been path-filtered
  since 2026-08-16 — it typechecks only when `.ts/.tsx/.mts/.cts/.prisma/tsconfig*.json`
  files are staged — after a screenshots-only commit paid the full 12GB run. The pre-PUSH
  hook never got the same treatment.

  So a docs-only push still pays the FORCED-FRESH typecheck (`rm -rf tsbuild`) plus the
  client build: roughly fifteen minutes to prove that two Markdown files did not break the
  type graph. `[CRM-P3.7]` — a commit touching only `BRD_CRM_Module.md` and this file —
  paid exactly that, and it is a recurring tax because every phase exit ends in docs.

  Fix: apply the same extension filter to the pre-push guard. Keep the forced-fresh
  behaviour for pushes that DO touch typecheckable files — that authority is the whole
  point of the two-speed gate (rule 13) and must not be weakened. This is a scope
  narrowing, not a relaxation: a push with zero typecheckable files has nothing to verify.

- [P13.11] **`Appointment.whatsappReminderEnabled` is a dead flag — identify its owner
  feature, then remove or implement it** (filed at the CRM-P4 verification pass,
  owner-directed; explicitly NOT to be repurposed by CRM).

  The public booking wizard shows a «تذكير واتساب» toggle, `booking-wizard.tsx` puts it in
  the draft, the handler writes the column — and **no send path reads it**. A customer ticks
  it today and nothing happens. `vaccination-reminder.ts` documents the situation in a
  comment and deliberately uses a `wa.me` link instead: «لا وعدًا بإرسال لا يحدث».

  CRM-P4 gives the system a WhatsApp transport for the first time, which makes the flag
  *wireable* — and that is exactly why it needs an owner decision rather than a quiet
  rewiring. CRM has its own `crmWhatsappProvider` setting (CRM-P0) and does not touch this
  one. Note the flag belongs to appointments/public-bookings, so honouring it would mean a
  clinic's CRM WhatsApp instance sending appointment reminders — a scope question, not a
  wiring question.

  Fix: decide with the appointments module's owner — implement it against the P4 provider
  abstraction, or remove the toggle and the column so the UI stops promising it.

- [P13.16] **Clinic holiday / closure calendar — cross-module, owner-decided.** (Filed at
  the CRM-P5 verification pass, 2026-09-05, owner-directed. Numbered 16 because 15 was
  already taken by the broken-typecheck finding the day before.)

  `ClinicSchedulingSettings` gives the clinic a working WEEK (`workDays`) and working HOURS
  (the morning/evening shift windows). It does not give it working DAYS-OFF: there is no
  holiday, closure or exception-date structure anywhere in the schema. `ClinicLeaveType` and
  `LeaveRequest` are STAFF leave — a person being away, not the clinic being shut.

  CRM-P5 deliberately does not add one. A holiday calendar is a clinic-domain concept that
  scheduling (no appointments on a closure day), staff (attendance expectations) and any
  future module would each want; a CRM-private table would have to be unwound and migrated
  the moment the real one lands. So CRM's SLA v1 counts working time from `workDays` + shift
  windows only, recorded as BRD §17.2 row 21.

  **The accepted v1 gap, stated plainly so nobody discovers it as a bug:** an SLA target can
  come due — and breach — on a day the clinic was closed for a public holiday, because the
  clock has no way to know. Whoever builds this should expect CRM's SLA to be its first
  consumer: the calculator is isolated in `crm-sla.rules.ts` precisely so that adding a
  closure-date source is one function's worth of change, not a sweep.

- [P13.15] 🔴 **HIGH — `main`'s typecheck cannot run at all: `package.json` calls a script that
  does not exist.** (Found 2026-09-04 while branching off `main`.)

      "typecheck": "bun scripts/run-exclusive.mjs typecheck bun run typecheck:raw"

  `scripts/run-exclusive.mjs` **has never existed in any branch of this repository** (checked
  with `git log --all -- scripts/run-exclusive.mjs`: no commits). It was introduced into
  `package.json` by `b35219b` (the inpatients module) and is still referenced by current
  `main`. So `bun run typecheck` on main dies instantly with «Module not found».

  **Both CI tiers call it** — `bun run typecheck` in `pr-checks.yml`, and `typecheck:cold`
  (which is `rm -rf tsbuild && bun run typecheck`) in `pr-full-checks.yml`. That is the simple
  explanation for something we had been attributing to test failures: **every** main-side
  branch shows a red `PR Checks` (`feat/pharmacy-module`, `feat/roles-and-permissions`,
  `chore/fix-new-modules`), and the inpatients and emergency modules merged into `main`
  without a working typecheck at any point.

  The pre-commit hook runs the same script, so nobody committing typecheckable files on a
  main-based branch can pass it either — which is presumably how the habit of bypassing it
  spread. It is also why [P13.13-SEC]'s prototype could not be committed on its own branch.

  The CRM branch is unaffected: it carries the plain `tsc -b …` command and no reference to
  the missing script, which is why its typechecks are green. **Merging the CRM branch would
  incidentally repair main's** — worth knowing, but it is not a reason to leave it: main
  should not depend on an unrelated feature branch to restore its own build script.

  Fix: either add the missing wrapper, or drop it and restore the direct command. Whoever
  wrote `b35219b` knows which was intended.

- [P13.13-SEC] 🚨 **SECURITY — `PATCH /staff-roles/:id/permissions` is gated by session only.**
  **MUST be closed before the first production deployment.** (Found at the CRM↔main merge,
  2026-09-03. Filed standalone by owner directive; deliberately NOT fixed inside the CRM
  branch. Owner 2026-09-04: it does not jump ahead of CRM-P5 **because no production
  deployment exists yet** — that is the whole of the reprieve. The capability is real today
  and the poisoned-role payout waits rather than expires, so the deployment that creates
  real tenants is the deadline, not a later phase boundary.)

  **The route.** `src/server/staff-roles/staff-roles.controller.ts` carries five routes behind
  a `requireClinic` macro that resolves a session and an `activeClinicId` and checks **nothing
  else**. One of them takes an arbitrary array of permission slugs:

      PATCH /api/staff-roles/:id/permissions   body: { permissions: string[] }

  The body is `t.Array(t.String())` — unvalidated against any catalogue — and the DAO writes it
  verbatim to `StaffRole.permissions` after confirming only that the role belongs to the
  caller's clinic. `POST /`, `PATCH /:id`, `DELETE /:id` and `GET /` are equally ungated.

  **What ANY clinic member can do today, with no admin rights:**
  1. **Rewrite any role's permission array in their own clinic**, including the role they hold —
     writing every slug in `ALL_PERMISSIONS` (accounting, payroll, CRM, pharmacy, everything).
  2. **Force-log-out every colleague holding that role.** `updatePermissions` deletes those
     users' sessions for the clinic (`session.deleteMany`) so the change takes effect. Any
     member can call it repeatedly: a denial-of-service primitive against the whole clinic.
  3. **Enumerate and rename roles**, and delete roles that have no staff attached.

  **What they CANNOT do today — why this is a LATENT escalation, not a live one.** The write
  no longer feeds authorization directly: since [RBAC P4] the session snapshot is built by
  `resolveActor()` from `StaffRoleAssignment → role.grants`, NOT from `StaffRole.permissions`.
  The legacy column reaches a session through exactly one surviving path —
  `invites.dao.ts` `acceptInvite`, which copies `staff.role.permissions` into
  `session.permissions` — and both ends of that path are admin-gated: creating an invite
  requires `ClinicUser.role === "ADMIN"`, and accepting one requires the session's email to
  match the invite's. **A plain member cannot complete the chain alone.**

  **But the trap is real and it fires later.** A member poisons a role's array today; weeks
  later an admin legitimately invites a new hire into that role; the invitee's session is
  created with the poisoned permissions — which the 23 controllers in [P13.14] honour. The
  attacker escalates *someone else*, at a moment no one connects to the original write.

  **Minimal fix shape** (not applied here):
  - Gate all five routes with an admin-tier permission (`rbac.*` is the natural home now that
    `/rbac` owns role editing; the legacy controller is kept only for compatibility until
    [RBAC P7] retires it).
  - Validate the slugs against the catalogue instead of accepting free strings.
  - Refuse granting a permission the actor does not itself hold — otherwise an admin-tier
    account with a narrow grant can still widen itself.
  - Consider deleting the legacy write path outright: nothing reads the column for
    authorization any more except the invite copy, which should read the resolver instead.

  **A prototype exists and was verified as far as it could be, then parked** (2026-09-04) —
  recorded here rather than left on a branch, because the branch could not be committed: on
  `main` the pre-commit hook cannot run at all (see [P13.15]). What it did, so resuming does
  not start from a blank page:
  - the route moved to `requirePermission: { resource: "rbac", action: "update" }` — the same
    gate the new editor's `PUT /rbac/roles/:id/grants` already carries. Two endpoints doing
    one job must not have two different doors.
  - a pure no-amplification rule, `unauthorisedGrants(actorPermissions, isSuperAdmin, current,
    next)`, returning the refused slugs. It compares **only what is being ADDED** (`next`
    minus `current`): removals always pass, since narrowing escalates nobody, and an entry
    already on the role is not re-litigated when someone edits a different one. Super-admin
    bypasses explicitly, so it can never later read as an oversight. The actor's held
    permissions come from `resolveActor()` at request time, not from the session snapshot —
    an escalation decision must not run on a snapshot that may have missed a revocation.
  - seven pure tests, green: self-elevation refused, held permission allowed, a subset cannot
    widen within one call, pre-existing entries retained, deletion allowed, super-admin
    bypass, duplicates deduped in the refusal.
  - `PENDING` for the file moved 5 → 4 (one of its five routes gated).

  **Still missing, and the reason it is not a fix:** the HTTP-level tests — plain member
  refused, admin-tier actor succeeds, subset-holder refused beyond their authority, and the
  force-logout side effect exercised so the trigger is known. Rule 12 is explicit that
  service-level green says nothing about what a user can reach, and this endpoint's entire
  defect lives at that layer.

- [P13.14] 🔴 **HIGH — the session permission format changed and 23 controllers still read the
  old one.** (Same investigation; present on `main` independently of the CRM branch — verified
  against `origin/main`, which has 21 of them.)

  [RBAC P4] changed `session.permissions` from a JSON **array of slugs** to a JSON **object**:
  `{ v: 1, staffId, branchId, isSuperAdmin, grants: { … } }` (`serialiseActor`). But 23 server
  controllers still carry their own copy-pasted parser:

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as string[]) : [];

  Given the new object, `Array.isArray` is false, so every one of them sees **zero
  permissions**. The only check that still passes is `session.role === "ADMIN"`.

  **Consequence on `main` today:** for every non-admin user, the features behind those
  controllers are denied — sales, grooming, invoices-finance, pharmacy-settings, marketing
  (campaigns/creatives), mobile-clinics (fleet/requests/reports) and more. A super-admin who
  is not also `ClinicUser.role === "ADMIN"` is denied too, since `isSuperAdmin` lives inside
  the snapshot these parsers throw away. It fails CLOSED — a functionality outage, not a hole —
  but it is a product-wide one, and it is invisible to the suites because every test injects
  the legacy array format directly rather than a real snapshot.

  CRM's controllers join this set the moment the CRM branch merges, for the same reason.

  **Fix shape:** one shared reader that accepts the snapshot (and the legacy array during
  transition), returning the effective slug list — then delete the 23 copies. A test that
  builds its session through `serialiseActor` rather than hand-written arrays is what stops
  this recurring; today not one test would notice.

- [P13.12] 🔴 **HIGH — the job runner has never run in production.** (Filed at the CRM-P4
  exit, owner-directed, and deliberately kept OUT of CRM-P4: the phase must not grow a
  scheduler.) This is not «CRM needs a cron». It is a live business defect that predates
  CRM by twelve accounting phases.

  **Nothing calls `runQueuedAccountingJobs`.** There is no cron, no worker process, no
  scheduled route, no platform scheduler config anywhere in the repo — `accounting-jobs.runner.ts`
  says so itself («when a real worker/cron lands, it calls `runQueuedAccountingJobs` on a
  schedule»), and that sentence has been true and unactioned since [P0.5]. The single
  exception is period closing, which enqueues and then runs its job INLINE from the user's
  request (`period-closing.service.ts:282`) — which is why closing works and nothing else
  scheduled does.

  **And nothing enqueues them either.** Verified by counting references: every one of the
  scheduled wrappers — `enqueueMembershipDaily`, `enqueueSubscriptionBilling`,
  `enqueueStatementSend`, `enqueueDailyRateFetch`, `enqueueFiscalYearRollover`,
  `enqueueAutoReconciliation` — has **zero call sites outside its own definition**. They are
  reachable only from tests. So the failure is doubled: the work is never queued, and would
  not be executed if it were.

  **What is inert in production today**, per module:

  | Job | Module | What silently does not happen |
  |---|---|---|
  | `MEMBERSHIP_DAILY` | MI (FR-M5.4) | renewal invoices, membership status transitions, period rolls, entitlement grants — plus the policy-expiry step (MI §8.3) and the nightly claim-cap audit (BR-I9.6) that ride the same handler |
  | `SUBSCRIPTION_BILLING` | Accounting (FR-17.2) | the nightly subscription billing run |
  | `PROCESS_STATEMENT_OF_ACCOUNTS` | Accounting (FR-17.4) | scheduled statements to customers |
  | `DAILY_RATE_FETCH` | Accounting ([P8.5]) | FX rates are never refreshed |
  | `FISCAL_YEAR_ROLLOVER` | Accounting (FR-12.5) | next fiscal year is never auto-created |
  | `AUTO_RECONCILE` | Accounting | payment auto-reconciliation |
  | `CRM_WHATSAPP_POLL` | CRM ([CRM-P4.5]) | inbound WhatsApp is never pulled from the provider queue |

  MI's row is the one that reframes the priority: **a clinic on a membership plan is not
  being billed for renewals and its members' statuses never advance.** That is money and
  contract state, not a missing notification, and it is wrong on `main` today — CRM-P4 did
  not cause it, it merely walked into it and could not honestly report an inbound path that
  works.

  Fix (design decision required, not a one-liner): give the runner a real trigger — a
  platform scheduler, a small worker, or an authenticated `POST /internal/jobs/run` an
  external scheduler hits — and, separately, the per-day/per-minute ENQUEUE step each
  scheduled job needs. The idempotency keys already make repeated firing safe by
  construction. Whatever lands must be observable: a run that fails silently is the state
  we are already in.

**Launch gate:** M4 + P13.3 zero-diff + one pilot client month-end closed on the new module.

---
## Phase → BRD coverage checklist (agent self-audit before closing a phase)
| Phase | Must satisfy |
|---|---|
| P2 | §6 pipeline steps 3,4,5,7,8 · AR-2 both modes · AC-8 |
| P3 | BR-5.2.1/2 · BR-4.3.3 · BR-4.10.1..3 |
| P4 | §8.1–9 all charge types · BR-8.1 · fixtures green |
| P5 | §7.2 posting map rows 1,2,3,4,6,7,10,11 · BR-7.2.1..5 · AC-1/4/5 |
| P6 | §7.3 map rows 1,2,3,6,7,8 · BR-7.3.1..3 |
| P7 | §7.4 full · BR-7.4.1..6 · §10.1/10.3 · §11.1–2 · AC-2 |
| P8 | §9 + BR-7.4.4 modes · AC-3 |
| P9 | §18.1 engine invariants · §18.3 on PLE only |
| P10 | §12 all + §13 + §4.5 · AC-6/7 |
| P11 | §14 flows + BRS math |
| P12 | each sub-item's BRD section, flags default off |

*End of phases file.*
