# BRD — Membership & Insurance Module

**Product:** Positive Membership & Insurance · **Companion modules:** Positive Accounting Core (`BRD_Accounting_Module.md`), operational clinic modules (appointments, invoices, POS, care plans)
**Audience:** AI coding agents + engineering team. **UI:** ALL screens follow the Positive design system (`docs/DESIGN_SYSTEM_CONTRACT.md`) — this document specifies fields, behavior, and logic only, never visual style.
**Status:** Reviewed with the owner 2026-08-22 · §17 decisions recorded (O2/O3/O4 resolved 2026-08-22; **O5/O5a resolved 2026-08-23**; **O1 resolved 2026-08-23** as editable demo defaults — see §17; **O6 remains a product note**: care plans stay non-billed, nothing to build) · §17.2 lists nine corrections made against the live code (rows 1–8 at review, row 9 at the MI-P5 build) · **§18 is the three-point read-me for whoever starts MI-P0.** Written from a full read of the live schema and the accounting module as merged to `main` (`6463991`); re-verified at review against `main` (`3492d36`).

> **Relationship to the earlier draft — corrected at owner review, 2026-08-22.**
> The first version of this preamble stated that `docs/BRD_Membership_Module.md` and
> `docs/MEMBERSHIP_PHASES.md` did not exist, "verified across all branches". That check ran
> against **git history only**. Both files did exist — **untracked, in the working tree**
> (49 KB + 10 KB, dated 2026-08-18): a complete earlier BRD titled «Membership **& Care
> Plans**» (§0–§16) with an M1→M7 phases file. This document was therefore written without
> knowledge of a document it contradicts in seven places.
>
> **Owner decision (2026-08-22): this document is the law; the earlier draft is archived.**
> It now lives at `docs/archive/` — committed there in the same change, because until that
> moment it survived on one disk only. It is a historical record, not a source of
> requirements. Where the two disagree, this document wins. The divergences, and what was
> deliberately carried over from it, are recorded in **§17.1**.
>
> A second correction: the "standing CLAUDE.md instruction" this preamble cited as referencing
> those two files **could not be found** at review time — not in `CLAUDE.md`, `AGENTS.md`,
> `.claude/`, or the user-level instruction file. There is consequently no ignore-rule to
> replace. If such an instruction resurfaces, point it here.

---

## 0. How to use this document (instructions for the AI agent)

1. Requirements are numbered `FR-Mx.y` (membership functional), `FR-Ix.y` (insurance functional), `BR-x.y` (business rule), `NFR-x` (non-functional). Reference them in commits/PRs.
2. Entity field tables define the canonical data model. Names are written camelCase (Prisma), table names snake_case via `@@map` — **the accounting contract's C-decisions (C2, C5, C6, C7) bind here too** except where §14 narrows them.
3. "Posting map" tables define exactly which debit/credit rows reach the ledger. Postings go **only** through the accounting module's engine (`make_gl_entries`, AR-4) — this module never writes a GL row directly.
4. Anything marked **[P2]** is deferrable (see §16 phases). Everything else is core.
5. Where this document and `BRD_Accounting_Module.md` overlap, the accounting BRD wins on ledger behavior; this document wins on membership/insurance domain behavior.
6. **Rule 6 of CLAUDE.md applies:** anything ambiguous or not in this BRD → ask the owner before coding. §17 lists the decisions already made and the ones still open.

---

## 1. Purpose & Scope

### 1.1 Goal

Two revenue instruments the clinic currently cannot sell or account for:

- **Membership (عضويات):** an *owner-level, recurring* benefit program — a client pays a periodic fee and receives a defined bundle of benefits (service discounts, included visits, product discounts, priority flags) across **all their pets**, renewing until cancelled.
- **Insurance (تأمين):** *third-party payment* — a pet is covered by a policy from an insurance company; at billing time the invoice splits into the owner's share (deductible/copay) collected at the counter and the insurer's share, which becomes a **claim** — a receivable owed by the insurer, tracked to approval, settlement, or rejection.

Both must be first-class citizens of the accounting module: membership fees post as (optionally deferred) revenue through the existing subscription engine; claims post as receivables against a new **Insurer** party type, settled through the existing Payment Entry flow.

### 1.2 Why these are ONE module

They share the same architectural seam: both **intervene at the single pricing/collection point of an operational invoice** — membership changes *how much* is charged, insurance changes *who pays it*. Building them together means the pricing path gets exactly one extension point instead of two ad-hoc hooks, and the receipt/invoice screens learn one new concept ("adjustments and payers") instead of two.

### 1.3 In scope (v1 unless marked [P2])

**Membership:**
- Masters: Membership Plan (tiers) with benefit rows; plan versioning by snapshot.
- Lifecycle: enroll, renew (auto via billing), cancel, expire/lapse on non-payment; freeze [P2]; upgrade/downgrade at renewal (immediate + proration [P2]).
- Benefits engine: % or fixed discount per service category, product/POS discount, N included units of a named service per period with usage counters, priority-booking flag, free-delivery/perk flags (display-only v1).
- Billing: recurring fee via the accounting **Subscription** engine (FR-17.2, live since [P12.5]); deferred revenue recognition via the **P12.2** engine (optional per plan).
- Member card/badge surfaces: owner profile, appointment screen, invoice screen, POS.

**Insurance:**
- Masters: Insurer (company + billing contacts + settlement terms), Insurance Product (the insurer's plan: coverage % per service category, annual cap, per-claim cap, deductible, exclusions), Patient Policy (policy number, dates, product, status).
- Claims: claim document per insured invoice; lifecycle draft → submitted → approved / partially approved / rejected → settled / written-off; batch statement per insurer [P2]; pre-authorization workflow [P2].
- Accounting: **Insurer as the FOURTH party type** in the C6 registry (RECEIVABLE side); claim receivable postings; settlement via Payment Entry; rejection re-billing or write-off.
- Reports: claims register, insurer ageing (rides the existing PLE-based AR reports), membership revenue & utilization.

### 1.4 Out of scope (v1, deliberately)

Direct integrations with external insurer APIs/portals (claims are prepared in-system, transmitted out-of-band); actuarial/衡 pricing tools; the clinic *selling* its own insurance product (that is regulated underwriting — memberships are the legal instrument for "wellness plans"); loyalty **points** (OwnerType `LOYALTY` stays a label); coupon stacking beyond BR-6.6; multi-currency membership fees (fees are base-currency; C4 machinery exists if ever needed).

### 1.5 Dependencies

| Module | What this module consumes |
|---|---|
| Owners/Patients | `Owner` (member), `Patient` (insured), owner→patients relation |
| Appointments + Invoice | the operational `Invoice` + `InvoiceTax` and its pricing path (`priceClinicInvoice`, **not** `computeTotals` — see BR-M6.1.1) — the benefits/claims split hook lives there |
| POS (`Sale`) | quote/pricing path for product discounts |
| Services | `Service` tree + `ClinicServiceConfig` (per-clinic price) — benefit and coverage rows target service **categories** (tree nodes) |
| Accounting | party registry (C6), Subscription engine (FR-17.2), Deferred engine (§15/P12.2), adapters (§C3), Payment Entry, PLE outstanding, naming series (C7), `AccountsSetting` registry |
| Care Plans | boundary only — see BR-1.1 |

### BR-1.1 — Membership vs Care Plan boundary (binding)

`CarePlan` already sells a **finite, per-patient package of scheduled visits at a one-time price**. Membership is an **owner-level, open-ended, recurring benefit tier**. The two must not blur:

- A care plan is bought once, has a visit list, completes. A membership renews and has no visit list — it has *entitlements per period*.
- A membership never *contains* scheduled visits. If a plan design wants "includes 4 grooming visits/year", that is an **included-units benefit** (§5.3) consumed at invoicing — not a schedule.
- **Care plans are not discountable in v1 — because they are not billed at all.** An earlier version of this rule said membership benefits "may discount the purchase of a care plan (it is a priced item like any service)". Verified against the code: `CarePlanEnrollment` carries a `priceSnapshot` and nothing else — `src/server/care-plans/` never creates an `Invoice` or a `Sale`, has no payment state, and posts nothing to the ledger. Enrolling in a care plan is today an operational event with **no financial trail**. Discounting it would first require building a billing path for care plans; no phase in §16 contains that work, and it is **out of scope for this module**. If the owner wants care plans sold and posted, that is separate work with its own BRD section — and only then does the membership discount question arise.
- No shared tables, no shared statuses. The only touchpoint is pricing.

---

## 2. Glossary

| Term | Meaning |
|---|---|
| Plan / Tier | `MembershipPlan` — the sellable definition (e.g. ذهبية، فضية) |
| Membership | `Membership` — one owner's enrollment in a plan, with period tracking |
| Benefit | one row of a plan: a discount, an included-units entitlement, or a flag |
| Entitlement | the per-period remaining balance of an included-units benefit |
| Insurer | insurance company — a **party** with a receivable account (C6 4th type) |
| Insurance Product | the insurer's coverage definition the clinic bills against |
| Policy | one patient's active coverage under an insurance product |
| Claim | the document asking an insurer to pay its share of one invoice |
| Copay | the owner-paid share: deductible + non-covered remainder |
| Coverage % | insurer share of an eligible line, before caps |
| Annual cap | maximum the insurer pays per policy per policy-year |
| Snapshot | values copied onto a document at creation so later master edits never rewrite history (the `CarePlanEnrollment.priceSnapshot` discipline) |

---

## 3. Architecture Principles

### AR-M1: One pricing seam, not scattered ifs

All benefit application and insurance splitting happens in **one function**, imported by the **two** pricing services that already exist — `priceClinicInvoice` and `priceSale`, both created by [P12C.1] when it routed pricing through the §8 tax engine. "One seam" is a claim about the *benefits function*, not about the number of call sites: there are two entry points, they share no code but the §8 engine, and they must never grow a third. Order is fixed (§6.4). No screen, DAO, or adapter computes a benefit or a split on its own.

### AR-M2: Snapshot discipline (no retroactive rewrites)

- Enrolling snapshots the plan's fee **and its benefit rows** onto the membership. Editing a plan changes future enrollments and (at renewal) existing ones — never the current period.
- A claim snapshots the coverage terms (percent, caps, deductible) it was computed under. Editing an insurance product never changes a submitted claim.
- This is the same discipline `CarePlanEnrollment` and `SaleTax` already follow.

### AR-M3: The ledger is downstream, never bypassed

Membership fees post through the accounting **Subscription → SalesInvoice** path (already ledger-native). Insurance splits post through the **clinic-invoice adapter** (§C3), extended — not replaced — to emit the two-payer map of §10.2. Cancels append reversals (AR-2). Drafts never touch `gl_entry` (ledger-safety invariant, CLAUDE.md rule 3).

### AR-M4: Statuses are derived where money is involved

A membership is `PAST_DUE` because its subscription's generated invoice is unpaid — not because a job flipped a column. A claim is `SETTLED` because a Payment Entry allocated against it (PLE-derived outstanding = 0) — not because someone clicked "settled". Manual overrides exist only where §5.2/§9.3 name them.

### AR-M5: Additive to existing modules (strangler, §C3 spirit)

No changes to `CarePlan`, `Discount`, or `Invoice` semantics. `Invoice` gains nullable columns + one child table; existing invoices are untouched rows with nulls. Feature flags in the `AccountsSetting` registry gate each half (`enable_membership_module`, `enable_insurance_module`) — OFF means the pricing seam is a pass-through, byte-identical to today (the FR-11.3 flag discipline).

---

## 4. Membership Masters

### 4.1 Membership Plan — `membership_plan` (FR-M4.1)

| Field (camelCase) | Type | Notes |
|---|---|---|
| id / code | cuid / `MPL-XXXX` | code via `generateUniqueCode` (operational master, not a voucher) |
| clinicId | FK reqd | C5: clinic = company |
| name / nameEn [P2] | string reqd | «الباقة الذهبية» |
| description | string? | shown on sale + member card |
| tierRank | int | ordering + upgrade/downgrade direction (higher = better) |
| billingInterval | enum `MONTH \| YEAR` | maps to `SubscriptionInterval` |
| intervalCount | int default 1 | e.g. 3 + MONTH = quarterly |
| fee | Decimal(10,2) reqd | per period, base currency, **tax-exclusive** — tax comes from the resolved template like any sale |
| enrollmentFee | Decimal(10,2) default 0 | one-time, first invoice only |
| deferRevenue | bool default false | ON → the generated invoice items carry the deferred flag (P12.2 engine recognizes over the period) |
| maxPatients | int? | null = all the owner's pets; N = benefit rows apply to at most N designated pets [P2 designation UI] |
| autoRenew | bool default true | OFF = single-period membership, expires at period end |
| graceDays | int default 7 | unpaid renewal keeps benefits this long (BR-5.4) |
| status | enum `ACTIVE \| INACTIVE` | INACTIVE = not sellable; existing memberships unaffected |
| benefits | child table | §4.2 |

- **BR-M4.1.1:** fee ≥ 0; a zero-fee plan is legal (staff/VIP comp tier) and still generates a zero invoice so the audit trail exists.
- **BR-M4.1.2:** deleting a plan with any non-cancelled membership is refused; deactivate instead.

### 4.2 Benefit rows — `membership_plan_benefit` (FR-M4.2)

One plan : N rows. `benefitType` discriminates:

| benefitType | Fields used | Meaning |
|---|---|---|
| `SERVICE_DISCOUNT` | serviceId (tree node), discountPercent OR discountAmount | % or fixed off every line whose service is in that subtree |
| `PRODUCT_DISCOUNT` | discountPercent | % off POS/product lines (inventory items) |
| `INCLUDED_UNITS` | serviceId, unitsPerPeriod | N lines of that service free per billing period (entitlement, §5.3) |
| `PRIORITY_BOOKING` | — | flag surfaced on appointment screens |
| `PERK` | labelAr | display-only line on the member card («استحمام مجاني شهريًا» sold manually) |

| Field | Type | Notes |
|---|---|---|
| id / planId | cuid / FK | cascade delete with plan |
| idx | int | display order |
| benefitType | enum | above |
| serviceId | FK? | `Service` node — **a category applies to its whole subtree** (the service tree exists; resolution = "line's service is a descendant-or-self of benefit's service") |
| discountPercent | Decimal(5,2)? | 0–100 |
| discountAmount | Decimal(10,2)? | fixed per line |
| unitsPerPeriod | int? | INCLUDED_UNITS only |
| labelAr | string? | PERK only |

- **BR-M4.2.1:** exactly one of discountPercent/discountAmount for discount types; both null otherwise. Validated at the model layer (TypeBox) AND the service.
- **BR-M4.2.2:** overlapping `SERVICE_DISCOUNT` rows (a line matching two rows because one service is an ancestor of another) resolve to the **single most specific row** (deepest matching node) — never stack.

---

## 5. Membership Lifecycle

### 5.1 Enrollment (FR-M5.1)

Enrolling an owner in a plan, in ONE transaction:

1. Create `Membership` with plan snapshot (fee, interval, graceDays) + benefit snapshot rows (`membership_benefit`, copied from the plan — AR-M2).
2. Create the backing accounting **Subscription** (party = `("Owner", ownerId)`, plan row = membership fee to the plan's income account; `generateInvoiceAtPeriodStart = true`; `submitGeneratedInvoice` per clinic setting) and store `subscriptionId` on the membership. Enrollment fee is an extra one-time row on the first generated invoice.
3. Initialize entitlement counters for the first period (§5.3).
4. Status = `PENDING_PAYMENT` until the first generated invoice is paid → `ACTIVE`. A clinic may enable `membership_active_on_enroll` (AccountsSetting) to skip the wait (counter sale, cash in hand).

- **BR-M5.1.1:** one owner may hold **at most one non-terminal membership per clinic**. Upgrades replace, never overlap.
- **BR-M5.1.2:** enrollment requires the accounting module operational for the clinic (chart of accounts + §4.1 defaults) — refuse with the standard readiness message otherwise. The membership module has no non-ledger mode.

### 5.2 Status machine (FR-M5.2)

```
PENDING_PAYMENT → ACTIVE → PAST_DUE → LAPSED
                     ↘ CANCELLED (operator, reason mandatory)
ACTIVE → EXPIRED (autoRenew=false, period ended)
```

| Status | Derived from | Benefits apply? |
|---|---|---|
| PENDING_PAYMENT | first invoice unpaid | no |
| ACTIVE | current-period invoice paid | **yes** |
| PAST_DUE | renewal invoice unpaid ≤ graceDays after period start | **yes** (grace) |
| LAPSED | unpaid > graceDays | no |
| CANCELLED | operator action | no |
| EXPIRED | non-renewing period ended | no |

- **BR-M5.2.1:** transitions into/out of PAST_DUE and LAPSED are **derived by a daily job + on-read check** from the subscription's invoice payment state (AR-M4). Only CANCELLED is manual, and its reason is mandatory (the [P12B.1] refund-reason discipline).
- **BR-M5.2.2:** cancelling mid-period: benefits stop immediately; **no automatic refund** — any refund is the operator's explicit action through the existing invoice refund path ([P12B.1]). The unconsumed-value question is deliberately not automated in v1 (§17-O2).
- **BR-M5.2.3:** a LAPSED membership reactivates (→ACTIVE) automatically when the outstanding renewal invoice is paid within the same period; after the period passes it is terminal and re-enrollment starts fresh.

### 5.3 Entitlements — included units (FR-M5.3)

`membership_entitlement`: one row per (membership, INCLUDED_UNITS benefit, period): `periodStart`, `periodEnd`, `unitsGranted`, `unitsConsumed`.

- **BR-M5.3.1:** consumption happens **only** through the pricing seam: an eligible invoice line while units remain → line discounted 100% and `unitsConsumed` incremented **in the same transaction as invoice payment/finalization** (not at draft — a draft consumes nothing, mirroring the ledger-safety invariant).
- **BR-M5.3.2:** refunding an invoice that consumed units returns them **iff** the period is still current; a refund after the period closes does not resurrect units (they were period-scoped) — the money path still refunds normally.
- **BR-M5.3.3:** unused units expire at period end. No rollover in v1 [P2 flag].
- **BR-M5.3.4:** new period rows are created by the same job that generates the renewal invoice — entitlements exist iff their period's invoice exists.

### 5.4 Renewal & billing (FR-M5.4)

Renewal **is** the subscription engine's period generation — this module adds no scheduler. The membership job (daily, alongside the existing accounting jobs):
1. asks the subscription engine to generate due invoices (it is idempotent);
2. derives statuses per §5.2;
3. rolls entitlement periods per BR-M5.3.4;
4. emits inbox notifications: renewal generated, payment overdue (grace), lapsed.

- **BR-M5.4.1:** plan fee changes take effect at the **next** renewal: the job refreshes the subscription plan row from the (possibly edited) `MembershipPlan` at period roll and re-snapshots benefits. Mid-period nothing moves (AR-M2).
- **BR-M5.4.2:** upgrade/downgrade v1 = schedule the change for next renewal (swap plan at roll). Immediate switch with proration is [P2] (§17-O3).

---

## 6. Benefits Engine (the pricing seam)

### 6.1 Where (FR-M6.1)

Two pricing services — verified against the code, and **not** `computeTotals`:

- **Clinic invoices:** `priceClinicInvoice` (`src/server/invoices/clinic-invoice-pricing.service.ts`) — after line prices resolve, **before** the §8 tax engine runs. It has **four** callers and all four must receive benefits: `invoices.dao.ts` (appointment invoices), `radiology-invoice.service.ts`, `lab-invoice.service.ts`, `operations-invoice.service.ts`.
- **POS:** `priceSale` (`src/server/sales/sale-pricing.service.ts`) — same position, reached from both the `/quote` endpoint and `sales.dao`.

- **BR-M6.1.1 (correction of record):** an earlier version named `computeTotals` as the clinic seam. `computeTotals` (`src/server/invoices/invoices.dao.ts`) prices **appointment invoices only**; hooking it would have silently left lab, radiology and operation invoices with no membership benefits at all. The seam is `priceClinicInvoice`. Any future clinic-invoice source that routes through it inherits benefits automatically — one that prices on its own is a defect, not a variant.
- **BR-M6.1.2:** the benefits function is **imported** by both services, never copied into either.

### 6.2 Inputs / outputs

Input: clinicId, ownerId (nullable — POS walk-ins have none), the patient behind each line (nullable), and the priced lines (service or item, qty, unit price). Output: per-line `membershipAdjustment` (amount + which benefit row, snapshot-referenced) and entitlement consumption intents (committed only at pay, BR-M5.3.1).

- **BR-M6.2.1 — the seam does not have that identity today. This is named MI-P2 work, not plumbing.** Verified against the code:
  - `priceClinicInvoice` accepts an optional `partyId`, but **`computeTotals` never passes it** — appointment invoices reach the tax engine with no party at all. All four callers must resolve and pass the owner.
  - Neither pricing service has any concept of a **patient**, which BR-M6.3 requires in order to check that the line's animal belongs to the member.
  - The `Invoice` table stores **neither `ownerId` nor `patientId`**. It reaches them through four mutually exclusive nullable parents (`appointmentId`, `labOrderId`, `radiologyOrderId`, `operationId`), so "who owns this invoice" is a four-way join, not a column read.
  - **Therefore MI-P2 ships one resolver** — document → (ownerId, patientId) — used by every caller, listed as a deliverable in its own right. Whether it is backed by denormalized `Invoice` columns is an implementation decision taken at MI-P2 against NFR-4, not assumed here.

### 6.3 Eligibility (BR-M6.3)

Benefits apply iff: membership status ∈ {ACTIVE, PAST_DUE} **and** the line's patient (when the document has one) belongs to the member owner **and** the line matches a snapshot benefit row. POS product lines match `PRODUCT_DISCOUNT` with no patient check (counter purchase by the member).

### 6.4 Order of application (BR-M6.4 — fixed, not configurable)

1. `INCLUDED_UNITS` (line → 100% off, consume intent) — most specific benefit first;
2. `SERVICE_DISCOUNT` / `PRODUCT_DISCOUNT` on remaining lines (BR-M4.2.2 specificity);
3. existing manual/coupon `Discount` on the remainder (unchanged behavior);
4. **loyalty redemption** (`BRD_Loyalty_Module.md` §8, BR-L8.1) on what remains — see §17.2 row 11;
5. §8 tax engine on the net — **tax is computed after all discounts**, so the state never taxes money the clinic did not charge;
6. insurance split (§9) on the final taxed total.

- **BR-M6.5:** a line never goes below zero; fixed-amount discounts cap at the line amount.
- **BR-M6.6:** membership discounts and coupon discounts **stack in the §6.4 order** (membership first, coupon on the remainder). A clinic can forbid stacking via `membership_stacks_with_coupons=false` (AccountsSetting) — then the larger single reduction wins.
- **BR-M6.7:** every applied adjustment is stored on the invoice (`invoice_membership_adjustment` child rows: line ref, benefit snapshot ref, amount) — the receipt prints them and support can answer "why was this cheaper" without re-deriving.

---

## 7. Membership Accounting

### 7.1 Postings

No new posting paths. The generated **SalesInvoice** posts per accounting §7.2 (Dr Owner-AR / Cr membership income / Cr VAT); payment per §7.4. With `deferRevenue` ON, the invoice items carry the deferred flag and the **P12.2 engine** recognizes monthly (Dr deferred liability / Cr income) — machinery already live and tested.

### 7.2 Discounts are price reductions, not expense postings (BR-M7.2)

A membership discount on a service invoice reduces the invoiced amount — income is recognized net. **No** "discount expense / contra-revenue" leg in v1: the clinic-invoice adapter already posts document totals, and the totals are already net. The utilization **report** (§12) shows gross-vs-net so management sees the giveaway without polluting the ledger. (Contra-revenue account = [P2] if the owner wants it on the P&L — §17-O4.)

### 7.3 Settings (AccountsSetting registry — one place, per module convention)

`enable_membership_module` (master flag, default false) · `membership_income_account_id` · `membership_deferred_account_id` (required iff any plan defers) · `membership_active_on_enroll` · `membership_stacks_with_coupons`. All follow the [P12.6] registry shapes (account pickers render automatically from the `_account_id` suffix). **Validation timing (owner decision 2026-08-22, MI-P0 Q2):** a missing account setting refuses loudly **at first use**, naming the setting — the FR-11.3 precedent — not at settings save; saving with both flags OFF always succeeds. The `membership_deferred_account_id`-required-iff-any-plan-defers check therefore lands with the deferral path in MI-P1, not MI-P0.

---

## 8. Insurance Masters

### 8.1 Insurer — `insurer` (FR-I8.1)

The company. Party-shaped like `Supplier`/`Owner`:

| Field | Type | Notes |
|---|---|---|
| id / code | cuid / `INS-XXXX` | |
| clinicId | FK reqd | |
| name | string reqd | «شركة التأمين الوطنية» |
| phone / email / contactPerson / address | string? | claims desk |
| settlementDays | int default 30 | expected payment terms → claim due date |
| active / isDeleted | bool | soft-delete like Owner |
| notes | string? | |

**No `defaultReceivableAccountId` column (correction #8 — owner decision 2026-08-22, MI-P0).** An earlier version of this table carried a per-insurer AR-override FK and described a fall-back to a «C6 type default». Neither matches the live resolution machinery: per-party account overrides live in the accounting-owned `party_account` child table (BR-4.10 step 2 — the «حسابات الأطراف» screen manages it for every registered party type automatically), and the fall-back is the **side** default (`ClinicAccountingSettings.defaultReceivableAccountId`, step 3) — no per-type default exists anywhere. Decision: **zero new machinery** — the column is dropped; a per-insurer override is a `party_account` row; the default is the existing side default; the settings readiness check is unchanged.

**C6 registry change (binding).** `PARTY_TYPES` (`src/server/accounting/party/party.type.ts`) gains:

```ts
{ key: "Insurer", side: "RECEIVABLE", labelAr: "شركة تأمين", labelEn: "Insurer" }
```

`labelEn` is **required** by `PartyTypeDefinition`; an earlier version of this line omitted it and would not have compiled. (The registry's type is the one place an English label is still mandatory — the amended rule 5 governs *screens*, not this.)

**What that addition buys for free — and what it does not.**

*Free, genuinely zero new code,* because every one of these derives from the registry rather than hardcoding party types: PLE derivation, the party trial balance, AR ageing, reconciliation, the Payment Entry party picker, BR-4.10 account resolution, and the `party-type-literals` audit test (it scans source textually against the registry, so a new key is picked up with no edit).

*Not free:* `src/server/accounting/party/party.dao.ts` holds **two exhaustive `switch` statements** over `PartyTypeKey` with no `default` branch — `listMasters` and `findMaster`. Each reads the operational master table behind a party type (`owner`, `supplier`, `staff`), and **neither compiles** until an `Insurer` branch is added reading the new `insurer` table. This is the type system doing its job — it refuses a half-added party type — but it means the C6 change is a **DAO change as well as a registry row**, and MI-P0 must budget for it.

- **BR-I8.1.1:** the party-registry addition ships in **MI-P0**, together with both `party.dao.ts` branches and its own party-resolution test — an Insurer party resolves to a receivable account, and a payable-side account is rejected by the BR-4.10.1 type check. Everything else in the insurance half depends on this landing first.

### 8.2 Insurance Product — `insurance_product` (FR-I8.2)

The coverage definition:

| Field | Type | Notes |
|---|---|---|
| id / code / clinicId / insurerId | | `IPR-XXXX` |
| name | string reqd | «بوليصة الحيوانات المنزلية بلس» |
| coveragePercentDefault | Decimal(5,2) | insurer share when no category row matches |
| annualCap | Decimal(10,2)? | null = uncapped; per policy-year |
| perClaimCap | Decimal(10,2)? | |
| deductibleFixed | Decimal(10,2) default 0 | per claim, owner pays first |
| deductiblePercent | Decimal(5,2) default 0 | applied after fixed; both may be 0 |
| requiresPreAuthAbove | Decimal(10,2)? [P2] | claims above → pre-auth workflow |
| coverageRows | child | per service-category overrides: serviceId + coveragePercent (0 = excluded). Subtree + specificity resolution identical to BR-M4.2.2 — **same resolver code, one implementation** |
| active | bool | |

### 8.3 Patient Policy — `patient_policy` (FR-I8.3)

| Field | Type | Notes |
|---|---|---|
| id / clinicId / patientId / productId | | |
| policyNumber | string reqd | insurer's identifier — appears on every claim |
| policyStart / policyEnd | date | policy-year for the annual cap window |
| status | enum `ACTIVE \| EXPIRED \| SUSPENDED \| CANCELLED` | EXPIRED derived from policyEnd (daily job + on-read); others manual |
| capConsumed | Decimal(10,2) default 0 | maintained by claim lifecycle (BR-I9.6) — **derived-rebuildable** from claims, stored for the pricing seam's speed |
| notes | string? | |

- **BR-I8.3.1:** one patient may hold at most one ACTIVE policy (v1 — coordination of benefits between two insurers is out of scope).
- **BR-I8.3.2:** the pricing seam treats a policy as coverage **only** when status=ACTIVE and the service date ∈ [policyStart, policyEnd].

---

## 9. Claims Lifecycle

### 9.1 The split (FR-I9.1)

At invoice **finalization** (the pay screen, before collecting), when the patient has an active policy and `enable_insurance_module` is ON:

1. For each line: resolve coverage % (category rows → default; 0 = excluded).
2. Insurer share = Σ(line total incl. its tax share × coverage%) − deductible, clamped by perClaimCap and remaining annualCap.
3. Owner copay = invoice total − insurer share. The counter collects **the copay only**; the invoice records both figures (`insurerShare`, `copayShare` nullable columns + `claimId`).
4. A **Claim** document is created in `DRAFT` with line-level snapshots (§9.2).

- **BR-I9.1.1:** the split is computed **after** membership benefits and taxes (§6.4 step 6, renumbered from 5 by §17.2 row 11) — the insurer reimburses what was actually charged.
- **BR-I9.1.2:** the operator sees the split before confirming and may **reduce** the insurer share (push lines to copay — e.g. the insurer is known to reject grooming) but never increase it beyond the computed figure.
- **BR-I9.1.3:** the live `InvoiceStatus` enum already distinguishes the two reversals ([P12B.1]): `VOIDED` for an **unpaid** invoice, `REFUNDED` for a **paid** one. An insured invoice sits between the two — the copay is collected while the insurer's share is still outstanding — so it fits neither category cleanly, and a rule phrased only as "cannot be VOIDED" leaves the refund path open. The rule is therefore stated on the **claim**, not on the payment state: **an invoice carrying a claim in any state other than `DRAFT` or `CANCELLED` may be neither voided nor refunded** until the claim is resolved (BR-I9.5). A `DRAFT` claim is cancelled automatically and the invoice reverses normally through the [P12B.1] path.

### 9.2 Claim document — `insurance_claim` (FR-I9.2)

| Field | Type | Notes |
|---|---|---|
| id / clinicId | | |
| documentNo | `CLM-{YYYY}-{#####}` | **C7 naming series, assigned at SUBMIT** in the submit transaction — a claim is a quasi-voucher with a gap-free legal trail, unlike operational masters |
| invoiceId | FK unique | 1:1 with the operational invoice |
| policyId / insurerId / patientId / ownerId | FK | denormalized for list screens |
| policyNumberSnapshot | string | |
| serviceDate | date | invoice date |
| claimedAmount | Decimal(10,2) | insurer share at submission |
| approvedAmount | Decimal(10,2)? | set at adjudication |
| settledAmount | Decimal(10,2) default 0 | derived from PLE allocations |
| status | enum §9.3 | |
| coverageSnapshot | Json | product terms at computation (AR-M2) |
| lines | child | per invoice line: description, lineTotal, coveragePercent, insurerAmount |
| submittedAt / adjudicatedAt / rejectionReason | | reason mandatory on any rejection (full or partial) |

### 9.3 Status machine (FR-I9.3)

```
DRAFT → SUBMITTED → APPROVED ────────────→ SETTLED
   ↘ CANCELLED   ↘ PARTIALLY_APPROVED ──↗    (PLE outstanding = 0)
                  ↘ REJECTED → (re-bill owner | write-off)
```

- `DRAFT`: split recorded, nothing posted, editable (BR-I9.1.2). Copay collection is independent — the counter never waits for the insurer.
- `SUBMITTED`: operator marks the claim sent (paper/portal, out-of-band). **This is the posting event** (§10.2). documentNo assigned here.
- `APPROVED` / `PARTIALLY_APPROVED`: adjudication result entered manually with the insurer's reference; partial requires per-line or lump `approvedAmount` < claimed, and the difference immediately follows the rejection flow for that remainder (BR-I9.4).
- `SETTLED`: derived — a Payment Entry (party = Insurer) allocated against the claim's receivable brings PLE outstanding to 0 (AR-M4). Partial payments = APPROVED with partial settlement, visible in ageing.
- `REJECTED` / rejected remainder: operator chooses per BR-I9.4. `CANCELLED`: draft-only.

### BR-I9.4 — Rejection handling (binding)

The rejected amount is money the clinic already earned; it goes exactly one of two places, chosen explicitly:
1. **Re-bill owner:** amount moves to the owner's balance — posting §10.3a; the invoice's copay figure updates; the owner sees it as an open balance on their profile.
2. **Write-off:** posting §10.3b to the clinic's write-off account (§4.1 default) — an expense-side decision, permission-gated separately (§13).
No third option, no silent state.

### BR-I9.5 — Refund cascade

Refunding an invoice that carries a claim: DRAFT claim → cancelled automatically. SUBMITTED+ → the refund is **refused** until the claim is resolved (settled claims mean insurer money must be handled — v1 refuses with a message directing to manual JE; automated insurer-refund flow is [P2]).

### BR-I9.6 — Annual cap integrity

`capConsumed` increases at claim **submission** (claimed), adjusts at adjudication (approved < claimed releases the difference), decreases on rejection-remainder resolution. A nightly audit job recomputes from claims and alarms on drift (the derived-rebuildable discipline).

---

## 10. Insurance Accounting (posting maps)

All rows go through `make_gl_entries` via the extended clinic-invoice adapter (AR-M3). Party legs follow BR-4.3.3 (party mandatory on RECEIVABLE accounts).

### 10.1 Uninsured invoice (unchanged — today's map)

| Dr | Cr |
|---|---|
| Cash/Bank (amount paid) | Income (net) · VAT rows |

### 10.2 Insured invoice — the two-payer map (claim SUBMITTED + copay paid)

| Row | Account | Party | Amount |
|---|---|---|---|
| Dr | Cash/Bank | — | copay |
| Dr | Insurer AR (BR-4.10 resolution: policy insurer's account → C6 default) | ("Insurer", insurerId), against the claim | insurerShare |
| Cr | Income | — | net total |
| Cr | each VAT row's account head | — | tax rows |

PLE derives the claim receivable automatically (§5.2 of the accounting BRD) — insurer ageing, statements and reconciliation need zero new code.

### 10.3 Rejection resolutions

**(a) Re-bill owner:** Dr Owner AR ("Owner", ownerId) / Cr Insurer AR ("Insurer", insurerId) — rejectedAmount. **(b) Write-off:** Dr write-off account / Cr Insurer AR ("Insurer", insurerId) — rejectedAmount. Both are system JEs in the resolution transaction, cancel-append per AR-2.

### 10.4 Settlement

A normal **Payment Entry** (Receive, party type Insurer) allocated against open claims — the [P7.2] outstanding pane lists them because they are PLE rows. Bulk settlement of many claims in one payment = the existing multi-reference allocation. Nothing new.

---

## 11. Screens (design-system contract binding)

Per contract §10.3 (placement law) and §7.8/hub rule. Arabic-only per amended rule 5; RTL per contract §9; every screen uses the §4 recipes (list kit, `AccountingFormSheet`-style create sheets, confirm dialogs).

> **AMENDED — owner decision 2026-08-24 (§17.2 row 10).** This section originally read
> «**No new sidebar groups.**» and placed the three MI screens among the العمليات اليومية
> tabs. The owner overruled it: MI is a full module and deserves **module-level
> navigation**, the way grooming and nutrition surface. MI now owns a group of its own —
> **«العضويات والتأمين»**, a sibling of «العمليات اليومية» / «الدفاتر» / «التقارير المالية»
> inside «المالية» — and the three screens leave the daily-operations tab bar entirely.
> Two things fall out of that, both wanted: «المطالبات التأمينية» is no longer buried under
> the «المزيد» overflow (it was the 7th item against a six-tab cap), and daily operations
> drops back inside that cap. The **reports stay** under «التقارير المالية» with the other
> financial reports — reports live with reports.

| Screen | Placement | Recipe |
|---|---|---|
| «العضويات» hub: plans tab + members tab + entitlements view | المالية ← **العضويات والتأمين** (hub with `?tab=`) | list + form-sheet |
| Member badge + benefits panel | owner profile, appointment sheet, invoice/pay screen, POS cart (read-only chip: tier, status, remaining units) | existing profile-card patterns |
| «التأمين» hub: insurers tab + products tab + policies tab | المالية ← **العضويات والتأمين** (internal tabs unchanged: بوالص المرضى / المنتجات / الشركات) | list + form-sheet |
| Policy chip + coverage preview | patient profile, invoice/pay screen (the split preview of BR-I9.1.2) | |
| «المطالبات التأمينية» list + claim detail (lifecycle actions) | المالية ← **العضويات والتأمين** | list + detail sheet |
| Settings block (flags + account pickers) | «المحاسبة ← الإعدادات» — the existing AccountsSetting screen picks these up **automatically** (registry-driven, incl. the [P12.6] account-picker rendering) | zero new code |
| Reports (§12) | المالية ← التقارير المالية | report recipe |

Naming note: «المطالبات التأمينية» must be visually distinct from the accounting «المطالبات» (dunning) — both exist; the one-line scope statement under the title (the §7.1 coexistence mitigation) is mandatory on both.

---

## 12. Reports

| Report | Source | Content |
|---|---|---|
| FR-R12.1 سجل المطالبات | claims | filterable register: insurer, status, ageing vs settlementDays, claimed/approved/settled |
| FR-R12.2 أعمار ذمم شركات التأمين | **existing PLE AR report** filtered to party type Insurer | zero new engine |
| FR-R12.3 إيراد العضويات | subscription invoices ∪ deferred schedule | billed vs recognized vs deferred balance per plan |
| FR-R12.4 استخدام المزايا | invoice adjustments + entitlements | gross vs net, discount given per plan/benefit, entitlement consumption %, member LTV vs fees paid |
| FR-R12.5 كشف مطالبات لشركة تأمين [P2] | claims batch | printable statement per insurer per period |

---

## 13. Permissions

Follows the accounting doctype registry pattern — new doctypes: `membership_plan`, `membership`, `insurer`, `insurance_product`, `patient_policy`, `insurance_claim`, each with read/write/submit/cancel as applicable. **Rule-12 corollary binds:** every gated endpoint ships an authorized-passes / unauthorized-403 controller test. Specifically privileged actions: claim write-off (BR-I9.4b) requires the same permission tier as accounting write-offs; membership cancel requires write + reason. **Registration timing (owner decision 2026-08-22, MI-P0 Q1):** the `insurer` doctype registers in `ACCOUNTING_DOCTYPES` in MI-P0 itself (kind `master`, read/write) — registration is data-only and inert while no routes exist; the rule-12 authorized/403 controller tests bind when the MI-P3 endpoints land.

## 14. Non-functional & conventions

- **NFR-1:** every state transition that posts runs in ONE serializable transaction (the accounting NFR-1).
- **NFR-2:** money `Decimal(10,2)` on operational documents (the `Invoice` precedent); anything entering the GL passes through the engine which owns the 21,9 arithmetic (contract C2). No JS floats anywhere (`amount-strings` utilities client-side). **Percentages are `Decimal(5,2)` throughout** — `discountPercent` (§4.2), `coveragePercentDefault` and `deductiblePercent` (§8.2), and the per-category coverage rows. This is deliberate and it has an edge: 33.33% is representable, 33.333% is not. Confirmed at owner review 2026-08-22. If any insurer agreement or plan design quotes a rate with three decimals, this must change **before** the MI-P3 migration, not after it.
- **NFR-3:** 4-file server resources, TypeBox+prismabox models, `Prisma.XGetPayload` responses, Arabic-only client errors, `@/` imports — AGENTS.md verbatim.
- **NFR-4:** pricing-seam overhead ≤ one indexed query per document when both flags are OFF (a guard clause, no joins).
- **NFR-5:** rule-8/11/12/14 CI discipline: DB-backed tests run in the full tier; phase exits ship the rule-10 trio; walkthroughs are executed, not written.

## 15. Data model appendix — new tables

`membership_plan` · `membership_plan_benefit` · `membership` (owner enrollment + snapshots + `subscriptionId`) · `membership_benefit` (snapshot rows) · `membership_entitlement` · `invoice_membership_adjustment` · `insurer` · `insurance_product` · `insurance_product_coverage` · `patient_policy` · `insurance_claim` · `insurance_claim_line`. Modified: `Invoice` +`membershipId?`, `claimId?`, `insurerShare?`, `copayShare?` (all nullable — AR-M5); `Sale` +`membershipId?` + adjustment child. `PARTY_TYPES` + Insurer. Migrations via `prisma migrate diff` (rule 8), one migration per phase.

## 16. Implementation phases (outline — full phases file at kickoff, accounting-style)

| Phase | Contents | Exit proof |
|---|---|---|
| MI-P0 | flags + settings keys + **Insurer party type in C6 registry** (registry row **with `labelEn`** + both `party.dao.ts` switch branches, BR-I8.1.1) + party-resolution tests | registry tests green; an Insurer party resolves to a receivable account and a payable-side account is rejected |
| MI-P1 | membership masters + enrollment + subscription wiring + status job | enroll→invoice→pay→ACTIVE walkthrough |
| MI-P2 | **document → (ownerId, patientId) resolver** (BR-M6.2.1 — the seam has neither today) + benefits engine imported by `priceClinicInvoice` **and** `priceSale` (BR-M6.1.1/2) + adjustments + entitlements | flag-OFF byte-identical pricing test (the FR-11.3 map-diff discipline) + golden pricing fixtures covering **all four** clinic-invoice callers, not appointments alone |
| MI-P3 | insurance masters + policies | policy CRUD + coverage resolver tests (shared with BR-M4.2.2) |
| MI-P4 | claim split + claim document + two-payer posting map + adapter extension | zero-diff report still 0 for uninsured; insured invoice round-trip |
| MI-P5 | adjudication, settlement via PE, rejection flows, insurer ageing | full claim lifecycle walkthrough, executed |
| MI-P6 | reports + member/policy surfaces on profiles + polish | rule-10 trio |

### 16.1 Module closing record (all phases green, 2026-08-23)

Every phase exit ran the FULL CI tier (migrations + production build + the entire suite,
DB suites included) and shipped an executed walkthrough, not a written one.

| Phase | Delivered | Full-tier run |
|---|---|---|
| MI-P0 | Insurer party type in the C6 registry (+ both `party.dao` switches), six settings keys, `insurer` doctype — all inert behind OFF flags | #63 |
| MI-P1 | Membership masters, enrollment, subscription wiring, §5.2 status derivation + daily job | #68 |
| MI-P2 | The `document → (ownerId, patientId)` resolver, benefits engine at BOTH pricing seams, adjustments, entitlements | #70 |
| MI-P3 | Insurance masters, patient policies, the coverage resolver SHARED with BR-M4.2.2 | #71 |
| MI-P4 | Claim split (§9.1), the claim document, the §10.2 two-payer map, adapter extension | #72 |
| MI-P5 | Adjudication, BR-I9.4 resolutions (§10.3a/b), settlement through the existing PE engine, insurer ageing | #75 |
| MI-P6 | §12 reports, §11 profile surfaces, the §17 open-balance chip, the O1 demo seed | #82 |

Two module-wide invariants held at every exit: **both flags OFF ⇒ byte-identical
behaviour** (the FR-11.3 map-diff pins at both seams), and **the adapter's zero-diff
report stays 0** through split, submit, adjudication, re-bill and settlement.

---

## 17. Decisions

**Resolved (owner may veto in review):**
- **MI-C1:** membership is per-**Owner**, covering all their patients (maxPatients narrows [P2]). Care-plan boundary per BR-1.1.
- **MI-C2:** billing rides the existing Subscription engine; no new scheduler, no new invoice generator.
- **MI-C3:** Insurer = 4th C6 party type; claims are PLE receivables; settlement = ordinary Payment Entry.
- **MI-C4:** claim documentNo via C7 naming series at submit; masters via `generateUniqueCode`.
- **MI-C5:** both halves behind default-OFF flags; OFF = pass-through pricing (tested by diff, not asserted).
- **MI-C6:** `OwnerType` (VIP/LOYALTY…) stays a cosmetic label — membership tier is the real mechanism; no coupling.

**Decided at owner review, 2026-08-22.** O2/O3/O4 were delegated to the author with the
instruction "do what is right"; each is recorded with its reasoning so the decision can be
challenged on the reasoning rather than on authority.

- **O2 — cancel mid-period: NO automated refund in v1. BR-M5.2.2 confirmed.**
  Benefits stop immediately; any refund stays the operator's explicit action through the
  existing [P12B.1] refund path, which already demands a mandatory reason and records who
  performed it — so "no automation" is not an absence of capability, it is routing to a tested
  path that leaves an audit trail. Three reasons:
  1. **Membership value is front-loaded.** A member rationally consumes included units early.
     A plain time-proration therefore refunds most of the fee to someone who already took most
     of the value — a systematic loss, not an edge case.
  2. **The just formula cannot be built yet.** `PRORATA_MINUS_CONSUMED` requires pricing
     consumed entitlement units, which depends on the MI-P2 engine. Building the fairest
     formula on machinery that does not exist is the wrong order.
  3. **It is the highest-risk automation in the module.** An automated mid-period refund
     touches the deferred-revenue schedule (P12.2), a credit note, and a reversing posting in
     one transaction.

  **Direction recorded for v2 (not scheduled):** `PRORATA_MINUS_CONSUMED` — never plain
  `PRORATA`. No speculative column is added now; §16 ships one migration per phase anyway.

- **O3 — immediate upgrade with proration: stays [P2]. BR-M5.4.2 confirmed.**
  It needs three things simultaneously — fee proration, a mid-period entitlement re-grant, and
  a difference invoice or credit note through the subscription engine — all inside the
  machinery MI-P1 and MI-P2 are still stabilizing. And there is a **zero-cost workaround at
  launch**: cancel and re-enroll on the higher tier, which an operator can already do by hand.
  The common case, changing tier at renewal, is core per BR-M5.4.2.

  **Caveat recorded deliberately:** the archived earlier draft made upgrade-with-proration
  *core* (its M6). That may reflect a commercial requirement not visible in the code. **If the
  sales motion depends on in-period upgrades, this decision reverses** — the owner should say
  so before MI-P1 closes, when it is still cheap.

- **O4 — contra-revenue account for membership discounts: NO. BR-M7.2 confirmed.**
  The reason is accounting, not effort. Under **IFRS 15** revenue is measured at the
  transaction price — the consideration the entity expects to be entitled to, that is, **net of
  discount**. A trade discount is not an expense; posting it to a contra/expense leg overstates
  revenue and cost simultaneously. BR-M7.2 is therefore not a simplification, it is the correct
  treatment. Practically it also avoids reworking a tested posting map: the clinic-invoice
  adapter posts document totals, which are already net, and a gross-plus-contra map would open
  a reconciliation difference against the operational invoice total for no gain in the accounts'
  faithfulness. **The management need is already served** by FR-R12.4, which reports gross vs
  net and the giveaway per plan and per benefit — visibility without polluting the ledger.

**Still open — the owner has not decided. Nothing below is invented (rule 6).**

- **O1 — the tier set: names, tier order, fee and billing interval, and what each tier actually
  gives** (discount % per service category, included units per service). These are commercial
  figures and they are the owner's.
  **Blocks MI-P6 only** — the demo seed and its rule-10 verification trio, which pin exact
  figures. MI-P0→MI-P5 proceed without them, using fixture plans that are named as fixtures in
  the test files and never presented as the clinic's real tiers.

- **O5 — insurance tax treatment. Jurisdiction fixed: KSA (owner, 2026-08-22); the answer waits
  on the actual insurer agreements. Blocks MI-P4 only.**

  *Working assumption, and why it is the likely answer:* **tax-inclusive** — the insurer
  reimburses its share of the amount **including VAT**, exactly as BR-I9.1 computes it today.
  Under KSA VAT the taxable supply is **clinic → owner**, not clinic → insurer. The insurer is a
  third party settling part of the consideration for that single supply, and consideration paid
  by a third party remains part of the taxable value — it neither splits the supply nor reduces
  its base. The tax invoice is therefore issued to the **owner** for the full amount including
  VAT, and the insurer's share is a collection against it. This is also what makes the §10.2
  posting map reconcile: the two payers' legs sum to the invoice total including tax, exactly.

  > This is reasoning from VAT principle as applied in KSA — **not a tax opinion**. It needs the
  > clinic's accountant to confirm, and pet insurance is a young market locally, so an actual
  > agreement may impose something different commercially.

  - **O5a — the question that matters more than the rate: in whose name is the tax invoice
    issued?** If an insurer requires a tax invoice **in its own name** for its share, that is
    not a tweak to the split formula — it asserts two separate supplies, a materially different
    and generally incorrect treatment. **This is the clause to look for in the agreements.**
  - **O5b — if reimbursement turns out to be tax-exclusive:** coverage is computed on the
    pre-tax net and the whole tax falls into the copay. BR-I9.1, §6.4 step 6 and the §10.2
    posting map all change. A small edit — but it must land **before** MI-P4, not after.
  - **O5c — if the answer differs per insurer:** it becomes a `reimbursesTaxInclusive` boolean
    on `insurer` and the split engine branches on it. Decide once; do **not** build the branch
    speculatively, since it doubles the MI-P4 test matrix.

  **O5/O5a — RESOLVED (owner, 2026-08-23, at the MI-P4 gate).** Decided per the KSA
  regulatory default (ZATCA insurance-activities VAT guideline 2021 + healthcare guideline
  Art. 53 note), not per individual insurer preference:

  1. **O5a: the tax invoice is issued in the OWNER's name — always, v1.** The insurer's
     share is an indemnity settling part of the owner's receivable. The clinic issues NO
     tax invoice, simplified or standard, in the insurer's name. *ZATCA default
     presumption: policyholder is the service recipient; insurer pays as indemnity;
     direct-contract invoicing deferred [P2].* The direct-contract scenario (a network
     agreement making the insurer the contractual recipient, which ZATCA's healthcare
     guideline routes the invoice to) is the known future variant — **[P2], per-insurer,
     not a v1 setting**.
  2. **O5: coverage applies to the TAX-INCLUSIVE total** (the working assumption held).
     The split runs after §6.4 step 5 (the tax engine) on the final gross at the step-6
     entry point; no
     separate VAT computation on the insurer share, no VAT re-characterization — the GL
     tax lines are whatever the invoice already posts; the split only divides WHO owes
     the gross. O5b is closed; O5c is moot (single rule, no per-insurer field).
  3. **Posting consequence:** one invoice, one tax posting, two receivable legs — copay
     against cash at the counter, insurer share against the Insurer party (C6 RECEIVABLE,
     account via BR-4.10) — §10.2 as written.
  4. **Rounding (P4-Q1, owner delegated «اعمل الصح بما يتناسب مع النظام السعودي»):**
     the insurer share is rounded to the halala (2dp, half-up — the ZATCA-conventional
     commercial rounding) AFTER deductibles and caps; the owner copay = gross − insurer
     share. The two legs therefore always sum exactly to the invoice total, and sub-halala
     fractions fall to the owner at the counter, never into the claim.

- **O6 — should care plans be sold and posted at all?** Raised by this review, not by the
  module. Care-plan enrollment currently produces no invoice and no ledger entry (§18.3).
  **Blocks nothing here** — it is a gap in the existing product, independent of membership —
  but it is the owner's call whether it is a gap worth closing. Full statement in **§18.3**.

**MI-P1 build decisions (owner, 2026-08-23).** Recorded at the MI-P1 verification gate:

- **P1-Q1 — `enrollmentFee` mechanism:** the Subscription engine had no one-time-row concept
  (plan rows repeat every period). Decision: **minimal engine extension** —
  `subscription_plan.firstPeriodOnly`; `generateInvoice` includes such rows only when no
  invoice has ever been generated for the subscription (a DB fact, not loop state, so a
  catch-up run stays correct). Own test required and shipped.
- **P1-Q2 — `deferRevenue` wiring:** plan rows could not mark generated items deferred,
  though `SalesInvoiceItem` supports the full [P12.2] shape. Decision: **minimal engine
  extension** — `enableDeferredRevenue` + `deferredAccountId` on `subscription_plan`, passed
  through to the generated item with service dates = the billing period bounds. Own test.
- **P1-Q4 — plan deletion:** **no delete endpoint.** Deactivation (`INACTIVE` = not sellable)
  is the only retirement path; BR-M4.1.2's refusal case therefore cannot arise via the API.
- **P1-Q5 — BR-M5.1.1 terminal set confirmed:** LAPSED **within** its period is
  non-terminal (it can reactivate, BR-M5.2.3) and blocks a new enrollment; after the period
  ends it is terminal and re-enrollment opens.
- **P1-Q6 — O3 re-confirmed:** the sales motion does not need mid-period counter upgrades;
  immediate proration stays [P2].

**MI-P1 build outcomes (recorded at exit, 2026-08-23).** Two mechanisms the build added that
a later phase must not "correct" without reading this:

- **BR-M5.4.2 v1 restriction — cadence swaps are refused.** `schedule-plan-change` rejects a
  target plan whose `billingInterval`/`intervalCount` differ from the membership's snapshot
  («الخطة الهدف بدورة فوترة مختلفة — تغيير الدورة يتم بإلغاء العضوية وإعادة التسجيل»). Reason:
  the Subscription engine derives periods BY INDEX from `startDate`; re-anchoring a live grid
  makes the next generated invoice overlap an already-billed span, and the
  `(subscriptionId, periodEndDate)` unique key cannot catch it because the end dates differ.
  Same-cadence swaps (the tier upgrade/downgrade case) work as BR-M5.4.2 describes. Lifting
  the restriction requires a grid re-anchoring design on the engine, not a guard removal.
- **BR-M5.4.1 mechanism — benefit snapshots are SUPERSEDED, never deleted.**
  `membership_benefit.supersededAt` (null = current) marks old snapshot rows at each period
  roll; deleting them instead would cascade past periods' `membership_entitlement` rows away,
  which BR-M5.3.3 forbids. Current benefits = `supersededAt IS NULL`; readers (the MI-P2
  engine included) must filter on it.

**MI-P2 build outcomes (recorded at exit, 2026-08-23).** Decisions and mechanisms the build
fixed that a later phase must not "correct" without reading this:

- **P2-Q1 — R1 warning built now (owner decision):** plan create/update responses carry a
  `valueAssessment {estimatedValue, fee, belowValue, partial}`; the plan form shows a warning
  toast when `belowValue`. Warn, never block.
- **R1 `partial` semantics:** `partial = true` means *a monetary benefit could not be valued*,
  so the estimate is a deliberate **underestimate** (the safe side for a below-value warning).
  That covers an `INCLUDED_UNITS`/`SERVICE_DISCOUNT` row whose service has no
  `ClinicServiceConfig` price, and **every `PRODUCT_DISCOUNT` row** — a percentage off an
  unknown future basket has no basket-free value. `PRIORITY_BOOKING`/`PERK` are non-monetary
  and never affect the flag. (Run 32638176662 caught the original omission: PRODUCT_DISCOUNT
  fell through the chain and the assessment claimed completeness.)
- **BR-M6.6 OFF = the larger single reduction wins, entirely.** Membership total > coupon ⇒
  the coupon reaches §8 as zero (`couponSuppressed`); coupon > membership total ⇒ the
  membership is dropped **with its consumption intents** (`membershipSuppressed`) and pricing
  passes through untouched. No partial mixing in either direction.
- **BR-M5.3.1 concurrency — the guarded conditional UPDATE is the lock.** Intents are
  derived at issue-time and committed inside the payment transaction via
  `UPDATE … SET unitsConsumed = unitsConsumed + n WHERE unitsConsumed + n <= unitsGranted`;
  zero rows affected aborts the payment with an Arabic error. A stale intent (units taken by
  a racing document since issue) never over-consumes: paying re-prices the invoice, which
  drops the dead intents and restores full price. Do not replace this with an
  advisory/optimistic scheme without re-proving the last-unit race test.
- **BR-M6.7 adjustment rows carry plain-id refs, not FKs** (`membershipId`/`benefitId`/
  `entitlementId` as strings; only clinic + document are FK-cascaded) — the audit row must
  survive later deletion of what produced it, the `sourceBenefitId` precedent.

**MI-P3 build outcomes (recorded at exit, 2026-08-23).** Decisions and mechanisms the build
fixed that a later phase must not "correct" without reading this:

- **One BR-M4.2.2 implementation, literally:** `pickMostSpecific` (the membership engine's
  deepest-node-wins resolver) was genericized over `{serviceId, idx}` rows and exported;
  the §8.2 coverage resolution imports it. Do not fork a second copy — the §8.2 mandate is
  "same resolver code, one implementation", and both modules' tests pin the shared
  semantics (deepest wins alone; ties by lower idx; duplicates are DEFINED behavior, not
  refused).
- **BR-I8.3.1 mechanics:** the one-ACTIVE-policy check runs under a Serializable
  transaction (the BR-M5.1.1 precedent) and is re-checked on SUSPENDED→ACTIVE promotion.
  The clash query excludes ACTIVE rows whose `policyEnd` has passed — a date-expired row
  is EXPIRED by derivation and must not block a renewal created before the daily job ran.
- **Policy `patientId` is immutable after creation** (update refuses with an Arabic
  message): moving a policy between patients would corrupt the claim trail that will hang
  off it in MI-P4. Re-insuring a different patient = a new policy.
- **`patient_policy.capConsumed` exists but nothing writes it in MI-P3.** It is
  claim-lifecycle property (BR-I9.6): submission increases it, adjudication adjusts it,
  the nightly audit recomputes it — all MI-P4/P5. The column ships now only so the
  resolver's `capRemaining` shape is final for the P4 seam.
- **The policy-expiry daily step joined the MEMBERSHIP job's runner registration** (no
  new job, per §8.3's "daily job" + the one-runner discipline), behind the INDEPENDENT
  insurance flag — hand-trigger («تشغيل») and the unattended handler call the same pair,
  so manual ≡ scheduled holds for both modules.
- **Party-screen finding fixed:** the parties list was already registry-driven (an
  insurer created via the new endpoints appears with zero wiring — pinned by test), but
  the stat cards hand-counted three party types; an Insurer card was added.

**MI-P4 build outcomes (recorded at exit, 2026-08-23).** Decisions and mechanisms the build
fixed that a later phase must not "correct" without reading this:

- **Operational-invoice PAID means the OWNER's obligation is settled.** §10.2 defines
  Dr Cash = copay, so when a claim is applied every pay flow computes
  `ownerDue = copayShare` and derives PAID from `amountPaid >= ownerDue`. Everything
  keyed on PAID — membership consumption commit, section settlement, appointment DONE —
  fires on the owner basis; the insurer share is a receivable on the claim, not part of
  the counter transaction. Do not "fix" a PAID invoice whose `amountPaid < total` as a
  bug: under a claim that is the design.
- **Invoice figures FREEZE under a live claim** (AR-M2 discipline): once a claim exists
  in a non-CANCELLED state, `createOrRefresh` returns the stored invoice untouched and
  pay updates only `amountPaid`/`status`/`paymentMethod`/`paidAt`. Re-pricing would
  desync the claim's snapshot from the invoice it claims against.
- **Manual DRAFT cancel restores the invoice to uninsured:** `insurerShare`/`copayShare`
  are cleared and status re-derives from `amountPaid` vs the FULL total (typically
  PARTIAL — the owner now owes the rest). Refund/void paths route through
  `assertInvoiceClaimReversible`: no claim or CANCELLED → proceed; DRAFT → auto-cancel
  (BR-I9.5's «تُلغى آليًا»); SUBMITTED+ → Arabic refusal, manual JE per BR-I9.5.
- **No mirrored `Invoice.claimId` column.** The §15 sketch is served by the 1:1 relation
  derived from `insurance_claim.invoiceId UNIQUE` (`Invoice.claim` back-relation) — one
  source of truth, no drift pair. Claim header FKs are `Restrict` (quasi-voucher: blocks
  hard-deletes of invoice/policy/insurer/patient/owner under a claim); lines cascade
  from the claim only.
- **Adapter eligibility gate:** an invoice with `insurerShare` posts the §10.2 two-payer
  map only when its claim exists and is NOT in (DRAFT, CANCELLED); DRAFT-claim invoices
  are excluded from the eligible set entirely (submission is the accounting event). The
  insured branch balance-guards `copay + insurerShare = total` and books the insurer leg
  via BR-4.10 party-account resolution `against insurance_claim`, which auto-derives the
  insurer PLE.
- **Per-doc value accounts for reconciliation:** adapters may implement
  `glValueAccountIdsForDoc` (optional interface method); the runner uses it so the
  zero-diff report counts cash + bank + the insurer-AR leg for insured docs. Uninsured
  docs keep the adapter-level list — the MI-P2 map-diff pins stayed byte-identical.
- **`capConsumed` is written at SUBMIT** (`+= claimedAmount`, inside the submit
  transaction with the CLM- number per C7). Adjudication adjustment/release and the
  nightly recompute audit are MI-P5 scope with the rest of the status machine.
- **Q2/Q3/Q4 resolutions:** POS stays out of v1 structurally — `insurance_claim.invoiceId`
  targets the operational `Invoice` only (a POS sale has no patient identity); Q3 is the
  owner-basis PAID rule above; Q4 is BR-I9.5 verbatim. Q1 (rounding) is the O5 block's
  item 4.
- **Process note:** the local typecheck gate's heap ceiling moved 12288→13824 MB in this
  phase (OOM measured at 12288 with the MI tables added; clean at 13824) — the predicted
  working-set growth; [P13.6] project references remain the structural fix.

**MI-P6 build outcomes (recorded at exit, 2026-08-23).** Decisions and mechanisms the build
fixed that a later phase must not "correct" without reading this:

- **O1 — RESOLVED as editable demo defaults (owner, 2026-08-23).** Three tiers at
  49/99/179 SAR monthly with 490/990/1790 annual alternatives are seeded as ORDINARY ROWS
  through `db:seed:accounting-demo`, never through a migration: **commercial pricing is
  clinic-editable data, not code**, and a migration would force one clinic's price list
  onto every other. The seed is idempotent and matched by name.
- **Six plan rows, not three.** `billingInterval` lives on the PLAN, so an annual
  alternative is a second row by construction — and that is also the only place the
  yearly (*) grants fit: `MembershipPlanBenefit.unitsPerPeriod` is a bare `Int` whose
  period IS the plan's, so "1 تطعيم/سنة" cannot be expressed on a monthly plan. The
  monthly rows carry monthly units only; vaccination and dental grants live on the annual
  rows where they are interval-native. **A per-benefit interval is a [P2] idea — the
  benefit model was NOT extended in a reports phase.**
- **R1 silence is a seed constraint with arithmetic behind it.** `assessPlanValue` values
  INCLUDED_UNITS at the service's own price and cannot value a category discount (a
  category has no price), so the estimate is `consultation × units`. Care Plus annual
  binds at 48 units: demo prices of 30 / 60 / 150 (كشف عام / تطعيم / تنظيف أسنان) put it
  at 1710 ≤ 1790. Per §0 the DEMO PRICES were sized to the plans, never the engine — and
  a test pins that every seeded plan is silent.
- **Discounts target demo CATEGORY nodes only** (the MI-P2 travel-fee finding: a
  root-level percent would silently discount mobile-clinic fees). Pinned by test.
- **§17 ADDITION — «رصيد مفتوح» on the owner profile and the pay screen.** §11 predates
  the MI-P5 §10.3a decision and so lists no balance surface; the decision makes one
  necessary. A re-billed rejection lives as an Owner AR row while the operational invoice
  stays PAID, so from that moment the invoice CANNOT tell a receptionist what is owed —
  only the party ledger can. The chip sums the existing `listPartyOpenVouchers` seam
  (never a second PLE query), counts positive rows only (an unapplied credit is not a
  debt), and keeps the `payment_ledger_entry.read` gate: this is ledger money, and a
  looser permission for it would be a new rule, not a surface. A clinic that wants the
  front desk to see it grants that slug to the reception role.
- **FR-R12.2 was not re-implemented, on purpose.** The BRD defines insurer ageing as the
  existing AR report filtered to party type Insurer ("zero new engine"); MI-P5 shipped
  that filter, and a second ageing engine would be a second truth. FR-R12.5 stays [P2].
- **§15 has no MI-P6 subset, so the phase ships NO migration.** A reports-and-surfaces
  phase legitimately adds no tables; the twelve module tables were complete at MI-P5.
- **Report semantics worth keeping:** claim ageing runs from `submittedAt` (a DRAFT claim
  is not late, it is unsent); «إيراد العضويات» is NET of tax throughout because deferral
  schedules `netAmount`; and «استخدام المزايا» measures fees actually PAID, not billed —
  an invoiced-but-unpaid member has given the clinic nothing.

**MI-P5 build outcomes (recorded at exit, 2026-08-23).** Decisions and mechanisms the build
fixed that a later phase must not "correct" without reading this:

- **BR-I9.6 is a TARGET function, not three deltas.** Read literally the rule releases the
  same money twice — "adjusts at adjudication (approved < claimed releases the difference)"
  AND "decreases on rejection-remainder resolution". Its own last sentence is the arbiter:
  the nightly audit **recomputes from claims**. So `claimCapContribution(status, claimed,
  approved)` is the single definition of what one claim consumes (0 for DRAFT/CANCELLED/
  REJECTED, claimed for SUBMITTED, approved for APPROVED/PARTIALLY_APPROVED/SETTLED); every
  transition writes the difference between contributions, and the audit re-sums the same
  function. The incremental path and the audit therefore cannot disagree by construction,
  and the resolution step is a proven no-op (pinned by test). Do not add a decrement there.
- **A re-bill (§10.3a) does NOT re-open the invoice.** The split columns move — the owner's
  true share grew — but `Invoice.status` deliberately stays PAID: the [C3] adapter posts each
  source exactly once, so flipping the invoice back to PARTIAL would drop it out of the
  adapter's `PAID` eligibility set while its GL posting stayed, leaving a permanent residual
  on the zero-diff report for a debt the ledger already carries correctly. The new debt IS
  the Owner AR row the resolution JE books; it is collected with a سند قبض (party = المالك)
  and ages in the AR report. The executed walkthrough pins residual "0" across the whole
  lifecycle.
- **`settledAmount` counts MONEY, not a zero balance.** It is the Σ of PLE rows against the
  claim whose voucher is a `payment_entry`. A write-off or a re-bill also drives outstanding
  to zero, and counting those would report insurer payments that never arrived — so SETTLED
  requires an adjudicated claim AND insurer money, and it REVERTS when the payment is
  cancelled or unreconciled (both directions pinned).
- **§13 write-off tier = `journal_entry.submit` on top of the claim tier.** "The same
  permission tier as accounting write-offs" resolves to the tier that books a write-off
  today: BR-7.1.5's Write Off Entry is a JE. The claim-only clerk is refused (403, pinned).
- **FR-R12.2 is a filter, not a report.** The AR/AP ageing service and route now accept a
  party-TYPE-only filter, so «أعمار ذمم شركات التأمين» is the existing report narrowed —
  the BRD's "zero new engine" honoured literally.
- **§10.4 needed one loader, then four more consumers.** "Nothing new" was almost true: a
  claim is settled by an ordinary Payment Entry, and the only genuinely missing piece was a
  `PE_REFERENCE_LOADERS` entry. But the referenceable-doctype set turned out to live in
  **five** hand-kept places, and two full CI runs died proving it — first at the HTTP
  boundary (TypeBox union + zod enum ⇒ 422 «بيانات الطلب غير صالحة» for every user), then
  one layer deeper at the submit-time row-lock map (`LOCK_TABLES` ⇒ «نوع مرجع غير مدعوم»
  after the payment had already been created). Both were REACHABILITY defects invisible to
  service-level tests — the rule-12 class exactly. **The list is now declared once
  (`PE_REFERENCE_DOCTYPES`) and every consumer derives from it or is pinned against it by
  `reference-doctype-parity.audit.test.ts`.** A sixth consumer must do one or the other.
  (`ADVANCE_TABLES` in `advances.service.ts` is deliberately NOT extended: it locks the
  CREDIT voucher of an advance, and a claim is a receivable debit.)
- **Process lesson, recorded because it cost a CI run:** the first fix widened the two
  enumerations I remembered instead of sweeping for all of them. Fixing a list-drift defect
  means finding every consumer by search, not by recall.

---

### 17.1 Relationship to the archived earlier draft

`docs/archive/BRD_Membership_Module.md` (2026-08-18) and its `docs/archive/MEMBERSHIP_PHASES.md`
are **archived, not deleted** — they were untracked until 2026-08-22 and existed on a single
machine. This document supersedes them by owner decision (see the preamble). The divergences are
recorded here so the choice is visible rather than silent:

| # | Topic | Archived draft | **This document (binding)** |
|---|---|---|---|
| 1 | Care plans | titled "Membership **& Care Plans**"; its §14 migrates «خطط الرعاية»/«الاشتراكات» into membership plans — parallel run, then retire the legacy tabs | **BR-1.1**: separate concepts, no shared tables or statuses. Care plans are untouched and — being unbilled — not even discountable |
| 2 | Insurance | out of scope, "a separate module" | in scope, same module (§1.2), because both halves intervene at the same pricing seam |
| 3 | Free / included units | its D3, decided: `isFreeItem` | **BR-M5.3.1**: a 100% line discount. **Not cosmetic** — the §8 engine treats a free item and a fully-discounted line differently for tax. Pinned by the MI-P2 golden fixtures |
| 4 | Multiple memberships | its D5: allowed, oldest consumed first | **BR-M5.1.1**: at most one non-terminal membership per owner per clinic |
| 5 | Navigation | its D1: a dedicated sidebar group «العضويات» | **§11**: no new sidebar groups — inside المالية, per the contract's placement law |
| 6 | Consumption record | an **append-only ledger** (grant / consume / reverse / expire), a PLE analogue | **§5.3**: `unitsGranted` / `unitsConsumed` counters per period. Simpler. **Accepted cost, stated plainly:** less audit depth. If "why did this member lose a unit" becomes a real support question, the append-only ledger is the answer — and it is a clean later addition, not a rewrite |
| 7 | Money precision | `decimal(21,9)` on the plan price | **NFR-2**: `Decimal(10,2)` on operational documents, matching the live `Invoice`; only the GL engine uses 21,9 (contract C2) |

**Carried over from the archived draft** — it had thought these through, and the reasoning
survives its supersession. Recorded as considerations for the owner at the phase named, not as
new requirements:
- its §10.4 utilization-vs-entitlement profitability report → already present here as **FR-R12.4**;
- its R1, *a plan priced below the value of the benefits it grants* → worth a design-time warning
  on the MI-P1 plan form; raise with the owner at MI-P1;
- its R2, *staff quietly charging a member full price* → the §6.7 stored adjustments plus the
  in-invoice benefits panel make it visible; worth confirming the panel is in the MI-P2 scope.

---

### 17.2 Corrections of record (owner review 2026-08-22; row 9 added at the MI-P5 build)

Findings from verifying this document against the code as merged to `main` (`3492d36`). Each was
a statement that would have produced **wrong code if built as written**. All are fixed in place;
they are listed here so the corrections are auditable rather than invisible.

| # | Where | Was | Now |
|---|---|---|---|
| 1 | Preamble | "neither earlier file exists — verified across all branches" | both existed, untracked in the working tree; the check had run against git history only. Now archived and superseded (§17.1). The cited CLAUDE.md instruction could not be found either |
| 2 | AR-M1, §6.1 | the clinic seam is `computeTotals` | it is **`priceClinicInvoice`**, which has four callers. `computeTotals` prices **appointment invoices only** — lab, radiology and operation invoices would have silently had no benefits. See **BR-M6.1.1** |
| 3 | §6.2 | inputs listed as "clinicId, ownerId, lines", as if available | neither pricing service receives an owner (`computeTotals` never passes `partyId`) or knows what a patient is, and `Invoice` stores neither — it reaches them through four nullable parents. A resolver is now a named MI-P2 deliverable. See **BR-M6.2.1** |
| 4 | §8.1 | `{ key: "Insurer", side, labelAr }`, and "all machinery already generic" | `labelEn` is required or it does not compile; and `party.dao.ts` holds two exhaustive switches (`listMasters`, `findMaster`) needing an `Insurer` branch. The registry change is a **DAO change too**. See **BR-I8.1.1** |
| 5 | BR-1.1 | membership "MAY discount the purchase of a care plan" | care-plan enrollment is **never invoiced** — `src/server/care-plans/` creates no `Invoice` or `Sale` and posts nothing. Not discountable; out of scope |
| 6 | BR-I9.1.3 | "invoices with a claim cannot be VOIDED" | `VOIDED` and `REFUNDED` are distinct live statuses, and an insured invoice is *partly* paid, so it fits neither. The rule is now stated on the claim's state and covers both reversals |
| 7 | NFR-2 | percentages unremarked | `Decimal(5,2)` throughout is deliberate — 33.33% yes, 33.333% no. Must change **before** the MI-P3 migration if any agreement quotes three decimals |
| 8 | §8.1 | `insurer` carried a `defaultReceivableAccountId` FK, "falls back to the C6 type default" | no per-type default exists in the code — per-party overrides are `party_account` rows (BR-4.10 step 2) and the fall-back is the **side** default in `ClinicAccountingSettings` (step 3). Column dropped, zero new machinery (owner, MI-P0) |
| 9 | BR-I9.6 | "increases at claim **submission** (claimed), adjusts at adjudication (approved < claimed releases the difference), decreases on rejection-remainder resolution" | built literally this **releases the same money twice** — once when adjudication drops the figure to `approved`, again when the remainder is resolved — so `capConsumed` drifts negative on every partially-approved claim. The rule's own last sentence is the arbiter ("a nightly audit job **recomputes from claims**"): consumption is a TARGET, `claimCapContribution(status, claimed, approved)`, that transitions move toward and the audit re-derives. The resolution step is a proven no-op. Found and fixed at the MI-P5 build (2026-08-23); mechanism recorded in the §17 MI-P5 block |
| 10 | §11 | "**No new sidebar groups**" — the three MI screens sat among the العمليات اليومية tabs | **Owner decision 2026-08-24, overriding the note.** MI is a full module and deserves **module-level navigation**, matching how grooming and nutrition surface. A new group **«العضويات والتأمين»** joins «المالية» as a sibling of العمليات اليومية / الدفاتر / التقارير المالية, carrying «العضويات» → «التأمين» → «المطالبات التأمينية» in that order; the three leave the daily-operations tab bar. This also retires the buried-under-«المزيد» finding (claims was the 7th item against `MAX_VISIBLE_TABS = 6`) and returns daily operations to within its cap. Gating mechanism is unchanged — each item hides on its own doctype permission, and the group itself vanishes when the actor holds none of them (`visibleGroupsFor` already drops empty groups). The §12 reports **stay** under «التقارير المالية» |
| 11 | §6.4 (BR-M6.4) | a five-step order ending "tax on the net, then the insurance split", declared **fixed and not configurable** | a **six**-step order: loyalty redemption is now step 4, between the coupon and the tax engine. Filed from the Loyalty module's LY-P2 as its commit 0, per `BRD_Loyalty_Module.md` BR-L8.1, **before** a line of redemption code was written. Why it is recorded here and not only there: this document declares the order fixed, so a module that inserts a step without amending it leaves two BRDs stating different fixed orders for the same computation — and the next person to read one of them builds against the wrong one. The placement is not arbitrary: points are the customer's own accrued value and apply to whatever price remains after the clinic's own promotions (BR-L8.3), so redemption must come **after** the coupon, or a coupon would consume value the customer had already earned. And it must come **before** tax, for the reason step 5 already gives — the state is never charged tax on money the clinic did not collect. Nothing in steps 1–3 changes, and with the loyalty flag OFF the seam is byte-identical, which is LY-P2's named exit proof (BR-L8.4) |

**Verified and found correct** (checked at review, no change needed): the `Service` tree
(`parentId` + the `ServiceTree` relation) does support the subtree-and-specificity resolution of
BR-M4.2.2, and sharing one resolver with §8.2's coverage rows is a real saving; the Subscription
engine, the P12.2 deferred engine, the §8 tax engine and the `AccountsSetting` registry all exist
and behave as described; the snapshot discipline (AR-M2) has live precedent in
`CarePlanEnrollment.priceSnapshot` and `InvoiceTax`; the `party-type-literals` audit test does pick
up a new registry key with no edit; and the §11 naming warning — «المطالبات التأمينية» against the
accounting «المطالبات» (dunning) — catches a real collision.

---

## 18. What this review surfaced — read this before starting MI-P0

Three findings from the 2026-08-22 verification pass matter more than the rest. Two are already
fixed in place; the third is an open question for the owner. They are collected here, at the end,
because they are what a reader most needs to carry into the build — and because two of them are
the kind of defect that no test would have caught.

### 18.1 The pricing seam was named wrong, and the failure would have been silent

Before this review the document instructed the builder to hook membership benefits into
`computeTotals`. That function prices **appointment invoices only**. Lab, radiology and operation
invoices reach the tax engine through `priceClinicInvoice` directly, never touching it.

Built as written, the result would have been: a member gets their discount on a consultation, and
does **not** get it on a lab test, an X-ray or an operation — with **no error, no exception, and no
failing test**. Every unit test would pass, because each would have been written against the same
wrong assumption. The defect surfaces months later, in the form of a member who noticed their
discount is inconsistent, and by then the invoices are issued and the ledger has posted.

**Fixed:** the seam is `priceClinicInvoice`, with all four callers named, plus `priceSale` for POS
— **BR-M6.1.1**, **BR-M6.1.2**, and the MI-P2 row of §16, whose exit proof now requires golden
fixtures covering **all four** clinic-invoice callers rather than appointments alone.

**The general lesson, worth keeping:** "one seam" is a claim that must be *verified by counting
call sites*, never inferred from a function's name. The same check applies to every future
extension point in this module.

### 18.2 Adding the Insurer party type is not a one-line registry change

§8.1 described the C6 addition as a registry row, with "all machinery already generic". Half true,
and the half that is false stops the build.

`src/server/accounting/party/party.dao.ts` holds **two exhaustive `switch` statements** over
`PartyTypeKey` with no `default` branch — `listMasters` and `findMaster` — each reading the
operational master table behind a party type. Neither compiles until an `Insurer` branch is added
reading the new `insurer` table. The proposed registry row also omitted `labelEn`, which
`PartyTypeDefinition` requires.

This is the type system working exactly as intended: it **refuses a half-added party type** rather
than letting one exist that resolves to no master record. But it means MI-P0 must budget for a DAO
change, not a one-line edit — and the rest of the insurance half sits behind it.

**Fixed:** **BR-I8.1.1** and the MI-P0 row of §16 now name the registry row (with `labelEn`), both
DAO branches, and the party-resolution test as one deliverable.

**What genuinely is free** is worth restating, because it is the reason MI-C3 is a good bet: PLE
derivation, party trial balance, AR ageing, reconciliation, the Payment Entry party picker,
BR-4.10 resolution and the `party-type-literals` audit test all pick the new type up with **no
edit at all**. The insurance receivable engine is the accounting engine.

### 18.3 Care plans are not billed — and that is a live product gap (O6, owner's call)

BR-1.1 previously stated that membership benefits "may discount the purchase of a care plan (it is
a priced item like any service)". Verified against the code, that is not true today, and not by a
small margin:

- `CarePlanEnrollment` carries a `priceSnapshot` and nothing else — no payment state, no invoice
  link, no ledger reference.
- `src/server/care-plans/` creates **no `Invoice` and no `Sale`**, and posts nothing to the ledger.

So enrolling a patient in a care plan is an operational event with **no financial trail**. The
clinic records that a plan was sold, at a price, and the money is never invoiced, never collected
through the product, and never recognized as revenue.

**Fixed in this document:** the false claim is removed, and care plans are declared out of scope
for this module (they cannot be discounted by a membership because there is nothing to discount).

**Open for the owner — O6:** *is that the intended behavior?*

- If care plans are meant to be **sold and posted**, this is an existing gap in the product, and it
  is **entirely independent of membership or insurance** — it would need its own billing path,
  posting map and adapter, in its own BRD section. Nothing in §16 covers it, and nothing in §16
  should: bolting it onto this module would blur exactly the boundary BR-1.1 exists to protect.
- If care plans are deliberately a **clinical scheduling tool** whose money is handled elsewhere
  (collected at the counter as ordinary service lines, for instance), then the current behavior is
  correct and no work is needed — the only change is to say so explicitly, so the next reader does
  not rediscover this as a bug.

**Either way, O6 blocks nothing in MI-P0→MI-P6.** It is recorded because a review that finds a
revenue path with no ledger entry should say so, not because this module intends to fix it.
