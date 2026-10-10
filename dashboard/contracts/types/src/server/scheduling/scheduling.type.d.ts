import type { Prisma } from "@/generated/prisma/client";
export declare const schedulingSelect: {
    id: true;
    clinicId: true;
    schedulingEnabled: true;
    workDays: true;
    shiftsEnabled: true;
    morningStartMinute: true;
    morningEndMinute: true;
    eveningStartMinute: true;
    eveningEndMinute: true;
    bookingRulesEnabled: true;
    appointmentBookingEnabled: true;
    onlineBookingEnabled: true;
    doubleBookingEnabled: true;
    appointmentBufferEnabled: true;
    appointmentBufferMinutes: true;
    confirmationTimeoutEnabled: true;
    confirmationTimeoutHours: true;
    minimumBookingNoticeEnabled: true;
    minimumBookingNoticeHours: true;
    rescheduleNoticeEnabled: true;
    rescheduleNoticeHours: true;
};
export type ClinicSchedulingSettingsResponse = Prisma.ClinicSchedulingSettingsGetPayload<{
    select: typeof schedulingSelect;
}>;
export type UpdateSchedulingSettingsInput = Partial<Omit<ClinicSchedulingSettingsResponse, "id" | "clinicId">>;
