import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import {
	CoatCondition,
	EarCondition,
	GroomingActivityType,
	GroomingBehaviorScore,
	GroomingCancelKind,
	type GroomingDryingMethod,
	GroomingFindingCategory,
	GroomingFindingSeverity,
	GroomingIncidentKind,
	GroomingIncidentSeverity,
	GroomingMoodScore,
	GroomingPhotoKind,
	type GroomingStage,
	GroomingStatus,
	MattingGrade,
	NailCondition,
	ParasiteFinding,
	ReportCardChannel,
} from "@/generated/prisma/enums";

// أنواع جلسة التجميل المشتركة بين الخادم والواجهة.
// الخطة: docs/grooming-module-plan.md §4.3–§4.6.

// ── أشكال الاستجابة ────────────────────────────────────────────────────────

const itemSelect = {
	id: true,
	definitionId: true,
	serviceId: true,
	nameSnapshot: true,
	laneSnapshot: true,
	priceSnapshot: true,
	durationSnapshot: true,
	dryingSnapshot: true,
	priceLevelSnapshot: true,
	matchedRuleId: true,
	quantity: true,
	performed: true,
	notes: true,
} as const;

const adjustmentSelect = {
	id: true,
	modifierCode: true,
	labelSnapshot: true,
	amount: true,
	source: true,
	reason: true,
	approvedByOwnerAt: true,
} as const;

const intakeSelect = {
	id: true,
	weightKg: true,
	temperatureC: true,
	mattingGrade: true,
	coatCondition: true,
	parasiteFinding: true,
	skinFindings: true,
	earCondition: true,
	nailCondition: true,
	dentalNote: true,
	behaviorScore: true,
	muzzleUsed: true,
	rabiesValidUntil: true,
	vaccinationOverrideReason: true,
	shaveDownRecommended: true,
	shaveDownApprovedAt: true,
	heatDryProhibitedSnapshot: true,
	heatDryReasonsSnapshot: true,
	parasiteTreatedAt: true,
	parasiteOwnerNotifiedAt: true,
	isolationAcknowledgedAt: true,
	belongings: true,
	notes: true,
	performedAt: true,
} as const;

const photoSelect = {
	id: true,
	kind: true,
	url: true,
	caption: true,
	bodyZone: true,
	createdAt: true,
} as const;

const productSelect = {
	id: true,
	inventoryItemId: true,
	nameSnapshot: true,
	priceSnapshot: true,
	quantity: true,
	billable: true,
	dilution: true,
	contactTimeMin: true,
	bodyZones: true,
	issuedAt: true,
} as const;

const incidentSelect = {
	id: true,
	kind: true,
	severity: true,
	description: true,
	actionTaken: true,
	ownerNotifiedAt: true,
	vetAssessedByStaffId: true,
	vetAssessmentNote: true,
	followUpAppointmentId: true,
	resolvedAt: true,
	createdAt: true,
} as const;

const findingSelect = {
	id: true,
	category: true,
	bodyZone: true,
	severity: true,
	note: true,
	photoId: true,
	acknowledgedAt: true,
	referralAppointmentId: true,
	labOrderId: true,
	dismissedReason: true,
	createdAt: true,
} as const;

const reportCardSelect = {
	id: true,
	summary: true,
	moodScore: true,
	recommendedIntervalWeeks: true,
	nextRecommendedAt: true,
	publicToken: true,
	sentAt: true,
	channel: true,
	rebookedSessionId: true,
} as const;

/** بطاقة اللوحة — أخفّ ما يكفي لرسم عمود كامل بلا جلب التفاصيل */
export const sessionCardSelect = {
	id: true,
	code: true,
	status: true,
	stage: true,
	lane: true,
	scheduledAt: true,
	promisedReadyAt: true,
	readyAt: true,
	estimatedDurationMin: true,
	quoteTotal: true,
	sedationPlanned: true,
	dryingMethod: true,
	patient: {
		select: {
			id: true,
			name: true,
			code: true,
			animalType: { select: { arName: true } },
			animalStrain: { select: { arName: true, isBrachycephalic: true } },
		},
	},
	owner: { select: { id: true, name: true, phone: true } },
	groomer: { select: { id: true, user: { select: { name: true } } } },
	station: { select: { id: true, name: true } },
	intake: {
		select: {
			mattingGrade: true,
			parasiteFinding: true,
			behaviorScore: true,
			heatDryProhibitedSnapshot: true,
		},
	},
	_count: { select: { incidents: true, findings: true } },
} as const;

export type GroomingSessionCard = Prisma.GroomingSessionGetPayload<{
	select: typeof sessionCardSelect;
}>;

/** التفاصيل الكاملة — ما تعرضه ورقة الجلسة */
export const sessionDetailSelect = {
	...sessionCardSelect,
	// الورقة تحتاج الفحص القبلي كاملًا؛ بطاقة اللوحة تكتفي بأربعة حقول منه.
	// بلا هذا التجاوز يرث التفصيل شكل البطاقة الضيّق وتختفي بقيّة الحقول.
	intake: { select: intakeSelect },
	branchId: true,
	appointmentId: true,
	assistantId: true,
	vetOrderStaffId: true,
	vetOrderNote: true,
	dropOffAt: true,
	checkedInAt: true,
	startedAt: true,
	dryingStartedAt: true,
	pickedUpAt: true,
	completedAt: true,
	quoteSubtotal: true,
	quoteAdjustments: true,
	bookedQuoteTotal: true,
	ownerApprovedQuoteAt: true,
	cancelKind: true,
	cancelReason: true,
	createdAt: true,
	items: { select: itemSelect },
	adjustments: { select: adjustmentSelect },
	photos: { select: photoSelect },
	products: { select: productSelect },
	incidents: { select: incidentSelect },
	findings: { select: findingSelect },
	reportCard: { select: reportCardSelect },
	// الفاتورة كاملة: تبويب الفاتورة ونافذة الدفع يقرآن الخصم والضريبة والمسدَّد،
	// ولقطة ضيّقة هنا تعني أرقامًا ناقصة في مستند يُطبع ويُسلَّم للوليّ أمر
	invoice: {
		select: {
			id: true,
			code: true,
			subtotal: true,
			vatRate: true,
			vatAmount: true,
			discount: true,
			total: true,
			amountPaid: true,
			currencyCode: true,
			status: true,
			paymentMethod: true,
			paidAt: true,
		},
	},
} as const;

export type GroomingSessionDetail = Prisma.GroomingSessionGetPayload<{
	select: typeof sessionDetailSelect;
}>;

export type GroomingIntakeResponse = Prisma.GroomingIntakeGetPayload<{
	select: typeof intakeSelect;
}>;

export const groomingSelects = {
	item: itemSelect,
	adjustment: adjustmentSelect,
	intake: intakeSelect,
	photo: photoSelect,
	product: productSelect,
	incident: incidentSelect,
	finding: findingSelect,
	reportCard: reportCardSelect,
} as const;

const profileSelect = {
	id: true,
	patientId: true,
	preferredGroomerId: true,
	sizeBand: true,
	coatType: true,
	clipperPlan: true,
	shampooItemId: true,
	sensitivities: true,
	behaviorScore: true,
	muzzleRequired: true,
	requiresTwoHandlers: true,
	handlingNotes: true,
	heatDryProhibited: true,
	heatDryProhibitedReason: true,
	groomIntervalWeeks: true,
	lastGroomedAt: true,
	nextGroomDueAt: true,
	customPrice: true,
	customDurationMin: true,
	notes: true,
} as const;

export type GroomingProfileResponse = Prisma.PatientGroomingProfileGetPayload<{
	select: typeof profileSelect;
}>;

export const profileSelectShape = profileSelect;

/** صفّ قائمة الاستحقاق — «من تأخّر عن موعد تجميله؟» */
export type GroomingDueRow = {
	patientId: string;
	patientName: string;
	patientCode: string;
	// [RC0] المُعرّف لا الاسم وحده: قائمة الاستدعاء تُجمَّع **بوليّ الأمر** لا بالطفل،
	// فوليّ أمرٌ له ثلاثة كلاب مستحقّة يجب أن يُكلَّم مرّة لا ثلاثًا.
	ownerId: string | null;
	ownerName: string | null;
	ownerPhone: string | null;
	lastGroomedAt: Date | null;
	nextGroomDueAt: Date | null;
	daysOverdue: number;
	preferredGroomerName: string | null;
};

// ── مدخلات الـ DAO ─────────────────────────────────────────────────────────

export type CreateGroomingSessionInput = Pick<
	Prisma.GroomingSessionUncheckedCreateInput,
	"clinicId" | "branchId" | "patientId" | "ownerId" | "groomerId" | "scheduledAt"
> &
	Partial<
		Pick<
			Prisma.GroomingSessionUncheckedCreateInput,
			| "appointmentId"
			| "assistantId"
			| "stationId"
			| "lane"
			| "sedationPlanned"
			| "vetOrderStaffId"
			| "vetOrderNote"
			| "dropOffAt"
		>
	> & {
		/** تعريفات دورات التجميل المطلوبة — تُسعَّر على الخادم، والعميل لا يرسل سعرًا */
		definitionIds: string[];
		userId?: string;
	};

// ── مخططات النماذج (Zod — تُستورد في الواجهة) ──────────────────────────────

export const createGroomingSessionSchema = z.object({
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	groomerId: z.string({ error: "المُجمِّل مطلوب" }).min(1, "المُجمِّل مطلوب"),
	assistantId: z.string().nullable().optional(),
	stationId: z.string().nullable().optional(),
	scheduledAt: z.string({ error: "موعد الجلسة مطلوب" }).min(1, "موعد الجلسة مطلوب"),
	dropOffAt: z.string().nullable().optional(),
	definitionIds: z
		.array(z.string().min(1), { error: "اختر دورة واحدة على الأقل" })
		.min(1, "اختر دورة واحدة على الأقل"),
	sedationPlanned: z.boolean().default(false),
	vetOrderStaffId: z.string().nullable().optional(),
	vetOrderNote: z.string().nullable().optional(),
});

export type CreateGroomingSessionFormInput = z.input<typeof createGroomingSessionSchema>;

export const groomingIntakeSchema = z.object({
	weightKg: z.coerce.number().min(0).nullable().optional(),
	temperatureC: z.coerce.number().min(0).nullable().optional(),
	mattingGrade: z.enum(MattingGrade, { error: "درجة التعقّد مطلوبة" }),
	coatCondition: z.enum(CoatCondition).default(CoatCondition.HEALTHY),
	parasiteFinding: z.enum(ParasiteFinding).default(ParasiteFinding.NONE),
	skinFindings: z.array(z.string()).default([]),
	earCondition: z.enum(EarCondition).default(EarCondition.NORMAL),
	nailCondition: z.enum(NailCondition).default(NailCondition.NORMAL),
	dentalNote: z.string().nullable().optional(),
	behaviorScore: z.enum(GroomingBehaviorScore, { error: "تقييم السلوك مطلوب" }),
	muzzleUsed: z.boolean().default(false),
	belongings: z.array(z.string()).default([]),
	notes: z.string().nullable().optional(),
});

export type GroomingIntakeFormInput = z.input<typeof groomingIntakeSchema>;

export const groomingFindingSchema = z.object({
	category: z.enum(GroomingFindingCategory, { error: "نوع الملاحظة مطلوب" }),
	severity: z.enum(GroomingFindingSeverity).default(GroomingFindingSeverity.INFO),
	bodyZone: z.string().nullable().optional(),
	note: z.string({ error: "نص الملاحظة مطلوب" }).min(1, "نص الملاحظة مطلوب"),
	photoId: z.string().nullable().optional(),
});

export type GroomingFindingFormInput = z.input<typeof groomingFindingSchema>;

export const groomingIncidentSchema = z.object({
	kind: z.enum(GroomingIncidentKind, { error: "نوع الحادثة مطلوب" }),
	severity: z.enum(GroomingIncidentSeverity).default(GroomingIncidentSeverity.MINOR),
	description: z.string({ error: "وصف الحادثة مطلوب" }).min(1, "وصف الحادثة مطلوب"),
	actionTaken: z.string().nullable().optional(),
	photoId: z.string().nullable().optional(),
});

export type GroomingIncidentFormInput = z.input<typeof groomingIncidentSchema>;

export const groomingReportCardSchema = z.object({
	summary: z.string({ error: "ملخّص الجلسة مطلوب" }).min(1, "ملخّص الجلسة مطلوب"),
	moodScore: z.enum(GroomingMoodScore).default(GroomingMoodScore.CALM),
	recommendedIntervalWeeks: z.coerce.number().int().min(1).max(52).nullable().optional(),
	channel: z.enum(ReportCardChannel).nullable().optional(),
});

export type GroomingReportCardFormInput = z.input<typeof groomingReportCardSchema>;

export const groomingProfileSchema = z.object({
	preferredGroomerId: z.string().nullable().optional(),
	sizeBand: z.string().nullable().optional(),
	coatType: z.string().nullable().optional(),
	shampooItemId: z.string().nullable().optional(),
	sensitivities: z.array(z.string()).default([]),
	behaviorScore: z.enum(GroomingBehaviorScore).default(GroomingBehaviorScore.GREEN),
	muzzleRequired: z.boolean().default(false),
	requiresTwoHandlers: z.boolean().default(false),
	handlingNotes: z.string().nullable().optional(),
	heatDryProhibited: z.boolean().default(false),
	heatDryProhibitedReason: z.string().nullable().optional(),
	groomIntervalWeeks: z.coerce.number().int().min(1).max(104).nullable().optional(),
	customPrice: z.coerce.number().min(0).nullable().optional(),
	customDurationMin: z.coerce.number().int().min(5).nullable().optional(),
	notes: z.string().nullable().optional(),
});

export type GroomingProfileFormInput = z.input<typeof groomingProfileSchema>;

// ── تسميات عربية إضافية (آلة الحالات تملك تسمياتها) ────────────────────────

export const GROOMING_PHOTO_KIND_LABELS: Record<GroomingPhotoKind, string> = {
	[GroomingPhotoKind.BEFORE]: "قبل",
	[GroomingPhotoKind.AFTER]: "بعد",
	[GroomingPhotoKind.CONDITION]: "توثيق حالة",
	[GroomingPhotoKind.INCIDENT]: "توثيق حادثة",
};

export const GROOMING_INCIDENT_KIND_LABELS: Record<GroomingIncidentKind, string> = {
	[GroomingIncidentKind.CLIPPER_BURN]: "حرق ماكينة",
	[GroomingIncidentKind.NICK_CUT]: "جرح سطحي",
	[GroomingIncidentKind.QUICKED_NAIL]: "نزف ظفر",
	[GroomingIncidentKind.HEAT_STRESS]: "إجهاد حراري",
	[GroomingIncidentKind.MEDICAL_EVENT]: "حدث طبي",
	[GroomingIncidentKind.ESCAPE]: "إفلات الطفل",
	[GroomingIncidentKind.BITE_TO_STAFF]: "عضّ أحد الطاقم",
	[GroomingIncidentKind.EQUIPMENT_FAILURE]: "عطل معدّة",
	[GroomingIncidentKind.OTHER]: "أخرى",
};

export const GROOMING_INCIDENT_SEVERITY_LABELS: Record<GroomingIncidentSeverity, string> = {
	[GroomingIncidentSeverity.MINOR]: "طفيفة",
	[GroomingIncidentSeverity.MODERATE]: "متوسطة",
	[GroomingIncidentSeverity.MAJOR]: "بالغة",
};

export const GROOMING_FINDING_CATEGORY_LABELS: Record<GroomingFindingCategory, string> = {
	[GroomingFindingCategory.SKIN]: "الجلد",
	[GroomingFindingCategory.EARS]: "الأذن",
	[GroomingFindingCategory.EYES]: "العين",
	[GroomingFindingCategory.NAILS]: "الأظافر",
	[GroomingFindingCategory.DENTAL]: "الأسنان",
	[GroomingFindingCategory.LUMP]: "كتلة",
	[GroomingFindingCategory.PARASITE]: "طفيليات",
	[GroomingFindingCategory.WEIGHT]: "الوزن",
	[GroomingFindingCategory.PAIN]: "موضع مؤلم",
	[GroomingFindingCategory.BEHAVIOR]: "تغيّر سلوكي",
	[GroomingFindingCategory.OTHER]: "أخرى",
};

export const GROOMING_FINDING_SEVERITY_LABELS: Record<GroomingFindingSeverity, string> = {
	[GroomingFindingSeverity.INFO]: "للعلم",
	[GroomingFindingSeverity.ATTENTION]: "تستحق متابعة",
	[GroomingFindingSeverity.URGENT]: "عاجلة",
};

export const COAT_CONDITION_LABELS: Record<CoatCondition, string> = {
	[CoatCondition.HEALTHY]: "سليم",
	[CoatCondition.DRY]: "جاف",
	[CoatCondition.GREASY]: "دهني",
	[CoatCondition.DANDRUFF]: "قشرة",
	[CoatCondition.SHEDDING_HEAVY]: "تساقط غزير",
	[CoatCondition.DAMAGED]: "تالف",
};

export const EAR_CONDITION_LABELS: Record<EarCondition, string> = {
	[EarCondition.NORMAL]: "طبيعية",
	[EarCondition.WAXY]: "شمع متراكم",
	[EarCondition.REDNESS]: "احمرار",
	[EarCondition.ODOR]: "رائحة",
	[EarCondition.DISCHARGE]: "إفرازات",
	[EarCondition.PAINFUL]: "مؤلمة",
};

export const NAIL_CONDITION_LABELS: Record<NailCondition, string> = {
	[NailCondition.NORMAL]: "طبيعية",
	[NailCondition.OVERGROWN]: "طويلة",
	[NailCondition.SPLIT]: "متشقّقة",
	[NailCondition.INGROWN]: "غائرة",
	[NailCondition.MISSING]: "مفقود أو مكسور",
};

export const GROOMING_MOOD_LABELS: Record<GroomingMoodScore, string> = {
	[GroomingMoodScore.CALM]: "هادئ",
	[GroomingMoodScore.HAPPY]: "مستمتع",
	[GroomingMoodScore.ANXIOUS]: "متوتّر",
	[GroomingMoodScore.STRESSED]: "مجهَد",
	[GroomingMoodScore.AGGRESSIVE]: "عدواني",
};

export const GROOMING_CANCEL_KIND_LABELS: Record<GroomingCancelKind, string> = {
	[GroomingCancelKind.OWNER_CANCELLED]: "ألغى وليّ الأمر",
	[GroomingCancelKind.CLINIC_CANCELLED]: "ألغت الأكاديمية",
	[GroomingCancelKind.NO_SHOW]: "لم يحضر",
	[GroomingCancelKind.HEALTH_REFUSAL]: "رُفضت لأسباب صحية",
	[GroomingCancelKind.BEHAVIOR_REFUSAL]: "رُفضت لخطورة السلوك",
};

/** أعمدة اللوحة بالترتيب — الاعتراضية خارجها، تُعرض كمرشّح لا كعمود */
/** قيد في سجل الجلسة — مع اسم الفاعل المركَّب في الـ DAO */
export type GroomingActivityResponse = Prisma.GroomingActivityGetPayload<{
	select: {
		id: true;
		type: true;
		detail: true;
		gate: true;
		createdAt: true;
		authorUserId: true;
	};
}> & { author: { name: string | null } | null };

/**
 * تسميات أنواع السجل — الفعل الذي يُقرأ حين لا يحمل القيد تفصيلًا.
 * مكانها هنا لا في المكوّن: يستعملها السجل والتقرير المطبوع معًا.
 */
export const GROOMING_ACTIVITY_LABELS: Record<GroomingActivityType, string> = {
	[GroomingActivityType.CREATED]: "أنشأ الجلسة",
	[GroomingActivityType.STATUS_CHANGED]: "غيّر الحالة",
	[GroomingActivityType.STAGE_CHANGED]: "غيّر المرحلة",
	[GroomingActivityType.GATE_OVERRIDDEN]: "تجاوز بوابة",
	[GroomingActivityType.QUOTE_RECALCULATED]: "أعاد حساب التسعيرة",
	[GroomingActivityType.QUOTE_APPROVED]: "أقرّ التسعيرة",
	[GroomingActivityType.LANE_ESCALATED]: "رفع الجلسة إلى المسار الطبي",
	[GroomingActivityType.INTAKE_RECORDED]: "سجّل الفحص القبلي",
	[GroomingActivityType.ITEM_CHANGED]: "عدّل الدورات",
	[GroomingActivityType.PRODUCT_ISSUED]: "صرف مستهلكات",
	[GroomingActivityType.PHOTO_ADDED]: "أضاف صورة",
	[GroomingActivityType.FINDING_ADDED]: "سجّل ملاحظة سريرية",
	[GroomingActivityType.FINDING_ESCALATED]: "صعّد ملاحظة",
	[GroomingActivityType.INCIDENT_REPORTED]: "أبلغ عن حادثة",
	[GroomingActivityType.INCIDENT_RESOLVED]: "أغلق حادثة",
	[GroomingActivityType.REPORT_CARD_SENT]: "أرسل تقرير الجلسة",
	[GroomingActivityType.INVOICE_ISSUED]: "أصدر الفاتورة",
	[GroomingActivityType.INVOICE_PAID]: "سجّل سدادًا",
	[GroomingActivityType.COMMENT]: "علّق",
};

/** الأنواع التي تفصيلها نصّ حرّ يستحق بطاقة مستقلّة تحت السطر */
export const GROOMING_ACTIVITY_CARD_TYPES: readonly GroomingActivityType[] = [
	GroomingActivityType.GATE_OVERRIDDEN,
	GroomingActivityType.INCIDENT_REPORTED,
	GroomingActivityType.INCIDENT_RESOLVED,
	GroomingActivityType.FINDING_ADDED,
];

export const GROOMING_BOARD_COLUMNS = [
	GroomingStatus.SCHEDULED,
	GroomingStatus.CHECK_IN,
	GroomingStatus.INTAKE,
	GroomingStatus.IN_PROGRESS,
	GroomingStatus.FINISHING,
	GroomingStatus.READY,
	GroomingStatus.PICKED_UP,
] as const;

export const GROOMING_PERIODS = ["today", "week", "all"] as const;
export type GroomingPeriod = (typeof GROOMING_PERIODS)[number];

export const GROOMING_VIEWS = ["all", "mine", "attention"] as const;
export type GroomingView = (typeof GROOMING_VIEWS)[number];

export type GroomingStageValue = GroomingStage;
export type GroomingDryingMethodValue = GroomingDryingMethod;
