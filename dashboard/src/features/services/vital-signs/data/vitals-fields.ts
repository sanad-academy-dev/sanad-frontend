import type { MucousMembrane, VitalSignsSource } from "@/generated/prisma/enums";
import type {
	CreateVitalSignsFormValues,
	VitalsMetricKey,
} from "@/server/vital-signs/vital-signs.type";

/**
 * وصف كل قياس في مكان واحد — الجدول والرسم والنموذج وبطاقة اللقطة تقرأ منه جميعًا.
 * النطاقات هنا هي النصوص التي كانت مكرّرة داخل نموذج الفحص السريري؛ جمعها هنا يمنع
 * انحرافها بين الشاشات. راجع docs/vital-signs-plan.md §10-E: نطاقات حسب النوع
 * الطفلي ليست ضمن هذه المرحلة، والأرقام أدناه إرشادية عامة لا حدود تحقّق.
 */
export interface VitalsFieldSpec {
	key: VitalsMetricKey;
	label: string;
	/** الوحدة كما تُعرض بجانب الرقم — فارغة للمقاييس بلا وحدة */
	unit: string;
	step: number;
	min: number;
	max: number;
	/** عدد المنازل العشرية عند العرض */
	precision: number;
	/** تلميح النطاق الطبيعي داخل النموذج */
	hint?: string;
}

/**
 * لون واحد لكل الرسوم البيانية. رموز --chart-1..5 في هذا المشروع تدرّج لونيّ
 * واحد (أزرق بخمس درجات) لا مجموعة ألوان تصنيفية؛ إعطاء كل مقياس درجةً منها
 * يوحي بتصنيف غير موجود. كل رسم هنا سلسلة واحدة، والهوية يحملها عنوان الرسم
 * لا لونه، فاللون الواحد هو الصحيح. مُتحقَّق منه في الوضعين الفاتح والداكن.
 */
export const VITALS_CHART_COLOR = "var(--chart-2)";

export const VITALS_FIELDS: VitalsFieldSpec[] = [
	{
		key: "weight",
		label: "الوزن",
		unit: "كجم",
		step: 0.1,
		min: 0,
		max: 9999,
		precision: 1,
		hint: "مثال: 25.0",
	},
	{
		key: "temperature",
		label: "الحرارة",
		unit: "°م",
		step: 0.1,
		min: 0,
		max: 60,
		precision: 1,
		hint: "طبيعي: 37.5 – 39.2",
	},
	{
		key: "heartRate",
		label: "نبض القلب",
		unit: "نبضة/د",
		step: 1,
		min: 0,
		max: 999,
		precision: 0,
		hint: "طبيعي: 60 – 140",
	},
	{
		key: "respiratoryRate",
		label: "معدل التنفس",
		unit: "نفس/د",
		step: 1,
		min: 0,
		max: 999,
		precision: 0,
		hint: "طبيعي: 15 – 30",
	},
	{
		key: "oxygenSaturation",
		label: "تشبع الأكسجين",
		unit: "%",
		step: 1,
		min: 0,
		max: 100,
		precision: 0,
		hint: "طبيعي: 95 – 100",
	},
	{
		key: "painScore",
		label: "مقياس الألم",
		unit: "",
		step: 1,
		min: 0,
		max: 10,
		precision: 0,
		hint: "0 = لا ألم، 10 = شديد",
	},
	{
		key: "bodyConditionScore",
		label: "درجة حالة الجسم",
		unit: "",
		step: 1,
		min: 1,
		max: 9,
		precision: 0,
		hint: "1 = نحيف جدًا، 5 = مثالي، 9 = بدين",
	},
	{
		key: "capillaryRefillSec",
		label: "زمن امتلاء الشعيرات",
		unit: "ث",
		step: 0.5,
		min: 0,
		max: 99,
		precision: 1,
		hint: "طبيعي: أقل من 2",
	},
];

export const VITALS_FIELD_BY_KEY = new Map(VITALS_FIELDS.map((f) => [f.key, f]));

/**
 * مصدر القياس — خريطة **واحدة** مُلزَمة بـ`Record<VitalSignsSource, string>`.
 *
 * كانت ثلاث نسخ مكتوبة بيد في ثلاثة مكوّنات، فحين أضافت وحدة الطوارئ القيمة
 * `TRIAGE` إلى التعداد لم تتبعها أيٌّ منها — وكان `tsc` سيمسك ذلك لولا أن مشروع
 * العميل كان يسقط بنفاد الذاكرة قبل بلوغ الفحص، فبقيت الأخطاء الثلاثة مخفيّة.
 *
 * الوسمُ الصريح هو الحارس: قيمةٌ جديدة في التعداد تكسر البناء هنا، لا تُعرض
 * `undefined` في شارةٍ على شاشة.
 */
export const VITALS_SOURCE_LABELS: Record<VitalSignsSource, string> = {
	MANUAL: "يدوي",
	VISIT: "زيارة",
	LAB: "تحاليل",
	RADIOLOGY: "أشعة",
	OPERATION: "عمليات",
	GROOMING: "تجميل",
	INPATIENT: "تنويم",
	// [E2] قياسات تُلتقط أثناء فرز الطوارئ (`TriageAssessment.vitalsRecordId`)
	TRIAGE: "فرز الطوارئ",
};

export const MUCOUS_MEMBRANE_LABELS: Record<MucousMembrane, string> = {
	PINK: "وردية",
	PALE: "شاحبة",
	CYANOTIC: "زرقاء",
	ICTERIC: "صفراء",
	CONGESTED: "محتقنة",
	MUDDY: "داكنة",
};

/**
 * ما يُعرض في كل سياق. الزيارة تلتقط كل شيء؛ المختبر والأشعة يلتقطان ما يلزم
 * لتفسير النتيجة أو حساب الجرعة فقط — إظهار حقول لا تُملأ يجعل النموذج يُتخطّى.
 */
export const VITALS_PROFILES = {
	FULL: [
		"weight",
		"temperature",
		"heartRate",
		"respiratoryRate",
		"oxygenSaturation",
		"painScore",
		"bodyConditionScore",
		"capillaryRefillSec",
	],
	BASIC: ["weight", "temperature", "heartRate", "respiratoryRate"],
} as const satisfies Record<string, readonly VitalsMetricKey[]>;

export type VitalsProfile = keyof typeof VITALS_PROFILES;

/** هل يظهر ضغط الدم والأغشية المخاطية في هذا السياق */
export const PROFILE_HAS_EXTRAS: Record<VitalsProfile, boolean> = {
	FULL: true,
	BASIC: false,
};

/** تنسيق قيمة قياس للعرض — Decimal يصل كسلسلة نصية من Prisma */
export function formatVitalValue(
	value: string | number | null | undefined,
	spec: VitalsFieldSpec,
): string {
	if (value == null || value === "") return "—";
	const n = typeof value === "number" ? value : Number(value);
	if (Number.isNaN(n)) return "—";
	return n.toFixed(spec.precision);
}

/** القيم الابتدائية لنموذج قياس جديد — كلها فارغة، فالحقل غير المملوء يبقى null */
export function emptyVitalsForm(patientId: string): CreateVitalSignsFormValues {
	return {
		patientId,
		recordedAt: undefined,
		branchId: null,
		weight: null,
		temperature: null,
		heartRate: null,
		respiratoryRate: null,
		oxygenSaturation: null,
		bloodPressure: null,
		painScore: null,
		bodyConditionScore: null,
		capillaryRefillSec: null,
		mucousMembrane: null,
		notes: null,
	};
}
