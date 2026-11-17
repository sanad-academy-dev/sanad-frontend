import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { Gender } from "@/generated/prisma/enums";
import type { vitalSignsSelectShape } from "@/server/vital-signs/vital-signs.type";

export type { Gender };

export const guardianItemSchema = z.object({
	ownerId: z.string(),
	relationship: z.string().optional(),
});

export type GuardianItem = z.infer<typeof guardianItemSchema>;

export const createPatientSchema = z.object({
	name: z.string({ error: "اسم الطفل مطلوب" }).min(1, "اسم الطفل مطلوب"),
	gender: z.enum(["MALE", "FEMALE", "UNKNOWN"], { error: "الجنس مطلوب" }),
	ownerId: z.string().optional(),
	ownerIds: z.array(z.string()).optional(),
	guardians: z.array(guardianItemSchema).optional(),
	guardianRelationships: z.record(z.string(), z.string()).optional(),
	guardianName: z.string().optional(),
	guardianRelationship: z.string().optional(),
	guardianPhone: z.string().optional(),
	guardianEmail: z.string().optional(),
	emergencyContactPhone: z.string().optional(),
	emergencyContactName: z.string().optional(),
	age: z.coerce
		.number({ error: "العمر يجب أن يكون رقمًا" })
		.min(0, "العمر يجب أن يكون 0 على الأقل")
		.optional(),
	birthDate: z
		.string({ error: "تاريخ الميلاد مطلوب" })
		.min(1, "تاريخ الميلاد مطلوب"),
	nationalId: z.string().optional(),
	ageGroup: z.string().optional(),
	academicStage: z.string().trim().min(1).max(60),
	classroom: z.string().optional(),
	bloodType: z.string().optional(),
	developmentStatus: z.string().optional().default("NORMAL"),
	allergies: z.string().optional(),
	pocketMoneyEnabled: z.boolean().optional().default(true),
	transportation: z.string().optional(),
	feeType: z.string().optional(),
	healthConditions: z.string().optional(),
	previousNursery: z.string().optional(),
	level: z.string().optional().default("مبتدئ"),
	learningMethod: z.string().optional().default("حضوري"),
	preferredShift: z.string().optional().default("صباحي"),
	address: z.string().optional(),
	weight: z.coerce
		.number({ error: "الوزن يجب أن يكون رقمًا" })
		.min(0, "الوزن يجب أن يكون 0 على الأقل")
		.optional(),
	notes: z.string().optional(),
	active: z.boolean().optional().default(true),
	status: z.string().optional().default("ACTIVE"),
});

export type CreatePatientFormInput = z.infer<typeof createPatientSchema>;

export type CreatePatientInput = Pick<
	Prisma.PatientUncheckedCreateInput,
	| "clinicId"
	| "name"
	| "gender"
	| "ownerId"
	| "age"
	| "birthDate"
	| "weight"
	| "notes"
	| "active"
	| "status"
	| "nationalId"
	| "ageGroup"
	| "academicStage"
	| "classroom"
	| "bloodType"
	| "developmentStatus"
	| "allergies"
	| "pocketMoneyEnabled"
	| "transportation"
	| "feeType"
	| "healthConditions"
	| "previousNursery"
	| "guardianRelationship"
	| "emergencyContactPhone"
	| "emergencyContactName"
	| "level"
	| "learningMethod"
	| "preferredShift"
	| "address"
> & {
	guardianName?: string;
	guardianPhone?: string;
	guardianEmail?: string;
	ownerIds?: string[];
	guardians?: Array<{ ownerId: string; relationship?: string }>;
};

export type UpdatePatientInput = Partial<Omit<CreatePatientInput, "clinicId">>;

export type PatientResponse = Prisma.PatientGetPayload<{
	select: {
		id: true;
		code: true;
		name: true;
		gender: true;
		age: true;
		birthDate: true;
		weight: true;
		notes: true;
		active: true;
		status: true;
		nationalId: true;
		classroom: true;
		ageGroup: true;
		academicStage: true;
		bloodType: true;
		developmentStatus: true;
		allergies: true;
		pocketMoneyEnabled: true;
		transportation: true;
		feeType: true;
		healthConditions: true;
		previousNursery: true;
		guardianRelationship: true;
		emergencyContactPhone: true;
		emergencyContactName: true;
		level: true;
		learningMethod: true;
		preferredShift: true;
		address: true;
		editsCount: true;
		createdAt: true;
		updatedAt: true;
		owner: {
			select: {
				id: true;
				code: true;
				name: true;
				phone: true;
				phoneE164: true;
				email: true;
				gender: true;
				relationship: true;
				address: true;
				city: true;
				country: true;
				emergencyContactName: true;
				emergencyContactPhone: true;
				notes: true;
				active: true;
				createdAt: true;
			};
		};
		guardians: {
			select: {
				id: true;
				relationship: true;
				owner: {
					select: {
						id: true;
						code: true;
						name: true;
						phone: true;
						phoneE164: true;
						email: true;
						gender: true;
						relationship: true;
						address: true;
						city: true;
						country: true;
						emergencyContactName: true;
						emergencyContactPhone: true;
						notes: true;
						active: true;
						createdAt: true;
					};
				};
			};
		};
	};
}> & {
	/** Legacy single-guardian fields are accepted by older Dashboard responses. */
	guardianName?: string | null;
	guardianPhone?: string | null;
	guardianEmail?: string | null;
};

export const transferPatientOwnershipSchema = z.object({
	ownerId: z.string({ error: "وليّ الأمر مطلوب" }).min(1, "وليّ الأمر مطلوب"),
	comment: z
		.string()
		.trim()
		.max(2000, "التعليق طويل جدًا")
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type TransferPatientOwnershipFormInput = z.input<typeof transferPatientOwnershipSchema>;
export type TransferPatientOwnershipFormValues = z.output<
	typeof transferPatientOwnershipSchema
>;

export type PatientActivityResponse = Prisma.PatientActivityGetPayload<{
	select: {
		id: true;
		type: true;
		body: true;
		metadata: true;
		createdAt: true;
		author: { select: { id: true; name: true } };
	};
}>;

// ── سجل الطفل: الخط الزمني الموحّد ──────────────────────────────────────────
// كل إجراء أُجري للطفل في مكان واحد مرتّبًا زمنيًا تنازليًا. لكل مصدر انتقاؤه
// الخاص: الصف يحتاج عنوانًا وحالة، والمعاينة السريعة تحتاج ما يكفي لقراءة
// السجل كاملًا دون فتح لوحته الأصلية. الحقول الزائدة هنا تُوفّر فتحة ثانية.

/**
 * انتقاء الزيارة يضم — عمدًا — كل حقول `dashboardAppointmentSelect`، فبطاقة
 * الزيارة تُبنى من هذه الاستجابة عبر `mapDashboardAppointmentToCard` بلا مُحوِّل ثالث.
 */
const historyVisitSelect = {
	id: true,
	code: true,
	startsAt: true,
	durationMinutes: true,
	status: true,
	queueStatus: true,
	priority: true,
	isEmergency: true,
	location: true,
	reason: true,
	symptoms: true,
	clinicalNotes: true,
	owner: { select: { id: true, name: true } },
	staff: { select: { id: true, name: true, prefix: true } },
	patient: { select: { id: true, name: true } },
	room: { select: { id: true, name: true } },
	consultationType: { select: { id: true, name: true } },
	clinicalExam: { select: { id: true, completedAt: true } },
	invoice: { select: { id: true, code: true, total: true, amountPaid: true, status: true } },
	services: {
		select: { id: true, quantity: true, service: { select: { id: true, name: true } } },
		orderBy: { id: "asc" as const },
	},
	_count: { select: { products: true, labTestOrders: true, radiologyOrders: true } },
} satisfies Prisma.AppointmentSelect;

const historyLabSelect = {
	id: true,
	code: true,
	createdAt: true,
	priority: true,
	isUrgent: true,
	notes: true,
	appointmentId: true,
	requestedBy: { select: { id: true, name: true } },
	invoice: { select: { id: true, code: true, total: true, amountPaid: true, status: true } },
	items: {
		select: {
			id: true,
			status: true,
			sampleStage: true,
			completedAt: true,
			service: { select: { id: true, name: true } },
		},
		orderBy: { id: "asc" as const },
	},
} satisfies Prisma.LabTestOrderSelect;

const historyRadiologySelect = {
	id: true,
	code: true,
	createdAt: true,
	priority: true,
	isUrgent: true,
	clinicalInfo: true,
	notes: true,
	appointmentId: true,
	requestedBy: { select: { id: true, name: true } },
	invoice: { select: { id: true, code: true, total: true, amountPaid: true, status: true } },
	items: {
		select: {
			id: true,
			status: true,
			stage: true,
			accession: true,
			modality: true,
			bodyPart: true,
			laterality: true,
			completedAt: true,
			service: { select: { id: true, name: true } },
		},
		orderBy: { id: "asc" as const },
	},
} satisfies Prisma.RadiologyOrderSelect;

const historyCarePlanSelect = {
	id: true,
	code: true,
	startedAt: true,
	completedAt: true,
	status: true,
	priceSnapshot: true,
	notes: true,
	carePlan: { select: { id: true, name: true, durationDays: true } },
	_count: { select: { visits: true } },
} satisfies Prisma.CarePlanEnrollmentSelect;

export type PatientHistoryVisit = Prisma.AppointmentGetPayload<{
	select: typeof historyVisitSelect;
}>;
export type PatientHistoryLabOrder = Prisma.LabTestOrderGetPayload<{
	select: typeof historyLabSelect;
}>;
export type PatientHistoryRadiologyOrder = Prisma.RadiologyOrderGetPayload<{
	select: typeof historyRadiologySelect;
}>;
export type PatientHistoryVitals = Prisma.VitalSignsRecordGetPayload<{
	select: typeof vitalSignsSelectShape;
}>;
export type PatientHistoryCarePlan = Prisma.CarePlanEnrollmentGetPayload<{
	select: typeof historyCarePlanSelect;
}>;

export const patientHistorySelectShapes = {
	visit: historyVisitSelect,
	lab: historyLabSelect,
	radiology: historyRadiologySelect,
	carePlan: historyCarePlanSelect,
} as const;

/** أنواع الأحداث في الخط الزمني — الفلاتر والأيقونات تشتقّ منه */
export const PATIENT_HISTORY_KINDS = [
	"VISIT",
	"LAB",
	"RADIOLOGY",
	"VITALS",
	"CARE_PLAN",
] as const;

export type PatientHistoryKind = (typeof PATIENT_HISTORY_KINDS)[number];

/**
 * مغلّف الحدث: النوع ولحظة الوقوع فقط، والسجل الأصلي كما هو من Prisma.
 * `occurredAt` يختلف مصدره بين النوعين (موعد الزيارة مقابل وقت إنشاء الطلب)،
 * فيُوحَّد هنا ليصير الترتيب والتجميع باليوم منطقًا واحدًا لا خمسة.
 */
export type PatientHistoryEntry =
	| { kind: "VISIT"; id: string; occurredAt: Date; record: PatientHistoryVisit }
	| { kind: "LAB"; id: string; occurredAt: Date; record: PatientHistoryLabOrder }
	| { kind: "RADIOLOGY"; id: string; occurredAt: Date; record: PatientHistoryRadiologyOrder }
	| { kind: "VITALS"; id: string; occurredAt: Date; record: PatientHistoryVitals }
	| { kind: "CARE_PLAN"; id: string; occurredAt: Date; record: PatientHistoryCarePlan };

export interface PatientSupervisorItem {
	staffId: string;
	role?: string;
	assignedAt: string;
}

export interface PatientSupervisorResponse {
	id: string;
	staffId: string;
	name: string;
	role: string;
	initial: string;
	avatar?: string | null;
	phone?: string | null;
	email?: string | null;
	assignedAt?: string;
}

