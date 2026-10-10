import { z } from "zod";

import { phoneSchema } from "@sanad/contracts/runtime/lib/validation/phone";

export const bookingStepSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type BookingStep = z.infer<typeof bookingStepSchema>;

const ymdRegex = /^\d{4}-\d{2}-\d{2}$/;

export const bookingSearchSchema = z.object({
	q: z.string().trim().max(120).optional(),
	specializationId: z.string().trim().min(1).max(40).optional(),
	serviceId: z.string().trim().min(1).max(40).optional(),
	city: z.string().trim().min(1).max(60).optional(),
	staffId: z.string().trim().min(1).max(40).optional(),
	date: z.string().regex(ymdRegex).optional(),
	slot: z.coerce
		.number()
		.int()
		.min(0)
		.max(24 * 60 - 1)
		.optional(),
	step: z.coerce.number().int().min(1).max(3).optional(),
});

export type BookingSearch = z.infer<typeof bookingSearchSchema>;

export const step1BookingSchema = z.object({
	consultationTypeId: z
		.string({ error: "سبب الزيارة مطلوب" })
		.trim()
		.min(1, "سبب الزيارة مطلوب"),
	reason: z
		.string()
		.trim()
		.max(500, "السبب طويل جدًا")
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined)),
	symptoms: z
		.string()
		.trim()
		.max(2000, "النص طويل جدًا")
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined)),
	clinicalNotes: z
		.string()
		.trim()
		.max(2000, "النص طويل جدًا")
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined)),
	whatsappReminderEnabled: z.boolean().default(true),
	isEmergency: z.boolean().default(false),
});

export type Step1BookingFormInput = z.input<typeof step1BookingSchema>;
export type Step1BookingFormValues = z.output<typeof step1BookingSchema>;

export const step2BookingSchema = z.object({
	ownerName: z
		.string({ error: "الاسم الكامل مطلوب" })
		.trim()
		.min(1, "الاسم الكامل مطلوب")
		.max(120, "الاسم طويل جدًا"),
	ownerPhone: phoneSchema,
	ownerEmail: z
		.string()
		.trim()
		.optional()
		.transform((v) => (v && v.length > 0 ? v : undefined))
		.refine((v) => v === undefined || z.string().email().safeParse(v).success, {
			message: "بريد إلكتروني غير صالح",
		}),
	patientName: z
		.string({ error: "اسم الطفل مطلوب" })
		.trim()
		.min(1, "اسم الطفل مطلوب")
		.max(80, "الاسم طويل جدًا"),
	patientAnimalTypeId: z
		.string({ error: "نوع الطفل مطلوب" })
		.trim()
		.min(1, "نوع الطفل مطلوب"),
});

export type Step2BookingFormInput = z.input<typeof step2BookingSchema>;
export type Step2BookingFormValues = z.output<typeof step2BookingSchema>;

export const fullBookingSchema = step1BookingSchema.extend(step2BookingSchema.shape);

export type FullBookingFormInput = z.input<typeof fullBookingSchema>;
export type FullBookingFormValues = z.output<typeof fullBookingSchema>;

export type CreatePublicBookingInput = {
	clinicSlug: string;
	staffId: string;
	serviceId: string;
	date: string;
	startMinute: number;
	consultationTypeId: string;
	reason?: string;
	symptoms?: string;
	clinicalNotes?: string;
	whatsappReminderEnabled: boolean;
	isEmergency: boolean;
	ownerName: string;
	ownerPhone: string;
	ownerEmail?: string;
	patientName: string;
	patientAnimalTypeId: string;
	attachments: File[];
};

export type CreatePublicBookingResult = {
	code: string;
	date: string;
	startMinute: number;
	durationMinutes: number;
};

export type CreatePublicBookingFailure =
	| { kind: "CLINIC_NOT_FOUND" }
	| { kind: "STAFF_NOT_BOOKABLE" }
	| { kind: "SERVICE_NOT_AVAILABLE" }
	| { kind: "ANIMAL_TYPE_INVALID" }
	| { kind: "CONSULTATION_TYPE_INVALID" }
	| { kind: "INVALID_PHONE" }
	| { kind: "SLOT_UNAVAILABLE" };
