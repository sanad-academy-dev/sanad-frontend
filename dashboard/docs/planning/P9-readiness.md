# P9 Readiness Dossier — Financial Reporting Engine (→ M3)

> **Status:** planning document, written at the P8 exit (docs only — no P9 code). Mirrors
> the P8 dossier's shape: what exists, how each task lands, a hand-checkable scenario,
> and the risk list. **Law:** BRD §18 (18.1 engine · 18.2 ledger reports · 18.3 AR/AP on
> PLE) · `IMPLEMENTATION_PHASES.md` [P9.0]–[P9.5] · phase-acceptance row "§18.1 engine
> invariants · §18.3 on PLE only".

## 1. What already exists (absorb, don't rebuild)

| Piece | State | P9 disposition |
|---|---|---|
| Account tree with nested set (`lft`,`rgt`, BR-4.3.2 re-compute on move) | live since P1 | **REUSE** — the §18.1 subtree aggregation is a `lft BETWEEN root.lft AND root.rgt` range filter; no new tree code |
| `reports/general-ledger` + running balance | live (P2, tested) | REUSE as the drill-through target |
| Trial Balance (`reports/trial-balance.service.ts`) | live, engine-less (per-account sums) | **ABSORB** — [P9.2] re-bases it on the shared engine (same output, engine-driven periods/opening) |
| Party TB + payment-ledger audit (`party-*`) | live (P3.6) | keep as-is; the AR/AP report ([P9.3]) supersedes neither |
| Registers + payment reports | live; suites arrive with [P9.0] | untouched by the engine (document-level reports) |
| `getVoucherOutstanding` / `listPartyOpenVouchers` (PLE seams) | live, FX-aware since P8 | **THE** data source for [P9.3] — §18.3 is "on PLE only" by law |
| Tri-currency GL + `balance_must_be` + `is_opening` + PCV hook stubs | live | engine inputs; PCV-closing exclusion stays a no-op until P10.2 |
| `accumulated_values`, periodicity, FB filters | nothing yet | new in [P9.1] |

## 2. How [P9.1]→[P9.5] land

- **[P9.0]** (owner-scheduled hardening, riding PR #90): amend/update suites + register/report suites — no design content, see the phases file.
- **[P9.1] Shared statement engine** — new `src/server/accounting/reports/statement-engine/`:
  - `period-list.ts` (PURE): (fromDate, toDate, periodicity M/Q/H/Y, FY-aware labels) → period[]. Unit-testable without DB.
  - `tree-aggregate.ts` (PURE): rows of (accountId, periodIdx, sum) + the account tree (id, parent, lft, rgt, depth, balanceMustBe, isGroup) → leaf→parent accumulation, zero-row drop toggle, depth indent, per-root totals, credit-nature sign presentation. Pure = the golden-fixture discipline of P4 applies.
  - `statement-data.ts` (DB): one grouped GLE scan per root_type — `groupBy accountId` with `postingDate` bucketing into the period list; `is_cancelled=false`; **opening** = BS roots get a pre-from_date bucket (closing-balance snapshot fast path deferred to P13 load work — logged); P&L excludes `isOpening` rows; PCV exclusion behind a flag that stays off until P10.2.
  - `accumulated_values` = post-pass running sum over period columns (pure).
- **[P9.2] BS / P&L / Cash Flow / TB-on-engine** — thin composers over [P9.1]: BS = ASSET/LIABILITY/EQUITY trees + **provisional profit line** = (Income − Expense) for the range, injected as a synthetic equity row *pre-PCV* (that is why it's "provisional"; P10.2's closing empties it). Cash Flow = indirect: net profit + deltas of default-mapped BS buckets (mapper table in code, custom templates stay [P2]). TB re-based on the engine with opening/closing columns.
- **[P9.3] AR/AP + Summary** — rows from the PLE only: per outstanding voucher (posting/due date, invoiced, paid, CN, outstanding — all account-currency + base since P8), ageing buckets by `ageing_based_on` (Posting | Due | Bill) with configurable ranges (default 30/60/90/120, labels auto `0-30…121-Above` — a PURE bucketing function + unit suite). Summary = group-by-party roll-up of the same rows. Drill-through = link to GL report filtered by (account, party).
- **[P9.4] Ledger summaries + Gross Profit + trends + debug pair** — document-level queries in the register family style; Gross Profit's valuation source = purchase rate (pluggable seam for the stock module, per the phases file). "Voucher-wise Balance + Invalid Ledger Entries" = the reconciliation debug pair: Σdebit−Σcredit per voucher ≠ 0 and PLE-vs-GL drift — cheap queries, high diagnostic value.
- **[P9.5] Platform features** — column presets + saved filters (client-side, Zustand-persisted), XLSX/PDF export (XLSX via a worker-safe lib — **decision needed**: none is in the bundle today; candidate `xlsx` vs building CSV-only first), scheduled email stays [P2].

## 3. Hand-checkable Balance Sheet scenario (the [P9.2] acceptance)

Seed (fixture, base currency, FY = 2026):
1. Opening JE (isOpening, Jan 1): Dr Cash 10,000 / Cr Equity-Opening 10,000.
2. SINV 1,000 + 15% VAT (Feb 10) → Dr AR 1,150 / Cr Income 1,000 / Cr VAT 150.
3. Receipt 500 (Mar 5) → Dr Cash 500 / Cr AR 500.
4. Expense JE 200 (Mar 20): Dr Expense 200 / Cr Cash 200.

Balance Sheet as of Mar 31 (single period):
- **Assets**: Cash 10,000 + 500 − 200 = **10,300**; AR 1,150 − 500 = **650** → total **10,950**.
- **Liabilities**: VAT payable **150**.
- **Equity**: Opening **10,000** + **provisional profit 800** (Income 1,000 − Expense 200) → **10,800**.
- Check: 10,950 = 150 + 10,800 ✓. Quarterly periodicity over Q1 splits the same figures into 3 columns; `accumulated_values` makes column 3 equal the figures above. P&L for Q1 shows 1,000 / 200 / 800 and EXCLUDES the opening JE.
- AR ageing (as of Mar 31, based-on Posting): SINV outstanding 650 in bucket **31-60** (49 days old). AC-1's bucket assertion generalizes here.

## 4. Risk list

| # | Risk | Mitigation |
|---|---|---|
| 1 | **Period bucketing in SQL vs JS**: one groupBy per (account, period) needs date-bucket expressions Prisma can't produce portably. | Scan once per root ordered by postingDate, bucket in JS (Decimal sums) — NFR-3-scale tuning deferred to P13.1 with the 1M-GLE generator; log the choice. |
| 2 | **Provisional-profit line double-counts once PCV lands** (P10.2 closes Income/Expense into equity). | The line computes from P&L accounts' NET for the range; post-PCV the closed period nets to zero by construction — add the invariant test now so P10.2 can't break it silently. |
| 3 | **balance_must_be sign presentation** flips credit-nature roots; TB-on-engine must keep the CURRENT TB output (tested) bit-identical. | [P9.2] re-base ships behind the existing endpoint with the old suite kept green — absorb, don't fork. |
| 4 | **Mixed-currency columns in AR/AP**: P8 made party balances genuinely dual-figure. | §18.3 rows carry BOTH account-currency and base columns from the PLE (already stored); summaries sum BASE only. |
| 5 | **XLSX export dependency** (no spreadsheet lib in the bundle; client-bundle guard). | Decision needed (see §2 [P9.5]); default = CSV now, XLSX behind a lazy-loaded chunk if approved. |
| 6 | **Report performance without the closing-balance snapshot** (BS opening = full pre-range scan). | Acceptable at current volumes; snapshot fast path is P13.1's; index audit rides the same task. |

## 5. Suggested commit slicing

[P9.1a] pure period-list + tree-aggregate + suites → [P9.1b] statement-data scan + engine assembly → [P9.2a] TB re-base (old suite green) → [P9.2b] BS + provisional-profit invariant → [P9.2c] P&L + Cash Flow → [P9.3a] pure ageing bucketing → [P9.3b] AR/AP + summary + drill-through → [P9.4] summaries/GP/trends/debug pair → [P9.5] presets/exports → screens per hub rules (§7.8) → exit report.
