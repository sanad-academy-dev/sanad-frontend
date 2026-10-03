# Patient Clinical Profile — implementation plan

**Goal:** turn the patient record from an *event log* into a *clinical profile* (Digitail-shaped),
and connect a curated view of it to the pet-parent app (`D:\repos\elite-vet-parent`).

**Scope decisions (owner, 2026-08-27):**

| Decision | Choice |
|---|---|
| Data model | **Aggregate what exists — no new tables.** Everything is derived from existing models. |
| Owner scope | **Curated, vet-released only.** Raw exam notes and preliminary diagnoses stay clinic-only. |
| Delivery | **Plan first**, then build in phases. |

---

## 0. Where we are today

### Clinic side

The history tab is *not* thin. `patientsDao.listHistory` ([patients.dao.ts:184](../../src/server/patients/patients.dao.ts#L184))
already merges 5 sources into a day-grouped timeline with kind filters, a range filter, a preview
dialog and deep links into the source record. That machinery is good and stays.

What is missing is a **patient-level clinical view**. Everything clinical is locked inside the
document that produced it:

| Clinical fact | Where it actually lives | Reachable from the patient? |
|---|---|---|
| Allergies | `RadiologySafetyScreening.allergies` ([schema:1424](../../prisma/schema.prisma#L1424)), `PreAnestheticAssessment.allergies` ([schema:2045](../../prisma/schema.prisma#L2045)) | ❌ buried per-document |
| Diagnoses | `ClinicalExam.preliminaryDiagnosis` ([schema:3596](../../prisma/schema.prisma#L3596)), `OperationCase.diagnosis` ([schema:1829](../../prisma/schema.prisma#L1829)) | ❌ one row per visit, never rolled up |
| Medications | `AppointmentProduct`, `CarePlanEnrollmentVisitMedication`, `PostOpOrder(kind=MEDICATION)`, plus free-text `medications` on 3 screening models | ❌ scattered across 6 models |
| Critical findings | `RadiologyReport.criticalFinding` | ❌ never surfaced on the patient |

Also missing: documents tab is a 14-line stub
([documents-tab.tsx](../../src/features/services/patients/components/tabs/documents-tab.tsx)); no medical-alerts
banner; no weight curve on the profile; timeline omits operations, grooming, vaccinations,
nutrition, consents and invoices even though all six are `Patient` relations.

### Parent app

`petPortalDao.timeline` ([pet-portal.dao.ts:512](../../src/server/pet-portal/pet-portal.dao.ts#L512)) emits only
`APPOINTMENT` and `VACCINATION`. The contract already declares **8** kinds and the pet screen
already ships icons for all 8 — six are dead wiring. `/results` is a literal stub returning
`{ items: [] }` ([pet-portal.controller.ts:311](../../src/server/pet-portal/pet-portal.controller.ts#L311)).

---

## 1. The honest caveat of the aggregate approach

**Read this before approving.** With no new tables, the profile is only as rich as the procedures
the animal happened to undergo:

- **Allergies exist only if the pet had a radiology safety screening or a pre-anaesthetic
  assessment.** A healthy pet that only comes in for vaccinations will have an **empty allergy
  section forever** — there is nowhere in the product to record "this dog is allergic to
  penicillin" outside those two pre-procedure forms.
- **The problem list is free text.** Grouping `preliminaryDiagnosis` strings means
  `"التهاب أذن"` and `"التهاب الأذن الخارجية"` stay two separate problems. We normalise
  (trim / case / tatweel / diacritics) and match **exactly** — deliberately no fuzzy matching,
  because wrongly merging two diagnoses is worse than showing two.
- **Nothing is editable.** A vet cannot mark a problem "resolved" or dismiss a stale allergy,
  because there is no row to write to. The profile is strictly read-only and always reflects
  the source documents.

This delivers a genuinely good profile for surgical and imaging patients, and a thin one for
routine patients. The fix for both limits is the three small tables we deferred
(`PatientAllergy`, `PatientProblem`, `PatientMedication`); this plan is designed so they can be
dropped in later behind the same read API without touching any UI.

---

## 2. Phase 1 — Derivation layer (clinic server)

New file `src/server/patients/patient-clinical.dao.ts`, types added to `patients.type.ts`.
All response types stay `Prisma.XGetPayload` per AGENTS.md; derived aggregate shapes are the one
legitimate hand-written case (no schema backing) and get documented as such.

### 2.1 Medical alerts — `getPatientAlerts(patientId, clinicId)`

Union, each alert carrying `sourceCode` + `sourceDate` so the vet can trace it:

| Alert | Source |
|---|---|
| `ALLERGY` | `RadiologySafetyScreening.allergies`, `PreAnestheticAssessment.allergies` |
| `CONTRAST_REACTION` | `RadiologySafetyScreening.priorContrastReaction = true` |
| `ANAESTHETIC_RISK` | `max(PreAnestheticAssessment.asaClass) >= 3` |
| `METAL_IMPLANT` | `RadiologySafetyScreening.metalImplants` + `implantNotes` |
| `PREGNANCY` | `RadiologySafetyScreening.pregnancyPossible` |
| `CRITICAL_FINDING` | `RadiologyReport.criticalFinding = true` |
| `VACCINATION_OVERDUE` | existing due engine |

Dedup allergies by normalised text; most recent occurrence wins; keep the count.

### 2.2 Problem list — `getPatientProblems(patientId, clinicId)`

`ClinicalExam.{preliminaryDiagnosis, severity, diagnosisDescription}` across the patient's
appointments, plus `OperationCase.diagnosis`. Group by normalised text →
`{ label, occurrences, firstSeenAt, lastSeenAt, severity, sourceIds[] }`.
`occurrences >= 2` renders as **recurring**.

### 2.3 Medication history — `getPatientMedications(patientId, clinicId)`

Two classes, kept visually distinct:

- **Dispensed (factual)** — `AppointmentProduct` joined to `InventoryItem` where
  `category IN (ANTIBIOTIC, ANTI_INFLAMMATORY, HORMONE, SUPPLEMENT)`
  ([InventoryCategory](../../prisma/schema.prisma#L4983)); `CarePlanEnrollmentVisitMedication`;
  `PostOpOrder` where `kind = MEDICATION` (carries `instructions` + `dueAt`).
- **Reported (free text, owner-stated)** — `LabPreAnalytical.medications[]`,
  `RadiologySafetyScreening.medications[]`, `PreAnestheticAssessment.medications`.

Grouped by `nameSnapshot`: last given, times given, route/instructions where known.

### 2.4 Weight series — reuse `VitalSignsRecord.weight`

Already queried by the vitals tab; expose a trimmed series for the summary sparkline and the
parent app.

**Exit:** unit tests over the derivation functions with fixture rows (pure, runs in the fast CI
tier — no DB).

---

## 3. Phase 2 — Timeline expansion (clinic)

Extend `PATIENT_HISTORY_KINDS`, `patientHistorySelectShapes`, `HISTORY_KIND_META` and
`describeHistoryEntry` with six kinds: `OPERATION`, `GROOMING`, `VACCINATION`, `NUTRITION`,
`CONSENT`, `INVOICE`.

**Perf note — must be handled, not ignored:** `listHistory` currently fires 5 unbounded parallel
queries; this takes it to 11. Add a per-source `take` cap and push the date range down into the
`where` instead of filtering client-side, so an 8-year-old patient doesn't pull its whole record
to render "last 7 days".

---

## 4. Phase 3 — Clinic UI

1. **New default tab "الملف الطبي"** — alerts banner → problem list → medications → weight
   sparkline → vaccination status → 5 most recent timeline entries. Existing tabs unchanged.
2. **Alerts banner** also pinned to the profile sheet header, visible from every tab.
3. **Documents tab** — implement from `AppointmentDocument` (via the patient's appointments),
   `RadiologyAddendumAttachment`, and signed `PatientConsent`.

RTL per AGENTS.md; tokens only; verified by headless screenshot before exit.

---

## 5. Phase 4 — Portal API (curated)

### 5.1 The release gate, with no new column

`releasedToOwnerAt` does not exist (the DAO comment says so). We use the **existing workflow
status** as the release proxy: `LabTestStatus.COMPLETED` and `RadiologyStatus.COMPLETED` both sit
*after* `UNDER_REVIEW`, so a vet has signed off before an item can reach them. This honours D6
without schema change.

### 5.2 Fill the six dead timeline kinds

| Kind | Source | Gate |
|---|---|---|
| `LAB_RESULT` | `LabTestOrder` | status `COMPLETED` only |
| `RADIOLOGY` | `RadiologyOrder` + report `impression` | status `COMPLETED` only |
| `GROOMING` | `GroomingSession` | `READY` / `COMPLETED` |
| `NUTRITION` | `NutritionPlan` | not `DRAFT` |
| `INVOICE` | `Invoice` | as-is |
| `NOTE` | `PostOpOrder` (aftercare instructions) | discharged cases only |

`NOTE` maps to post-op aftercare rather than `PatientActivity` — that table is internal staff
chatter and must never reach owners.

### 5.3 `/results` — replace the stub

Completed lab + radiology, matching `releasedResultSchema` already in the parent contract.

### 5.4 New `GET /api/pet/pets/:id/summary`

Owner-safe subset only:

- ✅ allergies + contrast reaction (safety-critical — the owner must know)
- ✅ dispensed medications (they physically received them) and post-op instructions
- ✅ weight series, vaccination status, completed results
- ❌ **no** derived problem list — `preliminaryDiagnosis` is exactly what the curated choice
  excludes
- ⚠️ **open question for you:** completed operations. Date + procedure name is clearly fine;
  `OperationCase.diagnosis` is free-text clinical judgement. Default in this plan is **name and
  date only, no diagnosis text** — say the word if you want the indication included.

Per CLAUDE.md rule 12, every new endpoint ships an authorised-passes / unauthorised-403
controller test.

---

## 6. Phase 5 — Parent app (`D:\repos\elite-vet-parent`)

1. `src/api/contract.ts` — add `petSummarySchema`; extend the timeline kind enum with
   `OPERATION`, `CONSENT`.
2. `src/api/endpoints.ts` — `getPetSummary`, real `listResults`.
3. `src/features/pets/hooks/use-pets.ts` — `usePetSummary`.
4. `app/pet/[id]/index.tsx` — allergy `Callout` above the fold (the existing overdue-vaccination
   callout is the pattern), medications card, weight chart.
5. **New** `app/pet/[id]/history.tsx` — the full curated timeline with the same kind filters as
   the clinic, so the two read as one product.

---

## 7. Sequencing and risk

| Phase | Deliverable | Depends on |
|---|---|---|
| 1 | derivation DAO + tests | — |
| 2 | timeline expansion + query caps | — (parallel with 1) |
| 3 | clinic UI: summary tab, alerts banner, documents | 1, 2 |
| 4 | portal API: timeline fill, `/results`, `/summary` | 1, 2 |
| 5 | parent app contract + screens | 4 |

**Risks**

1. *Free-text grouping* — mitigated by exact-normalised matching only; accepted that near-duplicate
   diagnoses render separately.
2. *Query fan-out* — mitigated by the `take` caps and pushed-down date range in Phase 2.
3. *Sparse allergy data* — inherent to the no-new-tables decision; §1 documents it. The summary
   must render "لم تُسجَّل حساسية" and never imply "no known allergies", which would be a clinical
   claim the data does not support.
4. *Two-repo drift* — the portal contract is the seam; Phase 4 lands and is verified before
   Phase 5 starts.
5. *DB verification* — per CLAUDE.md rule 8, DB-backed tests are CI-only; the derivation tests in
   Phase 1 are deliberately pure so they run in the fast tier.
