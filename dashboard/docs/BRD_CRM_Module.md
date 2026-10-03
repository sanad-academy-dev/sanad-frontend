# BRD — CRM Module (elite-vet)
**Reference system:** Frappe CRM (github.com/frappe/crm) — analyzed in `docs/FrappeCRM_Reference_Analysis.md`. Where this BRD says "per reference", the analysis doc + the reference repo are the arbiter of intent; this BRD is the arbiter of scope.
**Owner decisions already taken:** O-CRM-1: built as an elite-vet module (TypeScript/Prisma/TanStack, MI-module methodology, phase gates). O-CRM-2: v1 = core + email + WhatsApp + simplified SLA (first-response only); telephony, Facebook sync, rolling-response SLA = [P2]. O-CRM-3: deal WON → Owner creation (elite-vet's counterpart of the reference's ERPNext customer bridge). O-CRM-4: Arabic-only UI.
**Status:** v1.0 — pre-kickoff. §17.2 corrections table starts empty and is the change log of record, exactly as in the MI BRD.

---

## §0. Doctrine (inherited from the MI module verbatim)

0.1 CLAUDE.md and AGENTS.md rules bind: rule 6 (ambiguity → owner question, never invent), rule 8 (one generated migration per phase), rule 11 (no exit report before a concluded green full-CI run on the phase head), rule 12 (authorized/403 controller-test pair per endpoint), NFR conventions (4-file resources, TypeBox+prismabox, Arabic-only client errors, `Decimal(10,2)` money / `Decimal(5,2)` percents).
0.2 Verification-first: every phase opens with a §-numbered verification pass against live `main`; count call sites, never infer (MI §18.1 lesson). Contradictions between this BRD and live code stop the work and become a §17.2 row.
0.3 **Flag-off inertness is the module's central promise:** `enable_crm_module` OFF ⇒ zero observable change anywhere, proven by tests, and existing suites green unchanged in every phase run.
0.4 **The CRM writes no GL row, ever, and touches no pricing seam.** It is entirely pre-sale. Its only hand-offs to the rest of the system are: WON → Owner creation (§7), and read-only links to services/membership plans as deal products (§6.3). If any deliverable seems to need posting or pricing, that is a finding, not a license.
0.5 Arabic-only UI and messages (O-CRM-4); identifiers/enums in English.
0.6 Multi-clinic: every CRM table carries `clinicId` and is clinic-scoped like every elite-vet module.

## §1. Module concept

Two core entities — **Lead** (a potential pet owner who has shown interest) and **Deal** (a qualified sales opportunity: memberships, service packages, treatment plans) — surrounded by horizontal engines copied in spirit from the reference: statuses-as-data pipeline, kanban/list views, unified activity timeline, assignment, simplified SLA, and communication channels (email + WhatsApp). Everything links to its Lead/Deal through one uniform polymorphic reference pattern (`referenceType` + `referenceId`), mirroring the reference's dynamic-link discipline.

## §2. Masters (statuses as data — the pipeline is editable, not an enum)

2.1 `crm_lead_status` and `crm_deal_status`: name (Arabic), color, `position` int (kanban order), `kind` enum OPEN/WON/LOST/CONVERTED (deal: OPEN/WON/LOST; lead: OPEN/CONVERTED/LOST) — `kind` is what code branches on; names/colors/order are clinic data. Deal status additionally carries `defaultProbability Decimal(5,2)` (reference behavior §3).
- BR-C2.1.1: statuses are never hard-deleted while referenced; deactivate instead (Arabic refusal).
- BR-C2.1.2: exactly one status per kind-critical role must exist (≥1 OPEN, ≥1 WON, ≥1 LOST for deals) — validated at deactivation time.
2.2 `crm_lead_source`, `crm_lost_reason`, `crm_industry` (optional master, seedable): flat Arabic masters, soft-delete, clinic-scoped.
2.3 Default seed (demo mechanism, clinic-editable, not migration-forced): lead statuses جديد/تم التواصل/مؤهل/محوَّل/مفقود; deal statuses مؤهلة/عرض مقدَّم/تفاوض/مكسوبة/مفقودة with probabilities 10/30/60/100/0; sources مكالمة/واتساب/زيارة/إحالة/فيسبوك/الموقع; lost reasons السعر/المسافة/اختار منافسًا/لا رد.

## §3. Lead (FR-C3.x)

3.1 `crm_lead` fields (adapted from the reference's 66 to the vet domain): code `LEAD-XXXX` via `generateUniqueCode` · clinicId · person: firstName/lastName/fullName(derived)/gender? · contact: mobile (primary, required), phone?, email?, city?, address? · petContext: `petSpecies`?, `petCount` int?, `petNotes`? (the vet-domain replacement for the reference's company block) · qualification: statusId (FK), sourceId?, `ownerUserId` (assigned agent) · communicationStatus? · lostReasonId? + lostNotes (BR-C3.3) · `convertedDealId`? + `convertedAt`? · SLA fields (§10): slaPolicyId?, responseBy?, firstRespondedAt?, firstResponseDuration?, slaStatus enum DUE/FULFILLED/FAILED? (nullable when no policy) · notes free text.
- BR-C3.1: fullName derives from parts; fallback title = name → mobile (reference's set_lead_name spirit).
- BR-C3.2: mobile format validated; duplicate-mobile on lead creation is a **warning with the existing lead linked, not a refusal** (front desks re-enter people; decide final behavior in verification if elite-vet has a phone-normalization precedent — follow it).
- BR-C3.3: moving to a LOST-kind status without lostReasonId = Arabic refusal (reference validate_lost_reason).
- BR-C3.4: every status change writes `crm_status_change_log` (child: from, to, byUserId, at, `durationInPrevious` seconds) — the fuel for §12 velocity analytics. One log table serves both leads and deals via the reference pattern.
- BR-C3.5: a CONVERTED lead becomes read-only except notes, and is excluded from default lead lists (reference `converted` non-filterable behavior).

3.2 Assignment (v1 = manual; auto-rules [P2]): assign/unassign endpoint, mandatory on qualification? — no: optional always; assignment fires an inbox notification to the assignee (MI-P1's inbox helper precedent). `ownerUserId` drives "my leads" default filter.

## §4. Deal (FR-C4.x)

4.1 `crm_deal`: code `DEAL-XXXX` · clinicId · `leadId`? (origin) · `ownerId`? (an existing elite-vet Owner, when the person already exists) — exactly one of the person-context sources must be resolvable · person snapshot fields (copied at conversion, editable) · statusId · `probability Decimal(5,2)` (defaulted from status, editable per deal) · `expectedCloseDate`? · `closedDate` (auto-set when entering WON-kind, reference behavior) · `dealValue Decimal(10,2)` (derived from products when products exist, manual otherwise) · `expectedValue` = dealValue × probability/100, recomputed on either change (BR-C4.2) · lostReasonId+lostNotes (same BR-C3.3 rule) · SLA fields as §10 · assignment as §3.2.
- BR-C4.1: WON requires the win flow of §7 to complete in the same transaction — a deal cannot sit WON without its Owner hand-off resolved.
- BR-C4.2: expectedValue recompute rule as above; changing status re-defaults probability ONLY if the user hasn't manually overridden it (store `probabilityOverridden` flag) — this refines the reference, which silently re-defaults; record as a deliberate deviation, §17.2 row 1 pre-filed.
- BR-C4.3: no currency/exchange machinery in v1 — single clinic currency (deviation from reference; multi-currency [P2]).

## §5. Conversion — Lead → Deal (FR-C5.x, the reference's crown operation)

One transactional operation: (1) create Deal copying the mapped fields (name/contact/pet context/source/assignment), (2) link `deal.leadId`, (3) set lead's status to the CONVERTED-kind status, stamp convertedDealId/At, (4) status log rows on both. Modal lets the user adjust before confirming (reference UX).
- BR-C5.1: a lead converts at most once (Arabic refusal on second attempt).
- BR-C5.2: conversion does NOT create an Owner — Owner creation happens only at WON (§7). (Deviation from the reference, which creates Contact/Organization at conversion: elite-vet's Owner is an operational entity with clinical meaning; creating it for every qualified conversation would pollute the owners list. Record as deliberate, §17.2 row 2 pre-filed.)
- BR-C5.3: if the lead's mobile already matches an existing Owner, conversion offers to link `deal.ownerId` to them (the "existing person" path).

## §6. Deal products (FR-C6.x)

6.1 `crm_deal_product` child rows: `itemType` enum SERVICE/MEMBERSHIP_PLAN/FREE_TEXT · itemId? (FK to Service or membership plan per type) · label snapshot · qty · unitPrice (defaulted from ClinicServiceConfig / plan fee, editable — it's a quote, not an invoice) · lineTotal.
- BR-C6.1: dealValue = Σ lineTotal whenever ≥1 product row exists; manual dealValue only on zero rows.
- BR-C6.2: prices here are indicative only — no pricing-seam call, no tax, no benefits engine (§0.4). The quote's Arabic label states «قيمة تقديرية».
6.3 MEMBERSHIP_PLAN rows are the CRM↔MI bridge on the sell side: the win flow (§7) offers enrollment when present.

## §7. The WIN flow — CRM's only hand-off (FR-C7.x, replaces the reference's ERPNext bridge)

On moving a deal to a WON-kind status, one transaction:
1. Resolve the Owner: if `deal.ownerId` set → use it; else create an Owner from the deal's person snapshot (name, mobile, email, address) via the existing owner-creation path — never a parallel insert; whatever validations/side-effects owner creation has today apply (verification item).
2. Stamp `deal.wonOwnerId`, closedDate; status log.
3. If the deal carries MEMBERSHIP_PLAN product rows and `enable_membership_module` is ON: surface a post-win Arabic prompt «تسجيل العضوية الآن؟» that deep-links into the existing MI enrollment flow pre-filled (owner + plan). The CRM does NOT enroll programmatically — enrollment keeps its own transaction, readiness checks, and refusals (§0.4 discipline). 
- BR-C7.1: WON is refused (Arabic) if Owner resolution fails validation — the deal stays in its prior status; no partial state.
- BR-C7.2: patients are NOT created by the win flow (petContext is prose, not structured patients) — first visit creates patients through the normal flow. [P2] may revisit.

## §8. Activities & unified timeline (FR-C8.x)

8.1 One polymorphic pattern: `referenceType` ('LEAD'|'DEAL') + `referenceId` on every activity table.
8.2 `crm_note` (title?, rich text) · `crm_task` (title, priority LOW/MEDIUM/HIGH, status BACKLOG/TODO/IN_PROGRESS/DONE/CANCELLED, dueAt?, assignedToUserId? → inbox notification; overdue surfaced by the daily job) · `crm_comment` (rich text + `@mentions` → inbox notification to mentioned users, reference behavior).
8.3 **Timeline endpoint** per entity: merges, newest-first with type filters (tabs: الكل/الملاحظات/المهام/التعليقات/البريد/واتساب/السجل): status-change log entries, notes, tasks, comments, emails (§9.1), WhatsApp messages (§9.2), and assignment events. Field-level change versioning (the reference's Versions parsing) is [P2] — v1's audit is the status log + activity records. (Deviation recorded, §17.2 row 3 pre-filed.)
8.4 Deleting a lead/deal is soft and cascades visibility of its activities (they never orphan into another entity's timeline).

## §9. Communication channels (v1 per O-CRM-2)

9.1 **Email (FR-C9.1):** verification-first — locate elite-vet's existing outbound-mail capability (transactional mail? none?). If none exists, the phase builds the minimal send path the codebase's own conventions imply and this becomes a §17.2-recorded addition; if one exists, extend it. Features: send from lead/deal page (to the entity's email), Arabic email templates master (`crm_email_template`: name, subject, body with `{{placeholders}}` resolved from the entity), sent mail recorded as a timeline entry with open/delivery status if the transport reports it. Inbound email ingestion is [P2].
9.2 **WhatsApp (FR-C9.2):** verification-first — determine the provider reality (does elite-vet or the clinic stack have a WhatsApp Business API integration today? Owner's own infra?). v1 target: send templated/free messages from the entity page through the configured provider, record in timeline, inbound webhook → timeline + inbox notification to the assignee (reference notify_agent behavior). If no provider exists at build time, the phase ships the channel abstraction + timeline + a `MANUAL` provider (log-only, mark-as-sent) so the UX is complete and a real provider drops in as [P2] config — **owner question O-CRM-5 at that phase's plan time.**
9.3 Both channels write nothing outside CRM tables + inbox.

## §10. SLA — simplified v1 (FR-C10.x, per O-CRM-2)

10.1 `crm_sla_policy`: name · appliesTo LEAD/DEAL/BOTH · `firstResponseMinutes` per priority? — v1 flattens the reference's priority table to a single target per policy + optional per-source overrides (child rows). Active flag; **first matching active policy applies at creation** (reference rule), matching = simple conditions (source in [..], or all).
10.2 Working calendar: reuse elite-vet's existing clinic working-hours/holiday structures if they exist (verification item — the clinic domain likely has schedules); only if none exist does the phase add `crm_working_hours` + holiday list. Response-by computed on working time (reference calc_time spirit, simplified: no rolling cycles).
10.3 First response = first outbound email/WhatsApp/logged call-note or a manual «تم الرد» action by the assignee. Sets firstRespondedAt/duration; slaStatus FULFILLED or (past responseBy) FAILED — derived on read + synced by the daily job step (AR-M4 discipline from MI), joined to the existing job runner, behind the CRM flag.
10.4 Breach surfacing: overdue badge on lists/kanban + inbox notification to assignee at breach (once).
10.5 Rolling responses, priorities matrix, per-communication reopening = [P2] (the reference's full engine is documented in the analysis doc §4.1 for that day).

## §11. Views & screens (Arabic, design-system contract)

11.1 Sidebar: **new top-level group «إدارة العملاء»** (owner's MI precedent: modules get their own sidebar presence) with items: «العملاء المحتملون» (leads) · «الصفقات» (deals) · «المهام» · «التقارير» (§12 screens) — each permission-gated by its doctype; group self-hides with zero CRM permissions.
11.2 Leads & Deals screens: **list + kanban toggle**. Kanban columns = the status masters in position order, drag-drop = status change (fires BR-C3.4 log + lost-reason modal when dropping on LOST). List: server-driven filters (status/source/assignee/date), search, sort.
11.3 **Saved views (FR-C11.3):** per-user saved view = named set of {filters, sort, visible columns, list|kanban} per entity, with pinned + public flags (reference CRM View Settings, scoped down: no group_by in v1). This is the v1 slice of the reference's views engine; the generic-engine ambitions stay [P2].
11.4 Entity page (lead/deal): header (name, status pill, assignee, SLA badge) · left: details panel with collapsible sections (fixed layout in v1 — the reference's layout **builder** is [P2], §17.2 row 4 pre-filed) · right/main: the §8.3 timeline with composer tabs (note/task/comment/email/WhatsApp). Quick-create modal for lead (mobile-first fields).
11.5 Deal page adds: products editor (§6), probability/expected value, the win button flow (§7).

## §12. Dashboard & reports (FR-C12.x — from the reference's dashboard.py function list)

v1 set: counts (leads by status, open deals, won deals in period) · **funnel** (lead statuses → conversion → deal statuses with conversion rates) · pipeline value (open deals by status, Σ dealValue and Σ expectedValue) · **forecast** (Σ expectedValue by expectedCloseDate month) · avg time-to-convert (lead) and time-to-win (deal) from the status log · lost-reason breakdown · per-agent table (assigned/converted/won, manager-visible). Period + agent filters. Team visibility follows elite-vet's existing role structure — no sales-hierarchy tree in v1 ([P2], §17.2 row 5 pre-filed).

## §13. Permissions

Doctypes: `crm_lead`, `crm_deal`, `crm_task` (+ masters under a `crm_settings` grouping). Registered per phase with the tables; controller-test pairs per rule 12 with the routes. **Backfill discipline from the MI lesson:** each phase that adds doctypes ships the permissions backfill in the same migration family, scoped by nearest-authority mapping (the MI-P5-era rule: grant only to roles already holding a comparable authority — propose the mapping in the phase's verification report; likely anchor: whichever roles hold appointments/owners write today, NOT accounting roles — CRM is front-office, not finance).

## §14. Settings keys (AccountsSetting-pattern equivalent — verification: locate the right settings registry for a non-accounting module; if elite-vet has only the accounting registry, that is an owner question, not an assumption)

`enable_crm_module` (bool, OFF) · `crm_default_sla_policy_id`? · `crm_whatsapp_provider` (MANUAL/… per §9.2) · `crm_email_from_name`? — final key list fixed in P0's verification against the registry's real shape.

## §15. Migration map (one per phase)

P0: masters (statuses/sources/lost reasons/industry) + settings + permissions · P1: lead + status_change_log + note + task + comment · P2: deal + deal_product + conversion columns · P3: email template + email message log (+ mail infra columns per verification) · P4: whatsapp message log + provider config · P5: sla_policy (+working hours/holidays iff none exist) + saved views table · P6: none expected (reports read; demo seed via mechanism).

## §16. Phases & exit proofs (MI discipline: full-CI green on phase head + executed walkthrough before any exit report)

| Phase | Scope | Named exit proof | Blockers |
|---|---|---|---|
| CRM-P0 | flag + settings keys + 5 master tables + seeds + permissions | flag OFF inertness; masters CRUD green | — |
| CRM-P1 | Lead entity + pipeline/status log + manual assignment + notes/tasks/comments + list/kanban + quick-create | executed: create lead → assign (inbox fires) → drag through kanban (log rows with durations) → LOST requires reason | — |
| CRM-P2 | Deal + conversion + products + forecasting + WIN→Owner + MI enrollment prompt | executed: lead → convert → products (plan row) → WON creates Owner → enrollment deep-link lands pre-filled in MI flow | MI module on main (it is) |
| CRM-P3 | unified timeline + email channel + templates | executed: timeline merges all types; send templated email from deal → appears in timeline | O-CRM-6 (mail transport reality — verification may answer it) |
| CRM-P4 | WhatsApp channel + inbound notification path | executed: outbound via configured provider (or MANUAL) in timeline; inbound webhook → timeline + assignee inbox | O-CRM-5 (provider) |
| CRM-P5 | SLA v1 + daily-job step + breach badges + saved views | executed: policy applies at creation; response marks fulfilled; breach flips on clock + notifies; saved kanban view persists | — |
| CRM-P6 | dashboard + reports + demo seed + polish + module closure record | §16.1 closing table; every report asserted against seed figures | — |

16.1 Closing record: same as MI — P0→P6 table with run numbers inside this BRD at closure.

## §17. Open decisions & pre-filed deviations

**Open (owner):**
- **O-CRM-5:** WhatsApp provider for v1 (existing Business API? which vendor? or MANUAL until decided) — blocks P4's provider half only; the channel ships regardless.
- **O-CRM-6:** email transport (existing infra vs add minimal) — likely answered by P3's verification; owner confirms the found reality.
- **O-CRM-7:** default pipeline wording — §2.3 proposes Arabic defaults; owner may reword before P0 seeds (blocks nothing; data is editable).

**§17.1 Deliberate deviations from the reference (pre-filed):** 1) probability re-default respects manual override (BR-C4.2) · 2) no Contact/Org at conversion — Owner only at WON (BR-C5.2) · 3) field-level versioning [P2]; v1 audit = status log + activities (§8.3) · 4) fixed detail-panel layout; layout builder [P2] (§11.4) · 5) no sales-hierarchy tree; existing roles govern visibility (§12) · plus [P2] parking lot: telephony (Twilio/Exotel), Facebook lead sync, rolling-response SLA, multi-currency, form scripts, generic views engine, inbound email, structured pet→patient at win.

**§17.2 Corrections of record:** (empty — populated during build, MI discipline.)

## §18. Lessons imported from MI (bind as rules)

18.1 Count call sites yourself; the BRD's numbers are claims until verified. 18.2 List-of-types drift: any enum/list consumed in >1 place is declared once + parity audit test (MI-P5 lesson). 18.3 New doctypes ship with their permissions backfill or existing roles never see the module (MI post-launch lesson). 18.4 Smoke-test with a human before merge; tests don't see locales, empty states, or "old clinic receives new module" paths. 18.5 i18n keys sweep is part of every UI phase's exit (the common.save lesson).
