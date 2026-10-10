import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { QuizAnswerType } from "@/generated/prisma/enums";

export {
	AssignmentSource,
	AssignmentStatus,
	QuizAnswerType,
	QuizGradingStatus,
	QuizStatus,
} from "@/generated/prisma/enums";

// ===== مخططات النماذج (Zod) — مصدر الحقيقة لنماذج الواجهة =====

// خيار سؤال — نص + هل هو الإجابة الصحيحة
export const quizOptionSchema = z.object({
	text: z.string(),
	correct: z.boolean().optional(),
});

// سؤال — الشكل مرن (يبدأ فارغًا في الباني)؛ الإلزام يُطبَّق على الخادم عند النشر
export const quizQuestionSchema = z.object({
	text: z.string(),
	answerType: z.enum(QuizAnswerType).optional(),
	points: z.number().int().min(1).max(100).optional(),
	options: z.array(quizOptionSchema).optional(),
	// الإجابة النموذجية لأسئلة النوع «نص» — تُستخدم في التصحيح اليدوي/بالـ AI لاحقًا
	answerText: z.string().optional(),
});
export type QuizQuestionFormInput = z.infer<typeof quizQuestionSchema>;

// إنشاء اختبار — الميتا + الإعدادات + الأسئلة
export const createQuizSchema = z.object({
	title: z.string({ error: "عنوان الاختبار مطلوب" }).min(1, "عنوان الاختبار مطلوب"),
	description: z.string().optional(),
	targetRoleId: z.string().optional(),
	// الغلاف: "color:#HEX" أو مفتاح صورة — يُحفظ من منتقي الغلاف في خطوة الأسئلة
	coverKey: z.string().nullish(),
	passMark: z.number().int().min(0).max(100).optional(),
	timeLimitMinutes: z.number().int().min(0).max(600).optional(),
	maxAttempts: z.number().int().min(1).max(100).optional(),
	shuffleQuestions: z.boolean().optional(),
	showAnswers: z.boolean().optional(),
	gamificationPoints: z.number().int().min(0).optional(),
	questions: z.array(quizQuestionSchema).optional(),
});
export type CreateQuizFormInput = z.infer<typeof createQuizSchema>;

export const updateQuizSchema = createQuizSchema.partial();
export type UpdateQuizFormInput = z.infer<typeof updateQuizSchema>;

// ===== أنواع مدخلات الـ DAO (مشتقّة من Prisma) =====

// سؤال كمدخل للـ DAO — الخيارات كمصفوفة (تُخزَّن Json)
export type QuizQuestionInput = Pick<Prisma.QuizQuestionUncheckedCreateInput, "text"> & {
	answerType?: QuizAnswerType;
	points?: number;
	answerText?: string | null;
	options?: { text: string; correct?: boolean }[];
};

export type CreateQuizInput = Pick<Prisma.QuizUncheckedCreateInput, "clinicId" | "title"> &
	Partial<
		Pick<
			Prisma.QuizUncheckedCreateInput,
			| "description"
			| "targetRoleId"
			| "coverKey"
			| "passMark"
			| "timeLimitMinutes"
			| "maxAttempts"
			| "shuffleQuestions"
			| "showAnswers"
			| "gamificationPoints"
		>
	> & {
		questions?: QuizQuestionInput[];
	};

export type UpdateQuizInput = Partial<Omit<CreateQuizInput, "clinicId">>;

// ===== مخططات select (مصدر الحقيقة لأشكال الاستجابة) =====

const quizQuestionSelect = {
	id: true,
	order: true,
	text: true,
	answerType: true,
	points: true,
	options: true,
	answerText: true,
} as const;

const quizSelect = {
	id: true,
	code: true,
	title: true,
	description: true,
	status: true,
	targetRoleId: true,
	coverKey: true,
	passMark: true,
	timeLimitMinutes: true,
	maxAttempts: true,
	shuffleQuestions: true,
	showAnswers: true,
	gamificationPoints: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	targetRole: { select: { id: true, name: true } },
	questions: { select: quizQuestionSelect, orderBy: { order: "asc" } },
} as const;

const quizListSelect = {
	id: true,
	code: true,
	title: true,
	coverKey: true,
	status: true,
	passMark: true,
	timeLimitMinutes: true,
	maxAttempts: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	targetRole: { select: { id: true, name: true } },
	_count: { select: { questions: true, assignments: true } },
} as const;

export const quizSelects = { quizSelect, quizQuestionSelect, quizListSelect } as const;

export type QuizQuestionResponse = Prisma.QuizQuestionGetPayload<{
	select: typeof quizQuestionSelect;
}>;
export type QuizResponse = Prisma.QuizGetPayload<{ select: typeof quizSelect }>;
export type QuizListItemResponse = Prisma.QuizGetPayload<{ select: typeof quizListSelect }>;

export type QuizStatsResponse = {
	total: number;
	published: number;
	draft: number;
};

// ===== منشئ الاختبار بالذكاء الاصطناعي =====

// خيارات لوحة التوليد — كلها اختيارية؛ غير المحدَّد يقرّره الموديل
export const aiQuizOptionsSchema = z.object({
	questionCount: z.number().int().min(1).max(30).optional(),
	difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
	language: z.enum(["AR", "EN"]).optional(),
	// أنواع الأسئلة المسموح بها — افتراضيًا الأنواع الثلاثة
	answerTypes: z.array(z.enum(QuizAnswerType)).optional(),
	pointsPerQuestion: z.number().int().min(1).max(100).optional(),
	// بحث ويب حقيقي عن الموضوع قبل التوليد (يضيف وقتًا)
	researchTopic: z.boolean().optional(),
});
export type AiQuizOptions = z.infer<typeof aiQuizOptionsSchema>;

// مخطط الاختبار المولّد (متساهل — نُصلح ما نقدر عليه بدل رفض الاستجابة كاملة)
export const aiQuizQuestionSchema = z.object({
	text: z.string().catch(""),
	answerType: z.enum(QuizAnswerType).catch("SINGLE"),
	points: z.coerce.number().int().min(1).max(100).catch(1),
	options: z
		.array(z.object({ text: z.string().catch(""), correct: z.boolean().catch(false) }))
		.catch([]),
	answerText: z.string().catch(""),
	// شرح مختصر للإجابة — يُعرض في المعاينة فقط
	explanation: z.string().catch(""),
});
export type AiQuizQuestion = z.infer<typeof aiQuizQuestionSchema>;

export const aiQuizSchema = z.object({
	title: z.string().catch(""),
	description: z.string().catch(""),
	questions: z.array(aiQuizQuestionSchema).catch([]),
});
export type AiQuizPreview = z.infer<typeof aiQuizSchema>;
