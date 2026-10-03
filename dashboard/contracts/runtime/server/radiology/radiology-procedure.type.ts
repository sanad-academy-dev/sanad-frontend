import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
	ContrastRoute,
	LabFastingStatus,
	RadiologyImageKind,
	RadiologyImageQuality,
	RadiologyModality,
	SedationLevel,
} from "@/generated/prisma/enums";
import { vitalSignsSelectShape } from "@sanad/contracts/runtime/server/vital-signs/vital-signs.type";

// ── تنفيذ فحص الأشعة: فحص السلامة + التحضير + الالتقاط + الصور ─────────────

// فحص السلامة على مستوى الطلب — خاص بالطفل لا بالفحص،
// فلا يُعاد سؤاله لكل فحص داخل الطلب نفسه.
const safetyScreeningSelect = {
	id: true,
	orderId: true,
	fastingStatus: true,
	fastingHours: true,
	medications: true,
	pregnancyPossible: true,
	metalImplants: true,
	implantNotes: true,
	priorContrastReaction: true,
	allergies: true,
	asaClass: true,
	// القياسات تُقرأ من لقطة العلامات الحيوية المرتبطة لا من أعمدة مهجورة
	vitalsRecordId: true,
	vitalsRecord: { select: vitalSignsSelectShape },
} as const;

export const safetyScreeningSelectShape = safetyScreeningSelect;

export type RadiologySafetyScreeningResponse = Prisma.RadiologySafetyScreeningGetPayload<{
	select: typeof safetyScreeningSelect;
}>;

// تنفيذ الفحص لكل عنصر — الجهاز والوضعية والتباين ومعاملات التعريض
const examExecutionSelect = {
	id: true,
	itemId: true,
	machineId: true,
	machineName: true,
	roomName: true,
	positioning: true,
	sedationUsed: true,
	sedationAgent: true,
	readyAt: true,
	startedAt: true,
	finishedAt: true,
	viewsPerformed: true,
	exposuresCount: true,
	retakeCount: true,
	kvp: true,
	mas: true,
	doseDap: true,
	ctdiVol: true,
	dlp: true,
	contrastUsed: true,
	contrastAgent: true,
	contrastRoute: true,
	contrastVolumeMl: true,
	contrastLot: true,
	imageQuality: true,
	qcNotes: true,
	executionNotes: true,
	performedBy: { select: { id: true, name: true } },
} as const;

export const examExecutionSelectShape = examExecutionSelect;

export type RadiologyExamExecutionResponse = Prisma.RadiologyExamExecutionGetPayload<{
	select: typeof examExecutionSelect;
}>;

// تسلسل DICOM: دراسة ← سلاسل ← صور (بيانات العرض فقط — الملف يُبثّ من مساره)
const instanceSelect = {
	id: true,
	sopUid: true,
	instanceNumber: true,
	kind: true,
	fileName: true,
	sizeBytes: true,
	mimeType: true,
	transferSyntax: true,
	rows: true,
	columns: true,
	frames: true,
} as const;

const seriesSelect = {
	id: true,
	seriesUid: true,
	seriesNumber: true,
	modalityCode: true,
	description: true,
	bodyPart: true,
	instances: {
		select: instanceSelect,
		orderBy: { instanceNumber: "asc" },
	},
} as const;

const studySelect = {
	id: true,
	itemId: true,
	studyUid: true,
	description: true,
	studyDate: true,
	modality: true,
	createdAt: true,
	uploadedBy: { select: { id: true, name: true } },
	series: { select: seriesSelect, orderBy: { seriesNumber: "asc" } },
} as const;

export const radiologyInstanceSelectShape = instanceSelect;
export const radiologySeriesSelectShape = seriesSelect;
export const radiologyStudySelectShape = studySelect;

export type RadiologyInstanceResponse = Prisma.RadiologyInstanceGetPayload<{
	select: typeof instanceSelect;
}>;

export type RadiologySeriesResponse = Prisma.RadiologySeriesGetPayload<{
	select: typeof seriesSelect;
}>;

export type RadiologyStudyResponse = Prisma.RadiologyStudyGetPayload<{
	select: typeof studySelect;
}>;

// ── التسميات العربية (تُستخدم في الواجهة وملخص التسليم) ────────────────────

export const MODALITY_META: Record<RadiologyModality, { label: string; dicomCode: string }> = {
	[RadiologyModality.XRAY]: { label: "أشعة سينية", dicomCode: "DX" },
	[RadiologyModality.CT]: { label: "مقطعية محوسبة", dicomCode: "CT" },
	[RadiologyModality.MRI]: { label: "رنين مغناطيسي", dicomCode: "MR" },
	[RadiologyModality.ULTRASOUND]: { label: "موجات فوق صوتية", dicomCode: "US" },
	[RadiologyModality.FLUOROSCOPY]: { label: "تنظير إشعاعي", dicomCode: "RF" },
	[RadiologyModality.MAMMOGRAPHY]: { label: "تصوير الثدي", dicomCode: "MG" },
	[RadiologyModality.NUCLEAR]: { label: "طب نووي", dicomCode: "NM" },
	[RadiologyModality.PET]: { label: "مقطعية بوزيترونية", dicomCode: "PT" },
	[RadiologyModality.DENTAL]: { label: "أشعة أسنان", dicomCode: "IO" },
	[RadiologyModality.OTHER]: { label: "أخرى", dicomCode: "OT" },
};

export const SEDATION_LABELS: Record<SedationLevel, string> = {
	[SedationLevel.NONE]: "بدون تهدئة",
	[SedationLevel.ANXIOLYSIS]: "مهدئ خفيف",
	[SedationLevel.SEDATION]: "تهدئة",
	[SedationLevel.GENERAL_ANESTHESIA]: "تخدير عام",
};

export const CONTRAST_ROUTE_LABELS: Record<ContrastRoute, string> = {
	[ContrastRoute.IV]: "وريدي",
	[ContrastRoute.ORAL]: "فموي",
	[ContrastRoute.RECTAL]: "شرجي",
	[ContrastRoute.INTRA_ARTICULAR]: "داخل المفصل",
	[ContrastRoute.OTHER]: "آخر",
};

// الأيقونة تُختار في الواجهة (SVG من Tabler) — هنا التسمية واللون فقط،
// فملف الأنواع يبقى خاليًا من JSX.
export const IMAGE_QUALITY_META: Record<
	RadiologyImageQuality,
	{ label: string; className: string }
> = {
	[RadiologyImageQuality.DIAGNOSTIC]: {
		label: "صالحة للتشخيص",
		className: "border-emerald-200 bg-emerald-50 text-emerald-700",
	},
	[RadiologyImageQuality.LIMITED]: {
		label: "محدودة",
		className: "border-amber-200 bg-amber-50 text-amber-700",
	},
	[RadiologyImageQuality.NON_DIAGNOSTIC]: {
		label: "غير صالحة — إعادة",
		className: "border-red-200 bg-red-50 text-red-700",
	},
};

/**
 * الإسقاطات (Views) المقترحة — قابلة للبحث ولا تمنع إدخال إسقاط مخصّص.
 * مقسّمة حسب منطقة التصوير لتسهيل الاختيار.
 */
export const VIEW_GROUPS: { label: string; options: string[] }[] = [
	{
		label: "إسقاطات عامة",
		options: [
			"جانبي أيمن (Right lateral)",
			"جانبي أيسر (Left lateral)",
			"بطني ظهري (VD)",
			"ظهري بطني (DV)",
		],
	},
	{
		label: "الأطراف والمفاصل",
		options: [
			"أمامي خلفي (Craniocaudal)",
			"إنسي وحشي (Mediolateral)",
			"مائل (Oblique)",
			"محوري (Skyline)",
			"إسقاط مُجهَد (Stress view)",
		],
	},
	{
		label: "الرأس والأسنان",
		options: ["جانبي جمجمة", "ظهري بطني جمجمة", "مائل جمجمة", "داخل الفم (Intraoral)"],
	},
];

/** مناطق التصوير المقترحة — قابلة للبحث مع إدخال حرّ */
export const BODY_PART_OPTIONS = [
	"صدر",
	"بطن",
	"حوض",
	"عمود فقري — رقبي",
	"عمود فقري — صدري قطني",
	"جمجمة / رأس",
	"طرف أمامي",
	"طرف خلفي",
	"مفصل الورك",
	"مفصل الركبة",
	"مفصل الكوع",
	"أسنان / فك",
	"قلب",
	"جهاز بولي",
	"رحم / حمل",
	"كامل الجسم",
] as const;

// ── المخططات ───────────────────────────────────────────────────────────────

/** ① فحص السلامة — كل الحقول اختيارية ليُحفظ تدريجيًا */
export const radiologySafetySchema = z
	.object({
		fastingStatus: z.enum(LabFastingStatus).nullable().optional(),
		fastingHours: z.coerce.number().int().min(0).max(240).nullable().optional(),
		medications: z.array(z.string()).default([]),
		pregnancyPossible: z.boolean().nullable().optional(),
		metalImplants: z.boolean().nullable().optional(),
		implantNotes: z.string().nullable().optional(),
		priorContrastReaction: z.boolean().nullable().optional(),
		allergies: z.string().nullable().optional(),
		asaClass: z.coerce.number().int().min(1).max(5).nullable().optional(),
		// القياسات انتقلت إلى سجل العلامات الحيوية — تُربط بالمعرّف لا تُكتب هنا
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

export type RadiologySafetyFormInput = z.input<typeof radiologySafetySchema>;
export type RadiologySafetyFormValues = z.output<typeof radiologySafetySchema>;

/** ② تجهيز الطفل — الوضعية والتهدئة */
export const radiologyPrepSchema = z.object({
	positioning: z.string().nullable().optional(),
	sedationUsed: z.enum(SedationLevel).nullable().optional(),
	sedationAgent: z.string().nullable().optional(),
});

export type RadiologyPrepFormInput = z.input<typeof radiologyPrepSchema>;
export type RadiologyPrepFormValues = z.output<typeof radiologyPrepSchema>;

/** ⑤ الالتقاط — الإسقاطات المنفَّذة ومعاملات التعريض والجرعة والتباين */
export const radiologyAcquisitionSchema = z.object({
	performedById: z.string().nullable().optional(),
	viewsPerformed: z.array(z.string()).default([]),
	exposuresCount: z.coerce.number().int().min(0).max(99).nullable().optional(),
	retakeCount: z.coerce.number().int().min(0).max(99).nullable().optional(),
	kvp: z.coerce.number().min(0).nullable().optional(),
	mas: z.coerce.number().min(0).nullable().optional(),
	doseDap: z.coerce.number().min(0).nullable().optional(),
	ctdiVol: z.coerce.number().min(0).nullable().optional(),
	dlp: z.coerce.number().min(0).nullable().optional(),
	contrastUsed: z.boolean().nullable().optional(),
	contrastAgent: z.string().nullable().optional(),
	contrastRoute: z.enum(ContrastRoute).nullable().optional(),
	contrastVolumeMl: z.coerce.number().min(0).nullable().optional(),
	contrastLot: z.string().nullable().optional(),
	executionNotes: z.string().nullable().optional(),
});

export type RadiologyAcquisitionFormInput = z.input<typeof radiologyAcquisitionSchema>;
export type RadiologyAcquisitionFormValues = z.output<typeof radiologyAcquisitionSchema>;

/** ⑦ فحص جودة الصور */
export const radiologyImageQcSchema = z.object({
	imageQuality: z.enum(RadiologyImageQuality, { error: "قيّم جودة الصور" }),
	qcNotes: z.string().nullable().optional(),
});

export type RadiologyImageQcFormInput = z.input<typeof radiologyImageQcSchema>;
export type RadiologyImageQcFormValues = z.output<typeof radiologyImageQcSchema>;

/** ⑥ تسجيل دراسة مرفوعة — البيانات الوصفية بعد رفع الملفات إلى التخزين */
export const registerInstanceSchema = z.object({
	sopUid: z.string().min(1),
	instanceNumber: z.coerce.number().int().nullable().optional(),
	kind: z.enum(RadiologyImageKind).default(RadiologyImageKind.DICOM),
	fileKey: z.string().min(1),
	fileName: z.string().nullable().optional(),
	sizeBytes: z.coerce.number().int().min(0).nullable().optional(),
	mimeType: z.string().nullable().optional(),
	transferSyntax: z.string().nullable().optional(),
	rows: z.coerce.number().int().nullable().optional(),
	columns: z.coerce.number().int().nullable().optional(),
	frames: z.coerce.number().int().min(1).nullable().optional(),
});

export const registerSeriesSchema = z.object({
	seriesUid: z.string().min(1),
	seriesNumber: z.coerce.number().int().nullable().optional(),
	modalityCode: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	bodyPart: z.string().nullable().optional(),
	instances: z.array(registerInstanceSchema).min(1),
});

export const registerStudySchema = z.object({
	studyUid: z.string().min(1),
	description: z.string().nullable().optional(),
	studyDate: z.string().nullable().optional(),
	modality: z.enum(RadiologyModality).nullable().optional(),
	series: z.array(registerSeriesSchema).min(1),
});

export type RegisterStudyInput = z.infer<typeof registerStudySchema>;
