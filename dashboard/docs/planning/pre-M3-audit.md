# Pre-M3 Audit — Accounting Module as Built (P0–P7)

> **Status:** read-only audit at the M2 gate (PR #89 head `2f16192` + the P8 dossier
> commit). Findings ranked for triage; no fixes were applied in the audit itself.
>
> **Disposition (owner decisions, same day):** F1+F2+F3 fixed as the `[M2-fix]` commit on
> #89 (signed `toNano`, ribbon via `diffAmountStrings`, register stats via
> `formatAmount`/`valueLabel`, CI-locked by `amount-strings.test.ts`). F10 resolved by
> contract amendment — standing rule 5 is now Arabic-first with the full-EN pass at
> [P13.5]. F4+F5 scheduled as [P9.0] pre-M3 hardening. The P8 dossier (incl. the PLE-copy
> audit-first task and the four EGOL hook sites) was accepted as the implementation plan.
> Remaining findings (F6–F9, F11) stay open for the post-M2 polish batch.

---

## Ranked findings

| # | Severity | Finding | Where |
|---|---|---|---|
| F1 | **Correctness — walkthrough-visible** | The payment sheet's «غير المخصص» ribbon **always shows the full paid amount**, ignoring typed allocations: it computes `sumAmountStrings([paid, "-allocated"])`, but `toNano` rejects negative strings (regex `^\d+…`) and silently returns `0n`, so the negative term vanishes. Verified by execution: `sumAmountStrings(["100","-40"]) === "100"`. `diffAmountStrings` exists for exactly this and is used correctly in the JE sheet. Server math is unaffected (`headerData` recomputes) — display only, but it will be visible during the M2 click-through. One-line fix when authorized. | `payment-entries/components/payment-entry-sheet.tsx:176` (display at `:645`); root cause `utils/amount-strings.ts:7` |
| F2 | **Correctness — same root cause** | The invoice list pages' «المستحق» stat sums `outstandingAmount` of all submitted rows with `sumAmountStrings` — standalone credit/debit notes carry **negative** outstanding (PLE-derived), which `toNano` zeroes, so the stat **overstates** open AR/AP whenever an open CN/DN exists. | `sales-invoices-page.tsx:79`, `purchase-invoices-page.tsx:77` |
| F3 | **Correctness — C2 violation** | Register report stats do JS float math on ledger money: `Number(Number(totals.netTotal).toFixed(2))`. Violates contract C2 (no JS float touches an amount). Shared bug: P6.5 copied the P5.8 pattern verbatim. | `reports/components/sales-register-page.tsx:64,69,74`; `purchase-register-page.tsx:66,71,76` |
| F4 | 🟡 **TESTS WRITTEN 2026-08-20, NEVER RUN** — was: **Test gap — highest ledger risk**. `voucher/amend-paths.db.test.ts` covers the sales-invoice and payment-entry amend clones and the draft-update recompute. The assertion is on the LEDGER, not the clone's shape: cancel → amend → submit unchanged → the amendment's GL must match the original account-by-account and figure-by-figure, because a field the hand-written clone drops moves a number and nothing else in the project catches that. Also pinned: amend refuses a non-cancelled document, draft update re-runs the §8 calculator (250→400, 225→360 with a 10% discount), and AR-1 refuses an out-of-whitelist edit on a submitted document with nothing written. **It is DB-backed and CI is billing-blocked, so it has never executed** — it is typecheck-clean and will run on the first green full tier. Purchase invoice is the sales mirror and is deliberately not duplicated. | The **amend + update paths of all three heavyweight vouchers are completely untested**: `amendSalesInvoice`/`amendPurchaseInvoice`/`amendPaymentEntry` and all three draft-`update*` functions have zero direct calls in any suite (only generic voucher amend and JE amend are tested). These clone items/taxes/schedules/advance rows and re-run totals — a mis-clone posts a wrong ledger on the amended submit. | `sales-invoice.service.ts:497,990`; `purchase-invoice.service.ts:498,1000`; `payment-entry.service.ts:484,799` |
| F5 | **Test gap** | All three report-service files with real aggregation logic have **zero tests**: sales register (328 lines, dynamic tax-head pivots), purchase register (343), payment reports (214). These are the numbers accountants reconcile against. | `reports/sales-register.service.ts`, `purchase-register.service.ts`, `payment-reports.service.ts` |
| F6 | **Test gap** | `reconciliation.service.ts` guard branches untested: amount≤0, wrong-party, credit-insufficient, missing `differenceAccountId`, "no PLE row to write off", and the PE-vs-JE branch divergence. The 4 existing tests cover the happy path + batch isolation + over-allocation + write-off only. This function writes settlements directly. | `payment-entry/reconciliation.service.ts:94,110,124,142,190,208` |
| F7 | 🟡 **PARTLY RESOLVED 2026-08-20** — was: **Standard violation**. The structural cause is gone: the `Amount` component's three byte-identical copies are now one shared `AccountingAmount` (`features/accounting/components/accounting-amount.tsx`), which FORMATS by default — passing a raw `Decimal(21,9)` string was the actual defect, so the safe thing is now what happens when you do nothing. `payment-reports-page` no longer prints raw ledger strings or `isoDay` in cells (`isoDay` stays in its CSV, where a machine-readable date is right). `payment-reconciliation-page` had already been brought to `formatAmount`/`formatDisplayDate` since the audit. **Still open:** `table-fixed` + explicit column widths on both screens — that is a layout change wanting a visual pass. | Reconciliation panes + payment-reports tables deviate from the [P5-UI-fix] table standard: no `table-fixed`/column widths, bare `formatAmount` or **raw server strings** for money (no thousands grouping, no «ر.س»), `isoDay` dates in cells vs `formatDisplayDate` everywhere else. Structural cause: the `Amount` component is **copy-pasted 3×** (sales/purchase/payment tables) instead of shared, so the new screens had nothing to import. | `payment-reconciliation-page.tsx:175,211,235,257`; `payment-reports-page.tsx:176,214,237,263–275`; Amount copies at `sales-invoices-table.tsx:103`, `purchase-invoices-table.tsx:82`, `payment-entries-table.tsx:79` |
| F8 | **Test gap** | No HTTP-layer test anywhere in the module: nothing proves each route actually wires the permission macro (a route missing `permission:` passes every existing test). Biggest surface: `reports.controller.ts` (11 GET routes). Also untested: `coa-import.service.ts` DB commit (`commitCoaImport`, `applyStandardChart` — a corrupt nested set poisons every tree roll-up) and `tax.service.ts` (305 lines, account validation feeding GL). | `permissions/accounting-permissions.macro.ts`; `account/coa-import.service.ts`; `tax/tax.service.ts` |
| F9 | ✅ **RESOLVED 2026-08-20** — was: **Minor consistency + hygiene** (the CSV half turned out to be a real formula-injection vulnerability, and it lived in FOUR copies). One shared encoder at `src/lib/csv.ts`, injection-escaped and BOM-tested (`csv.test.ts`, 11 cases); the three duplicate `cell()` copies deleted and their exporters delegated; payment-entries now exports the Arabic status label like its P5/P6 twins; and `csv-single-encoder.audit.test.ts` fails if any new file builds a CSV by hand. Numbers are exempted from escaping ON PURPOSE — `-500` must stay summable — and that exemption is what the test exists to protect. | CSV exports: payment-entries exports the raw status enum (`SUBMITTED`) where P5/P6 export the Arabic label; `export-csv.ts` has no formula-prefix escaping (`=`,`+`,`@` cells export raw — CSV injection into Excel) and no tests pinning the BOM/quoting contract. `amount-strings.ts` itself is untested (see F1/F2). | `payment-entries-page.tsx:144`; `utils/export-csv.ts`; `utils/amount-strings.ts` |
| F10 | **i18n — two regimes** | ar/en key parity is **clean** (598 = 598, zero diff). But the module runs two contradictory i18n regimes: P0-era screens (voucher-demo, settings) + nav are fully bilingual via `t()`; **every P5+ screen hardcodes Arabic** (~1,249 Arabic-string lines module-wide). P6/P7 are perfectly consistent with the P5 precedent — no screen breaks rank — but standing rule 5 ("every screen bilingual") is currently satisfied only by the P0 screens and nav. Additionally ~24 `labelKey`s declared in `accounting-status.ts` exist in **neither** locale file (dormant — screens read the hardcoded `.label` sibling). | `utils/accounting-status.ts:62–215`; all P5+ feature folders |
| F11 | **Cosmetic** | Hardcoded `text-rose-500` for required-field asterisks instead of the `text-destructive` token (app-wide idiom predating P6/P7, not a regression). `payment-reports-page` lacks the Stats block its register twins have. No purchase-invoice print route (accepted P6 scope decision — the P7 payment voucher is the printable AP document). Two stale comments say "stub → P3.2" above hooks that have been live since P3.2. | `payment-entry-sheet.tsx:266,331,377`; `purchase-invoice-hold-dialog.tsx:73`; `gl-cancel.service.ts:335`; `gl-engine.service.ts:637` |

**Triage note:** F1 is the only finding a walkthrough user will *see misbehave*; F2/F3
misstate stats quietly; F4–F6 are latent ledger risk, not known bugs. Nothing found
violates the ledger-safety invariant or the phase plan.

---

## 1. Contract §7.9 — deferred-hooks ledger: **in sync with the code**

All 12 rows marked ✅ live were re-verified against implementations (PLE derivation +
reversal, party rules, disabled accounts, CC allocation split, merge/`_skip_merge`,
negative toggling, postable/frozen/FY checks, balance_must_be, allowance + auto round-off,
cancel row-locking, both AR-2 modes). The 5 unchecked rows all belong to **P10.x** (not
yet due): 4 have their named seam functions already defined and wired into the pipeline
in contract-specified order with empty/pass-through bodies (`validateBudgetHook` P10.3,
`dimensionOffsettingHook` P10.4, `validateAccountingPeriodHook` P10.1, `validatePcvHook`
P10.2); the 5th (dimension filters + mandatory-BS/PL, P10.4) correctly has **no seam
yet** — matching its distinct "pending" vs "stub" status. No P7-owned stubs remain
(restated from the P7 exit report; FX gain/loss JE auto-cancel is P8's half of BR-7.4.4 —
its landing plan is §3 of `P8-readiness.md`).

## 2. Leftover markers: all intentional, zero rogue TODOs

No TODO/FIXME/HACK markers, dead code, or unimplemented endpoints anywhere in the audited
scope. Every deferral comment names its owning phase and matches the plan: the P10.x
engine stubs, the P8 single-currency notes (invoice/PE GL composers, get-outstanding,
unreconcile's BR-7.4.4 seam note, rate-provider third step), the finance-book flag-off,
the owner-directed valuation stub (with its guarding test), and the declared-up-front
registries (job types, special permission roles, §19 settings with phase metadata — all
seeded now, consumed by their phases, per P0 design). Only blemish: the two stale
"stub → P3.2" comments (F11) describing hooks that are long live.

## 3. UI standard: list screens are faithful twins; the deviations cluster in reports/reconciliation

`purchase-invoices-{table,page}` and `payment-entries-{table,page}` pass every check of
the [P5-UI-fix] standard (table-fixed + widths, Amount with separate LTR «ر.س»,
FiltersMenu, `sumAmountStrings` stats, status via the one map, `DropdownMenu dir`).
**RTL is clean**: every portaled Radix surface in P6/P7 (17 Selects/Combobox contents +
the form sheet) carries explicit `dir` — zero missing-dir findings. The deviations (F3,
F7, F9) live in the **register/reports family and the reconciliation screen**, and most
are inherited P5.8 patterns faithfully copied — consistent with precedent, deviant from
the stated standard. The structural fix is one shared `Amount` extraction (F7) plus a
register-family pass.

## 4. Test coverage: core ledger is fortified; edges are thin

Well-covered (no action): GL engine + cancel (both AR-2 modes, partial cancel, freeze
roles), PLE sign matrix, naming-series gap-free concurrency, tax calculator (8
hand-computed + ≥40 golden fixtures), PE lifecycle + the two concurrency races, advances
FIFO/double-spend, unreconcile round-trip, both invoice status engines, BR-10.4 both
branches, jobs runner idempotency, permissions matrix/guard (pure), number-to-words.

Thin spots, in risk order: **amend/update paths (F4)** → **report services (F5)** →
**reconciliation guards (F6)** → **controller/macro HTTP layer + coa-import commit +
tax.service (F8)** → client pure utils `amount-strings` / `export-csv` (F9; F1/F2 are
the proof the gap bites). Suggested shape for each is one small table-driven suite per
item; none blocks M2.

---

## Recommended sequencing (when fixes are authorized)

1. **Pre-walkthrough candidate:** F1 alone (one line, `diffAmountStrings`) — owner's call,
   since the M2 script will surface it.
2. **Post-M2, pre-P8 batch ("M2 polish"):** F2+F3 (money-display correctness), F7's
   `Amount` extraction + register-family pass, F9 export hygiene, F11 stale comments.
3. **Fold into P8 kickoff:** F4 amend suites (P8's PLE-mover audit re-runs P7 suites
   anyway — cheapest moment), F5 report suites (P8 adds currency columns to the same
   files), F6, F8.
4. **F10 (bilingual screens):** a standing-rule conflict to resolve with the owner —
   either amend rule 5 to bless the Arabic-only precedent or schedule a dedicated i18n
   pass; not a per-phase fix.
