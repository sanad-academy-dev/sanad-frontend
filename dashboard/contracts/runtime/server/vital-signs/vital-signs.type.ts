import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { MucousMembrane, type VitalSignsSource } from "@/generated/prisma/enums";

export type { MucousMembrane, VitalSignsSource };

// ── حدود النضارة (docs/vital-signs-plan.md §5) ────────────────────────────────
// القياس المُقترح تلقائيًا في أي مستند يحمل شارة تُبيّن عمره. القرار الوحيد الذي
// يغيّر سلوك الواجهة: القياس الذي تجاوز STALE لا يُختار مسبقًا، بل يفتح النموذج
// على «قياس جديد» — التحذير وحده لا يكفي حين يمضي يوم كامل على آخر قياس.
export const VITALS_FRESHNESS = {
	/** أحدث من ذلك: يُختار مسبقًا بلا تنبيه */
	FRESH_MINUTES: 4 * 60,
	/** أقدم من ذلك: لا يُختار مسبقًا */
	STALE_MINUTES: 24 * 60,
} as const;

export type VitalsFreshness = "FRESH" | "AGING" | "STALE";

export function vitalsFreshness(recordedAt: Date | string, now = new Date()): VitalsFreshness {
	const ageMinutes = (now.getTime() - new Date(recordedAt).getTime()) / 60_000;
	if (ageMinutes <= VITALS_FRESHNESS.FRESH_MINUTES) return "FRESH";
	if (ageMinutes <= VITALS_FRESHNESS.STALE_MINUTES) return "AGING";
	return "STALE";
}

// ── شكل الاستجابة ─────────────────────────────────────────────────────────────

const vitalSignsSelect = {
	id: true,
	code: true,
	patientId: true,
	branchId: true,
	recordedAt: true,
	source: true,
	appointmentId: true,
	labOrderId: true,
	radiologyOrderId: true,
	operationId: true,
	weight: true,
	temperature: true,
	heartRate: true,
	respiratoryRate: true,
	oxygenSaturation: true,
	bloodPressure: true,
	painScore: true,
	bodyConditionScore: true,
	capillaryRefillSec: true,
	mucousMembrane: true,
	notes: true,
	correctsId: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	recordedBy: { select: { id: true, name: true } },
	// وجود تصحيح يجعل السجل مُتجاوَزًا في العرض — الصف يُكتَم وتظهر شارة «مُصحَّح»
	correction: { select: { id: true, code: true, recordedAt: true } },
} satisfies Prisma.VitalSignsRecordSelect;

export const vitalSignsSelectShape = vitalSignsSelect;

export type VitalSignsRecordResponse = Prisma.VitalSignsRecordGetPayload<{
	select: typeof vitalSignsSelect;
}>;

/** السجل مع المستندات المرتبطة به — يُستعمل لفحص قابلية التعديل/الحذف */
export type VitalSignsRecordWithLinks = Prisma.VitalSignsRecordGetPayload<{
	select: typeof vitalSignsSelect & {
		clinicalExams: { select: { id: true } };
		preAnalyticals: { select: { id: true } };
		safetyScreenings: { select: { id: true } };
	};
}>;

// ── المقاييس ──────────────────────────────────────────────────────────────────

/** المفاتيح الرقمية القابلة للرسم البياني — مصدر واحد للجدول والرسم */
export const VITALS_METRIC_KEYS = [
	"weight",
	"temperature",
	"heartRate",
	"respiratoryRate",
	"oxygenSaturation",
	"painScore",
	"bodyConditionScore",
	"capillaryRefillSec",
] as const;

export type VitalsMetricKey = (typeof VITALS_METRIC_KEYS)[number];

// ── مخططات النماذج ────────────────────────────────────────────────────────────

// بلا coerce ولا transform: المدخل والمخرج متطابقان، فيبقى نوع النموذج واحدًا
// عبر useForm/zodResolver. التحويل من نص الحقل إلى رقم يقع في setValueAs،
// والتقريب إلى عدد صحيح يقع عند بناء جسم الطلب.
const optionalNumber = (label: string, min: number, max: number) =>
	z
		.number({ error: `${label} يجب أن يكون رقمًا` })
		.min(min, `${label} يجب أن يكون ${min} على الأقل`)
		.max(max, `${label} يجب ألا يتجاوز ${max}`)
		.nullish();

export const createVitalSignsSchema = z.object({
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	// الافتراضي هو الآن، والتأريخ للخلف مسموح لتسجيل قياس أُخذ قبل الإدخال
	recordedAt: z.date({ error: "وقت القياس غير صالح" }).optional(),
	branchId: z.string().nullish(),
	weight: optionalNumber("الوزن", 0, 9999),
	temperature: optionalNumber("الحرارة", 0, 60),
	heartRate: optionalNumber("النبض", 0, 999),
	respiratoryRate: optionalNumber("معدل التنفس", 0, 999),
	oxygenSaturation: optionalNumber("تشبع الأكسجين", 0, 100),
	bloodPressure: z
		.string()
		.trim()
		.regex(/^\d{2,3}\/\d{2,3}$/, "الصيغة المتوقعة: انقباضي/انبساطي مثال 120/80")
		.nullish(),
	painScore: optionalNumber("مقياس الألم", 0, 10),
	bodyConditionScore: optionalNumber("درجة حالة الجسم", 1, 9),
	capillaryRefillSec: optionalNumber("زمن امتلاء الشعيرات", 0, 99),
	mucousMembrane: z.enum(MucousMembrane).nullish(),
	notes: z.string().trim().max(1000, "الملاحظات طويلة جدًا").nullish(),
});

/** كل ما يُعدّ قياسًا — المقاييس الرقمية إضافةً إلى ضغط الدم والأغشية المخاطية */
export const VITALS_MEASUREMENT_KEYS = [
	...VITALS_METRIC_KEYS,
	"bloodPressure",
	"mucousMembrane",
] as const;

export type VitalsMeasurementKey = (typeof VITALS_MEASUREMENT_KEYS)[number];

/**
 * سجل بلا أي قياس لا معنى له — يشوّش الجدول ويضيف نقطة فارغة للرسم البياني.
 * الفحص دالة مستقلة لا refine على المخطط: خطأ المستوى الأعلى في zodResolver
 * يصل بمسار فارغ يصعب عرضه، والقاعدة نفسها يفرضها الخادم على كل مسار كتابة.
 */
export function hasAnyMeasurement(v: Partial<Record<VitalsMeasurementKey, unknown>>): boolean {
	return VITALS_MEASUREMENT_KEYS.some((k) => v[k] != null);
}

export const EMPTY_RECORD_MESSAGE = "أدخل قياسًا واحدًا على الأقل";

export type CreateVitalSignsFormInput = z.input<typeof createVitalSignsSchema>;
export type CreateVitalSignsFormValues = z.output<typeof createVitalSignsSchema>;

/** مدخل الـ DAO — مشتق من Prisma لا مكتوب يدويًا */
export type CreateVitalSignsInput = Pick<
	Prisma.VitalSignsRecordUncheckedCreateInput,
	| "clinicId"
	| "patientId"
	| "branchId"
	| "recordedAt"
	| "source"
	| "recordedById"
	| "appointmentId"
	| "labOrderId"
	| "radiologyOrderId"
	| "operationId"
	| "weight"
	| "temperature"
	| "heartRate"
	| "respiratoryRate"
	| "oxygenSaturation"
	| "bloodPressure"
	| "painScore"
	| "bodyConditionScore"
	| "capillaryRefillSec"
	| "mucousMembrane"
	| "notes"
	| "correctsId"
>;

export type UpdateVitalSignsInput = Partial<
	Omit<CreateVitalSignsInput, "clinicId" | "patientId" | "source" | "correctsId">
>;

// ── الربط بالمستندات ──────────────────────────────────────────────────────────

export const VITALS_ATTACH_TYPES = ["VISIT", "LAB", "RADIOLOGY", "OPERATION"] as const;
export type VitalsAttachType = (typeof VITALS_ATTACH_TYPES)[number];

/** «أنشئ واستعمل هنا» — الإنشاء والربط في نداء واحد داخل معاملة واحدة */
export type VitalsAttachTarget = { type: VitalsAttachType; id: string };

/** نتائج الـ DAO التي يترجمها المتحكّم إلى رموز HTTP ورسائل عربية */
export type VitalsDaoError =
	| "not-found"
	| "patient-not-found"
	| "linked-immutable"
	| "linked-undeletable"
	| "attach-target-not-found"
	| "empty-record";
