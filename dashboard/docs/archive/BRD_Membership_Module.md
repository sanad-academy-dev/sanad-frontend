# BRD — Membership & Care Plans Module
**Product:** Positive / elite-vet — Membership Module
**Depends on:** the Accounting Module (BRD_Accounting_Module.md) — specifically §5 ledgers, §6 posting engine, §7.2 sales invoice, §7.4 payment entry, §8 tax engine, §15 deferred revenue, §11 advances.
**Audience:** AI coding agents + engineering team. **UI:** every screen follows the Positive design system and the locked navigation law (sidebar groups + header tabs). This document specifies data, behavior and posting rules only — never visual style.
**Companion file:** `MEMBERSHIP_PHASES.md`.

---

## 0. How to use this document (instructions for the AI agent)
1. Requirements are numbered `FR-x.y` (functional), `BR-x.y` (business rule), `NFR-x` (non-functional), `AC-x` (acceptance). Reference them in commits/PRs.
2. Entity tables define the **canonical data model**; names map 1:1 to DB columns (repo convention: camelCase columns, snake_case `@@map`).
3. "Posting map" tables define **exactly** which ledger rows a document generates. They are the source of truth — never invent postings.
4. **[P2]** marks deferrable scope. Everything else is core.
5. This module **never posts to the ledger directly**. It builds a `gl_map` and calls the accounting module's single posting engine (`makeGlEntries`), exactly like every other voucher. No exceptions.

---

## 1. Purpose & Scope

### 1.1 The business problem
A veterinary clinic sells one-off services and gets paid per visit. Revenue is unpredictable, clients churn to whoever is nearest, and cash arrives only after work is done. A **membership** inverts all three: the client pays upfront (or monthly) for a plan that entitles them to a defined set of services, discounts and perks over a period.

The clinic gains predictable recurring revenue, cash before cost, and a retention hook. The client gains lower effective prices and predictable pet-care spend.

### 1.2 What this module must do
Let a clinic **design** plans, **sell** them, **track what each member has consumed**, **apply entitlements automatically at the point of billing**, **recognize the revenue correctly over time**, and **renew or cancel** them — with every financial consequence flowing into the accounting ledger automatically.

### 1.3 In scope
- **Plan design:** membership plans with pricing, duration, billing cycle, and a benefit catalogue (included service quantities, percentage/fixed discounts, free add-ons, priority perks).
- **Selling:** subscribing an owner (optionally scoped to specific pets), proration, trial periods, promotional codes [P2], upfront vs installment payment.
- **Entitlement engine:** at invoice time, automatically apply the member's remaining allowances and discounts to eligible lines, in a defined precedence order, and decrement balances atomically.
- **Consumption ledger:** an append-only record of every entitlement grant, consumption, reversal and expiry — the membership analogue of the accounting PLE.
- **Lifecycle:** draft → active → (paused) → expiring → expired / cancelled, with renewals (auto and manual), upgrades/downgrades with proration, and cancellation with refund rules.
- **Billing:** one-time and recurring invoice generation through the accounting module's Sales Invoice, with **deferred revenue recognition** (the module's defining accounting characteristic).
- **Accounting integration:** deferred revenue liability, monthly/consumption-based recognition, discount accounting, refunds/credit notes, and a membership-specific reconciliation report.
- **Member experience:** membership card/summary, remaining balances, expiry warnings, and renewal prompts.
- **Reporting:** active members, MRR/ARR, revenue recognition schedule, utilization vs entitlement (profitability), churn and renewal rates, deferred revenue balance.

### 1.4 Out of scope (v1)
Insurance claims and third-party payers (separate module), loyalty points, referral programs, multi-clinic shared memberships, family/corporate group plans [P2], gift memberships [P2], usage-based overage billing beyond simple "charge normally once exhausted".

### 1.5 Relationship to existing modules
| Existing | Relationship |
|---|---|
| Owner (client) master | Membership subscriber; extended with membership summary fields |
| Patient (pet) master | Optional entitlement scope (per-pet plans) |
| Service / Item catalogue | Benefit targets; entitlements reference services or service groups |
| Operational Invoice (appointments/services) | **Consumer** of entitlements — the entitlement engine hooks into its pricing step |
| POS (inventory sales) | Consumer of entitlements for product discounts |
| Accounting Sales Invoice | The financial document a membership sale produces |
| Accounting deferred revenue [P12.2] | The recognition mechanism this module depends on |
| Legacy "خطط الرعاية" / "الاشتراكات" tabs | **Superseded** — this module replaces them; migration path in §14 |

---

## 2. Glossary
| Term | Meaning |
|---|---|
| **Plan** | A sellable template: price, duration, benefits. Not owned by anyone. |
| **Membership** | An instance of a plan sold to an owner: has dates, status, balances. |
| **Benefit** | One entitlement line in a plan (e.g. "4 wellness exams", "15% off medicines"). |
| **Entitlement** | A benefit instantiated on a membership, with a remaining balance. |
| **Consumption** | The act of using an entitlement on an invoice line. |
| **Allowance** | A quantity-based entitlement (N units of a service). |
| **Discount benefit** | A rate-based entitlement (% or fixed off eligible lines). |
| **Deferred revenue** | Cash received but not yet earned — a liability until service is delivered. |
| **Recognition** | Moving deferred revenue to earned income. |
| **Utilization** | Value consumed ÷ value sold — the profitability signal. |
| **Proration** | Charging/refunding proportionally to the unused period. |
| **Grace period** | Days after expiry during which benefits still apply, pending renewal. |

---

## 3. Architecture Principles

### AR-1: Plans are versioned; memberships are immutable snapshots
When a plan's price or benefits change, existing memberships **must not** change. On sale, the membership stores a **frozen copy** of the plan's benefit definitions (`membership_benefit` rows), not a live reference.
- **BR-3.1:** Editing a plan creates a new **plan version**; existing memberships stay on their sold version. Plan edits never touch sold memberships.
- **BR-3.2:** A plan version that has been sold can never be deleted, only disabled for new sales.

### AR-2: The consumption ledger is append-only
Every entitlement movement is a row in `membership_entitlement_ledger`. Balances are **derived** (sum of rows), never stored as a mutable counter — the same discipline as the accounting Payment Ledger Entry.
- **BR-3.3:** Cancelling an invoice that consumed entitlements appends **reversal rows**; it never deletes consumption rows.
- **BR-3.4:** The current balance of an entitlement = Σ(grants) − Σ(consumptions) + Σ(reversals) − Σ(expiries), computed at read time (with an optional materialized cache for performance, rebuildable from the ledger).

### AR-3: All money flows through the accounting engine
This module builds `gl_map` arrays and calls `makeGlEntries`. It never writes `gl_entry` rows. Membership invoices are ordinary Sales Invoices with a membership link. Refunds are credit notes. Recognition entries are system journal entries.

### AR-4: Entitlements apply at pricing time, not after
The entitlement engine runs **inside** the invoice pricing pipeline, before the tax calculator (accounting §8). Sequence: line rate resolution → **entitlement application** → discount fields set → tax calculation → totals. This guarantees tax is computed on the post-entitlement amount, which is legally correct.
- **BR-3.5:** Entitlement application must be **idempotent per invoice line**: re-pricing a draft invoice must not double-consume. Consumption is *reserved* on draft and *committed* on submit.

### AR-5: Draft reserves, submit commits, cancel releases
- **Draft invoice:** entitlement consumption is written as a `RESERVED` ledger row tied to the invoice line.
- **Submit:** rows flip to `CONSUMED` inside the same transaction as the GL posting.
- **Cancel / delete draft:** rows are released (reversal rows appended, or reserved rows removed).
- **BR-3.6:** Reservations expire automatically after a configurable window (default 24h) if the invoice is never submitted — a scheduled job releases them.

### AR-6: Recognition is a scheduled, idempotent job
Revenue recognition runs monthly (or on demand) and is **re-runnable without duplication**, keyed by (membership, period). It follows the accounting module's deferred-revenue mechanism (BRD §15).

### AR-7: Everything is company/clinic-scoped
Plans, memberships, entitlements and ledger rows all carry `clinicId`. Permissions gate every screen and endpoint.

---

## 4. Master Data

### 4.1 Membership Plan (FR-4.1)
The sellable template.

| Field | Type | Notes |
|---|---|---|
| id | PK | |
| clinicId | FK, idx | |
| code | varchar, unique per clinic | e.g. `WELLNESS-GOLD` |
| name / nameEn | varchar | display name (AR primary) |
| description | text | marketing copy shown on the sale screen and card |
| version | int | AR-1; increments on benefit/price change |
| status | enum | `DRAFT`, `ACTIVE`, `DISABLED` (no new sales), `ARCHIVED` |
| planType | enum | `INDIVIDUAL_PET`, `OWNER_WIDE`, `MULTI_PET` (with `maxPets`) |
| maxPets | int, nullable | for MULTI_PET |
| durationMonths | int | plan length, e.g. 12 |
| billingCycle | enum | `UPFRONT`, `MONTHLY`, `QUARTERLY`, `SEMIANNUAL` |
| price | decimal(21,9) | total plan price (UPFRONT) or per-cycle price |
| currencyCode | FK Currency | |
| taxTemplateId | FK, nullable | sales tax template; falls back to clinic default |
| isTaxInclusive | bool | whether `price` includes tax |
| trialDays | int, default 0 | [P2] |
| gracePeriodDays | int, default 0 | benefits still apply this long past expiry |
| autoRenew | bool | default renewal behavior for new memberships |
| renewalPriceMode | enum | `SAME`, `CURRENT_PLAN_PRICE`, `CUSTOM` |
| renewalPrice | decimal, nullable | for CUSTOM |
| cancellationPolicy | enum | `NO_REFUND`, `PRORATA`, `PRORATA_MINUS_CONSUMED`, `FULL_WITHIN_DAYS` |
| refundWindowDays | int | for FULL_WITHIN_DAYS |
| deferredRevenueAccountId | FK Account, nullable | overrides clinic default (§4.1 accounting) |
| incomeAccountId | FK Account, nullable | membership income account |
| discountAccountId | FK Account, nullable | when discount accounting is enabled |
| recognitionMethod | enum | `STRAIGHT_LINE`, `ON_CONSUMPTION`, `IMMEDIATE` — see §8 |
| sortOrder, color, icon | display | for the sale screen cards |
| termsText | text | printed on the membership agreement |
| createdBy/At, updatedAt | audit | |

**BR-4.1.1:** `code` is immutable once a membership has been sold on the plan.
**BR-4.1.2:** A plan cannot move to `ACTIVE` without at least one benefit row and a non-null price (price 0 allowed only for `INTERNAL`/staff plans, flagged).
**BR-4.1.3:** Changing price, benefits, duration or tax template on an `ACTIVE` plan **forks a new version**: the old version becomes `DISABLED` for new sales but stays queryable; existing memberships are untouched (AR-1).

### 4.2 Plan Benefit (FR-4.2)
Child rows of a plan version — the benefit catalogue.

| Field | Type | Notes |
|---|---|---|
| id | PK | |
| planId | FK | |
| benefitType | enum | `SERVICE_ALLOWANCE`, `PERCENT_DISCOUNT`, `FIXED_DISCOUNT`, `FREE_ITEM`, `PERK` |
| label | varchar | e.g. "4 فحوصات سنوية" — shown to the member |
| targetType | enum | `SERVICE`, `SERVICE_GROUP`, `ITEM`, `ITEM_GROUP`, `ALL` |
| targetId | FK, nullable | the specific service/item/group |
| quantity | decimal, nullable | for allowances (e.g. 4) |
| quantityPeriod | enum | `TOTAL` (over plan life), `MONTHLY`, `QUARTERLY`, `ANNUAL` |
| rolloverUnused | bool | do unused monthly units carry to the next period? |
| discountPercent | decimal, nullable | for PERCENT_DISCOUNT (0–100) |
| discountAmount | decimal, nullable | for FIXED_DISCOUNT (per line or per invoice — see `discountScope`) |
| discountScope | enum | `PER_LINE`, `PER_INVOICE`, `PER_VISIT` |
| maxDiscountPerUse | decimal, nullable | cap per application |
| maxDiscountTotal | decimal, nullable | cap over plan life |
| unitValue | decimal | **notional value** of one allowance unit — used for recognition (§8) and utilization reporting |
| priority | int | application order when multiple benefits match a line (lower first) |
| stackable | bool | may this benefit combine with another matching benefit? |
| conditions | json, nullable | [P2] e.g. min spend, day-of-week, pet species |
| notes | text | internal |

**BR-4.2.1:** `SERVICE_ALLOWANCE` requires `quantity` and `targetType` ≠ `ALL`.
**BR-4.2.2:** `PERCENT_DISCOUNT` must be 0 < x ≤ 100; a 100% discount must be modelled as `FREE_ITEM` instead (different accounting treatment — see §7.4).
**BR-4.2.3:** Σ of `unitValue × quantity` across allowance benefits is the plan's **notional benefit value**; if it is less than `price`, the plan is loss-making at full utilization — the UI warns at design time (does not block).
**BR-4.2.4:** Two benefits targeting the same service with `stackable = false` → only the highest-priority one applies.

### 4.3 Membership (FR-4.3)
The sold instance. This is the module's central document.

| Field | Type | Notes |
|---|---|---|
| id | PK | |
| clinicId | FK, idx | |
| membershipNo | varchar | naming series `MEM-{YYYY}-{#####}`, assigned on activation (accounting C7 pattern) |
| ownerId | FK Owner, idx | the subscriber |
| planId | FK Plan | the **version** sold |
| planSnapshot | json | frozen copy of plan + benefits at sale time (AR-1) |
| status | enum | `DRAFT`, `PENDING_PAYMENT`, `ACTIVE`, `PAUSED`, `EXPIRING`, `EXPIRED`, `CANCELLED`, `SUSPENDED` |
| startDate / endDate | date | endDate = startDate + durationMonths − 1 day |
| activatedAt | datetime | when it became ACTIVE |
| cancelledAt / cancelReason | datetime / text | |
| pausedFrom / pausedTo | date, nullable | [P2] pause extends endDate by the paused days |
| billingCycle | enum | copied from plan; drives invoice generation |
| nextBillingDate | date, nullable | for recurring cycles |
| price / currencyCode | decimal | the price actually sold at (may differ from plan via approved override) |
| priceOverrideReason | text, nullable | required when price ≠ plan price |
| totalContractValue | decimal | price × cycles — the full commitment |
| totalInvoiced / totalPaid | decimal | derived from linked invoices |
| deferredBalance | decimal | derived: recognized vs invoiced |
| autoRenew | bool | |
| renewedFromId / renewedToId | FK self | renewal chain |
| upgradedFromId | FK self, nullable | upgrade/downgrade chain |
| salesPersonId | FK Staff, nullable | for commission/attribution |
| notes | text | |
| createdBy/At, updatedAt | audit | |

**Covered pets** — child table `membership_pet`: `{membershipId, patientId, addedAt, removedAt}`.
**BR-4.3.1:** For `INDIVIDUAL_PET` exactly one pet; for `MULTI_PET` at most `maxPets`; for `OWNER_WIDE` the pet list is empty and all the owner's pets qualify (including pets added later).
**BR-4.3.2:** A pet may hold at most one **active** membership of the same plan family at a time (config: `allowOverlappingMemberships`, default false).
**BR-4.3.3:** `membershipNo` is assigned at activation, gap-free, inside the activation transaction.
**BR-4.3.4:** `status` transitions are constrained — see §5.

### 4.4 Membership Entitlement (FR-4.4)
Instantiated benefits with balances. Created at activation from `planSnapshot`.

| Field | Type | Notes |
|---|---|---|
| id | PK | |
| membershipId | FK, idx | |
| benefitSnapshot | json | the frozen benefit definition |
| benefitType, targetType, targetId | copied | for fast matching |
| periodStart / periodEnd | date | for MONTHLY/QUARTERLY entitlements, one row per period |
| grantedQuantity | decimal | for allowances |
| consumedQuantity | decimal | **derived cache** from the ledger (AR-2), rebuildable |
| remainingQuantity | decimal | derived: granted − consumed |
| consumedDiscountTotal | decimal | for capped discount benefits |
| unitValue | decimal | copied for recognition/utilization |
| status | enum | `ACTIVE`, `EXHAUSTED`, `EXPIRED`, `CANCELLED` |

**BR-4.4.1:** For `quantityPeriod = MONTHLY`, one entitlement row is generated per month of the membership (created upfront at activation, or lazily by a scheduled job — implementation choice, documented).
**BR-4.4.2:** With `rolloverUnused = true`, the unconsumed remainder of a period is granted into the next period's row (a ledger `ROLLOVER` grant); with false, it is closed with an `EXPIRY` row at period end.
**BR-4.4.3:** Entitlements never go negative. An application that would exceed the balance is either partially applied (up to the balance) or rejected — see BR-6.5.

### 4.5 Entitlement Ledger (FR-4.5) — append-only
The membership analogue of the accounting PLE. **Every** balance movement lands here.

| Field | Type | Notes |
|---|---|---|
| id | PK | |
| clinicId, membershipId, entitlementId | FK, idx | |
| postingDate | date | |
| movementType | enum | `GRANT`, `RESERVE`, `CONSUME`, `RELEASE`, `REVERSE`, `ROLLOVER`, `EXPIRE`, `ADJUST` |
| quantity | decimal, signed | + grants, − consumptions |
| discountValue | decimal, signed | monetary value of discount applied (for discount benefits) |
| notionalValue | decimal | quantity × unitValue — feeds recognition and utilization |
| sourceType / sourceId | varchar / FK | `sales_invoice`, `operational_invoice`, `pos_sale`, `manual_adjustment`, `system_job` |
| sourceLineId | varchar, nullable | the exact invoice line |
| reservationExpiresAt | datetime, nullable | for RESERVE rows (BR-3.6) |
| isReversed | bool | for audit; reversals are separate rows |
| reason | text | mandatory for ADJUST |
| createdBy/At | audit | |

**BR-4.5.1:** Balance = Σ quantity over non-expired rows of that entitlement. Never mutate a row.
**BR-4.5.2:** A `CONSUME` row must reference the invoice line that consumed it; cancelling that invoice appends a `REVERSE` row of equal magnitude.
**BR-4.5.3:** `ADJUST` (manual goodwill grant or correction) requires a reason and a permission (`membership.entitlement.adjust`), and appears in an audit report.

---

*(continued in part 2 — lifecycle, entitlement engine, billing & accounting)*

---

## 5. Membership Lifecycle (FR-5)

### 5.1 State machine
```
DRAFT ──sell──► PENDING_PAYMENT ──payment──► ACTIVE ──(t → endDate−N)──► EXPIRING
                      │                        │  │                          │
                      │                        │  └──pause──► PAUSED ──resume┘
                      │                        │
                      ├──abandon──► CANCELLED   ├──cancel──► CANCELLED
                                               ├──non-payment──► SUSPENDED ──pay──► ACTIVE
                                               └──(t > endDate+grace)──► EXPIRED ──renew──► (new ACTIVE)
```

| Status | Benefits apply? | Billing? | Notes |
|---|---|---|---|
| DRAFT | No | No | Being configured; no number assigned |
| PENDING_PAYMENT | No (config: `activateBeforePayment`) | Invoice issued | Awaiting first payment |
| ACTIVE | **Yes** | Per cycle | The normal state |
| PAUSED [P2] | No | Suspended | endDate extends by paused days |
| EXPIRING | Yes | Renewal due | Within `expiryWarningDays` of endDate |
| SUSPENDED | No | Overdue | Recurring payment missed past `dunningGraceDays` |
| EXPIRED | Only during `gracePeriodDays` | No | Past endDate |
| CANCELLED | No | No | Terminated early; refund per policy |

**BR-5.1.1:** Only `PENDING_PAYMENT → ACTIVE` assigns `membershipNo` and instantiates entitlements.
**BR-5.1.2:** `activateBeforePayment` (clinic setting, default **false**): when true, the membership activates on sale and the invoice may remain unpaid; when false, activation waits for the first payment allocation.
**BR-5.1.3:** A membership cannot be deleted once it has entitlement ledger rows or a submitted invoice — only cancelled.
**BR-5.1.4:** Status is recomputed by a daily job (expiry, expiring-warning, suspension) and by events (payment, cancellation).

### 5.2 Sale (FR-5.2)
1. Select owner → select pets (per plan type) → select plan → system shows price, benefits, dates.
2. Optional: price override (permission `membership.price.override`, reason mandatory), start date in the future, sales person.
3. **Create** → membership `DRAFT` → **Confirm** → `PENDING_PAYMENT` + a Sales Invoice is generated (§7.1).
4. Payment recorded (accounting Payment Entry, or POS cash) → allocation to the membership invoice → status → `ACTIVE`, entitlements instantiated, membership card available.

**BR-5.2.1:** Start date defaults to today; a back-dated start requires permission and cannot precede the clinic's accounting frozen date.
**BR-5.2.2:** Selling a plan whose status is not `ACTIVE` is refused.
**BR-5.2.3:** If the owner already has an overlapping membership on the same plan family and `allowOverlappingMemberships` is false, the UI offers **renew/upgrade** instead of a second sale.

### 5.3 Renewal (FR-5.3)
- **Auto-renew:** a daily job, `renewalLeadDays` before `endDate`, creates the next membership (`renewedFromId` set) and its invoice, per `renewalPriceMode`.
- **Manual renew:** an action on an `EXPIRING`/`EXPIRED` membership.
- **BR-5.3.1:** A renewal is a **new membership record**, never an extension of dates on the old one — this keeps revenue recognition, utilization and reporting clean per term.
- **BR-5.3.2:** Unused allowances do **not** carry into a renewal unless the plan sets `rolloverOnRenewal` [P2].
- **BR-5.3.3:** Auto-renew is skipped (and flagged for follow-up) when the owner has an overdue balance beyond a configurable threshold.
- **BR-5.3.4:** The renewal invoice is dated the renewal start date, not the generation date.

### 5.4 Upgrade / Downgrade (FR-5.4)
Moving a member to a different plan mid-term.
1. Compute **unused value** of the current membership: `remainingDays / totalDays × price` (time basis) or `price − Σ consumed notionalValue` (consumption basis) — per `upgradeCreditBasis` setting.
2. Cancel the current membership as `CANCELLED` with reason `UPGRADED`, `upgradedFromId` linking forward.
3. Create the new membership; apply the unused value as a **credit** — either a credit note against the old invoice or an advance allocated to the new invoice (accounting §11).
4. New entitlements are instantiated fresh; already-consumed allowances are **not** re-granted.

**BR-5.4.1:** A downgrade producing a credit larger than the new plan's price results in either a refund or a carried advance, per clinic setting `upgradeSurplusHandling`.
**BR-5.4.2:** The upgrade credit calculation must be shown to the user before confirming, itemized.

### 5.5 Cancellation & Refund (FR-5.5)
Refund amount by `cancellationPolicy`:

| Policy | Refund |
|---|---|
| `NO_REFUND` | 0 |
| `PRORATA` | `price × remainingDays / totalDays` |
| `PRORATA_MINUS_CONSUMED` | `max(0, price × remainingDays/totalDays − Σ consumed notionalValue)` |
| `FULL_WITHIN_DAYS` | full price if within `refundWindowDays` **and** nothing consumed; otherwise falls back to PRORATA |

**BR-5.5.1:** The computed refund is **proposed**, not forced — a user with `membership.refund.override` may change it with a reason (logged).
**BR-5.5.2:** Refund is issued as a **credit note** against the membership invoice (accounting §7.2 BR-7.2.2), and a Payment Entry if cash leaves. Never by deleting the invoice.
**BR-5.5.3:** On cancellation, all `ACTIVE` entitlements are closed with `EXPIRE` ledger rows dated the cancellation date; benefits stop immediately (or at period end, per `cancellationEffective` setting).
**BR-5.5.4:** Remaining **deferred revenue** for the cancelled term is handled per §8.5.

---

## 6. The Entitlement Engine (FR-6) — the module's core logic

### 6.1 Where it runs
Inside invoice pricing, per AR-4:
```
line rate resolved (price list / manual)
   ↓
► ENTITLEMENT ENGINE ◄     ← this section
   ↓
line discount fields set (discountPercent / discountAmount / isFreeItem)
   ↓
tax calculation (accounting §8)
   ↓
totals, payment schedule
```

### 6.2 Inputs
`{ clinicId, ownerId, patientId?, postingDate, lines[{lineId, itemOrServiceId, groupId, qty, rate, amount}] , invoiceId?, mode: 'PREVIEW'|'RESERVE'|'COMMIT' }`

### 6.3 Resolution algorithm (FR-6.3)
1. **Find applicable memberships:** all `ACTIVE` (or `EXPIRED` within grace) memberships of the owner where the invoice's patient is covered (per plan type), `postingDate` between start and end (+grace).
   - Multiple memberships → order by `priority` (config: oldest-first / highest-value-first, default **oldest-first** so the expiring one is consumed first).
2. **For each invoice line, collect candidate benefits** from those memberships whose target matches: exact item/service → item/service group → `ALL`. Specificity wins.
3. **Order candidates** by: (a) benefit `priority` asc, (b) `SERVICE_ALLOWANCE` before discounts (using an included visit is better for the member than a % off), (c) membership order from step 1.
4. **Apply in order**, respecting `stackable`:
   - **SERVICE_ALLOWANCE:** consume `min(lineQty, remainingQuantity)` units. Consumed units become **free** — the line splits conceptually into a covered part and a chargeable remainder (see BR-6.4).
   - **PERCENT_DISCOUNT:** `lineDiscount = amount × pct/100`, capped by `maxDiscountPerUse` and by the remaining `maxDiscountTotal`.
   - **FIXED_DISCOUNT:** per `discountScope` — `PER_LINE` reduces that line; `PER_INVOICE` is applied once to the invoice-level discount field; `PER_VISIT` once per visit/day.
   - **FREE_ITEM:** the line becomes `isFreeItem = true`, rate untouched, amount 0 (accounting treats free items as zero-value lines).
   - **PERK:** non-financial; recorded as a flag/note only, no ledger movement.
   - Stop for that line when `stackable = false` was applied, or all candidates are exhausted.
5. **Write ledger rows** per mode: `PREVIEW` → nothing; `RESERVE` → `RESERVE` rows with `reservationExpiresAt`; `COMMIT` → `CONSUME` rows (and flip existing reservations).
6. **Return a per-line breakdown** so the UI can show *why* each line changed: benefit label, quantity consumed, discount value, membership number.

**BR-6.4 (partial coverage):** When `lineQty > remainingQuantity`, the line is split: `remainingQuantity` units are covered (free) and the rest is charged normally. Implementation: either two invoice lines (recommended — clean tax and reporting) or one line with a computed discount equal to `coveredQty × rate`. **Decision: split into two lines**, the covered one flagged `entitlementCovered = true`.
**BR-6.5:** Never over-consume: applications are capped at the live balance re-read **inside the transaction** at COMMIT (concurrency, mirroring the accounting BR-7.4.3 pattern). If the balance dropped between reserve and commit, the invoice is re-priced and the user is told.
**BR-6.6:** Entitlements apply only to lines whose service/item is not already fully discounted by another mechanism, unless `allowStackWithManualDiscount` is set.
**BR-6.7:** The engine is **deterministic**: same inputs, same balances → same output. No randomness, no time-of-day effects beyond `postingDate`.
**BR-6.8:** Manual override — a user with `membership.entitlement.override` may un-apply a benefit on a line (reason logged), releasing the reservation.

### 6.4 Concurrency (FR-6.4)
Two invoices consuming the last unit simultaneously must not both succeed.
- **BR-6.9:** COMMIT runs inside the invoice's submit transaction, locks the entitlement rows (`SELECT … FOR UPDATE`), re-computes the balance from the ledger, and rejects (or reduces) if insufficient. Serializable retry per the accounting `runSerializable` helper.
- **AC-6.1:** Two parallel submits against a 1-remaining allowance → exactly one consumes it; the other is re-priced and charges normally.

### 6.5 Preview surface (FR-6.5)
Before invoicing, staff must be able to answer "what does this member get?" — a preview endpoint returns, for a given owner/patient/service basket, the entitlements that would apply and the resulting amounts, **without** reserving anything.

---

## 7. Billing & Invoicing (FR-7)

### 7.1 The membership sale invoice (FR-7.1)
Selling a membership creates an ordinary **accounting Sales Invoice** with:
- one line per plan (item = the plan's linked service/item, or a virtual "Membership" item),
- `membershipId` on the invoice header (new nullable FK),
- tax from the plan's template,
- income account = the plan's **deferred revenue account** when `recognitionMethod ≠ IMMEDIATE` (this is what makes it deferred), else the income account,
- `serviceStartDate` / `serviceEndDate` = membership start/end (drives the accounting deferred schedule, BRD §15).

**BR-7.1.1:** The invoice is a normal submittable document; all accounting rules (numbering, tax, PLE, statuses) apply unchanged.
**BR-7.1.2:** For recurring cycles, **one invoice per cycle** is generated by the billing job on `nextBillingDate`, each covering that cycle's service period.
**BR-7.1.3:** Cancelling a membership sale invoice reverts the membership to `PENDING_PAYMENT`/`DRAFT` and releases entitlements (BR-5.5.3).

### 7.2 Recurring billing job (FR-7.2)
Daily job: for every `ACTIVE` membership with `nextBillingDate ≤ today` and cycle ≠ UPFRONT → generate the cycle invoice, advance `nextBillingDate`, optionally auto-charge a stored payment method [P2].
- **BR-7.2.1:** Idempotent per (membership, cycle period) — re-running never double-bills.
- **BR-7.2.2:** Failures are logged per membership and surfaced in a "billing exceptions" list; one failure never blocks the batch.
- **BR-7.2.3:** Missed payment beyond `dunningGraceDays` → status `SUSPENDED`, benefits stop, follow-up task raised.

### 7.3 Consumption invoices (FR-7.3)
The normal clinic invoice (operational or accounting) where entitlements are consumed. Financially these lines may total **zero** — that's expected: the revenue was already collected at sale and sits in deferred revenue.
- **BR-7.3.1:** A zero-total invoice is still a valid document and must post correctly (no GL rows for zero lines; the covered value is recognized separately per §8).
- **BR-7.3.2:** Every consumption invoice shows a "Membership benefits applied" panel listing what was covered and the remaining balances after.

### 7.4 The 100%-discount problem (BR-7.4)
A fully-covered line can be modelled two ways, and they are **not** accounting-equivalent:
- **`isFreeItem` (zero-value line):** no revenue, no discount expense. Correct for allowance consumption, because the revenue was recognized from deferred.
- **Gross revenue + 100% discount:** records both revenue and a discount expense. Inflates both sides; only correct when the clinic explicitly wants gross-revenue reporting.
**Decision: allowance consumption uses `isFreeItem`.** Percentage/fixed discounts reduce the line net (standard discount behavior), and if `discountAccounting` is enabled they post to the discount account per accounting §7.2 row 7.

---

## 8. Revenue Recognition (FR-8) — the accounting heart of the module

### 8.1 Why deferral
Selling a 12-month plan for 1,200 on 1 January does **not** earn 1,200 in January. It creates an obligation to serve for 12 months. Recognizing it immediately overstates January profit and understates the rest of the year — and misstates the balance sheet by omitting the liability.

### 8.2 Methods (plan-level `recognitionMethod`)
| Method | Recognition | When to use |
|---|---|---|
| `STRAIGHT_LINE` | price ÷ months, monthly | Access/discount-type plans where value accrues with time (default) |
| `ON_CONSUMPTION` | proportional to consumed notional value | Allowance-heavy plans where value is delivered on use |
| `IMMEDIATE` | 100% at sale | Short/one-off plans, or when materiality doesn't justify deferral |

**BR-8.2.1:** `ON_CONSUMPTION` recognizes `price × (consumed notionalValue ÷ total notionalValue)`, and **any unrecognized remainder is recognized at expiry** (breakage — §8.4).
**BR-8.2.2:** The chosen method is frozen on the membership at sale (snapshot); changing the plan's method never re-bases sold memberships.

### 8.3 Posting maps
**Map A — Membership sale (deferred):**
| # | Debit | Credit |
|---|---|---|
| 1 | ذمم مدينة (AR) — total incl. tax | — |
| 2 | — | **إيرادات مؤجلة (deferred revenue, liability)** — net |
| 3 | — | ضريبة القيمة المضافة — tax |
*(payment then: Dr cash/bank / Cr AR, standard accounting §7.4)*

**Map B — Monthly recognition (system journal entry, voucher type `Deferred Revenue`):**
| # | Debit | Credit |
|---|---|---|
| 1 | إيرادات مؤجلة — recognized amount | — |
| 2 | — | إيرادات العضويات (income) — recognized amount |

**Map C — Consumption of an allowance (when `recognitionMethod = ON_CONSUMPTION`):** same as Map B, triggered by the consumption event with amount = consumed notional value (capped so cumulative recognition never exceeds the invoice net).

**Map D — Refund on cancellation:**
| # | Debit | Credit |
|---|---|---|
| 1 | إيرادات مؤجلة — unrecognized remainder | — |
| 2 | ضريبة القيمة المضافة — tax portion | — |
| 3 | — | ذمم مدينة (credit note) / نقد (if cash refunded) |
*(any already-recognized income is **not** reversed unless the refund exceeds the unrecognized balance — then the excess debits income)*

**Map E — Breakage at expiry (§8.4):** Dr إيرادات مؤجلة / Cr إيرادات العضويات (or a dedicated `إيرادات عضويات غير مستهلكة` account for visibility).

**BR-8.3.1:** Every one of these runs through `makeGlEntries`; the module never writes GL rows.
**BR-8.3.2:** Recognition entries are **system-generated and read-only** in the UI, linked to their membership and period.

### 8.4 Breakage (FR-8.4)
Unconsumed value at expiry is earned revenue — the clinic's obligation ended.
- **BR-8.4.1:** At `endDate + gracePeriodDays`, any remaining deferred balance for that membership is recognized (Map E) by the expiry job.
- **BR-8.4.2:** Breakage is reported separately from ordinary recognition, because it is a **profitability signal** (high breakage = members not using their plans = churn risk, even though it looks like profit).

### 8.5 Recognition on cancellation (FR-8.5)
1. Compute recognized-to-date (per method).
2. Compute refund (per §5.5).
3. Unrecognized remainder **minus** refund = recognized immediately (the clinic keeps it).
4. Post Map D for the refund and Map E for the retained remainder.
- **BR-8.5.1:** The sum of (recognized + refunded) over a membership's life must equal the invoiced net. This is an **invariant** and must have a test.

### 8.6 The recognition job (FR-8.6)
Monthly (and on-demand) job mirroring accounting §15:
- Idempotent per (membership, period) — a `membership_recognition` row per period with status.
- Runs in the background with status tracking; failures logged per membership without aborting the batch.
- Produces the **Revenue Recognition Schedule** report (§10.3).
- **BR-8.6.1:** A period already closed by a Period Closing Voucher cannot receive new recognition entries; late recognition posts to the next open period with a note.


---

## 9. Screens (FR-9)
All screens follow the locked navigation law: sidebar group → header tabs, standard list anatomy (stats bar → toolbar → table), side Sheet for create/edit, standard confirm dialog for destructive actions.

**Placement:** a new sidebar group **«العضويات»** (or as a sub-workspace of the clinic area — decide once and record in the contract), with tabs:

### 9.1 خطط العضوية (Plans)
- **Stats:** إجمالي الخطط · نشطة · أعضاء حاليون · القيمة التعاقدية الشهرية.
- **Table:** الكود · الاسم · المدة · السعر · دورة الفوترة · عدد الأعضاء · الحالة.
- **Sheet (design):** basic info, pricing & tax, duration & billing, **benefit builder** (repeating rows with type/target/quantity/discount/priority), accounting accounts, cancellation policy, terms text.
- **Benefit builder must show, live:** notional benefit value vs price, and a warning when value > price (BR-4.2.3).
- Actions: activate, disable, **new version**, duplicate, preview member card.

### 9.2 العضويات (Memberships)
- **Stats:** نشطة · تنتهي خلال ٣٠ يومًا · منتهية · ملغاة · الإيراد المؤجل القائم.
- **Table:** رقم العضوية · العميل · الحيوانات المشمولة · الخطة · البداية · النهاية · الحالة · المدفوع/المستحق · نسبة الاستهلاك.
- **Filters:** status, plan, expiry window, auto-renew, sales person.
- **Sheet (sell):** owner → pets → plan (cards with benefits) → dates → price (+override) → summary → confirm.
- **Detail view (the member file):** header (status, dates, plan), **entitlement balances** with progress bars, consumption history (the ledger, human-readable), linked invoices and payments, recognition schedule, and the action bar: تجديد · ترقية · إيقاف · إلغاء · طباعة البطاقة · طباعة الاتفاقية.

### 9.3 استهلاك المزايا (Entitlement usage) [P2 as a standalone screen]
Cross-membership view of consumption for audit: date, member, benefit, quantity, value, source document, and manual adjustments highlighted.

### 9.4 In-invoice panel (the most important surface)
On the operational/accounting invoice screen: when the owner has an active membership, a panel shows — **before** confirming — the membership number, which lines are covered, what discount applied, and the balances that will remain. One click to un-apply a benefit (with permission + reason).

### 9.5 Member card / agreement print
- **Card:** membership number, owner, pets, plan, validity, benefit summary, QR/barcode for quick lookup.
- **Agreement:** terms text, price, benefits, cancellation policy, signature block — AR/RTL, printed at sale.

### 9.6 Settings tab
Clinic-level: `activateBeforePayment`, `allowOverlappingMemberships`, `renewalLeadDays`, `expiryWarningDays`, `dunningGraceDays`, `reservationTtlHours`, `upgradeCreditBasis`, `upgradeSurplusHandling`, `cancellationEffective`, `allowStackWithManualDiscount`, default accounts (deferred revenue, membership income, breakage income, discount), and the membership naming series.

---

## 10. Reports (FR-10)
| # | Report | Contents | Why it matters |
|---|---|---|---|
| 10.1 | **الأعضاء النشطون** | member, plan, dates, remaining balances, next billing | Daily operations |
| 10.2 | **الإيراد المتكرر (MRR/ARR)** | normalized monthly value of active memberships, by plan, with new/churned/net movement | The single most important SaaS-style metric for the clinic |
| 10.3 | **جدول الاعتراف بالإيراد** | per membership: invoiced, recognized to date, remaining deferred, by period | Ties to the balance-sheet deferred liability; auditor-facing |
| 10.4 | **الاستهلاك مقابل الاستحقاق (Utilization)** | granted vs consumed notional value per plan and per member, utilization % | Profitability: >100% = loss-making plan; <30% = churn risk |
| 10.5 | **التجديد والانقطاع (Renewal & churn)** | renewal rate, churn rate, average lifetime, cancellation reasons | Retention management |
| 10.6 | **رصيد الإيرادات المؤجلة** | total deferred by plan and by expected recognition period | Must reconcile exactly to the GL deferred account |
| 10.7 | **الانكسار (Breakage)** | unconsumed value recognized at expiry, by plan | Profit that signals dissatisfaction — watch it |
| 10.8 | **استثناءات الفوترة** | failed recurring invoices, suspended memberships, overdue renewals | Operational hygiene |
| 10.9 | **تدقيق التعديلات اليدوية** | every ADJUST ledger row with user and reason | Fraud/error control |

**BR-10.1:** Report 10.6 **must** equal the GL balance of the deferred revenue account for the same date. A reconciliation check runs in CI and is exposed on-screen as a "مطابق ✓ / فرق X" indicator — the same discipline as the accounting adapter's zero-diff report.

---

## 11. Permissions (FR-11)
| Permission | Grants |
|---|---|
| `membership.plan.read/write` | View / design plans |
| `membership.plan.activate` | Publish a plan for sale (separate from editing) |
| `membership.read` | View memberships |
| `membership.sell` | Sell a membership |
| `membership.price.override` | Sell at a non-standard price (reason mandatory) |
| `membership.cancel` | Cancel a membership |
| `membership.refund.override` | Change a computed refund amount |
| `membership.entitlement.adjust` | Manual grant/correction of balances |
| `membership.entitlement.override` | Un-apply a benefit on an invoice line |
| `membership.recognition.run` | Trigger the recognition job manually |
| `membership.report.read` | Financial membership reports |

**BR-11.1:** Reception staff typically get `membership.read` + `membership.sell`; only accounting/management get override, adjust, refund and recognition. Every gated endpoint carries a controller-level test (authorized ≠ 403, unauthorized = 403) per the accounting module's rule.

---

## 12. Non-Functional Requirements
- **NFR-1 Integrity:** membership activation + entitlement instantiation + invoice + GL posting commit atomically or roll back together.
- **NFR-2 Precision:** all money `Decimal(21,9)`; quantities `Decimal(21,9)`; no JS floats anywhere in entitlement or recognition math (the accounting module's C2 rule applies verbatim).
- **NFR-3 Performance:** entitlement resolution for a 20-line invoice < 200 ms; the member detail view < 1 s with 500 ledger rows; recognition job handles 5,000 active memberships within the monthly window.
- **NFR-4 Audit:** every balance movement traceable to a document and a user; manual adjustments reportable; snapshots preserve what was sold.
- **NFR-5 i18n/RTL:** Arabic-first per the standing rule; member-facing prints in Arabic with correct RTL and number-to-words where amounts appear.
- **NFR-6 Idempotency:** billing, recognition, expiry and renewal jobs are all re-runnable without duplication.
- **NFR-7 Failure isolation:** a single bad membership never aborts a batch job.

---

## 13. Acceptance Criteria (samples; full suite in the phases file)
- **AC-1 Sale & deferral:** sell a 1,200 annual plan (16% tax) → invoice posts Dr AR 1,392 / Cr Deferred Revenue 1,200 / Cr VAT 192. Income statement shows **zero** membership income that day; the balance sheet shows a 1,200 liability.
- **AC-2 Recognition:** after one month (STRAIGHT_LINE) → Dr Deferred 100 / Cr Membership Income 100; deferred balance 1,100. After 12 months → deferred 0, income 1,200 total, and no month double-recognized on a re-run.
- **AC-3 Allowance consumption:** plan includes 4 exams; invoice one exam at 150 → the line is covered (free), balance drops 4 → 3, a CONSUME ledger row references the invoice line, and the invoice total excludes it.
- **AC-4 Partial coverage:** invoice 2 exams with 1 remaining → line splits: 1 covered free, 1 charged at 150; balance → 0; entitlement status EXHAUSTED.
- **AC-5 Discount benefit:** 15% medicines benefit on a 200 medicine line → line net 170, tax computed on 170 (not 200), consumption ledger records discountValue 30 against the cap.
- **AC-6 Concurrency:** two parallel invoice submits against a 1-remaining allowance → exactly one consumes; the other re-prices and charges; balance never negative.
- **AC-7 Cancellation invariant:** cancel at month 7 of 12 with PRORATA → refund credit note posts, remaining deferred clears, and (recognized + refunded) == invoiced net exactly (BR-8.5.1).
- **AC-8 Reversal:** cancel a consumption invoice → REVERSE rows restore the balance exactly; the member's remaining count returns to its prior value.
- **AC-9 Breakage:** a plan expires with 2 unused exams → remaining deferred recognized as breakage, deferred balance 0, breakage report shows the value.
- **AC-10 Deferred reconciliation:** report 10.6 equals the GL deferred account balance to the cent on seeded data (BR-10.1).
- **AC-11 Overlap guard:** selling a second overlapping membership on the same plan family is refused with the renew/upgrade offer.
- **AC-12 Upgrade:** mid-term upgrade credits the unused value, opens the new membership, and the combined recognition across both memberships still ties to total cash received.

---

## 14. Migration from the legacy "خطط الرعاية" / "الاشتراكات" tabs (FR-14)
- **14.1 Inventory:** map every legacy plan and active subscription, with its price, dates and any consumed history if recorded.
- **14.2 Plan mapping:** recreate legacy plans as versioned Membership Plans (a mapping table is maintained, legacy id → new plan id).
- **14.3 Membership import:** create memberships with their real start dates, and **opening entitlement balances** reflecting what was already consumed (an `ADJUST`/`GRANT` ledger row with reason `MIGRATION`).
- **14.4 Financial cutover:** already-collected amounts for unexpired terms must land in deferred revenue, not income — handled through the accounting module's Opening Invoice Creation Tool or a dedicated opening journal entry, agreed with the accountant.
- **14.5 Parallel run:** for one cycle, the legacy tabs stay read-only while the new module runs; a reconciliation report compares member counts and balances. Legacy tabs are retired only after zero-diff.
- **BR-14.1:** No legacy data is deleted during migration; the legacy tables become read-only.

---

## 15. Risks & Open Decisions
| # | Risk / decision | Recommendation |
|---|---|---|
| D1 | Where does the module live in the nav — its own group or inside the clinic area? | Own group «العضويات»; it spans sales, clinical and finance |
| D2 | Default recognition method | `STRAIGHT_LINE` — simplest defensible treatment; `ON_CONSUMPTION` per plan when allowances dominate |
| D3 | Are allowance consumptions `isFreeItem` or 100% discount? | **`isFreeItem`** (BR-7.4) — decided |
| D4 | Do unused units roll over on renewal? | No by default; `rolloverOnRenewal` as a [P2] plan flag |
| D5 | Multi-membership priority | Oldest-first (consume the expiring plan first) |
| D6 | Should benefits apply to POS product sales? | Yes for `ITEM`/`ITEM_GROUP` benefits — requires the POS adapter work to be complete |
| D7 | Family/corporate plans | [P2]; the data model already allows OWNER_WIDE which covers most of the need |
| D8 | Stored payment methods for auto-charge | [P2]; depends on a payment gateway decision |
| R1 | **Plans priced below their benefit value** | The design-time warning (BR-4.2.3) plus the utilization report (10.4) are the guard; consider requiring approval above a threshold |
| R2 | **Staff bypassing entitlements** (charging full price to a member) | The in-invoice panel makes coverage visible; un-applying requires permission + reason and appears in the audit report |
| R3 | **Deferred balance drifting from the GL** | BR-10.1's reconciliation check, enforced in CI |
| R4 | Recognition entries landing in closed periods | BR-8.6.1 routes them to the next open period with a note |

---

## 16. Dependency map — what must exist first
| Dependency | Status | Blocking? |
|---|---|---|
| Accounting sales invoice + tax engine | ✅ built (P4–P5) | — |
| Payment entries + allocation | ✅ built (P7) | — |
| Deferred revenue mechanism (accounting §15 / [P12.2]) | ⬜ scheduled | **Yes** for recognition; sale can post to deferred before it exists, but the recognition job needs it |
| Credit notes / refunds | ✅ built (P5.6) | — |
| POS tax through the P4 engine + POS adapter | ⬜ in Bucket A part 2 | Only for product-discount benefits at the counter |
| Financial statements | ✅ built (P9) | — |
| Period closing | ✅ built (P10) | — |
| Operational invoice pricing hook | ⚠ needs a hook point | **Yes** — the entitlement engine must be callable from the operational invoice's pricing step |

**Recommendation:** build the module **after** the accounting module's Bucket A part 2 completes (so POS and reversal paths exist), and pull the accounting `[P12.2]` deferred-revenue item forward to become a prerequisite of this module rather than an optional extra.

*End of BRD.*
