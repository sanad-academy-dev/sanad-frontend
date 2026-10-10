import type { AppointmentLocation, AppointmentStatus, QueueStatus } from "@/generated/prisma/client";
import { type AppointmentActivityResponse, type AppointmentDocumentResponse, type AppointmentInternalNoteResponse, type AppointmentKanbanResponse, type AppointmentProductResponse, type AppointmentResponse, type AppointmentServiceResponse, type CreateAppointmentDocumentInput, type CreateAppointmentInput, type CreateAppointmentProductInput, type CreateAppointmentResult, type CreateAppointmentServiceInput, type CriticalAlertResponse, type DashboardAppointmentResponse, type FollowUpAppointmentResponse, type SlotsQuery, type StaffForBookingResponse, type StaffForServicesResponse, type UpdateAppointmentProductInput, type UpdateAppointmentServiceInput, type UpdateGroupRecurrenceInput } from "@/server/appointments/appointments.type";
import { type AppointmentSlot } from "@/server/scheduling/slot-computation";
declare class AppointmentsValidationError extends Error {
    readonly kind: "BRANCH_MISMATCH" | "OWNER_MISMATCH" | "PATIENTS_MISSING" | "ROOM_MISMATCH" | "STAFF_MISSING" | "STAFF_SERVICES" | "EXAM_INCOMPLETE" | "INVALID_TRANSITION" | "PAYMENT_PENDING" | "TERMINAL_STATUS" | "LOCATION_LOCKED" | "LOCATION_NOTICE" | "SERVICE_OR_CONSULTATION_REQUIRED";
    constructor(message: string, kind: "BRANCH_MISMATCH" | "OWNER_MISMATCH" | "PATIENTS_MISSING" | "ROOM_MISMATCH" | "STAFF_MISSING" | "STAFF_SERVICES" | "EXAM_INCOMPLETE" | "INVALID_TRANSITION" | "PAYMENT_PENDING" | "TERMINAL_STATUS" | "LOCATION_LOCKED" | "LOCATION_NOTICE" | "SERVICE_OR_CONSULTATION_REQUIRED");
}
declare class AppointmentsConflictError extends Error {
    readonly conflicts: {
        id: string;
        code: string;
        startsAt: Date;
    }[];
    constructor(message: string, conflicts: {
        id: string;
        code: string;
        startsAt: Date;
    }[]);
}
export declare const AppointmentsErrors: {
    AppointmentsValidationError: typeof AppointmentsValidationError;
    AppointmentsConflictError: typeof AppointmentsConflictError;
};
export declare const appointmentsDao: {
    /**
     * الحالات الحرجة على لوحة المعلومات.
     *
     * [IP1] كان الشرط `status = HOSPITALIZED` على الزيارة وحدها — لافتةٌ لا سجل
     * خلفها. صار المصدر الإقامات القائمة فعلًا: الزيارة التي أنتجت إقامةً ما زالت
     * جارية. الزيارات المعلَّمة «منوَّم» بلا إقامة تبقى مشمولة كي لا تختفي حالات
     * سُجّلت قبل وجود الوحدة، وهي التي تُهاجَر تدريجيًا بفتح إقامة لها.
     */
    listCriticalAlerts(clinicId: string): Promise<CriticalAlertResponse[]>;
    listForDashboard(clinicId: string, range?: {
        from: Date;
        to: Date;
    }): Promise<DashboardAppointmentResponse[]>;
    create(input: CreateAppointmentInput, authorUserId: string): Promise<CreateAppointmentResult>;
    list(clinicId: string, period?: "day" | "week" | "all", staffId?: string): Promise<AppointmentKanbanResponse[]>;
    findById(id: string, clinicId: string): Promise<AppointmentResponse | null>;
    findFollowUps(id: string, clinicId: string): Promise<FollowUpAppointmentResponse[] | null>;
    updateStatus(id: string, clinicId: string, status: AppointmentStatus, authorUserId: string): Promise<AppointmentKanbanResponse | null>;
    updateQueueStatus(id: string, clinicId: string, queueStatus: QueueStatus | null): Promise<AppointmentResponse | null>;
    reschedule(id: string, clinicId: string, input: {
        startsAt: Date;
        comment?: string;
    }, authorUserId: string): Promise<AppointmentResponse | "terminal" | null>;
    refer(id: string, clinicId: string, input: {
        staffId: string;
        comment?: string;
    }, authorUserId: string): Promise<AppointmentResponse | "not-found" | "terminal" | "staff-not-found">;
    updateReason(id: string, clinicId: string, reason: string | null): Promise<AppointmentResponse | "terminal" | null>;
    updateLocation(id: string, clinicId: string, location: AppointmentLocation, now?: Date): Promise<AppointmentResponse | null>;
    listActivity(appointmentId: string, clinicId: string): Promise<AppointmentActivityResponse[] | null>;
    addComment(appointmentId: string, clinicId: string, authorUserId: string, body: string): Promise<AppointmentActivityResponse | null>;
    listInternalNotes(appointmentId: string, clinicId: string): Promise<AppointmentInternalNoteResponse[] | null>;
    createInternalNote(appointmentId: string, clinicId: string, authorUserId: string, body: string, mentionedStaffIds?: string[]): Promise<AppointmentInternalNoteResponse | null>;
    updateInternalNote(noteId: string, clinicId: string, authorUserId: string, body: string): Promise<{
        status: "ok";
        note: AppointmentInternalNoteResponse;
    } | {
        status: "not-found";
    } | {
        status: "forbidden";
    }>;
    deleteInternalNote(noteId: string, clinicId: string, authorUserId: string): Promise<"ok" | "not-found" | "forbidden">;
    listDocuments(appointmentId: string, clinicId: string): Promise<AppointmentDocumentResponse[] | null>;
    createDocument(appointmentId: string, clinicId: string, authorUserId: string, input: Omit<CreateAppointmentDocumentInput, "appointmentId" | "authorUserId">): Promise<AppointmentDocumentResponse | null>;
    deleteDocument(appointmentId: string, clinicId: string, authorUserId: string, documentId: string): Promise<"ok" | "not-found">;
    findStaffByServices(clinicId: string, serviceIds: string[]): Promise<StaffForServicesResponse[]>;
    findStaffForBooking(clinicId: string): Promise<StaffForBookingResponse[]>;
    listServices(appointmentId: string, clinicId: string): Promise<AppointmentServiceResponse[] | "not-found">;
    addService(appointmentId: string, clinicId: string, input: CreateAppointmentServiceInput): Promise<AppointmentServiceResponse | "not-found" | "conflict">;
    updateService(serviceRowId: string, appointmentId: string, clinicId: string, input: UpdateAppointmentServiceInput): Promise<AppointmentServiceResponse | "not-found" | "locked">;
    deleteService(serviceRowId: string, appointmentId: string, clinicId: string): Promise<"ok" | "not-found" | "locked">;
    listProducts(appointmentId: string, clinicId: string): Promise<AppointmentProductResponse[] | "not-found">;
    addProduct(appointmentId: string, clinicId: string, input: CreateAppointmentProductInput): Promise<AppointmentProductResponse | "not-found">;
    updateProduct(productRowId: string, appointmentId: string, clinicId: string, input: UpdateAppointmentProductInput): Promise<AppointmentProductResponse | "not-found" | "locked">;
    deleteProduct(productRowId: string, appointmentId: string, clinicId: string): Promise<"ok" | "not-found" | "locked">;
    getSlots(clinicId: string, query: SlotsQuery): Promise<AppointmentSlot[]>;
    updateGroupRecurrence({ recurringGroupId, clinicId, repeatUnit, repeatCount, }: UpdateGroupRecurrenceInput): Promise<number>;
};
export declare function isValidationError(e: unknown): e is AppointmentsValidationError;
export declare function isConflictError(e: unknown): e is AppointmentsConflictError;
export type { AppointmentsConflictError, AppointmentsValidationError };
