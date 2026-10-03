import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { RepeatUnit } from "@/generated/prisma/enums";

export { RepeatUnit };

export const REPEAT_UNIT_LABELS: Record<RepeatUnit, string> = {
	[RepeatUnit.DAY]: "يوم",
	[RepeatUnit.WEEK]: "أسبوع",
	[RepeatUnit.TWO_WEEKS]: "أسبوعان",
	[RepeatUnit.MONTH]: "شهر",
	[RepeatUnit.YEAR]: "سنة",
};

// مدة الموعد الافتراضية لزيارة "كشف فقط" (بدون دورات ذات مدد) — يستخدمها العميل والخادم معًا
export const DEFAULT_CONSULTATION_DURATION_MINUTES = 20;

export type AppointmentWriteFields = Omit<
	Prisma.AppointmentUncheckedCreateInput,
	"id" | "code" | "durationMinutes" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt"
>;

export type CreateAppointmentInput = Pick<
	AppointmentWriteFields,
	"clinicId" | "branchId" | "ownerId" | "patientId" | "staffId" | "startsAt"
> &
	Partial<
		Pick<
			AppointmentWriteFields,
			| "roomId"
			| "location"
			| "status"
			| "priority"
			| "isEmergency"
			| "consultationTypeId"
			| "clinicalNotes"
			| "whatsappReminderEnabled"
			| "images"
		>
	> & {
		serviceIds: string[];
		repeatCount?: number;
		repeatUnit?: RepeatUnit;
		// عند إنشاء الموعد من "بدء الزيارة" داخل اشتراك خطة رعاية — يربط الموعد الناتج بالزيارة
		enrollmentVisitId?: string;
	};

export type UpdateGroupRecurrenceInput = {
	recurringGroupId: string;
	clinicId: string;
	repeatUnit: RepeatUnit;
	repeatCount: number;
};

export type AppointmentFilters = {
	from?: Date;
	to?: Date;
	staffId?: string;
	branchId?: string;
	status?: AppointmentWriteFields["status"];
};

export type SlotsQuery = {
	staffId: string;
	date: Date;
	durationMinutes: number;
	excludeAppointmentId?: string;
};

export type { AppointmentSlot } from "@/server/scheduling/slot-computation";

const dashboardAppointmentSelect = {
	id: true,
	code: true,
	startsAt: true,
	durationMinutes: true,
	status: true,
	queueStatus: true,
	isEmergency: true,
	reason: true,
	owner: { select: { id: true, name: true } },
	staff: { select: { id: true, name: true, prefix: true } },
	patient: {
		select: {
			id: true,
			name: true,
			animalType: { select: { enName: true } },
		},
	},
	services: {
		select: { service: { select: { name: true } } },
		orderBy: { id: "asc" as const },
		take: 1,
	},
} satisfies Prisma.AppointmentSelect;

export const dashboardAppointmentSelectShape = dashboardAppointmentSelect;

const criticalAlertSelect = {
	id: true,
	startsAt: true,
	reason: true,
	patient: {
		select: {
			id: true,
			name: true,
			animalType: { select: { enName: true } },
		},
	},
} satisfies Prisma.AppointmentSelect;

export const criticalAlertSelectShape = criticalAlertSelect;

export type CriticalAlertResponse = Prisma.AppointmentGetPayload<{
	select: typeof criticalAlertSelect;
}>;

export type DashboardAppointmentResponse = Prisma.AppointmentGetPayload<{
	select: typeof dashboardAppointmentSelect;
}>;

const appointmentSelect = {
	id: true,
	code: true,
	clinicId: true,
	branchId: true,
	ownerId: true,
	staffId: true,
	roomId: true,
	startsAt: true,
	durationMinutes: true,
	location: true,
	status: true,
	queueStatus: true,
	priority: true,
	isEmergency: true,
	reason: true,
	symptoms: true,
	clinicalNotes: true,
	whatsappReminderEnabled: true,
	consultationFeeSnapshot: true,
	consultationPaidAt: true,
	images: true,
	recurringGroupId: true,
	recurringIndex: true,
	recurringTotal: true,
	repeatUnit: true,
	createdAt: true,
	updatedAt: true,
	owner: {
		select: { id: true, code: true, name: true, phone: true },
	},
	staff: {
		select: { id: true, name: true, prefix: true },
	},
	room: {
		select: { id: true, name: true, type: true },
	},
	patient: {
		select: {
			id: true,
			code: true,
			name: true,
		},
	},
	services: {
		select: {
			id: true,
			quantity: true,
			priceSnapshot: true,
			durationSnapshot: true,
			service: { select: { id: true, name: true } },
		},
	},
	invoice: {
		select: {
			id: true,
			code: true,
			status: true,
			total: true,
		},
	},
	consultationType: {
		select: { id: true, name: true },
	},
	clinicalExam: {
		select: { completedAt: true },
	},
} satisfies Prisma.AppointmentSelect;

export const appointmentSelectShape = appointmentSelect;

export type AppointmentResponse = Prisma.AppointmentGetPayload<{
	select: typeof appointmentSelect;
}>;

export type CreateAppointmentResult = {
	appointments: AppointmentResponse[];
	skippedDates: Date[];
	roomConflicts: { id: string; code: string; startsAt: Date; durationMinutes: number }[];
};

const staffForServicesSelect = {
	id: true,
	name: true,
	prefix: true,
	code: true,
	role: { select: { id: true, name: true } },
} satisfies Prisma.StaffSelect;

export type StaffForServicesResponse = Prisma.StaffGetPayload<{
	select: typeof staffForServicesSelect;
}>;

const staffForBookingSelect = {
	id: true,
	name: true,
	prefix: true,
	code: true,
	role: { select: { id: true, name: true } },
	services: { where: { isActive: true }, select: { serviceId: true } },
} satisfies Prisma.StaffSelect;

export type StaffForBookingResponse = Prisma.StaffGetPayload<{
	select: typeof staffForBookingSelect;
}>;

const appointmentInternalNoteSelect = {
	id: true,
	appointmentId: true,
	body: true,
	createdAt: true,
	updatedAt: true,
	author: { select: { id: true, name: true } },
	mentions: { select: { staff: { select: { id: true, name: true } } } },
} satisfies Prisma.AppointmentInternalNoteSelect;

export const appointmentInternalNoteSelectShape = appointmentInternalNoteSelect;

export type AppointmentInternalNoteResponse = Prisma.AppointmentInternalNoteGetPayload<{
	select: typeof appointmentInternalNoteSelect;
}>;

const appointmentActivitySelect = {
	id: true,
	appointmentId: true,
	type: true,
	body: true,
	metadata: true,
	createdAt: true,
	author: { select: { id: true, name: true } },
} satisfies Prisma.AppointmentActivitySelect;

export const appointmentActivitySelectShape = appointmentActivitySelect;

export type AppointmentActivityResponse = Prisma.AppointmentActivityGetPayload<{
	select: typeof appointmentActivitySelect;
}>;

const appointmentDocumentSelect = {
	id: true,
	appointmentId: true,
	title: true,
	kind: true,
	url: true,
	mimeType: true,
	sizeBytes: true,
	createdAt: true,
	author: { select: { id: true, name: true } },
} satisfies Prisma.AppointmentDocumentSelect;

export const appointmentDocumentSelectShape = appointmentDocumentSelect;

export type AppointmentDocumentResponse = Prisma.AppointmentDocumentGetPayload<{
	select: typeof appointmentDocumentSelect;
}>;

export type CreateAppointmentDocumentInput = Pick<
	Prisma.AppointmentDocumentUncheckedCreateInput,
	"appointmentId" | "authorUserId" | "title" | "kind" | "url"
> &
	Partial<Pick<Prisma.AppointmentDocumentUncheckedCreateInput, "mimeType" | "sizeBytes">>;

const appointmentServiceSelect = {
	id: true,
	appointmentId: true,
	serviceId: true,
	quantity: true,
	priceSnapshot: true,
	durationSnapshot: true,
	paidAt: true,
	service: { select: { id: true, name: true, level: true, parentId: true } },
} satisfies Prisma.AppointmentServiceSelect;

export const appointmentServiceSelectShape = appointmentServiceSelect;

export type AppointmentServiceResponse = Prisma.AppointmentServiceGetPayload<{
	select: typeof appointmentServiceSelect;
}>;

export type CreateAppointmentServiceInput = {
	serviceId: string;
	quantity: number;
	priceSnapshot: number;
	durationSnapshot: number;
};

export type UpdateAppointmentServiceInput = Partial<
	Pick<CreateAppointmentServiceInput, "quantity" | "priceSnapshot" | "durationSnapshot">
>;

const appointmentProductSelect = {
	id: true,
	appointmentId: true,
	inventoryItemId: true,
	nameSnapshot: true,
	priceSnapshot: true,
	quantity: true,
	freeQuantity: true,
	fullyFree: true,
	issuedAt: true,
	paidAt: true,
	createdAt: true,
} satisfies Prisma.AppointmentProductSelect;

export const appointmentProductSelectShape = appointmentProductSelect;

export type AppointmentProductResponse = Prisma.AppointmentProductGetPayload<{
	select: typeof appointmentProductSelect;
}>;

export type CreateAppointmentProductInput = {
	inventoryItemId?: string | null;
	nameSnapshot: string;
	priceSnapshot: number;
	quantity: number;
	freeQuantity: number;
	fullyFree: boolean;
};

export type UpdateAppointmentProductInput = Partial<
	Pick<
		CreateAppointmentProductInput,
		"quantity" | "freeQuantity" | "fullyFree" | "priceSnapshot"
	>
>;

const documentTitleSchema = z
	.string({ error: "العنوان مطلوب" })
	.trim()
	.min(1, "العنوان مطلوب")
	.max(120, "العنوان طويل جدًا");

export const createAppointmentDocumentSchema = z.discriminatedUnion("kind", [
	z.object({
		kind: z.literal("FILE"),
		title: documentTitleSchema,
		url: z.string({ error: "الملف مطلوب" }).min(1, "الملف مطلوب"),
		mimeType: z.string().nullish(),
		sizeBytes: z.number().int().nonnegative().nullish(),
	}),
	z.object({
		kind: z.literal("LINK"),
		title: documentTitleSchema,
		url: z
			.url({ error: "الرابط غير صالح" })
			.refine((u) => /^https?:\/\//i.test(u), "الرابط يجب أن يبدأ بـ http أو https"),
	}),
]);

export type CreateAppointmentDocumentFormInput = z.infer<
	typeof createAppointmentDocumentSchema
>;

export const rescheduleAppointmentSchema = z.object({
	date: z.date({ error: "تاريخ الزيارة مطلوب" }),
	startMinute: z
		.number({ error: "وقت الزيارة مطلوب" })
		.int()
		.min(0, "وقت الزيارة مطلوب")
		.max(24 * 60 - 1),
	comment: z
		.string()
		.trim()
		.max(2000, "التعليق طويل جدًا")
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type RescheduleAppointmentFormInput = z.input<typeof rescheduleAppointmentSchema>;
export type RescheduleAppointmentFormValues = z.output<typeof rescheduleAppointmentSchema>;

export const referAppointmentSchema = z.object({
	staffId: z.string({ error: "المدرّب مطلوب" }).min(1, "المدرّب مطلوب"),
	comment: z
		.string()
		.trim()
		.max(2000, "التعليق طويل جدًا")
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined)),
});

export type ReferAppointmentFormInput = z.input<typeof referAppointmentSchema>;
export type ReferAppointmentFormValues = z.output<typeof referAppointmentSchema>;

const appointmentKanbanSelect = {
	id: true,
	code: true,
	branchId: true,
	patientId: true,
	startsAt: true,
	durationMinutes: true,
	updatedAt: true,
	status: true,
	queueStatus: true,
	priority: true,
	isEmergency: true,
	reason: true,
	// [MI-P2] المعرّف مطلوب لشارة العضوية على شيت الزيارة
	owner: { select: { id: true, name: true } },
	patient: { select: { name: true } },
	staff: { select: { name: true, prefix: true } },
	services: {
		select: { service: { select: { name: true } } },
		orderBy: { id: "asc" },
		take: 1,
	},
	activity: {
		where: { type: "STATUS_CHANGED" },
		orderBy: { createdAt: "desc" },
		take: 1,
		select: { createdAt: true },
	},
	clinicalExam: {
		select: { completedAt: true },
	},
	_count: {
		select: {
			activity: { where: { type: "COMMENT" } },
		},
	},
} satisfies Prisma.AppointmentSelect;

export const appointmentKanbanSelectShape = appointmentKanbanSelect;

export type AppointmentKanbanResponse = Prisma.AppointmentGetPayload<{
	select: typeof appointmentKanbanSelect;
}>;

const followUpAppointmentSelect = {
	id: true,
	code: true,
	startsAt: true,
	durationMinutes: true,
	status: true,
	reason: true,
	staff: { select: { id: true, name: true, prefix: true } },
	services: {
		select: { service: { select: { name: true } } },
		orderBy: { id: "asc" },
		take: 1,
	},
} satisfies Prisma.AppointmentSelect;

export const followUpAppointmentSelectShape = followUpAppointmentSelect;

export type FollowUpAppointmentResponse = Prisma.AppointmentGetPayload<{
	select: typeof followUpAppointmentSelect;
}>;

export const editRecurrenceSchema = z.object({
	repeatUnit: z.enum(RepeatUnit, { error: "وحدة التكرار مطلوبة" }),
	repeatCount: z.coerce
		.number({ error: "عدد التكرار مطلوب" })
		.int("عدد التكرار يجب أن يكون عددًا صحيحًا")
		.min(1, "عدد التكرار يجب أن يكون 1 على الأقل")
		.max(10, "عدد التكرار لا يتجاوز 10"),
});

export type EditRecurrenceFormInput = z.input<typeof editRecurrenceSchema>;
export type EditRecurrenceFormValues = z.output<typeof editRecurrenceSchema>;
