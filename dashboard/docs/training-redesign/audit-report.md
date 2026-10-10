# Training Module — Full A‑to‑Z Audit Report

**Branch:** `feat/training-redesign` · **Repo:** elite-vet · **Scope:** training module (frontend + backend) · **Environment:** LOCAL only (`localhost:3001`, local Postgres `elite_vet`).
**Nature:** AUDIT — nothing was fixed/refactored. Findings below are for a separate decision.
**Live test identities created:** two fresh clinics (User A, User B) via the real sign‑up API + one `AUDIT-Course-A`. All artifacts prefixed `AUDIT-` (cleanup list at the end).

---

## 1. Executive verdict

**Original (pre‑fix): NOT‑READY.** **Post‑remediation: READY‑WITH‑ACCEPTED‑GAPS.** All eight audit findings (BLOCKER→LOW) are fixed, committed one‑per‑finding, and re‑verified live against the two‑clinic setup — see §3 (each row RESOLVED with a commit hash + evidence) and the "Remediation" section. The cross‑tenant assignment BLOCKER (F1) now returns 400 for any foreign staff/entity; `/uploads/serve` requires auth (F2); lesson‑progress validates the lesson and locks completed assignments (F3); `targetRoleId` is clinic‑validated with a clean 400 (F4); publish is gated server‑side (F5); and levelId/pass‑mark/cycle‑race LOWs are closed (F6–F8). Static health remains clean (typecheck/biome/build/migrate‑diff). The global‑error‑handler Prisma‑leak follow‑up (surfaced by F4) is now also **fixed** (`384f388`, allowlist replaces the Arabic heuristic). Remaining items are **accepted gaps** (recurring "دوري", PDF export, learner portal, AI recommendations, creator field) and **one** documented follow‑up: full clinic‑scoping of `/uploads/serve` keys via a key→owner map (F2 follow‑up; `/serve` is auth‑gated today, acceptable for launch). With that understood, the training backend is production‑ready.

---

## 2. Status matrix

Legend: BE = backend, FE = frontend, Tested = how verified (LIVE API / DB / code / dev‑screenshot).

| Feature | BE | FE | Tested | Result |
|---|---|---|---|---|
| Course create (POST) | ✅ | ✅ | LIVE (201 + shape) | PASS |
| Course edit (PATCH) | ✅ | ✅ | LIVE | PASS |
| Course delete (DELETE) | ✅ | ✅ | LIVE 404 cross‑clinic | PASS |
| Course duplicate | ✅ | ✅ | LIVE 404 cross‑clinic | PASS |
| Disable (archive via PATCH status) | ✅ | ✅ | code + dev‑screenshot | PASS |
| Builder: levels/units/lessons | ✅ | ✅ | code + LIVE scoping | PASS (see FLAG‑2) |
| Learners: assign | ✅ | ✅ | LIVE re‑verified | **RESOLVED** `4ec3935` (was BLOCKER F1) |
| Learners: enroll‑all / by‑role | ✅ | ✅ | code (staff clinic‑filtered) | PASS |
| Learners: unassign | ✅ | ✅ | code | PASS |
| Auto‑assign on staff create | ✅ | n/a | code (source AUTO, try/catch) | PASS |
| Assignment time (start/due) | ✅ | ✅ | code | PASS |
| Completion settings | ✅ | ✅ | LIVE (PUT 200) | PASS |
| Certificate issuance | ⚠️ | n/a | LIVE (issued + unique ref) | PASS w/ gap (pass‑mark not enforced) |
| Reviews | ✅ | (learner UI n/a) | LIVE (guard 400 + happy 201) | PASS |
| Trainers set | ✅ | ✅ | LIVE (cross‑clinic staff filtered) | PASS |
| Publish (status→PUBLISHED) | ✅ | ✅ | LIVE re‑verified | **RESOLVED** `12b542b` (server readiness) |
| Assignment cycle | ✅ | n/a | LIVE (1→2, no unique violation) | PASS |
| Lazy re‑enrollment | ✅ | n/a | code | PASS (browse‑triggered) |
| Lesson progress (player) | ✅ | ✅ | LIVE re‑verified | **RESOLVED** `dfe333d` (was MEDIUM F3) |
| List page + KPI aggregates | ✅ | ✅ | LIVE (API==DB) + dev‑screenshot | PASS |
| Export CSV | n/a(client) | ✅ | code | PASS (client‑side CSV; not PDF) |
| Draft hydration | ✅ | ✅ | code + dev‑screenshot | PASS (not re‑run this pass) |
| Clinic scoping (courses/units/…) | ✅ | — | **LIVE (B→404 on A's course)** | PASS |
| Media serve (`/uploads/serve`) | ✅ | — | LIVE re‑verified | **RESOLVED** `49d44a3` (auth req'd; key‑scope follow‑up §4) |

---

## PART A — Static Health

Run against the working‑tree state (read‑only).

| Check | Command | Result |
|---|---|---|
| Typecheck | `bun run typecheck` (tsc --noEmit) | **PASS** — exit 0, **0 errors** |
| Lint | `bunx biome check .` | **PASS** — exit 0, **0 errors, 2 warnings** (both in training scope) |
| Build | `bun run build` | **PASS** — exit 0; only Rollup chunk‑size notice (e.g. `staff` 1.75 MB, `db` 1.06 MB, `training.index` 322 kB) |
| Migration drift | `bunx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code` | **PASS** — exit 0, **"No difference detected"** |

**Biome warnings (2, training scope, LOW):** ineffective `// biome-ignore lint/suspicious/noArrayIndexKey` suppressions at `assign-auto-rules-dialog.tsx:102` and `wizard/steps/auto-assign-modal.tsx:110` (rule not actually triggered — dead suppression comments).

**Training migrations — 3/3 applied locally, none rolled back** (verified against `_prisma_migrations`):
- `20260718180000_add_courses_units_lessons`
- `20260721120000_training_redesign_phase2`
- `20260723120000_training_list_page_data_layer`

**⚠ Environment caveat (not a training defect):** `bunx prisma migrate status` exits **1** because **7 NON‑training migrations are unapplied on the local DB** (`add_clinic_agent_settings`, `add_agent_guardrails`, `link_payroll_to_finance`, `payroll_deductions_and_recovery`, `end_of_service_settlement`, `expense_source_purchase_order`, `add_inbox_item`) — an **out‑of‑order** local state (the 2026‑07‑21/07‑23 training migrations are applied while several 2026‑07‑16→19 migrations are not). Training itself is drift‑free, but the local DB is not a faithful "all migrations applied in order" baseline. Relevant to rollout (precondition #1).

**Dead‑code scan (training scope):** no unused exports (161 named exports all referenced), no unimported files, no broken imports (the `@/generated/*` hits are false positives — alias maps to root `./generated/*`, all targets exist), no TODO/FIXME/HACK comments. **Intentional parked cluster:** the entire `src/features/services/training/wizard/` subtree (17 files) is reachable only via the parked reference route `src/routes/training/course.$courseId.tsx` (header comment "PARKED: reference implementation… no visible entry point"), created by `8fc6971`. It compiles and is registered in `routeTree.gen.ts` but has no UI entry point — effectively dead in the live UI but **retained on purpose** (explains the duplicate‑looking `*-modal`/`*-dialog` and `step-*`/`*-step` pairs: live redesign uses `components/`, parked wizard uses `wizard/`).

---

## PART B — Backend audit (live + code)

> **Re‑run post‑fix:** the full Part B endpoint sweep was executed again after the remediation commits. All checks below are green — unauth **401**; B→A course **404**; F1 assign/rule **400**; F2 serve **401** unauth / **302** authed; F3 foreign‑lesson & completed‑progress **409/404**; F4 foreign‑role **400**; F5 empty‑publish **400 NO_CONTENT**; invalid body **422**. Final gate: `typecheck` exit 0, `biome check .` 0 errors, `bun run build` exit 0.

### B.1 Unauthenticated → 401  — PASS (with ordering note)
Swept every training + course‑assignments endpoint with no cookie.
- GET/DELETE (no body) → **401** directly (e.g. `GET /training/courses` → 401, `DELETE /training/courses/:id` → 401).
- Body endpoints: TypeBox validation runs **before** the `requireClinic` resolve, so an *invalid* unauthenticated body returns **422/400** and a *valid* one returns **401** (`POST /training/courses` valid body → `401 {"message":"غير مصرح"}`). Acceptable (no data leak beyond schema shape); documented as INFO‑1.

### B.2 Clinic scoping — PASS for courses/units/levels/lessons; **FAIL for assign (FLAG‑1)**
Two real clinics (A, B). A created `AUDIT-Course-A` (`cmrxkmd44000grtzl3143du91`).
- B → A's course: `GET`=**404**, `PATCH`=**404**, `DELETE`=**404**, `duplicate`=**404**; A's course absent from B's list. **PASS.**
- **FLAG‑1 (CONFIRMED LIVE):** A `POST /course-assignments {courseId:A, staffIds:[B's staffId]}` → **201**; roster `GET /course-assignments?courseId=A` returns B's staff object `{name:"AUDIT-UserB", code:"ST-7GLZ", branch:"BR-NOHG", role:…}`. DB row: `clinicId=A, staffId=B`. Cross‑tenant PII read achieved. `assign()` validates the course but not the staff (course-assignments.dao.ts `assign`/`assignOne`). Contrast: `setTrainers` filters staff by `{id:{in}, clinicId}` and correctly dropped B's staff (`count:1`).

### B.3 Happy path → 2xx + shape — PASS
`POST /training/courses` → 201 with full course payload (code auto‑gen `TR‑9O1W`, status `DRAFT`, all meta fields). Completion `PUT` → 200. Progress `PATCH` → 200. Trainers `PUT` → 200 `{count:1}`.

### B.4 Invalid payloads → clean 4xx (not 500) — MOSTLY PASS
- Empty body `POST /training/courses {}` → **422**. `POST /training/units {}` → **400 {"message":"بيانات الطلب غير صالحة"}**. Good.
- **Finding (MEDIUM):** `POST /training/courses` with a non‑existent `targetRoleId` → **400 but with a RAW Prisma error string** leaking internal file paths and the `db.course.create()` invocation (`Foreign key constraint violated on the constraint: course_targetRoleId_fkey`). Not a 500, but an info leak + no clinic validation of `targetRoleId`.
- **FLAG‑3 (CONFIRMED LIVE):** `POST /course-assignments/:id/lesson-progress` with a **nonexistent** `lessonId` → **500** (uncaught FK error). With a **foreign** (other course/clinic) `lessonId` → **200** accepted; because course A has 0 lessons the recompute set the *completed* assignment back to `ASSIGNED/0%` while the previously‑issued certificate row (`AUDIT-DWYE`) remained → state corruption + orphan certificate. No lesson↔assignment‑course validation.

### B.5 Business guards
| Guard | Result | Evidence (LIVE unless noted) |
|---|---|---|
| Review — reviewEnabled=false | PASS | `POST …/reviews` → **400 "التقييم غير مفعّل لهذه الدورة"** |
| Review — caller not assigned / not COMPLETED | PASS (code) | filtered by session staff + `status:COMPLETED`; else 403 |
| Review — happy (assigned+completed+enabled) | PASS | → **201** |
| Publish readiness | **GAP** | PATCH flips `status:PUBLISHED` unconditionally; DAO has no readiness check (course can publish with 0 units/lessons/trainers) |
| Auto‑assign on staff create | PASS (code) | `runAutoAssign` after `staffDao.create`, source `AUTO`, wrapped in try/catch so failure can't break staff creation |
| Assignment cycle | PASS | complete → re‑assign → rows `cycle 1 (COMPLETED)` + `cycle 2 (ASSIGNED)`, no unique violation |
| Lazy re‑enrollment | PASS (code) | `applyDueReEnrollments` runs at top of `GET /courses` + `GET /courses/:id`, `.catch(()=>{})`, gated by reEnrollMode/date |
| Certificate issued + unique ref | PASS | completion → `course_certificate` row `referenceNumber=AUDIT-DWYE` (unique), idempotent upsert on assignmentId |
| Certificate pass‑mark logic | NOT‑IMPLEMENTED | `certPassMark` only stored, never compared; completion is pure lesson‑% (no score model) → cert issues regardless of pass mark |

Full per‑endpoint auth/scoping/validation table (code analysis) is in **Appendix B‑code** below.

---

## PART C — Frontend E2E

**Coverage note (honest):** no `puppeteer`/`playwright` is installed and driving an authed headless session via raw CDP cookie‑injection was not run in this pass. The frontend was instead verified through (a) component‑level RTL screenshots captured while each piece was built this session, and (b) the user's own continuous live testing on `localhost:3001` this session. A formal fresh‑session, step‑by‑step create→draft→publish E2E with milestone screenshots was **not re‑executed** in this audit and should be run before sign‑off.

Verified‑by‑development (rendered correctly, RTL): list page (KPI cards, table, tabs, search/filters, view toggle, pagination), row actions dropdown (فتح/تعديل/استنساخ/تعطيل/حذف), delete dialog, disable dialog + status→"معطلة", clone inline‑row + success toast + undo, course detail page (breadcrumb+tabs, KPI, roster table with status‑based action button), assign‑employee panel, course‑details left sheet, centered course‑player dialog.

Not‑verified‑this‑pass (needs formal E2E): draft hydration of every field across steps; empty‑course publish → jump‑to‑step‑2 inline error (server has **no** such guard — Publish GAP — so any block is UI‑only and must be confirmed); browser‑console error sweep; دوري tab disabled+tooltip; CSV export contents.

---

## PART D — Data integrity cross‑check — PASS

For `AUDIT-Course-A`, API list aggregates vs raw DB:
| Field | API | DB raw | Match |
|---|---|---|---|
| assignedCount | 3 | 3 assignment rows | ✅ |
| completionPct | 0 | avg(progress)=0 | ✅ |
| contentCount (units) | 0 | 0 | ✅ |
| reviewCount | 1 | 1 | ✅ |
| avgRating | 4 | 4.0 | ✅ |

`course_trainer` = exactly the 1 clinic‑valid staff after the cross‑clinic PUT (B's staff filtered). Assignment source/status/cycle rows match the operations performed. Certificate row present with unique reference. (The lone integrity anomaly is FLAG‑3's orphaned certificate after the foreign‑lesson reset — a consequence of that finding, not the aggregation logic.)

---

## 3. Findings (by severity) — all RESOLVED

| # | Sev | Status | Commit | Regression evidence (LIVE, two clinics A/B) |
|---|---|---|---|---|
| F1 | **BLOCKER** | ✅ RESOLVED | `4ec3935` | A→B‑staff assign now **400** (was 201); mixed A+B batch **400** no partial rows; A→own **201**; auto‑assign rule with B's branch/role **400**, `entityId=null` **200**, own **200**. |
| F2 | **HIGH** | ✅ RESOLVED | `49d44a3` | unauth `/serve` **401** (was 302); authed `/serve` **302** (in‑app cookies render); presign unchanged. Follow‑up (key→owner scoping) still open — see §4. |
| F3 | **MEDIUM** | ✅ RESOLVED | `dfe333d` | foreign lessonId **404**; nonexistent **404** (was 500); PATCH progress on completed **409** + row stays COMPLETED/100 (was reset→ASSIGNED/0); mark‑lesson on completed **409**. |
| F4 | **MEDIUM** | ✅ RESOLVED | `1493af1` | foreign `targetRoleId` create **400 (clean Arabic msg)**, was raw Prisma error; nonexistent **400**; own **201**; update→foreign **400**. Repo‑wide handler leak → §4 follow‑up. |
| F5 | **MEDIUM** | ✅ RESOLVED | `12b542b` | publish empty course **400 `{reason:NO_CONTENT}`**; after unit+lesson **200**; due≤start **400 `{reason:INVALID_DATES}`**. |
| F6 | LOW‑MED | ✅ RESOLVED | `1ef97b6` | foreign `levelId` on unit create/update/reorder **400**; `levelId=null` **201**. |
| F7 | LOW | ✅ RESOLVED | `1ef97b6` | issuance now gated `progress ≥ certPassMark`; defensive (completion=100% so cert still issues today; blocks once a partial‑score model exists). |
| F8 | LOW | ✅ RESOLVED | `1ef97b6` | `assignOne` retries on P2002 (regen code + bump cycle, ≤5×); normal re‑assign still increments cycle 1→2. |
| I1 | INFO | accepted | — | Validation (422/400) precedes auth (401) on body endpoints — standard Elysia, no data leak. Unchanged. |

**All fixes sit on top of `2c5194b` (`wip(training): course player — pre‑fix checkpoint`), which isolated the in‑progress player work so each security fix is a clean, reviewable commit.**

---

## 4. Known / accepted gaps + follow‑ups

**Accepted gaps (unchanged, by design):**
- **دوري (recurring) courses** — tab disabled; no recurrence engine.
- **PDF export** — export is client‑side CSV only; no PDF.
- **Learner‑facing UI** — the player dialog is admin‑driven; no separate learner portal/auth.
- **AI report/"توصيات ذكية" button** — copy only; no AI backend.
- **Creator/created‑by field** — courses have no `createdById`; not tracked.
- ~~Server‑side publish validation~~ — **now implemented** (F5, `12b542b`).

**Open follow‑ups (documented, deliberately not built now):**
- **F2 follow‑up — full clinic‑scoping of `/uploads/serve` keys.** Today `/serve` requires auth but any authenticated user can fetch any key (keys are UUID‑prefixed, not clinic‑namespaced). *Design sketch:* add a lightweight `upload_object { key PK, clinicId, ownerType, ownerId, visibility }` row written at presign time (we already mint the key in `createPresignedUpload`); `/serve` then looks up the key and authorizes `row.clinicId === session.activeClinicId` (or `visibility='public'` for booking‑visible staff avatars, resolving the public‑booking case cleanly). Backfill legacy keys lazily on first serve. Until then, `/serve` is auth‑gated but not clinic‑scoped.
- ~~**Global error handler leaks raw Prisma messages (surfaced by F4).**~~ **✅ RESOLVED `384f388`.** `src/server/app.ts onError` previously returned `error.message` verbatim as 400 whenever it contained Arabic; Prisma errors embed Arabic schema/DAO comments (+ file paths), so raw DB errors could leak from *any* endpoint. The Arabic heuristic is replaced by an explicit allowlist (`clientFacingMessage`): only `ZodError`, our known domain error classes, or the repo's `throw new Error(<Arabic>)` convention pass through; **Prisma errors are hard‑excluded** (name `PrismaClient*` / `clientVersion`) and everything else → generic **500 "حدث خطأ غير متوقع"** with the full error server‑logged. Kept the repo's pervasive plain‑`Error`‑Arabic 4xx convention working (no regression to sales/purchasing/staff‑roles/etc.). Regression: with the F4 guard reverted in‑memory, a Prisma FK now returns 500 generic (was raw message w/ file paths); thrown Arabic errors still surface (staff‑roles duplicate → 400 "اسم الدور مستخدم من قبل"); TypeBox validation still 422.

---

## 5. Production rollout preconditions

1. **Migrations:** the 3 training migrations (`20260718180000_add_courses_units_lessons`, `20260721120000_training_redesign_phase2`, `20260723120000_training_list_page_data_layer`) must be applied — apply on staging/prod via `bun run db:migrate` (never `db:push`). No new migration is introduced by this audit. **Caveat:** the local DB is in an out‑of‑order state (`prisma migrate status` exit 1 — 7 non‑training migrations from 2026‑07‑16→19 unapplied while the 07‑21/07‑23 training migrations are applied). On a clean staging/prod, `migrate deploy` applies the full history in timestamp order; ensure those 7 earlier migrations land before/with the training ones and re‑verify `migrate diff` = 0 there (do not treat the local out‑of‑order DB as the prod baseline).
2. **Data prerequisites:** a fresh clinic has **no** `staff_role` rows until onboarding/seed; course create requires a `targetRoleId`, so provisioning must seed at least one role before the create flow is usable (related to F4).
3. **Blockers to clear before rollout:** ~~F1, F2, F3, F4~~ — **all cleared** (F1 `4ec3935`, F2 `49d44a3`, F3 `dfe333d`, F4 `1493af1`, F5 `12b542b`, LOW `1ef97b6`). Post‑fix build/typecheck/biome all pass. The only pre‑rollout security follow‑up is the F2 key→owner scoping (§4) — auth‑gated today, acceptable for launch, tighten next.

---

## 6. Test‑data cleanup note — **PURGED**

The two‑clinic fixtures used for the live audit + regression (users `audit_a_*`/`audit_b_*@test.local`, their auto‑created clinics A `cmrxkk4530005rtzliuy3eqi6` / B `cmrxkk4fm000artzlnjh0xxkb`, all `AUDIT-*` courses incl. `TR‑9O1W`, and every dependent unit/lesson/level/assignment/review/certificate/trainer/lesson‑progress row) were **deleted** after remediation via `DELETE FROM clinic WHERE id IN (A,B)` (cascades all training + staff rows) and `DELETE FROM "user" WHERE email LIKE 'audit_%@test.local'` (cascades sessions/accounts). Post‑purge verification: 0 AUDIT courses, 0 clinics, 0 users, 0 assignments remaining. **No AUDIT‑* artifacts remain in the local DB.**

---

## Appendix B‑code — per‑endpoint static analysis

_(Condensed from the backend code‑audit pass; every endpoint uses `requireClinic` except `GET /uploads/serve`. Clinic‑scoping verified in code for all reads+writes except the flags below.)_

- **FLAG‑1** `POST /course-assignments/` — course scoped, `staffIds` NOT clinic‑validated → cross‑tenant (= F1, confirmed live).
- **FLAG‑2** `POST/PATCH /training/units`, `…/contents/reorder` — `levelId` unvalidated vs course (= F6).
- **FLAG‑3** `POST /course-assignments/:id/lesson-progress` — `lessonId` unvalidated vs course (= F3, confirmed live).
- **FLAG‑4** `GET /uploads/serve` — no auth macro at all (= F2).
- Review chain, enroll‑all/by‑role (staff `{clinicId}` filtered), delete/update/detail (relation‑scoped), rules (courseInClinic) — all correctly scoped.
- Input validation: TypeBox rejects malformed `body`/`query` (422) before the DAO for reviews (rating 1‑5), progress (0‑100), assign (courseId + staffIds minItems 1) — shape only, not clinic semantics.
</content>
