import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
export declare const inboxItemSelect: {
    reads: {
        select: {
            id: true;
        };
    };
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
            animalType: {
                select: {
                    arName: true;
                    enName: true;
                };
            };
        };
    };
    owner: {
        select: {
            id: true;
            code: true;
            name: true;
            phone: true;
        };
    };
    id: true;
    kind: true;
    type: true;
    title: true;
    importance: true;
    status: true;
    approvalStatus: true;
    appointmentId: true;
    taskId: true;
    conversationId: true;
    createdAt: true;
};
export type InboxItemRow = Prisma.InboxItemGetPayload<{
    select: typeof inboxItemSelect;
}>;
export declare const inboxActivitySelect: {
    id: true;
    itemId: true;
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
export type InboxActivityResponse = Prisma.InboxActivityGetPayload<{
    select: typeof inboxActivitySelect;
}>;
export declare const inboxDetailSelect: {
    activity: {
        select: {
            id: true;
            itemId: true;
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
        orderBy: {
            createdAt: "desc";
        };
    };
    reads: {
        select: {
            id: true;
        };
    };
    patient: {
        select: {
            id: true;
            code: true;
            name: true;
            animalType: {
                select: {
                    arName: true;
                    enName: true;
                };
            };
        };
    };
    owner: {
        select: {
            id: true;
            code: true;
            name: true;
            phone: true;
        };
    };
    id: true;
    kind: true;
    type: true;
    title: true;
    importance: true;
    status: true;
    approvalStatus: true;
    appointmentId: true;
    taskId: true;
    conversationId: true;
    createdAt: true;
};
export type InboxDetailResponse = Prisma.InboxItemGetPayload<{
    select: typeof inboxDetailSelect;
}>;
export type InboxItemResponse = Omit<InboxItemRow, "reads"> & {
    read: boolean;
};
export type InboxItemDetailResponse = Omit<InboxDetailResponse, "reads"> & {
    read: boolean;
};
export declare const inboxPushSelect: {
    id: true;
    clinicId: true;
    kind: true;
    type: true;
    importance: true;
    title: true;
    recipientUserId: true;
    appointmentId: true;
    taskId: true;
    createdAt: true;
};
export type InboxPushRow = Prisma.InboxItemGetPayload<{
    select: typeof inboxPushSelect;
}>;
export type InboxPushPayload = Omit<InboxPushRow, "createdAt"> & {
    createdAt: string;
};
export type CreateInboxItemInput = Pick<Prisma.InboxItemUncheckedCreateInput, "clinicId" | "kind" | "type" | "title"> & Partial<Pick<Prisma.InboxItemUncheckedCreateInput, "importance" | "status" | "approvalStatus" | "patientId" | "ownerId" | "staffId" | "appointmentId" | "taskId" | "conversationId" | "operationId" | "leadId" | "dealId" | "inpatientStayId" | "recipientUserId" | "createdById" | "createdAt">>;
export type ApprovalActionInput = {
    comment?: string;
    reason?: string;
};
export type InboxDeleteScope = "all" | "read" | "completed";
export type InboxSortOption = "newest" | "oldest" | "importance";
export type InboxListFilters = {
    kind: Prisma.InboxItemGetPayload<{
        select: {
            kind: true;
        };
    }>["kind"];
    type?: InboxItemRow["type"];
    sort?: InboxSortOption;
    showRead?: boolean;
    showUnread?: boolean;
};
export declare const addCommentSchema: z.ZodObject<{
    comment: z.ZodString;
}, z.core.$strip>;
export type AddCommentFormInput = z.infer<typeof addCommentSchema>;
export declare const approvalActionSchema: z.ZodObject<{
    comment: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ApprovalActionFormInput = z.infer<typeof approvalActionSchema>;
