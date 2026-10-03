import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { RepeatUnit } from "@/generated/prisma/enums";
export { RepeatUnit };
export declare const REPEAT_UNIT_LABELS: Record<RepeatUnit, string>;
export declare const DEFAULT_CONSULTATION_DURATION_MINUTES = 20;
export type AppointmentWriteFields = Omit<Prisma.AppointmentUncheckedCreateInput, "id" | "code" | "durationMinutes" | "createdAt" | "updatedAt" | "isDeleted" | "deletedAt">;
export type CreateAppointmentInput = Pick<AppointmentWriteFields, "clinicId" | "branchId" | "ownerId" | "patientId" | "staffId" | "startsAt"> & Partial<Pick<AppointmentWriteFields, "roomId" | "location" | "status" | "priority" | "isEmergency" | "consultationTypeId" | "clinicalNotes" | "whatsappReminderEnabled" | "images">> & {
    serviceIds: string[];
    repeatCount?: number;
    repeatUnit?: RepeatUnit;
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
declare const dashboardAppointmentSelect: {
    id: true;
    code: true;
    startsAt: true;
    durationMinutes: true;
    status: true;
    queueStatus: true;
    isEmergency: true;
    reason: true;
    owner: {
        select: {
            id: true;
            name: true;
        };
    };
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
            animalType: {
                select: {
                    enName: true;
                };
            };
        };
    };
    services: {
        select: {
            service: {
                select: {
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
        take: number;
    };
};
export declare const dashboardAppointmentSelectShape: {
    id: true;
    code: true;
    startsAt: true;
    durationMinutes: true;
    status: true;
    queueStatus: true;
    isEmergency: true;
    reason: true;
    owner: {
        select: {
            id: true;
            name: true;
        };
    };
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    patient: {
        select: {
            id: true;
            name: true;
            animalType: {
                select: {
                    enName: true;
                };
            };
        };
    };
    services: {
        select: {
            service: {
                select: {
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
        take: number;
    };
};
declare const criticalAlertSelect: {
    id: true;
    startsAt: true;
    reason: true;
    patient: {
        select: {
            id: true;
            name: true;
            animalType: {
                select: {
                    enName: true;
                };
            };
        };
    };
};
export declare const criticalAlertSelectShape: {
    id: true;
    startsAt: true;
    reason: true;
    patient: {
        select: {
            id: true;
            name: true;
            animalType: {
                select: {
                    enName: true;
                };
            };
        };
    };
};
export type CriticalAlertResponse = Prisma.AppointmentGetPayload<{
    select: typeof criticalAlertSelect;
}>;
export type DashboardAppointmentResponse = Prisma.AppointmentGetPayload<{
    select: typeof dashboardAppointmentSelect;
}>;
declare const appointmentSelect: {
    id: true;
    code: true;
    clinicId: true;
    branchId: true;
    ownerId: true;
    staffId: true;
    roomId: true;
    startsAt: true;
    durationMinutes: true;
    location: true;
    status: true;
    queueStatus: true;
    priority: true;
    isEmergency: true;
    reason: true;
    symptoms: true;
    clinicalNotes: true;
    whatsappReminderEnabled: true;
    consultationFeeSnapshot: true;
    consultationPaidAt: true;
    images: true;
    recurringGroupId: true;
    recurringIndex: true;
    recurringTotal: true;
    repeatUnit: true;
    createdAt: true;
    updatedAt: true;
    owner: {
        select: {
            id: true;
            code: true;
            name: true;
            phone: true;
        };
    };
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    room: {
        select: {
            id: true;
            name: true;
            type: true;
        };
    };
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
        };
    };
    services: {
        select: {
            id: true;
            quantity: true;
            priceSnapshot: true;
            durationSnapshot: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
    invoice: {
        select: {
            id: true;
            code: true;
            status: true;
            total: true;
        };
    };
    consultationType: {
        select: {
            id: true;
            name: true;
        };
    };
    clinicalExam: {
        select: {
            completedAt: true;
        };
    };
};
export declare const appointmentSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    branchId: true;
    ownerId: true;
    staffId: true;
    roomId: true;
    startsAt: true;
    durationMinutes: true;
    location: true;
    status: true;
    queueStatus: true;
    priority: true;
    isEmergency: true;
    reason: true;
    symptoms: true;
    clinicalNotes: true;
    whatsappReminderEnabled: true;
    consultationFeeSnapshot: true;
    consultationPaidAt: true;
    images: true;
    recurringGroupId: true;
    recurringIndex: true;
    recurringTotal: true;
    repeatUnit: true;
    createdAt: true;
    updatedAt: true;
    owner: {
        select: {
            id: true;
            code: true;
            name: true;
            phone: true;
        };
    };
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    room: {
        select: {
            id: true;
            name: true;
            type: true;
        };
    };
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
        };
    };
    services: {
        select: {
            id: true;
            quantity: true;
            priceSnapshot: true;
            durationSnapshot: true;
            service: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
    invoice: {
        select: {
            id: true;
            code: true;
            status: true;
            total: true;
        };
    };
    consultationType: {
        select: {
            id: true;
            name: true;
        };
    };
    clinicalExam: {
        select: {
            completedAt: true;
        };
    };
};
export type AppointmentResponse = Prisma.AppointmentGetPayload<{
    select: typeof appointmentSelect;
}>;
export type CreateAppointmentResult = {
    appointments: AppointmentResponse[];
    skippedDates: Date[];
    roomConflicts: {
        id: string;
        code: string;
        startsAt: Date;
        durationMinutes: number;
    }[];
};
declare const staffForServicesSelect: {
    id: true;
    name: true;
    prefix: true;
    code: true;
    role: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type StaffForServicesResponse = Prisma.StaffGetPayload<{
    select: typeof staffForServicesSelect;
}>;
declare const staffForBookingSelect: {
    id: true;
    name: true;
    prefix: true;
    code: true;
    role: {
        select: {
            id: true;
            name: true;
        };
    };
    services: {
        where: {
            isActive: true;
        };
        select: {
            serviceId: true;
        };
    };
};
export type StaffForBookingResponse = Prisma.StaffGetPayload<{
    select: typeof staffForBookingSelect;
}>;
declare const appointmentInternalNoteSelect: {
    id: true;
    appointmentId: true;
    body: true;
    createdAt: true;
    updatedAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
    mentions: {
        select: {
            staff: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export declare const appointmentInternalNoteSelectShape: {
    id: true;
    appointmentId: true;
    body: true;
    createdAt: true;
    updatedAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
    mentions: {
        select: {
            staff: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export type AppointmentInternalNoteResponse = Prisma.AppointmentInternalNoteGetPayload<{
    select: typeof appointmentInternalNoteSelect;
}>;
declare const appointmentActivitySelect: {
    id: true;
    appointmentId: true;
    type: true;
    body: true;
    metadata: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export declare const appointmentActivitySelectShape: {
    id: true;
    appointmentId: true;
    type: true;
    body: true;
    metadata: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type AppointmentActivityResponse = Prisma.AppointmentActivityGetPayload<{
    select: typeof appointmentActivitySelect;
}>;
declare const appointmentDocumentSelect: {
    id: true;
    appointmentId: true;
    title: true;
    kind: true;
    url: true;
    mimeType: true;
    sizeBytes: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export declare const appointmentDocumentSelectShape: {
    id: true;
    appointmentId: true;
    title: true;
    kind: true;
    url: true;
    mimeType: true;
    sizeBytes: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
};
export type AppointmentDocumentResponse = Prisma.AppointmentDocumentGetPayload<{
    select: typeof appointmentDocumentSelect;
}>;
export type CreateAppointmentDocumentInput = Pick<Prisma.AppointmentDocumentUncheckedCreateInput, "appointmentId" | "authorUserId" | "title" | "kind" | "url"> & Partial<Pick<Prisma.AppointmentDocumentUncheckedCreateInput, "mimeType" | "sizeBytes">>;
declare const appointmentServiceSelect: {
    id: true;
    appointmentId: true;
    serviceId: true;
    quantity: true;
    priceSnapshot: true;
    durationSnapshot: true;
    paidAt: true;
    service: {
        select: {
            id: true;
            name: true;
            level: true;
            parentId: true;
        };
    };
};
export declare const appointmentServiceSelectShape: {
    id: true;
    appointmentId: true;
    serviceId: true;
    quantity: true;
    priceSnapshot: true;
    durationSnapshot: true;
    paidAt: true;
    service: {
        select: {
            id: true;
            name: true;
            level: true;
            parentId: true;
        };
    };
};
export type AppointmentServiceResponse = Prisma.AppointmentServiceGetPayload<{
    select: typeof appointmentServiceSelect;
}>;
export type CreateAppointmentServiceInput = {
    serviceId: string;
    quantity: number;
    priceSnapshot: number;
    durationSnapshot: number;
};
export type UpdateAppointmentServiceInput = Partial<Pick<CreateAppointmentServiceInput, "quantity" | "priceSnapshot" | "durationSnapshot">>;
declare const appointmentProductSelect: {
    id: true;
    appointmentId: true;
    inventoryItemId: true;
    nameSnapshot: true;
    priceSnapshot: true;
    quantity: true;
    freeQuantity: true;
    fullyFree: true;
    issuedAt: true;
    paidAt: true;
    createdAt: true;
};
export declare const appointmentProductSelectShape: {
    id: true;
    appointmentId: true;
    inventoryItemId: true;
    nameSnapshot: true;
    priceSnapshot: true;
    quantity: true;
    freeQuantity: true;
    fullyFree: true;
    issuedAt: true;
    paidAt: true;
    createdAt: true;
};
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
export type UpdateAppointmentProductInput = Partial<Pick<CreateAppointmentProductInput, "quantity" | "freeQuantity" | "fullyFree" | "priceSnapshot">>;
export declare const createAppointmentDocumentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    kind: z.ZodLiteral<"FILE">;
    title: z.ZodString;
    url: z.ZodString;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>, z.ZodObject<{
    kind: z.ZodLiteral<"LINK">;
    title: z.ZodString;
    url: z.ZodURL;
}, z.core.$strip>], "kind">;
export type CreateAppointmentDocumentFormInput = z.infer<typeof createAppointmentDocumentSchema>;
export declare const rescheduleAppointmentSchema: z.ZodObject<{
    date: z.ZodDate;
    startMinute: z.ZodNumber;
    comment: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
}, z.core.$strip>;
export type RescheduleAppointmentFormInput = z.input<typeof rescheduleAppointmentSchema>;
export type RescheduleAppointmentFormValues = z.output<typeof rescheduleAppointmentSchema>;
export declare const referAppointmentSchema: z.ZodObject<{
    staffId: z.ZodString;
    comment: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
}, z.core.$strip>;
export type ReferAppointmentFormInput = z.input<typeof referAppointmentSchema>;
export type ReferAppointmentFormValues = z.output<typeof referAppointmentSchema>;
declare const appointmentKanbanSelect: {
    id: true;
    code: true;
    branchId: true;
    patientId: true;
    startsAt: true;
    durationMinutes: true;
    updatedAt: true;
    status: true;
    queueStatus: true;
    priority: true;
    isEmergency: true;
    reason: true;
    owner: {
        select: {
            id: true;
            name: true;
        };
    };
    patient: {
        select: {
            name: true;
        };
    };
    staff: {
        select: {
            name: true;
            prefix: true;
        };
    };
    services: {
        select: {
            service: {
                select: {
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
        take: number;
    };
    activity: {
        where: {
            type: "STATUS_CHANGED";
        };
        orderBy: {
            createdAt: "desc";
        };
        take: number;
        select: {
            createdAt: true;
        };
    };
    clinicalExam: {
        select: {
            completedAt: true;
        };
    };
    _count: {
        select: {
            activity: {
                where: {
                    type: "COMMENT";
                };
            };
        };
    };
};
export declare const appointmentKanbanSelectShape: {
    id: true;
    code: true;
    branchId: true;
    patientId: true;
    startsAt: true;
    durationMinutes: true;
    updatedAt: true;
    status: true;
    queueStatus: true;
    priority: true;
    isEmergency: true;
    reason: true;
    owner: {
        select: {
            id: true;
            name: true;
        };
    };
    patient: {
        select: {
            name: true;
        };
    };
    staff: {
        select: {
            name: true;
            prefix: true;
        };
    };
    services: {
        select: {
            service: {
                select: {
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
        take: number;
    };
    activity: {
        where: {
            type: "STATUS_CHANGED";
        };
        orderBy: {
            createdAt: "desc";
        };
        take: number;
        select: {
            createdAt: true;
        };
    };
    clinicalExam: {
        select: {
            completedAt: true;
        };
    };
    _count: {
        select: {
            activity: {
                where: {
                    type: "COMMENT";
                };
            };
        };
    };
};
export type AppointmentKanbanResponse = Prisma.AppointmentGetPayload<{
    select: typeof appointmentKanbanSelect;
}>;
declare const followUpAppointmentSelect: {
    id: true;
    code: true;
    startsAt: true;
    durationMinutes: true;
    status: true;
    reason: true;
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    services: {
        select: {
            service: {
                select: {
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
        take: number;
    };
};
export declare const followUpAppointmentSelectShape: {
    id: true;
    code: true;
    startsAt: true;
    durationMinutes: true;
    status: true;
    reason: true;
    staff: {
        select: {
            id: true;
            name: true;
            prefix: true;
        };
    };
    services: {
        select: {
            service: {
                select: {
                    name: true;
                };
            };
        };
        orderBy: {
            id: "asc";
        };
        take: number;
    };
};
export type FollowUpAppointmentResponse = Prisma.AppointmentGetPayload<{
    select: typeof followUpAppointmentSelect;
}>;
export declare const editRecurrenceSchema: z.ZodObject<{
    repeatUnit: z.ZodEnum<{
        readonly DAY: "DAY";
        readonly WEEK: "WEEK";
        readonly TWO_WEEKS: "TWO_WEEKS";
        readonly MONTH: "MONTH";
        readonly YEAR: "YEAR";
    }>;
    repeatCount: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type EditRecurrenceFormInput = z.input<typeof editRecurrenceSchema>;
export type EditRecurrenceFormValues = z.output<typeof editRecurrenceSchema>;
