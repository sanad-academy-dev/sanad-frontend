import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import {
	CageSizeClass,
	DischargeKind,
	DrugRoute,
	InpatientAcuity,
	InpatientAdministrationStatus,
	InpatientOrderKind,
	InpatientStayKind,
	InpatientStayStatus,
} from "@/generated/prisma/enums";

// [IP0] أشكال الاستجابة ومخطّطات النماذج — مصدر واحد يستورده الخادم والواجهة.

// ── الأقفاص ────────────────────────────────────────────────────────────────

export const cageSelect = {
	id: true,
	name: true,
	sizeClass: true,
	notes: true,
	active: true,
	roomId: true,
	branchId: true,
	room: { select: { id: true, name: true, type: true } },
} as const;

export type CageResponse = Prisma.CageGetPayload<{ select: typeof cageSelect }>;

/** القفص مع شاغله الحالي — ما تعرضه شاشة الإشغال وقائمة اختيار القفص */
export type CageWithOccupancy = CageResponse & {
	occupiedBy: {
		stayId: string;
		code: string;
		patientId: string;
		patientName: string;
		assignedAt: Date;
	} | null;
};

/** [IP2] صفّ في قائمة طلبات الإقامة (تحليل/أشعّة) — عنصر واحد لكل صفّ */
export type InpatientRequestRow = {
	kind: "LAB" | "IMAGING" | "PHARMACY";
	orderId: string;
	itemId: string;
	code: string;
	serviceName: string;
	status: string;
	createdAt: Date;
};

// ── الإقامة ────────────────────────────────────────────────────────────────

/** كرت اللوحة — أخفّ ما يكفي للعرض والفرز بالإلحاح */
export const inpatientStayCardSelect = {
	id: true,
	code: true,
	kind: true,
	status: true,
	acuity: true,
	admittedAt: true,
	expectedDischargeAt: true,
	dischargedAt: true,
	monitoringIntervalMinutes: true,
	nextDueAt: true,
	branchId: true,
	admissionDiagnosis: true,
	patient: {
		select: {
			id: true,
			code: true,
			name: true,
			gender: true,
			animalType: { select: { id: true, arName: true, enName: true } },
		},
	},
	owner: { select: { id: true, name: true, phone: true } },
	attendingStaff: { select: { id: true, name: true } },
	cageAssignments: {
		where: { releasedAt: null },
		take: 1,
		select: {
			id: true,
			assignedAt: true,
			cage: {
				select: {
					id: true,
					name: true,
					room: { select: { id: true, name: true, type: true } },
				},
			},
		},
	},
} as const;

export type InpatientStayCard = Prisma.InpatientStayGetPayload<{
	select: typeof inpatientStayCardSelect;
}>;

export const inpatientStayDetailSelect = {
	...inpatientStayCardSelect,
	presentingComplaint: true,
	isolationReason: true,
	dischargeKind: true,
	dischargeSummaryAr: true,
	dischargeInstructionsAr: true,
	cancelReasonAr: true,
	dailyRateSnapshot: true,
	appointmentId: true,
	operationCaseId: true,
	admissionWeightRecordId: true,
	createdAt: true,
	clinicId: true,
	dailyRateService: { select: { id: true, name: true } },
	admittedBy: { select: { id: true, name: true } },
	dischargedBy: { select: { id: true, name: true } },
	admissionWeightRecord: {
		select: { id: true, code: true, weight: true, recordedAt: true },
	},
	patient: {
		select: {
			id: true,
			code: true,
			name: true,
			gender: true,
			birthDate: true,
			weight: true,
			microchipNumber: true,
			coat: true,
			animalType: { select: { id: true, arName: true, enName: true, species: true } },
			animalStrain: { select: { id: true, arName: true, enName: true } },
		},
	},
	invoice: {
		select: {
			id: true,
			code: true,
			subtotal: true,
			vatAmount: true,
			discount: true,
			total: true,
			amountPaid: true,
			status: true,
			currencyCode: true,
		},
	},
} as const;

export type InpatientStayDetail = Prisma.InpatientStayGetPayload<{
	select: typeof inpatientStayDetailSelect;
}>;

// ── الأوامر ────────────────────────────────────────────────────────────────

export const inpatientOrderSelect = {
	id: true,
	stayId: true,
	idx: true,
	kind: true,
	status: true,
	inventoryItemId: true,
	catalogProductId: true,
	prescriptionItemId: true,
	nameSnapshot: true,
	doseAmount: true,
	doseUnit: true,
	route: true,
	rateMlPerHour: true,
	doseSource: true,
	overrideReasonAr: true,
	scheduleIntervalHours: true,
	scheduleTimes: true,
	prn: true,
	startAt: true,
	endAt: true,
	instructionsAr: true,
	discontinuedAt: true,
	discontinueReasonAr: true,
	createdAt: true,
	orderedBy: { select: { id: true, name: true } },
	discontinuedBy: { select: { id: true, name: true } },
} as const;

export type InpatientOrderResponse = Prisma.InpatientOrderGetPayload<{
	select: typeof inpatientOrderSelect;
}>;

// ── ورقة العلاج ────────────────────────────────────────────────────────────

export const inpatientAdministrationSelect = {
	id: true,
	stayId: true,
	orderId: true,
	dueAt: true,
	status: true,
	givenAt: true,
	doseGivenAmount: true,
	doseGivenUnit: true,
	batchNoSnapshot: true,
	expiryDateSnapshot: true,
	vitalSignsRecordId: true,
	eatenFraction: true,
	urination: true,
	defecation: true,
	vomiting: true,
	notesAr: true,
	skipReasonAr: true,
	correctsId: true,
	createdAt: true,
	performedBy: { select: { id: true, name: true } },
	witness: { select: { id: true, name: true } },
	order: {
		select: {
			id: true,
			kind: true,
			nameSnapshot: true,
			prescriptionItemId: true,
			doseAmount: true,
			doseUnit: true,
			route: true,
			rateMlPerHour: true,
			instructionsAr: true,
			prn: true,
			status: true,
		},
	},
} as const;

export type InpatientAdministrationResponse = Prisma.InpatientAdministrationGetPayload<{
	select: typeof inpatientAdministrationSelect;
}>;

// ── سجل النشاط ─────────────────────────────────────────────────────────────

export const inpatientActivitySelect = {
	id: true,
	type: true,
	body: true,
	metadata: true,
	createdAt: true,
	author: { select: { id: true, name: true, image: true } },
} as const;

export type InpatientActivityResponse = Prisma.InpatientActivityGetPayload<{
	select: typeof inpatientActivitySelect;
}>;

// ── مخطّطات النماذج (Zod) ──────────────────────────────────────────────────

export const admitInpatientSchema = z.object({
	patientId: z.string({ error: "الطفل مطلوب" }).min(1, "الطفل مطلوب"),
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	attendingStaffId: z.string({ error: "المدرّب المعالج مطلوب" }).min(1, "المدرّب المعالج مطلوب"),
	kind: z.enum(InpatientStayKind, { error: "نوع التنويم مطلوب" }),
	acuity: z.enum(InpatientAcuity, { error: "درجة الحرجية مطلوبة" }),
	cageId: z.string().optional().nullable(),
	appointmentId: z.string().optional().nullable(),
	operationCaseId: z.string().optional().nullable(),
	presentingComplaint: z.string().optional().nullable(),
	admissionDiagnosis: z.string().optional().nullable(),
	isolationReason: z.string().optional().nullable(),
	monitoringIntervalMinutes: z.coerce
		.number({ error: "دورية المراقبة يجب أن تكون رقمًا" })
		.int("دورية المراقبة يجب أن تكون عددًا صحيحًا")
		.min(15, "أقلّ دورية مراقبة ١٥ دقيقة")
		.max(1440, "أقصى دورية مراقبة ٢٤ ساعة"),
	dailyRateServiceId: z.string().optional().nullable(),
	expectedDischargeAt: z.string().optional().nullable(),
});

// المدخل والمخرج نوعان لا نوع واحد — `z.coerce` يجعل المدخل `unknown` والمخرج
// `number`. هذا هو نفس الزوج الذي يستعمله نموذج حجز الزيارة.
export type AdmitInpatientFormInput = z.input<typeof admitInpatientSchema>;
export type AdmitInpatientFormValues = z.output<typeof admitInpatientSchema>;

export const createInpatientOrderSchema = z
	.object({
		kind: z.enum(InpatientOrderKind, { error: "نوع الأمر مطلوب" }),
		inventoryItemId: z.string().optional().nullable(),
		catalogProductId: z.string().optional().nullable(),
		nameSnapshot: z.string({ error: "اسم الأمر مطلوب" }).min(1, "اسم الأمر مطلوب"),
		doseAmount: z.coerce.number().min(0, "الجرعة لا تكون سالبة").optional().nullable(),
		doseUnit: z.string().optional().nullable(),
		route: z.enum(DrugRoute).optional().nullable(),
		rateMlPerHour: z.coerce.number().min(0, "المعدّل لا يكون سالبًا").optional().nullable(),
		overrideReasonAr: z.string().optional().nullable(),
		scheduleIntervalHours: z.coerce
			.number()
			.int("الدورية يجب أن تكون عددًا صحيحًا من الساعات")
			.min(1, "أقلّ دورية ساعة واحدة")
			.max(168, "أقصى دورية أسبوع")
			.optional()
			.nullable(),
		scheduleTimes: z.array(z.string()).optional().default([]),
		prn: z.boolean().optional().default(false),
		startAt: z.string({ error: "وقت البدء مطلوب" }).min(1, "وقت البدء مطلوب"),
		endAt: z.string().optional().nullable(),
		instructionsAr: z.string().optional().nullable(),
	})
	.refine(
		(v) =>
			v.prn === true ||
			(v.scheduleIntervalHours != null && v.scheduleIntervalHours > 0) ||
			(v.scheduleTimes?.length ?? 0) > 0,
		{
			// أمرٌ بلا جدول ولا «عند اللزوم» لا يُنتج صفًّا واحدًا، فيبدو مُسجَّلًا
			// وهو لا يُنفَّذ أبدًا — وهذا أسوأ من رفضه عند الإدخال.
			error: "حدّد دورية أو أوقاتًا ثابتة، أو علّم الأمر «عند اللزوم»",
			path: ["scheduleIntervalHours"],
		},
	);

export type CreateInpatientOrderFormInput = z.infer<typeof createInpatientOrderSchema>;

export const giveAdministrationSchema = z.object({
	doseGivenAmount: z.coerce.number().min(0).optional().nullable(),
	doseGivenUnit: z.string().optional().nullable(),
	batchId: z.string().optional().nullable(),
	witnessId: z.string().optional().nullable(),
	notesAr: z.string().optional().nullable(),
	eatenFraction: z.coerce.number().min(0).max(1).optional().nullable(),
	urination: z.boolean().optional().nullable(),
	defecation: z.boolean().optional().nullable(),
	vomiting: z.boolean().optional().nullable(),
});

export type GiveAdministrationFormInput = z.infer<typeof giveAdministrationSchema>;

export const skipAdministrationSchema = z.object({
	skipReasonAr: z
		.string({ error: "سبب التخطّي مطلوب" })
		.min(3, "اكتب سببًا مفهومًا لتخطّي الجرعة"),
	hold: z.boolean().optional().default(false),
});

export type SkipAdministrationFormInput = z.infer<typeof skipAdministrationSchema>;

export const dischargeInpatientSchema = z.object({
	dischargeKind: z.enum(DischargeKind, { error: "طريقة الخروج مطلوبة" }),
	dischargeSummaryAr: z
		.string({ error: "تقرير الخروج مطلوب" })
		.min(10, "اكتب تقريرًا يصف الإقامة وما جرى فيها"),
	dischargeInstructionsAr: z.string().optional().nullable(),
	overrideReason: z.string().optional().nullable(),
});

export type DischargeInpatientFormInput = z.infer<typeof dischargeInpatientSchema>;

export const createCageSchema = z.object({
	roomId: z.string({ error: "القاعة مطلوبة" }).min(1, "القاعة مطلوبة"),
	name: z.string({ error: "اسم القفص مطلوب" }).min(1, "اسم القفص مطلوب"),
	sizeClass: z.enum(CageSizeClass).optional().nullable(),
	notes: z.string().optional().nullable(),
});

export type CreateCageFormInput = z.infer<typeof createCageSchema>;

// ── ثوابت العرض ────────────────────────────────────────────────────────────

export const INPATIENT_ADMINISTRATION_STATUS_LABELS: Record<
	InpatientAdministrationStatus,
	string
> = {
	[InpatientAdministrationStatus.PENDING]: "بانتظار التنفيذ",
	[InpatientAdministrationStatus.GIVEN]: "أُعطي",
	[InpatientAdministrationStatus.SKIPPED]: "تُخطّي",
	[InpatientAdministrationStatus.HELD]: "موقوف",
};

export const CAGE_SIZE_LABELS: Record<CageSizeClass, string> = {
	[CageSizeClass.SMALL]: "صغير",
	[CageSizeClass.MEDIUM]: "متوسّط",
	[CageSizeClass.LARGE]: "كبير",
	[CageSizeClass.WALK_IN]: "بوكس",
};

/** الحالات التي تعدّ الإقامة فيها «قائمة» — تُستعمل في فلاتر الاستعلام */
export const INPATIENT_BOARD_VIEWS = ["active", "discharged", "all"] as const;
export type InpatientBoardView = (typeof INPATIENT_BOARD_VIEWS)[number];

export const INPATIENT_STATUS_ORDER: readonly InpatientStayStatus[] = [
	InpatientStayStatus.ADMITTED,
	InpatientStayStatus.IN_CARE,
	InpatientStayStatus.DISCHARGE_PENDING,
	InpatientStayStatus.DISCHARGED,
	InpatientStayStatus.CANCELLED,
];
