import { z } from "zod";
export declare const bookingStepSchema: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
export type BookingStep = z.infer<typeof bookingStepSchema>;
export declare const bookingSearchSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    specializationId: z.ZodOptional<z.ZodString>;
    serviceId: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    staffId: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodString>;
    slot: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    step: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type BookingSearch = z.infer<typeof bookingSearchSchema>;
export declare const step1BookingSchema: z.ZodObject<{
    consultationTypeId: z.ZodString;
    reason: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    symptoms: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    clinicalNotes: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    whatsappReminderEnabled: z.ZodDefault<z.ZodBoolean>;
    isEmergency: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type Step1BookingFormInput = z.input<typeof step1BookingSchema>;
export type Step1BookingFormValues = z.output<typeof step1BookingSchema>;
export declare const step2BookingSchema: z.ZodObject<{
    ownerName: z.ZodString;
    ownerPhone: z.ZodString;
    ownerEmail: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    patientName: z.ZodString;
    patientAnimalTypeId: z.ZodString;
}, z.core.$strip>;
export type Step2BookingFormInput = z.input<typeof step2BookingSchema>;
export type Step2BookingFormValues = z.output<typeof step2BookingSchema>;
export declare const fullBookingSchema: z.ZodObject<{
    consultationTypeId: z.ZodString;
    reason: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    symptoms: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    clinicalNotes: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    whatsappReminderEnabled: z.ZodDefault<z.ZodBoolean>;
    isEmergency: z.ZodDefault<z.ZodBoolean>;
    ownerName: z.ZodString;
    ownerPhone: z.ZodString;
    ownerEmail: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    patientName: z.ZodString;
    patientAnimalTypeId: z.ZodString;
}, z.core.$strip>;
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
export type CreatePublicBookingFailure = {
    kind: "CLINIC_NOT_FOUND";
} | {
    kind: "STAFF_NOT_BOOKABLE";
} | {
    kind: "SERVICE_NOT_AVAILABLE";
} | {
    kind: "ANIMAL_TYPE_INVALID";
} | {
    kind: "CONSULTATION_TYPE_INVALID";
} | {
    kind: "INVALID_PHONE";
} | {
    kind: "SLOT_UNAVAILABLE";
};
