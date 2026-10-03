import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
	CourseContentType,
	CourseLanguage,
	CoursePriority,
	CourseType,
	LessonMediaSource,
	LessonType,
	ReEnrollMode,
} from "@/generated/prisma/enums";

export {
	AssignmentSource,
	AssignmentStatus,
	AutoAssignEntity,
	ContentStatus,
	CourseContentType,
	CourseLanguage,
	CourseLocationMode,
	CourseOrderMode,
	CoursePriority,
	CourseStatus,
	CourseType,
	LessonMediaSource,
	LessonType,
	ReEnrollMode,
} from "@/generated/prisma/enums";

// ===== مخططات النماذج (Zod) =====

// الخطوة الأولى من معالج «إنشاء دورة تدريبية» — المعلومات الأساسية.
// المعرّف (code) يُولَّد تلقائيًا على الخادم. «القسم المستهدف» صار دورًا وظيفيًا (targetRoleId)
// بدل النص الحرّ؛ يبقى department اختياريًا مهمَلًا لصفوف قديمة.
export const createCourseSchema = z.object({
	name: z.string({ error: "اسم الدورة التدريبية مطلوب" }).min(1, "اسم الدورة التدريبية مطلوب"),
	targetRoleId: z.string({ error: "القسم المستهدف مطلوب" }).min(1, "القسم المستهدف مطلوب"),
	type: z.enum(CourseType, { error: "نوع الدورة مطلوب" }),
	description: z.string().optional(),
	// بيانات وصفية إضافية (تظهر كوسوم في الخطوات اللاحقة) — كلها اختيارية
	category: z.string().optional(),
	priority: z.enum(CoursePriority).optional(),
	// number (not coerce) لإبقاء نوعَي الإدخال والإخراج متطابقين مع resolver الخاص بـ useForm
	estimatedDurationWeeks: z.number().int().min(0).max(520).optional(),
	language: z.enum(CourseLanguage).optional(),
	// مهمَل: يظل مقبولًا للتوافق مع النموذج القديم قبل ترحيله في المرحلة 3
	department: z.string().optional(),
});
export type CreateCourseFormInput = z.infer<typeof createCourseSchema>;

// إعدادات الإكمال (الخطوة 4) — نموذج موحّد للبطاقات القابلة للتفعيل
export const completionSettingsSchema = z.object({
	certificateEnabled: z.boolean().optional().default(false),
	certReferencePattern: z.string().optional(),
	certValidityDays: z.coerce.number().int().min(0).optional(),
	certSignatureName: z.string().optional(),
	certPassMark: z.coerce.number().int().min(0).max(100).optional(),
	reEnrollMode: z.enum(ReEnrollMode).optional().default("NONE"),
	reEnrollDays: z.coerce.number().int().min(0).optional(),
	gamificationPoints: z.coerce.number().int().min(0).optional().default(0),
	reviewEnabled: z.boolean().optional().default(false),
});
export type CompletionSettingsFormInput = z.infer<typeof completionSettingsSchema>;

// مستوى داخل الدورة (مبتدئ/متوسط/متقدم)
export const createLevelSchema = z.object({
	name: z.string({ error: "اسم المستوى مطلوب" }).min(1, "اسم المستوى مطلوب").max(60),
});
export type CreateLevelFormInput = z.infer<typeof createLevelSchema>;

// أنواع الدروس التي تتطلب رفع ملف أو رابط
export const MEDIA_LESSON_TYPES: LessonType[] = ["VIDEO", "AUDIO", "DOCUMENT"];

// مؤقتًا: رفع الوسيط غير إلزامي حتى تُضبط مفاتيح S3 وسياسة CORS على الـ bucket
// (بيئة التطوير ترفض PUT الموقّع). أعده إلى true بعد ضبط الرفع.
export const REQUIRE_LESSON_MEDIA = false;

// ===== باني الاختبار (Figma node 4573-499041) =====
// أنواع الإجابة: خيارات (إجابة صحيحة واحدة) / خيارات متعددة / نص حر
export const QUIZ_ANSWER_TYPES = ["SINGLE", "MULTIPLE", "TEXT"] as const;
export type QuizAnswerType = (typeof QUIZ_ANSWER_TYPES)[number];

// الشكل مرن هنا (بلا min) لأن الحقول تبدأ فارغة؛ الإلزام يُطبَّق في createLessonSchema
// لنوع QUIZ فقط، وإلا لعطّلت أسئلةٌ فارغة حفظَ درسٍ غيّر المستخدم نوعه بعد كتابتها.
export const quizOptionSchema = z.object({
	text: z.string(),
	correct: z.boolean().optional().default(false),
});

export const quizQuestionSchema = z.object({
	text: z.string(),
	answerType: z.enum(QUIZ_ANSWER_TYPES).optional().default("SINGLE"),
	options: z.array(quizOptionSchema).optional().default([]),
	// الإجابة النموذجية لأسئلة النوع «نص» (لا تُستخدم مع الخيارات)
	answerText: z.string().optional().default(""),
});

// لا توجد جداول للأسئلة في Prisma بعد، فتُخزَّن أسئلة الاختبار كـ JSON داخل
// CourseLesson.content لدروس النوع QUIZ. عند إنشاء الجداول لاحقًا تُقرأ من هنا وتُرحَّل.
export const quizContentSchema = z.object({ questions: z.array(quizQuestionSchema) });
export type QuizContent = z.infer<typeof quizContentSchema>;
export type QuizQuestionInput = z.input<typeof quizQuestionSchema>;

// يقرأ أسئلة الاختبار من حقل content بأمان (يعيد [] لأي محتوى غير صالح)
export function parseQuizContent(
	content: string | null | undefined,
): QuizContent["questions"] {
	if (!content) return [];
	try {
		const parsed = quizContentSchema.safeParse(JSON.parse(content));
		return parsed.success ? parsed.data.questions : [];
	} catch {
		return [];
	}
}

// نموذج الدرس (Figma node 4569-475294)
export const createLessonSchema = z
	.object({
		title: z.string({ error: "اسم الدرس مطلوب" }).min(1, "اسم الدرس مطلوب"),
		type: z.enum(LessonType, { error: "نوع الدرس مطلوب" }),
		description: z.string().optional(),
		mediaSource: z.enum(LessonMediaSource).optional(),
		mediaKey: z.string().optional(),
		mediaUrl: z.string().optional(),
		content: z.string().optional(),
		hours: z.coerce.number().int().min(0).max(99).optional(),
		minutes: z.coerce.number().int().min(0).max(59).optional(),
		seconds: z.coerce.number().int().min(0).max(59).optional(),
		// أسئلة الاختبار — تُستخدم لنوع QUIZ فقط وتُسلسَل إلى content عند الحفظ
		questions: z.array(quizQuestionSchema).optional().default([]),
	})
	// الوسيط مطلوب للأنواع التي تعتمد على ملف (معطّل مؤقتًا عبر REQUIRE_LESSON_MEDIA)؛
	// والنص مطلوب لنوع TEXT
	.refine(
		(v) =>
			!REQUIRE_LESSON_MEDIA ||
			!MEDIA_LESSON_TYPES.includes(v.type) ||
			!!(v.mediaKey || v.mediaUrl),
		{ error: "الملف مطلوب", path: ["mediaKey"] },
	)
	.refine((v) => v.type !== "TEXT" || !!v.content?.trim(), {
		error: "محتوى الدرس مطلوب",
		path: ["content"],
	})
	// أسئلة وخيارات الاختبار لا تُلزَم إلا حين يكون الدرس من نوع QUIZ
	.superRefine((v, ctx) => {
		if (v.type !== "QUIZ") return;
		v.questions?.forEach((question, i) => {
			if (!question.text.trim())
				ctx.addIssue({
					code: "custom",
					message: "نص السؤال مطلوب",
					path: ["questions", i, "text"],
				});
			if (question.answerType === "TEXT") return;
			question.options?.forEach((option, j) => {
				if (!option.text.trim())
					ctx.addIssue({
						code: "custom",
						message: "نص الخيار مطلوب",
						path: ["questions", i, "options", j, "text"],
					});
			});
		});
	});
// z.input = ما يحمله النموذج قبل التحويل (حقول المدة تصل كنص من <input type=number>)
// z.output = ما يخرج بعد التحقق والتحويل (أرقام) — يُمرَّر لـ useForm كنوع ثالث
export type CreateLessonFormInput = z.input<typeof createLessonSchema>;
export type LessonFormValues = z.output<typeof createLessonSchema>;

export const createUnitSchema = z.object({
	title: z.string({ error: "اسم الوحدة مطلوب" }).min(1, "اسم الوحدة مطلوب").max(60),
});
export type CreateUnitFormInput = z.infer<typeof createUnitSchema>;

// ===== أنواع إدخال الـ DAO (مشتقة من Prisma) =====

// الحقول الوصفية الاختيارية المشتركة بين الإنشاء والتعديل
type CourseMetaFields = Partial<
	Pick<
		Prisma.CourseUncheckedCreateInput,
		| "description"
		| "coverKey"
		| "status"
		| "targetRoleId"
		| "category"
		| "priority"
		| "estimatedDurationWeeks"
		| "language"
		| "orderMode"
		| "startDate"
		| "dueDate"
		| "timezone"
		| "trainingCost"
		| "institution"
		| "locationMode"
	>
>;

export type CreateCourseInput = Pick<
	Prisma.CourseUncheckedCreateInput,
	"clinicId" | "name" | "type"
> &
	// department صار اختياريًا (مهمَل) — الـ DAO يعيّنه "" لتلبية قيد NOT NULL
	Partial<Pick<Prisma.CourseUncheckedCreateInput, "department">> &
	CourseMetaFields;

export type UpdateCourseInput = Partial<
	Pick<Prisma.CourseUncheckedCreateInput, "name" | "department" | "type">
> &
	CourseMetaFields;

export type CreateLevelInput = Pick<
	Prisma.CourseLevelUncheckedCreateInput,
	"courseId" | "name"
>;

export type CreateUnitInput = Pick<
	Prisma.CourseUnitUncheckedCreateInput,
	"courseId" | "title"
> &
	Partial<
		Pick<Prisma.CourseUnitUncheckedCreateInput, "levelId" | "contentType" | "status">
	> & {
		// دروس تُنشأ مع الوحدة في نفس المعاملة (استعادة وحدة محذوفة)
		lessons?: RestoredLessonInput[];
	};

export type UpdateUnitInput = Partial<
	Pick<Prisma.CourseUnitUncheckedCreateInput, "title" | "levelId" | "contentType" | "status">
>;

// عنصر إعادة ترتيب واحد — position ترتيب مؤقّت من العميل يُعاد تطبيعه على الخادم
export type ReorderContentInput = {
	unitId: string;
	levelId: string | null;
	position: number;
};

export type CompletionSettingsInput = Partial<
	Omit<
		Prisma.CourseCompletionSettingsUncheckedCreateInput,
		"id" | "courseId" | "createdAt" | "updatedAt"
	>
>;

export type RestoredLessonInput = Pick<Prisma.CourseLessonUncheckedCreateInput, "title"> &
	Required<Pick<Prisma.CourseLessonUncheckedCreateInput, "type">> &
	LessonOptionalFields;

type LessonOptionalFields = Partial<
	Pick<
		Prisma.CourseLessonUncheckedCreateInput,
		"description" | "mediaSource" | "mediaKey" | "mediaUrl" | "durationSeconds" | "content"
	>
>;

export type CreateLessonInput = Pick<
	Prisma.CourseLessonUncheckedCreateInput,
	"unitId" | "title"
> &
	Partial<Pick<Prisma.CourseLessonUncheckedCreateInput, "type">> &
	LessonOptionalFields;

// حمولة الطلب من العميل — `type` إلزامي هنا بعكس Prisma الذي يملك قيمة افتراضية
export type CreateLessonPayload = Pick<
	Prisma.CourseLessonUncheckedCreateInput,
	"unitId" | "title"
> &
	Required<Pick<Prisma.CourseLessonUncheckedCreateInput, "type">> &
	LessonOptionalFields;

export type UpdateLessonInput = Partial<Omit<CreateLessonInput, "unitId">>;

// حمولة التعديل من العميل — نفس حقول الإنشاء عدا unitId، وكلها اختيارية
export type UpdateLessonPayload = Partial<Omit<CreateLessonPayload, "unitId">>;

// ===== أنواع الاستجابة (Prisma payloads) =====

const lessonSelect = {
	id: true,
	unitId: true,
	title: true,
	type: true,
	order: true,
	description: true,
	mediaSource: true,
	mediaKey: true,
	mediaUrl: true,
	durationSeconds: true,
	content: true,
	editsCount: true,
	createdAt: true,
} as const;

const unitSelect = {
	id: true,
	courseId: true,
	levelId: true,
	title: true,
	contentType: true,
	status: true,
	order: true,
	updatedAt: true,
	lessons: { select: lessonSelect },
} as const;

const levelSelect = {
	id: true,
	courseId: true,
	name: true,
	order: true,
} as const;

const courseSelect = {
	id: true,
	code: true,
	name: true,
	department: true,
	targetRoleId: true,
	type: true,
	description: true,
	coverKey: true,
	status: true,
	category: true,
	priority: true,
	estimatedDurationWeeks: true,
	language: true,
	orderMode: true,
	startDate: true,
	dueDate: true,
	timezone: true,
	trainingCost: true,
	institution: true,
	locationMode: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	targetRole: { select: { id: true, name: true } },
} as const;

const completionSettingsSelect = {
	id: true,
	courseId: true,
	certificateEnabled: true,
	certReferencePattern: true,
	certValidityDays: true,
	certSignatureName: true,
	certPassMark: true,
	reEnrollMode: true,
	reEnrollDays: true,
	gamificationPoints: true,
	reviewEnabled: true,
} as const;

export type LessonResponse = Prisma.CourseLessonGetPayload<{ select: typeof lessonSelect }>;
export type UnitResponse = Prisma.CourseUnitGetPayload<{ select: typeof unitSelect }>;
export type LevelResponse = Prisma.CourseLevelGetPayload<{ select: typeof levelSelect }>;
export type CourseResponse = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;
export type CompletionSettingsResponse = Prisma.CourseCompletionSettingsGetPayload<{
	select: typeof completionSettingsSelect;
}>;
export type CourseDetailResponse = Prisma.CourseGetPayload<{
	select: typeof courseSelect & {
		units: { select: typeof unitSelect };
		levels: { select: typeof levelSelect };
		completionSettings: { select: typeof completionSettingsSelect };
		trainers: { select: { staffId: true; staff: { select: { name: true } } } };
	};
}>;

// طاقم مختصر لمكدّس صور المتدربين/المدربين في بطاقة القائمة
export type CourseAssigneePreview = { id: string; name: string; avatar: string | null };

// عنصر قائمة الدورات مع تجميعات صفحة القائمة (عدد المُعيَّنين، نسبة الإكمال، عدد المحتوى، المدربون، التقييم)
export type CourseListItemResponse = CourseResponse & {
	contentCount: number;
	assignedCount: number;
	completionPct: number; // 0..100
	assignees: CourseAssigneePreview[]; // أول 4 لعرض المكدّس
	trainers: CourseAssigneePreview[]; // المدربون (course_trainer) لعمود «المدربين»
	avgRating: number | null; // متوسط التقييم (خانة عشرية واحدة) — null عند غياب أي تقييم
	reviewCount: number; // عدد التقييمات
};

// إحصائيات صفحة القائمة (بطاقات KPI الأربع)
export type CourseStatsResponse = {
	totalCourses: number; // إجمالي الدورات
	assignedStaff: number; // # المستفيدين — عدد الموظفين المميّزين المُعيَّنين
	completedAssignments: number; // مكتمل — تعيينات مكتملة
	inProgressAssignments: number; // جاري تنفيذها — تعيينات غير مكتملة (مُعيَّن/قيد التقدّم)
};

// ===== المدربون + التقييمات =====

// ضبط قائمة المدربين للدورة (استبدال كامل)
export const setTrainersSchema = z.object({
	staffIds: z.array(z.string().min(1)).default([]),
});
export type SetTrainersFormInput = z.infer<typeof setTrainersSchema>;

// تقييم دورة من متدرّب (1..5 + تعليق اختياري)
export const createReviewSchema = z.object({
	rating: z.coerce.number().int().min(1, "التقييم مطلوب").max(5),
	comment: z.string().optional(),
});
export type CreateReviewFormInput = z.infer<typeof createReviewSchema>;

export const trainingSelects = {
	lessonSelect,
	unitSelect,
	levelSelect,
	courseSelect,
	completionSettingsSelect,
};

// ===== توليد الدورة بالذكاء الاصطناعي (منشئ الدورة بـ AI) =====
// كل الحقول إلزامية بلا قيم افتراضية عمدًا: نمط الإخراج المُهيكَل في OpenAI يتطلب
// أن تكون جميع الحقول required، فالنموذج يملأ سلاسل/مصفوفات فارغة بدل حذفها.

// سؤال توضيحي واحد وإجابته — تُمرَّر ضمن سياق التوليد
export const aiAnswerSchema = z.object({
	question: z.string(),
	answer: z.string(),
});

// نتيجة خطوة الأسئلة التوضيحية — تُحلَّل من نصّ JSON للموديل (لا إخراج مُهيكَل صارم)
export const aiQuestionsResultSchema = z.object({
	questions: z.array(z.string()).catch([]),
});
export type AiQuestionsResult = z.infer<typeof aiQuestionsResultSchema>;

// خيارات توليد الدورة (لوحة الإعدادات في الشيت) — تُغذّي prompt التوليد
export const AI_DIFFICULTY = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const AI_DEPTH = ["BRIEF", "BALANCED", "DETAILED"] as const;
export type AiGenerateOptions = {
	levelCount?: number;
	difficulty?: (typeof AI_DIFFICULTY)[number];
	language?: CourseLanguage;
	courseType?: CourseType;
	includeQuizzes?: boolean;
	depth?: (typeof AI_DEPTH)[number];
	// متقدّم: يطلب من الذكاء اقتراح وسائط/روابط خارجية (مصادر) لكل فصل
	suggestMedia?: boolean;
};

// مخططات متساهلة عمدًا: تُستخدم لتحليل نصّ JSON من الموديل فقط، فنملأ الافتراضيات
// ونتسامح مع الحقول الناقصة/القيم غير المتوقّعة حتى لا يفشل التوليد كليًّا لخطأ بسيط.
const aiQuizOptionSchema = z.object({
	text: z.string().catch(""),
	correct: z.boolean().catch(false),
});
const aiQuizQuestionSchema = z.object({
	text: z.string().catch(""),
	answerType: z.enum(QUIZ_ANSWER_TYPES).catch("SINGLE"),
	options: z.array(aiQuizOptionSchema).catch([]),
	answerText: z.string().catch(""),
});
// مصدر/رابط خارجي مقترح من الذكاء (متقدّم) — عنوان + رابط
const aiResourceSchema = z.object({
	title: z.string().catch(""),
	url: z.string().catch(""),
});
const aiLessonSchema = z.object({
	title: z.string().catch("فصل"),
	type: z.enum(LessonType).catch("TEXT"),
	content: z.string().catch(""),
	questions: z.array(aiQuizQuestionSchema).catch([]),
	// روابط/وسائط مقترحة (متقدّم) — تظهر كمعاينة وتُحفظ ضمن محتوى الفصل
	resources: z.array(aiResourceSchema).catch([]),
});
const aiUnitSchema = z.object({
	title: z.string().catch("وحدة"),
	contentType: z.enum(CourseContentType).catch("LESSON"),
	lessons: z.array(aiLessonSchema).catch([]),
});
const aiLevelSchema = z.object({
	name: z.string().catch("مستوى"),
	units: z.array(aiUnitSchema).catch([]),
});

// بنية الدورة الكاملة المولّدة — تُعاد كمعاينة ثم تُحفظ كمسودّة عند الموافقة
export const aiCourseSchema = z.object({
	name: z.string(),
	description: z.string().catch(""),
	type: z.enum(CourseType).catch("INTERNAL"),
	category: z.string().catch(""),
	language: z.enum(CourseLanguage).catch("AR"),
	estimatedDurationWeeks: z.coerce.number().catch(4),
	levels: z.array(aiLevelSchema).catch([]),
});
export type AiCoursePreview = z.infer<typeof aiCourseSchema>;
export type AiCourseLevel = AiCoursePreview["levels"][number];
export type AiCourseUnit = AiCourseLevel["units"][number];
