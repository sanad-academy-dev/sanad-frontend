import type { Prisma } from "@/generated/prisma/client";
export declare const notificationsSelect: {
    id: true;
    clinicId: true;
    emailEnabled: true;
    customerFollowUp: true;
    systemUpdates: true;
    emailBookings: true;
    emailAppointmentUpdates: true;
    emailAppointmentCancellations: true;
    emailReminderApprovalEnabled: true;
    emailReminderApprovalHours: true;
    emailReminderFollowUpEnabled: true;
    emailReminderFollowUpHours: true;
    emailReminderPaymentEnabled: true;
    emailReminderPaymentHours: true;
    emailReminderCommentsEnabled: true;
    emailInvoices: true;
    emailFormRequest: true;
    emailFormFollowUp: true;
    emailTreatmentFollowUp: true;
};
export type ClinicNotificationSettingsResponse = Prisma.ClinicNotificationSettingsGetPayload<{
    select: typeof notificationsSelect;
}>;
export type UpdateNotificationsInput = Partial<Omit<ClinicNotificationSettingsResponse, "id" | "clinicId">>;
