# Patient Consents — Module Plan

Implements the 13 signed forms in `docs/consents/*.docx` as a patient-level consent
engine. Source documents stay in the repo as the authority for the legal text.

## 1. What the source documents actually are

13 files → 9 distinct forms (the AR/EN pairs are one form printed in two languages).

| # | Form | Type | Source files | Host today |
|---|---|---|---|---|
| 1 | الموافقة الجراحية | `SURGICAL` | AR (7), EN (8) | `OperationCase` |
| 2 | موافقة جراحية بالغة الخطورة | `HIGH_RISK_SURGICAL` | AR-EN (3) | `OperationCase` |
| 3 | الموافقة على التخدير | `ANESTHESIA` | AR (9), EN (10) | `OperationCase` |
| 4 | الموافقة على التنويم | `HOSPITALIZATION` | AR (11), EN (4) | — none |
| 5 | خروج حالة سليمة | `DISCHARGE_HEALTHY` | AR-EN (5) | — none |
| 6 | استكمال العلاج بالمنزل | `DISCHARGE_HOME_TREATMENT` | AR-EN (6) | — none |
| 7 | إخراج على مسؤولية المالك | `DISCHARGE_AGAINST_ADVICE` | AR-EN (12) | — none |
| 8 | تسجيل إقامة القطط | `BOARDING` (CAT) | EN (1) | — none |
| 9 | تسجيل إقامة الكلاب | `BOARDING` (DOG) | EN (2), AR (13) | — none |

Only 3 of 9 have a host entity. There is no admission/boarding module, so the engine is
**patient-scoped**: every consent hangs off `Patient` + `Owner`, with *optional* links to an
operation case or appointment. Boarding and hospitalization forms work immediately as
standalone patient documents and can attach to those modules later without a data migration.

## 2. What already exists (and is not being replaced)

`OperationConsent` (`prisma/schema.prisma`) already solves the hard parts, well:

- `textSnapshot` — the text as shown to the signer; editing a template never rewrites history
- 4 signature methods (`DRAWN` / `TYPED` / `UPLOADED` / `VERBAL_WITNESSED`) with a working
  canvas signature pad in `operation-prep-sections.tsx`
- revoke-don't-delete (`revokedAt` + mandatory `revokeReason`), signed consents are immutable
- gate enforcement — `G1_CONSENT` blocks leaving the prep stage

This module **generalises that design rather than reinventing it**. What it lacks:

- scoped to `OperationCase` only — no home for 6 of the 9 forms
- no template registry; texts are 5 hardcoded one-line Arabic strings in
  `operations.type.ts` (`DEFAULT_CONSENT_TEXTS`), far thinner than the real legal text
- no English at all, and no structured fields (the forms carry ~25 fields each)

## 3. Data model

Two new tables. Money/precision rules of the accounting BRD do not apply here.

### `consent_template`
Clinic-scoped, versioned. `blocks` is the typed block list (see §4) stored as JSON.
System templates ship seeded with `isDefault = true` and cannot be deleted, only superseded
by a new version. `@@unique([clinicId, key, version])`.

### `patient_consent`
The signed instance. Key fields:

- `patientId` + `ownerId` — always set; the anchor
- `operationCaseId?` / `appointmentId?` — optional context links
- `templateKey` + `templateVersion` denormalised, so history survives template deletion
- `locale` — `AR` | `EN` | `BOTH` (the AR-EN forms print as one bilingual sheet)
- `fieldValues` Json — `{ fieldKey: value }`, validated against the template's field schema
- `textSnapshot` — the fully rendered document at signature time
- signature block — copied verbatim from `OperationConsent`'s proven shape
- `status` — `DRAFT` → `AWAITING_SIGNATURE` → `SIGNED` → `REVOKED`

### Enum changes
`ConsentType` gains `HIGH_RISK_SURGICAL`, `HOSPITALIZATION`, `DISCHARGE_HEALTHY`,
`DISCHARGE_HOME_TREATMENT`, `DISCHARGE_AGAINST_ADVICE`, `BOARDING`. Existing values
(`SURGICAL`, `ANESTHESIA`, `BLOOD_PRODUCTS`, `EUTHANASIA`, `FINANCIAL_ESTIMATE`) are untouched.

### `Patient` additions
`microchipNumber` and `coat` — both required by the boarding forms, neither in the schema today.

## 4. Templates as typed blocks, not text with placeholders

Each template is a list of `ConsentBlock`s (`paragraph` / `heading` / `fields` / `choice` /
`checklist` / `initial` / `clinicUse`). One definition drives three outputs: the interactive
form, the A4 print document, and the `textSnapshot`. A plain string with `{{placeholders}}`
could not express "select exactly one of these three authorisation options" — which is the
legally load-bearing part of the surgical and hospitalization forms.

## 5. Intelligent filling

Three layers, in decreasing order of trust:

1. **Deterministic autofill** — each field declares an `autofill` source (`owner.phone`,
   `patient.code`, `case.surgeon`, `today`, …) resolved from the DB. No AI, always correct.
   This alone empties most of every form. Fields stay editable.
2. **AI drafts free text** — fields marked `aiDraft` (procedure description, suspected
   diagnosis, home treatment instructions) get a "صِغ لي" button using the existing
   `ai-sdk` + `resolveModel` setup. Follows the established `operations-ai.service.ts`
   contract: output lands in an editable field and is **never auto-saved**.
3. **AI reads a signed paper form** — staff uploads a scan/photo of a completed paper form;
   a vision call extracts field values and ticked boxes into `fieldValues` for staff
   confirmation. The scan is retained on `sourceScanUrl` as the legal original.

## 6. Fidelity issues found in the source documents

Carried into the templates as **fixes**, flagged here so the change is traceable:

1. Both dog boarding forms name the wrong clinic — *"The City Vet Clinic is not liable"* /
   «عيادة سيتي فيت غير مسؤولة», and the EN footer says *"To be filled by The Dr.Paws Clinic"*.
2. The clinic's own name varies across forms ("Elite Veterinary Specialist Clinic",
   "The Elite Veterinary Clinic", «عيادة فن النخبة البيطرية», «عيادات فن النخبة»,
   «عيادة النخبة البيطرية التخصصية»).
   → templates use a `{{clinicName}}` token resolved from clinic settings.
3. The anesthesia consent hardcodes prices (575 / 402.50 SAR). Baking prices into legal text
   means a price change silently invalidates the wording of already-signed forms.
   → priced options reference a `Service`; the price shown is resolved at render time and
   frozen into `textSnapshot` on signature.

## 7. Build order

| Step | Content |
|---|---|
| C1 | Template types + all 9 template definitions (pure data, no DB) |
| C2 | Prisma models, enums, `Patient` fields + migration |
| C3 | Server resource (`controller`/`model`/`dao`/`type`) + render & autofill service |
| C4 | UI: consents tab on the patient file, fill sheet, signature capture, A4 print |
| C5 | AI: `aiDraft` fields + scanned-form extraction |
| C6 | Operations delegates to the engine; migrate `OperationConsent` rows; retire the old table |

C6 is last on purpose — the operations module keeps working untouched until the engine is
proven.
