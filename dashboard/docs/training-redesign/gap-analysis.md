# Training Module Redesign — Gap Analysis

> Target: rebuild `/services/training` create/edit as a **full-screen 4-step wizard** (Trenning-inspired), Arabic/RTL, with learner assignment, auto-assign rules, completion settings, certificates, and an upgraded courses list.
>
> This document compares the **current implementation** against the **target spec** and drives the migration plan in [`implementation-plan.md`](./implementation-plan.md).

---

## 1. Current implementation (as-built)

### Routing & shell
- Single route: [`src/routes/_pathless-layout/services/training.tsx`](../../src/routes/_pathless-layout/services/training.tsx) — renders `TrainingHeader` (tabs) + `TrainingView`, inside the authenticated sidebar layout.
- Create flow is a **side sheet** ([`add-course-sheet.tsx`](../../src/features/services/training/components/add-course-sheet.tsx)), 2 internal steps:
  1. **Step 1** — course info form (`max-w-[578px]`): auto ID placeholder, name, target department, type, description. Footer: التالي (⌘↵) / حفظ كمسودة / إلغاء + "حفظ ومتابعة الإضافة" checkbox.
  2. **Step 2** — course builder (`max-w-[1574px]`): right = "باني الدورة التدريبية" (units/lessons accordion + AI button), left = "معاينة الدورة التدريبية" (cover upload + live preview).
- Step 1 **creates the course on the server immediately** (draft), then opens the builder — this draft-first pattern is worth keeping.

### Data model ([`prisma/schema.prisma`](../../prisma/schema.prisma))
```
Course (course)         → id, code(TR-XXXX), clinicId, name, department(free-text),
                          type(CourseType), description, coverKey(S3), status(CourseStatus),
                          createdAt, updatedAt
CourseUnit (course_unit)→ id, courseId, title, order
CourseLesson(course_lesson)→ id, unitId, title, type(LessonType), order, description,
                          mediaSource, mediaKey, mediaUrl, durationSeconds, content
```
- Enums: `CourseType` (INTERNAL/WORKSHOP/ONLINE/CERTIFICATION/CONFERENCE), `CourseStatus` (DRAFT/PUBLISHED/ARCHIVED), `LessonType` (TEXT/VIDEO/DOCUMENT/QUIZ/SURVEY/AUDIO), `LessonMediaSource` (DEVICE/URL).
- Quizzes have **no tables** — stored as JSON in `CourseLesson.content` for `type=QUIZ`.

### Server ([`src/server/training/`](../../src/server/training/))
- Full CRUD for courses / units / lessons via Elysia + `requireClinic` macro. DAO is Prisma-only. Types are Zod-first + Prisma-derived (follows repo conventions well).
- `stats` endpoint: total / completed(published) / inProgress(draft) / running(published w/ lessons).

### Supporting systems (reusable — do NOT rewrite)
| Concern | What exists | Path |
|---|---|---|
| Learners | `Staff` model — `avatar`(S3 key), `branchId`, `roleId`, `primary/secondarySpecializationId`, clinic-scoped | `prisma/schema.prisma:595` |
| Staff list API | `GET /staff` → `staffDao.list` (⚠ `staffSelect` omits `avatar`) | `src/server/staff/` |
| Branch | `Branch` model + `GET /branches` | `prisma/schema.prisma:452` |
| Skills/tags | `Specialization` (primary/secondary on Staff) | `prisma/schema.prisma:522` |
| Enrollment pattern to mirror | `CarePlanEnrollment` (status lifecycle + child progress rows) | `prisma/schema.prisma:2152` |
| M:N assignee analog | `Task.assignees User[]` implicit M:N | `prisma/schema.prisma:281` |
| Upload | presign → client PUT → store **S3 key**; render via `getFileUrl()` / `GET /uploads/serve?key=` | `src/server/uploads/`, `src/lib/file-url.ts`, `use-upload-file.ts` |
| Stepper primitive | `stepper.tsx` compound component (active/completed/loading states) | `src/components/ui/stepper.tsx` |
| Full-screen wizard reference | Booking wizard (multi-step takeover, per-step Zod gating, sticky footer) | `src/routes/book.$slug.tsx`, `src/features/booking/components/wizard/` |
| Success toast | `showSuccessToast(msg, opts)` (green check) | `src/components/common/success-toast.tsx` |
| AI plumbing | `resolveModel(provider)` via Vercel AI SDK (`@ai-sdk/anthropic`/`openai`) | `src/server/agent/core/provider.ts` |
| Theme tokens | single source `src/styles.css`, Tailwind 4 `@theme inline`, `--primary: #4f6ae0` (indigo) | `src/styles.css` |

---

## 2. Gap matrix — spec vs current

### A. Data-model gaps
| Target field / table | Status | Notes |
|---|---|---|
| `Course.category` (التصنيف) | ❌ missing | add column |
| `Course.priority` (عاجل/غير عاجل) | ❌ missing | new enum `CoursePriority { URGENT, NORMAL }` |
| `Course.estimatedDurationWeeks` | ❌ missing | Int |
| `Course.language` | ❌ missing | enum `CourseLanguage { AR, EN }` (or string) |
| `Course.cover` | ✅ exists as `coverKey` | reuse |
| `Course.orderMode` (تسلسلي/حر) | ❌ missing | new enum `CourseOrderMode { SEQUENTIAL, FREE }` |
| `Course.status` (draft/published) | ✅ exists | reuse |
| `Course.startDate / dueDate / timezone` | ❌ missing | from Step 3b |
| `course_levels` (مبتدئ/متوسط/متقدم grouping) | ❌ missing | **hierarchy decision — see §4.1** |
| ordered `course_contents` (position) | ⚠ partial | `CourseUnit.order` exists; needs `contentType`, `status`, `levelId`, `+ button` insert positions |
| `course_assignments` (course↔staff + source/progress/completedAt) | ❌ missing | mirror `CarePlanEnrollment` |
| `course_auto_assign_rules` (entityType/entityId) | ❌ missing | **branch/dept/group decision — see §4.2** |
| `course_completion_settings` (cert + re-enroll + gamification + review) | ❌ missing | 1:1 with course |
| Certificates (per-learner issuance record) | ❌ missing | + generation; **no PDF lib exists** |

### B. Flow / step gaps
| Spec step | Status |
|---|---|
| Full-screen wizard shell w/ persistent top bar, stepper, progress underline, close→save-draft | ❌ (currently a sheet) |
| Step 1 — basic info **+ new meta fields** (category, priority, duration, language, cover) | ⚠ 4 of 9 fields exist |
| Step 2 — content builder w/ **level headings, content cards, type badges, status pills, +-between-cards, order mode, meta-tag header** | ⚠ builder exists but flat units/lessons; needs level layer + card redesign |
| Step 3a — **choose learners** (employee card grid, selection, side panel, enroll-all, auto-assign modal) | ❌ entirely new |
| Step 3b — **assign time** (dual inline calendars, time + ص/م, timezone note) | ❌ entirely new |
| Step 4 — **completion** (certificate / re-enrollment / gamification / review toggle-cards) | ❌ entirely new |
| Finish — blocking loading overlay → list + success toast | ❌ new (toast helper exists) |
| Courses list — cards w/ cover, meta, **assigned avatar stack**, **completion ring**, filters/chips/view-toggle | ❌ **list currently hardcoded to empty** (`training-view.tsx:45 const courses = []`) — never renders real courses |

### C. Component gaps
| Needed | Status |
|---|---|
| Stepper | ✅ reuse `stepper.tsx` |
| Calendar / date picker | ✅ `calendar.tsx` |
| Avatar + AvatarGroup stack | ✅ `avatar.tsx` |
| Radio choice cards (re-enrollment) | ✅ `radio-group-choice-card.tsx` |
| Switch/toggle (completion cards, auto-assign) | ✅ `switch.tsx` |
| **Completion ring (donut %)** | ❌ build SVG `stroke-dasharray` primitive (only linear `progress.tsx` + recharts pie exist) |
| **Colored-initials avatar helper** | ❌ no hash→color helper; only solid `bg-primary` initials |
| **Employee selection card grid + sticky assigned panel** | ❌ new |
| **Auto-assign rules modal** | ❌ new |
| **Certificate template preview modal** | ❌ new (no PDF/cert infra) |
| Accordion | ❌ none (builder rolls its own; fine) |

### D. Design-token / feel gaps
- Primary is already indigo (`--primary: #4f6ae0`) — the reference feel is achievable.
- ⚠ **Do NOT retune global `--primary`/`--background`** — that recolors the entire app. The Trenning "light canvas + floating white card + violet accents" feel must be **scoped to the training module** (wrapper with local CSS-var overrides or module-local utility classes), per the spec's "shift the module" wording.
- Builder currently uses many hardcoded micro-sizes (`text-[11px]`, `#E5E5E5`…). New wizard should lean on tokens + a small module theme wrapper for consistency.

---

## 3. Integration constraints (must respect)
1. **Migrations = hand-written idempotent SQL.** Never `prisma migrate dev` (shared Neon DB wants to reset/wipe). Local dev is on local Postgres. Each change: edit `schema.prisma` → `bunx prisma generate` → hand-write idempotent `migration.sql` (`CREATE TABLE IF NOT EXISTS`, enums via `DO $$…EXCEPTION WHEN duplicate_object`, guarded FKs) → apply with `bunx prisma db execute --file` → optional `migrate resolve --applied`. CI runs `prisma migrate diff` and fails on uncaptured schema changes.
2. **Type reuse rules** (AGENTS.md): forms = `z.infer`, responses = `Prisma.XGetPayload`, DAO inputs = `Prisma.XUncheckedCreateInput` narrowed, enums re-exported from generated Prisma. No hand-written duplicate types.
3. **No job queue exists.** Auto-assign rules must run **synchronously** inside `staff.controller.ts` POST/PATCH (mirroring the `inboxDao.emit*` convention), not a background worker.
4. **AI button is a dead stub** — wiring it is optional/out-of-scope for parity; if wired, reuse `resolveModel()`. Don't break its presence.
5. **No certificate/PDF library** — certificate "issuance" is a DB record + an in-app HTML/template preview; actual PDF export is a follow-up unless required.
6. RTL correctness per AGENTS.md rules (logical props, DOM order = flow direction, one close button).

---

## 4. Open decisions (blocking — need your call before backend work)

### 4.1 Content hierarchy: how do "levels" relate to existing units/lessons?
The spec's Step 2 groups **content cards** under **level headings** (مبتدئ/متوسط/متقدم); each card shows a type badge (صفحة/درس/اختبار) and "عدد الفصول" (chapter count).
- **Option A (recommended, least churn):** insert a `CourseLevel` layer above the existing structure → **Course → CourseLevel → CourseUnit (= "content card", add `contentType` + `status`) → CourseLesson (= "chapter")**. "عدد الفصول" = lessons count. Preserves all existing builder/lesson/quiz code.
- **Option B (lightest DB):** no new table — add `CourseUnit.level` (string, default "عام") and group units by it in the UI. Cheapest, but "level" isn't a first-class entity (can't reorder/rename cleanly).
- **Option C (literal to spec):** new `course_levels` + new `course_contents` replacing units/lessons — most faithful naming but **discards working unit/lesson/quiz code** and needs data migration.

### 4.2 Auto-assign entity types: branch / department / group
Spec rule: "عندما تتم إضافة الموظف إلى [الفرع / القسم / المجموعة] = [قيمة / الكل]". In this codebase **Branch exists**, but **there is NO Department and NO Group table** (Staff has `roleId` + `specializationId`; `Course.department` is free-text).
- **Option A (recommended):** map the three UI options to what actually exists — **الفرع → `Branch`**, **القسم → `StaffRole`**, **المجموعة → `Specialization`** — all real, clinic-scoped, already on `Staff`. Rules become fully functional immediately.
- **Option B:** introduce a real `Department` (and optional `Group`) model now — larger scope, touches staff onboarding.
- **Option C:** keep department/group as free-text match against `Course.department` — brittle, not recommended.

### 4.3 Wizard routing
Full-screen takeover needs auth but **no sidebar**. Options:
- **Option A (recommended):** new authenticated top-level route outside `_pathless-layout` (e.g. `src/routes/training/course.$courseId.tsx`) reusing the auth guard — mirrors how `book.$slug.tsx` is a top-level takeover.
- **Option B:** overlay/portal rendered over the existing training page (no route change) — simpler back/close, but not deep-linkable.

### 4.4 Scope of "backend for everything"
The spec asks for certificates generation + gamification + review + re-enrollment. Recommend **schema + settings + issuance records + in-app preview now**, and **PDF export + the auto-assign-on-staff-move hook** as clearly-bounded follow-ups within their phases (called out, not silently dropped).

---

## 5. Reuse summary (what we keep)
- ✅ `add-course-sheet.tsx` Step-1 form fields & Zod schema → become **Step 1** of the wizard (extended with meta fields).
- ✅ `course-builder-step.tsx` units/lessons/quiz builder + live preview → become **Step 2** (wrapped in the level layer + card restyle).
- ✅ Entire `src/server/training/` CRUD → extended, not replaced.
- ✅ `stepper.tsx`, booking-wizard structure, `calendar.tsx`, `avatar.tsx`, `radio-group-choice-card.tsx`, `switch.tsx`, upload hooks, toast helpers.
- 🆕 New: assignment/levels/completion/certificate tables + APIs, Step 3 & 4 UIs, completion-ring primitive, colored-initials helper, list-page card rendering + aggregates.
