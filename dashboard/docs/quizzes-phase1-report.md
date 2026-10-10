# تقرير تقني — ميزة «الاختبارات المستقلة» (Standalone Employee Quizzes)

> **الغرض من هذا المستند:** تسليم تقني لمساعد Claude يوضّح ما أُنجز في **المرحلة 1** من ميزة اختبارات الموظفين، الملفات المتأثرة، البنية، والخطوات التالية — ليُكمل من حيث توقّفنا.
> **الحالة:** المرحلة 1 (البيانات + طبقة السيرفر) **مكتملة ومطبّقة على قاعدة الديف**. المراحل 2–5 لم تبدأ بعد.
> **آخر تحديث:** بعد تطبيق migration `20260726075936_add_standalone_quiz`.

---

## 1. السياق والهدف

**Elite Vet** — تطبيق إدارة عيادات بيطرية متعدّد المستأجرين (TanStack Start + Elysia REST API + Prisma/PostgreSQL، RTL عربي).

الهدف: بناء **اختبار (اختبار موظفين) مستقل**، مُصحَّح بدرجة، يُعيَّن للموظفين، وينتهي بشاشة نتيجة كاملة.

### الوضع قبل البدء (مهم)
- كان يوجد مفهوم «اختبار» **داخل الدورات** فقط: `CourseLesson` من نوع `QUIZ` يخزّن الأسئلة كـ **JSON داخل حقل `content`**.
- **لا يوجد محرّك تصحيح/درجات إطلاقاً**: المشغّل (player) يعرض الدروس ويحسب التقدّم من **نسبة إكمال الدروس** فقط، ولا يعرض أسئلة ولا يجمع إجابات ولا يصحّح.
- `certPassMark` كان يُقارن بنسبة الإكمال، لا بدرجة اختبار حقيقية.
- زر «اختبار» في `create-content-dialog.tsx` كان **معطّلاً** بشارة «قريباً».

فمحرّك التصحيح والدرجة = **بناء جديد بالكامل** (هذا ما بدأناه).

---

## 2. القرارات المعتمدة (من المستخدم)

| القرار | الاختيار |
|---|---|
| **النطاق** | **مستقل فقط** — الاختبار غير مربوط بالدورات (لا `courseId`). |
| **أنواع الأسئلة** | `SINGLE` (اختيار واحد) و`MULTIPLE` (متعدد) تُصحَّح **آلياً**؛ `TEXT` (نصّي) يُصحَّح **يدوياً من المدير + بالذكاء الاصطناعي** (كلاهما متاح). |
| **المحاولات** | **متعددة**، عبر إعداد `maxAttempts` لكل اختبار (فارغ = بلا حد)؛ تُحتسب **أعلى درجة**. |

---

## 3. نموذج البيانات (Prisma) — ما أُضيف

كل الإضافات في `prisma/schema.prisma` ضمن قسم `// ===== الاختبارات المستقلة =====` (يبدأ ~سطر 3173)، بعد نماذج الدورات مباشرة.

### 3.1 Enums جديدة
```prisma
enum QuizStatus { DRAFT PUBLISHED ARCHIVED }
enum QuizAnswerType { SINGLE MULTIPLE TEXT }
enum QuizGradingStatus { AUTO_DONE NEEDS_MANUAL GRADED }
```
> يُعاد استخدام `AssignmentSource` (MANUAL/AUTO/ENROLL_ALL) و`AssignmentStatus` (ASSIGNED/IN_PROGRESS/COMPLETED) الموجودة أصلاً للدورات.

### 3.2 الجداول (5)

**`Quiz`** (`@@map("quiz")`) — الاختبار نفسه
- `id`, `code` (فريد، `QZ-XXXX`), `clinicId`, `title`, `description?`, `targetRoleId?` (→ StaffRole، للتعيين التلقائي/التصفية), `status QuizStatus @default(DRAFT)`
- إعدادات: `passMark Int @default(60)` (%)، `timeLimitMinutes Int?`، `maxAttempts Int?` (null=بلا حد)، `shuffleQuestions Boolean @default(false)`، `showAnswers Boolean @default(true)` (كشف الصح بعد التسليم)، `gamificationPoints Int @default(0)`
- علاقات: `clinic`, `targetRole` (relation name `"QuizTargetRole"`), `questions[]`, `assignments[]`
- فهارس: `@@index([clinicId, status])`, `@@index([targetRoleId])`

**`QuizQuestion`** (`@@map("quiz_question")`) — سؤال بمعرّف ثابت
- `id`, `quizId`, `order Int` (0-based), `text`, `answerType QuizAnswerType @default(SINGLE)`, `points Int @default(1)`, `options Json @default("[]")` (شكلها `[{ "text": "...", "correct": true }]`), `answerText?` (إجابة نموذجية للنصّي/للتصحيح بالـ AI)
- علاقات: `quiz`, `answers[]` — فهرس `@@index([quizId, order])`
- **ملاحظة تصميم:** هالمرة الأسئلة في **جدول حقيقي** (مش JSON) لأن تخزين إجابات الموظف يحتاج `questionId` ثابت.

**`QuizAssignment`** (`@@map("quiz_assignment")`) — تعيين اختبار لموظف (يحاكي `CourseAssignment`)
- `id`, `code` (فريد، `QA-XXXX`), `clinicId`, `quizId`, `staffId`, `cycle Int @default(1)`, `source AssignmentSource`, `status AssignmentStatus @default(ASSIGNED)`, `assignedAt`, `startDate?`, `dueDate?`
- علاقات: `clinic`, `quiz`, `staff`, `attempts[]`
- قيود: `@@unique([quizId, staffId, cycle])`، فهارس `[clinicId, staffId]`, `[quizId, status]`

**`QuizAttempt`** (`@@map("quiz_attempt")`) — محاولة أداء
- `id`, `assignmentId`, `attemptNo Int @default(1)`, `startedAt`, `submittedAt?`, `scorePercent Int?`, `passed Boolean?`, `gradingStatus QuizGradingStatus @default(AUTO_DONE)`, `gradedAt?`
- علاقات: `assignment`, `answers[]` — قيد `@@unique([assignmentId, attemptNo])`

**`QuizAnswer`** (`@@map("quiz_answer")`) — إجابة الموظف على سؤال
- `id`, `attemptId`, `questionId`, `selectedOptions Int[] @default([])` (فهارس الخيارات المختارة للـ SINGLE/MULTIPLE), `answerText?` (للنصّي), `isCorrect Boolean?`, `awardedPoints Int?`
- علاقات: `attempt`, `question` — قيد `@@unique([attemptId, questionId])`، فهرس `[questionId]`

### 3.3 Back-relations المضافة على جداول موجودة
- `Clinic`: `quizzes Quiz[]` + `quizAssignments QuizAssignment[]`
- `StaffRole`: `quizzesTargeting Quiz[] @relation("QuizTargetRole")`
- `Staff`: `quizAssignments QuizAssignment[]`

### 3.4 الـ Migration
- الملف: `prisma/migrations/20260726075936_add_standalone_quiz/migration.sql` (159 سطر).
- **مطبّقة فعلياً** على قاعدة الديف المحلية `elite_vet` (Postgres محلي على `localhost:5432` — **ليس** Neon المشترك).
- الجداول موجودة ومؤكّدة: `quiz`, `quiz_question`, `quiz_assignment`, `quiz_attempt`, `quiz_answer`.

---

## 4. طبقة السيرفر — وحدة `src/server/quizzes/`

اتّبعت اتفاقية المشروع (4 ملفات لكل مورد). كلها **تجتاز typecheck بلا أخطاء**.

### 4.1 `quizzes.type.ts`
- **Zod schemas** (مصدر الحقيقة لنماذج الواجهة — تُستخدم في المرحلة 2):
  - `quizOptionSchema` = `{ text, correct=false }`
  - `quizQuestionSchema` = `{ text, answerType=SINGLE, points=1, options=[], answerText="" }`
  - `createQuizSchema` = العنوان + الإعدادات + `questions[]` → `CreateQuizFormInput`
  - `updateQuizSchema` = `createQuizSchema.partial()` → `UpdateQuizFormInput`
- **أنواع مدخلات الـ DAO** (مشتقّة من Prisma عبر `Pick`/`Partial`): `QuizQuestionInput`, `CreateQuizInput`, `UpdateQuizInput`
- **select payloads** (`as const`) + أنواع الاستجابة عبر `Prisma.XGetPayload`:
  - `quizQuestionSelect` → `QuizQuestionResponse`
  - `quizSelect` (يشمل `targetRole {id,name}` + `questions` مرتّبة) → `QuizResponse`
  - `quizListSelect` (يشمل `targetRole` + `_count {questions, assignments}`) → `QuizListItemResponse`
  - مصدّرة مجمّعة كـ `quizSelects`
- `QuizStatsResponse` = `{ total, published, draft }`
- يعيد تصدير الـ enums: `QuizStatus`, `QuizAnswerType`, `QuizGradingStatus`, `AssignmentSource`, `AssignmentStatus`.

### 4.2 `quizzes.model.ts` (تحقّق TypeBox لجسم الطلب)
- `quizzes.createQuiz` و`quizzes.updateQuiz` — تستخدم `QuizAnswerType` من `@/generated/prismabox/` و`__nullable__` للحقول القابلة للـ null.

### 4.3 `quizzes.dao.ts` (Prisma فقط)
- دوال: `stats`, `listByClinic`, `getById`, `create`, `update`, `remove`, `setStatus`
- `create`/`update`: توليد `code` عبر `generateUniqueCode({ prefix: "QZ", ... })`؛ **الأسئلة تُستبدل بالكامل** عند التعديل (حذف ثم إنشاء داخل `$transaction`).
- **حرّاس متعددو المستأجرين**: `roleInClinic()` يتحقّق أن `targetRoleId` يخصّ عيادة الجلسة (يعيد `"invalid-role"`)؛ كل قراءة/تعديل مقيّد بـ `where: { id, clinicId }`.
- **فحص جاهزية النشر** `isQuizReady()`: ≥ سؤال واحد؛ لكل سؤال نصّ؛ الأسئلة الاختيارية تحتاج ≥ خيارين وخيار صحيح واحد على الأقل؛ الأسئلة النصّية يكفيها نصّ السؤال. النشر يفشل بـ `"not-ready"` إن لم تتحقّق.

### 4.4 `quizzes.controller.ts` (راوتات Elysia، prefix `/quizzes`)
كلها خلف ماكرو `requireClinic` (يقرأ `activeClinicId` من جلسة better-auth، يعيد 401 إن غابت).

| Method | Path | Body | يُرجع | أخطاء |
|---|---|---|---|---|
| GET | `/quizzes/stats` | — | `QuizStatsResponse` | 401 |
| GET | `/quizzes` | — | `QuizListItemResponse[]` | 401 |
| POST | `/quizzes` | `quizzes.createQuiz` | `QuizResponse` | 400 (invalid-role), 401 |
| GET | `/quizzes/:id` | — | `QuizResponse` | 404, 401 |
| PUT | `/quizzes/:id` | `quizzes.updateQuiz` | `QuizResponse` | 404, 400, 401 |
| DELETE | `/quizzes/:id` | — | `{ success: true }` | 404, 401 |
| POST | `/quizzes/:id/publish` | — | `QuizResponse` | 404, 400 (not-ready), 401 |
| POST | `/quizzes/:id/unpublish` | — | `QuizResponse` | 404, 401 |

- مُسجّلة في `src/server/index.ts` عبر `.use(quizzesController)` (بعد `courseAssignmentsController`).
- **تحقّق حيّ:** السيرفر يقلع (HTTP 200)، و`GET /api/quizzes` يرجّع **401** بلا جلسة (الراوت مسجّل والماكرو يعمل).
- عميل الواجهة (Treaty) بيلتقط `api.quizzes.*` تلقائياً على مستوى الأنواع.

---

## 5. الملفات المتأثرة (قائمة كاملة)

**جديدة:**
- `prisma/migrations/20260726075936_add_standalone_quiz/migration.sql`
- `src/server/quizzes/quizzes.type.ts`
- `src/server/quizzes/quizzes.model.ts`
- `src/server/quizzes/quizzes.dao.ts`
- `src/server/quizzes/quizzes.controller.ts`
- `docs/quizzes-phase1-report.md` (هذا الملف)

**مُعدّلة:**
- `prisma/schema.prisma` (5 جداول + 3 enums + back-relations على Clinic/Staff/StaffRole)
- `src/server/index.ts` (استيراد + تسجيل `quizzesController`)

---

## 6. ما لم يُنجَز بعد (المراحل التالية)

الميزة مقسّمة 5 مراحل؛ **أُنجزت المرحلة 1 فقط**.

| المرحلة | الوصف | الحالة |
|---|---|---|
| 1 | البيانات + السيرفر (schema + migration + وحدة `quizzes` CRUD/نشر) | ✅ **مكتملة** |
| 2 | **بناء الاختبار (UI)** — زر «اختبار» مفعّل، لوحة `add-quiz-sheet` (خطوتان، مسودّة-أولاً)، `quiz-question-builder` (بالدرجات)، `quiz-table` + تبويب «اختبار» + `use-quizzes` | ✅ **مكتملة** (typecheck/lint/build + E2E حيّ؛ لم تُلتزم بعد — قرار المستخدم) |
| 3 | **التعيين** — وحدة `src/server/quiz-assignments/` (eligible/assign/enroll-all/enroll-by-role/unassign + روستr) بحرّاس F1/F8؛ خطوة 3 «تعيين الموظفين» في اللوحة (`quiz-assign-learners-step`) + `use-quiz-assignments`؛ عمود «المُعيَّنون» في القائمة | ✅ **مكتملة** (typecheck/lint + F1 حيّ) |
| 4 | **المشغّل + التصحيح الآلي + النتيجة** — وحدة `src/server/quiz-attempts/` السلطة الوحيدة للدرجات (start/submit/result…)، حرّاس (الموظف المُعيَّن، منشور، محاولات، F3 questionId، مؤقّت +تسامح)، مشغّل `quiz-player-dialog` + `quiz-result-view` | ✅ **مكتملة** (E2E حيّ 14/14: بلا تسريب أعلام، F3، أعلى-درجة، استنفاد المحاولات) |
| 5 | **التصحيح النصّي (يدوي + AI) + روستر المدير** — `getGrading`/`grade`/`aiSuggest`/`managerRoster` في `quiz-attempts`؛ `quiz-manager-dialog` (روستر → تصحيح نصّي بإدخال درجات + زر «تصحيح بالذكاء» يقترح ويؤكّده المدير → GRADED وإعادة حساب النتيجة → COMPLETED) + `use-quiz-grading` | ✅ **مكتملة** (E2E حيّ 10/10: NEEDS_MANUAL→GRADED، AI-suggest حقيقي، عبر-عيادة 404) |

### تفاصيل المرحلة 2 المقترحة (نقطة البدء التالية)
1. **تفعيل الزر**: في `src/features/services/training/components/create-content-dialog.tsx` عنصر `quiz` حالياً `available: false` بشارة «قريباً» — يُفعّل ويُوجّه للوحة إنشاء الاختبار.
2. **لوحة الإنشاء**: sheet جديدة تستهلك `createQuizSchema` (react-hook-form + zodResolver)، تعرض حقول الإعدادات (نسبة نجاح، وقت، `maxAttempts`، خلط، إظهار الإجابات، القسم المستهدف)، وتعيد استخدام `src/features/services/training/components/quiz-builder.tsx` لبناء الأسئلة (يدعم SINGLE=راديو، MULTIPLE=مربّعات، TEXT=نص).
3. **hooks**: `src/features/services/training/hooks/use-quizzes.ts` — `useQuizzes` (list), `useCreateQuiz`, `useUpdateQuiz`, `usePublishQuiz`... عبر `api.quizzes` مع `toast.promise`.
4. **قائمة الاختبارات**: عرض `QuizListItemResponse[]` (العنوان، الحالة، عدد الأسئلة، المحاولات...).

---

## 7. قيود واتفاقيات المشروع (يجب الالتزام بها)

- **قاعدة الديف محلية**: `DATABASE_URL=postgresql://…@localhost:5432/elite_vet`. `migrate dev` آمن هنا. **ممنوع** تشغيل `migrate dev` أو `db:push` على Neon المشترك (فيه drift → يعيد الضبط/يمسح البيانات).
- **إعادة استخدام الأنواع (صارم)**: نماذج الفورم = `z.infer<typeof schema>`؛ الاستجابات = `Prisma.XGetPayload<{select}>`؛ مدخلات الـ DAO مشتقّة من `Prisma.XUncheckedCreateInput` عبر `Pick`/`Omit`/`Partial`؛ الـ enums من `@/generated/prisma/enums`. لا أنواع مكتوبة يدوياً تكرّر شكلاً مدعوماً بالـ schema.
- **بنية المورد**: `[resource].controller.ts` (راوتات + ماكرو `requireClinic`) + `.model.ts` (TypeBox) + `.dao.ts` (Prisma فقط) + `.type.ts` (Zod + أنواع مشتركة).
- **رسائل أخطاء الـ API بالعربية**. **التنسيق Biome** (تبويب، عرض 95). **مدير الحزم Bun**.
- **الأنواع من Prisma المولّد** في `generated/prisma/` (وليس `node_modules/@prisma/client`)؛ enums الـ TypeBox من `generated/prismabox/`.
- توليد الأكواد الفريدة عبر `generateUniqueCode({ prefix, isUnique })` من `@/lib/generate-code`.

---

## 8. أوامر مرجعية

```bash
bun run typecheck        # bunx tsc --noEmit -p tsconfig.json  → 0 أخطاء حالياً
bunx prisma migrate dev --name <change>   # migration جديدة (محلي فقط)
bunx prisma generate     # إعادة توليد العميل من الـ schema
bun dev                  # السيرفر (المنفذ الحالي 3001)
```
