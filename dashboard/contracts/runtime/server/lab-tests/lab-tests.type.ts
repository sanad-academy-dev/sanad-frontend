import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
	LabActivityType,
	LabResultFlag,
	LabSampleStage,
	LabTestStatus,
	TaskPriority,
} from "@/generated/prisma/enums";
import { invoiceSelectShape } from "@sanad/contracts/runtime/server/invoices/invoices.type";
import {
	preAnalyticalSelectShape,
	sampleCollectionSelectShape,
} from "@sanad/contracts/runtime/server/lab-tests/lab-sample.type";

// ── شكل الاستجابة (مشتق من Prisma) ─────────────────────────────────────────

const labResultSelect = {
	id: true,
	parameterId: true,
	section: true,
	name: true,
	unit: true,
	refLow: true,
	refHigh: true,
	value: true,
	numericValue: true,
	flag: true,
	notes: true,
	order: true,
} as const;

export type LabResultResponse = Prisma.LabTestResultGetPayload<{
	select: typeof labResultSelect;
}>;

// عنصر الطلب: تحليل واحد بسير عمله المستقل
const labItemSelect = {
	id: true,
	orderId: true,
	serviceId: true,
	priceSnapshot: true,
	status: true,
	sampleStage: true,
	scheduledAt: true,
	report: true,
	reviewedAt: true,
	rejectedAt: true,
	rejectionReason: true,
	completedAt: true,
	paidAt: true,
	createdAt: true,
	updatedAt: true,
	service: { select: { id: true, name: true } },
	assignedTo: { select: { id: true, name: true } },
	reviewedBy: { select: { id: true, name: true } },
	rejectedBy: { select: { id: true, name: true } },
	results: { select: labResultSelect },
	reportMentions: { select: { staff: { select: { id: true, name: true } } } },
	sampleCollection: { select: sampleCollectionSelectShape },
} as const;

export type LabTestItemResponse = Prisma.LabTestOrderItemGetPayload<{
	select: typeof labItemSelect;
}>;

// الفاتورة الخاصة بالطلب — بوابة الدفع قبل المضيّ في أي تحليل
// [P12B.1] كان هذا الشكل نسخةً مكتوبةً بخطّ اليد من `invoiceSelectShape` مع حقلين
// زائدين، فحين اكتسبت الفاتورة حقلَي الردّ تخلّف عنها صامتًا وانكسر `payByInvoiceId`
// (الذي يُعيد هذا الشكل تحت نوع الفاتورة القانوني). صار مشتقًّا: ما يُضاف هناك يصل
// هنا، والزائد وحده مكتوب.
const labInvoiceSelect = {
	...invoiceSelectShape,
	currencyCode: true,
	labOrderId: true,
} as const;

export type LabInvoiceResponse = Prisma.InvoiceGetPayload<{
	select: typeof labInvoiceSelect;
}>;

const labActivitySelect = {
	id: true,
	itemId: true,
	type: true,
	detail: true,
	createdAt: true,
	author: { select: { id: true, name: true } },
} as const;

export type LabActivityResponse = Prisma.LabTestActivityGetPayload<{
	select: typeof labActivitySelect;
}>;

// تعليق داخلي على الطلب مع إشاراته
const labCommentSelect = {
	id: true,
	body: true,
	createdAt: true,
	updatedAt: true,
	author: { select: { id: true, name: true } },
	mentions: { select: { staff: { select: { id: true, name: true } } } },
} as const;

export type LabCommentResponse = Prisma.LabTestCommentGetPayload<{
	select: typeof labCommentSelect;
}>;

// نتيجة سابقة للمقارنة — التحليل نفسه لنفس الطفل في طلب أقدم
const labPriorResultSelect = {
	id: true,
	orderId: true,
	completedAt: true,
	reviewedAt: true,
	createdAt: true,
	report: true,
	service: { select: { id: true, name: true } },
	results: { select: labResultSelect },
	order: { select: { id: true, code: true, createdAt: true } },
} as const;

export type LabPriorResultResponse = Prisma.LabTestOrderItemGetPayload<{
	select: typeof labPriorResultSelect;
}>;

export const labPriorResultSelectShape = labPriorResultSelect;

const labOrderSelect = {
	id: true,
	code: true,
	clinicId: true,
	branchId: true,
	patientId: true,
	ownerId: true,
	appointmentId: true,
	isUrgent: true,
	priority: true,
	notes: true,
	createdAt: true,
	updatedAt: true,
	patient: {
		select: {
			id: true,
			name: true,
			code: true,
			gender: true,
			age: true,
			// النوع والسلالة علاقتان لا حقلين نصيين
			animalType: { select: { id: true, arName: true } },
			animalStrain: { select: { id: true, arName: true } },
		},
	},
	qcReviewedAt: true,
	qcRules: true,
	owner: { select: { id: true, name: true, phone: true } },
	branch: { select: { id: true, name: true } },
	requestedBy: { select: { id: true, name: true, phone: true } },
	qcReviewedBy: { select: { id: true, name: true } },
	inpatientStayId: true,
	appointment: { select: { id: true, code: true, startsAt: true } },
	items: { select: labItemSelect },
	invoice: { select: labInvoiceSelect },
	preAnalytical: { select: preAnalyticalSelectShape },
	activity: { select: labActivitySelect },
	comments: { select: labCommentSelect, orderBy: { createdAt: "desc" } },
} as const;

export type LabTestOrderResponse = Prisma.LabTestOrderGetPayload<{
	select: typeof labOrderSelect;
}>;

export const labOrderSelectShape = labOrderSelect;
export const labItemSelectShape = labItemSelect;
export const labResultSelectShape = labResultSelect;
export const labInvoiceSelectShape = labInvoiceSelect;
export const labActivitySelectShape = labActivitySelect;
export const labCommentSelectShape = labCommentSelect;

// ── مدخلات الـ DAO (مشتقة من Prisma) ───────────────────────────────────────

export type CreateLabTestOrderInput = Pick<
	Prisma.LabTestOrderUncheckedCreateInput,
	"clinicId" | "branchId" | "patientId" | "ownerId"
> &
	Partial<
		Pick<
			Prisma.LabTestOrderUncheckedCreateInput,
			"appointmentId" | "inpatientStayId" | "requestedById" | "priority" | "isUrgent" | "notes"
		>
	> & {
		// التحاليل المطلوبة ضمن الطلب — كل واحد يصير عنصرًا بسير عمله
		serviceIds: string[];
		assignedToId?: string | null;
		origin?: LabOrderOrigin;
	};

export type UpdateLabItemInput = Partial<
	Pick<
		Prisma.LabTestOrderItemUncheckedUpdateInput,
		"status" | "sampleStage" | "assignedToId" | "scheduledAt"
	>
>;

// ── مخططات النماذج (Zod) ───────────────────────────────────────────────────

/**
 * مصدر الطلب يحدّد حالته الأولى:
 * - VISIT: طلبه المدرّب من داخل زيارة → يدخل «الطابور» لمراجعة المختبر
 * - DIRECT: أُنشئ من حوار «طلب تحاليل جديد» → يبدأ «مجدول» مباشرةً
 * الافتراض «الزيارة» لأنه الأكثر تحفّظًا (يمرّ بموافقة بشرية).
 */
export const LAB_ORDER_ORIGINS = ["VISIT", "DIRECT"] as const;
export type LabOrderOrigin = (typeof LAB_ORDER_ORIGINS)[number];

export const createLabTestSchema = z.object({
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	ownerId: z.string({ error: "وليّ الأمر مطلوب" }).min(1, "وليّ الأمر مطلوب"),
	// طلب واحد لكل تحليل — CBC وسكر الدم مثلًا طلبان ببطاقتين وفاتورتين
	serviceIds: z
		.array(z.string())
		.min(1, "اختر التحليل المطلوب")
		.max(1, "طلب واحد لكل تحليل — أنشئ طلبًا آخر للتحليل الثاني"),
	appointmentId: z.string().optional(),
	assignedToId: z.string().optional(),
	// المدرّب الطالب — يسقط لمستخدم الجلسة عند تركه فارغًا
	requestedById: z.string().optional(),
	priority: z.enum(TaskPriority).nullable().optional(),
	isUrgent: z.boolean().default(false),
	notes: z.string().optional(),
	origin: z.enum(LAB_ORDER_ORIGINS).default("VISIT"),
});

export type CreateLabTestFormInput = z.input<typeof createLabTestSchema>;
export type CreateLabTestFormValues = z.output<typeof createLabTestSchema>;

// إدخال نتيجة واحدة — القيمة نصية دائمًا وتُحلَّل رقميًا عند المقارنة بالنطاق
export const labResultEntrySchema = z.object({
	parameterId: z.string().nullable().optional(),
	section: z.string().nullable().optional(),
	name: z.string().min(1),
	unit: z.string().nullable().optional(),
	refLow: z.number().nullable().optional(),
	refHigh: z.number().nullable().optional(),
	value: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	order: z.number().int().default(0),
});

export const saveLabResultsSchema = z.object({
	results: z.array(labResultEntrySchema),
});

export type LabResultEntryInput = z.infer<typeof labResultEntrySchema>;
export type SaveLabResultsInput = z.infer<typeof saveLabResultsSchema>;

export const rejectLabTestSchema = z.object({
	reason: z.string({ error: "سبب الرفض مطلوب" }).min(1, "سبب الرفض مطلوب"),
});

export type RejectLabTestFormInput = z.infer<typeof rejectLabTestSchema>;

/**
 * تأكيد طلب من الطابور → مجدول، مع تعيين فنّي المختبر والأولوية وملاحظة اختيارية.
 * كلها اختيارية: التأكيد وحده كافٍ لنقل الطلب.
 */
export const confirmLabTestSchema = z.object({
	assignedToId: z.string().nullable().optional(),
	priority: z.enum(TaskPriority).nullable().optional(),
	notes: z.string().nullable().optional(),
});

export type ConfirmLabTestFormInput = z.input<typeof confirmLabTestSchema>;
export type ConfirmLabTestFormValues = z.output<typeof confirmLabTestSchema>;

/**
 * اعتماد مراجعة ضبط الجودة — معرّفات قواعد Westgard التي اجتازها شوط الجهاز.
 * القواعد المتاحة تأتي من إعدادات فرع الطلب، والتحقّق من تطابقها يجري هناك.
 */
export const reviewLabQcSchema = z.object({
	rules: z.array(z.string()).min(1, "أشِّر على قاعدة واحدة على الأقل"),
});

export type ReviewLabQcFormInput = z.infer<typeof reviewLabQcSchema>;

/** رفض طلب من الطابور — يُلغى الطلب ويُشعَر المدرّب الطالب بالسبب */
export const declineLabTestSchema = z.object({
	reason: z.string({ error: "سبب الرفض مطلوب" }).min(1, "اكتب سبب رفض الطلب"),
});

export type DeclineLabTestFormInput = z.infer<typeof declineLabTestSchema>;

/** تقرير المراجعة — مطلوب قبل اعتماد النتائج، مع إشارات (@) اختيارية */
export const approveLabTestSchema = z.object({
	report: z.string({ error: "التقرير مطلوب" }).min(1, "اكتب تقرير المراجعة قبل الاعتماد"),
	mentionedStaffIds: z.array(z.string()).default([]),
});

export type ApproveLabTestFormInput = z.input<typeof approveLabTestSchema>;
export type ApproveLabTestFormValues = z.output<typeof approveLabTestSchema>;

/** تعليق داخلي على الطلب — نصّ مطلوب وإشارات (@) اختيارية */
export const labCommentSchema = z.object({
	body: z.string({ error: "نص التعليق مطلوب" }).min(1, "اكتب التعليق"),
	mentionedStaffIds: z.array(z.string()).default([]),
});

export type LabCommentFormInput = z.input<typeof labCommentSchema>;
export type LabCommentFormValues = z.output<typeof labCommentSchema>;

// ── حساب علامة النتيجة مقابل النطاق الطبيعي ────────────────────────────────
// خارج النطاق = قيمة حرجة (تنبيه). دالة نقية تُستخدم في الخادم والواجهة.

export const parseNumeric = (value: string | null | undefined): number | null => {
	if (value == null) return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	const n = Number(trimmed);
	return Number.isFinite(n) ? n : null;
};

export const computeResultFlag = (
	value: string | null | undefined,
	refLow: number | null | undefined,
	refHigh: number | null | undefined,
): LabResultFlag => {
	const n = parseNumeric(value);
	if (n === null) return LabResultFlag.NORMAL;
	if (refLow != null && n < refLow) return LabResultFlag.LOW;
	if (refHigh != null && n > refHigh) return LabResultFlag.HIGH;
	return LabResultFlag.NORMAL;
};

export const isCriticalFlag = (flag: LabResultFlag): boolean => flag !== LabResultFlag.NORMAL;

export const LAB_FLAG_LABELS: Record<LabResultFlag, string> = {
	[LabResultFlag.NORMAL]: "ضمن النطاق",
	[LabResultFlag.LOW]: "أقل من الطبيعي",
	[LabResultFlag.HIGH]: "أعلى من الطبيعي",
};

// ── حالة دفع الطلب ─────────────────────────────────────────────────────────
// كل طلب تحاليل يفتح فاتورته الخاصة تحتها كل تحاليله. لا يمضي أي تحليل خطوة
// واحدة خارج الطابور قبل سداد تلك الفاتورة.

/**
 * «تنويم»: الطلب مكتوب من داخل إقامة، فلا فاتورة له هنا ولا بوّابة سداد —
 * بندُه يدخل فاتورة الإقامة حين يكتمل ويُسدَّد مع الخروج. ليس «مدفوعًا» (لم
 * يُدفع شيء) وليس «غير مفوتر» (المنع هناك مقصود)، فهو حالة ثالثة باسمها.
 */
export type LabPaymentStatus = "PAID" | "UNPAID" | "UNBILLED" | "INPATIENT";

/** دالة نقية تُستخدم في الخادم والواجهة معًا */
export const labPaymentStatus = (order: {
	invoice: { status: string; paidAt: Date | string | null } | null;
	inpatientStayId?: string | null;
}): LabPaymentStatus => {
	if (order.inpatientStayId) return "INPATIENT";
	const invoice = order.invoice;
	// لا فاتورة (أو أُلغيت) = غير مفوتر — يُمنع أيضًا حتى تُصدر وتُسدَّد
	if (!invoice || invoice.status === "VOIDED") return "UNBILLED";
	return invoice.status === "PAID" || invoice.paidAt ? "PAID" : "UNPAID";
};

/**
 * لا يتقدّم التحليل إلا مسدَّدًا. «غير مفوتر» ممنوع أيضًا —
 * الطلب بلا فاتورة يجب أن يُفوتَر ويُسدَّد أولًا.
 */
export const canLeaveQueue = (status: LabPaymentStatus): boolean =>
	status === "PAID" || status === "INPATIENT";

/**
 * الحالات التي لا يتقدّم منها التحليل قبل السداد. «مجدول» منها لأن الطلب
 * المنشأ من حوار «طلب تحاليل جديد» يبدأ مجدولًا فلا يمرّ بالطابور أصلًا —
 * ولولا ذلك لتخطّى البوابة كلها.
 */
export const isPaymentGatedStatus = (status: LabTestStatus): boolean =>
	status === LabTestStatus.QUEUE || status === LabTestStatus.SCHEDULED;

export const LAB_PAYMENT_META: Record<LabPaymentStatus, { label: string; className: string }> =
	{
		PAID: { label: "مدفوع", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
		UNPAID: { label: "غير مدفوع", className: "border-red-200 bg-red-50 text-red-700" },
		// غير مفوتر يمنع المغادرة أيضًا — فيُعرض بلون حاجب لا محايد
		UNBILLED: { label: "غير مفوتر", className: "border-red-200 bg-red-50 text-red-700" },
		INPATIENT: {
			label: "على فاتورة الإقامة",
			className: "border-sky-200 bg-sky-50 text-sky-700",
		},
	};

export const UNPAID_BLOCK_MESSAGE = "لا يمكن المضيّ في التحاليل قبل سداد فاتورة الطلب";

export const UNBILLED_BLOCK_MESSAGE =
	"هذا الطلب غير مفوتر — أصدِر فاتورته وسدِّدها قبل المضيّ في التحاليل";

/** رسالة المنع المناسبة لحالة السداد */
export const paymentBlockMessage = (status: LabPaymentStatus): string =>
	status === "UNBILLED" ? UNBILLED_BLOCK_MESSAGE : UNPAID_BLOCK_MESSAGE;

// ── سجل النشاط ─────────────────────────────────────────────────────────────

export const LAB_ACTIVITY_LABELS: Record<LabActivityType, string> = {
	[LabActivityType.CREATED]: "أنشأ الطلب",
	[LabActivityType.STATUS_CHANGED]: "غيّر الحالة",
	[LabActivityType.STAGE_CHANGED]: "غيّر المرحلة",
	[LabActivityType.ASSIGNED]: "عيّن فنّي المختبر",
	[LabActivityType.SAMPLE_COLLECTED]: "سحب العيّنة",
	[LabActivityType.RESULTS_SAVED]: "حفظ النتائج",
	[LabActivityType.SENT_TO_REVIEW]: "أرسل للمراجعة",
	[LabActivityType.QC_REVIEWED]: "اعتمد مراجعة ضبط الجودة",
	[LabActivityType.APPROVED]: "اعتمد النتائج",
	[LabActivityType.REJECTED]: "رفض النتائج",
	[LabActivityType.DECLINED]: "رفض الطلب",
	[LabActivityType.INVOICE_PAID]: "سُدِّدت الفاتورة",
};

// ── فلاتر القائمة ──────────────────────────────────────────────────────────

export type LabTestsPeriod = "day" | "week" | "all";
export type LabTestsView = "all" | "for-me";

export const LAB_SAMPLE_STAGES = Object.values(LabSampleStage);
export const LAB_TEST_STATUSES = Object.values(LabTestStatus);
