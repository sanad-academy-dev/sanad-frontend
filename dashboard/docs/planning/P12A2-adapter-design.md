# [P12A.2] C3 Posting Adapters — design (binding for the implementation)

Owner emphases (2026-08-15): the parallel-run **zero-diff report is the deliverable**;
adapters are **additive & reversible** (operational modules untouched, per-adapter
kill-switch); **shared source-module interface** so POS plugs in later without reshaping
Invoice/Expense. Acceptance: zero diff on the seeded scenario AND a generated
realistic-volume year (dev-only generator, re-runnable at any volume).

## 1. Shared interface (the POS-proof seam)

`src/server/accounting/adapters/adapter.type.ts`:

```ts
type SourceModuleAdapter = {
  key: "clinic_invoice" | "expense";        // "pos_sale" registers here later (B)
  flagKey: string;                          // accounts-settings kill-switch
  /** eligible + not-yet-posted source docs in a range (posting-date ordered) */
  collectPending(clinicId, range, tx): Promise<SourceDoc[]>;
  /** pure §6-shaped rows for ONE source doc (balanced; throws = doc skipped+reported) */
  buildGlMap(doc, accounts): GlMapRow[];
  /** the reconciliation legs: source-side totals vs adapter-posted GL totals */
  reconcile(clinicId, range): Promise<AdapterReconciliationReport>;
};
```

Registry `adapter-registry.ts` mirrors the accounting-jobs registry. The RUNNER is
generic: flags → collectPending → buildGlMap → post via the §6 engine → record — an
adapter only describes its documents.

## 2. Posting mode — direct GL under the source doc's own identity

Adapter postings go through the **§6 GL engine directly** with
`voucherType = "clinic_invoice" | "expense"`, `voucherNo = <operational code>`,
`voucherId = <operational id>` — NOT wrapped in Journal Entries. Reasons: (a) ERPNext
parity — source docs post their own GLEs; (b) the parallel-run report joins source↔GL on
the source id, trivially; (c) no C7 series consumed per posting, which matters at volume.
Cancel/refund follows AR-2 append-only reversal of exactly that voucher's rows.

**Idempotency ledger** (new table, the adapter's ONLY schema footprint):
`adapter_posting { id, clinicId, adapterKey, sourceId @unique(adapterKey,sourceId,clinicId),
sourceCode, postedAt, postingDate, amount, reversedAt? }` — collectPending anti-joins it;
reversal marks `reversedAt` and appends reversal GLEs.

**Batching:** the runner processes docs in chunks (default 50) — each chunk one DB
transaction, each doc's rows balanced independently (NFR-1 holds per document, atomicity
per chunk is stronger). Keeps the realistic-volume run inside CI budgets.

## 3. The two v1 adapters

**clinic_invoice** (trigger = operational `Invoice` with `status PAID`/`paidAt` set —
cash-basis at the adapter seam; unpaid operational invoices are NOT posted in v1, logged
below): Dr cash/bank (by `paymentMethod` → MoP-style mapping, default §4.1 cash/bank),
Cr income (§4.1 `defaultIncomeAccountId`), Cr VAT (`vatAmount` → adapter VAT account
setting). Refund/cancel after posting → AR-2 reversal.

**expense** (trigger = approved/paid `Expense`): Dr expense (§4.1
`defaultExpenseAccountId` v1 — per-category mapping is a later refinement), Cr cash/bank.

Account resolution failures are per-doc errors in the run result — never silent skips.

## 4. Flags (contract §8 log — the reversibility guarantee)

- `enable_clinic_invoice_adapter` (default OFF)
- `enable_expense_adapter` (default OFF)

Flag OFF ⇒ runner refuses (Arabic error), collectPending never runs, operations
completely unaffected. Already-posted GLEs stay (books are append-only); the
reconciliation report is the tool that shows what a flag-off froze.

## 5. Parallel-run zero-diff report (THE deliverable)

Per adapter × range: source-side rows (each operational doc: code, date, amount, VAT,
status) vs adapter-GL rows (posted amount per source id), with per-doc diff and totals:
`sourceTotal`, `postedTotal`, `unpostedDocs[]`, `orphanPostings[]`, `residual`
(= sourceTotal − postedTotal). **Zero-diff = residual 0 AND both lists empty.**
Surface: report endpoint + a «تشغيل المحول» + report screen (folded into this task's UI
budget; placement التقارير المالية for the report, run-control in الحوكمة).

## 6. Realistic-volume generator (dev-only)

`prisma/generate-operational-volume.ts` (+ script `db:generate:operational-volume`,
NEVER imported by seeds): args `<clinicId> [invoices=3000] [year=2025]`. Spreads
operational invoices over 12 months across N generated owners with a status mix
(~55% PAID, 15% PARTIALLY_PAID, 15% PENDING, 10% CANCELLED, 5% REFUNDED — paid docs get
`paidAt`), VAT-rate variety, plus expenses (~15/month). Deterministic from a seeded RNG
so re-runs are comparable. CI acceptance runs the same generator at a smaller volume
(hundreds) through import→adapter→report and asserts residual 0 / empty lists; the
owner's manual review runs it at thousands via the script.

## 7. Explicitly deferred (logged)

- POS adapter (Bucket B; registers as a third adapter, zero interface change).
- Near-real-time posting hooks in the operational payment path — v1 posts via
  on-demand/scheduled sweep runs (additive; no operational code touched).
- Unpaid-invoice accrual posting (operational invoices carry no due-date/party-account
  semantics; accrual parity arrives only if the pilot needs AR from the operational side).
- Per-expense-category account mapping.
