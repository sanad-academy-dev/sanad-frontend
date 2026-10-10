# Opening-Balance Migration Guide ([P12A.1], FR-17.3)

How to bring an existing clinic's books onto the accounting module. Order matters —
each step assumes the previous one is verified.

## 0. Prerequisites

- Chart of accounts loaded («دليل الحسابات») and a default cost center set in
  «إعدادات المحاسبة» (§4.1) — the opening tool refuses rows without a cost center.
- **Default receivable AND payable control accounts set** (§4.1, BR-4.10.1). The tool
  pre-flights both sides per party: an unconfigured side has its rows refused up front
  (nothing half-built), and «الحوكمة → الافتتاح» banners the missing side before you
  paste a batch. AP migration in step 2 silently depends on this — a clinic that skips
  the payable account gets every purchase row rejected.
- Fiscal year covering the opening date exists («السنوات المالية»).
- Party masters exist: Owners (customers) and Suppliers you will carry balances for.

## 1. Opening trial balance (everything EXCEPT open AR/AP detail)

Post ONE Journal Entry with `voucherType = "Opening Entry"` dated the day before go-live:

- Debit every asset account its opening balance; credit every liability/equity account.
- Leave the AR/AP **control** accounts OUT of this JE — their balances arrive in step 2
  with per-invoice detail. If you must balance the JE meanwhile, park the AR/AP totals on
  «الافتتاح المؤقت» (the TEMPORARY account); step 2 empties it invoice by invoice.
- BR-7.1.3: the Opening Entry stamps `is_opening` on all its GLEs, so P&L reports never
  see these rows.

## 2. Open AR/AP detail — «الحوكمة → الافتتاح» (this tool)

One grid row per open legacy invoice: type (مبيعات/مشتريات), party, original posting
date, original due date (this is what makes ageing correct), the legacy invoice number
(kept as the item label + remarks — our C7 numbering assigns its own `documentNo`), and
the OUTSTANDING amount (not the original total — only what is still owed).

Each row becomes a submitted `isOpening` invoice: AR/AP control gets the party leg (with
a payment-ledger entry carrying the due date), and the counterpart posts to
«الافتتاح المؤقت». Per-row failures are listed under the grid; fix and resubmit only the
failed rows (resubmitting a succeeded row would double it — the tool does not dedupe).

## 3. Verify

- «ميزان المراجعة» at go-live date: equals the legacy closing TB, and «الافتتاح المؤقت»
  nets to **zero** if step 1 parked AR/AP totals there (else it carries −AR+AP by
  construction — either way it must equal the amount you parked, minus what step 2 moved).
- «أعمار الذمم»: buckets match the legacy ageing (due dates drive the buckets).
- «قائمة الدخل» for any pre-go-live range: EMPTY — opening rows never touch performance.

## 4. Notes

- The TEMPORARY account is auto-created as «الافتتاح المؤقت» (ASSET root, type TEMPORARY)
  on first run; ERPNext parity.
- Partial payments in the legacy system: enter the REMAINING outstanding, not the
  original amount — the module tracks settlement only from go-live forward.
- Multi-currency openings: not supported by the tool in v1 — post foreign-currency
  openings as multi-currency JEs instead (P8.1), or ask before inventing a flow.

---

# Migrating off an existing ERP ([P13.4])

Everything above assumes you can hand-post the opening entry. A clinic arriving from
another system (Positive ERP or anything else) has more rows than anyone will type, so
the module accepts the two artefacts every ERP can export.

## A. Chart of accounts — CSV

«دليل الحسابات → استيراد» ([P1.3]). Map the legacy chart to the template's columns before
importing; the importer validates parents before children and reports per-row errors, so a
mapping mistake fails loudly instead of producing an orphaned account.

**Keep the legacy account number in `Account Number`.** Everything downstream — the
opening trial balance below, and any reconciliation you do during the parallel run — keys
on it. Renumbering during migration is the single change that makes every later comparison
manual.

## B. Opening trial balance — CSV ([P13.4])

`Account Number,Debit,Credit,Party Type,Party,Remark` — one row per account, amounts on
ONE side only.

**The importer refuses an unbalanced file, and that refusal is the point.** An opening
entry that does not foot means the clinic's very first balance sheet is wrong, and it
stays wrong through every period after it, because nothing downstream re-derives an
opening. The difference is reported with both totals rather than absorbed into a rounding
account: a mismatch is a fact about the source data that only the clinic can resolve.

Rows are also refused when they carry a debit AND a credit (almost always a spreadsheet
formula that leaked — netting it silently would hide the mistake inside a correct-looking
total), when they carry no amount at all, and when a party type appears without its party.

Leave AR/AP control accounts out of this file; they arrive in step 2 above with per-invoice
detail.

## C. Parallel-run checklist — the first month

Run both systems over the same month. Do NOT decommission the old one until every line
below is signed off, because the only honest test of a migration is that two independent
systems agree on the same period.

| # | Check | Where | Passes when |
|---|---|---|---|
| 1 | Opening TB matches | «ميزان المراجعة» at go-live − 1 | Every account equals the legacy closing balance |
| 2 | «الافتتاح المؤقت» empty | «ميزان المراجعة» | Zero after step 2 finishes — a residue means AR/AP detail is incomplete |
| 3 | Revenue agrees | «قائمة الدخل» vs legacy P&L, same range | Totals match; investigate ANY difference, however small |
| 4 | AR ageing agrees | «أعمار الذمم» vs legacy ageing | Bucket totals match — due dates, not posting dates, drive these |
| 5 | AP ageing agrees | «أعمار الذمم» (payable side) | As above |
| 6 | Bank agrees | «مطابقة البنك» | Closing balance matches the statement in BOTH systems |
| 7 | Tax agrees | «سجل المبيعات» tax columns vs legacy VAT return | Same taxable base and same tax — a mismatch here is a filing risk, not a cosmetic one |
| 8 | Adapters reconcile | «الحوكمة → المحولات» zero-diff report | Zero difference for every enabled adapter (§C3) |
| 9 | Month-end closes | «إقفال الفترة» | The PCV posts and the balance sheet still balances after it |

**If any line disagrees, the migration is not done** — find the cause rather than adjusting
the new system to match. An adjusting entry that makes a report agree without explaining
why is how a migration error becomes permanent.
