# BRD — Pharmacy & Dispensing Module (elite-vet)

**Reference data already in the repo:** the two-layer drug catalog shipped 2026-08-12/13 —
`scripts/catalog/README.md` is the arbiter of what that data *is*, and its two-layer rule
(§1.2 below) is inherited verbatim, not restated by permission.
**Owner decisions already taken:** O-PH-A: built as an elite-vet module (MI/CRM methodology,
phase gates, flag-off inertness). O-PH-B: the controlled-substance register is
**regulator-conformant (SFDA/NCDR)**, not an internal audit trail — this is what makes §8 a
phase of its own and O-PH-1 a launch-blocking question. O-PH-C: Arabic-only UI.
**Status:** v1.0 — pre-kickoff. §17.2 corrections table starts with two pre-filed rows and is
the change log of record, exactly as in the MI and CRM BRDs.

---

## §0. Doctrine

0.1 CLAUDE.md and AGENTS.md rules bind: rule 6 (ambiguity → owner question, never invent),
rule 8 (one generated migration per phase; CI is the source of truth), rule 11 (no exit report
before a concluded green full-CI run on the phase head), rule 12 (authorized/403 controller-test
pair per gated endpoint; a walkthrough is evidence only once executed), rule 13 (never run a
second typecheck while a commit may be in flight), NFR conventions (4-file resources,
TypeBox+prismabox, `Prisma.XGetPayload` response types, Arabic-only client errors).

0.2 **Verification-first.** Every phase opens with a §-numbered verification pass against live
`main`; count rows and call sites, never infer. §2 of this document *is* that pass for PH0 and
its numbers are measured, not quoted. A contradiction between this BRD and live code stops the
work and becomes a §17.2 row.

0.3 **Flag-off inertness is the module's central promise:** `ClinicPharmacySettings.enabled`
OFF ⇒ zero observable change anywhere, proven by tests, and existing suites green unchanged in
every phase run.

0.4 **THE SAFETY DOCTRINE — this module's §0.4, and it outranks every delivery concern.**
A prescribing system that guesses is worse than no prescribing system, because a clinician
trusts what it prints. Therefore, and without exception:

- **Never generate, infer, complete or "reconstruct" clinical dosing from a language model.**
  This is `scripts/catalog/README.md`'s standing instruction and it binds every phase here.
  Fabricated dosing is a patient-safety incident, not a data-quality defect.
- **Absence is a state, never a default.** No monograph ⇒ no calculated dose. No species
  mapping ⇒ no calculated dose. No recorded weight ⇒ no calculated dose. Each renders an
  explicit Arabic «غير متاح — أدخل الجرعة يدويًا», never a blank that reads as zero and never a
  silently-substituted neighbour value.
- **A missing datum never renders as a safe one.** `withdrawalPeriod = null` means «غير مذكور
  في السجل», NOT «لا توجد فترة تحريم». The catalog schema already carries this instruction as a
  column comment; the UI is bound by it. The same applies to `legalStatus` (§8.2).
- **Every clinical row is source-cited.** `drug_monograph.sourceCitation` is required by the
  schema; §3 keeps it required through the UI and refuses a save without it.

0.5 **The module writes no new pricing or tax logic.** Dispensed items bill through the
[P12C.1] seam that already exists (`resolveSalesTaxTemplateOrThrow` + `InvoiceTax` + per-item
`itemTaxTemplateId`). If a deliverable appears to need its own VAT arithmetic, that is a
finding, not a licence — it is the exact defect Phases 12B/12C existed to delete.

0.6 Multi-clinic: every pharmacy table carries `clinicId` and is clinic-scoped. The catalog
(layers 1 and 2) stays **global** and read-only, exactly as today.

---

## §1. Module concept

1.1 Four things the clinic cannot do today: write a prescription, calculate a dose, dispense
against stock with a batch and an expiry, and account for a controlled drug. This module adds
those four and nothing else.

1.2 **The two-layer rule** (inherited verbatim from `scripts/catalog/README.md` — do not merge
the layers).

| Layer | Table | Origin | Contains |
|---|---|---|---|
| 1. Regulatory | `drug_catalog_product` | imported verbatim from a regulator | trade/generic name, strength, form, route, manufacturer, registration status |
| 2. Clinical | `drug_monograph` + `drug_monograph_dose` | hand-curated, source-cited, vet-reviewed | dose ranges per species, contraindications, warnings |

> *"A registry is a product catalog, not a formulary. If a prescribing screen reads layer 1
> alone it will happily permit paracetamol for a cat."*

This module is the first consumer of layer 2. §3 is therefore not optional scaffolding — it is
the phase that gives the dose engine anything to read at all.

1.3 The join key between layers is **`genericKey`** (normalized generic name). Not `atcVetCode`:
0% coverage in SFDA, and licence-blocked (the WHO Collaborating Centre's terms forbid commercial
redistribution).

1.4 The species axis is `CatalogSpecies` (12 values), reached from a patient via
`Patient.animalTypeId → AnimalType.species`. That column is **nullable** — see §5.3.

---

## §2. Verification pass — what is actually there

Measured 2026-08-29 against `main` @ `9dd9d18`. Numbers, not impressions: §0.2 requires it, and
the plan's day-estimates depend on it.

2.1 **Layer 1 is populated: 4,762 products.** `SA_SFDA` 1,365 · `AU_APVMA` 3,397.
`inventory_item.catalogProductId` already links stock to a registration.

2.2 **Layer 2 is empty. Zero rows.** `grep -rho 'INSERT INTO "drug_monograph[a-z_]*"'
prisma/migrations/` returns nothing; the tables exist from the schema migration and no pack,
seed or script has ever written to them. **This is by design**, per the README: rows are entered
"from BSAVA/Plumb's by a licensed vet". Consequence: the dose engine ships correct-and-silent on
day one, and §3 is what makes it speak.

2.3 **Controlled-substance coverage in layer 1 is unusable as a scheduling source.**

| Standard | Products | `legalStatus = "Controlled"` |
|---|---|---|
| `SA_SFDA` | 1,365 | **2** |
| `AU_APVMA` | 3,397 | 24 (+ 1,247 "Prescription only") |

Two, in the Saudi register — not the ketamine, butorphanol, diazepam or pentobarbital a clinic
actually schedules. APVMA's 24 are *Australian* scheduling, which has no legal force in Saudi.
**`legalStatus` cannot drive §8.** See O-PH-1.

2.4 **Withdrawal period is stated for 11 of 1,365 SFDA rows (1%).** The food-safety gate in §6.4
is therefore mostly a *disclosure* surface, not a data surface. Still worth building — but the
honest framing is §0.4's third bullet, and the standard's coverage note already says so to the
user's face in settings.

2.5 **Only 161 of 1,365 SFDA products (12%) target dogs or cats.** The Saudi register is
overwhelmingly livestock and poultry. A small-animal clinic will lean on `AU_APVMA` and on its
own inventory, not on SFDA.

2.6 **Medication today is `appointment_product`** — `inventoryItemId?`, `nameSnapshot`,
`priceSnapshot`, `quantity`, `freeQuantity`, `issuedAt`, `paidAt`. It carries **no dose, no
route, no frequency, no duration, no prescriber, no refills**. `issuedAt` («وقت خصم المخزون
فعلياً — يمنع الخصم المزدوج») is the double-issue guard §7 must copy, not reinvent.

2.7 **`clinical_exam` Step 4 "Treatment Plan" is two free-text columns**, `dietPlan` and
`monitoringPlan`. That is the entire prescribing surface today, and it is where §11.1 lands.

2.8 **Weight has a canonical source and a stale one.** `VitalSignsRecord.weight` `Decimal(6,2)`
kg with `recordedAt` is canonical (`clinical_exam.weight` is marked *مهجورة* in the schema and no
longer written). `Patient.weight` is a `Float?` profile field of unknown age. §5.2 binds the dose
engine to the former.

2.9 **Stock, batching and tax seams all exist:** `StockLedgerEntry`, `StockBatch`, `StockBin`,
`InventoryItem.tracksBatches`, `InventoryItem.itemTaxTemplateId`, and the [P12C.1]
`resolveSalesTaxTemplateOrThrow` shared by POS and clinic invoices. §7 and §10 consume these;
they build none of them.

2.10 **Settings precedent is a typed per-domain model** — `ClinicSchedulingSettings`,
`ClinicAgentSettings`, `ClinicNotificationSettings`, `ClinicPayrollSettings`,
`ClinicAccountingSettings`. Pharmacy follows it with `ClinicPharmacySettings` (§14). There is no
generic key-value settings bag outside accounting's `AccountsSetting`, so none is invented.

---

## §3. Formulary authoring — layer 2 (FR-P3.x)

3.1 A vet-facing CRUD surface for `drug_monograph` + `drug_monograph_dose`. This is the phase
that makes §5 useful; without it the dose engine is correct and permanently silent (§2.2).

3.2 `drug_monograph`: `genericKey` (unique, the §1.3 join) · `genericName` / `genericNameAr` ·
`summaryAr` / `summaryEn` · **`sourceCitation` required** · `reviewedBy` / `reviewedAt`.

- BR-P3.2.1: save without `sourceCitation` = Arabic refusal. The column is already non-null in
  the schema; the UI must not paper over it with a placeholder.
- BR-P3.2.2: `genericKey` is normalized on write with the **same** normalizer the catalog packs
  used, imported — not re-implemented. A second normalizer is a silent join failure.

3.3 `drug_monograph_dose` per `(monographId, species, route)`: `contraindicated` · `doseMin` /
`doseMax` `Decimal(12,4)` · `doseUnit` (mg/kg) · `route` · `frequency` · `durationNote` ·
`warningAr` / `warningEn`.

- BR-P3.3.1: `contraindicated = true` ⇒ the dose range must be empty. A contraindication with a
  dose beside it is the worst row in the table.
- BR-P3.3.2: `doseMin > doseMax` = refusal.
- BR-P3.3.3: authoring is gated on `pharmacy.formulary_edit` (§13) — a clinical-authority
  permission, never bundled with "can dispense".

3.4 **No import, no generation, no AI assist on this screen, in any phase** (§0.4). The screen
may *display* layer-1 registry facts beside the field being authored; it may never pre-fill a
clinical value from them.

3.5 Layer 2 stays **global** like layer 1 (no `clinicId`): a dose for a cat does not vary by
clinic. Clinic-specific preference belongs in §4, not in the formulary.

---

## §4. Prescription (FR-P4.x)

4.1 `prescription`: code `RX-XXXX` via `generateUniqueCode` · clinicId · patientId ·
appointmentId? · prescriberId · `status` DRAFT/ACTIVE/COMPLETED/CANCELLED ·
`weightKgSnapshot Decimal(6,2)?` + `weightRecordedAt?` (§5.2) · `notesAr?` · `issuedAt?` ·
`cancelledAt?` + `cancelReasonAr?`

- BR-P4.1.1: DRAFT writes no stock movement and no ledger row — the accounting module's
  draft/submit invariant, applied here.
- BR-P4.1.2: cancelling an ACTIVE prescription that has any dispensed item **appends**, never
  deletes: dispensed quantity stands and the §8 register is untouched.

4.2 `prescription_item`: prescriptionId · `inventoryItemId?` **or** `catalogProductId?` **or**
free-text `nameSnapshot` (exactly one resolvable, mirroring `appointment_product`'s tolerance for
a free item) · `doseAmount Decimal(12,4)?` · `doseUnit?` · `route?` · `frequency?` ·
`durationDays Int?` · `quantity Decimal(12,4)` · `quantityUnit` · `prn Boolean` ·
`instructionsAr` (the label body, §9) · `refillsAllowed Int @default(0)` ·
`refillsUsed Int @default(0)` · `doseSource` enum CALCULATED/MANUAL/OVERRIDE (§5.4).

- BR-P4.2.1: `quantity` is what dispensing and billing consume. It may be calculated (§5) or
  typed; `doseSource` records which, permanently, and it is shown on the item.
- BR-P4.2.2: `refillsUsed ≤ refillsAllowed`, enforced inside the dispense transaction (§7.3).
- BR-P4.2.3: a controlled item's `refillsAllowed` is forced to 0 until O-PH-1 says otherwise —
  refills on a scheduled drug are precisely what a register exists to prevent.

---

## §5. Dose engine (FR-P5.x) — pure, and pure on purpose

5.1 `dose.rules.ts`: a **pure** module (no DB, no clock, no I/O) so it runs in the fast suite
under rule 14. Signature in spirit: `(monographDose, weightKg, packStrength) → Result`.
Arithmetic uses the decimal library, never JS floats (the C2 precision rule).

5.2 Weight comes from the patient's most recent `VitalSignsRecord.weight` (§2.8), snapshotted
onto the prescription at creation together with its `recordedAt`. `Patient.weight` is **not** a
fallback: an unknown-age profile number is exactly the plausible-looking wrong input §0.4
forbids.

5.3 The engine returns a **typed refusal**, never a number, in each of these states — and the UI
renders each distinctly:

| State | Cause | Rendered |
|---|---|---|
| `NO_MONOGRAPH` | no layer-2 row for this `genericKey` (§2.2 — the common case at launch) | «لا توجد نشرة دوائية لهذه المادة — أدخل الجرعة يدويًا» |
| `NO_SPECIES_MAPPING` | `AnimalType.species` is null (§1.4) | «نوع الحيوان غير مربوط بمحور الأنواع» + a link to fix it |
| `NO_DOSE_FOR_SPECIES` | monograph exists, no row for this species/route | «لا توجد جرعة موثّقة لهذا النوع» |
| `NO_WEIGHT` | no `VitalSignsRecord` carrying a weight | «لا يوجد وزن مسجّل» + a link to record vitals |
| `CONTRAINDICATED` | `contraindicated = true` | §6.1 — a refusal, not a state |

5.4 A calculated dose outside `[doseMin, doseMax]` is **not** silently clamped: it is a §6.2
override. `doseSource` distinguishes CALCULATED (inside range), MANUAL (typed, no monograph) and
OVERRIDE (outside range, reason recorded).

---

## §6. Safety gates (FR-P6.x)

6.1 **Contraindication — hard refusal.** `drug_monograph_dose.contraindicated = true` for the
patient's species blocks the item with an Arabic message naming the species and the drug. Not
overridable in v1; a break-glass path would be a §17 decision, and it would have to be logged
like §8.

6.2 **Out-of-range dose — override with a recorded reason.** Permitted, never silent: the reason
is required, stored on the item, shown on the prescription and on the clinician copy of the
label, and counted in §12.3.

6.3 **Duplicate therapy** — two ACTIVE prescription items sharing a `TherapeuticClass` for the
same patient raise a warning (not a refusal) naming the other prescription. `therapeutic_class`
covers 92% of the catalog, so this gate is real; the 8% blank correctly produces no warning
rather than a false one.

6.4 **Withdrawal period** — for a food-producing species (`CATTLE`, `SHEEP`, `GOAT`, `CAMEL`,
`POULTRY`, `FISH`, `BEE`) the item shows `withdrawalPeriod` prominently, and where it is null
shows «غير مذكور في السجل» in the same weight of type (§0.4). §2.4 sets the honest expectation:
11 rows in 1,365 carry it.

6.5 Drug–drug interactions are **out of scope for v1**, pre-filed as §17.2 row 1: there is no
interaction dataset in the repo and §0.4 forbids inventing one. `Clinical decision support` is a
Step-3 module in `docs/planning/FULL_PLAN.md` and that is where it belongs.

---

## §7. Dispensing & stock (FR-P7.x)

7.1 `dispense_event`: prescriptionItemId · clinicId · dispensedById · `quantity Decimal(12,4)` ·
`batchId?` · `expiryDateSnapshot?` · `dispensedAt` · `stockLedgerEntryId` · `isRefill Boolean`.

7.2 One transaction, always (NFR-1): decrement stock, write the `StockLedgerEntry`, write the
§8 register row where it applies, and increment `refillsUsed` — or none of it.

7.3 Rules:

- BR-P7.3.1: **no double-issue.** `appointment_product.issuedAt` is the existing guard (§2.6);
  the same discipline binds here — a dispense is idempotent on its event row, not on a boolean
  the UI re-sends.
- BR-P7.3.2: partial dispense is first-class. `Σ dispense_event.quantity ≤
  prescription_item.quantity × (1 + refillsAllowed)`, enforced in the transaction.
- BR-P7.3.3: for `tracksBatches` items a batch is **required**, and FEFO (earliest expiry first)
  is *suggested*, never forced — a clinician may have a reason, and the record shows which batch
  actually left.
- BR-P7.3.4: dispensing an expired batch is refused. Not warned.
- BR-P7.3.5: insufficient stock refuses with the Arabic shortfall named. No negative stock, no
  silent backorder.

---

## §8. Controlled-substance register (FR-P8.x) — regulator-conformant (O-PH-B)

8.1 `controlled_drug_register`: an **append-only** balance ledger per `(clinicId,
inventoryItemId)`. Every row: `movementType` RECEIPT/DISPENSE/WASTE/ADJUSTMENT/TRANSFER ·
signed `quantity` · `balanceAfter` · `dispenseEventId?` / `purchaseReceiptId?` · `patientId?` ·
`prescriberId?` · `performedById` · `witnessId?` · `reasonAr?` · `occurredAt` · `recordedAt`.
No update path, no delete path — a correction is a new compensating row, exactly as the
accounting module treats a submitted voucher.

8.2 **What marks a drug as controlled is an open question, not `legalStatus`.** §2.3: two rows
in 1,365. The intended shape is a **scheduling data pack** in the existing `scripts/catalog/`
idiom — its own `DrugStandard`-style provenance (`authority`, `sourceUrl`, `dataVersion`,
`fetchedAt`), joined on `genericKey`, shipped as a migration, refreshable. That fits the repo
perfectly. What it needs is the source. **See O-PH-1 — this blocks PH4 and only PH4.**

8.3 WASTE requires a `witnessId` distinct from `performedById`. A single-signature waste entry is
the classic diversion route, and closing it is the register's whole purpose.

8.4 The register is gated on its own permissions (`pharmacy.controlled_view` /
`pharmacy.controlled_record`, §13), never implied by `pharmacy.dispense`.

8.5 Reconciliation: a periodic physical count writes an ADJUSTMENT row with a mandatory reason;
§12.4 reports book-vs-counted per drug per period.

8.6 **Retention periods, forms and submission format are regulator-defined and unknown to this
document until O-PH-1 is answered.** They are deliberately *not* guessed here. The ledger above
is the substrate a conformant report is generated from; the report itself is scoped in PH4 once
the authority and its form are named.

---

## §9. Label (FR-P9.x)

9.1 An Arabic-first printed label per dispensed item, following `print-grooming-session.ts` as
the print-surface precedent (a print sheet, not a PDF service).

9.2 Required on the label: patient name + species · owner name · clinic name + licence · drug
trade and generic name · strength · **dose, route, frequency, duration** · quantity dispensed ·
`instructionsAr` · batch + expiry where tracked · prescriber · dispense date · warnings from
`drug_monograph_dose.warningAr` · the withdrawal statement for food species (§6.4).

9.3 The label prints what was **dispensed**, from the `dispense_event`, not what was prescribed.
Where they differ (partial dispense, substituted batch) the dispensed truth is what goes home
with the animal.

---

## §10. Billing & accounting (FR-P10.x)

10.1 Dispensed items bill through the existing [P12C.1] seam:
`resolveSalesTaxTemplateOrThrow` for the document template, `InventoryItem.itemTaxTemplateId`
for the per-line override, `InvoiceTax` rows for the result. **No new tax arithmetic** (§0.5).

10.2 A dispense attaches to the appointment's open `Invoice` when there is one; otherwise it
creates one through the same path any other clinic invoice takes. Pharmacy introduces no second
invoice shape.

10.3 The ledger is reached through the existing `clinic_invoice` adapter. Pharmacy adds **no
adapter of its own**, and must hold that adapter's reconciliation at zero diff — which is PH5's
acceptance check.

10.4 A free/sample dispense (the `appointment_product.freeQuantity` precedent) decrements stock
and bills nothing — and, when controlled, still writes its register row. Free is a billing fact,
not a custody one.

---

## §11. Screens (Arabic, design-system contract binding)

11.1 **Prescribing lives in the clinical exam, Step 4.** Today two textareas (§2.7); it gains a
prescription builder above them. `dietPlan` / `monitoringPlan` stay — they are the non-drug half
of a treatment plan, and deleting them would lose data.

11.2 **Pharmacy queue** — a dispenser-facing page: ACTIVE prescriptions, filters by
status/prescriber/date, dispense action, partial-dispense sheet, batch picker with the FEFO
suggestion.

11.3 **Formulary** (§3) under settings, beside «معايير الأدوية» (`drug-standards`) which already
exists — layer 2 sitting visibly next to layer 1 is the clearest possible statement of §1.2 to
the user.

11.4 **Controlled register** — its own page, permission-gated, read-mostly: balance per drug,
movement history, waste entry with witness, reconciliation entry.

11.5 Patient profile gains a **medication history** tab: every prescription and dispense for the
animal, newest first.

11.6 RTL rules bind (AGENTS.md): decide `dir` from the design first, logical properties only,
`position="popper"` on every `SelectContent`, `dir="rtl"` on every Radix `Tabs` root.

---

## §12. Reports (FR-P12.x)

12.1 Dispensing by drug / by prescriber / by period.
12.2 Stock movement attributable to dispensing, reconciled against `StockLedgerEntry`.
12.3 Override log — every §6.2 out-of-range dose with its reason, prescriber and patient.
12.4 Controlled-drug balance and reconciliation (§8.5), plus the conformant regulator report once
O-PH-1 lands.
12.5 Expiring-stock report for pharmacy items (batch and expiry already exist; nothing surfaces
them today).

---

## §13. Permissions

New keys in `src/lib/permissions.ts` (the `PERMISSIONS` registry) plus a backfill migration
following `20260827140000_marketing_permissions_backfill`:

| Key | Guards |
|---|---|
| `pharmacy.view` | queue, prescriptions, medication history |
| `pharmacy.prescribe` | create / edit / cancel a prescription (§4) |
| `pharmacy.dispense` | dispense, partial dispense, refill (§7) |
| `pharmacy.formulary_edit` | author layer 2 (§3) — clinical authority |
| `pharmacy.controlled_view` | read the register (§8) |
| `pharmacy.controlled_record` | waste, adjustment, reconciliation (§8) |

Rule-12 corollary: every one of these gets an authorized-passes / unauthorized-403 controller
test in the phase that introduces it.

---

## §14. Settings — `ClinicPharmacySettings`

A typed per-domain model per the §2.10 precedent. Keys: `enabled` (the §0.3 flag) ·
`requireWitnessOnWaste` (default true) · `defaultLabelCopies` · `fefoSuggestion` (default true) ·
`blockExpiredDispense` (default true, **not** user-disableable — present so the screen can
explain why it cannot be turned off) · `controlledRegisterEnabled`.

---

## §15. Migration map (one per phase, rule 8)

| Phase | Migration |
|---|---|
| PH0 | `pharmacy_settings` (settings only — no permission backfill, §17.2 row 3) |
| PH1 | `pharmacy_prescription_core` |
| PH3 | `pharmacy_dispense_events` |
| PH4 | `pharmacy_controlled_register` (+ the §8.2 scheduling pack, once O-PH-1 lands) |

PH2, PH5 and PH6 are expected to be migration-free; if one turns out to need a column, it takes
exactly one.

---

## §16. Phases & exit proofs

Every phase exits on a concluded green **`PR Full Checks`** run on the phase head (rule 11) and,
at a milestone, the rule-10 trio: a seeded scenario, a CI suite pinning its exact figures, and a
walkthrough **executed** through the product's own HTTP/UI surface (rule 12).

| Phase | Scope | Migration | Blocked by |
|---|---|---|---|
| **PH0** | this BRD · `ClinicPharmacySettings` · six permission keys + backfill · flag-off inertness tests | ✅ | — |
| **PH1** | `prescription` + `prescription_item` · 4-file resource · pure `dose.rules.ts` and its refusal states (§5.3) | ✅ | — |
| **PH2** | safety gates §6.1–6.4 · pure rules + controller pairs | — | — |
| **PH3** | `dispense_event` · the one-transaction dispense · batch / FEFO / expiry · refills | ✅ | — |
| **PH4** | controlled register §8 · scheduling pack · conformant report | ✅ | **O-PH-1** |
| **PH5** | label §9 · billing §10 · adapter zero-diff held | — | — |
| **PH6** | formulary authoring §3 · screens §11 · reports §12 · exit trio | — | — |

### Build status (2026-08-29) — server complete PH0→PH6; **DB-backed paths unverified**

| Phase | Built | Evidence |
|---|---|---|
| **PH0** | settings model + migration · 6 permission keys · settings resource · flag-off tests | 11 pure tests |
| **PH1** | prescription + item schema + migration · 4-file resource · dose engine | 28 pure tests |
| **PH2** | contraindication / override / duplicate-therapy / withdrawal, enforced in the DAO | 17 pure tests |
| **PH3** | `dispense_event` + migration · one-transaction dispense reusing `issueFromBatch` | 12 pure tests |
| **PH4** | register + `ControlledSubstance` + migration · witness rule · append-only | ⚠ partial — see below |
| **PH5** | Arabic label print sheet · billing via `appointment_product` with `issuedAt` pre-set | — |
| **PH6** | formulary CRUD · queue screen + gated sidebar entry · three reports | — |

**Verified:** `bun run typecheck` exit 0 · `bun run build` exit 0 (rule-7 bundle guard, 2m53s) ·
fast suite **101 files / 1308 tests green with no database URL set** — the CI fast-job condition,
checked deliberately rather than assumed.

**NOT verified, and this is the honest limit of the above:** every DB-backed path. There is no
local database (Docker needs elevation here) and GitHub Actions has been failing since
2026-08-28 10:49Z — three workflows concluding in 3–4 s with zero job steps on a docs-only
commit, the billing-block signature. So per rule 8 and rule 11 **no task in this table has CI
evidence**, and the `dispense` transaction, the register, and every controller guard have never
executed against Postgres. The rule-10 exit trio (seed + pinned figures + an executed
walkthrough) is therefore not started, and no phase here is “exited”.

**PH4 is partial by construction, not by omission.** The ledger, the witness rule and the
append-only discipline are built; what is **not** built is the regulator-conformant part, because
O-PH-1 is unanswered: `ControlledSubstance.source` starts `CLINIC` (the clinic marks its own
items) and `SCHEDULE_PACK` + `scheduleClass` sit reserved and empty. The API refuses to write
`SCHEDULE_PACK` at all, so “we marked it ourselves” can never be mistaken for “the regulator
said so”. Retention periods, forms and submission format are deliberately not guessed (§8.6).

**Ordering note.** §3 (formulary) is built at PH6, not PH1, deliberately: PH1–PH5 must all be
correct against an *empty* layer 2 (§2.2), because that is the state every clinic starts in and
stays in for a while. Building the authoring screen first would let the engine be tested only on
curated happy-path rows and would hide every §5.3 refusal state — which are the states that will
actually run in production.

---

## §19. PH7 — the calculator that drives the clinician

Added after the owner asked for “enough data” and “a system that drives the user, not a user
who drives the system”. §0.4 is unchanged and binding: **no dosing was authored here.** What
changed is how much the system derives from data it already holds, and how much of the
clinician’s work it does for them.

### §19.1 The distinction this phase rests on

| Invented — forbidden | Derived — built |
|---|---|
| how many mg/kg a drug needs | how many **mL** a given mg dose is, from the registered `strength` |
| which species a drug is safe in | which **measure unit** a form implies (mL / g / tablet) |
| what frequency to use | what **`timesPerDay`** a *chosen* code means |
| whether a weight is clinically right | whether a weight is **biologically possible** for the species |

Everything in the right column is arithmetic or lookup over registered label data. Nothing in
the left column was touched.

### §19.2 The mg→volume converter is the safety core (`concentration.rules.ts`)

Veterinary dosing errors cluster on one step: 50 mg of a 100 mg/mL solution is 0.5 mL; of a
10 mg/mL solution it is 5 mL. **Ten-fold, same number on the page.** The engine emitted mg and
stopped there, leaving that division to a person with a syringe.

**Measured coverage on the real 4,762-product catalog: 2,681 convertible (56%).**

| | SFDA (1,365) | APVMA (3,397) |
|---|---|---|
| convertible | 710 (52%) | 1,971 (58%) |
| → mL / g / tablet | 553 / 149 / 8 | 1,249 / 387 / 335 |

**The refusals are half the value.** Real values in the register that the parser refuses rather
than guesses: `"20.20.20"` (three-component product — `parseFloat` silently reads **20.2**,
a plausible-looking number from an unparseable field), `"6.0 & 3.0"`, bare `mg` on a liquid
(per pack or per mL? the register does not say — one reading is 30× the other), `"200 %"`
(corrupt), and biological units (`log10 EID50/dose`, `PFU/dose`) where no mass exists to divide.
Each returns a named reason and an Arabic instruction to enter the volume manually.

### §19.3 Driving, not interrogating

- **Controlled frequency vocabulary** (`SID`/`BID`/`TID`/`QID`/`PRN`…). The engine still never
  parses `frequency` free text into a number — instead the text is never typed. A *chosen* code
  makes `timesPerDay` known, so total quantity computes itself. `PRN` returns `null`, not 1.
- **`GET /prescriptions/dose-context` now returns a plan, not facts**: mg, the mL/tablets to
  actually measure, total quantity to dispense, a ready Arabic sig, and the warnings to read
  before approving — each carrying its `basis`, and all of it editable.
- **Weight plausibility** catches the typo that silently multiplies every dose: a 45 kg cat
  (for 4.5) passes every other check because the arithmetic is flawless. Warns, never blocks.
- **`GET /formulary/coverage`** ranks the missing monographs by **what this clinic actually
  stocks and prescribes**. Filling layer 2 alphabetically across 2.7k products is endless; ten
  well-chosen rows cover most of a small clinic’s prescribing.
- **`scripts/formulary/import-formulary.ts`** loads a licensed formulary in bulk. It fetches
  nothing and generates nothing; it validates a human-supplied file and emits a migration.
  `sourceCitation` is mandatory, and **any error rejects the whole pack** — a half-imported
  monograph is worse than none, because the clinician sees it exists and trusts its gaps.

### §19.4 What is still not solved

The catalog is a **registry, not a formulary** — verified again in this phase, not assumed:
`produse.csv` (68 MB of APVMA label-use data) holds product→host→pest mappings and **no dose
rates**. So layer 2 remains empty and the calculator stays silent on mg/kg until a licensed
source is loaded. PH7 makes that loading cheap, ranked and validated; it does not substitute
for it, and nothing here pretends otherwise.

---
## §17. Open decisions & pre-filed deviations

### §17.1 Blocking

**O-PH-1 — the controlled-substance scheduling source (blocks PH4 only).**
O-PH-B chose regulator-conformant, and §2.3 shows the repo cannot support that today: 2 of 1,365
SFDA rows carry `legalStatus = "Controlled"`, and APVMA's 24 are Australian scheduling with no
force in Saudi. Needed from the owner, one of:

- **(a)** the SFDA/NCDR controlled-substances schedule itself (the list, or the URL/endpoint it
  is published at) — it then ships as a `scripts/catalog/` pack per §8.2, which is the clean
  answer;
- **(b)** the named authority plus the named form/report the register must produce, so PH4 is
  built to a specification rather than to a guess;
- **(c)** a clinic-maintained list — the clinic marks its own controlled items — buildable
  immediately and honestly labelled as *not* regulator-conformant, deferring (a)/(b).

Until one is chosen, PH0–PH3 and PH5–PH6 proceed unblocked. §0.4 forbids inferring a drug
schedule, and a wrong schedule is worse here than no module at all.

### §17.2 Corrections & deviations — the change log of record

| # | Row |
|---|---|
| 1 | **Drug–drug interactions are out of v1** (§6.5). No dataset exists in the repo and §0.4 forbids generating one. Belongs to `Clinical decision support`, Step 3. |
| 2 | **`FULL_PLAN.md` budgets 4 days** for "Pharmacy & dispensing" covering «حاسبة الجرعات، الملصقات، التداخلات، المواد المراقبة». Interactions are deferred (row 1) and the controlled register is a phase of its own gated on O-PH-1, so those 4 days cover PH0–PH3 + PH5. PH4 and PH6 are additional, and PH4's size is unknown until O-PH-1 is answered. Recorded now so the estimate is not later read as a miss. |
| 3 | **§13's permission backfill was dropped at PH0 after verification** (raised by the work, resolved in it). Every prior module's backfill — marketing, grooming, documents, mobile clinics — was justified by the destination being *already visible* in `app-sidebar.tsx`, where a new guard turns a visible screen into a forbidden one. Pharmacy has no sidebar entry and no route today (verified), so nobody loses access and there is nothing to compensate. And these six slugs write a drug dose and move a substance out of stock into a living animal: granting them to every existing role "to preserve access" would hand clinical authority to a receptionist. All six start empty for everyone and are granted explicitly. No `PHARMACY_DEFAULT_GRANT` constant exists, and the reasoning is recorded in `permissions.ts` beside the constants it deliberately does not join. |

---

## §18. Lessons imported from MI, CRM and Accounting (bind as rules)

18.1 Count, never infer (MI §18.1). §2 is this module's compliance with it.
18.2 A walkthrough is evidence only once executed (rule 12) — the P12A review shipped five
blocking defects from an unexecuted one, including two endpoints that 403'd for every user.
18.3 Controller-level tests, not just service-level: service-green says nothing about whether a
user can reach the feature.
18.4 A phase-exit report requires a **concluded** green full run on a head containing the work
(rule 11). Fast-green is not evidence.
18.5 One migration per phase, authored via `prisma migrate diff` — never `db:push`.
18.6 Arabic-only client-facing errors, registered in `app.ts`'s `CLIENT_ERROR_NAMES` so they
reach the operator as a 400 instead of a masked 500 — the [P12C.1] precedent.
