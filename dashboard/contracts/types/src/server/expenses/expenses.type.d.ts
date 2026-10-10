import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { type ExpenseApprovalStepType, type ExpenseAttachmentKind, ExpensePaymentMethod, ExpenseReminderOffset, type ExpenseStatus } from "@/generated/prisma/enums";
export type { ExpenseApprovalStepType, ExpenseAttachmentKind, ExpensePaymentMethod, ExpenseReminderOffset, ExpenseStatus, };
declare const expenseSelect: {
    id: true;
    code: true;
    clinicId: true;
    name: true;
    status: true;
    amount: true;
    source: true;
    sourceId: true;
    expenseDate: true;
    staffId: true;
    paymentMethod: true;
    categoryLabel: true;
    departmentLabel: true;
    branchId: true;
    supplierId: true;
    notes: true;
    reminderEnabled: true;
    reminderOffset: true;
    rejectionReason: true;
    cancelReason: true;
    signed: true;
    signatureName: true;
    decisionAt: true;
    reviewSubject: true;
    reviewBody: true;
    reviewRecipientIds: true;
    reviewSentAt: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    requester: {
        select: {
            id: true;
            name: true;
        };
    };
    decidedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    supplier: {
        select: {
            id: true;
            legalName: true;
        };
    };
    attachments: {
        select: {
            id: true;
            kind: true;
            label: true;
            url: true;
            sizeBytes: true;
            createdAt: true;
        };
    };
    steps: {
        orderBy: {
            order: "asc";
        };
        select: {
            id: true;
            type: true;
            state: true;
            order: true;
            comment: true;
            actedAt: true;
            actor: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export declare const expenseSelectShape: {
    id: true;
    code: true;
    clinicId: true;
    name: true;
    status: true;
    amount: true;
    source: true;
    sourceId: true;
    expenseDate: true;
    staffId: true;
    paymentMethod: true;
    categoryLabel: true;
    departmentLabel: true;
    branchId: true;
    supplierId: true;
    notes: true;
    reminderEnabled: true;
    reminderOffset: true;
    rejectionReason: true;
    cancelReason: true;
    signed: true;
    signatureName: true;
    decisionAt: true;
    reviewSubject: true;
    reviewBody: true;
    reviewRecipientIds: true;
    reviewSentAt: true;
    editsCount: true;
    createdAt: true;
    updatedAt: true;
    requester: {
        select: {
            id: true;
            name: true;
        };
    };
    decidedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    supplier: {
        select: {
            id: true;
            legalName: true;
        };
    };
    attachments: {
        select: {
            id: true;
            kind: true;
            label: true;
            url: true;
            sizeBytes: true;
            createdAt: true;
        };
    };
    steps: {
        orderBy: {
            order: "asc";
        };
        select: {
            id: true;
            type: true;
            state: true;
            order: true;
            comment: true;
            actedAt: true;
            actor: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export type ExpenseResponse = Prisma.ExpenseGetPayload<{
    select: typeof expenseSelect;
}>;
declare const expenseListSelect: {
    id: true;
    code: true;
    name: true;
    status: true;
    amount: true;
    source: true;
    sourceId: true;
    expenseDate: true;
    staffId: true;
    categoryLabel: true;
    departmentLabel: true;
    editsCount: true;
    createdAt: true;
    requester: {
        select: {
            id: true;
            name: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    steps: {
        orderBy: {
            order: "asc";
        };
        select: {
            type: true;
            state: true;
        };
    };
};
export declare const expenseListSelectShape: {
    id: true;
    code: true;
    name: true;
    status: true;
    amount: true;
    source: true;
    sourceId: true;
    expenseDate: true;
    staffId: true;
    categoryLabel: true;
    departmentLabel: true;
    editsCount: true;
    createdAt: true;
    requester: {
        select: {
            id: true;
            name: true;
        };
    };
    branch: {
        select: {
            id: true;
            name: true;
        };
    };
    steps: {
        orderBy: {
            order: "asc";
        };
        select: {
            type: true;
            state: true;
        };
    };
};
export type ExpenseListItemResponse = Prisma.ExpenseGetPayload<{
    select: typeof expenseListSelect;
}>;
export type ExpenseStatsResponse = {
    rejected: number;
    pendingReview: number;
    approved: number;
    total: number;
    totalAmount: number;
};
export type CreateExpenseInput = Pick<Prisma.ExpenseUncheckedCreateInput, "name" | "amount" | "paymentMethod" | "categoryLabel" | "departmentLabel" | "branchId" | "supplierId" | "staffId" | "recoverFromPayroll" | "notes" | "reminderEnabled" | "reminderOffset"> & {
    requesterId?: string | null;
    attachments?: {
        kind: ExpenseAttachmentKind;
        label: string;
        url: string;
        sizeBytes?: number;
    }[];
};
export type UpdateExpenseInput = Partial<CreateExpenseInput>;
export type ExpenseDecision = "approve" | "reject" | "disburse";
export type CancelExpenseInput = Pick<Prisma.ExpenseUncheckedUpdateInput, "cancelReason"> & {
    cancelReason: string;
};
export declare const createExpenseSchema: z.ZodObject<{
    name: z.ZodString;
    requesterId: z.ZodString;
    departmentLabel: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    categoryLabel: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    amount: z.ZodCoercedNumber<unknown>;
    paymentMethod: z.ZodNullable<z.ZodOptional<z.ZodEnum<{
        readonly CASH: "CASH";
        readonly BANK_TRANSFER: "BANK_TRANSFER";
        readonly CARD: "CARD";
        readonly CHEQUE: "CHEQUE";
        readonly TREASURY: "TREASURY";
    }>>>;
    branchId: z.ZodString;
    supplierId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    reminderEnabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    reminderOffset: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly ONE_DAY: "ONE_DAY";
        readonly TWO_DAYS: "TWO_DAYS";
        readonly THREE_DAYS: "THREE_DAYS";
    }>>>;
}, z.core.$strip>;
export type CreateExpenseFormInput = z.input<typeof createExpenseSchema>;
export type CreateExpenseFormValues = z.output<typeof createExpenseSchema>;
