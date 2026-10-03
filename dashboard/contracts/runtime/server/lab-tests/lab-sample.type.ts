import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { LabFastingStatus, LabSampleQuality, LabTubeType } from "@/generated/prisma/enums";
import { vitalSignsSelectShape } from "@sanad/contracts/runtime/server/vital-signs/vital-signs.type";

// ── جمع العيّنة: التقييم ما قبل التحليلي + تفاصيل السحب ───────────────────

// التقييم ما قبل التحليلي على مستوى الطلب — خاص بالطفل لا بالتحليل،
// فلا يُعاد سؤاله لكل تحليل داخل الطلب نفسه.
const preAnalyticalSelect = {
	id: true,
	orderId: true,
	fastingStatus: true,
	fastingHours: true,
	medications: true,
	ivFluids24h: true,
	// القياسات تُقرأ من لقطة العلامات الحيوية المرتبطة لا من أعمدة مهجورة
	vitalsRecordId: true,
	vitalsRecord: { select: vitalSignsSelectShape },
} as const;

export const preAnalyticalSelectShape = preAnalyticalSelect;

export type LabPreAnalyticalResponse = Prisma.LabPreAnalyticalGetPayload<{
	select: typeof preAnalyticalSelect;
}>;

// تفاصيل السحب لكل تحليل — الأنبوب وموقع السحب يختلفان بين التحاليل
const sampleCollectionSelect = {
	id: true,
	itemId: true,
	tubeType: true,
	drawSite: true,
	volumeMl: true,
	attempts: true,
	collectedAt: true,
	quality: true,
	collectionNotes: true,
	analyzerId: true,
	analyzerName: true,
	handedOverAt: true,
	labelsPrinted: true,
	collectedBy: { select: { id: true, name: true } },
} as const;

export const sampleCollectionSelectShape = sampleCollectionSelect;

export type LabSampleCollectionResponse = Prisma.LabSampleCollectionGetPayload<{
	select: typeof sampleCollectionSelect;
}>;

// ── التسميات العربية (تُستخدم في الواجهة وملخّص سلسلة الحفظ) ───────────────

export const FASTING_LABELS: Record<LabFastingStatus, string> = {
	[LabFastingStatus.FASTED]: "نعم — صائم",
	[LabFastingStatus.PARTIAL]: "جزئي",
	[LabFastingStatus.NOT_FASTED]: "لا — غير صائم",
};

export const TUBE_LABELS: Record<LabTubeType, { label: string; hint: string }> = {
	[LabTubeType.EDTA]: { label: "EDTA", hint: "CBC، تعداد الدم" },
	[LabTubeType.SST]: { label: "جيل (SST)", hint: "كيمياء الدم، هرمونات" },
	[LabTubeType.CITRATE]: { label: "سيترات", hint: "تخثر الدم" },
	[LabTubeType.HEPARIN]: { label: "هيبارين", hint: "فحوصات خاصة" },
	[LabTubeType.URINE]: { label: "أنبوب بول", hint: "تحليل بول" },
	[LabTubeType.SWAB]: { label: "مسحة", hint: "مزارع ومسحات" },
};

// الأيقونة تُختار في الواجهة (SVG من Tabler) — هنا التسمية واللون فقط،
// فملف الأنواع يبقى خاليًا من JSX.
export const QUALITY_META: Record<LabSampleQuality, { label: string; className: string }> = {
	[LabSampleQuality.EXCELLENT]: {
		label: "ممتازة",
		className: "border-emerald-200 bg-emerald-50 text-emerald-700",
	},
	[LabSampleQuality.GOOD]: {
		label: "جيدة",
		className: "border-green-200 bg-green-50 text-green-700",
	},
	[LabSampleQuality.ACCEPTABLE]: {
		label: "مقبولة",
		className: "border-amber-200 bg-amber-50 text-amber-700",
	},
	[LabSampleQuality.REJECTED]: {
		label: "مرفوضة",
		className: "border-red-200 bg-red-50 text-red-700",
	},
};

/**
 * مواقع سحب العيّنة — مجموعة مقترحة قابلة للبحث، ولا تمنع إدخال موقع مخصّص.
 * مقسّمة حسب نوع العيّنة لتسهيل الاختيار.
 */
export const DRAW_SITE_GROUPS: { label: string; options: string[] }[] = [
	{
		label: "أوردة الدم",
		options: [
			"الوريد الوداجي (Jugular)",
			"الوريد الرأسي — يمين (Cephalic)",
			"الوريد الرأسي — يسار (Cephalic)",
			"الوريد الصافن الجانبي (Lateral saphenous)",
			"الوريد الصافن الإنسي (Medial saphenous)",
			"الوريد الفخذي (Femoral)",
			"الوريد الأذني الهامشي (Marginal ear)",
			"الوريد الذيلي (Coccygeal)",
			"وريد الجناح العضدي (Brachial)",
			"قسطرة وريدية قائمة (IV catheter)",
			"الشريان الفخذي — غازات الدم",
		],
	},
	{
		label: "عيّنات البول",
		options: [
			"بزل المثانة (Cystocentesis)",
			"قسطرة بولية (Urinary catheter)",
			"عيّنة وسط التبول (Free catch)",
		],
	},
	{
		label: "المسحات",
		options: [
			"مسحة أذن",
			"مسحة جلد / كشط جلدي",
			"مسحة عين",
			"مسحة فم أو بلعوم",
			"مسحة أنف",
			"مسحة مهبلية",
			"مسحة مستقيمية",
			"مسحة جرح",
		],
	},
	{
		label: "عيّنات أخرى",
		options: [
			"شفط بالإبرة الدقيقة (FNA)",
			"سائل مفصلي (Arthrocentesis)",
			"سائل شوكي (CSF)",
			"خزعة نسيجية",
			"سائل بطني أو صدري",
		],
	},
];

/** الأدوية الحالية — خيارات ثابتة؛ "لا يتناول أدوية" يُلغي البقية */
export const MEDICATION_OPTIONS = [
	"المضادات الحيوية",
	"الستيرويدات",
	"مدرات البول",
	"مضادات الالتهاب",
	"أدوية القلب",
] as const;

export const NO_MEDICATIONS = "لا يتناول أدوية";

// ── المخططات ───────────────────────────────────────────────────────────────

/** ① التقييم ما قبل التحليلي — كل الحقول اختيارية ليُحفظ تدريجيًا */
export const preAnalyticalSchema = z
	.object({
		fastingStatus: z.enum(LabFastingStatus).nullable().optional(),
		fastingHours: z.coerce.number().int().min(0).max(240).nullable().optional(),
		medications: z.array(z.string()).default([]),
		ivFluids24h: z.boolean().nullable().optional(),
		// القياسات انتقلت إلى سجل العلامات الحيوية — يُربط بالمعرّف لا يُكتب هنا
	})
	// ساعات الصيام مطلوبة عند "صائم" أو "جزئي"
	.refine(
		(d) =>
			!(
				(d.fastingStatus === LabFastingStatus.FASTED ||
					d.fastingStatus === LabFastingStatus.PARTIAL) &&
				(d.fastingHours == null || Number.isNaN(d.fastingHours))
			),
		{ path: ["fastingHours"], message: "أدخل عدد ساعات الصيام" },
	);

export type PreAnalyticalFormInput = z.input<typeof preAnalyticalSchema>;
export type PreAnalyticalFormValues = z.output<typeof preAnalyticalSchema>;

/** ② تفاصيل الجمع */
export const collectionDetailsSchema = z.object({
	tubeType: z.enum(LabTubeType).nullable().optional(),
	collectedById: z.string().nullable().optional(),
	drawSite: z.string().nullable().optional(),
	volumeMl: z.coerce.number().min(0).nullable().optional(),
	attempts: z.coerce.number().int().min(1).max(9).nullable().optional(),
	collectedAt: z.string().nullable().optional(),
	quality: z.enum(LabSampleQuality).nullable().optional(),
	collectionNotes: z.string().nullable().optional(),
});

export type CollectionDetailsFormInput = z.input<typeof collectionDetailsSchema>;
export type CollectionDetailsFormValues = z.output<typeof collectionDetailsSchema>;

/** ③ تسليم العيّنة لقسم المعالجة + عدد الملصقات المطبوعة */
export const handoverSchema = z.object({
	labelsPrinted: z.coerce.number().int().min(0).max(20).default(0),
});

export type HandoverFormInput = z.input<typeof handoverSchema>;
