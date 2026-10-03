import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	AdverseReactionSeverity,
	InjectionSite,
	VaccinationDoseKind,
	VaccineKind,
	VaccineRoute,
} from "@/generated/prisma/enums";
import type {
	DueProjection,
	VaccinationDueStatus,
} from "@/server/vaccinations/vaccination-due.service";

export type {
	AdverseReactionSeverity,
	InjectionSite,
	VaccinationDoseKind,
	VaccineKind,
	VaccineRoute,
} from "@/generated/prisma/enums";
export type {
	DueProjection,
	VaccinationDueStatus,
} from "@/server/vaccinations/vaccination-due.service";

// ─── أشكال الاستجابة ────────────────────────────────────────────────────────

const antigenSelect = {
	code: true,
	nameAr: true,
	nameEn: true,
	noteAr: true,
	order: true,
	immunityOnsetDays: true,
} satisfies Prisma.AntigenSelect;

export type AntigenResponse = Prisma.AntigenGetPayload<{ select: typeof antigenSelect }>;
export const antigenSelectShape = antigenSelect;

const vaccineSelect = {
	id: true,
	code: true,
	name: true,
	nameEn: true,
	kind: true,
	manufacturerName: true,
	primarySeriesDoses: true,
	primarySeriesIntervalDays: true,
	boosterIntervalDays: true,
	immunityOnsetDays: true,
	defaultRoute: true,
	defaultSite: true,
	defaultDoseVolumeMl: true,
	notes: true,
	active: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	catalogProduct: {
		select: {
			id: true,
			tradeName: true,
			registerNumber: true,
			manufacturerName: true,
			manufacturerCountry: true,
			authorizationStatus: true,
		},
	},
	inventoryItem: {
		select: { id: true, name: true, code: true, stock: true, tracksBatches: true },
	},
	antigens: {
		select: { antigenCode: true, antigen: { select: { nameAr: true, nameEn: true } } },
	},
	species: { select: { species: true } },
} satisfies Prisma.VaccineSelect;

export type VaccineResponse = Prisma.VaccineGetPayload<{ select: typeof vaccineSelect }>;
export const vaccineSelectShape = vaccineSelect;

const protocolDoseSelect = {
	id: true,
	order: true,
	antigenCode: true,
	label: true,
	kind: true,
	ageWeeksMin: true,
	ageWeeksMax: true,
	intervalDaysFromPrev: true,
	boosterIntervalDays: true,
	notes: true,
	antigen: { select: { nameAr: true, nameEn: true } },
} satisfies Prisma.VaccinationProtocolDoseSelect;

export type ProtocolDoseResponse = Prisma.VaccinationProtocolDoseGetPayload<{
	select: typeof protocolDoseSelect;
}>;

const protocolSelect = {
	id: true,
	code: true,
	clinicId: true,
	name: true,
	nameEn: true,
	species: true,
	animalTypeId: true,
	animalStrainId: true,
	isCore: true,
	isDefault: true,
	active: true,
	notes: true,
	createdAt: true,
	updatedAt: true,
	animalType: { select: { id: true, arName: true, enName: true } },
	animalStrain: { select: { id: true, arName: true, enName: true } },
	doses: { select: protocolDoseSelect, orderBy: { order: "asc" } },
} satisfies Prisma.VaccinationProtocolSelect;

export type VaccinationProtocolResponse = Prisma.VaccinationProtocolGetPayload<{
	select: typeof protocolSelect;
}>;
export const protocolSelectShape = protocolSelect;

const recordSelect = {
	id: true,
	code: true,
	patientId: true,
	administeredAt: true,
	doseNumber: true,
	doseKind: true,
	route: true,
	site: true,
	doseVolumeMl: true,
	batchId: true,
	batchNo: true,
	batchExpiryDate: true,
	vaccineNameSnapshot: true,
	manufacturerSnapshot: true,
	adverseReaction: true,
	adverseReactionNotes: true,
	notes: true,
	immunityOnsetDaysSnapshot: true,
	protectiveFromAt: true,
	boosterIntervalDaysSnapshot: true,
	protectiveUntilAt: true,
	nextDueAt: true,
	isVoided: true,
	voidedAt: true,
	voidReason: true,
	createdAt: true,
	patient: {
		select: {
			id: true,
			code: true,
			name: true,
			birthDate: true,
			animalType: { select: { id: true, arName: true, species: true } },
			owner: { select: { id: true, name: true, phone: true } },
		},
	},
	vaccine: {
		select: {
			id: true,
			name: true,
			kind: true,
			antigens: { select: { antigenCode: true } },
		},
	},
	administeredBy: { select: { id: true, name: true, prefix: true, licenseNumber: true } },
	branch: { select: { id: true, name: true } },
	appointment: { select: { id: true, startsAt: true } },
	protocolDose: { select: { id: true, label: true, antigenCode: true } },
} satisfies Prisma.VaccinationRecordSelect;

export type VaccinationRecordResponse = Prisma.VaccinationRecordGetPayload<{
	select: typeof recordSelect;
}>;
export const recordSelectShape = recordSelect;

// ─── أشكال مشتقّة (لا يقابلها جدول) ─────────────────────────────────────────

/** حالة تطعيم طفل واحد: البروتوكول المُطبَّق، الإسقاطات، والخلاصة. */
export type PatientVaccinationStatus = {
	patientId: string;
	birthDate: Date | null;
	protocol: Pick<VaccinationProtocolResponse, "id" | "name" | "species" | "isCore"> | null;
	projections: DueProjection[];
	/** أخطر حالة عبر المُستضِدّات — الشارة المعروضة */
	status: VaccinationDueStatus | null;
	nextDueAt: Date | null;
	records: VaccinationRecordResponse[];
};

/**
 * طفل ينطبق عليه بروتوكول لكن لا يمكن جدولته: تاريخ ميلاده ناقص.
 * ليس حالة خطر بل نقص بيانات — يُعرض منفصلًا عن الطابور التشغيلي كي لا يُقرأ إنذارًا.
 */
export type UnschedulablePatientRow = {
	patientId: string;
	patientCode: string;
	patientName: string;
	animalTypeName: string;
	ownerName: string | null;
};

/** صف في طابور «الجرعات المستحقة» — طفل واحد وأقرب ما يستحقه. */
export type VaccinationDueRow = {
	patientId: string;
	patientCode: string;
	patientName: string;
	animalTypeName: string;
	ownerId: string | null;
	ownerName: string | null;
	ownerPhone: string | null;
	status: VaccinationDueStatus;
	dueAt: Date | null;
	daysUntilDue: number | null;
	/** المُستضِدّات المستحقة الآن، بالاسم العربي، للعرض في الصف */
	dueAntigens: string[];
	/**
	 * الرموز المقابلة — تُمرَّر إلى نافذة الإعطاء لترشيح اللقاحات التي تغطّي المستحق.
	 * الأسماء العربية للعرض والرموز للمطابقة: خلطهما يجعل الواجهة تطابق نصًّا مترجمًا.
	 */
	dueAntigenCodes: string[];
	lastGivenAt: Date | null;
};

// ─── مخطّطات النماذج (Zod — مصدر أنواع النماذج) ─────────────────────────────

export const vaccineSchema = z.object({
	name: z.string({ error: "اسم اللقاح مطلوب" }).min(1, "اسم اللقاح مطلوب"),
	nameEn: z.string().optional(),
	kind: z.enum(VaccineKind, { error: "نوع اللقاح مطلوب" }),
	manufacturerName: z.string().optional(),
	catalogProductId: z.string().optional(),
	inventoryItemId: z.string().optional(),
	antigenCodes: z
		.array(z.string())
		.min(1, "يجب اختيار مُستضِدّ واحد على الأقل — هو أساس حساب الجرعة القادمة"),
	species: z.array(z.string()).min(1, "يجب اختيار نوع مستهدف واحد على الأقل"),
	primarySeriesDoses: z.coerce
		.number({ error: "عدد الجرعات يجب أن يكون رقمًا" })
		.int("عدد الجرعات يجب أن يكون عددًا صحيحًا")
		.min(1, "عدد الجرعات يجب أن يكون 1 على الأقل"),
	primarySeriesIntervalDays: z.coerce.number().int().min(0).optional(),
	boosterIntervalDays: z.coerce.number().int().min(0).optional(),
	// إلزامي — الرقم من نشرة المستحضر لا تقديرًا. عليه تقوم نافذة الحماية التي
	// تقرأها بوابة قبول التجميل، ولذلك لا يُقبل غيابه ولا صفرٌ ضمنيّ.
	immunityOnsetDays: z.coerce
		.number({ error: "فترة اكتساب المناعة مطلوبة" })
		.int("فترة اكتساب المناعة يجب أن تكون عددًا صحيحًا من الأيام")
		.min(0, "فترة اكتساب المناعة يجب أن تكون 0 أيام على الأقل")
		.max(365, "فترة اكتساب المناعة يجب ألّا تتجاوز 365 يومًا"),
	defaultRoute: z.enum(VaccineRoute, { error: "طريق الإعطاء مطلوب" }),
	defaultSite: z.enum(InjectionSite).optional(),
	defaultDoseVolumeMl: z.coerce.number().min(0).optional(),
	notes: z.string().optional(),
	active: z.boolean().optional().default(true),
});

export type VaccineFormInput = z.infer<typeof vaccineSchema>;

export const administerVaccinationSchema = z.object({
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	vaccineId: z.string({ error: "اللقاح مطلوب" }).min(1, "اللقاح مطلوب"),
	appointmentId: z.string().optional(),
	branchId: z.string().optional(),
	administeredById: z.string().optional(),
	administeredAt: z.coerce.date({ error: "تاريخ الإعطاء مطلوب" }),
	doseNumber: z.coerce.number().int().min(1).optional().default(1),
	doseKind: z.enum(VaccinationDoseKind).optional().default("PRIMARY"),
	route: z.enum(VaccineRoute, { error: "طريق الإعطاء مطلوب" }),
	site: z.enum(InjectionSite).optional(),
	doseVolumeMl: z.coerce.number().min(0).optional(),
	// الدفعة اختيارية في المخطّط فقط: طبقة الدورة تفرضها متى كان الصنف متتبَّعًا
	// بالدُفعات، لأن الرسالة الصحيحة تحتاج معرفة الصنف لا شكل النموذج وحده.
	batchId: z.string().optional(),
	allowExpiredBatch: z.boolean().optional().default(false),
	expiredBatchReason: z.string().optional(),
	adverseReaction: z.enum(AdverseReactionSeverity).optional().default("NONE"),
	adverseReactionNotes: z.string().optional(),
	protocolDoseId: z.string().optional(),
	carePlanEnrollmentVisitId: z.string().optional(),
	notes: z.string().optional(),
});

export type AdministerVaccinationFormInput = z.infer<typeof administerVaccinationSchema>;

export const voidVaccinationSchema = z.object({
	voidReason: z
		.string({ error: "سبب الإلغاء مطلوب" })
		.min(3, "سبب الإلغاء مطلوب — السجل الطبي يُبطَل بأثر موثّق ولا يُحذف"),
	restoreStock: z.boolean().optional().default(true),
});

export type VoidVaccinationFormInput = z.infer<typeof voidVaccinationSchema>;

export const protocolDoseSchema = z.object({
	antigenCode: z.string({ error: "المُستضِدّ مطلوب" }).min(1, "المُستضِدّ مطلوب"),
	label: z.string({ error: "اسم الجرعة مطلوب" }).min(1, "اسم الجرعة مطلوب"),
	kind: z.enum(VaccinationDoseKind).optional().default("PRIMARY"),
	ageWeeksMin: z.coerce.number().int().min(0).optional(),
	ageWeeksMax: z.coerce.number().int().min(0).optional(),
	intervalDaysFromPrev: z.coerce.number().int().min(0).optional(),
	boosterIntervalDays: z.coerce.number().int().min(0).optional(),
	notes: z.string().optional(),
});

export const vaccinationProtocolSchema = z.object({
	name: z.string({ error: "اسم البروتوكول مطلوب" }).min(1, "اسم البروتوكول مطلوب"),
	nameEn: z.string().optional(),
	species: z.string({ error: "النوع مطلوب" }).min(1, "النوع مطلوب"),
	animalTypeId: z.string().optional(),
	animalStrainId: z.string().optional(),
	isCore: z.boolean().optional().default(true),
	active: z.boolean().optional().default(true),
	notes: z.string().optional(),
	doses: z.array(protocolDoseSchema).min(1, "يجب إضافة جرعة واحدة على الأقل"),
});

export type VaccinationProtocolFormInput = z.infer<typeof vaccinationProtocolSchema>;

// ─── تسميات عربية للعرض ─────────────────────────────────────────────────────

export const VACCINE_KIND_LABELS: Record<VaccineKind, string> = {
	MODIFIED_LIVE: "حيّ مُضعَّف",
	KILLED: "مقتول",
	RECOMBINANT: "مؤتلف",
	TOXOID: "ذيفاني",
	SUBUNIT: "وحيد الوحدة",
	OTHER: "غير محدَّد",
};

export const VACCINE_ROUTE_LABELS: Record<VaccineRoute, string> = {
	SUBCUTANEOUS: "تحت الجلد",
	INTRAMUSCULAR: "عضلي",
	INTRANASAL: "أنفي",
	ORAL: "فموي",
	INTRADERMAL: "داخل الأدمة",
	TOPICAL: "موضعي",
	OTHER: "أخرى",
};

export const INJECTION_SITE_LABELS: Record<InjectionSite, string> = {
	LEFT_SHOULDER: "الكتف الأيسر",
	RIGHT_SHOULDER: "الكتف الأيمن",
	LEFT_HIND_LIMB: "الطرف الخلفي الأيسر",
	RIGHT_HIND_LIMB: "الطرف الخلفي الأيمن",
	INTERSCAPULAR: "بين لوحي الكتف",
	LEFT_FLANK: "الخاصرة اليسرى",
	RIGHT_FLANK: "الخاصرة اليمنى",
	NASAL: "أنفي",
	ORAL: "فموي",
	OTHER: "أخرى",
};

export const DOSE_KIND_LABELS: Record<VaccinationDoseKind, string> = {
	PRIMARY: "جرعة أولية",
	BOOSTER: "جرعة منشّطة",
	ANNUAL: "جرعة سنوية",
	CATCH_UP: "جرعة تدارُك",
};

export const ADVERSE_REACTION_LABELS: Record<AdverseReactionSeverity, string> = {
	NONE: "لا تفاعل",
	MILD: "خفيف",
	MODERATE: "متوسط",
	SEVERE: "شديد",
	ANAPHYLACTIC: "تأقي",
};

export const DUE_STATUS_LABELS: Record<VaccinationDueStatus, string> = {
	UP_TO_DATE: "محدَّث",
	DUE_SOON: "يستحق قريبًا",
	DUE: "يستحق اليوم",
	OVERDUE: "متأخّر",
	NOT_STARTED: "لم يبدأ",
	UNKNOWN_AGE: "تاريخ الميلاد ناقص",
};
