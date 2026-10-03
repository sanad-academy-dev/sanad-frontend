import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const createLeadSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    gender: z.ZodOptional<z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>>;
    mobile: z.ZodString;
    phone: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
    city: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    address: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    petSpecies: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    petCount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    petNotes: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    statusId: z.ZodString;
    sourceId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    ownerUserId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    notes: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
}, z.core.$strip>;
export type CreateLeadFormInput = z.infer<typeof createLeadSchema>;
/**
 * What the FORM holds BEFORE Zod runs (`trimmedOptional` transforms "" → undefined, so the
 * input and output types genuinely differ). `useForm<CreateLeadFormValues, unknown,
 * CreateLeadFormInput>` — the repo's three-generic pattern, see `tax-template-sheet.tsx`.
 *
 * Note the naming reads backwards here versus the tax sheets: `CreateLeadFormInput` was
 * already the PARSED type consumed by the service, so the input side takes the other name
 * rather than renaming a type the server half depends on.
 */
export type CreateLeadFormValues = z.input<typeof createLeadSchema>;
export declare const updateLeadSchema: z.ZodObject<{
    address: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    city: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    gender: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        readonly MALE: "MALE";
        readonly FEMALE: "FEMALE";
        readonly UNKNOWN: "UNKNOWN";
    }>>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    sourceId: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    petNotes: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    ownerUserId: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    mobile: z.ZodOptional<z.ZodString>;
    petSpecies: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>>;
    petCount: z.ZodOptional<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type UpdateLeadFormInput = z.infer<typeof updateLeadSchema>;
/** §3 — تغيير الحالة مسارٌ واحد: السحب في اللوحة والقائمة المنسدلة في الصفحة كلاهما هنا. */
export declare const changeLeadStatusSchema: z.ZodObject<{
    statusId: z.ZodString;
    lostReasonId: z.ZodOptional<z.ZodString>;
    lostNotes: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
}, z.core.$strip>;
export type ChangeLeadStatusFormInput = z.infer<typeof changeLeadStatusSchema>;
export declare const crmNoteSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    content: z.ZodString;
}, z.core.$strip>;
export type CrmNoteFormInput = z.infer<typeof crmNoteSchema>;
export declare const crmTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
    priority: z.ZodOptional<z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        readonly BACKLOG: "BACKLOG";
        readonly TODO: "TODO";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly DONE: "DONE";
        readonly CANCELLED: "CANCELLED";
    }>>;
    dueAt: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodString>]>;
    assignedToUserId: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
}, z.core.$strip>;
export type CrmTaskFormInput = z.infer<typeof crmTaskSchema>;
/**
 * [CRM-P1] §8.2 — شكل PATCH للمهمة. `null` تعني «امسح الحقل»، و`undefined` تعني «لا تغيّره».
 *
 * This is a DIFFERENT shape from the create schema, not `Partial<CrmTaskFormInput>`: the
 * `crmLeads.taskUpdate` TypeBox model marks the three clearable fields `__nullable__`, and
 * `updateTask` already implements exactly that (`input.description ?? null`, `dueAt ? … :
 * null`). Only the declared parameter type disagreed, which is why the PATCH route failed
 * TS2345 on `null`. Mirrors the TypeBox model, which is what actually validates the request.
 */
export declare const crmTaskUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        readonly BACKLOG: "BACKLOG";
        readonly TODO: "TODO";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly DONE: "DONE";
        readonly CANCELLED: "CANCELLED";
    }>>;
    dueAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    assignedToUserId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CrmTaskUpdateFormInput = z.infer<typeof crmTaskUpdateSchema>;
export declare const crmCommentSchema: z.ZodObject<{
    content: z.ZodString;
    mentionedUserIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CrmCommentFormInput = z.infer<typeof crmCommentSchema>;
export declare const leadListSelect: {
    readonly id: true;
    readonly code: true;
    readonly fullName: true;
    readonly mobile: true;
    readonly email: true;
    readonly city: true;
    readonly statusId: true;
    readonly sourceId: true;
    readonly ownerUserId: true;
    readonly createdAt: true;
    readonly slaPolicyId: true;
    readonly responseBy: true;
    readonly firstRespondedAt: true;
    readonly slaStatus: true;
    readonly status: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly kind: true;
            readonly order: true;
        };
    };
    readonly source: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly ownerUser: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmLeadListResponse = Prisma.CrmLeadGetPayload<{
    select: typeof leadListSelect;
}>;
export declare const leadDetailSelect: {
    readonly firstName: true;
    readonly lastName: true;
    readonly gender: true;
    readonly phone: true;
    readonly address: true;
    readonly petSpecies: true;
    readonly petCount: true;
    readonly petNotes: true;
    readonly lostReasonId: true;
    readonly lostNotes: true;
    readonly notes: true;
    readonly convertedDealId: true;
    readonly convertedAt: true;
    readonly updatedAt: true;
    readonly lostReason: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly id: true;
    readonly code: true;
    readonly fullName: true;
    readonly mobile: true;
    readonly email: true;
    readonly city: true;
    readonly statusId: true;
    readonly sourceId: true;
    readonly ownerUserId: true;
    readonly createdAt: true;
    readonly slaPolicyId: true;
    readonly responseBy: true;
    readonly firstRespondedAt: true;
    readonly slaStatus: true;
    readonly status: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly color: true;
            readonly kind: true;
            readonly order: true;
        };
    };
    readonly source: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly ownerUser: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmLeadDetailResponse = Prisma.CrmLeadGetPayload<{
    select: typeof leadDetailSelect;
}>;
export declare const statusLogSelect: {
    readonly id: true;
    readonly fromStatusId: true;
    readonly toStatusId: true;
    readonly durationInPrevious: true;
    readonly byUserId: true;
    readonly at: true;
    readonly byUser: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmStatusLogResponse = Prisma.CrmStatusChangeLogGetPayload<{
    select: typeof statusLogSelect;
}>;
export declare const noteSelect: {
    readonly id: true;
    readonly title: true;
    readonly content: true;
    readonly authorUserId: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmNoteResponse = Prisma.CrmNoteGetPayload<{
    select: typeof noteSelect;
}>;
export declare const taskSelect: {
    readonly id: true;
    readonly title: true;
    readonly description: true;
    readonly priority: true;
    readonly status: true;
    readonly dueAt: true;
    readonly assignedToUserId: true;
    readonly referenceId: true;
    readonly createdAt: true;
    readonly assignedTo: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmTaskResponse = Prisma.CrmTaskGetPayload<{
    select: typeof taskSelect;
}>;
export declare const commentSelect: {
    readonly id: true;
    readonly content: true;
    readonly mentionedUserIds: true;
    readonly authorUserId: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type CrmCommentResponse = Prisma.CrmCommentGetPayload<{
    select: typeof commentSelect;
}>;
