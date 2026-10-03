# SOAP Record & Per-Complaint Templates — Master Plan

**Status:** in build — §11 decided 2026-09-04 (owner). S1 landed; see §9 for phase state.
**Scope:** replace the fixed 4-step visit wizard with a SOAP-structured clinical note
produced from a per-complaint template, finalized and amendable like every other clinical
document in this repo.

**Explicitly out of scope** (named so nobody widens the phases mid-build): the coded
diagnosis *catalogue* (VeNom/SNOMED import + picker), the patient-level problem list,
estimates, and the AI scribe. §3.4 lands the seam each of them plugs into; none of them
ships here.

---

## 1. Current state (audit)

The visit record is `ClinicalExam` — **one row per appointment**, `appointmentId @unique`,
written by four `PATCH` endpoints that map 1:1 to four hardcoded wizard steps.

| Step | UI | What it writes |
|---|---|---|
| 1 — Symptoms & history | [symptoms-history-step.tsx](src/features/appointments/components/tabs/clinical-exam/symptoms-history-step.tsx) | `chiefComplaint`, `duration`, `presentIllnessHistory`, `ownerNotes`, `symptoms[]`, 4 `ClinicalLevel` fields |
| 2 — Vitals & systems | [vitals-step.tsx](src/features/appointments/components/tabs/clinical-exam/vitals-step.tsx) | 9 `ExamCondition` columns + **27 `checklist*` booleans** + `vaccinationReviewedAt` |
| 3 — Diagnosis | [diagnosis-step.tsx](src/features/appointments/components/tabs/clinical-exam/diagnosis-step.tsx) | `preliminaryDiagnosis` (free text), `severity`, `diagnosisDescription` |
| 4 — Treatment plan | [treatment-plan-step.tsx](src/features/appointments/components/tabs/clinical-exam/treatment-plan-step.tsx) | `dietPlan`, `monitoringPlan` — plus it already orders services, labs and radiology inline |

Measurements were already extracted once: `weight`/`temperature`/`heartRate`/… are marked
**مهجورة** on the model and now live in `VitalSignsRecord`, referenced by `vitalsRecordId`
(see [vital-signs-plan.md](docs/vital-signs-plan.md)). That refactor is the precedent this
plan follows — same table, same kind of surgery, already proven here.

### Consequences

- **The record cannot vary.** A vomiting workup, a lameness exam and a derm consult all get
  the identical 27 checkboxes. A clinic that wants a dermatology history has no way to ask
  for one short of a schema migration.
- **27 boolean columns are a form encoded as DDL.** `checklistVomiting`, `checklistXray`,
  `checklistEar`… Adding a 28th item is a migration; removing one breaks the completion
  percentage, which is why `checklistVaccinations` is documented as kept-for-array-shape
  even though it is now derived.
- **`ClinicalSymptom` has five values** — `VOMITING`, `DIARRHEA`, `COUGH`, `SNEEZING`,
  `LETHARGY`. That is the entire symptom vocabulary available to the clinic.
- **One note per visit, ever.** `appointmentId @unique` means no re-exam, no second
  clinician's note, no addendum after the fact. `completedAt` is a one-way latch.
- **Nothing is locked.** A "completed" exam stays fully editable through the same PATCH
  endpoints. Every other clinical document here has a lock (`DocStatus` in accounting,
  radiology reports amend via `RadiologyReportAddendum`); the medical record does not.
- **The assessment is a string.** `preliminaryDiagnosis String?` — so no recall by
  condition, no chronic-disease tracking, no clinical audit, nothing for a scribe to fill.
- **`ClinicProtocols.soapNotes` already exists as a per-clinic toggle** and is read by
  nothing — [protocols.ts](src/features/settings/protocols/data/protocols.ts#L21) renders
  the switch, `protocols.model.ts` validates it, no code branches on it. The intent was
  declared and never built.

### What is genuinely good and must survive

Step 4 is not just prose: it already creates appointment services, lab orders and radiology
orders from inside the visit. **That wiring is the "P" of SOAP and must be carried over
intact**, not rebuilt. Likewise `vitalsRecordId` — the note references vitals, it never
re-captures them.

---

## 2. Target shape

A note is produced *from* a template, holds *both* the structured answers and the rendered
prose, and locks on finalize.

```
   ExamTemplate  (system or per-clinic, versioned, per complaint + species)
        │
        │  blocks[] each tagged S | O | A | P
        ▼
   ┌──────────────────────────────────────────┐
   │  ClinicalNote                            │
   │    answers  Json   ← structured, queried │──▶ reports, recall by condition,
   │    S/O/A/P  text   ← rendered, read      │    future scribe target
   │    status   DRAFT → FINAL                │
   └──────────┬───────────────────────────────┘
              │ after FINAL, changes only append
              ▼
      ClinicalNoteAddendum   (the RadiologyReportAddendum pattern)
```

Many notes per visit; notes also exist without a visit (§11-A). The template is
**version-pinned onto the note**, so editing a template never rewrites history — the same
rule `ConsentTemplate` already enforces via `@@unique([clinicId, key, version])`.

---

## 3. Data model

### 3.1 `ExamTemplate`

Modelled directly on `ConsentTemplate`, which is the closest existing thing: versioned,
species-scopable, `blocks Json` generating both the form and the document, `clinicId`
nullable so system templates ship for every clinic.

```prisma
model ExamTemplate {
  id       String  @id @default(cuid())
  clinicId String?              // null = قالب نظام لكل العيادات
  key      String               // GENERAL_V1 · VOMITING_V1 · DERM_V1
  version  Int     @default(1)

  titleAr             String
  titleEn             String?
  presentingComplaint String?   // «قيء» · «عرج» — ما يبحث به الطبيب
  animalTypeId        String?   // null = كل الأنواع

  blocks Json                   // ExamBlock[] — §4

  isDefault Boolean @default(false)  // يُقترح تلقائيًا (نمط RadiologyReportTemplate)
  active    Boolean @default(true)

  @@unique([clinicId, key, version])
  @@index([clinicId, active])
  @@map("exam_template")
}
```

### 3.2 `ClinicalNote`

```prisma
model ClinicalNote {
  id            String  @id @default(cuid())
  clinicId      String
  patientId     String              // مالك السجل هو الحيوان لا الموعد
  appointmentId String?             // §11-A

  templateId      String?
  templateKey     String?           // لقطة — القالب قد يُحذف
  templateVersion Int?

  authorUserId String
  status       ClinicalNoteStatus @default(DRAFT)

  // النصّ المُركَّب — ما يقرأه إنسان، ولا يتغيّر إذا عُدّل القالب لاحقًا
  subjective String?
  objective  String?
  assessment String?
  plan       String?

  answers Json                      // { [blockId]: value } — ما تقرأه التقارير
  vitalsRecordId String?            // يُشار إليه، لا يُعاد التقاطه

  finalizedAt   DateTime?
  finalizedById String?

  @@index([clinicId, patientId, createdAt])
  @@index([appointmentId])
  @@map("clinical_note")
}

enum ClinicalNoteStatus { DRAFT FINAL AMENDED }
```

Storing **both** `answers` and the four prose fields is deliberate, and it is the same
instinct as `Invoice.priceSnapshot`: the prose is the legal record and must be frozen; the
answers are the queryable structure and may be re-rendered.

### 3.3 `ClinicalNoteAddendum`

A near-copy of `RadiologyReportAddendum` — `noteId`, `text`, `authoredById`, `createdAt`,
`@@index([noteId, createdAt])`. Reusing the shape means the existing mention/attachment
pattern transfers if it is ever wanted.

### 3.4 `ClinicalNoteDiagnosis` — the seam, landed now

```prisma
model ClinicalNoteDiagnosis {
  id     String @id @default(cuid())
  noteId String
  idx    Int

  text       String
  code       String?         // فارغ في هذه الخطة
  codeSystem String?         // VENOM | SNOMED — لاحقًا
  kind       DiagnosisKind   // DIFFERENTIAL | WORKING | FINAL
  severity   DiagnosisSeverity?

  @@index([noteId, idx])
  @@map("clinical_note_diagnosis")
}
```

This table ships here even though the code catalogue does not. Reason: the "A" of SOAP is a
*list* of diagnoses with a differential/working/final distinction — shipping it as another
free-text column would rebuild the exact limitation this plan exists to remove, and
retrofitting a child table later means migrating notes twice. `code` stays null until the
catalogue lands. The pattern already exists in-repo:
[operation-procedures.type.ts](src/server/operation-procedures/operation-procedures.type.ts#L120)
carries `{ snomed, cpt, icd10pcs, venom }` on procedure definitions — procedures are coded,
diagnoses are not, and this closes that asymmetry structurally.

---

## 4. The block descriptor

One TypeScript union, validated with TypeBox on write, stored as `blocks Json`. Every block
declares which SOAP section it belongs to — that is what makes this a SOAP template rather
than a generic form builder.

```ts
type ExamBlock = {
  id: string;                    // ثابت مدى حياة القالب — مفتاح answers
  section: "S" | "O" | "A" | "P";
  labelAr: string;
  labelEn?: string;
  required?: boolean;
} & (
  | { kind: "prose";       placeholderAr?: string }
  | { kind: "select";      options: BlockOption[] }
  | { kind: "multiselect"; options: BlockOption[] }
  | { kind: "scale";       min: number; max: number; labelsAr?: string[] }
  | { kind: "bodySystems"; systems: string[] }        // يستوعب ExamCondition ×9
  | { kind: "checklist";   items: ChecklistItem[] }   // يستوعب الـ27 عمودًا
  | { kind: "vitalsRef" }                             // يقرأ VitalSignsRecord
);
```

`bodySystems` and `checklist` exist specifically so the two worst parts of today's schema
become **one row of template data each** instead of 36 columns. `vitalsRef` renders the
linked reading read-only and never writes vitals — the vital-signs module stays the single
writer.

**`id` is immutable.** Changing a block's `id` orphans every stored answer. Editing a
template that already has notes bumps `version` (§3.1); it never mutates ids in place.

---

## 5. The finalize invariant

Non-negotiable, and consistent with how this repo already treats posted documents:

1. `DRAFT` — freely editable by the author, invisible to the owner portal.
2. `FINAL` — set once, with `finalizedAt` + `finalizedById`. **The four prose fields and
   `answers` become immutable.** No PATCH endpoint may write them again.
3. Corrections after `FINAL` append a `ClinicalNoteAddendum` and flip status to `AMENDED`.
   The original text is never edited or deleted.

This is the ledger-safety instinct from CLAUDE.md rule 3 applied to the medical record —
*cancels only append* — and it is the reason the current PATCH-forever design has to go.
Tests must cover: PATCH on a `FINAL` note → 4xx; addendum on a `DRAFT` → 4xx; finalize
twice → idempotent, not a second `finalizedAt`.

---

## 6. Server module — `src/server/clinical-notes/`

Standard four files, registered in `src/server/index.ts`.

⚠ **`src/server/index.ts` is at the Elysia chain depth ceiling** — a 67th top-level `.use()`
breaks typecheck with TS2589 pointing at an unrelated file. Register this module as **one
grouped sub-server**, not four separate `.use()` calls.

| File | Contents |
|---|---|
| `clinical-notes.controller.ts` | `GET /patients/:id/clinical-notes`, `GET/POST /appointments/:id/clinical-notes`, `PATCH /clinical-notes/:id` (draft only), `POST /clinical-notes/:id/finalize`, `POST /clinical-notes/:id/addenda`, template CRUD |
| `clinical-notes.dao.ts` | Prisma only |
| `clinical-notes.model.ts` | TypeBox — including the `ExamBlock` union validator |
| `clinical-notes.type.ts` | `Prisma.ClinicalNoteGetPayload<…>`, Zod form schemas |
| `note-render.service.ts` | pure: `(template, answers) → { subjective, objective, assessment, plan }`. No DB, no clock — testable in the fast suite |
| `template-resolver.service.ts` | pure: pick the default template for (complaint, animalType, clinic), clinic override beating system |

Two pure services carry the real logic, so the fast tier covers them without a database
(rule 14). Per rule 12, **every endpoint needs an authorized-passes / unauthorized-403
controller test** — new permission keys `clinical-notes.read` / `.write` / `.finalize` /
`.amend`, following the existing `patients.read` / `payroll.approve` convention, and the
`ungated-routes` audit will fail the build if any route is left open.

---

## 7. UI

### 7.1 Visit tab — replaces the wizard
`src/features/appointments/components/tabs/clinical-note/`. The 4-step stepper becomes four
**SOAP sections** rendered from the template's blocks. A template picker sits at the top,
defaulting via §6's resolver. Draft autosaves; a single «إنهاء وتوثيق» finalizes.

The existing step-4 ordering tables (services, labs, radiology) move into the **P** section
unchanged — same hooks, same components.

### 7.2 Template editor — `src/features/settings/exam-templates/`
Under settings, beside medical protocols. Block list with add/reorder/remove, section
assignment, live preview. Editing a template with existing notes prompts a version bump.

### 7.3 Patient chart
A new **«السجل الطبي»** tab listing notes newest-first with status chips, replacing
today's مكتمل/غير مكتمل line in
[patient-history-preview-dialog.tsx](src/features/services/patients/components/history/patient-history-preview-dialog.tsx#L146).

RTL per AGENTS.md; verify by screenshot, not by reading class names.

---

## 8. Migration & backfill

Four migrations, each its own commit, authored via `migrate diff` schema→schema — never
`db:push`, and never diffed from the live local DB (it carries other branches' tables).

1. **`add_clinical_note`** — the four models + two enums. Nothing reads them.
2. **`seed_general_exam_template`** — inserts the system `GENERAL_V1` template: a
   `checklist` block carrying all 27 items, a `bodySystems` block carrying the 9 systems, a
   `vitalsRef`, and prose blocks for the four existing narrative fields.
   ⚠ **This must be a migration, not a seed edit.** `ensureGlobalDefaults` short-circuits on
   a populated database, so default data written into the seed file never reaches an
   existing clinic. This has bitten before.
3. **`backfill_clinical_notes`** — idempotent SQL, one note per `clinical_exam` row:
   `status = FINAL` where `completedAt IS NOT NULL` else `DRAFT`; `templateKey =
   'GENERAL_V1'`; `answers` built from the 27 booleans + 9 systems keyed to that template's
   block ids; prose composed from `chiefComplaint`/`presentIllnessHistory` → S,
   `diagnosisDescription` → A, `dietPlan`/`monitoringPlan` → P; `preliminaryDiagnosis` → one
   `ClinicalNoteDiagnosis` row with `kind = WORKING`, `code = null`. `finalizedById` is
   unknowable historically — leave null and mark the note «مُرحّل تلقائيًا», the same
   honesty the vitals backfill used for approximate timestamps.
4. **`drop_legacy_exam_columns`** — one release *after* every screen reads notes and a
   parallel-run reports zero diff. Not part of the initial rollout.

`ClinicalExam` itself survives migration 4 as the vitals link row (`vitalsRecordId`,
`startedAt`, `completedAt`) unless §11-C retires it entirely.

---

## 9. Phases

One phase = one PR, landing green before the next starts. DB-backed work is verified in CI,
not locally (rule 8).

| Phase | Deliverable | Acceptance |
|---|---|---|
| **S1** | Schema + migrations 1–2 | `migrate diff --exit-code` clean; zero DROP statements; `GENERAL_V1` present for a fresh clinic *and* an existing one |
| **S2** | Server module + `note-render` + `template-resolver` | Both pure services covered in the fast suite; finalize/addendum guards (§5) tested; every route has an authorized + 403 test |
| **S3** | Template editor UI | A clinic can create «التهاب الجلد» from scratch and it appears in the visit picker; version bump prompt fires when notes exist |
| **S4** | Visit note UI, behind `ClinicProtocols.soapNotes` | With the flag off the old wizard is unchanged; with it on, a note can be written, finalized, and amended. **The flag finally does something** |
| **S5** | Migration 3 (backfill) + patient-chart tab | Row counts match `clinical_exam`; every backfilled note renders; completed exams show `FINAL` |
| **S6** | Retire the wizard, flip the flag default, port reports + pet-portal reads, migration 4 | Parallel-run zero diff before the drop; `reports.catalog` and `domain-error-reachability` audits green |

S3 and S4 both depend only on S2 and can run in parallel.

---

## 10. Risk: the TypeScript instantiation-depth ceiling

This plan adds four Prisma models. The inpatients module documented that adding models of
this order tripped **TS2589 in unrelated files** (`src/server/accounting/**`), then degraded
`select` inference downstream, then a V8 OOM — and that the trigger is
`Prisma.TransactionClient | typeof db` unions distributing over both arms.

Mitigations, applied from S1 rather than after the first red:
- Every new `tx`-accepting helper narrows to `Tx = Prisma.TransactionClient`, casting only
  the default (`?? (db as unknown as Tx)`). This is already the house rule.
- No conditional spreads inside Prisma args — hoist `where` into a typed const, or `select`
  inference silently widens to the full model.
- Register the module as one grouped sub-server (§6).

If S1 turns typecheck red in accounting, that is this risk, not a bug in accounting.

---

## 11. Decisions — settled 2026-09-04 (owner)

All eight were answered with the recommendation as written. They are binding from
here — reopening one is a plan change, not an implementation detail.

| # | Decision | Settled as |
|---|---|---|
| A | Note tied to a visit? | **No** — `appointmentId` nullable. Phone consults, walk-in triage, and a second clinician's note on one visit are all expressible. |
| B | Species scoping | **`animalTypeId` FK**, not a `speciesKey` string. A typo'd string matches nothing silently. |
| C | `ClinicalExam`'s fate | **Survives** as the vitals link row + the appointment's started/completed latch. Its 36 clinical columns drop in migration 4, not before. |
| D | Does finalizing gate the appointment? | **Yes — ≥1 `FINAL` note** replaces `completedAt` as the «تمت» guard. Hence `@@index([appointmentId, status])` rather than the plan's single-column index: that composite *is* the gate's query. |
| E | Who finalizes / amends | **Finalize: `veterinarian` only.** **Amend: the note's original author, plus `clinic_manager` / `branch_manager`.** Technicians draft and read, never finalize. |
| F | Retire `ClinicalSymptom`? | **Yes** — the 5 values became the `symptoms` multiselect block's options in `GENERAL_V1`. The enum column drops with the rest in migration 4. |
| G | Bilingual or Arabic-only | **Arabic-only**, matching the recent modules. `labelEn?` stays on the block descriptor. |
| H | Starter templates | **S1 ships `GENERAL_V1` only** — it is the backfill target and must exist. The complaint-specific set is a separate content task, scoped after S3. |

### Deviations from this document, and why

Recorded here rather than silently absorbed, because each contradicts something written above.

1. **Permission slugs are generated, not hand-written.** §6 proposes `clinical-notes.read`
   / `.write` / `.finalize` / `.amend`. But `src/lib/rbac/rbac-registry.ts` *derives* every
   slug in the app as `{resource}.{action}` from a registry — hand-writing them would put
   the module outside the roles editor, which is exactly the audit defect that registry
   exists to have fixed. So the module registers as one `clinical_notes` resource of kind
   `record` with `extraActions: ["finalize", "amend"]`.
2. **No partial unique index on system templates.** `@@unique([clinicId, key, version])`
   does not constrain rows where `clinicId IS NULL`, because Postgres counts NULLs as
   distinct. The obvious fix — a partial unique index — cannot be expressed in Prisma, and
   hand-writing one into the migration would fail the CI drift check
   (`migrate diff --exit-code` would demand to drop an index the schema does not declare).
   Instead: the only writer of system rows is a migration, and it inserts conditionally.
   Documented on the column itself.
3. **`bodySystems.systems` carries objects, not `string[]`.** §4 types it as `string[]`,
   which loses the Arabic label per system — the labels already exist in
   `vitals-step.tsx` and must survive. It is `{ key, labelAr }[]`.
4. **The `Appointment` back-relation is `soapNotes`, not `clinicalNotes`.** That name is
   already taken on the model by a free-text `clinicalNotes String?` column.

### The decisions as originally posed

**A. Is a note always tied to a visit?** `appointmentId` is nullable above, which allows
phone-consult notes, walk-in triage notes and a second clinician's note on the same visit.
Recommend nullable. Making it required is simpler but rebuilds the one-note-per-visit
limitation in a new table.

**B. Species scoping — `animalTypeId` FK or `speciesKey` string?** `ConsentTemplate` uses a
string; you have real `AnimalType`/`AnimalStrain` models. Recommend the FK: templates are
clinic-managed data, and a typo'd string silently matches nothing.

**C. What happens to `ClinicalExam`?** Recommend it survives as the vitals link row and the
appointment's started/completed latch, with the 36 clinical columns dropped in migration 4.
The alternative — delete it and move `vitalsRecordId` onto the note — is cleaner but touches
the vital-signs module, the appointments workflow guard, and the lab/radiology attach paths.

**D. Does finalizing a note gate the appointment?** Today `ClinicalExam.completedAt` opens
the «تمت» guard in the workflow. If a visit can carry many notes, "the exam is done" needs a
new definition — recommend *at least one FINAL note* replaces it.

**E. Who may finalize and amend?** Recommend `clinical-notes.finalize` restricted to
veterinarian roles, `.amend` to the original author plus an admin. Needs your role mapping.

**F. Retire `ClinicalSymptom`?** The 5-value enum becomes a `multiselect` block's options in
`GENERAL_V1`, editable per clinic. Recommend retiring it. Anything currently filtering on
the enum column would move to querying `answers`.

**G. Bilingual or Arabic-only?** Rule 5 says accounting screens ship Arabic-first with one
i18n pass later. Blocks carry `labelEn?` either way; the question is whether the editor and
the system templates ship EN keys now. Recommend Arabic-only, matching the recent modules.

**H. Who authors the starter templates?** The schema supports them; the clinical content is
yours. Recommend S1 ships `GENERAL_V1` only (it is the backfill target and must exist), and
the complaint-specific set — vomiting, lameness, derm, dental, wellness — is a content task
you scope separately once the editor exists in S3.
