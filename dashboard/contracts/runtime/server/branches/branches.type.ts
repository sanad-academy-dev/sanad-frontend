import { z } from "zod";
import type { Branch, Prisma } from "@/generated/prisma/client";

export type BranchWriteFields = Omit<Branch, "id" | "branchCode" | "createdAt" | "updatedAt">;

export const createBranchSchema = z.object({
	name: z.string({ error: "اسم الفرع مطلوب" }).min(1, "اسم الفرع مطلوب"),
	branchCode: z
		.string()
		.trim()
		.max(12, "المعرّف يجب ألا يتجاوز 12 حرفًا")
		.regex(/^[A-Za-z0-9-]*$/, "المعرّف يقبل حروفًا إنجليزية وأرقامًا وشرطة فقط")
		.optional(),
	icon: z.string().optional(),
	type: z.enum(["PRIMARY", "SUB"], { error: "نوع الفرع مطلوب" }),
	managerIds: z.array(z.string()).min(1, "المسؤول مطلوب"),
	email: z
		.string({ error: "البريد الإلكتروني مطلوب" })
		.min(1, "البريد الإلكتروني مطلوب")
		.email("البريد الإلكتروني غير صالح"),
	city: z.string({ error: "المدينة مطلوبة" }).min(1, "المدينة مطلوبة"),
	address: z.string({ error: "العنوان التفصيلي مطلوب" }).min(1, "العنوان التفصيلي مطلوب"),
	active: z.boolean({ error: "حالة الفرع مطلوبة" }),
	enableWarehouse: z.boolean({ error: "إعداد المستودع مطلوب" }),
});

export type CreateBranchFormInput = z.infer<typeof createBranchSchema>;

export type CreateBranchInput = Pick<
	BranchWriteFields,
	"clinicId" | "name" | "address" | "type"
> &
	Partial<
		Pick<BranchWriteFields, "managerId" | "email" | "city" | "phone" | "active" | "icon">
	> & {
		branchCode?: Branch["branchCode"] | null;
		managerIds?: string[];
		enableWarehouse?: boolean;
	};

// «settings» يُحدَّث حصريًا عبر updateSettings (يتطلب Json معالجة خاصة في Prisma)
export type UpdateBranchInput = Partial<Omit<BranchWriteFields, "clinicId" | "settings">>;

export const updateBranchSchema = z.object({
	name: z.string().min(1, "اسم الفرع مطلوب"),
	icon: z.string().optional().nullable(),
	type: z.enum(["PRIMARY", "SUB"]).optional(),
	active: z.boolean().optional(),
	emergencyNotifications: z.boolean().optional(),
	managerId: z.string().optional().nullable(),
	email: z.email("البريد الإلكتروني غير صالح").optional().nullable(),
	phone: z.string().optional().nullable(),
	city: z.string().optional().nullable(),
	address: z.string().optional(),
});

export type UpdateBranchFormInput = z.infer<typeof updateBranchSchema>;

export type BranchWithManager = Prisma.BranchGetPayload<{
	include: {
		manager: { select: { id: true; name: true; email: true; image: true; phone: true } };
		managers: { select: { id: true; name: true; email: true; image: true } };
		warehouses: { select: { id: true; active: true } };
		_count: { select: { rooms: true; branchUsers: true } };
	};
}>;

// ── المختبر: أجهزة التحليل ──────────────────────────────────────────────────

const labAnalyzerSchema = z.object({
	id: z.string(),
	name: z.string(),
	category: z.string(),
	connected: z.boolean().default(false),
	// عدد العيّنات التي يعالجها الجهاز في آنٍ واحد — جهاز بمكان واحد افتراضًا
	slots: z.coerce.number().int().min(1).max(50).default(1),
});

const DEFAULT_LAB_ANALYZERS = [
	{
		id: "mindray-bc-6800",
		name: "Mindray BC-6800",
		category: "Hematology",
		connected: true,
		slots: 2,
	},
	{
		id: "roche-cobas-c311",
		name: "Roche Cobas c311",
		category: "Biochemistry",
		connected: true,
		slots: 1,
	},
	{
		id: "idexx-sedivue",
		name: "IDEXX SediVue",
		category: "Urinalysis",
		connected: false,
		slots: 1,
	},
	{
		id: "sysmex-xn-550",
		name: "Sysmex XN-550",
		category: "Hematology",
		connected: false,
		slots: 1,
	},
	{
		id: "abbott-cell-dyn",
		name: "Abbott Cell-Dyn",
		category: "Hematology",
		connected: false,
		slots: 1,
	},
];

// ── الأشعة: أجهزة التصوير ───────────────────────────────────────────────────

const radiologyMachineSchema = z.object({
	id: z.string(),
	name: z.string(),
	// طريقة التصوير — قيمة RadiologyModality نصًا حتى يبقى الـ JSON بسيطًا
	modality: z.string(),
	room: z.string().default(""),
	connected: z.boolean().default(false),
	// عدد الفحوصات التي يستقبلها الجهاز في آنٍ واحد — جهاز بمكان واحد افتراضًا
	slots: z.coerce.number().int().min(1).max(50).default(1),
});

const DEFAULT_RADIOLOGY_MACHINES = [
	{
		id: "dr-xray-room-1",
		name: "جهاز الأشعة السينية الرقمي (DR)",
		modality: "XRAY",
		room: "قاعة الأشعة 1",
		connected: true,
		slots: 1,
	},
	{
		id: "us-mindray-dc70",
		name: "Mindray DC-70 سونار",
		modality: "ULTRASOUND",
		room: "قاعة السونار",
		connected: true,
		slots: 1,
	},
	{
		id: "dental-xray-io",
		name: "جهاز أشعة الأسنان",
		modality: "DENTAL",
		room: "أكاديمية الأسنان",
		connected: false,
		slots: 1,
	},
];

// ── إعدادات سير العمل للفرع (تُخزَّن في العمود Json «settings») ──────────────
export const branchSettingsSchema = z.object({
	queue: z
		.object({
			// معطّل افتراضيًا: الوضع الحر (عمود الطابور ظاهر + الحجز الأونلاين متاح) هو
			// السلوك السابق للميزة؛ تفعيله يحوّل الفرع لوضع موافقة الطابور
			enabled: z.boolean().default(false),
			medicalPriority: z.boolean().default(true),
			emergencyToFront: z.boolean().default(false),
			mentions: z.boolean().default(true),
			responsibleIds: z.array(z.string()).default([]),
			// أسماء مراحل سير عمل الزيارة المخصّصة (مفتاح AppointmentStatus → الاسم)؛
			// المفاتيح الغائبة تسقط للأسماء الافتراضية في STATUS_LABELS.
			// الطابور (WAITING) مرحلة نظامية باسم ثابت — يُجرَّد أي تخصيص له.
			statusLabels: z
				.record(z.string(), z.string())
				.default({})
				.transform((labels) => {
					const { WAITING: _ignored, ...rest } = labels;
					return rest;
				}),
		})
		.prefault({}),
	tasks: z
		.object({
			enabled: z.boolean().default(false),
			comments: z.boolean().default(true),
			mentions: z.boolean().default(true),
			autoCloseMain: z.boolean().default(false),
			autoCloseSub: z.boolean().default(false),
			autoCloseStale: z.boolean().default(false),
			creatorIds: z.array(z.string()).default([]),
			approverIds: z.array(z.string()).default([]),
			assigneeIds: z.array(z.string()).default([]),
			// أسماء مراحل سير عمل المهام المخصّصة (مفتاح TaskStatus → الاسم)؛
			// الطابور (QUEUE) مرحلة نظامية باسم ثابت — يُجرَّد أي تخصيص له
			statusLabels: z
				.record(z.string(), z.string())
				.default({})
				.transform((labels) => {
					const { QUEUE: _ignored, ...rest } = labels;
					return rest;
				}),
		})
		.prefault({}),
	warehouse: z
		.object({
			purchaseOrders: z.boolean().default(true),
			requireApprovalOnOrder: z.boolean().default(false),
			interBranchTransfer: z.boolean().default(false),
			periodicCount: z.boolean().default(true),
			periodicCountInterval: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY"]).default("WEEKLY"),
			stockAlerts: z.boolean().default(true),
			purchaseResponsibleIds: z.array(z.string()).default([]),
			receiveResponsibleIds: z.array(z.string()).default([]),
		})
		.prefault({}),
	// تفعيل دورات الفرع (سير العمل) — معطّلة افتراضيًا حتى يُفعّلها الفرع
	// ── [E0] الطوارئ والفرز — الخطة: docs/emergency-workflow-plan.md §7.1 ──
	//
	// معطّلة افتراضيًا، والإطفاء يعني **سلوك اليوم حرفًا بحرف**: `isEmergency` يبقى
	// مفتاحًا يدويًا، ولا عمود فرز، ولا حارس جديد على آلة الحالات. فرعٌ واحد قد يدير
	// طوارئ وبقيّة الفروع لا، ولهذا هي على الفرع لا على الأكاديمية (القرار D1) — ولهذا
	// أيضًا هي JSON: لا نوع Prisma جديد، وسقف عمق الأنواع قريب.
	emergency: z
		.object({
			enabled: z.boolean().default(false),
			// المسار السريع للأحمر (D5): يمشي WAITING → CHECK_IN → IN_SERVICE في
			// معاملة واحدة، وكل خطوة صفّ STATUS_CHANGED بسببه — لا قفز فوق المصفوفة
			redFastWalk: z.boolean().default(true),
			// حارس «لا دورة قبل فرز» — مطفأ افتراضيًا: أكاديميةٌ تجرّب الوحدة لا يصحّ أن
			// تُمنع من العمل بحارس لم تطلبه
			requireTriageBeforeService: z.boolean().default(false),
			// تأجيل واجهة التحصيل للألوان الحرجة — ترتيبُ واجهة، وبوابة الدفتر لا تُمسّ
			deferPaymentUx: z.boolean().default(true),
			untriagedAlertMinutes: z.coerce.number().int().min(1).max(120).default(10),
			defaultDurationMinutes: z.coerce.number().int().min(5).max(240).default(30),
			// المدرّب الافتراضي المستقبِل — أوّل خطوة في ترتيب الحلّ (D3)
			defaultVetStaffId: z.string().nullable().default(null),
			// نوع الكشف «طوارئ» بسعره — يُضبط على الزيارة عند التحويل
			consultationTypeId: z.string().nullable().default(null),
			// دورة «خارج الدوام» — سطر يُضاف حين يقع الوصول خارج نوافذ الورديات
			afterHoursServiceId: z.string().nullable().default(null),
			// غرف الإنعاش/الاستقبال — منها تُحسب السعة على اللوحة
			bayRoomIds: z.array(z.string()).default([]),
			// مستودع عربة الإنعاش — لوحة النواقص تقرأ منه
			crashCartWarehouseId: z.string().nullable().default(null),
			// طفل مجهول (شارد، أحضره غريب): يُفتح له وصول بلا طفل (D2)
			allowUnidentifiedPatients: z.boolean().default(true),
		})
		.prefault({}),
	services: z
		.object({
			labTests: z.boolean().default(false),
			radiology: z.boolean().default(false),
		})
		.prefault({}),
	// إعدادات المختبر — تظهر داخل صفحة «التحليلات» في دورات الفرع
	labTests: z
		.object({
			analyzers: z.array(labAnalyzerSchema).default(DEFAULT_LAB_ANALYZERS),
			ai: z
				.object({
					autoInterpretation: z.boolean().default(true),
					duplicateDetection: z.boolean().default(true),
					criticalAlerts: z.boolean().default(true),
					trendAnalysis: z.boolean().default(true),
					predictiveMaintenance: z.boolean().default(false),
				})
				.prefault({}),
			// معرّفات قواعد Westgard المفعّلة (LAB_WESTGARD_RULES)
			westgardRules: z.array(z.string()).default(["1-2s", "1-3s", "R-4s"]),
			lis: z.boolean().default(false),
			barcode: z
				.object({
					enabled: z.boolean().default(true),
					labelSize: z.string().default("40x20mm"),
					printerModel: z.string().default("Zebra ZD420"),
					copies: z.coerce.number().int().min(1).max(10).default(2),
				})
				.prefault({}),
		})
		.prefault({}),
	// إعدادات الأشعة — تظهر داخل صفحة «الأشعة» في دورات الفرع
	radiology: z
		.object({
			machines: z.array(radiologyMachineSchema).default(DEFAULT_RADIOLOGY_MACHINES),
			ai: z
				.object({
					// مسودّة التقرير بالذكاء الاصطناعي في محرّر التقارير
					autoDraftReport: z.boolean().default(true),
					criticalAlerts: z.boolean().default(true),
					doseOutlierDetection: z.boolean().default(false),
					autoQualityCheck: z.boolean().default(false),
				})
				.prefault({}),
			// تتبّع الجرعة الإشعاعية (kVp/mAs/DAP) في خطوة الالتقاط
			dose: z
				.object({
					trackDose: z.boolean().default(true),
					requireForXray: z.boolean().default(false),
				})
				.prefault({}),
			// تكامل PACS/DICOMweb — حقول اتصال فقط في هذه المرحلة
			pacs: z
				.object({
					enabled: z.boolean().default(false),
					aeTitle: z.string().default(""),
					host: z.string().default(""),
					port: z.coerce.number().int().min(1).max(65535).default(104),
				})
				.prefault({}),
		})
		.prefault({}),
	/**
	 * ما يعرضه **تطبيق وليّ الأمر** من معلومات هذا الفرع — يقرؤها `pet-portal` من الفرع
	 * الرئيسي (PRIMARY) للأكاديمية.
	 *
	 * كل مفتاح افتراضيّه `true`: التطبيق يعرض اليوم كل ما هنا، والإعداد بابٌ للإخفاء
	 * لا للإظهار — أكاديميةٌ لم تلمس الإعدادات لا يتغيّر تطبيقها. وكل ميزة عرضٍ جديدة في
	 * التطبيق تُضاف هنا مفتاحًا مع إضافتها، فيبقى القرار للأكاديمية لا للشيفرة.
	 */
	petPortal: z
		.object({
			// سجلّ الطفل — أنواع الأحداث الظاهرة في خطّه الزمني
			timelineVaccinations: z.boolean().default(true),
			timelineVitals: z.boolean().default(true),
			timelineCarePlans: z.boolean().default(true),
			timelineGrooming: z.boolean().default(true),
			// تقرير الزيارة — أقسامه
			reportServices: z.boolean().default(true),
			reportProducts: z.boolean().default(true),
			reportVitals: z.boolean().default(true),
			reportVaccinations: z.boolean().default(true),
			reportInvoice: z.boolean().default(true),
			// الأسعار في شاشة الحجز وفي التقارير
			showPrices: z.boolean().default(true),
		})
		.prefault({}),
});

export type BranchSettings = z.infer<typeof branchSettingsSchema>;
export type PetPortalDisplay = BranchSettings["petPortal"];

/** يقرأ العمود Json ويعيد إعدادات كاملة بالقيم الافتراضية عند النقص أو التلف */
export const parseBranchSettings = (raw: unknown): BranchSettings => {
	const parsed = branchSettingsSchema.safeParse(raw ?? {});
	return parsed.success ? parsed.data : branchSettingsSchema.parse({});
};

export type BranchUserWithUser = Prisma.BranchUserGetPayload<{
	include: {
		user: { select: { id: true; name: true; email: true; image: true } };
	};
}>;

export type BranchUserWithDetails = Prisma.BranchUserGetPayload<{
	include: {
		user: {
			select: {
				id: true;
				name: true;
				email: true;
				image: true;
				phone: true;
				clinicUsers: { select: { role: true } };
			};
		};
	};
}> & { inviteAccepted: boolean };
