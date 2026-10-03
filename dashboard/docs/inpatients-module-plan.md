# Inpatients (Hospitalization) Module — Master Plan

> Status: **BUILT — awaiting CI + owner review** (2026-09-02). Phases IP0–IP5 are implemented
> on `main` (not on the paused accounting branch).
>
> **Local verification** (no local database was reachable, so per rule 8 CI is the gate for
> anything DB-backed):
> - `tsc -p tsconfig.server.json` → exit 0; `tsc -p tsconfig.client.json` → exit 0
> - fast suite: **1519 tests / 113 files passed**, including 82 new pure tests for the
>   workflow, due engine and alerts engine
> - audits green: `ungated-routes`, `domain-error-reachability`, `server-layering`,
>   `rbac-registry`, `reports.catalog`
> - migration `20260901120000_inpatients_ip0` authored via `migrate diff` schema→schema,
>   **377 lines, zero DROP statements**
>
> **Not verified** (needs CI / a database): the migration applying, every DB-backed path,
> and the executed walkthrough required by rule 12. No phase-exit claim is made here.
>
> ### ⚠️ Finding the owner needs: the repo is at TypeScript's instantiation-depth ceiling
>
> This module's schema growth pushed the whole program over it, and the failure surfaces
> **in unrelated files** — TS2589 in `src/server/accounting/**`, then degraded `select`
> inference everywhere downstream, then a V8 OOM. Measured, repeatedly:
>
> - Adding a `ClinicInpatientSettings` model → TS2589 in accounting. Removing it → green.
> - Adding just **four boolean/int columns** to `ClinicProtocols` → TS2589 again.
> - Dropping two of this module's models → green again.
>
> Two things came out of it, both kept:
> 1. **The trigger is `Prisma.TransactionClient | typeof db` unions.** Every call through
>    such a union distributes over both arms and multiplies inference by the size of the
>    whole Prisma type graph. Narrowing `Tx` to `Prisma.TransactionClient` and casting only
>    the default (`?? (db as unknown as Tx)`) is behaviour-preserving and buys real headroom.
>    Applied at 15 sites (accounting reports + this module). **This is now the house rule for
>    any new `tx`-accepting helper.**
> 2. **Conditional spreads inside Prisma args silently break `select` inference** — the args
>    object widens and the call returns the full model. Hoist the `where` into a typed const.
>
> **The ceiling is still close.** The next module that adds several Prisma models will hit it
> again. The durable fix is splitting the Prisma client types (or continuing the `Tx`
> narrowing sweep); that is a repo-wide decision, not this module's to make.
---

## 0. Where we are today

Hospitalization is **half-modelled on purpose** — the operations plan explicitly deferred
it (D4: *"ward flowsheets are their own module"*). The hooks that already exist:

| Hook | Where | State |
|---|---|---|
| `AppointmentStatus.HOSPITALIZED` | `prisma/schema.prisma`, `src/server/appointments/appointments.workflow.ts` | Real transition `IN_SERVICE ⇄ HOSPITALIZED → AWAITING_PAYMENT`; today a **label only** — no record is created |
| Kanban column + badge + «إنهاء التنويم» action | `src/features/appointments/utils/map-appointment-card.ts`, `data/status-meta.ts` | Live UI, empty semantics |
| `RoomType.ICU` | schema enum | No code reads it; `Room.capacity` exists but occupancy is **hardcoded 0** in `branch-rooms-page.tsx` |
| Consents | `ConsentType.HOSPITALIZATION` / `BOARDING` + discharge templates (`src/server/patient-consents/templates/hospitalization-discharge.ts`, source forms in `docs/consents/`) | Fully wired, waiting for an anchor document |
| `Patient.microchipNumber` / `coat` | schema | Added specifically for the boarding registration form (per schema comment) |
| Critical-alerts dashboard card | `appointmentsDao.listCriticalAlerts()` = `where status = HOSPITALIZED` | A stub — the natural seam for the new module |
| Post-op handoff | `OperationCase` → `RecoveryAssessment`, `PostOpOrder` (kinds: MEDICATION/MONITORING/FEEDING/ACTIVITY/WOUND_CARE/…) | The nearest existing shape to an inpatient order — but no administration charting |

What does **not** exist anywhere: a stay/admission model, cage/bed entity, treatment sheet
(MAR), rounds/observation charting, vitals reference ranges, or any scheduler/cron.

## 1. Vision & scope

One module that takes a patient from **admission → daily care → discharge**, where the
system — not the user — carries the schedule and the safety checks:

- **Admission** from three doors: an in-service appointment ("نقل إلى التنويم"), an operation
  case (post-op handoff), or direct (walk-in emergency / boarding).
- **A stay** with a cage, an attending vet, an acuity level, standing **orders**
  (medications, fluids, monitoring, feeding, wound care), and a **treatment sheet (MAR)**
  where every scheduled dose is a row that gets *given, skipped, or flagged missed*.
- **A flowsheet**: vitals at the cadence the vet ordered, charted over the stay,
  auto-flagged against species reference ranges.
- **Smart everywhere** (§4): the board sorts itself by "who needs something next", doses are
  validated against the drug monographs before the order saves, trends and critical labs
  escalate to the attending via the inbox.
- **AI where drafting helps a human** (§5): discharge summaries, shift handover, owner-facing
  daily updates — always draft-only, never doses.
- **Discharge** with gates, a summary, prints, consents, and one invoice.

**Lanes**: v1 ships the medical lane (WARD + ICU + ISOLATION). BOARDING (non-medical
lodging) reuses ~90% of the machinery (stay, cage, feeding chart, per-day billing) minus
orders — in scope only if D2 says yes.

Out of scope v1: multi-clinic transfer, referral letters, oxygen/ventilator device
telemetry, owner-visiting scheduling.

## 2. Data model

All new tables: camelCase columns, `@@map` snake_case, `cuid()` ids, `Decimal` money,
`clinicId` tenant + required `branchId` (a hospitalized patient is physically in one
branch), soft-delete where user-facing.

### 2.1 The stay (core aggregate)

```
model InpatientStay
  id, code @unique ("IP-XXXX" via generateUniqueCode)
  clinicId, branchId, patientId, ownerId
  kind            InpatientStayKind   (MEDICAL | SURGICAL | ICU | ISOLATION | BOARDING)
  status          InpatientStayStatus (§3)
  acuity          InpatientAcuity     (LOW | MEDIUM | HIGH | CRITICAL)
  attendingStaffId, admittedById
  appointmentId?  operationCaseId?    // origin doors; both nullable (direct admit)
  presentingComplaint?, admissionDiagnosis?, isolationReason?
  admissionWeightRecordId?            // VitalSignsRecord snapshot at admission
  monitoringIntervalMinutes Int       // vitals cadence (q1h=60, q4h=240…)
  dailyRateServiceId?, dailyRateSnapshot Decimal?   // accommodation pricing (§2.6)
  admittedAt, expectedDischargeAt?, dischargedAt?
  dischargeKind?  DischargeKind (ROUTINE | AGAINST_MEDICAL_ADVICE | TRANSFERRED | DIED | EUTHANIZED)
  dischargedById?, dischargeSummaryAr?, dischargeInstructionsAr?
  nextDueAt DateTime?                 // CACHED worst-case due time (§4.1) — one indexed scan
  isDeleted/deletedAt, createdAt/updatedAt
  @@index([clinicId, status]), @@index([clinicId, nextDueAt])
```

### 2.2 Cages & occupancy

`Room.capacity` is a bare number and the ward needs named units:

```
model Cage      { id, clinicId, branchId, roomId, name, sizeClass?, active, notes?, isDeleted }
model CageAssignment {                       // append-only history = occupancy + transfers
  id, stayId, cageId, assignedAt, releasedAt?, movedById, reason?
}
```
Current occupancy = assignments with `releasedAt: null`. This finally feeds the
`0/{capacity}` cell in `branch-rooms-page.tsx`. Cage CRUD lives under branch settings
(existing branches permissions). Add `RoomType.WARD` and `RoomType.ISOLATION`
(additive enum migration; `ICU` already exists; `BOARDING` only if D2 approves).

### 2.3 Orders (the treatment plan) — modelled on `PostOpOrder` + `PrescriptionItem`

```
model InpatientOrder
  id, stayId, idx
  kind        InpatientOrderKind (MEDICATION | FLUID | MONITORING | FEEDING | ACTIVITY |
                                  WOUND_CARE | LAB | IMAGING | OTHER)
  status      InpatientOrderStatus (ACTIVE | PAUSED | COMPLETED | DISCONTINUED)
  // medication/fluid fields — mirror PrescriptionItem exactly:
  inventoryItemId? | catalogProductId? | nameSnapshot
  doseAmount? Decimal(12,4), doseUnit?, route? DrugRoute (reuse), rateMlPerHour? Decimal
  doseSource? DoseSource (CALCULATED | MANUAL | OVERRIDE) + overrideReasonAr?
  // schedule:
  scheduleIntervalHours? Int  |  scheduleTimes String[] ("08:00","20:00")  |  prn Boolean
  startAt, endAt?
  instructionsAr?, orderedById, discontinuedById?/At?/reasonAr?
```

### 2.4 The MAR — `InpatientAdministration` (append-only, the AnesthesiaEvent lesson)

Scheduled slots are **materialized** on order create/extend for the order horizon
(the `CarePlanEnrollmentVisit` precedent — rows exist up front, so the due list is a
plain indexed query and needs no cron):

```
model InpatientAdministration
  id, stayId, orderId, dueAt
  status      AdministrationStatus (PENDING | GIVEN | SKIPPED | HELD)
              // MISSED is DERIVED on read (dueAt + grace < now && PENDING) — never stored
  givenAt?, performedById?, witnessId?          // witness mandatory for controlled drugs
  doseGivenAmount? Decimal, doseGivenUnit?
  batchId?, batchNoSnapshot?, expiryDateSnapshot?   // DispenseEvent-style snapshot
  vitalSignsRecordId?                           // MONITORING executions link the reading
  // structured care-chart fields (FEEDING/observation kinds):
  eatenFraction? Decimal, urination? Boolean, defecation? Boolean, vomiting? Boolean
  notesAr?, skipReasonAr?
  correctsId? @unique                           // corrections append, never edit (vitals rule)
  @@index([stayId, dueAt]), @@index([orderId, status])
```

A `GIVEN` row is immutable; mistakes get a correction row via `correctsId`, exactly like
`VitalSignsRecord`.

### 2.5 Touch points on existing tables (all additive)

| Table | Change |
|---|---|
| `VitalSignsRecord` | `inpatientStayId?` as the **5th provenance column** + `VitalSignsSource.INPATIENT` (the exact way `OPERATION` was added) |
| `Invoice` | `inpatientStayId? @unique` — the **6th** mutually-exclusive parent slot |
| `InboxItem` | `inpatientStayId?` FK + `InboxItemType.INPATIENT` + `UserInboxSettings.typeInpatients` toggle |
| `StockLedgerEntry` | new `StockVoucherType` value (`INPATIENT_ADMINISTRATION`) |
| `PatientConsent` | nothing — anchor existing HOSPITALIZATION/BOARDING consents to the stay via a nullable `inpatientStayId?` (same pattern as its other anchors) |

### 2.6 New reference data — `VitalReferenceRange` (the biggest gap found)

Nothing in the DB can say "HR 220 is tachycardic for a dog". Same curation contract as
`DrugMonograph` (mandatory `sourceCitation`, `reviewedBy/At`, **LLM generation of clinical
thresholds is forbidden** — the schema comment on monographs applies verbatim):

```
model VitalReferenceRange
  id, clinicId?                    // null = global seed, clinic rows override
  species CatalogSpecies           // reuse the pharmacy species axis + its AnimalType mapping
  parameter VitalParameter (TEMPERATURE | HEART_RATE | RESPIRATORY_RATE | OXYGEN_SATURATION |
                            CAPILLARY_REFILL | PAIN_SCORE)
  ageMinWeeks?, ageMaxWeeks?
  low Decimal, high Decimal, criticalLow? Decimal, criticalHigh? Decimal
  sourceCitation String, reviewedBy?, reviewedAt?
  @@unique([clinicId, species, parameter, ageMinWeeks])
```
Seeded for DOG/CAT from published references (curated by hand, citation per row); admin UI
under clinical settings next to lab-templates.

### 2.7 Activity & audit

`InpatientActivity` + `InpatientActivityMention` — the standard house pair
(`{parentId, authorUserId, type, body?, metadata Json?, createdAt}`), types:
ADMITTED, CAGE_MOVED, ACUITY_CHANGED, ORDER_CREATED/DISCONTINUED, ADMINISTRATION,
NOTE, HANDOVER, COMPLICATION, STATUS_CHANGED, DISCHARGE, plus `@`-mention inbox emits.

## 3. Workflow state machine

Pure module `inpatients.workflow.ts` (+ exhaustive test), `canTransition()` reused on the
client exactly like appointments does.

```
ADMITTED ──► IN_CARE ──► DISCHARGE_PENDING ──► DISCHARGED
   │            │                │
   └────────────┴────────────────┴──► CANCELLED (admission error, with reason)
```

- **ADMITTED** — intake: cage assignment, consent, initial orders. *Gate to IN_CARE*: a cage
  assigned + admission vitals recorded (+ signed consent if the clinic protocol toggle
  requires it).
- **IN_CARE** — the long middle; board default.
- **DISCHARGE_PENDING** — vet has decided; billing/instructions/prints happen here. *Gate in*:
  no ACTIVE MEDICATION/FLUID order (must be completed or explicitly discontinued —
  "you cannot discharge a patient on a running IV by forgetting it"). *Gate to DISCHARGED*:
  discharge summary present, `dischargeKind` set, invoice settled **or** an explicit
  override with reason (per D8). `DIED`/`EUTHANIZED` bypass order gates but require reason
  and write a COMPLICATION/NOTE activity.
- Every gate is **server-enforced at transition time** (the operations G1–G10 pattern);
  emergency bypasses always record a reason and stay visible in the activity log.

**Appointment seam**: the existing `IN_SERVICE → HOSPITALIZED` transition becomes the
*admit door* — it opens the admit dialog and creates the stay (appointment keeps its own
lifecycle and its own invoice; the stay bills separately — see D1). `listCriticalAlerts`
is rewired from the status stub to real stays.

## 4. The smart layer — data drives the decisions

Every rule below is a **pure, unit-tested function** (the enforced norm — no local DB), and
follows the two house doctrines learned in pharmacy and labs: **classified refusals over
guessed numbers** (`NO_RANGE_FOR_SPECIES` is an answer, never silently NORMAL) and **blank
data is never a safe negative**.

### 4.1 The due engine — `inpatient-due.service.ts` (the vaccination-due template)

Input: a stay's PENDING administrations + monitoring cadence + last vitals time.
Output per stay: `{ status: ON_TRACK | DUE_SOON | DUE | OVERDUE, nextDueAt, overdueItems[] }`.
Cached into `InpatientStay.nextDueAt` on every write that moves it (the
`VaccinationRecord.nextDueAt` pattern) so the ward board and the clinic-wide due list
(`GET /inpatients/due`) are one indexed scan. The board **sorts by urgency, not
alphabetically** — the patient who needs something next floats to the top with a live
countdown. MISSED (grace expired) renders red and fires `emitInpatientOverdue`
(idempotent per administration — unique guard, no duplicate spam) when the due list is
served.

### 4.2 Order-time dose safety — reuse pharmacy wholesale

Creating a MEDICATION/FLUID order runs the existing `dose.rules.ts` + `safety.rules.ts`:
- weight comes **only** from the latest `VitalSignsRecord`, never `Patient.weight`
  (the `Prescription.weightKgSnapshot` rule);
- `calculateDose()` against `DrugMonographDose` for the species/route — out-of-range needs
  `doseSource: OVERRIDE` + a recorded Arabic reason; `contraindicated` is a **refusal, not
  a warning**;
- duplicate-therapy warning across the stay's *active* orders + the patient's active
  prescriptions (same `therapeuticClassCode` check);
- fluid orders sanity-check `rateMlPerHour` against weight-based maintenance
  (a new pure rule with citation, same curation bar as §2.6).

### 4.3 Vitals intelligence

On every flowsheet entry, `inpatient-alerts.service.ts` evaluates:
- **Range flags** against `VitalReferenceRange` (species + age): LOW/HIGH badge per value,
  CRITICAL band → `emitInpatientCritical` (HIGH importance, attending + branch team).
- **Trends**, not just points: three consecutive readings moving the wrong way (temp
  climbing, SpO₂ falling), pain score ≥ clinic threshold, weight loss ≥5% vs
  `admissionWeightRecordId`.
- **Freshness**: vitals older than `monitoringIntervalMinutes` + grace = a due item in §4.1
  (reuses the existing `vitals-freshness-badge`).

### 4.4 Diagnostics during the stay

Lab/radiology orders created from a stay carry the stay link; the existing
`computeResultFlag` critical path gains one hook — a critical flag on a stay-linked order
emits to the **attending vet specifically**, not just the lab board.

### 4.5 Placement intelligence

- ISOLATION-kind stays can only be caged in `RoomType.ISOLATION` rooms (hard rule);
  an infectious-flagged patient proposed for a shared ward room raises a blocking warning.
- Capacity: admitting when the branch's ward occupancy ≥ configurable threshold warns;
  the rooms settings page finally shows real occupancy.

### 4.6 Discharge readiness

A computed checklist on the stay sheet: orders complete/discontinued ✓, invoice settled ✓,
consent on file ✓, discharge summary present ✓ — when all green the board card shows a
"ready" hint. Suggestion only; the vet decides.

### 4.7 Delivery & the scheduler question

All alerts deliver through the **inbox** (`emitInpatient*` helpers beside the existing 25:
admitted, overdue, critical vitals, critical lab, complication, mention) — inheriting SSE,
toast/sound/desktop and per-user preferences for free. The ward board polls at 30s with a
`LiveBadge` (the operations pattern).

**Known limit**: with no cron in the repo, a missed dose is detected when anyone loads a
due list/board — fine while staff are in the app, silent at 3 a.m. with the app closed.
D4 decides whether v1 accepts this (the vaccination precedent) or ships the repo's first
interval runner — which the accounting jobs runner was explicitly built to plug into
(`runQueuedAccountingJobs` is waiting for exactly this caller).

## 5. AI usage (draft-only, like the 12 existing AI services)

| Use | Shape |
|---|---|
| **Discharge summary draft** | `inpatients-ai.service.ts` one-shot `generateText` over the stay's structured data (diagnosis, orders given, vitals trends, lab flags) → Arabic draft the vet edits and approves. Mirrors `lab-report-ai.service.ts`. |
| **Shift handover draft** | Same service: summarize the last N hours (administrations, flags, notes) into a HANDOVER activity draft — the nurse reviews, edits, posts. |
| **Owner daily update draft** | Owner-friendly Arabic "how is my pet doing" note from the day's chart; published to the pet portal **only** through a release gate (§6, the `results_release` doctrine — releasing to an owner is a separate clinical decision with its own permission). |
| **Agent skill** | `skills/inpatients.skill.ts` + one line in `SKILLS` (the reserved `clinical` slot). Read tools first: `list_inpatients`, `inpatient_details`, `due_treatments`, `ward_occupancy` — wrapping the module DAO, no new write paths (the house agent rule). Mind the 20-tool budget. |
| **Forbidden** | Dose/threshold generation by LLM — the monograph rule applies: doses come from curated data or a human, full stop. AI never marks an administration given, never changes acuity. |

## 6. Integration map

| Module | Integration |
|---|---|
| **Appointments** | HOSPITALIZED transition = admit door; stay links back; «إنهاء التنويم» moves to the stay's discharge flow |
| **Operations** | "Admit to ward" handoff on case closure: converts `PostOpOrder` rows into `InpatientOrder`s (kind-for-kind), carries the anesthesia/recovery context into the activity feed |
| **Pharmacy** | Dose/safety rules at order time (§4.2); GIVEN administrations issue stock (`issuedAt`-guard against double-deduction, the `recordDispenseOnInvoice` lesson); controlled drugs write `ControlledDrugRegister` rows with the witness rules |
| **Vital signs** | Provenance column + source enum; flowsheet reuses `vitals-charts`, `vitals-freshness-badge`, correction chain |
| **Labs/Radiology** | Order-from-stay + critical-flag escalation (§4.4) |
| **Consents** | Existing HOSPITALIZATION/BOARDING + discharge templates anchored to the stay |
| **Inbox** | New type + FK + toggle + emitters (§4.7) |
| **Invoicing** | One `Invoice` per stay (6th slot): bed-days × `dailyRateSnapshot` + administered items priced from snapshots + services — computed by `inpatients-invoice.service.ts` through `priceClinicInvoice` (**no new tax math, ever**); payment/void/refund through the existing invoices-finance rail |
| **Pet portal** | Stay appears in `/pets/:id/timeline`; daily updates + discharge instructions behind a release gate with its own RBAC action (extend `pet-display` clinic controls) |
| **Reports/Dashboard** | Census card replaces the critical-alerts stub; reports builder entry (census, length-of-stay, occupancy %, outcomes) |
| **Accounting** | **None in v1.** The stay invoice rides the existing clinic-Invoice rail; a ledger adapter is a later accounting-module task, not ours |

## 7. Server layout, API & RBAC

```
src/server/inpatients/
  index.ts                      # inpatientsServer sub-Elysia — folded into clinicalServer.
                                # NEVER a new top-level .use() (TS2589 ceiling, memory + index.ts:88)
  inpatients.controller.ts      # stays: list/board, admit, detail, patch, transition, discharge
  inpatient-orders.controller.ts# orders + administrations (give/skip/hold, MAR by date)
  inpatients.{model,dao,type}.ts
  inpatients.workflow.ts(+test) # pure state machine (§3)
  inpatient-due.service.ts(+test)      # §4.1 pure
  inpatient-alerts.service.ts(+test)   # §4.3 pure
  inpatients-invoice.service.ts # totals → priceClinicInvoice → Invoice slot 6
  inpatients-stock.service.ts   # issue on GIVEN, StockLedgerEntry voucher
  inpatients-ai.service.ts      # §5 drafts
  inpatients.errors.ts          # InpatientValidationError / InpatientStateError —
                                # added to CLIENT_ERROR_NAMES in app.ts as LITERAL strings
                                # (the reachability audit reads the file as text)
```

**RBAC** (`src/lib/rbac/rbac-registry.ts`, group `clinical`):
- `inpatients` — kind `record`, scopes `[ALL, BRANCH]`, extraActions `admit`, `discharge`,
  `administer` (+ labels in `EXTRA_ACTION_LABELS`).
- `inpatient_release` — kind `tool`, action `run` (owner-facing updates; the
  `results_release` twin).
- Cage CRUD rides existing branch-settings permissions; reference-range curation rides
  clinical settings.
- Role templates updated, `bun run db:sync-permissions`, **no backfill grant** (the pharmacy
  precedent — new module, nobody loses access, grants start empty).
- **Every route ships gated with `rbacMacro` + `requirePermission`** — the
  `ungated-routes.audit.test.ts` ratchet fails the push otherwise, by design.

## 8. UI plan

Route `src/routes/_pathless-layout/care/inpatients.tsx`; feature folder
`src/features/care/inpatients/` in the house shape (components/hooks/data/types/utils/stores).
Arabic-only strings inline (the amended i18n rule), `sidebar.items.inpatients` key in both
locale files (the page-title derivation needs it), sidebar entry in the care group.

1. **Ward board** — `Stats` row (census, ICU count, due now, overdue) + alerts strip +
   kanban (`src/components/kanban.tsx`, the operations optimistic-sync pattern), columns by
   status with a list-view toggle. Cards: patient, cage, acuity color, attending,
   `nextDueAt` countdown (client ticker), overdue badge. Poll 30s + `LiveBadge`.
2. **Stay sheet** — the appointment-sheet spine (Sheet `max-w-2/3`, left rail: patient,
   cage assign/move, attending, acuity, dates, status action from `STATUS_META`). Tabs:
   - *Overview* — activity feed + notes + handover (activity-section pattern, @mentions)
   - *Treatment sheet (MAR)* — the centerpiece: time-grid of orders × slots for the day,
     tap a slot → give/skip dialog (dose confirm, batch pick with FEFO suggestion, witness
     field when controlled). Big touch targets — this is used cage-side.
   - *Flowsheet* — vitals entry at cadence + `vitals-charts` trends + range/critical badges
   - *Orders* — create/discontinue with the dose-safety panel (calculated dose shown with
     source; refusals and overrides surfaced exactly like prescribing)
   - *Billing* — accrued charges preview (bed-days + items), invoice-tab pattern, scoped payment
   - *Discharge* — readiness checklist (§4.6), kind picker, AI summary draft, consent, prints
3. **Admit dialog** — from the appointment sheet (HOSPITALIZED action), from operations
   closure, or standalone; picks kind, cage (with placement warnings), attending, cadence,
   daily-rate service, initial orders (optionally imported from the visit's treatment plan).
4. **Elsewhere** — rooms settings occupancy cell goes real; dashboard census card replaces
   the stub; patient profile gains an «التنويم» tab (stay history); prints via the
   print-util pattern: discharge summary, MAR sheet, cage card.

## 9. Non-functional & house rules that bind here

- Migrations authored `prisma migrate diff` schema→schema, read the SQL, never `db:push`;
  local verify against the Docker DB on 5433, CI is the gate.
- Derived types only (`z.infer`, `Prisma.XGetPayload`, `UncheckedCreateInput` picks).
- Clinical records are **append-only** (administrations, activity, corrections chain).
- All client-facing errors Arabic; RTL rules per AGENTS.md (logical properties, DOM order).
- Radix Select needs `position="popper"`; Tabs need explicit `dir="rtl"`.
- One typecheck at a time; never run it while a commit may be in flight.

## 10. Reporting & KPIs (`GET /reports` catalog entries)

Census & occupancy % (by room type), average length of stay by kind/diagnosis, treatment
compliance (given vs missed %), outcomes (discharge kinds), revenue per bed-day. Each a
`reports.catalog.ts` entry + builder, gated.

## 11. Implementation phases

One task = one commit; every phase exits with the walkthrough discipline (numbered steps
**executed through the product's own UI/HTTP surface**, figures from that run) plus an
idempotent demo seed and CI tests pinning it — the trio that caught five blocking defects
in P12A.

- **IP0 — Foundation**: schema migration (stay, cage, assignment, order, administration,
  activity, enum/FK touches §2.5), RBAC entries + sync, sub-server skeleton with gated
  stub routes, pure workflow + tests, cage seed. *Exit: audit tests green, board route 200s.*
- **IP1 — Lifecycle**: admit from all three doors, ward board + stay sheet (overview tab),
  cage assignment/occupancy (rooms cell real), consent anchoring, basic emitters,
  appointment seam rewired. *Exit: admit→discharge walkthrough with no orders.*
- **IP2 — Orders & MAR**: order CRUD with pharmacy dose safety, slot materialization,
  give/skip/hold with batch snapshot + stock issue + controlled register, due engine +
  `nextDueAt` cache + alerts strip + overdue emits. *Exit: a q8h antibiotic seeded, given
  twice, skipped once, figures pinned.*
- **IP3 — Flowsheet & intelligence**: vitals provenance + cadence, `VitalReferenceRange`
  (DOG/CAT seed + curation UI), range/trend/critical alerts, stay-linked labs/radiology +
  critical escalation, weight-loss alert. *Exit: an out-of-range temp reading produces the
  badge + inbox item in the walkthrough.*
- **IP4 — Billing & discharge**: invoice service + slot 6, bed-day accrual, payment rail,
  discharge gates + summary + prints + consents, discharge kinds. *Exit: full
  stay-to-settled-invoice walkthrough with exact figures.*
- **IP5 — AI, portal, reports**: agent skill, discharge/handover/owner-update drafts,
  release-gated portal timeline + updates, reports + dashboard census card, patient-profile
  tab. *Exit: portal shows an update only after release; agent answers "من في التنويم الآن؟".*

## 12. Decisions needed before IP0 (do not start without answers)

Taken at the recommended default unless noted. D2 and D6 are the two that still need the
owner's word before this is relied on clinically.

| # | Question | Decision taken |
|---|---|---|
| D1 | Stay vs appointment: does the stay bill separately from the originating visit invoice? | **Yes — separate invoice** (slot-6 precedent; a stay outlives a visit) |
| D2 | Is BOARDING in v1? | Ship the enum + forms-ready plumbing, hide the lane behind a settings toggle until validated |
| D3 | Cage entity vs bare `Room.capacity` counter? | **Real `Cage` rows** — occupancy, transfers, and placement rules all need identity |
| D4 | Scheduler: accept derive-on-read + polling in v1, or ship the first interval runner? | Accept for v1 (vaccination precedent), design §4.1 so a runner slots in later without change |
| D5 | Interim payments/deposits mid-stay? | v1: deposit optional via scoped payment on the accruing invoice; no separate deposit ledger |
| D6 | Who curates the vitals reference ranges, and from which published source? | **Half-decided — needs your reference.** They are no longer a table: they live as curated code in `src/server/inpatients/vital-reference-ranges.data.ts`, matching the `vaccinations.seed-data.ts` precedent (reviewed in a PR, not editable from a settings screen) and costing zero Prisma type surface. Every row carries a citation and `reviewed: false`. **Name the published reference and I'll correct the numbers and mark them reviewed.** |
| D7 | Acuity: manual enum or computed early-warning score? | Manual in v1; the flowsheet data makes a computed score a clean IP5+ upgrade |
| D8 | Can a patient be discharged with an unsettled invoice? | **Decided: blocked**, and fixed in code for v1 rather than configurable (a settings row costs schema growth the type budget cannot afford — see the finding above). Death and euthanasia always bypass it. `GET /inpatients/settings/current` exposes the effective values read-only. |
