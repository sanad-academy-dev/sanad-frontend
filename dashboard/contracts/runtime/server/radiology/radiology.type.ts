import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
	RadiologyActivityType,
	RadiologyLaterality,
	RadiologyModality,
	RadiologyStage,
	RadiologyStatus,
	TaskPriority,
} from "@/generated/prisma/enums";
import { invoiceSelectShape } from "@sanad/contracts/runtime/server/invoices/invoices.type";
import {
	examExecutionSelectShape,
	radiologyStudySelectShape,
	safetyScreeningSelectShape,
} from "@sanad/contracts/runtime/server/radiology/radiology-procedure.type";

// ── شكل الاستجابة (مشتق من Prisma) ─────────────────────────────────────────

// تقرير الأشعة — أقسام التقرير الطبي القياسية
const radiologyReportSelect = {
	id: true,
	itemId: true,
	technique: true,
	comparison: true,
	findings: true,
	impression: true,
	recommendations: true,
	criticalFinding: true,
	criticalNotifiedAt: true,
	criticalNotifiedTo: true,
	criticalNotifiedToId: true,
	aiDrafted: true,
	updatedAt: true,
	authoredBy: { select: { id: true, name: true } },
} as const;

export type RadiologyReportResponse = Prisma.RadiologyReportGetPayload<{
	select: typeof radiologyReportSelect;
}>;

// عنصر الطلب: فحص واحد بسير عمله المستقل
const radiologyItemSelect = {
	id: true,
	orderId: true,
	serviceId: true,
	accession: true,
	priceSnapshot: true,
	status: true,
	stage: true,
	modality: true,
	bodyPart: true,
	laterality: true,
	views: true,
	withContrast: true,
	scheduledAt: true,
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
	execution: { select: examExecutionSelectShape },
	report: { select: radiologyReportSelect },
	studies: { select: radiologyStudySelectShape, orderBy: { createdAt: "asc" } },
} as const;

export type RadiologyItemResponse = Prisma.RadiologyOrderItemGetPayload<{
	select: typeof radiologyItemSelect;
}>;

// الفاتورة الخاصة بالطلب — بوابة الدفع قبل المضيّ في أي فحص
// [P12B.1] كان هذا الشكل نسخةً مكتوبةً بخطّ اليد من `invoiceSelectShape` مع حقلين
// زائدين، فحين اكتسبت الفاتورة حقلَي الردّ تخلّف عنها صامتًا وانكسر `payByInvoiceId`
// (الذي يُعيد هذا الشكل تحت نوع الفاتورة القانوني). صار مشتقًّا: ما يُضاف هناك يصل
// هنا، والزائد وحده مكتوب.
const radiologyInvoiceSelect = {
	...invoiceSelectShape,
	currencyCode: true,
	radiologyOrderId: true,
} as const;

export type RadiologyInvoiceResponse = Prisma.InvoiceGetPayload<{
	select: typeof radiologyInvoiceSelect;
}>;

const radiologyActivitySelect = {
	id: true,
	itemId: true,
	type: true,
	detail: true,
	createdAt: true,
	author: { select: { id: true, name: true } },
} as const;

export type RadiologyActivityResponse = Prisma.RadiologyActivityGetPayload<{
	select: typeof radiologyActivitySelect;
}>;

const radiologyCommentSelect = {
	id: true,
	body: true,
	createdAt: true,
	updatedAt: true,
	author: { select: { id: true, name: true } },
	mentions: { select: { staff: { select: { id: true, name: true } } } },
} as const;

export type RadiologyCommentResponse = Prisma.RadiologyCommentGetPayload<{
	select: typeof radiologyCommentSelect;
}>;

const radiologyOrderSelect = {
	id: true,
	code: true,
	clinicId: true,
	branchId: true,
	patientId: true,
	ownerId: true,
	appointmentId: true,
	isUrgent: true,
	priority: true,
	clinicalInfo: true,
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
	owner: { select: { id: true, name: true, phone: true } },
	branch: { select: { id: true, name: true } },
	requestedBy: { select: { id: true, name: true, phone: true } },
	inpatientStayId: true,
	appointment: { select: { id: true, code: true, startsAt: true } },
	items: { select: radiologyItemSelect },
	invoice: { select: radiologyInvoiceSelect },
	safetyScreening: { select: safetyScreeningSelectShape },
	activity: { select: radiologyActivitySelect },
	comments: { select: radiologyCommentSelect, orderBy: { createdAt: "asc" } },
} as const;

export type RadiologyOrderResponse = Prisma.RadiologyOrderGetPayload<{
	select: typeof radiologyOrderSelect;
}>;

// دراسة واحدة بسياق فحصها — يقرؤها عارض الصور المستقل
const radiologyStudyDetailSelect = {
	...radiologyStudySelectShape,
	item: {
		select: {
			id: true,
			accession: true,
			modality: true,
			bodyPart: true,
			laterality: true,
			service: { select: { name: true } },
			order: {
				select: {
					id: true,
					code: true,
					clinicalInfo: true,
					patient: {
						select: {
							id: true,
							name: true,
							code: true,
							gender: true,
							age: true,
							animalType: { select: { arName: true } },
						},
					},
					owner: { select: { id: true, name: true } },
				},
			},
		},
	},
} as const;

export type RadiologyStudyDetailResponse = Prisma.RadiologyStudyGetPayload<{
	select: typeof radiologyStudyDetailSelect;
}>;

export const radiologyStudyDetailSelectShape = radiologyStudyDetailSelect;

export const radiologyOrderSelectShape = radiologyOrderSelect;
export const radiologyItemSelectShape = radiologyItemSelect;
export const radiologyReportSelectShape = radiologyReportSelect;
export const radiologyInvoiceSelectShape = radiologyInvoiceSelect;
export const radiologyActivitySelectShape = radiologyActivitySelect;

// ── مدخلات الـ DAO (مشتقة من Prisma) ───────────────────────────────────────

export type CreateRadiologyOrderInput = Pick<
	Prisma.RadiologyOrderUncheckedCreateInput,
	"clinicId" | "branchId" | "patientId" | "ownerId"
> &
	Partial<
		Pick<
			Prisma.RadiologyOrderUncheckedCreateInput,
			| "appointmentId"
			| "inpatientStayId"
			| "requestedById"
			| "priority"
			| "isUrgent"
			| "clinicalInfo"
			| "notes"
		>
	> & {
		// الفحوصات المطلوبة ضمن الطلب — كل واحد يصير عنصرًا بسير عمله
		serviceIds: string[];
		assignedToId?: string | null;
		origin?: RadiologyOrderOrigin;
		// تخصيص خصائص الفحص عند الطلب (تسقط لقيم التعريف عند تركها)
		bodyPart?: string | null;
		laterality?: RadiologyLaterality | null;
		views?: string[];
		withContrast?: boolean | null;
		// موعد الفحص لطلبات DIRECT — يسقط للحظة الإنشاء عند غيابه
		scheduledAt?: Date | null;
	};

export type UpdateRadiologyItemInput = Partial<
	Pick<
		Prisma.RadiologyOrderItemUncheckedUpdateInput,
		"status" | "stage" | "assignedToId" | "scheduledAt"
	>
>;

// ── قوالب التقارير ─────────────────────────────────────────────────────────

const radiologyTemplateSelect = {
	id: true,
	name: true,
	modality: true,
	serviceId: true,
	technique: true,
	comparison: true,
	findings: true,
	impression: true,
	recommendations: true,
	isDefault: true,
	active: true,
	service: { select: { id: true, name: true } },
} as const;

export type RadiologyTemplateResponse = Prisma.RadiologyReportTemplateGetPayload<{
	select: typeof radiologyTemplateSelect;
}>;

export const radiologyTemplateSelectShape = radiologyTemplateSelect;

// ── ملاحق التقرير ──────────────────────────────────────────────────────────

const radiologyAddendumSelect = {
	id: true,
	reportId: true,
	text: true,
	createdAt: true,
	authoredBy: { select: { id: true, name: true } },
	mentions: { select: { staff: { select: { id: true, name: true } } } },
	attachments: {
		select: { id: true, fileKey: true, fileName: true, mimeType: true, sizeBytes: true },
	},
} as const;

export type RadiologyAddendumResponse = Prisma.RadiologyReportAddendumGetPayload<{
	select: typeof radiologyAddendumSelect;
}>;

export const radiologyAddendumSelectShape = radiologyAddendumSelect;

// ── الدراسات السابقة (المقارنة) ────────────────────────────────────────────

/** فحص سابق للطفل نفسه — ما يكفي لعرضه في المقارنة وفتح صوره */
const priorExamSelect = {
	id: true,
	accession: true,
	modality: true,
	bodyPart: true,
	laterality: true,
	completedAt: true,
	createdAt: true,
	service: { select: { id: true, name: true } },
	report: {
		select: { findings: true, impression: true, criticalFinding: true },
	},
	studies: {
		select: {
			id: true,
			description: true,
			studyDate: true,
			series: { select: { id: true, instances: { select: { id: true } } } },
		},
		orderBy: { createdAt: "asc" },
	},
	order: { select: { id: true, code: true, clinicalInfo: true } },
} as const;

export type RadiologyPriorExamResponse = Prisma.RadiologyOrderItemGetPayload<{
	select: typeof priorExamSelect;
}>;

export const radiologyPriorExamSelectShape = priorExamSelect;

// ── مؤشّرات زمن الإنجاز (TAT) ──────────────────────────────────────────────

/**
 * زمن الإنجاز يُقاس على الفحوصات المكتملة وحدها: من إنشاء الطلب إلى اعتماد
 * التقرير. الوسيط أصدق من المتوسّط هنا لأن فحصًا واحدًا منسيًّا أسبوعًا
 * يجرّ المتوسّط وحده.
 */
export type RadiologyTatMetrics = {
	completedCount: number;
	/** بالدقائق */
	medianMinutes: number | null;
	p90Minutes: number | null;
	/** الفحوصات القائمة التي تجاوزت عتبة التنبيه */
	overdueCount: number;
	/** توزيع الفحوصات القائمة على الحالات */
	openByStatus: Record<string, number>;
	/** أطول الفحوصات القائمة انتظارًا */
	oldestOpen: {
		itemId: string;
		orderId: string;
		accession: string;
		serviceName: string;
		patientName: string;
		status: string;
		waitingMinutes: number;
	}[];
};

// ── مخططات النماذج (Zod) ───────────────────────────────────────────────────

/**
 * مصدر الطلب يحدّد حالته الأولى:
 * - VISIT: طلبه المدرّب من داخل زيارة → يدخل «الطلبات» لمراجعة قسم الأشعة
 * - DIRECT: أُنشئ من حوار «طلب أشعة جديد» → يبدأ «مجدول» مباشرةً
 * الافتراض «الزيارة» لأنه الأكثر تحفّظًا (يمرّ بموافقة بشرية).
 */
export const RADIOLOGY_ORDER_ORIGINS = ["VISIT", "DIRECT"] as const;
export type RadiologyOrderOrigin = (typeof RADIOLOGY_ORDER_ORIGINS)[number];

export const createRadiologyOrderSchema = z.object({
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	ownerId: z.string({ error: "وليّ الأمر مطلوب" }).min(1, "وليّ الأمر مطلوب"),
	// طلب واحد لكل فحص — صدر وبطن مثلًا طلبان ببطاقتين وفاتورتين
	serviceIds: z
		.array(z.string())
		.min(1, "اختر الفحص المطلوب")
		.max(1, "طلب واحد لكل فحص — أنشئ طلبًا آخر للفحص الثاني"),
	appointmentId: z.string().optional(),
	assignedToId: z.string().optional(),
	// المدرّب الطالب — يسقط لمستخدم الجلسة عند تركه فارغًا
	requestedById: z.string().optional(),
	priority: z.enum(TaskPriority).nullable().optional(),
	isUrgent: z.boolean().default(false),
	// السبب السريري للفحص — إلزامي مهنيًا لتفسير الصور
	clinicalInfo: z.string({ error: "السبب السريري مطلوب" }).min(1, "اكتب السبب السريري للفحص"),
	notes: z.string().optional(),
	bodyPart: z.string().nullable().optional(),
	laterality: z.enum(RadiologyLaterality).nullable().optional(),
	views: z.array(z.string()).default([]),
	withContrast: z.boolean().nullable().optional(),
	origin: z.enum(RADIOLOGY_ORDER_ORIGINS).default("VISIT"),
	// موعد الفحص — يُستعمل لطلبات DIRECT التي تبدأ «مجدول». طلبات الزيارة تدخل
	// «الطلبات» بلا موعد، ويُحدَّد موعدها عند التأكيد.
	scheduledAt: z.coerce.date().nullable().optional(),
});

export type CreateRadiologyOrderFormInput = z.input<typeof createRadiologyOrderSchema>;
export type CreateRadiologyOrderFormValues = z.output<typeof createRadiologyOrderSchema>;

/** حفظ التقرير — أقسام التقرير القياسية، كلها اختيارية ليُحفظ تدريجيًا */
export const radiologyReportSchema = z.object({
	technique: z.string().nullable().optional(),
	comparison: z.string().nullable().optional(),
	findings: z.string().nullable().optional(),
	impression: z.string().nullable().optional(),
	recommendations: z.string().nullable().optional(),
	criticalFinding: z.boolean().default(false),
	// مَن أُبلغ: مرجع المستخدم + لقطة اسمه وقت التبليغ
	criticalNotifiedTo: z.string().nullable().optional(),
	criticalNotifiedToId: z.string().nullable().optional(),
});

export type RadiologyReportFormInput = z.input<typeof radiologyReportSchema>;
export type RadiologyReportFormValues = z.output<typeof radiologyReportSchema>;

export const rejectRadiologySchema = z.object({
	reason: z.string({ error: "سبب الرفض مطلوب" }).min(1, "سبب الرفض مطلوب"),
});

export type RejectRadiologyFormInput = z.infer<typeof rejectRadiologySchema>;

/**
 * تأكيد طلب من الطلبات → مجدول، مع تعيين فنّي الأشعة والأولوية وملاحظة اختيارية.
 * الموعد وحده إلزامي: «مجدول» بلا موعد حالة بلا معنى، والفحص يبقى فيها حتى
 * يحين موعده (isRadiologyDue).
 */
export const confirmRadiologySchema = z.object({
	scheduledAt: z.coerce.date({ error: "موعد الفحص مطلوب" }),
	assignedToId: z.string().nullable().optional(),
	priority: z.enum(TaskPriority).nullable().optional(),
	notes: z.string().nullable().optional(),
});

export type ConfirmRadiologyFormInput = z.input<typeof confirmRadiologySchema>;
export type ConfirmRadiologyFormValues = z.output<typeof confirmRadiologySchema>;

/** إعادة جدولة فحص مجدول — الموعد إلزامي والسبب اختياري ويُسجَّل في النشاط */
export const rescheduleRadiologySchema = z.object({
	scheduledAt: z.coerce.date({ error: "الموعد الجديد مطلوب" }),
	reason: z.string().nullable().optional(),
});

export type RescheduleRadiologyFormInput = z.input<typeof rescheduleRadiologySchema>;
export type RescheduleRadiologyFormValues = z.output<typeof rescheduleRadiologySchema>;

/** رفض طلب من الطلبات — يُلغى الطلب ويُشعَر المدرّب الطالب بالسبب */
export const declineRadiologySchema = z.object({
	reason: z.string({ error: "سبب الرفض مطلوب" }).min(1, "اكتب سبب رفض الطلب"),
});

export type DeclineRadiologyFormInput = z.infer<typeof declineRadiologySchema>;

/** اعتماد التقرير — ملاحظة اختيارية للمراجع؛ التقرير نفسه محفوظ مسبقًا */
export const approveRadiologySchema = z.object({
	note: z.string().nullable().optional(),
});

export type ApproveRadiologyFormInput = z.infer<typeof approveRadiologySchema>;

/** قالب تقرير — الاسم إلزامي وبقيّة الأقسام اختيارية */
export const radiologyTemplateSchema = z.object({
	name: z.string({ error: "اسم القالب مطلوب" }).min(1, "اسم القالب مطلوب"),
	// القالب يخصّ فحصًا بعينه أو طريقة تصوير كاملة — أحدهما على الأقل
	modality: z.enum(RadiologyModality).nullable().optional(),
	serviceId: z.string().nullable().optional(),
	technique: z.string().nullable().optional(),
	comparison: z.string().nullable().optional(),
	findings: z.string().nullable().optional(),
	impression: z.string().nullable().optional(),
	recommendations: z.string().nullable().optional(),
	isDefault: z.boolean().default(false),
	active: z.boolean().default(true),
});

export type RadiologyTemplateFormInput = z.input<typeof radiologyTemplateSchema>;
export type RadiologyTemplateFormValues = z.output<typeof radiologyTemplateSchema>;

/** ملحق تقرير — النص إلزامي إلا إذا رُفع ملف، فالملحق الفارغ تمامًا لا معنى له */
export const radiologyAddendumSchema = z
	.object({
		text: z.string().optional().default(""),
		mentionedStaffIds: z.array(z.string()).default([]),
		attachments: z
			.array(
				z.object({
					fileKey: z.string().min(1),
					fileName: z.string().min(1),
					mimeType: z.string().nullable().optional(),
					sizeBytes: z.number().nullable().optional(),
				}),
			)
			.default([]),
	})
	.refine((v) => v.text.trim().length > 0 || v.attachments.length > 0, {
		error: "اكتب نص الملحق أو أرفق ملفًا",
		path: ["text"],
	});

/** تعليق على الطلب — نقاش الفريق، بإشارات اختيارية */
export const radiologyCommentSchema = z.object({
	body: z.string({ error: "اكتب التعليق" }).min(1, "اكتب التعليق"),
	mentionedStaffIds: z.array(z.string()).default([]),
});

export type RadiologyCommentFormInput = z.infer<typeof radiologyCommentSchema>;

export type RadiologyAddendumFormInput = z.infer<typeof radiologyAddendumSchema>;

// ── حالة دفع الطلب ─────────────────────────────────────────────────────────
// كل طلب أشعة يفتح فاتورته الخاصة تحتها كل فحوصاته. لا يمضي أي فحص خطوة
// واحدة خارج الطلبات قبل سداد تلك الفاتورة.

/**
 * «تنويم»: الطلب مكتوب من داخل إقامة، فلا فاتورة له هنا ولا بوّابة سداد —
 * بندُه يدخل فاتورة الإقامة حين يكتمل ويُسدَّد مع الخروج. ليس «مدفوعًا» (لم
 * يُدفع شيء) وليس «غير مفوتر» (المنع هناك مقصود)، فهو حالة ثالثة باسمها.
 */
export type RadiologyPaymentStatus = "PAID" | "UNPAID" | "UNBILLED" | "INPATIENT";

/** دالة نقية تُستخدم في الخادم والواجهة معًا */
export const radiologyPaymentStatus = (order: {
	invoice: { status: string; paidAt: Date | string | null } | null;
	inpatientStayId?: string | null;
}): RadiologyPaymentStatus => {
	if (order.inpatientStayId) return "INPATIENT";
	const invoice = order.invoice;
	// لا فاتورة (أو أُلغيت) = غير مفوتر — يُمنع أيضًا حتى تُصدر وتُسدَّد
	if (!invoice || invoice.status === "VOIDED") return "UNBILLED";
	return invoice.status === "PAID" || invoice.paidAt ? "PAID" : "UNPAID";
};

/**
 * لا يتقدّم الفحص إلا مسدَّدًا. «غير مفوتر» ممنوع أيضًا —
 * الطلب بلا فاتورة يجب أن يُفوتَر ويُسدَّد أولًا.
 */
export const canLeaveRadiologyQueue = (status: RadiologyPaymentStatus): boolean =>
	status === "PAID" || status === "INPATIENT";

/**
 * الحالات التي لا يتقدّم منها الفحص قبل السداد. «مجدول» منها لأن الطلب
 * المنشأ من حوار «طلب أشعة جديد» يبدأ مجدولًا فلا يمرّ بالطلبات أصلًا —
 * ولولا ذلك لتخطّى البوابة كلها.
 */
export const isRadiologyPaymentGatedStatus = (status: RadiologyStatus): boolean =>
	status === RadiologyStatus.QUEUE || status === RadiologyStatus.SCHEDULED;

export const RADIOLOGY_PAYMENT_META: Record<
	RadiologyPaymentStatus,
	{ label: string; className: string }
> = {
	PAID: { label: "مدفوع", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
	UNPAID: { label: "غير مدفوع", className: "border-red-200 bg-red-50 text-red-700" },
	// غير مفوتر يمنع المغادرة أيضًا — فيُعرض بلون حاجب لا محايد
	UNBILLED: { label: "غير مفوتر", className: "border-red-200 bg-red-50 text-red-700" },
	INPATIENT: {
		label: "على فاتورة الإقامة",
		className: "border-sky-200 bg-sky-50 text-sky-700",
	},
};

export const RADIOLOGY_UNPAID_BLOCK_MESSAGE =
	"لا يمكن المضيّ في الفحوصات قبل سداد فاتورة الطلب";

export const RADIOLOGY_UNBILLED_BLOCK_MESSAGE =
	"هذا الطلب غير مفوتر — أصدِر فاتورته وسدِّدها قبل المضيّ في الفحوصات";

/** رسالة المنع المناسبة لحالة السداد */
export const radiologyPaymentBlockMessage = (status: RadiologyPaymentStatus): string =>
	status === "UNBILLED" ? RADIOLOGY_UNBILLED_BLOCK_MESSAGE : RADIOLOGY_UNPAID_BLOCK_MESSAGE;

// ── التسميات ───────────────────────────────────────────────────────────────

export const LATERALITY_LABELS: Record<RadiologyLaterality, string> = {
	[RadiologyLaterality.NONE]: "غير محدد",
	[RadiologyLaterality.LEFT]: "يسار",
	[RadiologyLaterality.RIGHT]: "يمين",
	[RadiologyLaterality.BILATERAL]: "الجهتان",
};

// ── سجل النشاط ─────────────────────────────────────────────────────────────

export const RADIOLOGY_ACTIVITY_LABELS: Record<RadiologyActivityType, string> = {
	[RadiologyActivityType.CREATED]: "أنشأ الطلب",
	[RadiologyActivityType.STATUS_CHANGED]: "غيّر الحالة",
	[RadiologyActivityType.STAGE_CHANGED]: "غيّر المرحلة",
	[RadiologyActivityType.ASSIGNED]: "عيّن فنّي الأشعة",
	[RadiologyActivityType.SAFETY_COMPLETED]: "أكمل فحص السلامة",
	[RadiologyActivityType.MACHINE_ASSIGNED]: "عيّن جهاز التصوير",
	[RadiologyActivityType.IMAGES_UPLOADED]: "رفع صور الفحص",
	[RadiologyActivityType.REPORT_SAVED]: "حفظ التقرير",
	[RadiologyActivityType.SENT_TO_REVIEW]: "أرسل للمراجعة",
	[RadiologyActivityType.APPROVED]: "اعتمد التقرير",
	[RadiologyActivityType.REJECTED]: "رفض التقرير",
	[RadiologyActivityType.DECLINED]: "رفض الطلب",
	[RadiologyActivityType.CRITICAL_FLAGGED]: "أبلغ عن نتيجة حرجة",
	[RadiologyActivityType.INVOICE_PAID]: "سُدِّدت الفاتورة",
	[RadiologyActivityType.RESCHEDULED]: "غيّر موعد الفحص",
	[RadiologyActivityType.ADDENDUM_ADDED]: "ألحق بالتقرير",
};

// ── فلاتر القائمة ──────────────────────────────────────────────────────────

export type RadiologyPeriod = "day" | "week" | "all";
export type RadiologyView = "all" | "for-me";

export const RADIOLOGY_STAGES = Object.values(RadiologyStage);
export const RADIOLOGY_STATUSES = Object.values(RadiologyStatus);
