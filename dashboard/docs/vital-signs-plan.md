# Vital Signs — Central Record, History & Snapshots

**Status:** implemented (V1–V7). The §10 decisions were resolved as recommended — see
§11 for what shipped and the two places the build refined the plan.
**Scope:** turn vital signs from three disconnected form blocks into one patient-level
record with history, charts, and immutable per-document snapshots.

---

## 1. Current state (audit)

Vital signs are captured today in **three** places, each writing into the row of the
document that happened to be open. Nothing is shared, nothing is queryable, nothing has a
history.

| # | Where | Model | Fields captured |
|---|---|---|---|
| 1 | Visit → Clinical exam, step 2 | `ClinicalExam` (`prisma/schema.prisma:2087-2104`) | `weight`, `temperature`, `heartRate`, `respiratoryRate`, `oxygenSaturation`, `bloodPressure`, `painScore`, `bodyConditionScore` + 9 `ExamCondition` fields |
| 2 | Lab order → sample collection | `LabPreAnalytical` (`prisma/schema.prisma:704-724`) | `weight`, `temperature`, `heartRate`, `respiratoryRate` |
| 3 | Radiology order → prep/safety screening | `RadiologySafetyScreening` (`prisma/schema.prisma:915-942`) | `weight`, `temperature`, `heartRate`, `respiratoryRate` |
| 4 | Patient record (denormalized) | `Patient.weight` (`prisma/schema.prisma:1906`) | `weight` only, hand-edited from the profile overview tab |

UI entry points:
[vitals-step.tsx](src/features/appointments/components/tabs/clinical-exam/vitals-step.tsx),
[lab-sample-collection.tsx](src/features/services/lab-tests/components/lab-sample-collection.tsx),
[radiology-prep-steps.tsx](src/features/services/radiology/components/radiology-prep-steps.tsx),
[overview-tab.tsx](src/features/services/patients/components/tabs/overview-tab.tsx).

### Consequences

- A weight typed at radiology prep is invisible to the vet writing the visit exam an hour
  later, and vice-versa. Same animal, same day, three separate typings.
- There is no way to answer "has this cat been losing weight?" — the only historical trace
  is scattered across `clinical_exam` rows joined through appointments.
- Field sets diverge (lab/radiology capture 4 of 8), and types diverge
  (`ClinicalExam.weight` is `Float`, the other two are `Decimal(6,2)`).
- `Patient.weight` is a hand-maintained number that silently drifts from every measurement
  actually taken.

---

## 2. Target shape

One canonical, append-only reading per measurement event, owned by the **patient** — not
by the document that happened to capture it.

```
                       ┌──────────────────────┐
   visit  ────attach──▶│                      │
   lab    ────attach──▶│  VitalSignsRecord    │◀── created from anywhere
   radiology ─attach──▶│  (patient, time)     │    (incl. patient profile)
                       └──────────┬───────────┘
                                  │
                          patient profile ▸ العلامات الحيوية
                          (table + charts + latest)
```

Two rules carry the whole design:

1. **Documents point at a record by id — they never copy or own values.** Whatever the
   record said when it was attached is what that document shows, forever.
2. **"Latest" is only ever a *default* offered at attach time.** After attachment the link
   is frozen; creating a newer reading anywhere never rewrites an existing document.

---

## 3. Data model

### 3.1 New model — `VitalSignsRecord`

```prisma
enum VitalSignsSource {
  MANUAL      // مُدخل مباشرة من ملف المريض
  VISIT       // من الفحص السريري داخل الزيارة
  LAB         // من جمع العيّنة
  RADIOLOGY   // من فحص السلامة قبل الأشعة
}

model VitalSignsRecord {
  id         String           @id @default(cuid())
  code       String           @unique            // VS-XXXX عبر generateUniqueCode
  clinicId   String
  branchId   String?
  patientId  String
  recordedAt DateTime                            // وقت القياس الفعلي (قابل للتعديل/التأريخ للخلف)
  source     VitalSignsSource
  recordedById String?                           // من أخذ القياس

  // مصدر الإنشاء — واحد على الأكثر
  appointmentId    String?
  labOrderId       String?
  radiologyOrderId String?

  // القياسات — كلها اختيارية
  weight             Decimal? @db.Decimal(6, 2)   // kg
  temperature        Decimal? @db.Decimal(4, 1)   // °C
  heartRate          Int?                         // bpm
  respiratoryRate    Int?                         // /min
  oxygenSaturation   Int?                         // %
  bloodPressure      String?                      // "120/80"
  painScore          Int?                         // 0–10
  bodyConditionScore Int?                         // 1–9
  capillaryRefillSec Decimal? @db.Decimal(3, 1)   // CRT — جديد
  mucousMembrane     MucousMembrane?              // جديد (enum) — لون الأغشية المخاطية

  notes String?

  // تصحيح: التعديل بعد الربط يُنشئ سجلًا جديدًا يشير للأصل
  correctsId String?
  correctedById String?  // مملوء على الأصل عند وجود تصحيح

  isDeleted Boolean   @default(false)
  deletedAt DateTime?
  editsCount Int      @default(0)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  clinic     Clinic  @relation(...)
  patient    Patient @relation(...)
  corrects   VitalSignsRecord?  @relation("VitalsCorrection", fields: [correctsId], references: [id])
  correction VitalSignsRecord?  @relation("VitalsCorrection")
  // + appointment / labOrder / radiologyOrder / recordedBy relations
  // + back-relations from the three consumers

  @@index([patientId, recordedAt])
  @@index([clinicId, recordedAt])
  @@map("vital_signs_record")
}
```

Notes:
- `Decimal` everywhere for money-like precision consistency with the existing lab/radiology
  columns; `ClinicalExam`'s `Float` columns are the odd ones out and are being retired.
- `code` follows the repo's `generateUniqueCode` convention (`VS-A3F9`) so a snapshot can be
  cited in a report or a chat message.
- `source` is stored explicitly rather than derived from which FK is set — it survives the
  order being deleted, and leaves room for future sources (kiosk, home monitoring).

### 3.2 Attachment columns on the three consumers

```prisma
model ClinicalExam             { vitalsRecordId String? @unique? … }  // see §10-D
model LabPreAnalytical         { vitalsRecordId String? … }
model RadiologySafetyScreening { vitalsRecordId String? … }
```

The measurement columns on all three become **deprecated-but-present** (see §8) and stop
being written the moment their screen is migrated.

### 3.3 What does *not* move

The 9 `ExamCondition` fields (`hydration`, `skinCondition`, …) and the 27 `checklist*`
booleans stay on `ClinicalExam`. They are visit-protocol findings, not measurements — they
are not chartable and no other module asks for them. (See §10-B — this is reversible.)

---

## 4. The snapshot invariant

> A record that is referenced by any document is immutable.

Enforced in the DAO, not by convention:

- **Create** — always allowed, always a new row.
- **Edit an unlinked record** — in-place update, `editsCount++`.
- **Edit a linked record** — rejected as an update; the API instead creates a *correction*
  record (`correctsId = original.id`, same `recordedAt`) and stamps `correctedById` on the
  original. The document keeps pointing at the original and renders the original values
  with a `مُصحَّح` badge linking to the correction. History shows both rows, the superseded
  one muted.
- **Delete a linked record** — rejected (Arabic error). Unlinked records soft-delete.
- **Re-attach** — a document may swap which record it points at while it is still open/
  editable; once the document reaches a terminal state (exam completed, sample collected,
  study acquired) the link is frozen too.

This is what makes "the radiology order accepted an earlier reading" hold: the radiology
order stores `vitalsRecordId`, and no later reading — nor an edit to that reading — can
change what that order displays.

---

## 5. Freshness

`ageMinutes = now − recordedAt`, rendered as a badge next to every auto-fetched reading.

| Band | Default threshold | Badge | Behavior at attach time |
|---|---|---|---|
| حديث | ≤ 4 h | neutral/success | pre-selected silently |
| خلال اليوم | ≤ 24 h | warning | pre-selected, badge visible |
| قديم | > 24 h | destructive | **not** pre-selected — the picker opens on "قياس جديد" |

Thresholds live in one constant (`VITALS_FRESHNESS`) so they can move to clinic settings
later. Sedation-bearing radiology exams are the one place a hard gate is worth considering
(§10-F).

---

## 6. Server module — `src/server/vital-signs/`

Standard 4-file resource, registered in `src/server/index.ts`.

| File | Contents |
|---|---|
| `vital-signs.controller.ts` | routes below, all `requireClinic: true` |
| `vital-signs.model.ts` | TypeBox bodies/queries, prismabox `VitalSignsSource` |
| `vital-signs.dao.ts` | Prisma only — plus the §4 immutability guards |
| `vital-signs.type.ts` | `vitalSignsSelect`, `VitalSignsRecordResponse` (`Prisma.VitalSignsRecordGetPayload`), Zod `createVitalSignsSchema` → `CreateVitalSignsFormInput` |

```
GET    /vital-signs?patientId=&limit=&offset=&source=&from=&to=   list (paginated, newest first)
GET    /vital-signs/latest?patientId=                             latest non-deleted + ageMinutes
GET    /vital-signs/:id                                           single (for snapshot rendering)
POST   /vital-signs                                               create (+ optional attachTo)
PATCH  /vital-signs/:id                                           edit → correction if linked
DELETE /vital-signs/:id                                           soft delete, blocked if linked
```

`POST` accepts an optional `attachTo: { type: "VISIT"|"LAB"|"RADIOLOGY", id }` so
"create and use here" is **one** round-trip inside one transaction — the record and the
link are never half-written.

Attachment of an *existing* record stays on the owning resource (it is that document's
state, and its permissions/workflow guards already live there):

- `PATCH /appointments/:id/clinical-exam/vitals` → accepts `vitalsRecordId`
- `PATCH /lab-tests/orders/:id/pre-analytical` → accepts `vitalsRecordId`
- `PATCH /radiology/orders/:id/screening` → accepts `vitalsRecordId`

Charts read from the same `GET /vital-signs` list — no separate series endpoint until a
patient's history makes that expensive.

---

## 7. UI

### 7.1 Shared feature — `src/features/services/vital-signs/`

| Component | Job |
|---|---|
| `vitals-picker.tsx` | The whole "auto-fetch latest / pick earlier / measure new" control. Drops into any document screen. |
| `add-vitals-dialog.tsx` | The single measurement form. Takes a `profile` (which fields to show) and an optional attach target. |
| `vitals-snapshot-card.tsx` | Read-only render of an attached record: values, `recordedAt`, source, `VS-` code, `مُصحَّح` badge. |
| `vitals-freshness-badge.tsx` | §5 badge, used by picker + card + profile tab. |
| `vitals-history-table.tsx` | Rows = readings, columns = metrics, wired to `components/common/table-pagination.tsx`. |
| `vitals-charts.tsx` | recharts via `components/ui/chart.tsx` — one line per metric, metric selector, time-range toggle. |
| `data/vitals-fields.ts` | Field metadata in one place: key, Arabic label, unit, step, min/max, normal-range hint (the strings currently hardcoded in `vitals-step.tsx`), and the per-source **profiles** (`FULL` for visits, `BASIC` for lab/radiology). |

`vitals-picker` behavior:

```
┌─ العلامات الحيوية ─────────────────────────────────────────┐
│  آخر قياس · منذ ساعتين · VS-A3F9 · من زيارة              │  ← freshness badge
│  25.4 كجم · 38.6°م · 96 نبضة · 22 نفس                    │
│  [ استخدام هذا القياس ]  [ اختيار من السجل ]  [ قياس جديد ] │
└────────────────────────────────────────────────────────────┘
```

After attach it collapses to `vitals-snapshot-card` + a "تغيير" button (hidden once the
document is frozen per §4).

### 7.2 Patient profile — new tab

`src/features/services/patients/components/tabs/vital-signs-tab.tsx`, registered in
[patient-profile-sheet.tsx](src/features/services/patients/components/patient-profile-sheet.tsx)
next to نظرة عامة / المستندات / خطط علاجية, label **العلامات الحيوية** with a count badge.

Layout, top to bottom:

1. **Latest strip** — one tile per metric: value, unit, delta vs the previous reading
   (↑/↓ + amount), freshness badge on the strip header, `قياس جديد` button at the end.
2. **Charts** — metric toggle (وزن / حرارة / نبض / تنفس / أكسجين / ألم / BCS), range toggle
   (3 أشهر / 6 أشهر / سنة / الكل). Reference band shaded when a range exists (§10-E).
3. **History table** — `التاريخ · المصدر · الوزن · الحرارة · النبض · التنفس · الأكسجين ·
   الضغط · الألم · BCS · المسجِّل · ⋯`. The المصدر cell links to the originating visit /
   lab order / radiology order. Superseded rows muted with `مُصحَّح`. Row menu: تعديل
   (→ correction if linked), حذف (blocked if linked, with the reason).

RTL: the sheet is already `dir="rtl"`; charts get explicit `dir` handling (recharts renders
LTR internally — axis order and tooltip placement need checking against a screenshot, per
the AGENTS.md verification rule). Radix `SelectContent` in the metric/range toggles needs
`position="popper"`.

### 7.3 Changes to the three existing screens

| Screen | Change |
|---|---|
| `vitals-step.tsx` (visit) | The 8 measurement fields are replaced by `<VitalsPicker profile="FULL">`. The 9 condition selects stay exactly as they are. Step-2 completion still requires the same fields — now validated on the attached record instead of the form. |
| `lab-sample-collection.tsx` | The 4-field `العلامات الحيوية` grid is replaced by `<VitalsPicker profile="BASIC">`. `fastingStatus` / `medications` / `ivFluids24h` stay on `LabPreAnalytical` — they are order-specific, not patient vitals. |
| `radiology-prep-steps.tsx` | Same swap. The safety fields (`pregnancyPossible`, `metalImplants`, `asaClass`, …) stay on `RadiologySafetyScreening`. |
| `overview-tab.tsx` (patient) | The editable `الوزن` field becomes read-only, sourced from the latest record, with a "قياس جديد" affordance — otherwise two writers fight over the same number (§10-C). |

Entry points for "add from anywhere": patient profile tab, patients-table row menu, the
three document screens, and the appointment queue row menu.

---

## 8. Migration & backfill

Three migrations, in order, each its own commit:

1. **`add_vital_signs_record`** — create the enum + table + the three nullable
   `vitalsRecordId` columns. Nothing reads them yet.
2. **`backfill_vital_signs`** — SQL data migration, idempotent:
   - one row per `clinical_exam` with any non-null measurement →
     `source=VISIT`, `recordedAt = clinical_exam.updatedAt`, link back;
   - one per `lab_pre_analytical` → `source=LAB`, `recordedAt = createdAt`;
   - one per `radiology_safety_screening` → `source=RADIOLOGY`, `recordedAt = createdAt`;
   - `code` generated in the migration (`VS-` + suffix) with a uniqueness guard.
   Old columns are **left populated** — this migration only adds.
3. **`drop_legacy_vitals_columns`** — ships one release *after* all three screens are
   migrated and a parallel-run check reports zero diff. Not part of the initial rollout.

Per AGENTS.md: `bunx prisma migrate dev --name …`, schema + migration committed together,
never `db:push`. Note the recorded environment constraint — `migrate dev` is blocked in
non-interactive shells here, so this uses the `migrate diff` → manual folder → `migrate
deploy` route.

Backfill caveat to accept explicitly: historical `recordedAt` values are approximations
(`updatedAt`/`createdAt` of the parent row), because the true measurement time was never
stored. Backfilled rows get `notes = "مُرحّل تلقائيًا"` so the chart's early points are
identifiable as estimates.

---

## 9. Phases

One phase = one PR. Each lands green (`bun run typecheck` + `bun test`) before the next
starts.

| Phase | Deliverable | Acceptance |
|---|---|---|
| **V1** | Schema + migrations 1–2 + backfill | `migrate diff --exit-code` clean; row counts match source tables; every backfilled record has a valid `patientId` and a unique `code` |
| **V2** | `src/server/vital-signs/` module + registration | CRUD works via Treaty; §4 guards covered by tests (edit-linked → correction, delete-linked → 4xx); list endpoint paginates |
| **V3** | Shared UI kit (§7.1) + `data/vitals-fields.ts` | Renders standalone; RTL verified by screenshot; no hardcoded colors/radii |
| **V4** | Patient profile tab — latest strip + table + charts | Tab shows backfilled history for a real patient; charts render in both themes; pagination via the shared component |
| **V5** | Wire the visit exam (`vitals-step.tsx`) | Step 2 attaches/creates records; existing completed exams still render their snapshot; step-2 validation unchanged |
| **V6** | Wire lab collection + radiology prep | Both auto-fetch latest with the freshness badge; attaching an earlier record works; an already-acquired study's snapshot does not move when a new reading is taken |
| **V7** | `overview-tab` weight read-only, `Patient.weight` sync, i18n keys, legacy-column drop (migration 3) | Parallel-run shows zero diff between old columns and linked records before the drop |

V5 and V6 are independent of each other — both only depend on V3.

---

## 10. Open decisions — need your call before V1

**A. Freshness thresholds.** Proposed 4 h / 24 h (§5). Clinically, pre-sedation vitals go
stale much faster than a weight for a dose calculation. Do you want one pair of thresholds,
or per-metric ones (e.g. weight tolerable at 7 days, heart rate at 2 hours)?

**B. The 9 `ExamCondition` fields** — stay on `ClinicalExam` (my recommendation, §3.3) or
move into the record so lab/radiology can see hydration too? Moving them makes the record
the full "patient state at time T"; keeping them makes the record purely chartable numbers.

**C. `Patient.weight`.** Recommend it becomes a read-only cache auto-synced from the latest
record with a weight, and the profile overview field stops being editable. Alternative:
leave it hand-editable and accept that it disagrees with the history.

**D. One vitals record per clinical exam, or many?** A long visit may legitimately take
vitals twice (arrival, post-treatment). `@unique` on `ClinicalExam.vitalsRecordId` forbids
that; dropping it means step 2 needs a "which one is the exam's reading" concept. Recommend
starting `@unique` (one per exam) and revisiting if anyone asks.

**E. Species reference ranges.** The normal ranges are currently hardcoded placeholder text
in the visit form ("طبيعي: 60 – 140") and are dog-ish. Chart bands and out-of-range
highlighting need real per-species ranges. Recommend V1–V6 ship with the existing shared
constants and no bands, then a `VitalSignsReferenceRange` table keyed by `animalTypeId` as a
follow-up. Or do you want ranges in scope now?

**F. Hard gate on stale vitals.** Should radiology refuse to proceed to acquisition when the
attached reading is > 24 h old and sedation is planned, or only warn? Recommend warn-only in
v1 — a hard gate blocks emergencies.

**G. Scope of "anywhere".** Confirmed entry points are the three documents + patient profile.
Should the appointment queue / kiosk / video-call patient file also get a "قياس جديد" action?

---

## 11. What shipped

All seven phases landed. `bun run typecheck` is clean and `bun run test` reports 274
passing; the single failure (`naming-series.dao.test.ts`, concurrent document numbering)
is pre-existing and reproduces on a clean tree.

### Decisions, as resolved

| | Decision | Shipped as |
|---|---|---|
| A | Freshness thresholds | 4 h / 24 h, single pair, in `VITALS_FRESHNESS` |
| B | `ExamCondition` fields | stayed on `ClinicalExam` |
| C | `Patient.weight` | synced cache; overview field is read-only |
| D | One record per exam | scalar FK (see refinement below) |
| E | Species reference ranges | out of scope; shared constants, no chart bands |
| F | Stale + sedation | warn only |
| G | Entry points | the three documents + patient profile |

### Two refinements the build made

**D — no `@unique` on `ClinicalExam.vitalsRecordId`.** The scalar column already gives
one record per exam, which is what the decision asked for. Adding `@unique` would have
additionally forbidden *one reading being referenced by two documents* — which is the
whole point of the feature (a radiology order and the visit exam sharing one reading).
Plain nullable FK on all three consumers.

**New rule: a record with no measurement is rejected** (`empty-record`, HTTP 422). Not in
the original plan; it fell out of building the form. An all-null record adds a blank row
to the history table and an empty point to every chart. Enforced in the DAO on create
*and* on update (an edit that clears the last measurement is refused), so it holds on
every write path, not just the form.

### Where things live

| | |
|---|---|
| Schema | `VitalSignsRecord` + `VitalSignsSource` / `MucousMembrane` enums; `vitalsRecordId` on the three consumers |
| Migrations | `20260805100000_add_vital_signs_record`, `20260805100100_backfill_vital_signs` |
| Server | `src/server/vital-signs/` (4 files), registered in `src/server/index.ts` |
| Tests | `src/server/vital-signs/vital-signs.dao.test.ts` — 15 tests, snapshot invariant covered |
| Shared UI | `src/features/services/vital-signs/` — picker, add dialog, snapshot card, freshness badge, history table/dialog, charts, latest strip |
| Patient tab | `src/features/services/patients/components/tabs/vital-signs-tab.tsx` |
| Backfill check | `scripts/verify-vitals-backfill.ts` |

### Charts

Small multiples, one metric per chart — never a dual axis, since kg and bpm share no
scale. Each chart is a single series, so identity comes from the chart title and no
legend is needed. One color throughout (`--chart-2`): this project's `--chart-1..5` are
five lightnesses of one blue — a sequential ramp, not a categorical set — so spending
them on different metrics would imply a grouping that does not exist. That color was
validated for lightness, chroma and ≥3:1 contrast against both the light and dark chart
surface.

### Still open

- **Legacy column drop.** `clinical_exam`, `lab_pre_analytical` and
  `radiology_safety_screening` keep their old measurement columns. They are no longer
  read or written — the code paths are gone — but the drop migration was deliberately
  not shipped in this batch, so a parallel-run comparison can be done against real data
  first. That is migration 3 in §8.
- **Backfilled `recordedAt` are estimates** (`updatedAt`/`createdAt` of the parent row).
  Those rows carry `notes = "مُرحّل تلقائيًا"`.
- **Verified against a near-empty local database** (4 source rows carried over). The
  backfill is correct in shape; it has not been exercised at volume.
