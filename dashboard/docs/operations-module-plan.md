# Operations (Surgery) Module — Master Plan

> **Scope:** `/services/operations` — everything from suturing a small wound under local
> anesthetic to major surgery under general anesthesia.
> **Design goal:** veterinary today, **human-clinic ready tomorrow** — every clinical
> structure in this plan is species-agnostic; nothing in the module hard-codes "animal".
> **Method:** the module encodes the internationally recognized perioperative standards
> (WHO, ASA, NCEPOD, CDC, AORN, AAHA/ACVAA, Aldrete, Clavien-Dindo) as data structures and
> server-enforced gates — while a **complexity-tier pathway engine** keeps a 10-minute
> wound closure from drowning in major-surgery paperwork.

---

## 0. Where we are today

- `src/routes/_pathless-layout/services/operations.tsx` + `src/features/services/operations/`
  is a **100% placeholder**: an 8-column kanban (`SCHEDULED → PREP → ANESTHESIA → SURGERY →
  RECOVERY → DISCHARGE → FOLLOW_UP → COMPLETED`), zeroed stats, empty mock array, every
  action → `notifyPlaceholder()`. No server module, no Prisma models, no hooks.
- The placeholder already made two good decisions we keep: the **8 column IDs** (they map
  1:1 onto the perioperative phases below) and the card anatomy (patient, surgeon,
  anesthetist, room, checklist progress, urgency).
- **Nothing surgical exists in the schema.** Closest precedents to build on:
  - `RadiologyOrder → RadiologyOrderItem → RadiologyExamExecution → RadiologyReport →
    RadiologyActivity` — the proven Order→Execution→Report→Audit shape.
  - `radiology.workflow.ts` — two-level (status × stage) pure state machine with
    server-enforced exit gates and payment gating. This is our workflow template.
  - `VitalSignsRecord` — patient-owned, snapshot-immutable vitals with provenance links.
  - `RadiologySafetyScreening.asaClass` — ASA classification already has a precedent.
  - `SedationLevel` enum (`NONE | ANXIOLYSIS | SEDATION | GENERAL_ANESTHESIA`).
  - `RoomType.OPERATING` and `RoomType.ICU` — exist, unused.
  - `InventoryCategory.SURGICAL_TOOLS`, stock ledger + FEFO batches + `issueStock`.
  - `ClinicalExam.checklist*` booleans — the checklist-driven exam pattern.
  - `slot-computation.ts` + `[roomId, startsAt]` / `[staffId, startsAt]` indexes — conflict
    detection for theatre and team scheduling.

---

## 1. Vision & scope

One module, one workflow engine, every procedure class:

| Class | Example | Anesthesia | Setting |
|---|---|---|---|
| Minor | wound suturing, abscess drainage, nail avulsion | local / none / light sedation | outpatient, treatment room |
| Intermediate | castration, lump removal, dental extraction, endoscopy | sedation / short GA | day surgery |
| Major | laparotomy, orthopedic, thoracotomy, spinal | full GA, invasive monitoring | theatre + recovery ± ICU |
| Emergency (modifier) | GDV, cesarean, hemoabdomen | any | immediate, gates overridable with audit |

**In scope:** procedure catalog, case scheduling, perioperative workflow (pre-op → anesthesia
→ intra-op → recovery → discharge → follow-up), consents, safety checklists, anesthesia
record, operative note, counts, implants, specimens, consumables & stock, complications &
SSI surveillance, billing, KPIs.

**Out of scope (this module, v1):** full hospitalization/ward management (boarding, ICU
flowsheets beyond recovery), blood bank inventory, sterilization tracking of instrument
sets (autoclave cycles) — each gets a hook point but its own future module.

---

## 2. Standards baseline — every protocol, and where it lives

This table is the contract: each standard maps to a concrete structure or gate. Nothing is
"supported in spirit" — if it's listed, there is a field, table, or server gate for it.

| # | Standard / protocol | What it requires | Where it lives in the module |
|---|---|---|---|
| S1 | **WHO Surgical Safety Checklist (2009)** | 3 phases: Sign-In (before induction), Time-Out (before incision), Sign-Out (before leaving OR) | `ChecklistTemplate` (versioned, per phase, per tier) + `OperationChecklistRun` instances; server gates G4/G5/G6 |
| S2 | **ASA Physical Status Classification (I–V + E)** | Pre-anesthetic risk class on every case receiving sedation/GA | `PreAnestheticAssessment.asaClass Int (1–5)` + `asaEmergency Boolean` |
| S3 | **NCEPOD urgency classification** | Immediate / Urgent / Expedited / Elective scheduling priority | `OperationCase.urgency` enum; drives board sorting + alerts |
| S4 | **Universal Protocol (Joint Commission)** | Correct patient, correct procedure, correct site; site marking; laterality | `OperationProcedureItem.laterality/site` + mandatory Time-Out items + site-marking checklist item (tier 2+) |
| S5 | **CDC surgical wound classification** | Class I Clean / II Clean-contaminated / III Contaminated / IV Dirty | `OperationProcedureItem.woundClass` enum; feeds SSI reporting |
| S6 | **ASA / AAHA fasting guidelines** | Pre-op fasting verified & recorded (food/water times) | `PreAnestheticAssessment.lastFoodAt / lastWaterAt / fastingVerified`; gate G2 |
| S7 | **AAHA Anesthesia & Monitoring Guidelines (2020) / ACVAA monitoring standards** | Continuous monitoring under GA; vitals recorded ≥ every 5 min; dedicated anesthetist identified | `AnesthesiaRecord.monitoringIntervalMin` (default 5) + repeated `VitalSignsRecord` (`source = OPERATION`); team role `ANESTHETIST` |
| S8 | **Anesthesia record standards (ASA / AVA)** | Time-stamped drug administrations (agent, dose, route), airway details, fluids, timeline milestones | `AnesthesiaRecord` + append-only `AnesthesiaEvent` rows |
| S9 | **Antimicrobial prophylaxis (SCIP / WHO)** | Prophylactic antibiotic within 60 min before incision, documented | `AnesthesiaEvent(kind=DRUG, isProphylacticAbx)` + Time-Out item + KPI |
| S10 | **AORN counts standard** | Sponge/instrument/needle counts before closure; discrepancy escalation | `OperationCount` rows (type, initial/final, reconciled) + Sign-Out gate item |
| S11 | **Operative report standards (ACS / RCS)** | Operative note completed immediately post-op: findings, technique, EBL, complications, specimens, implants | `OperationNote` — required before case leaves RECOVERY (gate G7) |
| S12 | **Specimen chain of custody (CAP)** | Every specimen labeled, logged, tracked to pathology | `OperationSpecimen` → optional link to `LabTestOrder` |
| S13 | **Implant traceability (FDA UDI)** | Implant manufacturer, lot/serial, UDI recorded | `OperationImplant` (udi field nullable — human-ready) |
| S14 | **Aldrete / PADSS recovery scoring** | Objective score gating discharge from recovery | `RecoveryAssessment.score` (template-driven criteria, Aldrete-style 0–10) + gate G8 |
| S15 | **Pain assessment standards** (Glasgow Composite Measure Pain Scale — vet; NRS/VAS — human) | Scheduled pain scoring post-op, scale identity preserved | `VitalSignsRecord.painScore` exists; add `painScale` enum (GLASGOW_CMPS, NRS, VAS, FLACC…) |
| S16 | **Informed consent standards** (+ vet financial consent / estimate) | Signed, dated, witnessed consent per consent type; cost estimate range for vet | `OperationConsent` (typed, versioned text snapshot, signer, witness, signature); gate G1 |
| S17 | **Clavien-Dindo classification** | Standardized post-op complication grading (I–V) | `OperationComplication.clavienDindoGrade` |
| S18 | **CDC NHSN SSI surveillance** | Surgical-site infection tracking window (30 d; 90 d with implant) | `OperationComplication.isSSI` + `OperationCase.ssiSurveillanceUntil` auto-computed; FOLLOW_UP stage checks |
| S19 | **Peri-anesthetic mortality tracking** (CEPSAF — vet benchmark) | Deaths within 48 h of anesthesia captured & reviewable | `OperationComplication(kind=MORTALITY)` + M&M report |
| S20 | **Terminology / coding** (SNOMED CT, ICD-10-PCS, CPT — human; VeNom — vet) | Procedures codeable for interoperability & claims | `OperationProcedureDefinition.codes Json` (`{snomed?, cpt?, icd10pcs?, venom?}`) — nullable now, ready later |
| S21 | **Audit & record integrity** | Perioperative record is append-only once signed; every action attributed | `OperationActivity` append-only log; signed docs immutable (vitals-style `linked-immutable` rule); break-glass overrides logged |

---

## 3. The flexibility engine — complexity tiers & pathways

The single most important design decision. **One state machine, tier-scoped requirements.**
A wound suture and a thoracotomy run through the *same* engine; the tier decides which
statuses are active and which gates are mandatory.

### 3.1 Tiers

```
enum OperationTier { MINOR, INTERMEDIATE, MAJOR }
```

| | MINOR | INTERMEDIATE | MAJOR |
|---|---|---|---|
| Pathway (active statuses) | SCHEDULED → PREP → SURGERY → DISCHARGE → COMPLETED | all 8 | all 8 (+ optional ICU handoff) |
| Anesthesia column | skipped (merged into SURGERY) | active | active |
| Recovery column | skipped (optional) | active, short | active, scored |
| Consent (G1) | ✔ required | ✔ | ✔ |
| Fasting check (G2) | only if sedation planned | ✔ | ✔ |
| Pre-anesthetic assessment + ASA (G3) | only if sedation/GA | ✔ | ✔ |
| WHO checklist | single combined abbreviated template | full 3-phase | full 3-phase |
| Anesthesia record | only if sedation/GA used | ✔ | ✔ (interval ≤ 5 min) |
| Counts (S10) | optional (config) | ✔ | ✔ |
| Operative note (G7) | short form | full | full |
| Recovery score (G8) | — | ✔ | ✔ |

### 3.2 How it's wired

- `OperationProcedureDefinition.defaultTier` — every catalog procedure carries a default.
- A case's tier = **max tier of its procedure items** (a lump removal added to a
  laparotomy doesn't lower the bar), overridable per case **upward only** without audit,
  downward only with a mandatory reason (logged to `OperationActivity`).
- `operations.workflow.ts` exports `pathwayFor(tier, { sedationPlanned })` →
  `{ activeStatuses, requiredGates }`. Pure function, tested, shared client+server —
  exactly the `radiology.workflow.ts` pattern.
- Clinic-level overrides (e.g. "we require counts even for minor") live in the existing
  `ClinicProtocols` model — read at gate-evaluation time, never hard-coded.
- Checklist content is data, not code: `ChecklistTemplate` rows (versioned, per
  phase × tier, seeded with WHO defaults, editable per clinic later). A case snapshots the
  template version it ran — edits to templates never rewrite history.
- **Emergency break-glass:** a case with `urgency = IMMEDIATE` may force-advance past any
  gate; the server requires an `overrideReason`, stamps who/when into `OperationActivity`,
  and the case is flagged in compliance reports. Safety gates must never make emergency
  surgery impossible — but every bypass is visible forever.

---

## 4. Data model

Repo conventions apply throughout: camelCase columns, `@@map` snake_case tables, `cuid()`
PKs, `code` via `generateUniqueCode` (prefix `OP`), tenant = `clinicId`, money
`Decimal`, soft delete (`isDeleted/deletedAt`) where user-facing. All new enums in Prisma.

### 4.1 Catalog & templates (the configuration layer)

> **As built in OP0 (repo conventions won):** the catalog is NOT a standalone priced
> table — it overlays the existing `Service` tree exactly like `RadiologyExamDefinition`:
> the procedure's name lives on the `Service` ITEM (global category `العمليات الجراحية`,
> flagged `Service.isOperationCategory`), price/duration/activation live on
> `ClinicServiceConfig`, and the definition below holds only the surgical metadata,
> upserted per `(clinicId, serviceId)`. A service without a definition is treated as
> `INTERMEDIATE` (`effectiveTier` + `tierInferred`) — reduced safety requirements are
> never inferred from absence.

```prisma
model OperationProcedureDefinition {
  id                String   @id @default(cuid())
  clinicId          String
  serviceId         String            // → Service ITEM under the operations category
  defaultTier       OperationTier @default(INTERMEDIATE)
  defaultAnesthesia SedationLevel @default(GENERAL_ANESTHESIA) // safest default
  defaultWoundClass WoundClass?
  bodySystem        String?           // grouping for pickers
  requiresLaterality Boolean @default(false)
  codes             Json?             // { snomed?, cpt?, icd10pcs?, venom? }  (S20)
  specializationId  String?           // required surgeon specialization
  kitItems          OperationKitItem[]  // default consumables
  prepNotes         String?
  active            Boolean @default(true)
  @@unique([clinicId, serviceId])
}

model OperationKitItem {           // default consumables per procedure
  definitionId    String
  inventoryItemId String
  quantity        Int
}

model ChecklistTemplate {          // generic — surgical first, reusable later
  id        String @id @default(cuid())
  clinicId  String
  scope     ChecklistScope   // OPERATION_SIGN_IN | OPERATION_TIME_OUT | OPERATION_SIGN_OUT | OPERATION_MINOR_COMBINED
  tier      OperationTier?   // null = all tiers
  version   Int              // bump on edit; runs snapshot the version
  active    Boolean
  items     ChecklistTemplateItem[]  // ordered; textAr/textEn, required, responseType (CONFIRM | YES_NO_NA | TEXT | NUMBER)
}
```

Seed data (migration-shipped per the seed-defaults rule): WHO 2009 checklist items for the
three phases, an abbreviated minor-procedure combined template, and a starter procedure
catalog (common vet procedures with tiers).

### 4.2 The case (core aggregate)

```prisma
model OperationCase {
  id            String @id @default(cuid())
  code          String @unique            // OP-XXXX
  clinicId      String
  branchId      String
  patientId     String                    // patient-owned (radiology pattern)
  ownerId       String
  appointmentId String?                   // optional visit link (SetNull)
  status        OperationStatus @default(SCHEDULED)
  stage         OperationStage?           // sub-stage within status (two-level machine)
  tier          OperationTier
  tierOverrideReason String?
  urgency       OperationUrgency @default(ELECTIVE)  // IMMEDIATE|URGENT|EXPEDITED|ELECTIVE (S3)
  scheduledAt   DateTime?
  estimatedDurationMin Int
  roomId        String?                   // RoomType.OPERATING (validated)
  diagnosis     String?                   // indication
  clinicalSummary String?
  ssiSurveillanceUntil DateTime?          // set at completion (S18): +30d, +90d if implant
  cancelReason  String?  cancelKind OperationCancelKind?   // patient/clinic/clinical — feeds KPI
  ...timestamps, isDeleted

  procedures    OperationProcedureItem[]
  team          OperationTeamMember[]
  consents      OperationConsent[]
  assessment    PreAnestheticAssessment?
  checklistRuns OperationChecklistRun[]
  anesthesia    AnesthesiaRecord?
  note          OperationNote?
  counts        OperationCount[]
  implants      OperationImplant[]
  specimens     OperationSpecimen[]
  consumables   OperationConsumable[]
  recovery      RecoveryAssessment[]
  postOpOrders  PostOpOrder[]
  complications OperationComplication[]
  activity      OperationActivity[]
  comments      OperationComment[]
  invoice       Invoice?                  // 4th invoice parent slot
  vitals        VitalSignsRecord[]        // via new provenance operationId
  documents     OperationDocument[]       // photos, files (AppointmentDocument pattern)
}

model OperationProcedureItem {            // multi-procedure per case
  caseId        String
  definitionId  String
  nameSnapshot  String                    // catalog may change; case must not
  priceSnapshot Decimal @db.Decimal(10, 2)
  laterality    Laterality?               // LEFT|RIGHT|BILATERAL|NA (S4)
  site          String?                   // free-text site, e.g. "left forelimb, distal radius"
  woundClass    WoundClass?               // CLEAN|CLEAN_CONTAMINATED|CONTAMINATED|DIRTY (S5)
  performed     Boolean @default(false)   // planned vs actually performed (note reconciles)
}

model OperationTeamMember {
  caseId  String
  staffId String
  role    OperationTeamRole  // PRIMARY_SURGEON|ASSISTANT_SURGEON|ANESTHETIST|ANESTHESIA_TECH|SCRUB_NURSE|CIRCULATOR|OBSERVER
  @@unique([caseId, staffId, role])
}
```

`OperationStatus` = the 8 existing column IDs + `CANCELLED`. `OperationStage` gives
sub-steps where a column has internal order (PREP: `CONSENT → FASTING → ASSESSMENT →
PREMED`; SURGERY: `TIME_OUT → IN_PROGRESS → CLOSING → SIGN_OUT`) — same two-level shape as
`RadiologyStatus × RadiologyStage`.

### 4.3 Pre-op

```prisma
model PreAnestheticAssessment {          // one per case (S2, S6, S7)
  caseId          String @unique
  asaClass        Int?                   // 1–5 (S2)
  asaEmergency    Boolean @default(false)
  lastFoodAt      DateTime?  lastWaterAt DateTime?  fastingVerified Boolean
  vitalsRecordId  String?                // immutable snapshot (vitals pattern)
  physicalFindings String?
  airwayAssessment String?               // Mallampati etc. — nullable, human-ready
  medications     String?  allergies String?
  bloodworkReviewed Boolean  imagingReviewed Boolean   // pre-op workup gates
  labOrderId      String?  radiologyOrderId String?    // links to actual pre-op orders
  riskNotes       String?
  premedPlan      String?
  assessedById    String?  assessedAt DateTime?
}

model OperationConsent {                 // dedicated model — S16 (first in the app)
  id         String @id @default(cuid())
  caseId     String
  type       ConsentType    // SURGICAL | ANESTHESIA | BLOOD_PRODUCTS | EUTHANASIA | FINANCIAL_ESTIMATE
  textSnapshot String                    // full text as shown; template edits never rewrite
  estimateLow  Decimal?  estimateHigh Decimal?   // vet financial consent
  signerName   String    signerRelationship String?
  signatureMethod SignatureMethod  // DRAWN | TYPED | UPLOADED | VERBAL_WITNESSED
  signatureUrl String?
  witnessStaffId String?
  signedAt   DateTime?
  revokedAt  DateTime?  revokeReason String?
}
```

Consent rows are **immutable once signed** (vitals `linked-immutable` rule): corrections =
revoke + new consent.

### 4.4 Checklists (S1, S4, S10)

```prisma
model OperationChecklistRun {
  id          String @id @default(cuid())
  caseId      String
  scope       ChecklistScope
  templateId  String   templateVersion Int    // snapshot
  items       OperationChecklistItemRun[]     // itemTextSnapshot, response, respondedById, respondedAt
  completedAt DateTime?
  completedById String?
  @@unique([caseId, scope])
}
```

Each item response is individually attributed (who confirmed, when) — this is what makes
the checklist an auditable record rather than a tick-box.

### 4.5 Intra-op

```prisma
model AnesthesiaRecord {                 // one per case (S7, S8)
  caseId        String @unique
  planned       SedationLevel            // reuse enum
  actual        SedationLevel?
  airway        String?  ettSize String?  circuit String?
  ivAccess      String?                  // site/gauge
  monitoringIntervalMin Int @default(5)  // S7
  // timeline milestones (all nullable DateTime, stamped as they happen):
  premedAt, inductionAt, incisionAt, closureAt, endAnesthesiaAt, extubationAt
  anesthetistId String?
  events        AnesthesiaEvent[]
}

model AnesthesiaEvent {                  // append-only intra-op log (S8, S9)
  id        String @id @default(cuid())
  recordId  String
  at        DateTime
  kind      AnesthesiaEventKind  // DRUG | FLUID | EVENT | NOTE | POSITION | ABX_PROPHYLAXIS
  inventoryItemId String?              // drug from inventory when applicable
  agentName String?  dose Decimal? @db.Decimal(10,3)  doseUnit String?  route DrugRoute?
  detail    String?
  recordedById String
}
```

**Intra-op vitals are `VitalSignsRecord` rows** with a new provenance `operationId?` and
new `VitalSignsSource.OPERATION` — reusing the entire existing vitals stack (charts,
freshness, immutability). The anesthesia sheet UI is a time axis merging
`AnesthesiaEvent` + vitals series.

```prisma
model OperationNote {                    // operative report — S11
  caseId       String @unique
  proceduresPerformed String             // reconciles planned vs performed
  findings     String   technique String
  estimatedBloodLossMl Int?
  complicationsNarrative String?
  closureDetails String?
  drainsPlaced String?
  signedById   String?  signedAt DateTime?    // immutable once signed (S21)
}

model OperationCount   { caseId, type CountType /* SPONGE|NEEDLE|INSTRUMENT */, initialCount Int?, finalCount Int?, reconciled Boolean, discrepancyNote String?, countedById, verifiedById }   // S10
model OperationImplant { caseId, name, manufacturer?, lotNumber?, serialNumber?, udi?, site?, inventoryItemId?, batchId? }   // S13
model OperationSpecimen{ caseId, label, description?, containerCount Int, sentToLabAt?, labOrderId? }   // S12
model OperationConsumable { caseId, inventoryItemId?, nameSnapshot, quantity, batchId?, priceSnapshot, billable Boolean, issuedAt DateTime? }   // stock + billing; issuedAt prevents double-issue (AppointmentProduct pattern)
```

### 4.6 Recovery, post-op, follow-up

```prisma
model RecoveryAssessment {              // repeated rows — S14, S15
  caseId     String
  at         DateTime
  score      Int?                       // Aldrete-style 0–10 (criteria template-driven)
  painScale  PainScale?  painScore Int?  // S15: GLASGOW_CMPS | NRS | VAS | FLACC | OTHER
  notes      String?
  assessedById String
}

model PostOpOrder {                     // discharge & aftercare orders
  caseId    String
  kind      PostOpOrderKind   // MEDICATION | MONITORING | FEEDING | ACTIVITY | WOUND_CARE | FOLLOW_UP | SUTURE_REMOVAL
  inventoryItemId String?               // for meds
  instructionsAr String  instructionsEn String?
  dueAt     DateTime?                   // suture removal / recheck target
  followUpAppointmentId String?         // auto-created appointment link
}

model OperationComplication {           // registry — S17, S18, S19
  caseId    String
  phase     ComplicationPhase  // INTRA_OP | RECOVERY | POST_OP
  clavienDindoGrade ClavienDindo?  // I|II|IIIA|IIIB|IVA|IVB|V (post-op only)
  isSSI     Boolean @default(false)
  kind      String              // coded later; free text v1
  occurredAt DateTime  detail String?
  reportedById String
}
```

### 4.7 Shared plumbing (existing patterns, new members)

- `OperationActivity` — append-only audit log, `RadiologyActivity` clone (event enum:
  CREATED, STATUS_CHANGED, STAGE_CHANGED, GATE_OVERRIDDEN, CONSENT_SIGNED,
  CHECKLIST_COMPLETED, TEAM_CHANGED, NOTE_SIGNED, …).
- `OperationComment` + `OperationCommentMention` — radiology clone (the card already has a
  comments affordance).
- `OperationDocument` — `AppointmentDocument` clone (wound photos before/after, referral
  letters).
- Enum additions to existing types: `InboxItemType.OPERATION`, `VitalSignsSource.OPERATION`,
  `StockVoucherType` reuse (`ISSUE` with `voucherId = caseId`), `Invoice.operationId?
  @unique` as the 4th polymorphic parent.

---

## 5. Workflow state machine

`src/server/operations/operations.workflow.ts` — pure, DB-free, shared client+server,
fully unit-tested (`operations.workflow.test.ts`). Mirrors `radiology.workflow.ts`.

### 5.1 Statuses (board columns) and transitions

```
SCHEDULED → PREP → ANESTHESIA → SURGERY → RECOVERY → DISCHARGE → FOLLOW_UP → COMPLETED
     └──────┴────────┴─────────────┴─── → CANCELLED (with cancelKind + reason)
```

- Tier pathway masks inactive statuses (MINOR skips ANESTHESIA and RECOVERY): the board
  renders only active columns for a card's tier; the workflow rejects transitions into
  masked statuses.
- One step forward at a time; single-step undo pairs (appointments `UNDO_TRANSITIONS`
  pattern) that never cross a signed-document boundary (can't undo out of SURGERY once the
  Sign-Out checklist is complete).
- `CANCELLED` reachable until SURGERY starts (incisionAt set); after that, abandonment is
  documented in the operative note, not a cancel.

### 5.2 Gates (server-enforced at transition time — the safety core)

| Gate | Transition blocked | Condition | Tiers |
|---|---|---|---|
| G1 | leave PREP | all required `ConsentType`s signed (SURGICAL always; ANESTHESIA when sedation/GA; FINANCIAL_ESTIMATE per clinic setting) | all |
| G2 | leave PREP | `fastingVerified` (with recorded times) | sedation/GA planned |
| G3 | leave PREP | `PreAnestheticAssessment` complete + `asaClass` set | INTERMEDIATE+ |
| G4 | enter ANESTHESIA (or SURGERY for MINOR) | Sign-In checklist run complete | all (abbreviated for MINOR) |
| G5 | stamp `incisionAt` / stage → IN_PROGRESS | Time-Out checklist complete, all team roles present (PRIMARY_SURGEON + ANESTHETIST for GA) | INTERMEDIATE+ |
| G6 | leave SURGERY | Sign-Out complete: counts reconciled (or discrepancy documented + escalated), specimens labeled | INTERMEDIATE+ (counts per config) |
| G7 | leave RECOVERY (or SURGERY for MINOR) | `OperationNote` signed | all (short form for MINOR) |
| G8 | → DISCHARGE | latest `RecoveryAssessment.score` ≥ clinic threshold | INTERMEDIATE+ |
| G9 | → FOLLOW_UP | discharge instructions (`PostOpOrder`s) issued & printed/sent | all |
| G10 | leave SCHEDULED (config) | payment/deposit gate — same mechanism as `isRadiologyPaymentGatedStatus` | per clinic setting |

Every gate failure returns `422` with an Arabic message naming exactly what's missing.
**Break-glass:** `urgency = IMMEDIATE` cases may pass any gate with `overrideReason`;
logged as `GATE_OVERRIDDEN` activity; surfaced in the compliance report. (S21)

### 5.3 Scheduling & conflicts

- Theatre: `roomId` must be `RoomType.OPERATING` (MINOR may use `EXAMINATION` per config);
  overlap check against `[roomId, startsAt]` for `scheduledAt + estimatedDurationMin`,
  409 with conflicting case codes (appointments `AppointmentsConflictError` pattern).
- Team: surgeon + anesthetist overlap checks via `[staffId, startsAt]`-style queries
  across both operations and appointments; reuse `slot-computation.ts` for free-slot
  suggestions.
- Urgency ordering: `IMMEDIATE` bypasses conflict *blocking* (warns instead) — you never
  refuse to book emergency surgery over a calendar clash.

---

## 6. Integration map (existing modules)

| Module | Integration |
|---|---|
| **Vital signs** | New provenance `operationId` + `VitalSignsSource.OPERATION`. Pre-op snapshot on assessment; intra-op series (≤ 5 min); recovery series. Reuse `vitals-charts`, `vitals-latest-strip`, immutability rules unchanged. |
| **Invoicing** | 4th parent slot `Invoice.operationId? @unique`; `operations-invoice.service.ts` mirrors `radiology-invoice.service.ts`. Line items = `OperationProcedureItem.priceSnapshot` + billable `OperationConsumable`s + implants. Estimate range lives on FINANCIAL_ESTIMATE consent; deposit gating via G10. |
| **Stock** | `OperationConsumable.issuedAt` + `issueStock(tx, { voucherType: "ISSUE", voucherId: caseId })` at case closure (leave SURGERY), FEFO batch, full-quantity deduction, double-issue guarded — exact `AppointmentProduct` mechanics, but issuance decoupled from payment (consumed is consumed). |
| **Accounting** | Nothing direct in v1. The clinic `Invoice` adapter planned at accounting P5 covers operation invoices automatically since they are standard invoices. |
| **Appointments** | Optional `appointmentId` origin link ("refer to surgery" action from a visit). Follow-up: completing DISCHARGE auto-creates a follow-up `Appointment` (and suture-removal `PostOpOrder.dueAt` reminder). |
| **Lab / Radiology** | Pre-op workup: create/link `LabTestOrder` / `RadiologyOrder` from the assessment; `bloodworkReviewed`/`imagingReviewed` flags feed Sign-In. Specimens → histopath `LabTestOrder`. |
| **Rooms** | `RoomType.OPERATING` finally used; theatre occupancy service mirrors `radiology-machines.service.ts` but on the real `Room` table. |
| **Staff** | Team roles; surgeon specialization check against `OperationProcedureDefinition.specializationId`; working-hours conflicts. |
| **Inbox / notifications** | `InboxItemType.OPERATION`: T-24 h fasting reminder to owner-facing channels (future), day-of schedule to team, gate-blocked alerts, SSI-window follow-up nudges. |
| **Tasks** | Optional: post-op orders can spawn `Task`s for ward staff (config, v2). |
| **Care plans** | Staged procedures (e.g. multi-stage orthopedic) can enroll into a `CarePlan`; not required v1. |
| **ClinicProtocols** | Hosts clinic-level pathway/gate overrides (counts for minor, recovery threshold, deposit %). |

---

## 7. Server module layout & API surface

`src/server/operations/` — repo 4-file convention + workflow/service files:

```
operations.controller.ts     operations.model.ts      operations.dao.ts
operations.type.ts           operations.workflow.ts   operations.workflow.test.ts
operations-invoice.service.ts  operations-stock.service.ts
```

plus `src/server/operation-procedures/` (catalog CRUD — mirrors `radiology-exams/`).

Representative routes (all `requireClinic: true`, Arabic errors, DAO string-union errors →
controller message map):

```
GET    /operations                     list (status, period, view=all|for-me, urgency, roomId, q)
GET    /operations/stats               board header stats
POST   /operations                     create case (procedures[], team[], scheduledAt, roomId)
GET    /operations/:id                 full aggregate
PATCH  /operations/:id/status          gated transition (+ overrideReason)
PATCH  /operations/:id/stage           sub-stage step
PATCH  /operations/:id/schedule        reschedule (conflict-checked)
POST   /operations/:id/team            add/remove members
POST   /operations/:id/consents        create; POST /consents/:cid/sign; /revoke
PUT    /operations/:id/assessment      upsert pre-anesthetic assessment
POST   /operations/:id/checklists/:scope/start | /items/:itemId/respond | /complete
PUT    /operations/:id/anesthesia      upsert record; POST /anesthesia/events (append-only)
PUT    /operations/:id/note            upsert; POST /note/sign (locks)
POST   /operations/:id/counts | /implants | /specimens | /consumables
POST   /operations/:id/recovery        append recovery assessment
POST   /operations/:id/post-op-orders  + /discharge (issues G9, creates follow-up appt)
POST   /operations/:id/complications
GET    /operations/:id/activity        audit trail
POST   /operations/:id/comments        (+ mentions)
GET    /operations/theatres/availability
GET    /operations/metrics             KPI aggregates (§9)
```

Intra-op vitals go through the **existing** `POST /vital-signs` with
`attachTo: { type: "OPERATION", id }`.

---

## 8. UI plan (build on the existing scaffold — don't rebuild)

The placeholder's structure survives; its mock layer is replaced:

1. **Types** — `types/operations.types.ts` swaps hand-declared shapes for Prisma-derived
   (`Prisma.OperationCaseGetPayload`) per the header comment already in that file.
2. **Board** — real `useQuery` hooks; drag calls `PATCH /:id/status` and **renders the 422
   gate message as the drop-rejection toast** (the gate system doubles as UX guidance:
   "لا يمكن النقل — الموافقة الجراحية غير موقعة"). Columns masked by tier.
3. **Case sheet** (new, the main workspace) — radiology order-sheet pattern: tabs per
   phase: نظرة عامة / التحضير (consents, assessment, fasting) / قائمة الأمان (checklist
   runner with per-item confirm) / التخدير (anesthesia sheet: timeline of events + vitals
   chart, quick-add drug/fluid/event, milestone stamps) / العملية (note, counts, implants,
   specimens, consumables) / الإفاقة (recovery scores, pain) / الخروج والمتابعة (orders,
   discharge, complications) / النشاط والتعليقات.
4. **Create wizard** — patient → procedures (catalog picker, tier auto-derived) → team →
   schedule (theatre availability + conflict warnings) → estimate/consent prep.
5. **Alerts strip** — real: gate-blocked cases, fasting due, overdue Time-Out, SSI-window
   follow-ups, count discrepancies.
6. **Printables** — anesthesia record, operative note, discharge instructions (Arabic RTL
   print CSS) — legal documents must leave the screen.
7. **Checklist runner UX** — full-screen modal, one item at a time confirmable by tap,
   shows confirmer avatar per item; must be usable on a tablet in the theatre.
8. **Design system** — existing components only; kanban, `Stats`, `TableToolbar`,
   `FormFooter`, `TablePagination`; header/footer bar conventions (px-4 py-2); Radix
   Select with `position="popper"`; RTL rules per AGENTS.md.

---

## 9. Reporting & KPIs (`GET /operations/metrics`)

Operational: theatre utilization %, on-time first-case starts, turnover time, day-of
cancellation rate (by `cancelKind`), average case duration vs estimate (feeds better
estimates).
Safety/compliance: checklist completion rate (by phase), gate-override count (break-glass
review list), antibiotic-prophylaxis timing compliance (S9), count-discrepancy incidents.
Clinical outcome: complication rate by tier & wound class, Clavien-Dindo distribution, SSI
rate within surveillance window (S18), peri-anesthetic mortality ≤ 48 h (S19), average
recovery time to discharge-ready.
Delivery: stats strip (real), metrics tab (charts per dataviz conventions), monthly M&M
export.

---

## 10. Non-functional requirements

- **N1 Record integrity (S21):** activity log append-only; signed consents/notes/checklist
  runs immutable (corrections are new linked records — vitals correction-chain pattern).
- **N2 Transactions:** every status transition + its side effects (stock issue, invoice
  creation, follow-up appointment) in one DB transaction.
- **N3 Permissions:** gate signing restricted by `StaffRole.permissions` (e.g. only the
  anesthetist role completes Sign-In anesthesia items); v1 minimum: signer identity always
  captured; role enforcement per clinic config.
- **N4 Bilingual/RTL:** all new UI strings via i18n keys under `operations.*` in
  `src/locales/{ar,en}/translation.json` (see D1 below — this diverges from the
  hardcoded-Arabic precedent deliberately). Portaled Radix content gets explicit `dir`.
- **N5 Print fidelity:** anesthesia record and operative note printable A4, RTL.
- **N6 No local DB:** all migrations authored via `prisma migrate diff`, verified in CI
  (repo standing rule). Seeds ship as migrations.
- **N7 Species-agnostic core:** no module table references `AnimalType`; weight-based
  dosing fields are unit-explicit; pain scales and checklist content are data, not code.

---

## 11. Human-clinic readiness (what makes this portable)

Already handled by design: ASA (S2), NCEPOD (S3), Universal Protocol laterality (S4), CDC
wound classes (S5), WHO checklist (S1), Aldrete (S14), Clavien-Dindo (S17), NHSN SSI
windows (S18), UDI implants (S13), terminology code slots (S20), airway/Mallampati field
(§4.3), pluggable pain scales (S15), consent typing incl. blood products (S16).
Explicitly deferred to a "human profile" phase: insurance/claims (CPT billing), blood bank
integration, WHO safe childbirth variants, radiation safety in OR, staff credentialing
(privileging). None require schema rework — only new rows/templates and additional
modules; that is the test the schema was designed against.

---

## 12. Implementation phases

One phase = one PR train; **a phase is done only when its acceptance checks pass and CI is
green.** Order is dependency-driven; each phase ships something usable.

**OP0 — Foundations (schema + catalog + engine skeleton).** ✅ **shipped 2026-08-10**
(branch `feat/operations-op0-catalog`). Enums, `OperationProcedureDefinition` + kit
(Service-overlay form — see §4.1 note), `ChecklistTemplate`(+items) with WHO 2009 seed
migration (`20260810130000_operations_catalog_and_checklists` — global system templates,
`clinicId NULL`) + starter surgical services catalog, `operations.workflow.ts`
(pathways, transitions, stages, gates G1–G10, break-glass, urgency rules; 33 tests),
`operation-procedures` server module, catalog UI (ServicesTable `operations` scope +
definition sheet + branch settings page `/management/settings/branch/:id/operations/catalog`).
*Accept:* migrations green in CI; workflow tests cover the tier×transition×gate matrix;
catalog CRUD works. *Note:* settings UI follows the surrounding hardcoded-Arabic
precedent; the `operations.*` i18n namespace (D1) starts with the OP1 module screens.

**OP1 — Case management + live board.** ✅ **shipped 2026-08-10**
`OperationCase` + procedures + team, create wizard, scheduling with theatre/staff conflict
409s, status/stage endpoints with transition enforcement (gates stubbed permissive),
activity log, board wired to real data (stats, alerts skeleton, for-me view), sheet with
overview tab. Replace every `notifyPlaceholder`.
*Accept:* create → appears on board; illegal drag rejected server-side with Arabic toast;
double-booked theatre 409s; activity trail records everything.

**OP2 — Pre-op safety (G1–G4).** ✅ **shipped 2026-08-10**
Consents (sign/revoke/immutability, financial estimate), pre-anesthetic assessment (+ASA,
fasting, vitals snapshot, lab/radiology links), Sign-In checklist runner, gates G1–G4
enforced incl. tier masking + break-glass, alerts strip real.
*Accept:* INTERMEDIATE case cannot leave PREP unsigned/unfasted/unassessed; MINOR case
skips G2/G3 unless sedation planned; IMMEDIATE override works and is logged.

**OP3 — Intra-op record (G5–G7).** ✅ **shipped 2026-08-10**
Anesthesia record + append-only events, intra-op vitals (`VitalSignsSource.OPERATION` +
provenance), anesthesia-sheet UI (timeline + chart), Time-Out & Sign-Out runners, counts,
implants, specimens, operative note + signing lock, gates G5–G7.
*Accept:* incision cannot be stamped before Time-Out; SURGERY cannot be left with
unreconciled counts (undocumented); note signing freezes it; vitals chart renders the
intra-op series.

**OP4 — Recovery & discharge (G8–G9).** ✅ **shipped 2026-08-10**
Recovery assessments (score + pain scales), post-op orders, discharge flow (instructions
printable, follow-up appointment auto-created, suture-removal reminder), gates G8–G9.
*Accept:* below-threshold score blocks discharge; discharging creates the linked follow-up
appointment; printable discharge sheet renders RTL.

**OP5 — Billing & stock.** ✅ **shipped 2026-08-10**
`Invoice.operationId` slot + invoice service, consumables capture (kit prefill from
catalog) + `issueStock` on SURGERY exit with double-issue guard, deposit gate G10 (config),
implant batch linkage.
*Accept:* closing a case with consumables writes exactly one `StockLedgerEntry` set;
re-running the transition does not double-issue; invoice totals = procedures + billable
consumables; payment flows equal the radiology invoice behavior.

**OP6 — Follow-up, complications & inbox.** ✅ **shipped 2026-08-11**
Complication registry (Clavien-Dindo, SSI flag), SSI surveillance window auto-set +
FOLLOW_UP-stage prompts, `InboxItemType.OPERATION` notifications (fasting reminder, day-of
schedule, gate-blocked, SSI checks), comments + mentions.
*Accept:* completing an implant case sets a 90-day window; the window generates follow-up
prompts; mentions notify.

**OP7 — Analytics & compliance.** ✅ **shipped 2026-08-11**
`/operations/metrics`, metrics tab charts, break-glass review list, M&M monthly export.
*Accept:* every §9 KPI computes from seeded fixture data with verified numbers.

**OP8 — Hardening & configurability.** ✅ **shipped 2026-08-11**
Clinic checklist-template editor (versioning UI), `ClinicProtocols` gate-override settings
UI, role-based gate signing (N3 full), print polish, load/perf pass on board queries.
*Accept:* editing a template never alters historical runs; per-clinic overrides
demonstrably change gate behavior.

---

## 13. Decisions needed before OP0 (do not start without answers)

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | i18n | (a) hardcoded Arabic like lab/radiology precedent (b) proper `operations.*` keys | **(b)** — this module is the "high standards" flagship and the human-clinic pitch is bilingual; precedent is a bug, not a rule |
| D2 | Billing shape | (a) standalone operation invoice (radiology pattern) (b) section inside a visit invoice | **(a)** — surgery rarely fits a visit invoice; keeps `invoice-sections.ts` untouched |
| D3 | Payment gating default | deposit before leaving SCHEDULED for ELECTIVE? on/off default | **off by default**, per-clinic setting (G10) |
| D4 | Recovery ward vs hospitalization | keep RECOVERY inside this module and defer a ward/ICU module, or build admission now | **defer** — hook = handoff action that flags `AppointmentStatus.HOSPITALIZED` + `RoomType.ICU`; ward flowsheets are their own module |
| D5 | Anesthesia drug source | (a) `InventoryItem` only (b) separate formulary table | **(a)** with nullable `inventoryItemId` + free-text fallback — a formulary can come later without rework |
| D6 | Consent signature capture | drawn (canvas) / typed / uploaded scan / verbal-witnessed | support **all four** as `SignatureMethod`; start UI with drawn + uploaded |
| D7 | Counts for MINOR tier | mandatory / off / per-clinic | **per-clinic** (`ClinicProtocols`), default off |
| D8 | Who may complete checklist items | any staff v1 vs role-enforced v1 | identity-capture v1, role enforcement at OP8 |

---

*Standards referenced: WHO Surgical Safety Checklist (2009); ASA Physical Status
Classification; NCEPOD Classification of Intervention; Joint Commission Universal
Protocol; CDC Surgical Wound Classification & NHSN SSI surveillance; ASA/AAHA fasting
guidance; AAHA Anesthesia & Monitoring Guidelines (2020); ACVAA monitoring standards;
AORN counts standard; ACS/RCS operative-report standards; CAP specimen handling; FDA UDI;
Aldrete/PADSS recovery scoring; Glasgow Composite Measure Pain Scale; Clavien-Dindo
classification; CEPSAF peri-anesthetic mortality benchmark; SNOMED CT / CPT / ICD-10-PCS /
VeNom terminologies.*
