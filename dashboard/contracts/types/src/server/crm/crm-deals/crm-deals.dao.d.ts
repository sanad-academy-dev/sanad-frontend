import type { Prisma } from "@/generated/prisma/client";
/** [CRM-P2] استعلامات Prisma فقط (NFR-3). */
export type DealListFilters = {
    statusId?: string;
    sourceId?: string;
    ownerUserId?: string;
    search?: string;
    from?: Date;
    to?: Date;
    /** §12 — التوقّع يُقرأ بشهر الإغلاق المتوقّع لا بتاريخ الإنشاء. */
    closingFrom?: Date;
    closingTo?: Date;
};
export declare const crmDealsDao: {
    readonly list: (clinicId: string, filters: DealListFilters) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        email: string | null;
        city: string | null;
        code: string;
        status: {
            name: string;
            id: string;
            order: number;
            kind: import("@/generated/prisma/client").CrmDealStatusKind;
            color: string;
        };
        sourceId: string | null;
        ownerId: string | null;
        source: {
            name: string;
            id: string;
        } | null;
        leadId: string | null;
        statusId: string;
        probability: import("@prisma/client-runtime-utils").Decimal;
        expectedCloseDate: Date | null;
        dealValue: import("@prisma/client-runtime-utils").Decimal;
        ownerUserId: string | null;
        mobile: string;
        fullName: string;
        expectedValue: import("@prisma/client-runtime-utils").Decimal;
        closedDate: Date | null;
        wonOwnerId: string | null;
        slaPolicyId: string | null;
        responseBy: Date | null;
        firstRespondedAt: Date | null;
        slaStatus: import("@/generated/prisma/client").CrmSlaStatus | null;
        ownerUser: {
            name: string;
            id: string;
        } | null;
    }[]>;
    readonly byId: (clinicId: string, id: string) => Prisma.Prisma__CrmDealClient<{
        owner: {
            name: string;
            id: string;
            code: string;
        } | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        city: string | null;
        code: string;
        gender: import("@/generated/prisma/client").Gender | null;
        notes: string | null;
        status: {
            name: string;
            id: string;
            order: number;
            kind: import("@/generated/prisma/client").CrmDealStatusKind;
            color: string;
        };
        firstName: string;
        lastName: string | null;
        sourceId: string | null;
        products: {
            id: string;
            qty: import("@prisma/client-runtime-utils").Decimal;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            dealId: string;
            itemId: string | null;
            label: string;
            itemType: import("@/generated/prisma/client").CrmDealProductItemType;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
        }[];
        ownerId: string | null;
        source: {
            name: string;
            id: string;
        } | null;
        leadId: string | null;
        lead: {
            id: string;
            code: string;
            fullName: string;
        } | null;
        petNotes: string | null;
        statusId: string;
        probability: import("@prisma/client-runtime-utils").Decimal;
        expectedCloseDate: Date | null;
        dealValue: import("@prisma/client-runtime-utils").Decimal;
        ownerUserId: string | null;
        mobile: string;
        petSpecies: string | null;
        petCount: number | null;
        lostReasonId: string | null;
        lostNotes: string | null;
        fullName: string;
        expectedValue: import("@prisma/client-runtime-utils").Decimal;
        closedDate: Date | null;
        wonOwnerId: string | null;
        slaPolicyId: string | null;
        responseBy: Date | null;
        firstRespondedAt: Date | null;
        slaStatus: import("@/generated/prisma/client").CrmSlaStatus | null;
        ownerUser: {
            name: string;
            id: string;
        } | null;
        probabilityOverridden: boolean;
        wonOwner: {
            name: string;
            id: string;
            code: string;
        } | null;
        lostReason: {
            name: string;
            id: string;
        } | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    readonly products: (clinicId: string, dealId: string) => Prisma.PrismaPromise<{
        id: string;
        qty: import("@prisma/client-runtime-utils").Decimal;
        lineTotal: import("@prisma/client-runtime-utils").Decimal;
        dealId: string;
        itemId: string | null;
        label: string;
        itemType: import("@/generated/prisma/client").CrmDealProductItemType;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    /**
     * §8.1 — نفس جداول الأنشطة تخدم الصفقة بمجرّد تبديل `referenceType`؛ ولذلك لم تحتج
     * هذه المرحلة إلى هجرة أنشطةٍ ثانية.
     */
    readonly statusLog: (clinicId: string, dealId: string) => Prisma.PrismaPromise<{
        at: Date;
        id: string;
        fromStatusId: string | null;
        toStatusId: string;
        durationInPrevious: number | null;
        byUserId: string | null;
        byUser: {
            name: string;
            id: string;
        } | null;
    }[]>;
    readonly notes: (clinicId: string, dealId: string) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        title: string | null;
        content: string;
        authorUserId: string | null;
        author: {
            name: string;
            id: string;
        } | null;
    }[]>;
    readonly tasks: (clinicId: string, dealId: string) => Prisma.PrismaPromise<{
        priority: import("@/generated/prisma/client").CrmTaskPriority;
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        status: import("@/generated/prisma/client").CrmTaskStatus;
        referenceId: string;
        assignedTo: {
            name: string;
            id: string;
        } | null;
        dueAt: Date | null;
        assignedToUserId: string | null;
    }[]>;
    readonly comments: (clinicId: string, dealId: string) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        content: string;
        authorUserId: string | null;
        author: {
            name: string;
            id: string;
        } | null;
        mentionedUserIds: string[];
    }[]>;
};
