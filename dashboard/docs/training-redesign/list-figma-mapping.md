# Courses List Page — Figma → Data → Component mapping

Figma: `Elite-Vet-SaaS-OS-Design`, node **4302-490223** ("الدورات" courses list page).

> **Design source note:** the Figma MCP server was not available as a callable tool
> in the implementation session, so this mapping was built from the node's full
> generated-CSS spec (pasted inline into the task) plus the already-app-styled list
> that earlier phases shipped. Visual parity was verified with RTL screenshots at the
> end (see PR #62). Where the Figma used raw hex values, we map to the nearest existing
> Tailwind token — never a hardcoded hex.

## Token mapping (Figma raw → our token)

| Figma value | Token / class |
|---|---|
| `#4F6AE0` (primary button) | `--primary` → `bg-primary` / `text-primary-foreground` |
| `#08090A` (primary text) | `--foreground` → `text-foreground` |
| `#5C5C5E` (column header) | `text-muted-foreground` (closest; header uses `font-semibold`) |
| `#9B9B9D` (placeholder/muted) | `text-muted-foreground` |
| `#6B7280` (inactive tab text) | `text-muted-foreground` |
| `#1F2937` (active tab text) | `text-foreground` |
| `#E5E5E5` / `#D8D8D8` (borders) | `border-border` |
| `#EF4444` (badge/destructive) | `text-destructive` / `bg-destructive` |
| `#EBEBEB` (row-menu hover) | `bg-muted` |
| radius `3–4px` | `rounded-md` / `rounded-lg` (existing table idiom) |
| font `IBM Plex Sans Arabic` | app default font (already global) |

## KPI cards row (Figma `Frame 1984079477` — 4 cards)

Each card: white bg, `border-border`, `rounded`, `p-3`, `justify-between`; big value
(bold 14px) + icon + label (12px). Rendered via existing `Stats` (`variant="compact"`).

| # | Figma label (real) | Data source | Notes |
|---|---|---|---|
| 1 | إجمالي الدورات | `stats.totalCourses` = `course.count({clinicId})` | |
| 2 | # المستفيدين | `stats.assignedStaff` = distinct `staffId` in `course_assignment` | "beneficiaries" = distinct assigned staff |
| 3 | مكتمل | `stats.completedAssignments` = `course_assignment.count(status=COMPLETED)` | real; 0 until a learner UI completes assignments |
| 4 | جاري تنفيذها | `stats.inProgressAssignments` = `course_assignment.count(status IN ASSIGNED,IN_PROGRESS)` | **judgment:** "in-progress" = not-completed assignments (there is no learner UI to move ASSIGNED→IN_PROGRESS yet, so counting IN_PROGRESS only would always read 0) |

## Tabs (Figma header — `الكل` / `دوراتي` / `مكتبة الدورات`)

Locked decision #4 overrides the Figma label `دوراتي`:

| Tab | Behavior | Source |
|---|---|---|
| الكل | all courses | client filter (no status filter) |
| دوري | **DISABLED**, tooltip "قريباً" | recurrence is a future feature — not modeled (code comment) |
| مكتبة الدورات | `status = PUBLISHED` | client filter |

> **Judgment (flagged):** Figma shows `دوراتي` ("my courses") but the task locks the middle
> tab as `دوري` (recurring), disabled with "قريباً". Task wins; implemented as disabled.

## Toolbar (Figma `Frame 1984079599`)

- **إضافة دورة جديد** — primary button (`bg-primary`), opens `AddCourseSheet` (create).
- **مساعدك / نساعدك** — placeholder button, no target yet → renders but inert (comment).
- **التصفية / فلترة** — filter popovers → real filters: `type`, `status` (tab), `locationMode`, `trainer`.
- **العرض** — grid/list view toggle (kept from existing).
- **تصدير** — CSV export of the current filtered rows (client-side).
- **search** (380px, "ابحث عن اسم الدورة / المعرّف...") → name/code filter, `/` kbd hint.

## Table columns (RTL, right → left) — Figma `Frame 1984079680`

| # | Figma header | Data source | Component / render |
|---|---|---|---|
| 1 | اسم الدورة / المعرّف | `name` + `code` | two-line cell (name bold + code muted) |
| 2 | تكلفة التدريب | `trainingCost` (Int?, new) | number + "ريال"; `—` when null |
| 3 | # نوع التدريب | `contentCount` (units count) | **only real numeric source** = content count; `—` if 0 (comment: no other real source) |
| 4 | نوع الدورة | `type` (CourseType) | label via `COURSE_TYPE_OPTIONS` |
| 5 | الجهة / اللغة | `institution` (String?, new) + `language` | institution line + language chip; `—` when institution null |
| 6 | مكان الدورة | `locationMode` (enum ONSITE/ONLINE/HYBRID, new) | localized label; `—` when null |
| 7 | المدربين | `course_trainer` → staff (id/name/avatar) | `AvatarGroup` stack; `—` when empty |
| 8 | فترة الدورة | derived `startDate`→`dueDate`, fallback `estimatedDurationWeeks` | months/weeks label; `—` when neither set (no new column) |
| 9 | # المستفيدين | `assignedCount` | number |
| 10 | التقييم (★) | avg + count from `course_review` | stars + "(n)"; rendered only when `reviewCount>0`, else `—` (never fake) |
| 11 | آخر تحديث | `updatedAt` | relative/short date |
| 12 | تاريخ الإنشاء | `createdAt` | short date |
| 13 | حالة الدورة | `status` (CourseStatus) | status pill (منشور/مسودة/مؤرشفة) |
| 14 | الإجراءات | — | row menu (تعديل / حذف) |

## New data (locked decisions 1–3)

- `Course.trainingCost Int?`, `Course.institution String?`, `Course.locationMode CourseLocationMode?`
  (enum `ONSITE|ONLINE|HYBRID`).
- `course_trainer` join (courseId+staffId+order, unique pair) → المدربين column + Step-1 multi-select.
- `course_review` (assignmentId unique, rating 1–5, comment?) → التقييم column; review-submission
  endpoint guarded (assigned staff only, reviewEnabled + COMPLETED).

## Endpoints touched

- `GET /training/courses` — one query returns all columns (trainers, avg rating + count,
  assignedCount, completionPct, new meta). No N+1.
- `GET /training/courses/stats` — 4 KPI aggregates (redefined per table above).
- `PUT /training/courses/:id/trainers` — set trainer list `{ staffIds }`.
- `POST /training/courses/:id/reviews` — submit a review (guarded).
