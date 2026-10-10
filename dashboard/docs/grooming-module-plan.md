# Grooming (التجميل) Module — Master Plan

> **Status:** proposal — awaiting the §15 decisions before GR0 starts.
> **Route today:** `/care/grooming` is a stub (`src/routes/_pathless-layout/care.$slug.tsx`
> renders `SidebarPage` with the title «التجميل» and nothing else).
> **Governing conventions:** `AGENTS.md` (4-file server resources, Prisma-derived types,
> RTL rules, forms), `docs/DESIGN_SYSTEM_CONTRACT.md` (UI law), and the module-plan
> precedent set by `docs/operations-module-plan.md`.

---

## 0. Where we are today

| Piece | State |
|---|---|
| `/care/grooming` route | placeholder — title + description only |
| Sidebar entry | exists (`IconScissors`, under «الرعاية»), i18n keys `sidebar.items.grooming` present AR+EN |
| `Service` tree | has `isLabCategory` / `isRadiologyCategory` / `isOperationCategory` overlay flags; **no grooming flag** |
| `AnimalStrain` | already carries `hairType` (`HairType`), `activityLevel`, `groomingNeeds` — **unused by any feature today** |
| `Patient` | already carries `coat`, `microchipNumber`, `weight`, `birthDate` |
| `RoomType` | `EXAMINATION / LABORATORY / WAITING / OPERATING / VACCINATION / ICU` — **no grooming station** |
| `ConsentType` | 11 types incl. `BOARDING`; **no grooming waiver** |
| `Invoice` | one-of `appointmentId / labOrderId / radiologyOrderId / operationId` — **no grooming slot** |
| Ledger | `clinic-invoice.adapter.ts` posts any `Invoice` row generically ⇒ a grooming invoice inherits accounting for free |
| Reusable plumbing | `uploads` (S3 presign), `SopTemplate/SopRun`, `ChecklistTemplate`, `PatientConsent`, `VitalSignsRecord`, `StockLedgerEntry`, `InboxItem`, `public-bookings`, `staff-services`, `notifications` |

So: everything the module needs as *substrate* exists; nothing grooming-specific does.
Two data points already in the schema (`AnimalStrain.hairType` / `groomingNeeds`) show the
original intent and are exactly the inputs the pricing engine needs.

---

## 1. Vision & scope

**One sentence:** grooming in a veterinary clinic is not a salon bolted onto a PIMS — it is
the most frequent hands-on-the-whole-animal touchpoint the clinic has, so the module must run
the salon *operationally* (booking, pricing, capacity, photos, retention) **and** harvest it
*clinically* (health screening, findings, incidents, escalation to care).

### In scope (v1)

1. Grooming service catalog with a **size × coat × breed pricing & duration matrix**.
2. A persistent **groom card per pet** (clipper plan, shampoo, behavior, sensitivities, interval).
3. A **grooming session** aggregate with a board, its own state machine and **server-enforced safety gates**.
4. **Intake screening** (matting grade, parasites, skin/ear/nail condition, behavior score, vaccination check).
5. **Execution record**: steps, products consumed (stock), before/after photos, incidents.
6. **Clinical bridge**: findings → patient record → referral appointment / lab order.
7. **Report card** (printable + shareable) with one-tap rebooking, and interval-based recall.
8. **Billing**: own invoice slot, add-ons and surcharges, deposits, groomer commission feed.
9. **Capacity-aware scheduling** — groomer minutes, station, and the real bottleneck: **drying slots**.
10. Analytics: revenue/groomer, utilization, attach rate, rebook rate, incident rate, **findings-to-visit conversion**.

### Out of scope (v1 — named so nobody assumes them)

- **Boarding / daycare / hotel.** Adjacent and tempting (`ConsentType.BOARDING` and the two
  boarding registration forms in `docs/consents/` already exist), but it is a lodging module
  with its own occupancy model. Grooming ships first; the session model is designed so a
  boarding stay can later *contain* grooming sessions (D11).
- **Mobile grooming route optimization** (MoeGo's flagship). `AppointmentLocation.HOME_VISIT`
  exists; v1 records location only. Routing is post-v1.
- **Retail POS at the counter** — `Sale`/`SaleItem` already exist; grooming links to them, does not rebuild them.
- **Sedated grooming as a grooming procedure.** The module *requires a vet order and hands off*
  (§6 G6); it never owns an anesthesia record — that is the operations module.

---

## 2. Market baseline — what the leaders do, and what a vet module must add

Two product categories are converging here, and this plan deliberately takes the best half of each.

**A. Dedicated grooming/pet-care platforms (MoeGo, Gingr, Kennel Connection, DaySmart).**
This is where the operational depth is:

- pricing and groom duration set **by breed / size / coat**, with per-pet overrides;
- smart scheduling with per-slot pet limits and booking rules by breed/size/service;
- **digital report cards** sent after every appointment — before/after photos, what was done,
  mood, and a one-tap rebook button; the industry benchmark is 60–70 % of clients returning
  within 12 months, and the report card is the lever that moves it;
- vaccination compliance enforced **before a booking is allowed**, plus belongings, waivers
  and incident report cards;
- commission per service per employee, memberships/packages, deposits, tipping;
- retention tracked **per groomer** — which groomer gets rebooked and which one clients avoid.

**B. Veterinary PIMS (Digitail, ezyVet, Provet Cloud).**
Grooming is present but shallow — usually just another bookable service line. What they
contribute is the surrounding discipline: one client/pet record, smart charge capture,
real-time inventory decrement, automated reminders and follow-ups, a client-facing app.

**C. What neither does well — and where this module wins.**
The clinical layer around grooming is a documented safety problem, not a nice-to-have:

- **Heated cage drying kills brachycephalic and sedated pets.** Flat-faced dogs and cats cool
  inefficiently; a heated, humid cage is a heat-stroke chamber. Standard guidance: never
  cage-dry a brachycephalic pet with a heating element — hand-dry at room temperature or use
  fans only, with continuous monitoring and a written overheating plan.
- **Sedation for grooming is not a groomer's decision.** Sedated animals lose panting
  thermoregulation; senior, cardiac and brachycephalic patients are at real risk. The ethical
  standard is sedation only for medical procedures with a veterinarian present.
- **Therapeutic bathing is medicine.** Shampoo therapy delivers antibacterial, antipruritic,
  antiseborrheic and antifungal actives through a protocol — pre-wash cleanse, dilution,
  contact time, frequency — that changes outcomes in pyoderma, *Malassezia* and allergic
  dermatitis. A medicated bath needs a vet order, a product + dilution + contact-time record
  and a response note, not a checkbox.
- **The groomer sees everything.** Whole-body handling of every pet every 4–8 weeks: lumps,
  otitis, fleas/ticks, dental tartar, weight change, painful areas. Today that observation
  evaporates. Capturing it and converting it to care is the highest-value feature here, and
  no salon product can build it — it has no medical record to write into.

**Design consequence:** the module runs **two lanes over one engine** (§3) — a cosmetic lane
that must feel as fast and commercial as MoeGo, and a medical lane that behaves like the rest
of this clinical app (orders, gates, immutable records, escalation).

*(Sources listed at the end of the document.)*

---

## 3. The two-lane engine

One aggregate, one board, one state machine. `GroomingLane` decides which gates are mandatory
and which panels appear — exactly how `OperationTier` masks the surgical pathway.

| | `COSMETIC` | `MEDICAL` |
|---|---|---|
| Examples | استحمام، قص كامل، تقليم أظافر، تنظيف أذن، إزالة تعقّد | حمّام دوائي، غمر مضاد للطفيليات، عناية بجرح/ما بعد الجراحة، حلاقة تشخيصية |
| Trigger | booked by reception / owner | `requiresVetOrder` on the definition, or escalated mid-session |
| Ordering vet | optional | **required** (`vetOrderStaffId`, blocks start) |
| Product record | consumables only | product + **dilution + contact time + zones**, immutable |
| Gates | G1–G5, G8–G10 | all of G1–G10 |
| Billing | grooming invoice | grooming invoice (D2) |
| Findings | optional | response note **required** at completion |

**Escalation is one-way and logged:** a `COSMETIC` session can be promoted to `MEDICAL`
mid-flight (flea infestation, skin lesion, a wound found under a mat) — that requires a vet
order, re-quotes the session, and notifies the owner before work continues. It can never be
demoted.

---

## 4. Data model

Repo conventions: camelCase columns, `@@map` snake_case tables, `cuid()` ids,
`Decimal(10,2)` money (clinic-operational precision, matching `Invoice` / `ClinicServiceConfig`
— the `Decimal(21,9)` rule is accounting-ledger-only), Arabic comments on non-obvious columns,
snapshots on every catalog reference.

### 4.1 Catalog & configuration

```prisma
// Overlay on the Service tree — same pattern as isLabCategory / isOperationCategory
model Service { isGroomingCategory Boolean @default(false) }   // ← added

model GroomingServiceDefinition {
  id, clinicId, serviceId @unique      // مُسعَّر من شجرة الخدمات، معرَّف هنا
  kind             GroomingServiceKind
  lane             GroomingLane @default(COSMETIC)
  requiresVetOrder Boolean @default(false)
  isAddOn          Boolean @default(false)  // يُضاف فوق خدمة أساسية ولا يُحجز وحده
  basePrice        Decimal @db.Decimal(10,2)
  baseDurationMin  Int
  dryingMinutes    Int @default(0)          // يحجز فتحة تجفيف — عنق الزجاجة الحقيقي (§7)
  speciesScope     String[]                 // معرّفات AnimalType، فارغ = الكل
  requiresStation  Boolean @default(true)
  active           Boolean @default(true)
}

model GroomingPriceRule {                   // مصفوفة السعر/المدة — المحرّك في §5
  id, clinicId, definitionId
  animalTypeId?, animalStrainId?
  sizeBand      GroomingSizeBand?
  coatType      HairType?                   // إعادة استخدام التعداد القائم
  price         Decimal @db.Decimal(10,2)
  durationMin   Int
  dryingMinutes Int?
  @@unique([definitionId, animalTypeId, animalStrainId, sizeBand, coatType])
}

model GroomingModifier {                    // رسوم/خصومات مشروطة
  id, clinicId, code   GroomingModifierCode
  calc                 GroomingModifierCalc // PERCENT | FIXED | PER_MINUTE
  value                Decimal @db.Decimal(10,2)
  autoAppliesFrom      Int?                 // مثال: درجة التعقّد ≥ 3
  requiresOwnerApproval Boolean @default(false)
  active               Boolean
}

model GroomingCapacityConfig {              // لكل فرع — §7
  id, clinicId, branchId @unique
  stations Int, dryerSlots Int
  maxPetsPerDay Int?, maxHeatSensitiveConcurrent Int @default(1)
  dropOffWindowMin Int @default(30)
  requireDepositPercent Decimal?            // بوابة G9
}
```

**Why a definition table instead of columns on `Service`:** identical reasoning to
`OperationProcedureDefinition` — the Service tree stays the pricing/permission spine, the
domain table carries domain semantics. `ClinicServiceConfig` remains the last-resort price.

### 4.2 The groom card — `PatientGroomingProfile`

The thing every salon actually runs on, and the piece a PIMS can uniquely enrich. One row per
patient, long-lived, edited over years.

```prisma
model PatientGroomingProfile {
  id, patientId @unique, clinicId
  preferredGroomerId  String?              // Staff
  sizeBand            GroomingSizeBand?    // override للمشتق من الوزن
  coatType            HairType?            // override لسلالة المريض
  clipperPlan         Json?                // {body:"#7F", face:"scissored", feet:"round", sanitary:"#10"}
  shampooItemId       String?              // InventoryItem — الشامبو المعتاد
  sensitivities       String[]             // حساسيات/منتجات ممنوعة
  behaviorScore       GroomingBehaviorScore @default(GREEN)
  muzzleRequired      Boolean @default(false)
  requiresTwoHandlers Boolean @default(false)
  handlingNotes       String?              // «الأظافر تحتاج كمّامة، الأذن اليسرى مؤلمة»
  // ── سلامة التجفيف (§2C) — يُضبط آليًا ويُعدَّل يدويًا، ولا يُلغى إلا بسبب مسجَّل
  heatDryProhibited       Boolean @default(false)
  heatDryProhibitedReason String?
  groomIntervalWeeks  Int?
  lastGroomedAt       DateTime?
  nextGroomDueAt      DateTime?            // مخزَّن كاش — نفس عُرف VaccinationRecord.nextDueAt
  customPrice         Decimal? @db.Decimal(10,2)
  customDurationMin   Int?
  notes               String?
}
```

`heatDryProhibited` is **auto-set** on profile creation and on every intake from: a
brachycephalic strain flag (new `AnimalStrain.isBrachycephalic`, D9), age ≥ senior threshold,
a recorded cardiac/respiratory condition, or an active sedation order. Manual clearing
requires a reason and writes to activity.

### 4.3 The session (core aggregate)

```prisma
model GroomingSession {
  id, code @unique                         // GR-XXXXX
  clinicId, branchId, patientId, ownerId
  appointmentId        String?             // إن حُجزت ضمن زيارة
  groomerId            String              // Staff
  assistantId          String?
  stationId            String?             // Room — RoomType.GROOMING (جديد)
  lane                 GroomingLane @default(COSMETIC)
  status               GroomingStatus @default(SCHEDULED)
  stage                GroomingStage?
  vetOrderStaffId      String?             // إلزامي في المسار الطبي
  vetOrderNote         String?
  scheduledAt          DateTime
  dropOffAt            DateTime?
  estimatedDurationMin Int
  promisedReadyAt      DateTime?           // ما يُقال للمالك — أساس مؤشر الالتزام بالوقت
  checkedInAt, startedAt, dryingStartedAt, readyAt, pickedUpAt, completedAt  DateTime?
  dryingMethod         GroomingDryingMethod?   // بوابة G5
  quoteSubtotal, quoteAdjustments, quoteTotal  Decimal @db.Decimal(10,2)
  ownerApprovedQuoteAt DateTime?
  cancelKind GroomingCancelKind?, cancelReason String?
  isDeleted, deletedAt, createdAt, updatedAt
  // العلاقات: items, adjustments, intake, photos, findings, incidents, products,
  //           reportCard, consents(PatientConsent), invoice, activity, comments,
  //           inboxItems, sopRun, checklistRuns, vitalSignsRecords
}

model GroomingSessionItem {                // لقطات — الكتالوج يتغيّر والجلسة لا
  id, sessionId, definitionId, serviceId
  nameSnapshot, laneSnapshot
  priceSnapshot Decimal, durationSnapshot Int, dryingSnapshot Int
  quantity      Int @default(1)
  performed     Boolean @default(false)    // المخطط مقابل المنفَّذ — يوفَّق في التقرير
  performedByStaffId String?, notes String?
}

model GroomingSessionAdjustment {          // كل رسم/خصم مطبَّق، بمصدره
  id, sessionId, modifierCode, labelSnapshot
  amount Decimal @db.Decimal(10,2)
  source GroomingAdjustmentSource          // AUTO_INTAKE | MANUAL | PACKAGE | OVERRIDE
  reason String?, appliedByStaffId, approvedByOwnerAt DateTime?
}
```

### 4.4 Intake & safety screening

```prisma
model GroomingIntake {
  id, sessionId @unique
  weightKg Decimal?, temperatureC Decimal?
  vitalSignsRecordId String?               // لقطة قياس عبر وحدة العلامات الحيوية
  mattingGrade     MattingGrade            // NONE..PELTED (0–4، المعيار الصناعي)
  coatCondition    CoatCondition
  parasiteFinding  ParasiteFinding @default(NONE)
  skinFindings     String[]
  earCondition     EarCondition, nailCondition NailCondition, dentalNote String?
  behaviorScore    GroomingBehaviorScore
  muzzleUsed       Boolean @default(false)
  rabiesValidUntil DateTime?               // لقطة من محرّك استحقاق اللقاحات — بوابة G1
  vaccinationOverrideReason String?
  shaveDownRecommended Boolean @default(false)
  shaveDownApprovedAt  DateTime?, shaveDownApprovedBy String?   // بوابة G4
  heatDryProhibitedSnapshot Boolean
  belongings       String[]                // «طوق أزرق، مقود» — تُسلَّم عند الاستلام
  performedByStaffId, performedAt
}
```

### 4.5 Execution record

```prisma
model GroomingPhoto {
  id, sessionId, kind GroomingPhotoKind    // BEFORE | AFTER | CONDITION | INCIDENT
  url, caption String?, bodyZone String?
  createdByUserId, createdAt
}

model GroomingProduct {                    // نفس شكل AppointmentProduct — يخصم من المخزون
  id, sessionId, inventoryItemId String?
  nameSnapshot, priceSnapshot Decimal, quantity Decimal @db.Decimal(10,3)
  billable Boolean @default(true)
  // المسار الطبي: البروتوكول جزء من السجل، لا ملاحظة حرّة
  dilution String?, contactTimeMin Int?, bodyZones String[]
  issuedAt DateTime?                       // لحظة خصم المخزون — يمنع الخصم المزدوج
}

model GroomingIncident {                   // إبلاغ إلزامي — بوابة G10
  id, sessionId, kind GroomingIncidentKind, severity GroomingIncidentSeverity
  description, actionTaken String?
  photoId String?
  ownerNotifiedAt DateTime?, ownerNotifiedByStaffId String?
  vetAssessedByStaffId String?, vetAssessmentNote String?
  followUpAppointmentId String?
  createdByStaffId, createdAt
}
```

`GroomingIncidentKind`: `CLIPPER_BURN`, `NICK_CUT`, `QUICKED_NAIL`, `HEAT_STRESS`,
`MEDICAL_EVENT`, `ESCAPE`, `BITE_TO_STAFF`, `EQUIPMENT_FAILURE`, `OTHER`.

### 4.6 Outcome — findings, report card, recall

```prisma
model GroomingFinding {                    // الجسر السريري (§8)
  id, sessionId, patientId, clinicId
  category GroomingFindingCategory         // SKIN | EARS | EYES | NAILS | DENTAL | LUMP
                                           // | PARASITE | WEIGHT | PAIN | BEHAVIOR | OTHER
  bodyZone String?, severity GroomingFindingSeverity   // INFO | ATTENTION | URGENT
  note String, photoId String?
  acknowledgedByStaffId String?, acknowledgedAt DateTime?
  referralAppointmentId String?, labOrderId String?    // تُملأ عند التصعيد
  dismissedReason String?
  createdByStaffId, createdAt
}

model GroomingReportCard {
  id, sessionId @unique
  summary String, moodScore GroomingMoodScore
  recommendedIntervalWeeks Int?, nextRecommendedAt DateTime?
  publicToken String @unique               // رابط مشاركة للمالك (قراءة فقط)
  sentAt DateTime?, channel ReportCardChannel?
  rebookedAppointmentId String?            // قياس معدّل إعادة الحجز مباشرةً
}
```

### 4.7 Shared plumbing (extend, don't duplicate)

| Need | Reuse | Change |
|---|---|---|
| Grooming station | `Room` | **add** `RoomType.GROOMING` |
| Waiver | `PatientConsent` + `ConsentTemplate` | **add** `ConsentType.GROOMING` (handling, shave-down, photo-use clauses) |
| Photos/files | `uploads.controller.ts` (S3 presign) | none |
| Checklists | `ChecklistTemplate` / `ChecklistTemplateItem` | **add** `ChecklistScope.GROOMING_PRE` / `GROOMING_POST` |
| SOPs | `SopTemplate` / `SopRun` | **add** `SopDomain.GROOMING` |
| Vitals | `VitalSignsRecord` | **add** `VitalSignsSource.GROOMING` |
| Stock | `StockLedgerEntry` / `StockBatch` | none — same issue path as `AppointmentProduct` |
| Notifications | `InboxItem` | **add** `InboxItemType.GROOMING` |
| Activity / comments / mentions | operations pattern | new `GroomingActivity`, `GroomingComment(+Mention)` |
| Billing | `Invoice` | **add** `groomingSessionId String? @unique` + relation |
| Ledger | `clinic-invoice.adapter.ts` | none — the adapter is generic over `Invoice` |
| Permissions | `src/lib/permissions.ts` | **add** `grooming.*` (view_limited/view_full/create/edit/delete) + a backfill grant migration, per the `DOCUMENTS_DEFAULT_GRANT` precedent |
| Online booking | `public-bookings` | extend with grooming service types + vaccination pre-check |
| Groomer skills | `StaffService` | reuse as-is (which groomer may perform which definition) |
| Reports | `reports` | new grooming KPI page |

---

## 5. Pricing & duration engine (differentiator #1)

Today `ClinicServiceConfig` gives one price and one duration per service. That is fatally
wrong for grooming: a Chihuahua full groom and a Great Pyrenees full groom are the same
service — 25 minutes vs 3 hours, and several multiples apart in price.

**Inputs:** definition, animal type, strain, size band (derived from `Patient.weight`, or
`PatientGroomingProfile.sizeBand` override), coat type (`AnimalStrain.hairType`, or profile
override), plus intake-time modifiers.

**Resolution order — most specific wins, deterministic, unit-tested** (same spirit as the
accounting BR-4.10.1 party-account resolution):

```
1. PatientGroomingProfile.customPrice / customDurationMin      ← per-pet override, always wins
2. rule(definition, strain, coat)
3. rule(definition, strain)
4. rule(definition, type, sizeBand, coat)
5. rule(definition, type, sizeBand)
6. rule(definition, sizeBand)
7. definition.basePrice / baseDurationMin
8. ClinicServiceConfig.price / duration                        ← last resort
```

Every quote returns the **matched rule id and level**, so the UI can show «سعر السلالة» vs
«سعر افتراضي» and a manager can see exactly why a number appeared. No silent fallbacks.

**Then modifiers, in order, each recorded as its own `GroomingSessionAdjustment` row:**

| Code | Trigger | Default calc |
|---|---|---|
| `MATTING` | `mattingGrade ≥ MODERATE`, auto at intake | per-minute de-matting rate |
| `SHAVE_DOWN` | matted-pet shave-down; requires owner approval (G4) | fixed |
| `BEHAVIOR` | `behaviorScore = YELLOW/RED` or `requiresTwoHandlers` | percent |
| `SENIOR` | age ≥ threshold — slower, more breaks | percent |
| `FLEA` | `parasiteFinding ≠ NONE` — mandatory treatment + isolation (G7) | fixed + product |
| `SECOND_PET` | same owner, same day | negative |
| `EXPRESS` / `OUT_OF_HOURS` | staff-applied | fixed |

**Rules that keep it honest:**

- The quote is computed **at booking** (estimate shown to the owner) and **recomputed after
  intake** (the real number). Any increase above a configurable threshold requires
  `ownerApprovedQuoteAt` before work starts — the surprise-bill complaint, designed out.
- `estimatedDurationMin` is the *scheduling* input, so a price-rule change moves the calendar,
  not just the invoice.
- Snapshots on `GroomingSessionItem` mean a catalog edit never rewrites a past session.
- The **estimated vs actual duration variance** report (§12) is the feedback loop that tunes
  the matrix over the first months.

---

## 6. Workflow state machine & gates

`grooming.workflow.ts` — pure data + functions, no `db`, imported by server **and** client,
exactly like `operations.workflow.ts`.

### 6.1 Statuses (board columns)

```
مجدولة SCHEDULED → الاستلام CHECK_IN → الفحص القبلي INTAKE → قيد العمل IN_PROGRESS
   → التجفيف والتشطيب FINISHING → جاهز للاستلام READY → تم التسليم PICKED_UP → مكتملة COMPLETED
اعتراضية: ملغاة CANCELLED · لم يحضر NO_SHOW · محوَّلة للطبيب ESCALATED
```

`GroomingStage` sub-steps drive the work panel: `QUOTE_APPROVAL`, `BATH`, `DRYING`, `CLIP`,
`SCISSOR`, `NAILS_EARS`, `FINISH_CHECK`, `PHOTOS`.

### 6.2 Gates — server-enforced at transition time

| # | Gate | Blocks | Configurable |
|---|---|---|---|
| **G1** | **Vaccination valid** — rabies mandatory, others per clinic; read from the vaccination due engine, snapshotted at intake | `CHECK_IN → INTAKE` | required-vaccine list; override needs a reason, always logged |
| **G2** | **Signed grooming consent** (`ConsentType.GROOMING`, annual per pet) — handling, shave-down, photo use | `CHECK_IN → INTAKE` | validity period |
| **G3** | **Intake completed** — matting grade + behavior score + parasite screen present | `INTAKE → IN_PROGRESS` | no |
| **G4** | **Shave-down approved** when `mattingGrade ≥ SEVERE` — owner approval + re-quote | `INTAKE → IN_PROGRESS` | threshold |
| **G5** | **Drying method permitted** — if `heatDryProhibited`, `dryingMethod` must be `HAND_ROOM_TEMP` or `FAN_ONLY`; `CAGE_HEATED` is rejected outright with an Arabic explanation | `→ FINISHING` | **no — never configurable** |
| **G6** | **Sedation needs a vet order** — a sedation flag with no `vetOrderStaffId` cannot start; sedated sessions force `heatDryProhibited` and continuous monitoring | `INTAKE → IN_PROGRESS` | no |
| **G7** | **Parasite protocol** — `parasiteFinding ≠ NONE` requires the treatment item added + owner notified + isolation acknowledged | `INTAKE → IN_PROGRESS` | treatment product |
| **G8** | **Post-groom check + AFTER photos** | `FINISHING → READY` | photo requirement on/off |
| **G9** | **Payment / deposit** | `READY → PICKED_UP` | percent, default off |
| **G10** | **Open incident** — severity ≥ MODERATE must be vet-assessed **and** owner-notified | `→ COMPLETED` | no |

**Break-glass:** like the surgical `IMMEDIATE` override, any gate **except G5, G6 and G10**
can be overridden with a recorded reason by a user holding `grooming.edit`; every override
lands in `GroomingActivity` and in the compliance report. G5, G6 and G10 have no override —
they are the ones that kill animals or bury liability.

### 6.3 Where the clock runs

`promisedReadyAt` vs `readyAt` is the on-time metric; `checkedInAt → startedAt` is the
lobby-wait metric; `dryingStartedAt` feeds dryer-slot occupancy in §7.

---

## 7. Scheduling & capacity

Grooming breaks the appointment model in a way clinics feel immediately: the constraint is not
one resource, it is **three simultaneous ones**.

1. **Groomer minutes** — `estimatedDurationMin` from the pricing engine, not a fixed slot.
2. **Station** — `Room` of `RoomType.GROOMING`, `capacity` respected.
3. **Dryer slots** — `dryingMinutes` per item; a branch has `dryerSlots`, and
   `maxHeatSensitiveConcurrent` caps how many heat-prohibited pets may dry at once (they need
   supervised hand-drying, which consumes a human, not a machine).

Booking asks the server for feasible windows across all three; a double-book returns **409
with an Arabic reason naming the conflicting resource** (the operations precedent). Drop-off
windows (`dropOffWindowMin`) let reception stagger arrivals instead of seven owners at 09:00.

Also handled: per-day pet caps, per-groomer skill filter via `StaffService`, and refusing a
booking outright when G1 already fails at booking time — the Gingr rule: don't let it get to
the door.

---

## 8. The clinical bridge (differentiator #2)

The reason this belongs in a PIMS at all.

1. **Every session yields findings.** The finish-check step presents a short body-map form —
   skin, ears, eyes, nails, dental, lumps, parasites, weight, pain, behavior — pre-filled from
   intake. Zero findings is an explicit «لا ملاحظات», not an empty form.
2. **Findings write to the patient record** (`PatientActivity`) and appear on the patient file
   next to labs and visits. A groomer's observation becomes part of the medical history.
3. **`URGENT` findings raise an inbox item** to the duty vet with one-click actions: book a
   consultation (`Appointment`), order a lab (`LabTestOrder`), or dismiss with a reason. The
   created id is written back onto the finding, so conversion is *measured*, not assumed.
4. **The report card shows the owner the same findings in plain Arabic** — «لاحظنا احمرارًا في
   الأذن اليمنى» with the photo — which is both better medicine and the highest-converting
   upsell a clinic has.
5. **Medical-lane sessions close the loop:** the ordering vet gets the response note, the
   product/dilution/contact-time record, and the recommended next bath date — shampoo therapy
   has a *frequency*, and the recall engine (§4.6 `nextRecommendedAt`) schedules it.

---

## 9. Integration map

| Module | Relationship | Direction |
|---|---|---|
| Patients | groom card tab; findings → `PatientActivity` | EXTEND |
| Owners | booking, notifications, report-card link | REUSE |
| Appointments | optional `appointmentId`; findings create referral appointments | EXTEND |
| Vaccinations | due engine feeds G1 | REUSE (read-only) |
| Consents | new `ConsentType.GROOMING` template | EXTEND |
| Vital signs | intake temp/weight via `VitalSignsSource.GROOMING` | EXTEND |
| Inventory / Stock | `GroomingProduct` → `StockLedgerEntry` on `FINISHING` exit, double-issue guard | REUSE |
| Invoices | `Invoice.groomingSessionId` | EXTEND |
| Accounting | automatic — `clinic-invoice.adapter.ts` is generic over `Invoice`; grooming still needs its own **income-account mapping** and a **parallel-run reconciliation showing zero diff** before it counts as done (contract C3) | REUSE |
| Payroll / compensation | commission per groomer per service → `PayrollLineEarning` | EXTEND (GR7) |
| Care plans | grooming packages/subscriptions — see D5 | DECISION |
| Public bookings | grooming online booking + vaccination pre-check | EXTEND |
| Inbox / notifications | `InboxItemType.GROOMING` | EXTEND |
| Operations | sedated grooming hands off; never absorbed | HANDOFF |
| SOPs / checklists | new domain + two scopes | EXTEND |

---

## 10. Server module layout & API surface

```
src/server/grooming-definitions/    # الكتالوج والتعريفات والقواعد السعرية
src/server/grooming/                # الجلسات، اللوحة، الانتقالات
  grooming.controller.ts  grooming.model.ts  grooming.dao.ts  grooming.type.ts
  grooming.workflow.ts    grooming.workflow.test.ts            # آلة الحالات والبوابات (نقي)
  grooming-pricing.service.ts  grooming-pricing.service.test.ts # §5 (نقي)
  grooming-capacity.service.ts                                  # §7
  grooming-invoice.service.ts                                   # على غرار operations-invoice.service.ts
  grooming-findings.service.ts                                  # §8 التصعيد
src/server/grooming-profiles/       # كرت التجميل لكل مريض
```

Selected endpoints (all `requireClinic`, all gated by `grooming.*` permissions):

```
GET    /grooming                      board + filters (period, view, groomer, q)
POST   /grooming                      create session (server re-quotes; never trusts client prices)
GET    /grooming/:id                  full aggregate
POST   /grooming/:id/status           transition — runs the §6 gates, 409 + Arabic reason
POST   /grooming/:id/intake           intake screening (recomputes the quote)
POST   /grooming/:id/quote/approve    owner approval of the re-quote
POST   /grooming/:id/items            add/remove services & add-ons (re-quote)
POST   /grooming/:id/photos           presign + attach
POST   /grooming/:id/products         consumables (medical lane: dilution + contact time)
POST   /grooming/:id/findings         + /findings/:fid/escalate
POST   /grooming/:id/incidents
POST   /grooming/:id/report-card      generate / send / public read by token
GET    /grooming/slots                capacity-aware availability (§7)
GET    /grooming/quote                price + duration preview before booking
GET    /grooming/metrics              §12 KPIs
GET    /grooming/due                  interval-based recall («تأخّر عن موعد التجميل»)
```

**Controller-level tests are mandatory, not optional** (CLAUDE.md rule 12 corollary): every
gated endpoint ships an authorized-passes / unauthorized-403 test.

---

## 11. UI plan

Design-system law applies: existing components only, tokens only, RTL-correct, `dir="rtl"` on
any Radix `Tabs` root and `position="popper"` on every `SelectContent` (known repo traps).

| Screen | Shape | Reuses |
|---|---|---|
| `/care/grooming` **board** | kanban by status + stats strip + alerts strip + toolbar | the operations board scaffold verbatim (`OperationsBoard/Header/Toolbar/AlertsStrip`) |
| **Session sheet** | tabs: نظرة عامة · الفحص القبلي · التنفيذ · الصور · الملاحظات والحوادث · الفاتورة | `OperationCaseSheet` pattern |
| **Work panel** | stage stepper; the active gate blocks the next button and says why | `operation-work-panel.tsx` |
| **Intake form** | RHF + zodResolver, `Field`/`FieldError`; matting and behavior as visual scales | forms convention |
| **Photo strip** | before/after side-by-side with zoom | uploads + existing image viewer |
| **Groom card** | tab on the patient file, next to «الموافقات» | patient-file tabs |
| **Report card** | printable A5 + shareable public page | `print-invoice.ts` pattern |
| **Catalog & prices** | `ServicesTable` with a `grooming` scope + definition sheet; the **price-matrix editor** (size × coat grid, inline cells) is the one genuinely new component | `ServicesTable`, `TablePagination`, `FormFooter` |
| **Branch settings** | `/management/settings/branch/:id/grooming` — capacity, gates, modifiers | branch-settings precedent |
| **Metrics** | §12 charts | `Stats`, chart tokens (sequential ramp — never per-series) |

Header/footer bars follow the repo rule: `border-b px-4 py-2` / `border-t px-4 py-2`, `p-0`
content, `size="sm"` buttons.

**i18n:** Arabic-first. The lab/radiology/operations precedent is hardcoded Arabic — but this
module has an owner-facing surface (report card, online booking) that hardcoded Arabic cannot
serve bilingually, so a proper `grooming.*` namespace is the recommendation (D1).

---

## 12. Reporting & KPIs — `GET /grooming/metrics`

**Commercial**

- revenue per groomer per day · average ticket · **add-on attach rate**
- **rebook-at-checkout rate**, and 12-month **retention per groomer** (the industry lever)
- no-show and late-cancel rate · deposit coverage
- package/subscription utilization

**Operational**

- groomer utilization (booked ÷ available minutes) · station and **dryer occupancy**
- **estimated vs actual duration variance** — the input that tunes the price matrix
- on-time delivery (`readyAt ≤ promisedReadyAt`) · lobby wait (`checkedInAt → startedAt`)

**Clinical & safety** *(nobody else reports these)*

- findings per 100 sessions, by category
- **findings-to-visit conversion** — findings that became an appointment or a lab order
- incident rate per 1 000 sessions, by kind and severity
- shave-down rate (a matting-education KPI, and a complaint predictor)
- **G5 compliance:** heat-prohibited pets dried by a permitted method — target 100 %; any
  breach is an incident by definition
- vaccination-gate overrides and the break-glass log

---

## 13. Non-functional requirements

1. **One transaction per transition.** Gate evaluation, status change, stock issue, invoice
   refresh and the activity write commit together or not at all.
2. **Snapshots everywhere.** Catalog/price/product edits never rewrite history.
3. **Append-only safety records.** Incidents and medical-lane product records are never edited
   in place — corrections append with a pointer to the original (the vital-signs rule).
4. **Idempotent stock issue.** `issuedAt` guard; re-running a transition never double-issues.
5. **Server owns money.** Prices are re-resolved server-side on every mutation; the client
   never posts a price.
6. **Arabic client-facing errors**, including every gate rejection — each says which gate, why,
   and what to do next.
7. **Photos are patient data.** Presigned, access-checked, never public except via a
   report-card token that exposes nothing else.
8. **Board query budget.** One indexed query per board load: `@@index([clinicId, status])`,
   `([clinicId, scheduledAt])`, `([groomerId, scheduledAt])`, `([patientId, createdAt])`.
9. **Pure engines are unit-tested without a DB** — pricing resolution and the gate matrix run
   in the fast CI tier (no `DATABASE_URL` by design); DB-backed suites run in `PR Full Checks`.

---

## 14. Implementation phases

One phase = one PR train. **A phase is done only when its acceptance checks pass and CI is
green** (CLAUDE.md rules 8, 11, 14: the `full-ci` label on any head being reported, and no
exit report while a run is red or unresolved).

> **Status note — what is and is not usable today (2026-08-23).**
> The board at `/care/grooming` is real: sessions, the ten gates, intake with automatic
> re-quoting, stock issue, invoicing, findings and incidents all work through the API, and
> `tsc --noEmit` plus 1061 fast tests are green. **One gap blocks first use: there is no
> catalog settings screen yet.** `GroomingServiceDefinition` rows are created only through
> `PUT /grooming-definitions/service/:serviceId`, so until that screen exists (or the
> endpoint is called directly) the "new session" dialog lists no bookable services. That
> screen is the next thing to build, ahead of any GR7/GR8 work.
>
> Also still UI-only-pending, with the server side already in place: photo capture,
> add-finding and add-incident forms, the report-card page and print, the groom-card tab on
> the patient file, and the payment action on the grooming invoice.

**GR0 — Foundations: schema, catalog, pricing engine.** 🟡 **code complete, CI not yet run**
Enums; `Service.isGroomingCategory`; `RoomType.GROOMING`; `ConsentType.GROOMING`;
`AnimalStrain.isBrachycephalic` (D9); `GroomingServiceDefinition` + `GroomingPriceRule` +
`GroomingModifier` + `GroomingCapacityConfig`; `grooming-pricing.service.ts` with the full §5
ladder; `grooming.workflow.ts` (statuses, transitions, stages, gates G1–G10, non-overridable
set); `grooming-definitions` server module (4-file) behind a `careServer` group; seed migration
with the starter Arabic grooming catalog + brachycephalic strain tagging; `grooming.*`
permissions + access-neutral backfill grant.
*Accept:* migration green in CI; pricing tests cover every rung of the ladder **and** override
precedence; workflow tests cover the lane × transition × gate matrix; catalog CRUD works from
the settings screen.

> **Deviation from this plan, deliberate — no seeded price matrix.** GR0 as written above
> called for "a default size × coat matrix" in the seed migration. It does not ship one, and
> should not: `GroomingPriceRule` rows are clinic-owned money, and what a full groom *costs*
> is a business decision no migration may invent. What ships instead is
> `buildGroomingDurationGrid()` — a size × coat grid of **minutes only**, offered by the
> matrix editor as a reviewable starting grid. How long a giant double-coated dog takes is a
> craft fact that does not differ between clinics; what it costs does. Writing price `0` rows
> would have been worse than none, because the engine would then resolve to them as real
> prices instead of falling through the ladder.
>
> **Two DB facts this phase cannot self-certify** (rule 8 — CI is the source of truth):
> Docker was not running locally, so the three migrations have been authored via
> `prisma migrate diff` against a validated schema but **never executed**. `migrate deploy`
> + the drift check in CI is the first real proof. Also note `GroomingPriceRule`'s unique
> constraint cannot bind rows whose match dimensions are NULL (Postgres treats NULL as
> distinct in unique indexes), so duplicates are prevented by the DAO matching on
> `priceRuleIdentityKey` before write, and made harmless by the engine's deterministic
> `createdAt, id` tie-break — both covered by tests.

**GR1 — Groom card + session + board.** 🟡 **code complete, CI not yet run**
`PatientGroomingProfile` (+ patient-file tab), `GroomingSession` + items + adjustments +
activity, create flow with capacity-aware slots and 409 conflicts, board wired to real data,
session sheet with the overview tab. Gates present but permissive.
*Accept:* create → appears on the board; an illegal drag is rejected server-side with an Arabic
toast; a double-booked groomer/station/dryer 409s naming the resource; the booking quote matches
a hand-computed figure from the seeded matrix.

**GR2 — Intake, consent and the safety gates.** 🟡 **code complete (consent template UI pending)**
`GroomingIntake`, grooming consent template + signing, `heatDryProhibited` auto-derivation
(brachycephalic strain flag, senior age, cardiac/respiratory history, sedation), re-quote at
intake, owner approval of quote increases, gates **G1–G7 enforced**, alerts strip real.
*Accept:* a pet with expired rabies cannot leave `CHECK_IN` without a logged override; a
`PELTED` pet cannot start without shave-down approval; a brachycephalic pet **cannot** be set to
`CAGE_HEATED` under any override path; a flea finding forces treatment + owner notification.

**GR3 — Execution record: photos, products, stock, incidents.** 🟡 **API complete; capture UI pending**
Work panel with the stage stepper, before/after/condition photos, `GroomingProduct` with medical
dilution/contact-time fields, stock issue on `FINISHING` exit with a double-issue guard, incident
reporting, gates **G8 and G10**.
*Accept:* finishing a session with consumables writes exactly one `StockLedgerEntry` set and
re-running the transition does not double-issue; a `MODERATE` incident blocks `COMPLETED` until
vet-assessed and owner-notified; AFTER photos gate `READY` when the setting is on.

**GR4 — Billing.** 🟡 **invoice service + `Invoice.groomingSessionId` shipped; payment UI + reconciliation pending**
`Invoice.groomingSessionId`, `grooming-invoice.service.ts`, adjustments on the invoice, deposit
gate **G9**, payment flow identical to the radiology/operations invoice behavior, income-account
mapping + a **parallel-run reconciliation report showing zero diff** (contract C3).
*Accept:* invoice total = items + adjustments − package credits; the ledger adapter posts the
grooming invoice with balanced entries; the reconciliation report is zero-diff on the seeded scenario.

**GR5 — Clinical bridge.** 🟡 **API complete (findings → PatientActivity + inbox + escalation); add-finding UI pending**
`GroomingFinding` + the body-map finish-check form, write-through to `PatientActivity`, `URGENT`
findings raise `InboxItemType.GROOMING` to the duty vet, one-click escalation to an appointment
or lab order with the id written back, medical-lane response note required at completion.
*Accept:* an urgent finding notifies; escalation creates the linked appointment/lab order and the
finding shows it; the finding appears on the patient-file timeline.

**GR6 — Report card, recall & retention.** 🟡 **recall list + report-card API shipped; card UI/print pending**
`GroomingReportCard` (printable + public token link), the interval-based `nextGroomDueAt` engine
and `/grooming/due` recall list, one-tap rebooking with `rebookedAppointmentId` captured, reminder
notifications.
*Accept:* completing a session generates a report card whose figures match the session; the recall
list picks up a pet whose interval has lapsed; rebooking from the card links back.

**GR7 — Packages, commission & online booking.**
Grooming packages/subscriptions (per D5), groomer commission per service → `PayrollLineEarning`,
`public-bookings` extended with grooming plus a vaccination pre-check that refuses the booking.
*Accept:* a package enrollment decrements on use and shows on the invoice; commission appears on a
payroll run for the seeded month; a pet with out-of-date vaccination cannot book online.

**GR8 — Analytics, checklists & hardening.**
`/grooming/metrics` + the metrics screen, `SopDomain.GROOMING` + the two checklist scopes with a
clinic template editor, break-glass review list, print polish, board query perf pass.
*Accept:* every §12 KPI computes from seeded fixture data with verified figures; editing a
checklist template never alters historical runs; G5 compliance reports 100 % on the seed.

**Exit trio (CLAUDE.md rules 10 and 12), required at GR4 and GR8:**
(a) a **seeded scenario** in `db:seed` — idempotent, on dedicated demo pets/dates so verified
figures never move; (b) a **CI suite pinning that seed's exact figures** plus the phase acceptance
criteria; (c) a **"How to run & verify" walkthrough in the PR body that has actually been executed
through the product's own HTTP/UI surface** — every quoted figure comes from that run.

---

## 15. Decisions needed before GR0

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D1** | i18n | (a) hardcoded Arabic, per the lab/radiology/operations precedent (b) a proper `grooming.*` namespace | **(b)** — the report card and online booking are owner-facing; the precedent is technical debt, not a rule |
| **D2** | Billing shape | (a) standalone grooming invoice (b) a section inside the visit invoice when `appointmentId` is set | **(a) always** — one shape, one code path; a session booked inside a visit still bills separately, like operations |
| **D3** | Who may run a session | (a) any `Staff` (b) only staff with the definition in `StaffService` (c) a new groomer role | **(b)** — reuses the existing skill mapping, no new role concept |
| **D4** | Size-band source | (a) `Patient.weight` bands (b) strain-declared band (c) manual per pet | **all three in that precedence** — weight is objective, strain fills gaps, the groom card overrides |
| **D5** | Packages / subscriptions | (a) reuse `CarePlan` machinery (b) a dedicated `GroomingPackage` with credits | **(b)**, deferred to GR7 — care plans are visit-and-medication shaped; grooming credits are a different animal |
| **D6** | Vaccination-gate strictness | (a) hard block (b) block with reasoned override (c) warn only | **(b)** by default, with (a) available per clinic — matches the market without trapping a walk-in |
| **D7** | Deposits | on/off default | **off** by default, per-branch `requireDepositPercent` (G9) |
| **D8** | Photo requirement | mandatory before+after / after only / optional | **after mandatory, before recommended** — the after photo is the report card's whole value and the incident defense |
| **D9** | Brachycephalic source of truth | (a) new `AnimalStrain.isBrachycephalic` flag (b) infer from strain name (c) manual per pet only | **(a) + (c)** — a seeded flag on the strain table, always overridable on the groom card; never infer from a name |
| **D10** | Cat grooming | same engine / separate lane / out of scope v1 | **same engine**, with cat-specific definitions (lion cut, sanitary) and stricter defaults on sedation and heat drying |
| **D11** | Boarding adjacency | build grooming standalone / design the session to nest under a future stay | **design for nesting now** (a reserved nullable `stayId`), **build nothing** — one nullable column costs nothing, a retrofit costs a migration |

---

*Sources consulted for §2:*
[Digitail features](https://digitail.com/features/) ·
[MoeGo pet grooming software](https://www.moego.pet/pet-grooming-software) ·
[MoeGo grooming reports](https://www.moego.pet/blog/customer-service-and-grooming-reports) ·
[Gingr](https://www.gingrapp.com/) ·
[ezyVet](https://www.ezyvet.com/) ·
[Grooming the brachycephalic breeds — Groomer to Groomer](https://digital.groomertogroomer.com/issue/june-2024/grooming-the-brachycephalic-breeds/) ·
[The dangers of cage drying](https://atomic-canine.com/news/2009/02/the-dangers-of-cage-drying/) ·
[AAHA — anesthetic considerations for brachycephalic breeds](https://www.aaha.org/trends-magazine/publications/anesthetic-considerations-for-brachycephalic-dog-breeds/) ·
[Shampoo therapy in veterinary dermatology (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12825626/) ·
[Merck Veterinary Manual — principles of topical therapy](https://www.merckvetmanual.com/integumentary-system/integumentary-system-introduction/principles-of-topical-therapy-in-animals) ·
[Pet grooming salon customer retention](https://dojobusiness.com/blogs/news/pet-grooming-salon-customer-retention)
