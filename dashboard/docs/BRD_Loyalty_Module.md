# BRD — Loyalty Module (elite-vet)

**Status:** v1.0 — LY-P0 in build. §17.2 carries 5 corrections of record.
**Basis:** written against the loyalty inventory performed on `415ad91` (branch `claude/crm-module`, carrying main + the complete CRM module). Every claim about existing code below came from that inventory with file:line evidence; a phase that finds otherwise stops and files a §17.2 correction.
**Related modules:** Accounting (§7.2 posting map), Membership & Insurance (BR-M6.4 pricing order), CRM (lead source, referrals [P2]).

---

## §0. Doctrine (inherited verbatim from MI and CRM)

0.1 `CLAUDE.md` and `AGENTS.md` bind: rule 6 (ambiguity → owner question, never invent), rule 8 (one generated migration per phase), rule 11 (no exit report before a concluded green full-CI run on the phase head, cited by openable URL), rule 12 (authorized/403 controller-test pair per endpoint), rule 13 (single typecheck gate), NFR conventions (4-file resources, TypeBox + prismabox, Arabic-only client errors, `Decimal(10,2)` money, `Decimal(5,2)` percentages).
0.2 **Verification-first.** Every phase opens with a §-numbered verification pass against live `main`. Count call sites; never infer. Contradictions between this BRD and live code stop the work and become a §17.2 row.
0.3 **Flag-off inertness is the module's central promise.** `enable_loyalty_programs` OFF ⇒ zero observable change anywhere, proven by a pricing map-diff test at both seams, with existing suites green unchanged in every phase run.
0.4 **The module writes no GL row directly.** Its only financial effect reaches the ledger through the existing discount representation on the invoice/sale, exactly as coupons do today. If a deliverable seems to need new posting machinery, that is a finding, not a license.
0.5 Arabic-only UI and messages; identifiers and enums in English.
0.6 Multi-clinic: every loyalty table carries `clinicId` and is clinic-scoped.
0.7 **Rule-12 corollary (the module's own hardest lesson, imported):** every route ships with the component that calls it. The CRM module shipped five routes with no caller across seven phases — assignment, saved views, mark-responded, duplicate-check — each built, tested, gated, and unusable. This module inherits `uncalled-routes.audit.test.ts` from CRM-P6.7 and extends it to loyalty routes in LY-P0.

---

## §1. Module concept

A points program that rewards owners for what they actually spend, and expresses that reward as a **price reduction on a future invoice** — never as money, never as a second balance.

Two capabilities:
- **Points** — earned on paid treatment, redeemed as a discount on a later invoice.
- **Tiers** — a derived standing (from rolling spend) that changes the earn rate, and nothing else.

Deliberately **not** in this module: cashback, stored value, gift cards, punch cards, referrals (all §16).

**Relationship to Membership:** they are complements, not alternatives. A membership is paid up front for guaranteed benefits; loyalty is free and accrues from ordinary spending. Membership captures the owner willing to subscribe; loyalty captures the one who is not. A member may also hold points, and the program may pay them at a higher rate (§5.4).

## §2. THE core decision — points are a price reduction, not a payment method

**Decided by the owner, binding, and the reason is recorded because it will be questioned later.**

Points reduce the price of an invoice **before tax**, at the pricing seam. They are never a means of settling an invoice after tax.

| | Chosen: price reduction (pre-tax) | Rejected: payment method (post-tax) |
|---|---|---|
| Where | pricing seam, after coupon, before tax | at settlement, against the ledger |
| Tax | computed on the reduced amount | computed on the full amount |
| Posting | the existing discount representation | §7.2 row 8, new two-payer-like machinery |
| Risk | contained | **two competing sources of money owed by the same owner** |

**BR-L2.1 — the rejection is structural, not stylistic.** The system already holds a real credit balance for a party as negative rows in `payment_ledger_entry`, with a written decision (`party.service.ts:216-219`) that such a credit is applied *deliberately*, never netted automatically. If points also became a balance that extinguishes what is owed, a receptionist would face two sources of settlement for the same owner under two different rules, with nothing stating which is consumed first. That is precisely the "two competing truths" pattern the accounting module wrote explicit comments to avoid.

**BR-L2.2 — no point ever touches `payment_ledger_entry`, `advance_payment_ledger_entry`, or `PaymentMethod`.** Adding a `LOYALTY` payment method is forbidden in this module by construction. If a future owner wants stored value, that is a different module with its own liability design.

**BR-L2.3 — tax honesty.** Tax is computed after the reduction, matching the existing seam comment ("no tax on money never collected") and BR-M6.4's treatment of every other discount.

## §3. The program and its rules (masters)

**BR-L3.1 — one active program per clinic.** A second program cannot be activated while one is active; the existing one is deactivated first. Rationale: two concurrent earn rates make "how many points do I have" unanswerable, and no clinic in this market runs parallel programs.

`loyalty_program` fields:

| Field | Meaning |
|---|---|
| `name` | Arabic display name |
| `earnRate` | points granted per 1 currency unit of qualifying spend (`Decimal(10,4)` — sub-unit rates are normal) |
| `redemptionRate` | currency value of 1 point when redeemed (`Decimal(10,4)`) |
| `minRedemptionPoints` | floor below which redemption is refused |
| `maxRedemptionPercent` | ceiling on how much of one invoice may be paid by points (`Decimal(5,2)`) |
| `pointsValidityMonths` | months until earned points expire (§7) |
| `membershipMultiplier` | multiplier applied when the owner holds an ACTIVE membership (`Decimal(5,2)`, default 1.00) |
| `roundingMode` | how fractional points are handled — `FLOOR` fixed in v1 (BR-L5.5) |
| `active`, `isDeleted`, `clinicId` | standard master conventions |

**BR-L3.2 — the program is a snapshot source, not a live authority.** Every earn and every redemption row stores the rates it used. Editing a program never changes points already granted or discounts already given. Same discipline as membership benefit snapshots and insurance coverage snapshots.

**BR-L3.3 — deactivation stops earning, never balances.** Points already held remain redeemable until they expire. A program cannot be hard-deleted while any ledger row references it (Arabic refusal; deactivate instead).

## §4. Tiers

`loyalty_tier` rows belong to a program: `name` (Arabic), `minSpend` (rolling-window spend that qualifies), `earnMultiplier` (`Decimal(5,2)`), `order`, `colorToken` (from the closed design-token allowlist — never hex, per the CRM-P0 §17.2 correction).

**BR-L4.1 — tier is derived, never assigned.** An owner's tier is computed from qualifying spend over a rolling window (`loyalty_tier_window_months`, §13), on read and by the daily job. There is no manual tier field, no "make this owner gold" button. AR-M4 discipline: status reflects reality, not a button.
**BR-L4.2 — the tier's only power is the earn multiplier.** Tiers grant no discounts, no free services, no priority. Those are the membership module's job, and duplicating them would create a second benefits engine competing with a working one.
**BR-L4.3 — tier changes are not retroactive.** Reaching a higher tier affects future earning only; it never re-grants points on past invoices.
**BR-L4.4 — a program with zero tiers is legal**: every owner earns at the base rate. Tiers are optional structure, not a requirement.

## §5. Earning

**BR-L5.1 — earning happens at payment, never at invoicing.** A draft or cancelled invoice grants nothing. This mirrors the membership entitlement rule (`membership-pricing.service.ts` intent-then-commit) for the same reason: nothing is granted on money not collected.

**BR-L5.2 — the earn base is the owner's own pre-tax net.** Precisely: the invoice's net amount after all discounts (included units, membership discount, coupon, loyalty redemption) and **before tax**, restricted to the portion the owner actually owes.
- On an insured invoice, the insurer's share is **excluded**. The owner earns on their copay only. Rewarding an owner for money an insurer paid is both economically wrong and trivially gameable.
- On a POS sale, the same rule with no insurance dimension.

**BR-L5.3 — points earned on a redemption-discounted amount is intentional.** Redeeming points reduces the base, so it also reduces what that invoice earns. This prevents a loop where points regenerate themselves.

**BR-L5.4 — the membership multiplier is a read, not a coupling.** If `membershipMultiplier` ≠ 1.00 and the owner holds an ACTIVE membership at payment time, the multiplier applies. The loyalty module reads membership status; it never writes to membership tables, adds a benefit type, or appears in `applyMembershipBenefits`. Effective rate = `earnRate × tierMultiplier × membershipMultiplier`.

**BR-L5.5 — fractional points floor.** `FLOOR` in v1, so the clinic never grants more than it computed. Recorded as fixed rather than configurable, because a configurable rounding mode is a support burden with no business value.

**BR-L5.6 — refund reverses the grant.** Refunding a paid invoice reverses its earn row. If the owner has already spent those points, the balance may go negative; a negative balance blocks redemption until it is cleared by future earning, and is visible on the owner's surface. Rationale: the alternative — refusing the refund or silently forgiving — either blocks a legitimate operation or makes points a way to extract value from returns.

**BR-L5.7 — what does not earn:** membership subscription invoices, insurance-settlement receipts, adjustments, write-offs, and any invoice with a zero owner net. Membership fees are excluded because the member already bought benefits; paying them again in points is double-rewarding the same money.

## §6. Redemption

**BR-L6.1 — redemption is a deliberate act at the counter.** It is never automatic. The cashier sees the balance, chooses to apply points, and the amount applied is explicit. Rationale identical to the credit-balance decision (`party.service.ts:216-219`): value belonging to the customer is applied on purpose, not silently.

**BR-L6.2 — constraints, all refused in Arabic:** balance sufficient · at or above `minRedemptionPoints` · resulting discount at or below `maxRedemptionPercent` of the pre-tax net · program active · owner resolvable (§6.4).

**BR-L6.3 — intent then commit, atomically.** Cloned from the membership entitlement mechanism, which is the closest working precedent in the codebase:
1. At pricing, the redemption is an **intent** recorded on the priced result; nothing is consumed.
2. At payment, consumption is committed inside the payment transaction, by a conditional `UPDATE` per consumed ledger row guarded on remaining points, so two concurrent invoices cannot spend the same point. Zero rows affected ⇒ the payment aborts with an Arabic error.
3. Stale intents are flushed at payment (an intent that never reached payment consumes nothing).
4. Refund of a redeemed invoice restores the points to the rows they came from, **only if those rows have not expired** — expired points do not resurrect.

**BR-L6.4 — FIFO by expiry.** Redemption consumes the oldest non-expired earn rows first, so points closest to expiring are spent first. This is the customer-favourable order and the only one that makes expiry predictable.

**BR-L6.5 — the owner must be resolvable.** Clinic invoices resolve the owner through the existing document → owner path (the same one membership benefits use). A POS sale with no linked party cannot redeem — the composer states «اربط العميل لاستخدام النقاط» rather than hiding the control.

## §7. Expiry and the liability question

**BR-L7.1 — points expire.** Each earn row carries `expiresAt = earnedAt + program.pointsValidityMonths`. Expiry is **derived on read** and reconciled by the daily job, so the balance is honest even when the job has not run (the CRM SLA badge precedent).

**BR-L7.2 — v1 accrues no liability at earn time, and this is a declared limitation.** When points are earned, no journal entry is made. When they are redeemed, the reduction posts through the existing discount representation, exactly as a coupon does.
- **Why:** full material-right accounting (deferring a slice of revenue at earn time and releasing it at redemption or expiry) is a substantial accounting change touching the revenue path of every invoice. It is not justified by a v1 points program in a single-clinic product.
- **What it costs:** outstanding points are an unrecognised obligation. The books understate what the clinic owes its customers in future discounts.
- **How the cost is made visible instead of hidden:** §11's **outstanding-liability report** values all unexpired points at the current redemption rate and shows the exposure, with its own Arabic note that this figure is not posted to the ledger. The owner sees the number; the ledger simply does not yet carry it.
- Accrual accounting is **[P2]**, and §7.2 row 8 of the accounting BRD stays reserved for it.

**BR-L7.3 — expiry is not a write-off event in v1.** Because nothing was accrued, nothing is released. Expiry reduces the balance and is recorded in the ledger as an `EXPIRY` row for audit, with no GL effect.

## §8. The pricing seam — where redemption enters

The order is fixed by BR-M6.4 in the MI BRD. Loyalty inserts **one** step:

1. Included units (membership)
2. Membership discount
3. Coupon / manual discount
4. **Loyalty redemption** ← new
5. Tax
6. Insurance split

**BR-L8.1 — this changes BR-M6.4, and that change is recorded in the MI BRD, not only here.** MI's BRD states the order as fixed and non-configurable; adding a step without amending it there would leave two documents disagreeing about the same rule. LY-P2 files the correction in `BRD_Membership_Insurance_Module.md` §17.2 as its commit 0.

**BR-L8.2 — two seams, one implementation.** `priceClinicInvoice` and `priceSale` both apply it, through one shared function, exactly as membership benefits do. The seam count is 4 + 2 callers as verified at MI-P2 and re-verified at LY-P2 — the verification counts them again rather than trusting this sentence.

**BR-L8.3 — redemption comes after the coupon deliberately.** Points are the customer's own accrued value and apply to whatever price remains after the clinic's own promotions. Applying them first would let a coupon consume value the customer had already earned.

**BR-L8.4 — flag OFF is byte-identical.** Proven by cloning the FR-11.3 map-diff harness at both seams, as MI-P2 and CRM did. This is the phase's named exit proof for LY-P2.

## §9. The points ledger

**BR-L9.1 — no balance column anywhere.** The balance is the sum of ledger rows, exactly as party outstanding is derived from `payment_ledger_entry`. A stored balance is a second source of truth, and this codebase has written decisions against exactly that.

`loyalty_ledger_entry`: `clinicId` · `ownerId` · `programId` (snapshot ref) · `kind` (`EARN` | `REDEEM` | `EXPIRY` | `REVERSAL` | `ADJUSTMENT`) · `points` (signed) · `pointsConsumed` (on EARN rows, for FIFO) · `earnRateSnapshot` / `redemptionRateSnapshot` · `sourceType` + `sourceId` (invoice / sale / manual) · `earnedAt` · `expiresAt?` · `note?` · `createdByUserId?`.

**BR-L9.2 — manual adjustment is possible, gated, and never silent.** An `ADJUSTMENT` row requires a mandatory Arabic reason and the `loyalty_settings.edit` permission (goodwill grants and correction of a support incident are real needs). It appears in the owner's statement like any other row.

**BR-L9.3 — the ledger is append-only.** No row is ever edited or deleted; corrections are new rows. Same discipline as the accounting ledgers.

## §10. Screens (Arabic, on the unified layout contract)

All screens follow the `/services/staff` layout contract established during the CRM UI unification: `CrmModuleHeader`-equivalent header, `TableToolbar` with primary action in `actions`, `TableDataView`, row actions in `IconDots`, stats strip, standard empty/loading/no-results states.

10.1 **Sidebar** — loyalty items join the existing finance grouping, not a new top-level group: «برنامج الولاء» (program + tiers) and «حركة النقاط» (the ledger/statement view). Each permission-gated; both hidden with zero loyalty permissions.
10.2 **Program screen** — the single program's rules, its tiers editor (child rows, same pattern as membership plan benefits), and activation.
10.3 **Owner surface** — a points chip on the owner profile beside the membership and open-balance chips: balance, tier, and the value of points expiring within 60 days. Opens the owner's statement (their ledger rows, newest first).
10.4 **Payment/POS composer** — the redemption control: balance, an input for points to apply, the resulting discount, and Arabic refusals inline when a constraint fails. It renders only when the program is active, the owner is resolvable, and the balance is above `minRedemptionPoints` — otherwise it states why rather than disappearing.
10.5 **Statement screen** — filterable ledger across owners for support ("why does this owner have 340 points").

## §11. Reports

11.1 **Outstanding liability** — unexpired points × current redemption rate, by tier and by age bucket, with the BR-L7.2 note that this is not a posted liability.
11.2 **Earn/redeem activity** — granted, redeemed, expired, reversed per period, with redemption rate (% of granted points actually used) — the health metric of the program.
11.3 **Tier distribution** — owners per tier and their share of spend.
11.4 **Expiring soon** — owners with points expiring in the next N days, which is also the marketing module's most obvious future consumer (§16).

## §12. Permissions

Doctypes: `loyalty_program`, `loyalty_ledger`. Front-office idiom (`src/lib/permissions.ts`), matching the CRM §17.2 resolution — never the accounting doctype registry.
- `loyalty_settings.view_full/create/edit` — program and tiers (and BR-L9.2 adjustments).
- `loyalty_ledger.view_full` — statements and reports.
- **Redemption itself requires no new slug**: whoever may take a payment may apply points, because refusing that would make the control useless at the counter.
**Backfill** anchored on the front-office authority already holding owners/appointments write, action for action, in the same migration — never accounting roles. Same rule the CRM phases used, with the shipped-bytes test pattern.

## §13. Settings keys

Typed table `clinic_loyalty_settings` (NOT the accounting `AccountsSetting` registry — the CRM-P0 §17.2 resolution applies: a front-office module must not require an accounting permission to be enabled).
`enableLoyaltyModule` (bool, default OFF) · `loyaltyTierWindowMonths` (int, default 12) · `loyaltyExpiryNoticeDays` (int, default 60).

**BR-L13.1 — the dead `enable_loyalty_programs` key in the accounting registry is NOT reused.** It is a declared-and-abandoned name with no reader. LY-P0 either removes it or marks it superseded, with a §17.2 row, so two flags never claim the same meaning.

## §14. Migration map (one per phase)

**LY-P0** program + tiers + settings + permissions backfill · **LY-P1** ledger + earn columns/links · **LY-P2** redemption columns on invoice/sale (mirroring the membership adjustment pattern) · **LY-P3** tier derivation support (if any; may be none) · **LY-P4** expiry support (if any; likely none — derived) · **LY-P5** none expected.

## §15. Phases and exit proofs

| Phase | Scope | Named exit proof | Blockers |
|---|---|---|---|
| **LY-P0** | flag + typed settings + program & tier masters + permissions backfill + uncalled-routes audit extended | flag-OFF inertness; masters CRUD with BR-L3.1/3.3 Arabic refusals; backfill test on shipped bytes | — |
| **LY-P1** | ledger + earning at payment (both seams' payment paths) + owner chip + statement | executed: pay a clinic invoice → correct points granted on the owner's pre-tax net; insured invoice grants on copay only; membership multiplier applies; refund reverses | — |
| **LY-P2** | redemption at the pricing seam + intent/commit + refund restore + composer + MI BRD correction (commit 0) | **map-diff at both seams byte-identical with flag OFF**; executed: redeem → discount applied before tax → payment commits consumption → concurrent redemption race resolves to one winner | — |
| **LY-P3** | tiers derived + multipliers + daily job step | executed: spend crosses a threshold → tier changes on read and after the job; higher tier changes future earning only | — |
| **LY-P4** | expiry (derived + job reconciliation) + liability and activity reports | executed: points past validity stop being redeemable and appear as EXPIRY rows; the liability report ties to the ledger | — |
| **LY-P5** | remaining screens, statement filters, demo seed, polish sweep, module closure record | §15.1 closing table; every report asserted against seed figures; **the uncalled-routes audit green for every loyalty route** | — |

15.2 **LY-P0 closing note (owner, 2026-09-10): closed on CI evidence; human tour deferred.**
The phase head is `8946338`, full-tier green — PR Full Checks
[34468803941](https://github.com/hos321/elite-vet/actions/runs/34468803941), both jobs at step
level (migrations 6s · production build 6m38s · FULL suite incl. DB suites 10m02s · cold
whole-graph typecheck 7m20s). The server half of §15's named exit proof was **executed** in CI
against a real Postgres: every route's authorized/403 pair, BR-L3.1 and BR-L3.3 refusing in
Arabic, the §4 ladder rule, flag-OFF inertness in both directions, and the backfill running the
shipped migration bytes.

The owner's own golden-path tour of the screen was **deferred for lack of local access**, and
the «How to run & verify» table in the exit report is therefore **written, not executed** — the
one part of rule 12 this phase does not satisfy. Read the LY-P0 exit as *CI-closed,
human-unverified*, with the same discipline CRM §16.2 established: **if a later tour finds
something CI could not see — a mis-rendered state, a locale gap, an empty-state that lies — it
is an LY-P0 defect, not an LY-P1 regression.** Recording that here is what keeps the blame
attached to the phase that actually shipped it.

What CI structurally cannot see here: the screen rendered in a browser at all, RTL correctness
of the portalled surfaces, and whether the tier colour swatches read as a usable picker.

15.3 **LY-P1 closing note (recorded at the LY-P2 build): CI-closed, human-unverified — and one
gap found since.** The LY-P1 head is `d27d735`, full-tier green — PR Full Checks
[34483498856](https://github.com/hos321/elite-vet/actions/runs/34483498856) (migrations 7s ·
production build 7m10s · FULL suite 11m11s, 2,910 passed · cold whole-graph typecheck 7m51s).
Its owner tour was deferred for the same lack of local access as §15.2, and the same attribution
rule applies: a later tour finding what CI could not see is an **LY-P1 defect**, not an LY-P2
regression.

**The gap, found while counting seam callers for LY-P2 (§17.2 row 10):** LY-P1 wired earning into
`invoicesDao.pay` (appointment invoices) and `salesDao.markPaid` (POS) only. Every other clinic
invoice reaches PAID through its own pay function and therefore **earns nothing**. LY-P1's exit
report said "earning committed at payment on both payment paths" and that was true of the two
paths it named — it was not true of every path a clinic invoice can be paid through.

**The count in that report was also wrong, and the correction is itself the lesson.** It named
four unwired paths (lab, radiology, grooming, inpatient). There were **five** — `operations`
was missed, because the list was written by reading rather than by scanning. Fixed at LY-P3
commit 0, where a mechanical assertion now pins it: every one of the six `priceClinicInvoice`
callers must also call `commitLoyaltyEarn`, so the next one to appear fails the day it is
written. Same shape as §18.7: enumeration finds what reading misses, every single time.

15.1 **Closing record (module closed 2026-09-12).**

| Phase | Head | Full-tier run | What it shipped |
|---|---|---|---|
| LY-P0 | `8946338` | [34468803941](https://github.com/hos321/elite-vet/actions/runs/34468803941) | flag + typed settings + programme & tier masters + permissions backfill + the uncalled-routes audit moved and extended |
| LY-P1 | `d27d735` | [34483498856](https://github.com/hos321/elite-vet/actions/runs/34483498856) | the points ledger, earning at payment on the appointment and POS paths, the owner chip and statement |
| LY-P2 | `445a118` | [34683237395](https://github.com/hos321/elite-vet/actions/runs/34683237395) | redemption at the pricing seam, intent→commit with the atomic guard, FIFO by expiry, refund restore, both composers, and the MI BRD amendment as commit 0 (`c7dfd18`) |
| LY-P3 | `252f3ea` | [34689530886](https://github.com/hos321/elite-vet/actions/runs/34689530886) | tiers derived from rolling spend, the earn multiplier, the daily reconcile step, the tier chip — plus commit 0: the five clinic-invoice pay paths that had never granted a point |
| LY-P4 | `252f3ea` | [34689530886](https://github.com/hos321/elite-vet/actions/runs/34689530886) | expiry reconciliation with no GL effect, the outstanding-liability report with its BR-L7.2 disclaimer, the activity report |
| LY-P5 | `5490807` | [34692786111](https://github.com/hos321/elite-vet/actions/runs/34692786111) | the cross-owner statement with filters, the manual adjustment with its screen, the tier-distribution and expiring-soon reports, the demo seed and its pinned figures |

At the LY-P5 head: **2,992 passed / 2 skipped of 2,994** across 293 files, production build 7m01s, FULL suite 11m29s, cold whole-graph typecheck 7m09s, migrations 9s. Three migrations in total (`ly_p0_foundation`, `ly_p1_ledger`, `ly_p2_redemption`); LY-P3 added one (`ly_p3_tiers`) and LY-P4 and LY-P5 correctly added none (§17.2 row 16).

**15.1.1 — what a green CI does not prove, stated plainly at closure.**
**No human has opened a single loyalty screen in a browser across this entire module.** Every phase from LY-P0 to LY-P5 was closed on CI evidence with its owner tour deferred for lack of local access (§15.2, §15.3). CI drives the product's real HTTP surface against a real Postgres, so the figures, the refusals, the permission pairs and the flag-off identity are all genuinely executed — but the following are structurally invisible to it and remain unverified:

- that the six screens render at all, and that the nav group appears where §10.1 says;
- RTL correctness of the portalled surfaces — the statement dialog, the adjustment sheet, the redemption control inside the payment modal;
- whether the tier colour swatches read as a usable picker, and whether the tier pill is legible beside the membership and open-balance chips;
- whether the redemption control's refusals are *noticed* at the counter, as opposed to merely returned;
- that the liability report's Arabic disclaimer is actually read rather than scrolled past.

Per the discipline set in §15.2: **anything a later tour finds that CI could not see belongs to the phase that shipped it, not to whatever phase is open when it is found.**

**15.1.2 — the two jobs do not run in production.** `LOYALTY_TIER_DAILY` and `LOYALTY_EXPIRY_DAILY` are registered on the shared runner, but nothing in this repository calls `runQueuedAccountingJobs` — true of every accounting job since [P0.5], and tracked as **[P13.12]**. This is why tier and expiry are both *derived on read*: every figure a user sees is correct with the jobs asleep. What is missing without them is only the audit trail (`EXPIRY` rows) and the cross-owner tier snapshot that §11.3 reads.

**Standing rules for every phase:** one migration · rule-12 pairs per route · Arabic-only + i18n sweep before each exit · no `--no-verify` · every CI claim carries an openable run URL · regenerate (`bun install` → `prisma generate` → `gen:routetree`) after any merge or branch switch.

## §16. Deliberately out of scope (v1)

Cashback and stored value (rejected by BR-L2.1) · gift cards · punch/stamp cards (membership included-units already does this better) · **referrals** (needs attribution machinery; the natural home is a CRM×Loyalty crossover once both are stable) · earn-time liability accrual (BR-L7.2, §7.2 row 8 reserved) · points on account statements sent to owners · marketing automation on `expiring soon` (the marketing module's plan already reserves a loyalty branch — this module exposes the data, that module consumes it) · multi-program and program A/B tests · points transfer between owners.

## §17. Decisions of record

1. **Points are a pre-tax price reduction, never a payment method** (§2) — because a second settlement source competing with the party credit ledger is the failure the accounting module explicitly guards against.
2. **No liability accrual in v1, with the exposure surfaced in a report instead** (BR-L7.2) — the cost of the shortcut is made visible rather than hidden.
3. **`Discount` is not the foundation.** The inventory found it complete-looking and entirely inert: `usedCount` never increments, no verify/redeem route exists, and no pricing path reads the table. Building on it would inherit a debt, not a base.
4. **`MembershipEntitlement` is the foundation** — intent-then-commit with an atomic SQL guard, refund restore, and a working precedent at the same seam.
5. **Tiers grant only an earn multiplier** (BR-L4.2) — a second benefits engine beside the membership one is how modules start disagreeing.
6. **Earning excludes the insurer's share** (BR-L5.2) — rewarding an owner for an insurer's money is wrong and gameable.
7. **The dead accounting flag is superseded, not reused** (BR-L13.1).

### §17.2 Corrections of record

| # | Phase | BRD text | What live code required | Why |
|---|---|---|---|---|
| 1 | LY-P0 | BR-L13.1 calls `enable_loyalty_programs` "a declared-and-abandoned name with no reader" and says LY-P0 "either removes it or marks it superseded" | **It is NOT abandoned — it is a declared parity obligation, so it is KEPT and marked superseded, never removed** | `BRD_Accounting_Module.md:451` §19 requires shipping "ERPNext-equivalent keys … enable flags: dimensions, subscriptions, **loyalty (off)**", and `:493`'s traceability matrix records `Accounts Settings \| §19 \| **Full flag set**`. The registry's own header says so too: *"Flags whose engine is not built yet are still shipped (BRD §22 requires the full flag set)"*. Deleting the key would silently break another module's BRD, which CLAUDE.md rule 6 forbids. But leaving it untouched was worse than dead: `accounts-settings-page.tsx:65` renders **every** key with no exclusion, so it was a live, user-toggleable control that did nothing — and once `enableLoyaltyModule` shipped, a manager would face two loyalty switches, one of them a lie. Resolution: a new optional `supersededBy` field on the definition, an Arabic label/description naming where the real switch lives, and the screen rendering superseded keys as «معطَّل» instead of a control. |
| 2 | LY-P0 | §3's field table lists `roundingMode`; BR-L5.5 declares it **fixed, not configurable** in v1 | the column ships as a **single-member enum** `LoyaltyRoundingMode { FLOOR }` | The two statements pull opposite ways: a column with an open union advertises a choice the product refuses to offer, while omitting it would drop a field the BRD names. A one-member enum satisfies both and makes "fixed in v1" a **database guarantee** rather than a convention code must remember — the same move CRM §17.2 row 5 made when it split one status enum into two so a parenthetical became a constraint. Adding a second member later is a deliberate migration, which is exactly the friction BR-L5.5 wants. |
| 3 | LY-P0 | §10.1 places loyalty in the finance grouping; §12 mandates front-office permission slugs | `FinanceNavGate` gained a **third kind**, `{ kind: "permission"; permission: string }` | The gate was a closed two-member union — `accounting` (doctype) or `resource` (`FinanceResource`). Neither fits: loyalty has no accounting doctype, and `FinanceResource` is a closed list whose every member is copied into `FINANCE_DEFAULT_GRANT` (`permissions.ts:192`), **granted to every pre-existing role**. Routing loyalty through it would have made the module visible to everyone, the exact opposite of §12's `patients_owners.edit` anchor. Widening the union is the honest fix; it forced four narrowing sites to be revisited (`app-sidebar.tsx`, `finance-workspace-header.tsx`, and two nav tests), each of which had assumed `kind !== "accounting"` implies `resource`. `loyalty-nav.test.ts` now pins that no loyalty slug ever enters the default grant. |
| 4 | LY-P0 | §0.7 says the module "inherits `uncalled-routes.audit.test.ts` from CRM-P6.7 and extends it" | the audit **moved** from `src/server/crm/` to `src/server/`, and scans a list of module roots | A second copy under `src/server/loyalty/` would have broken §18.2 in the same breath as obeying §0.7 — a list consumed in more than one place is declared once. Its new home sits beside the two other server-wide guards (`domain-error-reachability`, `server-layering`), which is what it actually is. Verified negatively for loyalty specifically: deleting the client callers makes it fail naming all four `/loyalty/programs` routes. |
| 5 | LY-P0 | — (no BRD text; recorded so the location is not read as an oversight) | this BRD lives at **`docs/BRD_Loyalty_Module.md`**, while the other four sit at the repo root | CRM recorded the opposite move as its own §17.2 row 6 (*"the scope arbiter lives at the repo root"*) and relocated its BRD there. This one was committed under `docs/` in `e290c92` and left there pending the owner's word — LY-P0 did not move another author's file on its own initiative. Raised as an open question at the LY-P0 verification pass. |
| 6 | LY-P0 | §18.3 requires the backfill to ship in the same migration; the CRM-P0 block cloned for it states it is *"idempotent by construction … a role an admin has already narrowed AFTER this migration is never re-granted"* | **the second half of that claim is FALSE**, in CRM-P0's block and therefore in this one | `next_permissions` is computed as `current \|\| the four slugs`, and the guard is `NOT (current @> next)` — so a role stripped of one slug is missing something from the target set and receives it back. Found by CI, not by reading: LY-P0's backfill test asserted the inherited claim and was the single failure in an otherwise green full-tier run (2,884 of 2,887 passing). The SQL is **not** changed — it is genuinely idempotent in the sense that matters (two runs leave what one run leaves), and Prisma applies a migration exactly once per database, so the re-run case does not exist in production. What changed is the comment, which now says precisely which guarantee it makes and which it does not, and the test, which now pins the real behaviour in both directions. **CRM-P0's migration is deliberately NOT edited**: it has been applied to real databases and altering an applied migration changes its checksum, which is a worse defect than a wrong comment. Flagged in PR #121 so the CRM owner can correct it at a safe moment. |
| 7 | LY-P1 | §5 assumes both seams can identify the owner; §6.5 says "a POS sale with no linked party cannot redeem" — implying a linked party is *readable* on a sale | **`Sale` had no owner at all.** LY-P1 adds `Sale.ownerId` (nullable, `SetNull`) and persists it | `sales.dao.ts:56-59` passed `args.partyId` into `priceSale` and into `membership: { ownerId }`, then **discarded it** — the sale row kept only `customerName`/`customerPhone` free text. So the party existed for the length of one pricing call and left no trace: no way to grant points at payment, no way for §6.5 to distinguish "no party linked" from "party linked but unreadable", and no way for a refund to know whose points to reverse. Free-text name matching was never an option — two owners share a name, and a typo silently moves value between people. The column is nullable because counter sales to walk-ins are legitimate and must stay so (pinned by a test: a sale with no party pays fine and earns nothing). `SetNull` rather than `Cascade`: deleting an owner must never delete the clinic's sales history. |
| 8 | LY-P1 | BR-L5.2 defines the earn base as the owner's net "before tax, restricted to the portion the owner actually owes" | that figure **is not stored on any row**; it is derived as `(total − vatAmount) × copayShare ÷ total` | The invoice carries `total` (taxed), `vatAmount`, and — when a claim exists — `copayShare`/`insurerShare`, and **both shares are post-tax**, because BR-I9.1.1 runs the §9.1 split on the final taxed gross. There is no pre-tax owner column to read. The proportional back-out adds **no new approximation**: the split's own first step distributes that taxed gross across lines *by pre-tax line weights*, so proportionality between tax and owner share is already the assumption the invoice was split under. Computing something "more precise" here would disagree with the number the invoice was actually divided by. One formula covers both cases because `ownerDue` in the payment scope equals `copayShare` when a claim exists and `total` when it does not — the ratio then degrades to exactly 1. Pinned in `loyalty-ledger.rules.test.ts` (220 total / 20 VAT / 165 copay ⇒ base 150 = 75 % of the 200 net) and executed end-to-end in the insured-invoice HTTP test. |
| 9 | LY-P1 | BR-L5.1 says earning happens "at payment"; it does not define what a **partial** payment earns | earning commits **only when the owner's share is fully settled** (`isFullyPaid`), not on each instalment | The BRD's silence is real and had to be resolved to write the code (rule 6 — recorded rather than invented). Full settlement is the only unambiguous moment: a partial payment would need a partial earn base, which would then have to be re-derived and re-reversed on every subsequent instalment and on refund, multiplying the ledger rows and the reversal logic for no business gain. It is also the same instant `commitInvoiceMembershipConsumption` fires, so both "commit what was actually collected" acts sit in one place in one transaction. Consequence to accept knowingly: an invoice left permanently PARTIAL earns nothing. If the owner ever wants instalment-proportional earning, it is a deliberate BRD amendment, not a silent behaviour change. |
| 10 | LY-P2 | BR-L8.2: "the seam count is 4 + 2 callers as verified at MI-P2 and re-verified at LY-P2" | **it is 6 + 2**, and the two newcomers were never wired to the seam's existing feature either | The BRD told the verification to count again rather than trust the sentence, and counting found `grooming/grooming-invoice.service.ts` and `inpatients/inpatients-invoice.service.ts` joined `priceClinicInvoice` after MI-P2 shipped. Worse than a stale number: **neither passes `membership`**, so a member's grooming or inpatient invoice silently receives no membership benefit at all — a live MI defect, invisible because the parameter is optional and its absence prices exactly as before. The count is now a **test** (`loyalty-seam-callers.audit.test.ts`) naming every caller, so a seventh fails loudly instead of joining quietly. LY-P2 does **not** fix the membership gap: giving two more document types membership pricing changes what members are charged, which needs MI's own map-diff and is not a loyalty phase's call to make silently. Redemption is inert on both for the same reason it is inert everywhere without an owner — and `/invoices/:id/pay` now **refuses** `redeemPoints` on lab and radiology invoices in Arabic rather than dropping them, because their pay functions are separate and a dropped discount is money quietly uncollected. |
| 11 | LY-P2 | LY-P1's `deriveBalance`: an `EARN` row past its expiry is skipped entirely | an expired earn row now drops **only its unspent remainder** | Not a behaviour change to anything LY-P1 shipped: with no redemption, `pointsConsumed` is always 0 and the two formulas are character-identical — every LY-P1 test passes unchanged. They diverge the moment a point is spent before its row expires, and there the old formula was wrong twice over: it subtracted the point once through the negative `REDEEM` row and again by dropping the whole earn row, so an owner who spent 40 of 100 points and then let the row lapse lost 40 points that had already been used. A point spent before expiry **was used**; expiry can only take back what is still there. |
| 12 | LY-P2 | §9.1 fixes five ledger kinds (`EARN`/`REDEEM`/`EXPIRY`/`REVERSAL`/`ADJUSTMENT`) | a sixth, **`REDEMPTION_RESTORE`** | Forced by the ledger's own idempotence guard. `@@unique(sourceType, sourceId, kind)` allows one row per kind per document, and refunding a document that both earned and redeemed must append **two** reversing rows. They cannot share `REVERSAL`, and they are not the same amount: the earn reversal negates the whole grant, while the restore returns only the allocations that have not expired (BR-L6.3 step 4) — expired points do not resurrect. Same shape as §17.2 row 2: a constraint the database enforces rather than a convention code must remember. |
| 13 | LY-P2 | BR-L6.3 step 1: "the redemption is an intent recorded on the priced result" — silent on where it is persisted | a dedicated `loyalty_redemption` table with allocation children, **not** a ledger row | The ledger is append-only and final (BR-L9.3): a row in it means *it happened*. An intent frequently does not — an invoice is priced and abandoned, or repriced with fewer points. Writing intents into the ledger would leave balances hanging on documents that were never paid. The table carries `consumedAt` (the membership-adjustment pattern) and a `@@unique(sourceType, sourceId)`, which makes "stale intents are flushed at payment" (step 3) a matter of replacing one row rather than a cleanup job. Allocation children exist because the restore must return points **to the rows they came from** with their original expiry — a fresh grant would hand the owner a new full validity period as a reward for a refund. |
| 14 | LY-P3 | §4 says the tier is "computed … on read and by the daily job" — silent on where the job's result lives | a `loyalty_owner_tier` **snapshot table**, written only by the job, never read by any owner-facing path | The phrase implies the job produces something, and BR-L4.1 forbids that something being an assignable tier. The resolution is the pattern this codebase already uses twice — `slaStatus` in CRM-P5, `nextDueAt` in inpatients: the read derives, the job pins a value that exists purely so §11 can filter and aggregate across thousands of owners without a query per owner. Keeping it in a loyalty-owned table rather than a column on `Owner` keeps a cross-module write out of the schema. A stale row is a late cache, never a wrong tier — which matters more than usual here, because the runner does not execute in production at all ([P13.12]). |
| 15 | LY-P3 | §5's `multiplierSnapshot` is described as "the effective multiplier applied (tier × membership)" | LY-P1 shipped it carrying **only the membership half** | Not visible until tiers existed, because the tier half was always 1. Corrected where the tier multiplier lands; rows written before LY-P3 are left as they are, since rewriting shipped ledger rows to change what a snapshot claims is exactly the sort of edit BR-L9.3 forbids. |
| 16 | LY-P4 | §14's migration map allots one migration per phase | **LY-P4 ships none**, and that is the correct outcome, not an omission | Expiry needs no new storage: `EXPIRY` rows live in the existing ledger, keyed by the lapsed grant's own `(sourceType, sourceId)`, so the composite unique that guards double-granting also makes reconciliation idempotent for free. The reports are reads. Recorded because a phase with no migration looks like a forgotten step unless the reason is written down. |
| 17 | LY-P5 | BR-L9.2 describes an `ADJUSTMENT` row as a ledger row like any other; §6 defines redemption as consuming `EARN` rows FIFO | positive `ADJUSTMENT` rows are **redeemable too**, and are counted in the §11.1 liability | Taking both sentences literally shipped a silent contradiction: a goodwill grant raises the balance on the owner's chip, and then redemption refuses with «الرصيد القابل للاستبدال ٠» — two numbers for the same thing on two screens, with no error to explain either. Positive adjustments now join the FIFO pool (they carry no `expiresAt`, so they sort last — what does not lapse is not lost by waiting) and the liability report values them, because a grant that can be spent is an obligation whether or not money was collected for it. Negative adjustments are capped at the redeemable balance: a negative balance in this module means specifically that money was refunded (BR-L5.6), and that meaning must not be manufacturable with a button. |
| 18 | LY-P5 | §7 says "points expire"; BR-L9.2 is silent on whether an adjustment does | `ADJUSTMENT` rows carry **no expiry** | §7 attaches expiry to the earn row as `earnedAt + pointsValidityMonths` — a window measured from a purchase. An adjustment has no purchase to measure from, and inventing one would mean picking a date the BRD never names. The cost is stated rather than hidden: a goodwill grant is an obligation until it is spent, so it sits in the liability report permanently and never falls out on its own. A clinic that wants it gone deducts it with a second adjustment, which leaves a reason in the ledger — better than an expiry nobody chose. |

*(BR-M6.4's amendment in the MI BRD is still expected, filed from LY-P2 commit 0.)*

## §18. Lessons imported (bind as rules)

18.1 Count call sites yourself; this document's numbers are claims until verified.
18.2 Any list or enum consumed in more than one place is declared once with a parity audit test.
18.3 New doctypes ship with their permissions backfill in the same migration, or existing roles never see the module.
18.4 A human drives the module before it merges; tests do not see locales, empty states, or "an old clinic receives a new module".
18.5 The i18n sweep is part of every UI phase's exit.
18.6 **File work where the phase that must build it will look** — in §15's phase row and §14's migration map, not only in a decisions section. CRM lost a step this way.
18.7 **Every route ships with its caller**, enforced by `uncalled-routes.audit.test.ts` rather than by a sweep someone remembers to perform. CRM shipped five uncalled routes across seven phases, all with green tests.