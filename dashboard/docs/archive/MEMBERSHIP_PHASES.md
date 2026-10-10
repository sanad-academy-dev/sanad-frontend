# Implementation Phases — Membership & Care Plans Module
Companion to `BRD_Membership_Module.md`. All `FR/BR/NFR/AC/§` references point there.

## How the AI agent must work with this file
1. Execute phases **in order**. Do not start a phase before its dependencies' exit criteria pass.
2. One task `[Mx.n]` = one commit referencing its BRD sections.
3. **Inherits every standing rule from the accounting module:** the design-system contract, the navigation placement law, the verification trio (seeded scenario + CI pin + manual walkthrough), rule 11 (CI cells only from concluded runs), rule 12 (a walkthrough is evidence only when executed through the product's own surface), rule 13 (one typecheck at a time), and the three-layer gate (services → HTTP → UI).
4. **The module never writes `gl_entry` rows.** It builds `gl_map` and calls `makeGlEntries`. Any temptation to shortcut this is a design error.
5. No JS floats in entitlement or money math — decimal strings/`Decimal` only.

## Prerequisite (must be done before M1)
**[M0] Deferred revenue in the accounting module** — the accounting `[P12.2]` item. Without it there is no recognition mechanism. If it isn't built when this module starts, build it first as part of this effort and check it off the accounting phases doc.

## Dependency graph
```
M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7
                 ▲ gate: entitlement engine design review
```
Milestones: **MM1 "Plans sellable"** = end M2 · **MM2 "Benefits actually apply"** = end M4 · **MM3 "Books are right"** = end M5 · **MM4 "Complete"** = end M7.

---

## M1 — Foundations & Plan Design
**Scope:** §4.1, §4.2, AR-1, §11 (plan permissions).
- [M1.1] Schema: `membership_plan` + `membership_plan_benefit` with all §4.1/§4.2 fields; permissions registry entries (`kind` must actually grant the actions the controllers gate on — the accounting `tool`-kind defect must not repeat).
- [M1.2] Plan service: CRUD, activation, **versioning fork** (BR-4.1.3), disable, duplicate; pure rules module for validation (BR-4.1.2, BR-4.2.1/2/3).
- [M1.3] Plan API + controller-level permission tests (authorized ≠ 403, unauthorized = 403) from day one.
- [M1.4] Screen «خطط العضوية»: standard list anatomy, side Sheet with the **benefit builder**, live notional-value vs price indicator (BR-4.2.3).
- [M1.5] Seed: two realistic demo plans (a wellness allowance plan and a discount-only plan) with hand-checkable numbers.
**Exit:** a clinic can design, version and publish a plan; nothing is sellable yet.

## M2 — Selling a Membership → **MM1**
**Scope:** §4.3, §5.2, §7.1, Map A of §8.3.
- [M2.1] Schema: `membership` + `membership_pet`; naming series `MEM-{YYYY}-{#####}` assigned on activation (BR-4.3.3).
- [M2.2] Sale service: plan snapshot (AR-1), pet-scope validation (BR-4.3.1), overlap guard (BR-4.3.2/BR-5.2.3), price override with reason + permission.
- [M2.3] **Membership sale invoice** (§7.1): builds an accounting Sales Invoice with `membershipId`, the plan's tax template, and the **deferred revenue account** as the line's income account, plus `serviceStartDate/EndDate`. Posts through the accounting engine — verify Map A exactly.
- [M2.4] Activation flow: payment allocation → `ACTIVE` → number assigned → entitlements instantiated (§4.4) — all in one transaction (NFR-1).
- [M2.5] Screen «العضويات»: list + stats + sell Sheet (owner → pets → plan cards → dates → price → summary).
- [M2.6] Member detail view v1: header, dates, linked invoice, status actions.
**Acceptance:** AC-1 (sale posts to deferred, income statement unaffected, balance-sheet liability appears), AC-11 (overlap refused).
**Exit:** a membership can be sold and paid for; benefits exist as balances but nothing consumes them yet.

## M3 — Entitlement Engine (headless) — **design checkpoint**
**Scope:** §4.4, §4.5, §6 in full.
- [M3.1] Schema: `membership_entitlement` + `membership_entitlement_ledger` (append-only, AR-2), with the derived-balance function and an optional rebuildable cache.
- [M3.2] **Pure resolution engine** (§6.3): candidate collection, specificity + priority ordering, application per benefit type, stackability, caps. No DB, fully unit-testable.
- [M3.3] **Golden fixture suite (≥30 cases) — this gates M4**: exact-service allowance, group match, ALL match, partial coverage split (BR-6.4), percent with per-use and total caps, fixed per-line/per-invoice/per-visit, free item, multi-membership ordering, non-stackable conflict, exhausted balance, expired-in-grace, zero-quantity edge, rounding edges. Each asserts every output field.
- [M3.4] Reserve/commit/release lifecycle (AR-5) + reservation TTL job (BR-3.6).
- [M3.5] Concurrency: `SELECT … FOR UPDATE` + serializable retry at COMMIT (BR-6.9); the parallel-consumption test is mandatory.
- [M3.6] Preview endpoint (§6.5) + manual adjust with reason & permission (BR-4.5.3).
> **STOP after [M3.2]+[M3.3] and present the engine design** — resolution order, stackability rules, the partial-coverage split decision, the reserve/commit model, and the fixture matrix — before wiring it into invoices. This is the module's equivalent of the GL-engine checkpoint.
**Acceptance:** AC-6 (concurrency), fixtures green.
**Exit:** the engine is provably correct in isolation.

## M4 — Invoice Integration → **MM2**
**Scope:** AR-4, §6.1, §7.3, §7.4, §9.4.
- [M4.1] Hook the engine into the **accounting** Sales Invoice pricing pipeline, before the tax calculator; verify tax computes on post-entitlement amounts.
- [M4.2] Hook into the **operational** invoice pricing step (the dependency flagged in §16) — same engine, same ledger.
- [M4.3] Partial-coverage line splitting (BR-6.4) with `entitlementCovered` flagging; `isFreeItem` treatment per BR-7.4.
- [M4.4] Reverse-on-cancel: cancelling a consuming invoice appends REVERSE rows (BR-3.3, AC-8), wired into both invoice cancel paths.
- [M4.5] **In-invoice benefits panel** (§9.4): what's covered, what discount applied, remaining balances after, un-apply action (permission + reason).
- [M4.6] Member detail view v2: entitlement balances with progress bars + human-readable consumption history.
- [M4.7] POS integration for `ITEM`/`ITEM_GROUP` benefits — **only after the accounting module's POS adapter lands**; otherwise defer and log.
**Acceptance:** AC-3, AC-4, AC-5, AC-8.
**Exit:** benefits genuinely apply at the point of billing and are visible to staff before confirming.

## M5 — Revenue Recognition → **MM3**
**Scope:** §8 in full, Maps B/C/E.
- [M5.1] `membership_recognition` table (per membership per period, with status) + the recognition service implementing all three methods (§8.2).
- [M5.2] Monthly job (§8.6): idempotent per (membership, period), background status, per-membership failure isolation, closed-period routing (BR-8.6.1).
- [M5.3] `ON_CONSUMPTION` recognition triggered by consumption events (Map C) with the cumulative cap.
- [M5.4] Breakage at expiry (§8.4, Map E) inside the expiry job.
- [M5.5] Report **جدول الاعتراف بالإيراد** (10.3) and **رصيد الإيرادات المؤجلة** (10.6) with the **GL reconciliation indicator** (BR-10.1) — the membership analogue of the adapter zero-diff report.
**Acceptance:** AC-2, AC-9, AC-10 — and the §8.5 invariant (recognized + refunded == invoiced net) as an explicit test.
**Exit:** the deferred liability on the balance sheet is correct and reconciles to the module to the cent.

## M6 — Lifecycle: Renewal, Upgrade, Cancellation, Recurring Billing
**Scope:** §5.3, §5.4, §5.5, §7.2, §8.5.
- [M6.1] Status engine + daily job: expiring warnings, expiry, grace handling, suspension (BR-5.1.4).
- [M6.2] Renewal — auto (job) and manual, as a **new membership** with the renewal chain (BR-5.3.1), price per `renewalPriceMode`, overdue-balance skip (BR-5.3.3).
- [M6.3] Upgrade/downgrade with itemized credit calculation (§5.4) and the surplus rule.
- [M6.4] Cancellation with the policy-driven refund proposal, credit note + optional payment refund (BR-5.5.2), entitlement closure, and recognition settlement (§8.5).
- [M6.5] Recurring billing job (§7.2) with idempotency per cycle and the billing-exceptions list.
- [M6.6] Pause/resume [P2] if scope allows; otherwise document as deferred.
**Acceptance:** AC-7 (cancellation invariant), AC-12 (upgrade), plus a renewal round-trip.
**Exit:** a membership can live its whole life — sold, used, renewed, upgraded, cancelled — with correct books at every step.

## M7 — Reporting, Prints, Migration & Hardening → **MM4**
**Scope:** §9.5, §10, §14, NFRs.
- [M7.1] Reports 10.1, 10.2 (MRR/ARR), 10.4 (utilization), 10.5 (churn), 10.7 (breakage), 10.8 (exceptions), 10.9 (adjust audit).
- [M7.2] Member card + membership agreement prints (AR/RTL, number-to-words).
- [M7.3] Migration from the legacy tabs (§14): mapping, import with opening balances, financial cutover, parallel-run reconciliation report.
- [M7.4] Load & concurrency pass against NFR-3; 5,000-membership recognition run; entitlement resolution timing on a 20-line invoice.
- [M7.5] Docs + training material: how to design a plan that doesn't lose money (utilization math), and the accountant's guide to deferred revenue in this module.
**Exit:** legacy retired after zero-diff; the module is complete and documented.

---

## Phase → BRD coverage checklist (agent self-audit before closing a phase)
| Phase | Must satisfy |
|---|---|
| M1 | §4.1 · §4.2 · AR-1 · BR-4.1.x · BR-4.2.x |
| M2 | §4.3 · §5.2 · §7.1 · Map A · AC-1 · AC-11 |
| M3 | §4.4 · §4.5 · §6 all · AR-2 · AR-5 · AC-6 · fixtures green |
| M4 | AR-4 · BR-6.4 · BR-7.4 · AC-3/4/5/8 |
| M5 | §8 all · Maps B/C/E · BR-8.5.1 · BR-10.1 · AC-2/9/10 |
| M6 | §5.3/5.4/5.5 · §7.2 · AC-7 · AC-12 |
| M7 | §10 · §14 · NFR-3 |

## Verification trio (rule 10) — required at every phase exit
1. An idempotent **seeded scenario** in the demo seed, on dedicated demo accounts, with hand-checkable figures.
2. A **CI suite** pinning those figures plus the phase's acceptance criteria.
3. A **"How to run & verify" walkthrough** in the PR body, **executed through the product's own HTTP/UI surface** before it is offered for review (rule 12).

*End of phases file.*
