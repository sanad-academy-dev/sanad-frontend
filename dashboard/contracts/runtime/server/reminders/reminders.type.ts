import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	NotificationChannel,
	RecallContactChannel,
	RecallOutcome,
	ReminderTrigger,
} from "@/generated/prisma/enums";

export type {
	NotificationChannel,
	OutboxStatus,
	RecallContactChannel,
	RecallOutcome,
	ReminderTrigger,
} from "@/generated/prisma/enums";

// ─── القواعد ────────────────────────────────────────────────────────────────

const ruleSelect = {
	id: true,
	clinicId: true,
	trigger: true,
	name: true,
	active: true,
	offsetHours: true,
	repeatAfterDays: true,
	maxSends: true,
	channels: true,
	subjectTemplate: true,
	bodyTemplate: true,
	quietHoursStart: true,
	quietHoursEnd: true,
	horizonDays: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.ReminderRuleSelect;

export const ruleSelectShape = ruleSelect;
export type ReminderRuleResponse = Prisma.ReminderRuleGetPayload<{
	select: typeof ruleSelect;
}>;

// ─── الصندوق الصادر ─────────────────────────────────────────────────────────

const outboxSelect = {
	id: true,
	clinicId: true,
	channel: true,
	status: true,
	recipientKind: true,
	ownerId: true,
	toAddress: true,
	subject: true,
	body: true,
	trigger: true,
	ruleId: true,
	patientId: true,
	appointmentId: true,
	dedupeKey: true,
	scheduledFor: true,
	attempts: true,
	maxAttempts: true,
	sentAt: true,
	failedAt: true,
	lastError: true,
	manualLink: true,
	createdAt: true,
	owner: { select: { id: true, name: true, phone: true } },
	patient: { select: { id: true, name: true, code: true } },
} satisfies Prisma.NotificationOutboxSelect;

export const outboxSelectShape = outboxSelect;
export type OutboxMessageResponse = Prisma.NotificationOutboxGetPayload<{
	select: typeof outboxSelect;
}>;

// ─── سجلّ التواصل ───────────────────────────────────────────────────────────

const contactSelect = {
	id: true,
	clinicId: true,
	ownerId: true,
	patientId: true,
	trigger: true,
	dedupeKey: true,
	channel: true,
	outcome: true,
	notes: true,
	snoozedUntil: true,
	bookedAppointmentId: true,
	contactedById: true,
	contactedAt: true,
	contactedBy: { select: { id: true, name: true } },
	patient: { select: { id: true, name: true } },
} satisfies Prisma.RecallContactSelect;

export const contactSelectShape = contactSelect;
export type RecallContactResponse = Prisma.RecallContactGetPayload<{
	select: typeof contactSelect;
}>;

// ─── الإدراج والمعاينة ──────────────────────────────────────────────────────

/**
 * ملخّص تشغيل قاعدة واحدة.
 *
 * يعيش هنا لا في `outbox.service.ts` لأن الشاشة تقرؤه: استيراد نوعٍ من وحدة دورة
 * يجرّ إلى مشروع **العميل** كل ما تستورده تلك الوحدة — الجوامع، ومنها الـDAOs،
 * ومنها كل أشكال Prisma. وهذا ليس تنظيمًا نظريًّا: أوّل نسخة من هذه الوحدة
 * استوردت `PreviewRow` من `outbox.service` فانفجر `tsc -p tsconfig.client.json`
 * بنفاد الذاكرة. الاصطلاح في AGENTS.md — «الأنواع المشتركة في `[resource].type.ts`»
 * — هو ما يمنع ذلك.
 */
export type EnqueueSummary = {
	trigger: ReminderTrigger;
	candidates: number;
	/** أُدرجت الآن */
	queued: number;
	/** مرشَّح لم يحن وقته بعد، أو مضى وقتُه بأكثر من المهلة */
	notDue: number;
	/** بصمتُه موجودة أصلًا — وهذا هو النجاح لا الفشل */
	duplicates: number;
	/** لا قناة صالحة، أو لا وليّ أمر */
	skipped: number;
};

/** صفّ معاينة — الرسالة كما ستُدرَج بالضبط، أو سببُ تعذّرها. */
export type PreviewRow = {
	dedupeKey: string;
	ownerName: string | null;
	patientName: string | null;
	channel: NotificationChannel | null;
	scheduledFor: Date | null;
	body: string;
	skippedReason: string | null;
};

// ─── قائمة عمل الاستدعاء ────────────────────────────────────────────────────

/** استحقاقٌ واحد كما يظهر في قائمة العمل، بعد طيّه مع سجلّ التواصل. */
export type RecallItem = {
	dedupeKey: string;
	trigger: ReminderTrigger;
	triggerLabel: string;
	patientId: string | null;
	patientName: string | null;
	dueAt: string | null;
	daysUntilDue: number | null;
	details: string | null;
	/** آخر تواصل بشأن هذا الاستحقاق تحديدًا — `null` يعني «لم يُكلَّم بعد» */
	lastContactAt: string | null;
	lastOutcome: RecallOutcome | null;
	contactCount: number;
	snoozedUntil: string | null;
	/** حالة آخر رسالة آلية عن هذا الاستحقاق */
	outboxStatus: string | null;
	/** رابط واتساب جاهز حين تكون الرسالة بانتظار ضغطة موظّف */
	manualLink: string | null;
	outboxId: string | null;
};

/**
 * صفٌّ في قائمة العمل — **وليّ أمرٌ واحد** بكل ما يستحقّه أطفالُه.
 *
 * التجميع بوليّ الأمر لا بالطفل هو الفارق العملي كلّه: قبل هذه الوحدة كانت
 * الاستحقاقات موزّعة على أربع شاشاتٍ مفاتيحُها الطفل، فوليّ أمرٌ له ثلاثة كلاب
 * مستحقّة يظهر في ثلاثة صفوف على ثلاث شاشات — ويُكلَّم ثلاث مرّات.
 */
export type RecallOwnerRow = {
	ownerId: string;
	ownerName: string;
	ownerPhone: string | null;
	ownerEmail: string | null;
	/** رقم E.164 المُطبَّع — `null` إذا تعذّر فهم الرقم المخزَّن */
	ownerPhoneE164: string | null;
	items: RecallItem[];
	/** أشدّ تأخّرٍ بين بنوده — مفتاح الترتيب الافتراضي */
	worstDaysUntilDue: number | null;
	/** كُلِّم بشأن كل بنوده */
	fullyHandled: boolean;
	/** كل بنوده مؤجَّلة إلى المستقبل */
	snoozed: boolean;
};

export type RecallBoard = {
	rows: RecallOwnerRow[];
	stats: {
		owners: number;
		items: number;
		overdue: number;
		contactedToday: number;
		awaitingManual: number;
	};
};

// ─── مخطّطات Zod (مصدر أنواع النماذج على العميل) ────────────────────────────

const templateBody = z
	.string({ error: "نصّ الرسالة مطلوب" })
	.trim()
	.min(1, "نصّ الرسالة مطلوب")
	.max(2000, "نصّ الرسالة طويل جدًّا");

const quietMinute = z
	.number()
	.int()
	.min(0, "الدقيقة يجب أن تكون بين ٠ و١٤٣٩")
	.max(1439, "الدقيقة يجب أن تكون بين ٠ و١٤٣٩");

export const reminderRuleSchema = z.object({
	trigger: z.enum(ReminderTrigger, { error: "سبب التذكير مطلوب" }),
	name: z.string({ error: "اسم القاعدة مطلوب" }).trim().min(1, "اسم القاعدة مطلوب").max(120),
	active: z.boolean().default(false),
	// ٩٠ يومًا في كل اتجاه: تذكيرٌ قبل ثلاثة أشهر أو استدعاءٌ بعدها هو أقصى ما
	// يبقى ذا معنى، وما بعده رقمٌ مكتوبٌ خطأً لا نيّة
	offsetHours: z
		.number({ error: "الإزاحة مطلوبة" })
		.int()
		.min(-2160, "الإزاحة خارج المدى المعقول")
		.max(2160, "الإزاحة خارج المدى المعقول")
		.default(0),
	repeatAfterDays: z.number().int().min(1).max(365).nullable().default(null),
	maxSends: z
		.number()
		.int()
		.min(1, "أقلّ عدد رسائل هو ١")
		.max(10, "أكثر عدد رسائل هو ١٠")
		.default(1),
	channels: z.array(z.enum(NotificationChannel)).min(1, "اختر قناة واحدة على الأقل").max(5),
	subjectTemplate: z.string().trim().max(200).nullable().default(null),
	bodyTemplate: templateBody,
	quietHoursStart: quietMinute.nullable().default(null),
	quietHoursEnd: quietMinute.nullable().default(null),
	horizonDays: z
		.number({ error: "مدى الاستباق مطلوب" })
		.int()
		.min(1, "مدى الاستباق يوم واحد على الأقل")
		.max(365, "مدى الاستباق ٣٦٥ يومًا على الأكثر")
		.default(14),
});

export type ReminderRuleFormInput = z.infer<typeof reminderRuleSchema>;

export const recallContactSchema = z.object({
	ownerId: z.string({ error: "وليّ الأمر مطلوب" }).min(1, "وليّ الأمر مطلوب"),
	patientId: z.string().nullable().default(null),
	trigger: z.enum(ReminderTrigger, { error: "سبب الاستدعاء مطلوب" }),
	dedupeKey: z.string({ error: "بصمة الاستحقاق مطلوبة" }).min(1),
	channel: z.enum(RecallContactChannel, { error: "قناة التواصل مطلوبة" }),
	outcome: z.enum(RecallOutcome, { error: "نتيجة التواصل مطلوبة" }),
	notes: z.string().trim().max(1000).nullable().default(null),
	snoozedUntil: z.string().nullable().default(null),
	bookedAppointmentId: z.string().nullable().default(null),
});

export type RecallContactFormInput = z.infer<typeof recallContactSchema>;

/**
 * ما يحرّره الموظّف فعلًا في نافذة «تسجيل تواصل» — مشتقّ بـ`pick` من المخطّط الكامل
 * لا مكتوب بيد (AGENTS.md). وليّ الأمر والسبب والبصمة تأتي من البند المختار لا من النموذج.
 *
 * والتأجيل بلا تاريخ ليس تأجيلًا: `SNOOZED` يشترط `snoozedUntil`، ويُرفض عند الحفظ
 * برسالةٍ على الحقل نفسه لا بصفٍّ صامتٍ يعود إلى القائمة غدًا.
 */
export const recallContactFormSchema = recallContactSchema
	.pick({ channel: true, outcome: true, notes: true, snoozedUntil: true })
	.refine((v) => v.outcome !== "SNOOZED" || Boolean(v.snoozedUntil), {
		message: "حدّد تاريخًا للتأجيل",
		path: ["snoozedUntil"],
	});

export type RecallContactDialogInput = z.infer<typeof recallContactFormSchema>;

// ─── مدخلات الـDAO (مشتقّة من Prisma) ───────────────────────────────────────

export type CreateReminderRuleInput = Pick<
	Prisma.ReminderRuleUncheckedCreateInput,
	| "clinicId"
	| "trigger"
	| "name"
	| "active"
	| "offsetHours"
	| "maxSends"
	| "bodyTemplate"
	| "horizonDays"
> &
	Partial<
		Pick<
			Prisma.ReminderRuleUncheckedCreateInput,
			"repeatAfterDays" | "channels" | "subjectTemplate" | "quietHoursStart" | "quietHoursEnd"
		>
	>;

export type UpdateReminderRuleInput = Partial<Omit<CreateReminderRuleInput, "clinicId">>;

export type CreateRecallContactInput = Pick<
	Prisma.RecallContactUncheckedCreateInput,
	"clinicId" | "ownerId" | "trigger" | "dedupeKey" | "channel" | "outcome"
> &
	Partial<
		Pick<
			Prisma.RecallContactUncheckedCreateInput,
			"patientId" | "notes" | "snoozedUntil" | "bookedAppointmentId" | "contactedById"
		>
	>;
