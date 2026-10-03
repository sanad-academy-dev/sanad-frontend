# Emergency & Triage Workflow — Master Plan

> Status: **BUILT — awaiting CI + owner review** (2026-09-03). Phases E0–E4 are implemented
> on `main` (uncommitted working tree). The Inpatients dependency resolved itself mid-build:
> PR #113 merged, so the vitals reference-range engine this module scores against is now on
> `main`.
>
> **Local verification**
> - `tsc -p tsconfig.server.json` → **exit 0** (see the ceiling note below)
> - fast suite: **118 files / 1595 tests passed**, including **72 new pure tests** for the
>   rules table, arrival machine, VTL discriminators, ATT scoring and the breach evaluator
> - audits green: `ungated-routes`, `server-layering`, `domain-error-reachability`,
>   `rbac-registry`, `reports.catalog`
> - migration `20260903120000_emergency_triage_e0` authored via `migrate diff` schema→schema,
>   **zero DROP statements**; the three `ALTER TYPE … ADD VALUE` statements add values without
>   using them in the same transaction (the constraint the [IP] status migration documents)
>
> **Design-standard conformance (2026-09-04).** The first UI pass hand-rolled its tabs and
> had no toolbar, which made the screen a stranger among its siblings. Reworked to the
> established pattern: tabs portal into `#page-header-slot` (as inpatients/grooming/nutrition
> do), the toolbar is built on the shared `TableToolbar`, a `Stats` row sits above it fed by a
> new `GET /emergency/stats`, and both forms use the shared `FormFooter` with a real
> `Mod+Enter` binding rather than a hint that does nothing. Audited clean for: physical
> direction utilities (0), `SelectContent` without `position="popper"` (0), `Tabs` without
> `dir` (0), hard-coded radii outside the sibling-matched header (0). The branch settings UI
> now exists, under **Branch → Visits & Queue**, beside the queue switches — triage *is* queue
> ordering, and splitting them would put two adjacent ideas on different screens.
>
> **Executed against a real database (2026-09-04).** The local Postgres on :5433 turned out
> to be reachable, so the deferred half of the verification was done rather than left as a
> caveat. `prisma migrate deploy` applied the migration as the only pending one of 218.
> The 12-step walkthrough runs entirely through `app.handle` — the same HTTP surface the
> browser uses — and **it earned its keep by finding two defects that every other check had
> passed**:
>
> 1. **The RED fast-walk was never implemented.** The constants were imported and re-exported
>    and the rule flag was returned, but no code performed the transitions. Typecheck was
>    green, 1595 unit tests were green, and the feature simply did not exist.
> 2. **Every triage returned 500.** `AppointmentActivity.authorUserId` is non-null and was
>    being passed `null as unknown as string`; Prisma rejected the whole insert. The cast
>    silenced the compiler, so only a real HTTP call could reveal it.
>
> A third defect came from the permission suite: an invalid `select` asked `AnimalType` for a
> field it does not have, returning 500 on the arrivals route. It hid because the assertion
> only checked "not 403" — a broken route satisfies that. The suite now asserts `< 500`, and
> that guard is the reason the class cannot recur silently.
>
> **Verification now standing:** migration applied · walkthrough 12/12 · permission suite
> 16/16 (authorized passes, unauthorized 403s, reception blocked from `triage`, no session
> 401) · emergency suites 100 tests · fast suite 1595 · server typecheck exit 0.
>
> **Still not verified:** CI itself has not run this branch, and the visual RTL pass over the
> new screens has not been done.
>
> **Client-file verification is partial and this is the honest limit.** The client `tsc`
> program OOMs (see finding 2), so the UI files are not covered by any full program. They were
> checked through a temporary scoped project, which found and fixed one real defect (the
> `LiveBadge` state union had three members where the component accepts two). What that scope
> cannot check is TanStack Router's generated types; the three residual errors are that
> artifact, and one of them is in `shared.tsx`, a file this work never touched.
>
> ### ⚠️ Two findings the owner needs
>
> **1. The typecheck ceiling — hit, diagnosed, and recovered.** Adding this module's schema
> pushed the **server** program over the 9216 MB ceiling set on 2026-09-03. Measured:
>
> | State | server program at 9216 |
> |---|---|
> | `main` (no emergency schema) | passes |
> | `main` + 2 emergency models | **OOM (exit 134)** |
> | `main` + 3 emergency models | **OOM (exit 134)** |
> | + the full `Tx`-narrowing sweep | **passes** |
>
> The fix was the documented house rule, not a ceiling bump: **31 `Tx | typeof db` union
> sites across 12 files** were narrowed to `Prisma.TransactionClient`, with the cast
> centralised once as `dbAsTx` in `src/lib/db.ts`. The first grep for this pattern found only
> 4 sites because the rest were written against a local `Tx` alias — worth knowing for the
> next sweep. Raising the ceiling was deliberately **not** done: `docs/dev-machine-memory.md`
> records that 9216 was chosen the same day specifically to stop Windows killing VS Code, and
> the pagefile change it calls "the single biggest lever" is still unapplied.
>
> **2. The client program OOMs at 9216, independent of this module.** Verified by detaching
> the emergency controller from `src/server/index.ts` and re-running: it still OOMs. The
> CLAUDE.md rule 14 table measured the client program at 8.66 GB **before** the Inpatients
> module merged; that module's ~24 models consumed the remaining headroom. This is an
> owner/environment decision — the same class the Inpatients plan called "a repo-wide
> decision, not this module's to make" — and it means the `typecheck` script cannot currently
> complete on this machine regardless of what is being built.
>
> **The one-sentence design:** Emergency is a **layer over the appointment machine, not a
> second machine** — exactly how mobile-clinic visits were added
> (`docs/appointments-workflow.md`, "a second layer, not a second machine"). One tag
> (`TriageCategory`) is written **once**, on the appointment, and every other module
> **reads** it to default its own urgency vocabulary. The tag drives actions through one
> pure rules file. The whole layer is **off by default** and switches on per branch.

> **E5.3 — side by side, not stacked (2026-09-06).** The owner asked for the two sheets to
> sit beside each other. Two overlapping Radix sheets cannot do that: the second is modal, so
> it lays an overlay over the first and sets `pointer-events: none` on everything outside
> itself — the chooser stays visible behind the dim and cannot be touched — and turning modal
> off on both drops focus trapping and Escape together. So it is now **one sheet that widens**:
> `sm:max-w-md` → `sm:max-w-4xl` on selection, holding a chooser pane (right in RTL) and an
> outcome pane (left) with one border between them, both live. Measured against the running
> app after a real click: chooser 583–903, form 9–583, **overlap 0px**, one overlay, one
> dialog. Direction matches the row chevron, which points left to where the pane opens.
>
> **E5.2 — the disposition UI reworked after owner review (2026-09-06).** The first pass put
> all seven outcomes and their fields in one right-side sheet with inline sections; the
> owner's verdict was that it was not a real form. It is now **two stacked left sheets**, the
> app's own pattern (`plan-detail-sheet`): a chooser whose rows mirror `NavRow` (icon square,
> bold title, muted effect line) with the chevron on the **right** as the first DOM child of
> the RTL row, pointing left toward where the next sheet opens; and a per-outcome form sheet
> that opens over it and returns to it. Consents are now **the consents module's own**:
> `DispositionConsents` creates the draft through `createConsent` bound to the visit and opens
> the module's `ConsentSheet` for fields, signature and witness, with a "N of M signed" state
> per outcome — advisory, not blocking, because a bleeding animal does not wait for a
> signature. The reason they had rendered nothing was not the module: the route never passed
> `patientId` to the disposition sheet. Triage vitals now go through the system's
> `AddVitalsDialog` and hand the DAO a `vitalsRecordId` instead of raw numbers. Two width
> notes worth keeping: `SheetContent` forces `data-[side=left]:sm:max-w-sm` at a higher
> specificity, so any sheet width without the `!` suffix is silently ignored (the previous
> sheet was narrower than it asked to be), and `side="left"` is the app-wide default that the
> first pass omitted.

---

## 0. Where we are today

Emergency exists as a scatter of unconnected flags. Each one is real, none of them talk
to each other, and there is no place where "this animal is critical" is stated once.

| Touchpoint | Where | What it does today | Gap |
|---|---|---|---|
| `Appointment.isEmergency: Boolean` | `prisma/schema.prisma` | Sorts the queue to the front when `branch.settings.queue.emergencyToFront` is on (`sort-queue-cards.ts:28`); red badge on the card (`appointment-card.tsx:90`); client alert row (`use-appointment-alerts.ts:69`) | **Binary** where the clinical standard is five-point. No wait target, no re-assessment, no propagation |
| `Appointment.priority: TaskPriority?` | schema | Secondary queue sort under `queue.medicalPriority` | Reuses the **HR/task** enum as a clinical scale |
| `Branch.emergencyNotifications` + `inboxDao.emitEmergencyCase` | `appointments.dao.ts:526`, `inbox.dao.ts:762` | On appointment creation with `isEmergency`, notifies `emergencyRecipientIds(clinicId, branchId)` | Emits as `InboxItemType.APPOINTMENT_NEW`, not a distinct type. **Only fires from `appointmentsDao.create`** — the public-booking path (`public-bookings.dao.ts:246`) writes the flag and never emits |
| `LabTestOrder.isUrgent` / `RadiologyOrder.isUrgent` | schema, `lab-tests.dao.ts:218`, `radiology.dao.ts:339` | Derived: `isUrgent ⇔ priority === URGENT`; sorts the worklist | Set per order by hand; nothing inherits it from the visit |
| `OperationUrgency` (IMMEDIATE / URGENT / EXPEDITED / ELECTIVE) | `operations.workflow.ts:397` | **IMMEDIATE may override any gate with a recorded reason** (`canOverrideOperationGates`), logged as `GATE_OVERRIDDEN` | Chosen per case by hand; the best-designed urgency model in the repo, and it is an island |
| `InpatientAcuity` (LOW → CRITICAL) | `inpatients.workflow.ts:301` | Drives the default monitoring interval | Defaulted from stay *kind*, never from how the animal arrived |
| Vitals reference engine | `src/server/inpatients/vital-reference-ranges.data.ts`, `inpatient-alerts.service.ts:125` | Species × age-window ranges with `criticalLow/High` → `CRITICAL_LOW/HIGH` | Built for the ward. **This is the triage scoring backbone** and it is uncommitted |
| `VitalSignsRecord` | schema | Already captures every ATT physiologic parameter — temp, HR, RR, SpO₂, BP, **`capillaryRefillSec`, `mucousMembrane`**, pain | No `TRIAGE` provenance value in `VitalSignsSource` |
| `AppointmentActivity.STATUS_CHANGED` | schema, `appointments.dao.ts:678` | Timestamped `{from, to}` per transition; `enteredCurrentStatusAt` on the card is derived from it | Door-to-doctor is **derivable today** and nothing derives it |
| `listCriticalAlerts` → dashboard card | `appointments.dao.ts:184`, `critical-alerts-card.tsx` | "Patients with an active inpatient stay" | A **census**, not acuity |
| `ClinicalExam.chiefComplaint` + `ClinicalSymptom` (5 values) | schema | Step 1 of the exam wizard | Not a triage discriminator set |
| `OwnerRelationship.EMERGENCY` | schema | An owner's emergency contact | Nothing surfaces it when it matters |
| `ConsentType.FINANCIAL_ESTIMATE` | schema | Exists | No `EMERGENCY_TREATMENT` (verbal / phone) consent |
| Booking wizard, AI scheduling skill, `PetOwnerRequest` | `booking-wizard.tsx:398`, `scheduling.skill.ts:220`, `PetOwnerRequestKind` | Wizard and agent can set `isEmergency`; the portal has no emergency request kind | Three inbound doors, three behaviours |

What does **not** exist anywhere: a triage category, an arrival (walk-in) record, an
arrival timestamp, a re-triage series, a wait-time target, a patient-level allergy /
code-status list, an ER board, or any scheduler.

**Structural blocker.** `appointments.workflow.ts` requires an `Appointment`, and the
model requires `staffId`, `startsAt`, `durationMinutes` — all non-null. A hit-by-car at
2 a.m. has no assigned vet and no slot; today you would fabricate all three. The
workflow doc's own decision ("Walk-in created directly in `CHECK_IN`? **No** — create
`SCHEDULED`, then check in") was made for a GP waiting room, not an ER.

## 1. Vision & scope

**In scope (v1):**

- One **tag** — `TriageCategory` (RED / ORANGE / YELLOW / GREEN / BLUE, the Veterinary
  Triage List's five colours) — stored on the appointment, assigned by a structured triage
  assessment, re-assessable, and visible on every card, sheet and board that shows a visit.
- One **rules file** — `emergency.rules.ts` — that maps the tag to every consequence:
  wait target, queue rank, default lab/radiology priority, default `OperationUrgency`,
  default `InpatientAcuity` and stay kind, alert importance and recipients, whether payment
  UX is deferred, whether RED walks the state machine fast.
- **Arrivals** — walk-ins, "on the way" (phoned in / booked as emergency), and
  unidentified animals — that become appointments at triage, so the appointment machine is
  never bent.
- The **ER board** — colour-banded, wait clock, breach highlighting, capacity strip,
  on-the-way lane — as a tab beside the existing kanban, not a replacement.
- **Propagation**: lab, radiology, operations, inpatients, invoicing and the inbox each
  inherit the tag at document-creation time, in their own vocabulary.
- **Safety**: `PatientAlert` (allergy / chronic / bite risk / code status) — a
  patient-level list that triage, pharmacy dispensing and the exam all read.
- **Optionality**: everything above is behind `branch.settings.emergency.enabled`. Off,
  the product is byte-for-byte today's behaviour.

**Out of scope (v1), with the seam named so it is not designed away:**

- Server-side wait-breach alerts at 3 a.m. — needs the interval runner (§4.5, §12).
- Tele-triage over video (`AppointmentLocation.REMOTE`) and emergency **dispatch** of a
  mobile unit (`MobileBookingRequest` → arrival) — both are one adapter each once arrivals
  exist (§6).
- An `EMERGENCY` kind on `PetOwnerRequest` — touches the mobile app's contract (D8).
- CPR / crash-event charting (a code sheet) — a later module on the `AnesthesiaEvent`
  append-only shape.
- Computed early-warning scores beyond ATT — the data model supports it; v1 ships ATT only.

## 2. Data model

Deliberately **two new models**, two new enums, three enum values, and two columns on
`Appointment`. Everything else is settings JSON or pure code. See §9 for why the count is
kept this low (the TypeScript instantiation-depth ceiling).

### 2.1 The tag — on `Appointment`, written once

```prisma
model Appointment {
  // …existing…
  /// [E0] الفئة الحالية من آخر تقييم فرز — المصدر الوحيد الذي تقرؤه بقية الوحدات.
  /// تُكتب من `triageDao.assess` في نفس المعاملة مع صفّ التقييم، ولا تُعدَّل يدويًا.
  triageCategory TriageCategory?
  /// [E0] وقت الوصول الفعلي — لا وقت الموعد. منه يُقاس كل هدف انتظار.
  arrivedAt      DateTime?
  triageAssessments TriageAssessment[]
  emergencyArrival  EmergencyArrival?
}

enum TriageCategory {
  RED    /// فوري — 0 دقيقة
  ORANGE /// عاجل جدًا — 15 دقيقة
  YELLOW /// عاجل — 30–60 دقيقة
  GREEN  /// عادي — 120 دقيقة
  BLUE   /// غير عاجل — 240 دقيقة
}
```

`isEmergency` **stays** and becomes a **projection**: when the layer is enabled,
`isEmergency = triageCategory ∈ {RED, ORANGE}`, written in the same transaction — the
exact precedent of `isUrgent ⇔ priority === URGENT` in lab and radiology. Every existing
consumer (queue sort, badge, alert row, agent, booking wizard) keeps working unchanged.
When the layer is disabled, `isEmergency` remains the hand-set boolean it is today.

### 2.2 `TriageAssessment` — append-only, the `InpatientAdministration` lesson

Triage is a **series**, not an event; animals deteriorate in the waiting room. Each
assessment is a row; the newest is the truth; nothing is ever updated in place.

```prisma
model TriageAssessment {
  id            String         @id @default(cuid())
  clinicId      String
  branchId      String
  appointmentId String
  patientId     String?        /// فارغ لحيوان مجهول لم يُسجَّل بعد (القرار D2)
  /// الفئة التي اقترحتها المُميِّزات — تُحفظ لقياس التوافق بين الأداة والممرّض
  proposedCategory TriageCategory
  /// الفئة المعتمدة — تساوي المقترحة إلا بتجاوز مُسبَّب
  category         TriageCategory
  overrideReason   String?
  /// أكواد مُميِّزات VTL المُختارة (مرجع `triage-discriminators.data.ts`)
  discriminators   String[]
  /// درجة ATT (0–18) تُحسب من سجل العلامات إن وُجد — null إن لم تُكتمل المحاور
  attScore         Int?
  vitalsRecordId   String?        @unique
  /// سلسلة إعادة الفرز: التقييم الجديد يشير إلى الذي حلّ محلّه
  supersedesId     String?        @unique
  assessedById     String
  assessedAt       DateTime       @default(now())
  notes            String?

  clinic       Clinic            @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  appointment  Appointment       @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  patient      Patient?          @relation(fields: [patientId], references: [id], onDelete: SetNull)
  vitalsRecord VitalSignsRecord? @relation(fields: [vitalsRecordId], references: [id], onDelete: SetNull)
  assessedBy   User              @relation("TriageAssessor", fields: [assessedById], references: [id])
  supersedes   TriageAssessment? @relation("TriageChain", fields: [supersedesId], references: [id], onDelete: SetNull)
  supersededBy TriageAssessment? @relation("TriageChain")

  @@index([appointmentId, assessedAt])
  @@index([clinicId, branchId, assessedAt])
  @@map("triage_assessment")
}
```

`VitalSignsSource` gains **`TRIAGE`** (mirrors how `INPATIENT` was added in [IP3]), so
triage vitals carry provenance and flow into the patient's vitals timeline and — via the
existing `vital-signs.dao` link path (`vital-signs.dao.ts:306`) — pre-fill step 2 of the
clinical exam. No double entry.

### 2.3 `EmergencyArrival` — the door the appointment machine does not have

The one place a record exists **before** an appointment can. It carries the three things
an ER arrival lacks (a vet, a slot, sometimes an identity) until triage supplies them.

```prisma
model EmergencyArrival {
  id        String         @id @default(cuid())
  code      String         @unique   /// ER-XXXX عبر generateUniqueCode
  clinicId  String
  branchId  String
  status    ArrivalStatus  @default(ARRIVED)
  /// «في الطريق»: مصدر الإبلاغ ووقت الوصول المتوقّع
  source    ArrivalSource  @default(WALK_IN)
  expectedAt DateTime?
  arrivedAt  DateTime?
  /// المريض والمالك — فارغان لحيوان مجهول حتى يُسجَّل (D2)
  patientId String?
  ownerId   String?
  /// وصف مؤقّت لحيوان مجهول: «كلب بني، ذكر، ~20 كجم، أُحضر من طريق الملك فهد»
  provisionalLabel String?
  presentingComplaint String
  /// الزيارة التي تحوّل إليها الوصول عند الفرز — فارغة قبله وبعد المغادرة دون فرز
  appointmentId String?  @unique
  createdById   String?
  leftReason    String?  /// LEFT_WITHOUT_TRIAGE / CANCELLED — السبب المسجَّل
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  clinic      Clinic       @relation(fields: [clinicId], references: [id], onDelete: Cascade)
  branch      Branch       @relation(fields: [branchId], references: [id], onDelete: Cascade)
  patient     Patient?     @relation(fields: [patientId], references: [id], onDelete: SetNull)
  owner       Owner?       @relation(fields: [ownerId], references: [id], onDelete: SetNull)
  appointment Appointment? @relation(fields: [appointmentId], references: [id], onDelete: SetNull)

  @@index([clinicId, branchId, status, createdAt])
  @@map("emergency_arrival")
}

enum ArrivalStatus { EN_ROUTE ARRIVED TRIAGED LEFT_WITHOUT_TRIAGE CANCELLED }
enum ArrivalSource  { WALK_IN PHONE PUBLIC_BOOKING PET_PORTAL AGENT REFERRAL MOBILE_REQUEST }
```

### 2.4 `PatientAlert` — the safety list that does not exist (E3)

Allergies today live only as free text on the pre-anaesthetic assessment
(`operations.dao.ts:1117`) and a boarding-consent checkbox. Nothing patient-level,
nothing pharmacy reads, no code status in 355 models.

```prisma
model PatientAlert {
  id        String           @id @default(cuid())
  clinicId  String
  patientId String
  kind      PatientAlertKind
  /// للـ ALLERGY: المادة؛ للـ CHRONIC: الحالة؛ للـ CODE_STATUS: DNR/CPR؛ للـ BITE_RISK: السلوك
  label     String
  severity  AlertSeverity    @default(MODERATE)
  notes     String?
  active    Boolean          @default(true)
  recordedById String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // relations…
  @@index([patientId, active])
  @@map("patient_alert")
}
enum PatientAlertKind { ALLERGY CHRONIC_CONDITION BITE_RISK CODE_STATUS OTHER }
```

Worth shipping **regardless of triage** — a system that dispenses controlled drugs with
free-text allergies has a safety hole independent of the ER.

### 2.5 Touch points on existing tables (all additive)

| Table | Change | Why |
|---|---|---|
| `Appointment` | `+triageCategory`, `+arrivedAt` (§2.1) | The tag, and the clock |
| `VitalSignsSource` | `+TRIAGE` | Provenance |
| `InboxItemType` | `+TRIAGE` | Distinct icon/category; `emitEmergencyCase` migrates off `APPOINTMENT_NEW` |
| `ConsentType` | `+EMERGENCY_TREATMENT` | Verbal / phone consent with witness (D7) |
| `Branch.settings` JSON | `+emergency` block (§7.1) | **Zero Prisma change** — the toggle and all its knobs |

**Not changed, on purpose:** `Appointment.staffId` stays non-null (nullable would ripple
through every select in the app — the arrival record exists precisely to avoid that);
`ClinicProtocols` gets **no** new columns (§9, ceiling); no `RoomType.TRAUMA` — a branch
names its bays in `settings.emergency.bayRoomIds`.

## 3. Workflow state machine

### 3.1 The arrival — a pure machine in `emergency.workflow.ts`

```
EN_ROUTE ──arrive──▶ ARRIVED ──triage──▶ TRIAGED  (appointment takes over from here)
   │                    │
   └──cancel──▶ CANCELLED   └──leave──▶ LEFT_WITHOUT_TRIAGE
```

Pinned by a contract test the way `mobile-visit.workflow.ts` pins stage→status:
**`TRIAGED ⇒ appointmentId != null ∧ appointment.status ∈ {WAITING, CHECK_IN, IN_SERVICE}`.**

### 3.2 Triage → appointment: the conversion

`triageDao.assess(arrivalId, …)` runs **one transaction**:

1. Resolve the vet (D3): `settings.emergency.defaultVetStaffId` → else the on-shift vet
   from `ShiftAssignment` for today at this branch → else the first of
   `settings.queue.responsibleIds` who is a vet → else **422 `VET_UNRESOLVED`** with the
   Arabic reason. Never a silent guess.
2. Create the `Appointment` born **`WAITING`** (already a `CREATABLE_STATUSES` member) with
   `startsAt = arrivedAt`, `durationMinutes = settings.emergency.defaultDurationMinutes`,
   `consultationTypeId = settings.emergency.consultationTypeId`, `isEmergency` per §2.1,
   `arrivedAt`, `triageCategory`. Log `CREATED`.
3. Write the `TriageAssessment` (+ optional `VitalSignsRecord` with `source: TRIAGE`).
4. Set `arrival.status = TRIAGED`, `arrival.appointmentId`.
5. **RED fast-walk (D5):** if `category === RED` and `settings.emergency.redFastWalk`,
   transition `WAITING → CHECK_IN → IN_SERVICE` through the **existing** `updateStatus`,
   producing two ordinary `STATUS_CHANGED` rows with `metadata.reason = "RED_FAST_WALK"`.
   The matrix is untouched; RED just walks it in one second, and the audit trail says so.
6. Emit per §4.4.

A **scheduled** visit (no arrival) can also be triaged: `POST /emergency/triage` with an
`appointmentId` — same steps from 3 onward; `arrivedAt` is set if null.

### 3.3 Re-triage

`assess` again on a triaged appointment → new row with `supersedesId`, tag rewritten,
`isEmergency` re-projected. An **upgrade** (e.g. YELLOW → ORANGE) emits
`emitTriageEscalated`; a downgrade emits nothing but is on the sheet.

### 3.4 Guards this layer adds to the appointment machine (only when enabled)

| Transition | Added requirement | Kind (new `AppointmentsValidationError`) |
|---|---|---|
| `CHECK_IN → IN_SERVICE` | If `settings.emergency.requireTriageBeforeService`: a `TriageAssessment` exists | `TRIAGE_REQUIRED` |
| Creation from `EmergencyArrival` | Vet resolvable (§3.2 step 1) | `VET_UNRESOLVED` |

Both messages go into `CLIENT_ERROR_NAMES` (the `domain-error-reachability` audit will
fail otherwise — it exists because two error classes were once swallowed into 500s).

### 3.6 Disposition — the exit the first pass did not have (E5, 2026-09-06)

The owner's review after E4 was exact: *"not a real workflow — just 'it's emergency' and
that's it."* The first pass had an entrance (arrival → triage) and no exit: `TRIAGED` was
terminal on the arrival, and a triaged patient sat `IN_SERVICE` on the board forever.

The episode now lives until a **disposition**, and the board is **stage-based**:

```
EN_ROUTE → ARRIVED → TRIAGED ─────────────────────────────▶ DISPOSED(kind)
                        │  (appointment WAITING/CHECK_IN)        ▲
                        └──▶ [IN_TREATMENT — derived from IN_SERVICE, not stored]
```

`IN_TREATMENT` is deliberately **not a stored status**: it is `emergencyStageOf(arrival,
appointment)` read at query time, so the board and the visit can never disagree.

| Disposition | Hand-off | Visit machine |
|---|---|---|
| DISCHARGED | — | `→ AWAITING_PAYMENT` via `updateStatus` (exam gate enforced there) |
| ADMITTED | `inpatientsDao.createRequest` — a *request*, kind/acuity defaulted from the tag; the ward admits | unchanged |
| TO_SURGERY | `operationsDao.create` — urgency from the tag; RED ⇒ IMMEDIATE | unchanged |
| TRANSFERRED | destination recorded | `→ AWAITING_PAYMENT` |
| LEFT_AGAINST_ADVICE | — | `→ CANCELLED` if never seen, else `→ AWAITING_PAYMENT` |
| DIED / EUTHANIZED | exam **stamped closed by outcome** (D1) | walked to `IN_SERVICE` if needed, then `→ AWAITING_PAYMENT`; `DONE`'s payment guard untouched |

Order inside `dispose()` is load-bearing: hand-offs first (they carry their own gates and may
refuse), the visit machine second (through its own door, so the exam gate exists once), the
episode last. A hand-off that succeeds followed by an episode write that fails leaves a request
without a recorded disposition — accepted and stated, because the receiving DAOs open their own
transactions and cannot be composed.

Also in E5: `stability` (STABLE/UNSTABLE/CRITICAL, defaulted from colour, corrected by the
nurse), `lastReassessedAt` and a per-colour **reassessment cadence** in the rules file (15 /
30 / 60 / 120 / 240 min — D3); "ready for decision" = in treatment and STABLE; a progress strip
on each in-treatment card built from the visit's own tools (vitals, exam, SOAP note, labs,
radiology, prescriptions — D2: no second treatment sheet); the `dispose` RBAC action separate
from `triage` (a vet's decision vs a nurse's judgement); and scheduled visits triaged without an
arrival now get an episode (`ArrivalSource.SCHEDULED_VISIT`) so no query carries an exception.

### 3.5 What this layer deliberately does **not** do to the machine

- **Never bypasses `* → DONE`'s payment guard.** Emergency care changes *when* payment UX
  appears, not whether the ledger is settled before a visit closes (§4.3, D4). The
  accounting invariants (CLAUDE.md rule 3) are not this module's to relax.
- **Never creates an appointment without a vet.** The arrival holds that gap.
- **Never edits `docs/appointments-workflow.md` implicitly.** The doc's own rule: any
  change to the machine updates it in the same PR. The E0 PR adds an "Emergency layer"
  section beside the mobile-clinic one.

## 4. The rules layer — one file decides every consequence

### 4.1 `emergency.rules.ts` (pure, imported by server and client)

```ts
export const TRIAGE_RULES: Record<TriageCategory, TriageRule> = {
  RED:    { targetMinutes: 0,   queueRank: 0, labPriority: "URGENT", radiologyPriority: "URGENT",
            operationUrgency: "IMMEDIATE", inpatientKind: "ICU",     inpatientAcuity: "CRITICAL",
            inboxImportance: "HIGH",   alertTier: "ER_TEAM_AND_ON_SHIFT", deferPaymentUx: true,  fastWalk: true },
  ORANGE: { targetMinutes: 15,  queueRank: 1, labPriority: "URGENT", radiologyPriority: "URGENT",
            operationUrgency: "URGENT",    inpatientKind: "MEDICAL", inpatientAcuity: "HIGH",
            inboxImportance: "HIGH",   alertTier: "ER_TEAM",              deferPaymentUx: true,  fastWalk: false },
  YELLOW: { targetMinutes: 60,  queueRank: 2, labPriority: "HIGH",   radiologyPriority: "HIGH",
            operationUrgency: "EXPEDITED", inpatientKind: "MEDICAL", inpatientAcuity: "MEDIUM",
            inboxImportance: "NORMAL", alertTier: "QUEUE_RESPONSIBLES",   deferPaymentUx: false, fastWalk: false },
  GREEN:  { targetMinutes: 120, queueRank: 3, labPriority: "MEDIUM", radiologyPriority: "MEDIUM",
            operationUrgency: "ELECTIVE",  inpatientKind: "MEDICAL", inpatientAcuity: "MEDIUM",
            inboxImportance: "NORMAL", alertTier: "NONE",                 deferPaymentUx: false, fastWalk: false },
  BLUE:   { targetMinutes: 240, queueRank: 4, labPriority: "LOW",    radiologyPriority: "LOW",
            operationUrgency: "ELECTIVE",  inpatientKind: "MEDICAL", inpatientAcuity: "LOW",
            inboxImportance: "LOW",    alertTier: "NONE",                 deferPaymentUx: false, fastWalk: false },
};
```

Values are the published VTL targets and the NCEPOD-aligned `OperationUrgency` mapping
already documented in the operations plan (S3). They live **in code, reviewed in a PR,
signed by a human** — the `vital-reference-ranges.data.ts` contract: a threshold that
decides who is seen first is not a settings-screen field. Each row carries a
`sourceCitation`; `reviewed: false` renders a "pending clinic approval" marker until the
owner signs off (D6).

### 4.2 Propagation — defaults, never overwrites

The tag is **read**, never copied, and it only fills **empty** fields at document creation:

| Downstream document | Field defaulted | Where |
|---|---|---|
| `LabTestOrder` | `priority` (→ `isUrgent` derives as today) | client pre-fill in the order dialog **and** `labTestsDao.create` when `input.priority` is undefined and the appointment has a tag |
| `RadiologyOrder` | `priority` | same shape, `radiology.dao.ts:339` |
| `OperationCase` | `urgency` | `operations.dao.ts:417` — RED → IMMEDIATE unlocks `canOverrideOperationGates` **with no new code** |
| `InpatientStay` | `kind`, `acuity` → monitoring interval follows (`DEFAULT_MONITORING_INTERVAL_BY_ACUITY`) | the appointment door of `inpatientsDao` (`inpatients.dao.ts:955`) |
| `Invoice` | `consultationTypeId` = emergency type; after-hours line (§4.3) | at conversion (§3.2) |
| `InboxItem` | `importance` | every `emitTriage*` |

Rule: a clinician's explicit value **always wins**; propagation only speaks when the field
is silent. This is why nothing in lab/radiology/operations/inpatients needs a schema
change — they already have the fields.

### 4.3 Money — reordering the UX, not the ledger

- **Emergency consultation type.** A clinic-scoped `ConsultationType` ("كشف طوارئ") with
  its own `ConsultationTypeConfig.price` — zero schema. Conversion sets it.
- **After-hours surcharge.** If `arrivedAt` falls outside the shift windows in
  `ClinicSchedulingSettings` (`morningStartMinute` … `eveningEndMinute`) and
  `settings.emergency.afterHoursServiceId` is set, an `AppointmentService` line is added
  with the service's `priceSnapshot` — reuses the existing service-line pricing path. Zero schema.
- **Deferred payment UX** (D4). For `deferPaymentUx` categories the consultation-fee
  prompt and the "pay before service" nudges are hidden until the visit reaches
  `AWAITING_PAYMENT`; the ER board shows an **"unbilled emergency"** badge so nothing is
  forgotten. The `DONE` guard is untouched. `FINANCIAL_ESTIMATE` consent is offered
  post-stabilisation, not at the door.

### 4.4 Alerts — reuse `emergencyRecipientIds`, add a type

New emitters on `inboxDao`, all non-throwing (the house pattern), all `type: TRIAGE`:

| Emitter | Trigger | Recipients (by `alertTier`) |
|---|---|---|
| `emitTriageArrival` | arrival created with `expectedAt` (on the way) or RED/ORANGE triaged | `emergencyRecipientIds` + on-shift vets |
| `emitTriageBreach` | wait exceeds `targetMinutes` (§4.5 for *when* this can fire) | queue responsibles + treating vet |
| `emitTriageEscalated` | re-triage to a higher category | as arrival |
| `emitTriageCriticalVitals` | triage vitals classify `CRITICAL_*` against the reference ranges | treating vet |
| `emitTriageUntriaged` | an `ARRIVED` arrival with no assessment after `settings.emergency.untriagedAlertMinutes` | queue responsibles |

`emitEmergencyCase` is **kept** for the disabled case and switched to `type: TRIAGE`. The
public-booking path gets the emit it has been missing (a bug fix that ships in E1 whether
or not the layer is enabled).

### 4.5 The breach evaluator and the scheduler question

`evaluateBreaches(now, rows, rules)` is a **pure function** (the `inpatient-due.service`
template) that returns `{ breached, imminent }` from `arrivedAt`, `triageCategory`, and
status. It is called by:

- the client tick that already exists (`CLIENT_TICK_MS` in `use-appointment-alerts.ts`) —
  per-category thresholds replace the flat `LONG_WAIT_MIN`;
- `GET /emergency/board` — which emits `emitTriageBreach` for newly-breached rows (a
  load-triggered alert; the vaccination-due precedent).

**Known limit, stated honestly:** with no interval runner in the repo, a breach at 3 a.m.
is noticed when someone loads the board. The evaluator is designed so the runner plugs in
with zero rework; the runner itself is a separate, shared foundation (§12) — the inpatients
plan §4.7 records the identical limit for missed doses.

### 4.6 Scoring — ATT from vitals you already capture

`computeAttScore(vitals, ranges)` in `triage-scoring.ts`: perfusion from
`capillaryRefillSec` + `mucousMembrane`, cardiovascular from `heartRate`, respiratory from
`respiratoryRate` + `oxygenSaturation`, each classified against the **species/age
reference ranges** the inpatients module ships; the three non-vital axes (skeletal, neuro,
eye/muscle/integument) come from discriminator codes. Partial → `attScore: null`, never a
fabricated total.

### 4.7 The discriminators — curated data, no LLM

`triage-discriminators.data.ts`: the VTL's discriminators grouped by body system, each
`{ code, systemKey, labelAr, labelEn, category, sourceCitation, reviewed }`. **Generating
clinical content from a language model is forbidden here** — the `DrugMonograph` and
`VITAL_REFERENCE_RANGES` rule verbatim: a fabricated discriminator produces a false
category the staff learn to ignore, and the true ones go with it. The Arabic labels are
the owner's approved translation (D6). A guard test pins the count and that every row has a
citation.

## 5. AI usage (read-only, the [IP5] rule)

`emergency.skill.ts`, `key: "emergency"` (new `SkillKey`), contexts
`["emergency", "care/emergency", "triage"]`. Tools, **all read-only**:
`er_board` (who is waiting, by colour, longest first), `wait_breaches`, `arrival_details`,
`er_capacity` (free bays + `ward_occupancy` from the inpatients skill). No tool writes a
category — a triage decision is a nurse's hands on the animal, not a sentence. Existing
`gatedTools` mechanism applies (`no-diagnosis` hides `arrival_details`'s discriminator
list). The scheduling skill's `isEmergency: true` booking path creates an **arrival** with
`source: AGENT` when the layer is enabled, an appointment as today when it is not.

## 6. Integration map

| Module | Today | With the layer (enabled) | Schema | Phase |
|---|---|---|---|---|
| **Appointments** | `isEmergency` boolean, hand-set | Tag + clock on the row; `isEmergency` projected; RED fast-walk; `TRIAGE_REQUIRED` guard; card colour band; sheet "الفرز" tab | +2 cols | E0–E2 |
| **Queue / kanban** | `emergencyToFront` boolean sort | `sortQueueCards` ranks by `queueRank` then arrival; ER board as a sibling tab; queue column shows band + wait clock | — | E2 |
| **Public booking** | Writes flag, **never alerts** | `isEmergency` → `EmergencyArrival(EN_ROUTE, source: PUBLIC_BOOKING)` + questionnaire pre-fill; emit fixed for the disabled case too | — | E1 |
| **AI agent** | Books with `isEmergency` | Arrival with `source: AGENT`; new read-only skill | — | E1, E4 |
| **Pet portal** | No emergency kind | `CALLBACK` request with an emergency flag → arrival (D8 for a real kind) | D8 | E1 |
| **Vital signs** | 6 sources | `+TRIAGE` source; triage vitals pre-fill exam step 2 via existing link path | enum | E1 |
| **Clinical exam** | Chief complaint free text | Pre-filled from `presentingComplaint`; band shown in the exam header; `PatientAlert` banner | — | E2, E3 |
| **Lab tests** | Hand-set `priority` | Defaulted from tag (client + DAO) | — | E2 |
| **Radiology** | Hand-set `priority` | Defaulted from tag | — | E2 |
| **Operations** | Hand-set `urgency`; IMMEDIATE overrides gates | `urgency` defaulted; RED inherits gate override **for free** | — | E2 |
| **Inpatients** | `acuity` from kind | `kind`/`acuity` defaulted from tag; RED → ICU/CRITICAL → hourly monitoring; admit door pre-filled | — | E2 |
| **Pharmacy** | Free-text allergies on pre-anaesthetic form only | Reads `PatientAlert` at dispense and prescribe; blocks on `ALLERGY` match with an override reason | +1 model | E3 |
| **Consents** | No emergency consent | `EMERGENCY_TREATMENT` template (verbal/phone + witness); `FINANCIAL_ESTIMATE` moved post-stabilisation | enum | E3 |
| **Invoices** | Pay-first UX | Emergency consultation type; after-hours service line; deferred payment UX; `DONE` guard unchanged | — | E2 |
| **Inbox** | `emitEmergencyCase` as `APPOINTMENT_NEW` | `TRIAGE` type; five emitters; recipients via existing `emergencyRecipientIds` | enum | E3 |
| **Dashboard** | "Critical alerts" = inpatient census | Acuity card: RED/ORANGE waiting + breaches + critical inpatients | — | E2 |
| **Rooms / cages** | ICU/WARD/ISOLATION types | `bayRoomIds` setting marks ER bays; capacity strip reuses `inpatients.dao.ts:540` census | — | E2 |
| **Stock** | Warehouses, `reorderPoint`, `stockAlerts` | `crashCartWarehouseId` setting → crash-cart panel on the board (items under reorder point) | — | E3 |
| **Staff / shifts** | `ShiftAssignment` per day | On-shift vet resolution for walk-ins (D3) | — | E1 |
| **Owners** | `OwnerRelationship.EMERGENCY` exists | Surfaced on the arrival card when the owner is not present | — | E2 |
| **Mobile clinics** | `MobileBookingRequest` NEW→SCHEDULED | Seam only: request → arrival with `source: MOBILE_REQUEST` (v2) | — | — |
| **Video calls** | Token per appointment | Seam only: tele-triage on a `REMOTE` arrival (v2) | — | — |
| **Reports** | 12 builders | `emergency.builder.ts` + catalog entry gated on `emergency` | — | E4 |
| **RBAC** | 65 resources | `emergency` resource (§7.3) | — | E0 |
| **Tasks** | Manual | Optional auto-task on RED ("استعداد فريق الطوارئ") — **off by default** (D9); note `tasks.enabled` routes new tasks to an approval queue, which is wrong for an emergency | — | E3 |

## 7. Server layout, API & RBAC

### 7.1 Settings — the toggle and its knobs (zero schema)

Added to `branchSettingsSchema` beside `queue` / `tasks` / `warehouse` / `services`:

```ts
emergency: z.object({
  enabled: z.boolean().default(false),
  // المسار السريع للأحمر: WAITING → CHECK_IN → IN_SERVICE في معاملة واحدة بسبب مسجَّل
  redFastWalk: z.boolean().default(true),
  requireTriageBeforeService: z.boolean().default(false),
  deferPaymentUx: z.boolean().default(true),
  untriagedAlertMinutes: z.number().int().min(1).default(10),
  defaultDurationMinutes: z.number().int().min(5).default(30),
  defaultVetStaffId: z.string().nullable().default(null),
  consultationTypeId: z.string().nullable().default(null),
  afterHoursServiceId: z.string().nullable().default(null),
  bayRoomIds: z.array(z.string()).default([]),
  crashCartWarehouseId: z.string().nullable().default(null),
  allowUnidentifiedPatients: z.boolean().default(true),
}).prefault({}),
```

Why branch-level and JSON (D1): only the main branch may run an ER; the toggle follows
the `queue.enabled` precedent exactly; and it adds **no Prisma types** (§9). The UI lives
in `branch-operations-page.tsx` as a new `SettingRow` group — the same page that hosts
the queue switches.

### 7.2 Module layout — `src/server/emergency/`

| File | Role |
|---|---|
| `emergency.controller.ts` | Routes below; **every route `requirePermission` from the first line** (the inpatients rule; the RBAC P7 ungated-routes ratchet enforces it) |
| `emergency.model.ts` | TypeBox bodies with prismabox enums |
| `emergency.dao.ts` | Prisma only; `type Tx = Prisma.TransactionClient` (house rule) |
| `emergency.type.ts` | `Prisma.XGetPayload` selects; Zod form schemas |
| `emergency.workflow.ts` | Pure: arrival machine, `canConvert`, guards, labels |
| `emergency.rules.ts` | Pure: `TRIAGE_RULES`, `resolveDefaults(tag)` |
| `triage-discriminators.data.ts` | Curated VTL rows (§4.7) |
| `triage-scoring.ts` | Pure: `computeAttScore` |
| `triage-breach.service.ts` | Pure: `evaluateBreaches` (§4.5) |
| `emergency.errors.ts` | `EmergencyError` registered in `CLIENT_ERROR_NAMES` |
| `emergency-invoice.service.ts` | After-hours line + consultation type at conversion |
| `emergency-propagation.ts` | `defaultsForAppointment(appointmentId)` consumed by the four DAOs in §4.2 |

Mounted under the existing **`careServer`** sub-server in `src/server/index.ts`
(beside grooming, pharmacy, inpatients), **not** as a new top-level `.use()`: the
top-level Elysia chain hits TS2589 past a fixed number of uses (memory
`elysia-chain-at-ts-depth-ceiling`), which is exactly why `documentsServer`,
`clinicalServer`, `publicServer` and `careServer` exist.

### 7.3 API

| Route | Gate | Notes |
|---|---|---|
| `GET /emergency/board` | `emergency.read` (BRANCH) | arrivals + triaged visits, sorted by rank then `arrivedAt`; runs `evaluateBreaches` |
| `POST /emergency/arrivals` | `emergency.create` | walk-in / on-the-way / unidentified |
| `PATCH /emergency/arrivals/:id/arrive` | `emergency.update` | EN_ROUTE → ARRIVED |
| `PATCH /emergency/arrivals/:id/leave` | `emergency.update` | reason required |
| `POST /emergency/triage` | `emergency.triage` | `{ arrivalId | appointmentId, discriminators, category?, overrideReason?, vitals? }` — §3.2 |
| `GET /emergency/appointments/:id/triage` | `emergency.read` | assessment chain for the sheet tab |
| `GET /emergency/capacity` | `emergency.read` | bays + census + crash cart |
| `GET /emergency/discriminators` | `emergency.read` | the curated list (client caches) |
| `PatientAlert` CRUD | `patients.update` | lives under `patients`, not here — it is patient data |

RBAC registry entry:

```ts
{
  key: "emergency", kind: "record", group: "clinical",
  labelAr: "الطوارئ والفرز", labelEn: "Emergency & Triage",
  scopes: ["BRANCH"],            // enforced in the DAO via branchWhere, like inpatients
  extraActions: ["triage"],      // a clinical judgement, not an `update` — a receptionist
                                 // may create an arrival and must not assign a colour
  controllers: ["emergency"],
}
```

`db:sync-permissions` runs on deploy (idempotent) so the slugs reach prod without a
migration — the registry's own reasoning.

## 8. UI plan

- **ER board** — `/care/emergency` (`src/routes/_pathless-layout/care/emergency.tsx`),
  sidebar entry under Care, hidden without `emergency.read` (the pharmacy/inpatients
  precedent). Tabs: `board` (colour bands: on-the-way · untriaged · RED · ORANGE · YELLOW
  · GREEN/BLUE · in service), `capacity`, `history`. Each card: band, wait clock
  (`tabular-nums`, red past target), patient/owner or provisional label, presenting
  complaint, ATT chip, `PatientAlert` chips, treating vet. Search state in the URL (the
  inpatients route pattern). `LiveBadge` + 30 s polling.
- **Triage sheet** — body-system tabs of discriminators (checkbox groups), proposed colour
  rendered live, override select + required reason, vitals block (the existing vital-signs
  form component with `source: TRIAGE`), ATT preview. Header `border-b px-4 py-2`, footer
  `border-t px-4 py-2` + `size="sm"` (memory `header-footer-bars-px4-py2`); Radix
  `Tabs dir="rtl"`; `SelectContent position="popper"`.
- **Arrival dialog** — walk-in / on-the-way / unidentified switch; owner+patient combobox
  or provisional label; complaint; source.
- **Appointment card & sheet** — colour band replaces the red dot when a tag exists; a new
  "الفرز" tab shows the assessment chain and a "أعد الفرز" action.
- **Kanban** — queue column ordered by `queueRank`; wait clock per card in queue/check-in.
- **Dashboard** — `CriticalAlertsCard` becomes acuity-aware (RED/ORANGE waiting, breaches,
  critical inpatients) — its query moves off the census.
- **Exam** — band in the header; `PatientAlert` banner above step 1; complaint pre-filled.
- **Order dialogs** (lab, radiology, operation, admit) — priority/urgency/acuity pre-filled
  from the tag with a small "من الفرز" hint; still editable.
- **Settings** — `SettingRow` group on `branch-operations-page.tsx` for §7.1.
- **Verify RTL visually** (AGENTS.md): screenshot the board and the sheet through the
  headless-CDP path before the phase exit.

## 9. Non-functional & house rules that bind here

- **The TypeScript instantiation-depth ceiling is the first risk, not the last.** The
  inpatients plan measured that adding models fires TS2589 in unrelated accounting files.
  This plan adds **two models in E0 and one in E3** and nothing else. Discipline:
  1. E0's first commit is schema-only; run `bun run typecheck` **before** any code.
  2. Every new `tx`-taking helper is `type Tx = Prisma.TransactionClient` with
     `?? (db as unknown as Tx)` — never `Prisma.TransactionClient | typeof db`.
  3. `where` hoisted into typed consts — no conditional spreads inside Prisma args.
  4. If TS2589 fires anyway, **stop and widen headroom first** (the Tx-narrowing sweep on
     the next-largest module), then resume. Do not shave the model to fit.
- **Append-only clinical rows.** `TriageAssessment` is never updated; corrections are new
  rows with `supersedesId`.
- **No LLM-generated clinical content** — discriminators, thresholds, mappings (§4.7).
- **Arabic-first client errors** through a domain error class in `CLIENT_ERROR_NAMES`.
- **Every route gated from the first line**; `BRANCH` scope enforced in the DAO.
- **Server never imports `src/features/**`** (the layering audit); `emergency.rules.ts`
  and `emergency.workflow.ts` are pure so the client can import them.
- **Tests classify themselves**: DB-backed tests import `@/lib/db` (or are `.dao.test.ts`)
  so the fast suite excludes them; pure tests for the machine, rules, scoring and breach
  evaluator run fast.
- **Migrations via `prisma migrate diff` schema→schema**, read before deploy (memory
  `migrate-diff-never-from-live-db`), zero DROPs.
- **Ledger safety** is untouched (§3.5).
- **Money-path discipline**: after-hours line and consultation type go through the
  existing pricing/tax path (`ClinicServiceConfig`, `ConsultationTypeConfig`) — no new
  price fields.

## 10. Reporting & KPIs (`GET /reports` catalog entry `emergency`, gate `emergency`)

| Widget | Derivation |
|---|---|
| `arrivalsTrend` | arrivals per day by category (stacked) |
| `doorToTriage` | median/p90 `assessedAt − arrivedAt` |
| `doorToDoctor` | median/p90 first `STATUS_CHANGED{to: IN_SERVICE}` − `arrivedAt`, by category |
| `targetCompliance` | % seen within `targetMinutes`, by category |
| `leftWithoutTriage` | count + rate |
| `overrideRate` | `category ≠ proposedCategory` share — tool vs nurse agreement (the VTL paper's own metric) |
| `byHour` | arrivals by hour × weekday — staffing |
| `dispositions` | discharged / admitted (→ inpatient kind) / to surgery / died |

## 11. Implementation phases

Each phase = one PR; each task = one commit `feat(emergency): … [Ex.n]`. Rule 10's trio at
the module exit (seed · CI pinning the seed's figures · executed walkthrough — rule 12).

- **E0 — Foundation (1 d):** `emergency` settings block + UI rows; `TriageCategory`,
  `ArrivalStatus`, `ArrivalSource`; `TriageAssessment`, `EmergencyArrival`;
  `Appointment.triageCategory/arrivedAt`; `VitalSignsSource.TRIAGE`, `InboxItemType.TRIAGE`;
  migration; RBAC resource + labels + `db:sync-permissions`; `emergency.rules.ts`,
  `emergency.workflow.ts` + pure tests; **typecheck ceiling measured and recorded in the PR
  body**; `docs/appointments-workflow.md` "Emergency layer" section.
- **E1 — Arrivals & triage (1.5 d):** arrival CRUD; discriminator data + guard test; triage
  sheet; `assess` transaction (vet resolution, conversion, RED fast-walk, re-triage);
  `isEmergency` projection; vitals with `TRIAGE` source; public-booking / agent / portal
  doors → arrivals; the missing public-booking emit fixed.
- **E2 — Board & propagation (1.5 d):** ER board + capacity + history; `sortQueueCards`
  rank; card band + wait clock; dashboard acuity card; propagation into lab / radiology /
  operations / inpatients (client pre-fill + DAO default); emergency consultation type +
  after-hours line + deferred-payment UX; exam header band + complaint pre-fill.
- **E3 — Alerts, safety & consent (1 d):** five `emitTriage*` emitters; `evaluateBreaches`
  wired to board load and client tick; `PatientAlert` model + patient tab + banners +
  pharmacy read; `EMERGENCY_TREATMENT` consent template (D7); crash-cart panel; optional
  RED task (D9, default off).
- **E4 — AI, reports, exit (1 d):** `emergency.skill.ts`; `emergency.builder.ts` + catalog;
  idempotent demo seed (`db:seed:emergency-demo` — a branch with the layer on, six
  arrivals across all colours, one re-triage, one left-without-triage, one RED admitted to
  ICU) with a CI suite pinning its figures; HTTP permission tests (authorized passes /
  unauthorized 403 / read-only cannot triage); the walkthrough **executed through the UI**
  and quoted from that run.

## 12. Decisions needed before E0 (do not start without answers)

| # | Question | Recommendation |
|---|---|---|
| D1 | Toggle at branch level (JSON) or clinic level (`ClinicProtocols` columns)? | **Branch JSON.** Only some branches run an ER; matches `queue.enabled`; adds no Prisma types (§9) |
| D2 | Unidentified animal: nullable `patientId` on the arrival only, or a per-clinic placeholder Owner ("مجهول")? | **Nullable on the arrival**; the appointment still needs a `patientId`, so conversion of an unidentified arrival requires registering the patient first, under a clinic-level "Stray / unknown" owner created once by seed. Surface as one step in the triage sheet |
| D3 | Vet for a walk-in: setting default → today's shift → queue responsibles → 422? | **Yes, in that order**, never a silent pick; the sheet shows who was resolved and lets the nurse change it |
| D4 | Payment deferral = UX reordering only, or a real `DONE` bypass? | **UX only.** The ledger gate stays; an "unbilled emergency" badge keeps it visible |
| D5 | RED fast-walk automatic (two logged transitions) or manual? | **Automatic, behind `redFastWalk`** (default on); every transition still a `STATUS_CHANGED` row with a reason |
| D6 | Source and Arabic translation of the VTL discriminators | Owner-approved list from the Ruys et al. VTL; **no LLM**; ships `reviewed: false` until signed |
| D7 | Emergency treatment consent form | Owner supplies the clinic's verbal/phone consent form (none in `docs/consents/`); until then the template is drafted from `DISCHARGE_AGAINST_ADVICE` structure and marked draft |
| D8 | `PetOwnerRequestKind.EMERGENCY` | **Defer**; touches the mobile app contract. v1 reuses `CALLBACK` with an emergency flag in the payload |
| D9 | Auto-create a Task on RED | **Off by default**; if on, bypass the tasks approval queue explicitly |
| D10 | Accept load-triggered breach alerts until the interval runner exists? | **Yes**, stated in the PR body; the runner is a shared foundation (inpatients §4.7, accounting jobs, subscriptions, dunning, reminders) and should be built once, before or alongside E3 |
| D11 | Where does `PatientAlert` ship — E3 here, or its own small PR first? | **Own PR first, from `main`.** It is a safety fix pharmacy needs today, and it decouples the ceiling risk from this module |

### Sequencing note

This module inherits two things it does not own: the **vitals reference-range engine**
(uncommitted in the inpatients module) and the **interval runner** (not built). Land
inpatients, build the runner, then start E0 — and this plan shrinks from six days to
roughly four, because the scoring backbone and the alert delivery arrive for free.
