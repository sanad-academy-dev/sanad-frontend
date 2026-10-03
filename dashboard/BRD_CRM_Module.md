# BRD — CRM Module (elite-vet)
**Reference system:** Frappe CRM (github.com/frappe/crm) — analyzed in `docs/FrappeCRM_Reference_Analysis.md`. Where this BRD says "per reference", the analysis doc + the reference repo are the arbiter of intent; this BRD is the arbiter of scope.
**Owner decisions already taken:** O-CRM-1: built as an elite-vet module (TypeScript/Prisma/TanStack, MI-module methodology, phase gates). O-CRM-2: v1 = core + email + WhatsApp + simplified SLA (first-response only); telephony, Facebook sync, rolling-response SLA = [P2]. O-CRM-3: deal WON → Owner creation (elite-vet's counterpart of the reference's ERPNext customer bridge). O-CRM-4: Arabic-only UI.
**Status:** v1.0 — **module CLOSED 2026-09-05**, CRM-P0 → CRM-P6, every phase on full-tier CI evidence (§16.1). §17.2 corrections table is the change log of record, exactly as in the MI BRD; it holds 27 rows.

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

4.1 `crm_deal`: code `DEAL-XXXX` · clinicId · `leadId`? (origin) · `sourceId`? (the lead source, snapshotted at conversion and editable — added by owner decision, §17.2 row 9; this field list originally omitted it, an adaptation gap against the reference) · `ownerId`? (an existing elite-vet Owner, when the person already exists) — exactly one of the person-context sources must be resolvable · person snapshot fields (copied at conversion, editable) · statusId · `probability Decimal(5,2)` (defaulted from status, editable per deal) · `expectedCloseDate`? · `closedDate` (auto-set when entering WON-kind, reference behavior) · `dealValue Decimal(10,2)` (derived from products when products exist, manual otherwise) · `expectedValue` = dealValue × probability/100, recomputed on either change (BR-C4.2) · lostReasonId+lostNotes (same BR-C3.3 rule) · SLA fields as §10 · assignment as §3.2.
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

P0: masters (statuses/sources/lost reasons/industry) + settings + permissions · P1: lead + status_change_log + note + task + comment · P2: deal + deal_product + conversion columns · P3: email template + email message log (+ mail infra columns per verification) · P4: whatsapp message log + provider config · P5: sla_policy (+working hours/holidays iff none exist) + saved views table · P6: **one after all** — `crm_task.overdueNotifiedAt` (`20260905140000_crm_p6_task_overdue_notice`). The prediction «none expected» was made before §8.2's overdue notice was scheduled, and the notice needs a column to stay idempotent across daily runs. Reports themselves added nothing; the demo seed runs through the seed mechanism as predicted.

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

### 16.1 Module closing record — all seven phases closed on full-tier evidence (2026-09-05)

Every phase exit ran the FULL CI tier (migrations + production build + the entire suite, DB
suites and the §16 walkthrough included) and shipped an **executed** walkthrough, not a
written one.

| Phase | Delivered | Head | Full-tier run |
|---|---|---|---|
| CRM-P0 | flag + `ClinicCrmSettings` + five master tables + seeds + permissions, all inert behind the OFF flag | `5335655` | [32845778703](https://github.com/hos321/elite-vet/actions/runs/32845778703) |
| CRM-P1 | Lead, status log with durations, manual assignment, notes/tasks/comments, list + kanban, quick-create | `fbea6c3` | [33060633098](https://github.com/hos321/elite-vet/actions/runs/33060633098) |
| CRM-P2 | Deal, conversion in one transaction, products, forecasting, WIN → Owner hand-off, MI enrollment prefill | `8c171d0` | [33159118888](https://github.com/hos321/elite-vet/actions/runs/33159118888) |
| CRM-P3 | §8.3 unified timeline endpoint, email channel with the owner's sender identity, templates master | `79fa3ae` | [33256684914](https://github.com/hos321/elite-vet/actions/runs/33256684914) |
| CRM-P4 | WhatsApp on Green API's classic gateway, credentials sealed at rest, inbound polling | `ab9e1bd` | [33641731316](https://github.com/hos321/elite-vet/actions/runs/33641731316) |
| CRM-P5 | SLA v1 on WORKING time, daily job step, breach badges, «سياسات الاستجابة» (the group's SEVENTH nav row, §17.2 row 28), saved views | `62d7dcb` ¹ | [34017902058](https://github.com/hos321/elite-vet/actions/runs/34017902058) |
| CRM-P6 | §12 reports, «إعدادات إدارة العملاء» (the EIGHTH nav row), the demo seed, the five features that had no UI, this record | `62d7dcb` ² | [34017902058](https://github.com/hos321/elite-vet/actions/runs/34017902058) |

**¹ CRM-P5 and CRM-P6 close on ONE run, by owner decision, and CRM-P5's own first attempt
FAILED.** Run [33970666314](https://github.com/hos321/elite-vet/actions/runs/33970666314) on
`a3ab87a` went red at `crm-p5.walkthrough.test.ts:176` — `created.lead.slaPolicyId` came back
`undefined`. `undefined` rather than `null` was the whole tell: `null` would have meant the
engine was asked and answered «no policy», a defect in the engine; `undefined` meant the
question was **never asked** — the field was not in the lead and deal list `select` at all.
The engine was writing the column correctly; the interface was blind to it, so «which policy
governs this record» could not be answered from any screen — which is the first thing anyone
seeing a «مخروقة» badge asks. Fixed in `d1066d1`. Recorded rather than folded away: a phase
that closes on its second attempt with the reason written down is stronger evidence than one
that never says how it got there.

**² The module was declared closed on `754c5ae`, then REOPENED, and that is the record.**
Preparing the owner's local tour on the "closed" head found **three more routes with no
caller** — §10.3's manual «تم الرد», BR-C3.2's `duplicate-check`, and `SlaBadge` rendering in
two of the five places its own comment names. The first was not a hidden feature but a
corrupted **measurement**: with nothing calling it, every response given outside the system
stayed a permanent breach, so §12's SLA figures were systematically wrong in exactly the case
the endpoint was built for. Fixed in `62d7dcb`, which is the real closing head.

The lesson is not «check again» but **check mechanically** (§18.7). The CRM-P6.3 sweep asked
the right question by READING the code: it found two and missed three. The CRM-P6.7 sweep
ENUMERATED all 84 CRM routes from the controllers and probed the client for each — it found
the rest in one pass, and is now `uncalled-routes.audit.test.ts`, running in every tier. Five
uncalled routes across seven phases, all with green tests, is the measure of how weak reading
is as a method here.

**Two module-wide invariants held at every exit:** the flag OFF ⇒ every CRM route refuses
(§0.3 — and CRM-P6 found the one route where it did not, §17.2 row 25), and no CRM code path
writes a GL row or touches a pricing seam (§0.4).

**The «إدارة العملاء» group ships EIGHT navigation items**, not §11.1's four: العملاء
المحتملون · الصفقات · المهام · التقارير · قوالب البريد · واتساب · سياسات الاستجابة ·
الإعدادات. Each addition beyond the four is recorded with its reasoning in §17.2 — rows 15,
20, 28 and 24 respectively — and every row is permission-gated, so a user with no CRM
permissions never learns the module exists.

**Three things a green run here does NOT prove**, stated so the record is not read as more
than it is:
1. **No human has driven this module end to end.** Every walkthrough was executed through the
   product's own HTTP surface inside CI — far stronger than prose — but that is not a browser
   and not a user. The owner's golden-path tour has been deferred since CRM-P2 (§16.2).
2. **The Green API contract test has never run.** `api.green-api.com` is unreachable from the
   build environment, so `green-api.contract.test.ts` stays `describe.skip`. CI proves our
   half of the wire, not the provider's.
3. **Both daily job steps are inert in production** ([P13.12]). Nothing in this repo runs
   queued jobs, so SLA breach flips and task-overdue notices are correct, tested, and will not
   fire on a real deployment. The badges are honest regardless — they derive on read, which is
   exactly why they were built that way.

16.2 **CRM-P2 closing note (owner, 2026-08-28): closed on CI evidence; human tour pending.**
The phase head is `8c171d0`, full-tier green — PR Full Checks
[33159118888](https://github.com/hos321/elite-vet/actions/runs/33159118888), PR Checks
[33159118906](https://github.com/hos321/elite-vet/actions/runs/33159118906), Migration Check
[33159118895](https://github.com/hos321/elite-vet/actions/runs/33159118895) — with the §16
walkthrough executed in CI against a real Postgres (FULL suite step, 7m00s). The owner's own
golden-path tour was **deferred for lack of local access** and will run later as ONE combined
**P2+P3 tour**. So rule 10's trio is satisfied by (a) the seeded scenario, (b) the CI suite
pinning its figures, and (c) the walkthrough in the PR body — executed by CI, not yet by a
human. Read the P2 exit as *CI-closed, human-unverified*: if the combined tour later finds
something CI could not see, it is a P2 defect, not a P3 one.

16.3 **CRM-P3 closing note: exited on the FULL run alone, and why that is complete.**
Phase head `79fa3ae`. Evidence: PR Full Checks
[33256684914](https://github.com/hos321/elite-vet/actions/runs/33256684914) — concluded
`success`, 33m00s, full step list, with **Apply migrations** (12s) and **Run FULL test
suite incl. DB suites + walkthrough e2e** (7m20s) both executed. The §16 walkthrough ran
for the FIRST time in that run; the fast tier cannot reach a database by design.

`Migration Check` and `PR Checks` have **no run on this head** — not a red, not a skip.
Actions was down repo-wide for part of this phase (every workflow dying in 5 seconds with
zero steps), and when it returned, only `pr-full-checks.yml` could be re-dispatched:
the other two declare `on: pull_request` alone, so firing them needs a push that would move
the head off the SHA under test. Filed as [P13.8].

Their coverage is **subsumed** rather than missing: the full run applies the migrations on
a throwaway Postgres (Migration Check's entire job) and runs the whole vitest suite, pure
tests included (PR Checks' entire job). Read their cells as «subsumed — trigger
limitation», never as green: no concluded run of those workflows exists on `79fa3ae`.

## §17. Open decisions & pre-filed deviations

**Open (owner):**
- **O-CRM-5:** WhatsApp provider for v1 (existing Business API? which vendor? or MANUAL until decided) — blocks P4's provider half only; the channel ships regardless.
- **O-CRM-6:** email transport (existing infra vs add minimal) — likely answered by P3's verification; owner confirms the found reality.
- **O-CRM-7:** default pipeline wording — §2.3 proposes Arabic defaults; owner may reword before P0 seeds (blocks nothing; data is editable).

**§17.1 Deliberate deviations from the reference (pre-filed):** 1) probability re-default respects manual override (BR-C4.2) · 2) no Contact/Org at conversion — Owner only at WON (BR-C5.2) · 3) field-level versioning [P2]; v1 audit = status log + activities (§8.3) · 4) fixed detail-panel layout; layout builder [P2] (§11.4) · 5) no sales-hierarchy tree; existing roles govern visibility (§12) · plus [P2] parking lot: telephony (Twilio/Exotel), Facebook lead sync, rolling-response SLA, multi-currency, form scripts, generic views engine, inbound email, structured pet→patient at win.

**§17 CRM-P1 decisions of record:**
- **Manual transition into a CONVERTED-kind status is refused** («التحويل يتم من إجراء التحويل فقط»). Conversion itself is CRM-P2; until then a lead marked «محوَّل» by hand would have no deal behind it and would lie to every §12 report that counts conversions. BR-C3.5 groundwork.
- **Task-overdue is derived on read in CRM-P1**; the overdue INBOX notification joins the daily job in CRM-P5 alongside SLA. §8.2 left the job timing open, and a job step that exists only to notify would otherwise ship two phases before the runner it belongs to.
- **The only job runner in the repo is accounting-namespaced** (`registerAccountingJobHandler`, `ACCOUNTING_JOB_TYPES`). A front-office module riding it is the same class of question as CRM-P0's Q1/Q2 and is deferred to CRM-P5 as a real owner question, not a default.
- **[P2] candidate, filed not actioned:** `Owner.phone` is stored raw and deduped by exact string (`@@unique([clinicId, phone])`), so BR-C5.3's owner matching at CRM-P2 will be best-effort. Normalizing and backfilling `Owner.phone` is its own decision with its own blast radius — it belongs to the owners module, not inside CRM.
- **System-wide hardening note (§18.2 class), out of CRM scope:** two divergent `normalizePhone` implementations exist — `src/lib/validation/phone.ts` returns E.164 **with** `+`, `src/features/services/vaccinations/utils/vaccination-reminder.ts` returns digits **without** it. CRM uses the canonical `lib/` one. Reconciling them goes on the system-wide list.

**§17 CRM-P2 decisions of record:**
- **The deal carries NO `sourceId`.** §4.1 enumerates `crm_deal`'s fields and does not list one, while §5 counts "source" among the fields conversion copies. A converted deal carries `leadId`, so the source is read through it and cannot drift from its origin; a deal opened directly has no source, which is an honest description rather than missing data. Raised to the owner at the time rather than decided silently — reversing it folds a column into the SAME P2 migration, which is unmerged.
- **WON is unreachable from the ordinary status path**, on the server AND in both clients (kanban drag, quick-create picker). BR-C4.1 requires the §7 flow to resolve the Owner in one transaction, and a drag cannot; refusing locally as well means the user is not sent to the server to be told no. The Arabic refusal names «كسب الصفقة» so the refusal doubles as directions.
- **Owner resolution at WIN is pre-checked, not left to the unique constraint.** `@@unique([clinicId, phone])` would raise «رقم الجوال مستخدم من قبل» — true, but it tells the user nothing to do. The win flow looks first and refuses by NAMING the clashing owner and asking for the link (BR-C5.3), which is the action that actually resolves it.
- **The assignment notification never fires from inside a caller's transaction.** `createDeal(…, tx)` returns without notifying; conversion notifies after commit. An inbox row is written on another connection and would not roll back, so a failed conversion would still have announced an assignment that never happened.
- **The seeded exit scenario stops BEFORE the conversion and the win.** Both are steps the §16 walkthrough executes; seeding them would prove the rows can exist without proving the operations work — the rule-12 failure mode exactly.

**§17 CRM-P6 decisions of record:**
- **The demo seed's dates are ABSOLUTE, not relative to «now».** Every other seed in this module could use offsets because it seeded a state, not a measurement. §12 seeds *figures*: «متوسّط زمن التحويل ٢٫٥ يوم» is only stable if both endpoints are fixed, and the date-window filter would select a different set every day a relative seed ran. Rule 10's promise is that figures the owner has verified do not move under him.
- **The seed does not set `ownerUserId`, so §12's «الموظفون» table starts empty.** The seed cannot invent clinic users, and assignment is a product action with its own route and (as of row 26) its own control. Seeding an assignment would prove the column can hold a value, not that anyone can assign — the rule-12 failure mode. The walkthrough assigns, then reads the row back.
- **The reports endpoint returns all seven figures in ONE call.** The screen shows them together and filters them together; seven trips with the same filters would place numbers from seven different instants side by side, which is a worse defect than being slow because it is invisible.
- **How the task-overdue step came to ship in CRM-P6 instead of CRM-P5 — a filing finding, not a scheduling one.** §8.2's overdue INBOX notification was scheduled for CRM-P5 in a CRM-P1 decision of record, i.e. it lived in **§17** (decisions) and nowhere else. It was NOT in §16's row for CRM-P5, and its column was not in §15's migration map for P5. A phase built from its own §16 row and its own §15 entry — which is how every phase in this module was built — therefore could not see it, and CRM-P5 closed without it. It shipped in [CRM-P6.1] with the migration §15 had said P6 would not need. The lesson is about **where work is filed, not about one step**: §17 is a decision log that phases read for *rationale*, while §15 and §16 are the lists a phase is *built from*. A commitment recorded only in §17 is invisible to the phase that owes it. Bound as §18.6 so the next module does not repeat it.

**§17.2 Corrections of record:**

| # | Phase | BRD text | What live code required | Why |
|---|---|---|---|---|
| 1 | CRM-P0 | §2.1 names the ordering column `position` | column is **`order`** | Twelve existing ordered masters in `prisma/schema.prisma` use `order Int @default(0)`; `position` appears nowhere. CLAUDE.md rule 4 — repo conventions win over BRD naming, mapping recorded here. |
| 2 | CRM-P0 | §2.1 gives statuses a `color` | `color` stores a **design-token key** from the closed allowlist `chart-1`…`chart-8`, never a hex value | The repo has no DB-stored UI colour anywhere: `mobile_unit.color` is a vehicle's paint rendered as text, and every UI colour comes from a code-side token map. CLAUDE.md rule 1 forbids hardcoded colours — design tokens only. A free-text colour column would have been the first place a hex could enter the product. The allowlist is declared once in `crm-masters.type.ts` and the TypeBox union derives from it (§18.2). |
| 3 | CRM-P0 | §14 heads the settings list "AccountsSetting-pattern equivalent" and flags the registry as an open question | settings live in a **typed `ClinicCrmSettings` table**, one row per clinic | `accounts_settings` is the repo's ONLY key/value registry and it is gated by `accounting.accounts_settings.write`. Putting the CRM flag there would make a front-office manager need an ACCOUNTING permission to enable a front-office module. Every other non-accounting module (`ClinicSchedulingSettings`, `ClinicAgentSettings`, `ClinicNotificationSettings`, `ClinicPayrollSettings`) uses a typed table. Owner decision Q1(a). Generalising the key/value registry to be module-agnostic is parked as **[P2]**. |
| 4 | CRM-P0 | §13 describes CRM permissions in "doctype" language (the accounting idiom) | slugs are **front-office** entries in `src/lib/permissions.ts` — `crm_settings.view_full/create/edit` | elite-vet has two permission systems: the accounting doctype/action matrix and the general front-office catalogue (`patients_owners.*`, `appointments.*`, `tasks.*`). Both merge into `ALL_PERMISSIONS` and land in one `StaffRole.permissions String[]`, so either works mechanically — but the CRM is entirely pre-sale (§0.4) and §13 itself anchors on front-office authority. Owner decision Q2(a). No `view_limited` (clinic-wide reference data has no branch or ownership dimension, so the slug would mean nothing) and no `delete` (BR-C2.1.1 forbids hard deletion, so the slug would gate an operation that does not exist). |
| 5 | CRM-P0 | §2.1 writes one `kind` enum `OPEN/WON/LOST/CONVERTED`, then parenthesises the per-entity subsets | **two** enums: `CrmLeadStatusKind` (OPEN/CONVERTED/LOST) and `CrmDealStatusKind` (OPEN/WON/LOST) | Splitting them makes the parenthetical a DATABASE guarantee instead of a convention code must remember: a lead status can never be persisted as `WON`. This implements the BRD's own subsets rather than departing from them. |
| 6 | CRM-P1 | The CRM-P0 prompt placed this BRD at `docs/BRD_CRM_Module.md` | the scope arbiter lives at the repo **root**, `BRD_CRM_Module.md` | Repo convention: the other two module BRDs sit at the root (`BRD_Accounting_Module.md`, `BRD_Membership_Insurance_Module.md`) and CLAUDE.md cites them there. Two copies briefly coexisted after the analysis doc was committed to `main` — byte-identical at the time, but a scope arbiter with two copies is one edit away from two different answers, and it nearly happened: the root copy did NOT carry §17.2 rows 1–5, so deleting the `docs/` copy naively would have destroyed the corrections table. Root now carries the full document; only `docs/FrappeCRM_Reference_Analysis.md` stays under `docs/`. Owner decision (H2). |
| 7 | CRM-P1 | §0.1 inherits CLAUDE.md rule 13, which makes the local pre-commit hook the single typecheck gate | **RESOLVED at [P13.6]** (merged `d2c8368`). For the CRM-P1.1 commit only, the gate could not run on a 16 GB box and commits used `--no-verify` with a scoped `tsc`; the grant **expired at `5e25c46`** and the hook is the single gate again from `dc58808` onward. | Measured, not guessed: `typecheck` at 13824 MB → OS SIGKILL (exit 137); `typecheck:ci` at 9216 MB → clean V8 heap OOM (exit 134). **Neither run emitted a single `error TS`** — both died before finishing, and memory was checked immediately after (15 GB free, no lingering `tsc`), so it was not contention. **CORRECTION to this row's first draft (owner-accepted):** it read «CRM-P0 fit; CRM-P1 does not», attributing the failure to CRM-P1's five new Prisma models. That over-attributes. The **`main` baseline SIGKILLs at 13824 on this box too**, with none of CRM-P1's models present — so a 16 GB machine was marginal and non-deterministic all along, and CRM-P1 revealed the wall rather than built it. The real cause, found at [P13.6]: `generated/` is 885 **`.ts` sources** (63 MB), which `skipLibCheck` can never skip because they are not declarations, so every program re-checked all of them; `generated/prisma/models/Clinic.ts` alone is 11 MB and every model with a `Clinic` back-relation re-expands it. Five more models made a marginal program fail more often — they were not the difference between fitting and not. **Outcome:** the typecheck is now three composed projects (peak 8.66 GB, the MAX not the sum) and the gate runs locally again. It earned its keep on first contact: merging main into this branch, it refused the merge with **six real errors** in CRM-P1.1 code no whole-program check had ever seen — including a **live bug**, `InboxItemType.LEAD` added to the enum without updating the two exhaustive client maps, so every «أُسنِد إليك عميل محتمل» notification rendered with an undefined icon, category and label. All six fixed in `dc58808`. |
| 8 | CRM-P1 | §0.1 inherits CLAUDE.md rule 13: «the pre-commit hook is the single typecheck gate» — i.e. a green hook means the types are checked | **It did not.** Three real type errors reached a pushed commit with the hook reporting green, because the gate could inherit a stale `.tsbuildinfo`. The rule now describes a TWO-SPEED gate: commit = fast incremental (may inherit, fallible); push/CI = forced fresh (authoritative). | Two independent holes lined up. (a) The `--no-verify` era of CRM-P1.1 replaced the whole-program check with a **scoped** `tsc` over the touched sources — which by construction cannot see a break in a file it was not given, and the `InboxItemType.LEAD` maps were exactly that: untouched files made wrong by an enum added elsewhere. (b) After [P13.6] made the check incremental, `tsc` skips any project its `.tsbuildinfo` considers up to date — so a cache that predated the change reported green without re-checking. Neither hole is exotic; together they masked a **live** defect (every «أُسنِد إليك عميل محتمل» notification rendering with an undefined icon, category and label) plus two type-contract errors, all caught only when a merge forced a full run. **Fix, structural rather than remembered:** `.husky/pre-push` now runs `bun run typecheck:cold` (`rm -rf tsbuild && bun run typecheck`) as guard 3, so a push can never inherit state, and CI's `typecheck-cold` job already restores no cache. `--force` was NOT the mechanism: it exists only in build mode (`tsc -b`), covering just the `generated` project, while `server` and `client` run under `tsc -p` where deleting the buildinfo is the only way to defeat inheritance. A commit-time false green stays **accepted by design** — push and CI backstop it within minutes, and paying the forced run on every commit costs more than it saves. Owner decision 2026-08-27 (Option A). |
| 9 | CRM-P2 | §5 lists "source" among the fields conversion copies, implying a `sourceId` on the deal; §4.1's field list for `crm_deal` omits it | **`crm_deal.sourceId` EXISTS** — a snapshot copied at conversion, editable, and pickable on a directly-created deal | §4.1's omission is an **adaptation gap against the reference**, whose CRM Deal carries source natively — not a decision to leave it out; §5 is read literally and wins. Owner decision, 2026-08-28, reversing this row's first ruling. That first pass shipped no column (source read through `deal.leadId → lead.sourceId`) and was surfaced as an open question rather than settled unilaterally; the owner reversed it before the phase closed, so the column folded into the **same** unmerged P2 migration and the phase still ships one migration. Two independent reasons the read-through was wrong: §12's funnel groups by source and would need a join through a nullable `leadId` for every deal; and `crm_deal.leadId` is `onDelete: SetNull`, so losing the lead would have silently erased a live deal's source. The FK is `SetNull` for the symmetric reason — soft-deleting a source must not block reading an old deal. Proven by `crm-conversion.http.test.ts` («المصدر ينتقل إلى الصفقة، ويبقى بعد اختفاء العميل المحتمل»), which nulls the link and re-reads the source. |
| 10 | CRM-P2 | §7.1 says the win flow creates the Owner "via the existing owner-creation path — never a parallel insert" | `ownersDao.create` gained an **optional transaction-client parameter**; behaviour without it is byte-identical | Prisma does not nest `$transaction`. Calling the existing DAO from inside the win transaction would have opened an INDEPENDENT transaction that survives the outer rollback, leaving an Owner minted for a deal that was never won — precisely the partial state BR-C7.1 forbids. The alternative the BRD rules out by name (a parallel `owner.create` in the CRM module) would also have silently lost the P2002 → Arabic duplicate messages. |
| 11 | CRM-P2 | §8.2's activity helpers were written lead-only in CRM-P1 (`addNote(clinicId, leadId, …)`), while §8.1 declares the tables polymorphic | helpers now take **`{type, id}`**, and the inbox link follows it — `dealId` for a deal, `leadId` for a lead | The polymorphic tables were already there; only the write helpers hardcoded `referenceType: "LEAD"`, so deals could READ their activities and not create any. One column meaning two things was rejected: the inbox builds its link from the column, so a dual-meaning column opens the wrong page half the time. This is why the phase needed no second activities migration. |
| 12 | CRM-P3 | §9.1 offers "open/delivery status **if the transport reports it**" | **`CrmEmailStatus` has exactly TWO members, SENT and FAILED** — «أُرسل»/«فشل الإرسال», nothing finer | The conditional is answerable, and the answer is no. nodemailer resolves when the SMTP server ACCEPTS a message, which is not delivery; Gmail SMTP reports no opens, no delivery receipts and no bounce webhook — bounces return as mail to the sending box, which nothing here reads. A third member would be a state the system cannot observe. The enum carries this reasoning as a schema comment so nobody later "completes" it. **Scope: this is a consequence of THIS transport, not a module-wide policy** — see row 16. |
| 13 | CRM-P3 | §9.1 says sent mail is recorded as a timeline entry; it does not say what the record keeps | `crm_email_message` stores the **resolved** subject/body **and the `replyTo` actually used**, not a reference to re-render from | A log that re-rendered from its template would show text that was never sent, the moment the template is edited — and clinic settings change over time, so the row must say where replies went THEN, not where they would go today. This is what makes the record evidence rather than a guess. |
| 14 | CRM-P3 | §14 has `crm_email_from_name`, implying the clinic controls how its mail appears | **The envelope address is one global account; the clinic controls the DISPLAY NAME and `Reply-To` only** | The transport is a single Gmail account (`EMAIL_USER`), and Gmail REWRITES a `From` that is not the authenticated user — so a per-clinic sender address cannot be achieved by setting a header, whatever the settings suggest. Owner decision (O-CRM-6 Q1): send from the global envelope, put the clinic in the display name, and point `Reply-To` at the clinic's own `ClinicSettings.email` so replies reach it. The composer and the templates screen both SHOW this before sending, because a shared envelope the user cannot see is a user sending blind. Cost accepted for v1: recipients see one address across all clinics. |
| 15 | CRM-P3 | §11.1 names FOUR sidebar items under «إدارة العملاء» | a **fifth** row, «قوالب البريد» → `/crm/email-templates` | §9.1 calls templates a MASTER, and a master nobody can browse or edit is not one; rule 12 also requires the phase's walkthrough to run through the product's own surface, which an API-only table cannot offer. Owner decision. **Related finding — CLOSED at CRM-P6 (row 24):** CRM-P0's masters had NO screen at all; all five now live in one «إعدادات إدارة العملاء» screen, as this row predicted. |
| 16 | CRM-P4 | — (no BRD text; recorded to stop a false precedent) | **WhatsApp uses FOUR statuses — sent / delivered / read / failed — and does NOT copy row 12's two** | Green API's `outgoingMessageStatus` webhook reports all four. Row 12's two-member enum was a consequence of Gmail SMTP being blind, not a module-wide policy, and reusing it here would keep that conclusion while discarding the reasoning that produced it. Owner ruling. Stated explicitly because the two enums sitting side by side in one module otherwise look like an inconsistency someone would "fix". |
| 17 | CRM-P4 | §9.2 leaves the provider open (O-CRM-5) | **Green API's CLASSIC instance API** (QR-paired number), not WABA | Owner decision. The clinic connects its EXISTING WhatsApp number by scanning a QR: no Meta Business verification, no template pre-approval, no per-message pricing — and free-text sending stays legal, which WABA's 24-hour session window would otherwise restrict. It matches how these clinics already work, with staff messaging owners from the clinic phone. **Trade-off accepted for v1: this is an UNOFFICIAL gateway and account-ban risk is real**, borne by the clinic's own number. A WABA adapter is [P2] behind the same provider abstraction. |
| 18 | CRM-P4 | §9.2 assumes «inbound webhook → timeline» | **inbound is POLLING** (`ReceiveNotification` + `DeleteNotification`) on the existing job runner; a webhook route may be added later as an ADDITIVE, config-selected second path | Owner ruling: webhooks cannot be assumed to reach this deployment reliably in v1, and no phase deliverable may depend on a public URL. This also settles F15 in THIS phase rather than CRM-P5 — the CRM polling step joins the existing runner. |
| 19 | CRM-P4 | §0.1's NFR conventions say nothing about secrets at rest | **`CRM_SECRET_KEY` + `secret-box` (XChaCha20-Poly1305)** — the repo's first encryption at rest | Green API credentials are keys to a live WhatsApp account per clinic; plaintext in a multi-clinic database is not defensible (owner Q3). The verification pass found **no encryption precedent anywhere**: `@noble/ciphers` was a direct dependency imported by nothing, and `Account.accessToken/refreshToken/idToken` (live Google OAuth tokens) are stored plaintext today as better-auth ships them. No crypto was invented — the unused dependency was adopted. Scope stated honestly in the module: it protects a leaked DB dump, NOT host compromise, since the key sits beside `DATABASE_URL`. The plaintext OAuth tokens remain a separate hardening item. |
| 20 | CRM-P4 | §11.1 names FOUR navigation items | **«واتساب» is a SIXTH row**, under the settings grouping | §9.2's channel needs somewhere to paste the provider's per-clinic credentials, and rule 12 does not accept a setup path that exists only in the API. Same reasoning that made «قوالب البريد» the fifth row (row 15). Gated by `crm_settings.view_full`, so a user holding only lead/deal rights never sees it. |
| 21 | CRM-P5 | §10.2 says «reuse the clinic's working-hours/holiday structures if they exist; only if none exist does the phase add them» | **Half of it exists.** `ClinicSchedulingSettings` already carries `workDays` + the morning/evening shift windows, so the SLA clock reuses them and CRM adds NO working-hours table. There is **no clinic holiday/closure calendar anywhere in the schema**, and CRM does not add one: v1 counts working time from workDays + shifts only. | Owner decision. A holiday calendar is a CLINIC-domain concept — scheduling and staff want it too — so a CRM-private one would guarantee a later migration to unwind. Filed as **[P13.16]** (cross-module, owner-decided); CRM's SLA consumes it the day it exists. Until then an SLA target can expire on a day the clinic was shut, and that is a known, accepted v1 gap rather than an oversight. |
| 22 | CRM-P5 | §10.2's «response-by computed on working time» does not define the working day | **Shifts ARE the working windows when `shiftsEnabled`** — the midday gap between the morning and evening shift does not advance the SLA clock. When shifts are off, the whole `workDay` counts. **And a response arriving OUTSIDE working hours is recorded at its REAL timestamp**; it simply does not advance the elapsed clock. | Owner ruling. The last clause is the load-bearing one: rounding an out-of-hours reply forward to the next opening would make the timeline lie about when a human actually replied — and the timeline is evidence (§8.3). The clock and the record answer two different questions and must not be conflated. |
| 23 | CRM-P5 | §11.3 gives saved views a `public` flag without saying who may set it | **Creating and pinning a PRIVATE view is free to any member; publishing (`public = true`) requires `crm_settings.edit`.** | Owner ruling, explicitly informed by [P13.13-SEC]: a public view is shared clinic state that appears on colleagues' screens, and this repo has just found one «any member can change what everyone sees» surface too many. Cheap to relax later, expensive to retract. |
| 24 | CRM-P6 | §11.1 names FOUR navigation items; §2 describes five master types as data | an **eighth** row, «الإعدادات» → `/crm/settings`, holding all five masters AND §14's module switch | Two surfaces were missing, not one. (a) The five masters shipped in CRM-P0 with complete, gated HTTP routes and no screen — row 15 predicted this and deferred it here. (b) `enableCrmModule` itself had no surface either: turning the module on meant calling `PATCH /crm/settings` by hand, while `assertCrmEnabled`'s own Arabic refusal told the user to go to «إعدادات الوحدة» — a screen that did not exist. One screen rather than five, mirroring the server's decision to fold the five types into a single four-file resource: five screens would repeat one table five times. `crmWhatsappProvider` is deliberately NOT on it — it is set in «واتساب» beside the credentials it is meaningless without. |
| 25 | CRM-P6 | §0.3 «flag OFF ⇒ zero observable change anywhere» | `GET /crm/reports` **answered while the module was off** — fixed in [CRM-P6.2] | The route shipped in [CRM-P6.1] without the `assertCrmEnabled` call every other CRM controller makes. Nothing failed: the reports were correct, the permission gate held, and the fast suite was green — the module was simply not inert. Caught by writing this phase's §16 walkthrough as an executed script (rule 12) rather than as prose, because the first step it needed was «turn the module on», which only has meaning if the previous state refuses. Both directions are now pinned (steps 1 and 8). |
| 26 | CRM-P6 | §3.2 «Assignment (v1 = manual)»; §11.4 puts the assignee in the entity-page header | **assignment had NO user interface at all** until [CRM-P6.3] | `POST /crm/leads/:id/assign` and `POST /crm/deals/:id/assign` shipped gated and tested in CRM-P1/P2, and the client hooks `useAssignLead`/`useAssignDeal` were written — **and never called by any component**. The headers rendered the assignee as read-only text, so a real clinic could not assign anything, the inbox notification of §3.2 could never fire from the product, and §12's per-agent table was structurally empty. Found the same way as row 25: the §16 walkthrough needed to assign a lead to make the agent table non-empty, and there was no product action to describe. This is the exact failure mode rule 12 was written for — a green service test says nothing about whether a user can reach the feature, and here even the controller test passed while the feature was unreachable. |
| 27 | CRM-P6 | §11.3 «per-user saved view … with pinned + public flags» | **saved views had no user interface either** until [CRM-P6.3] | The second instance of row 26, found by sweeping the module for routes with no call site rather than by luck. `GET/POST/PATCH/DELETE /crm/views` shipped in [CRM-P5.5] — gated, owner-scoped, with the §17.2 row 23 publish rule enforced — and nothing in the client ever called them, so §11.3 existed entirely in the API. «العروض المحفوظة» now sits in both toolbars. Two deliberate v1 narrowings, recorded so they are not read as oversights: `sort` and `visibleColumns` are saved EMPTY, because neither screen has a custom sort or a column picker to capture, and storing a value with no source would be inventing data; and applying a view REPLACES the filter set rather than merging into it, since a view that leaves a stale filter standing shows something other than what was saved. |
| 28 | CRM-P5 | §11.1 names FOUR navigation items; rows 15, 20 and 24 chart the growth 4 → 5 → 6 → 8 | the group has **EIGHT** rows, and the **seventh — «سياسات الاستجابة» → `/crm/sla-policies`, shipped in [CRM-P5.6]** — was never given a row here | A bookkeeping gap, recorded because the progression in this table had a hole in it: rows 15 and 20 named the fifth and sixth items, row 24 named the eighth, and the seventh was a real shipped screen nobody wrote down. Same reasoning as the others — §10.1's policies are masters under the `crm_settings` grouping, and a target computed in WORKING minutes needs a screen that says so, which rule 12 will not accept as an API-only surface. The final list, in sidebar order: العملاء المحتملون · الصفقات · المهام · التقارير · قوالب البريد · واتساب · سياسات الاستجابة · الإعدادات. |
| 29 | CRM-P6 | §10.3 provides a manual «تم الرد»; §10.4 puts the SLA badge on «القوائم واللوحات وصفحة الكيان» | **§10's UI half was half-built**: `POST /crm/{leads,deals}/:id/mark-responded` had NO caller, and `SlaBadge` rendered in the two list tables only — absent from both kanbans and both entity pages | The worst of the three uncalled-route findings, because it corrupts a MEASUREMENT rather than merely hiding a feature. The endpoint's own comment says why it exists — «أكثر الردود في هذه العيادات تقع خارج النظام — مكالمة، أو رسالة من هاتف الموظّف» — so with no caller, every out-of-system response was recorded as a **permanent breach**: §12's SLA figures were systematically wrong in exactly the case the endpoint was built for, and wrong in the direction that looks like poor service. The badge gap compounded it: the boards where work is actually followed day to day showed nothing at all. Fixed by pairing them in ONE component (`SlaResponseControl`) — the action appears exactly when the badge says «بانتظار الرد» or «تجاوز المهلة», so no screen can ever show one without the other again. |
| 30 | CRM-P6 | BR-C3.2 — a duplicate mobile is «a warning **with the existing lead linked**, not a refusal» | `GET /crm/leads/duplicate-check` had no caller; the post-create toast NAMED the match but did not link it, and only after the duplicate had been created | Half the rule was met and half was not, which is why it survived three reviews. The quick-create dialog now asks while the mobile is being typed and renders a link to the match, so «هل هو نفسه؟» is answerable BEFORE a second row exists. Saving stays permitted — refusing is what pushes reception into faking the number, which is the reason BR-C3.2 is a warning in the first place. |

Backfill anchors approved for the phases that add their tables (§13, recorded here so CRM-P1/P2 do not re-litigate): `crm_leads.*` and `crm_deals.*` ← `patients_owners.*`; `crm_tasks.*` ← `tasks.*`; CRM reference data ← `patients_owners.edit`. Nearest-authority, action for action, no role's authority widening.

## §18. Lessons imported from MI (bind as rules)

18.1 Count call sites yourself; the BRD's numbers are claims until verified. 18.2 List-of-types drift: any enum/list consumed in >1 place is declared once + parity audit test (MI-P5 lesson). 18.3 New doctypes ship with their permissions backfill or existing roles never see the module (MI post-launch lesson). 18.4 Smoke-test with a human before merge; tests don't see locales, empty states, or "old clinic receives new module" paths. 18.5 i18n keys sweep is part of every UI phase's exit (the common.save lesson).

18.6 **A commitment filed only in the decision log is invisible to the phase that owes it** (CRM-P6 lesson; §17 CRM-P6 decisions of record). §17 records *why*; §15 and §16 are what a phase is *built from*. When a decision defers work to a later phase, write it into that phase's §16 row and, if it needs a column, into §15 — then record the reasoning in §17. Filing it in §17 alone is how CRM-P5 closed without §8.2's overdue notice and CRM-P6 shipped the migration §15 had promised would not exist.

18.7 **A gated, tested endpoint is not a feature until something calls it** (CRM-P6, §17.2 rows 26, 27, 29, 30). Every phase exit must ask, of each route the phase added, WHICH component invokes it — the answer is either a file path or a defect.

**And the sweep must be MECHANICAL, not a reading.** The first pass at this asked the question by reading the code and found two uncalled routes (rows 26–27). It missed three more (rows 29–30), including the one that corrupted a measurement rather than merely hiding a feature. The second pass ENUMERATED all 84 CRM routes from the controllers and probed the client for each — that is what found the rest, in one pass, in under a minute. A sweep you perform by remembering which routes exist can only find the routes you remember. Script it, and treat a route whose call-site count is zero as a defect until a file path is produced or a reason is written down.

The tally is the argument: **five uncalled routes across a seven-phase module**, from one to five phases old, all with green tests. This is not a rare slip — it is the default outcome of building the server half first and letting the walkthrough be prose.
