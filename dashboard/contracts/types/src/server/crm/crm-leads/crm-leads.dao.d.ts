import type { Prisma } from "@/generated/prisma/client";
/** [CRM-P1] استعلامات Prisma فقط (NFR-3). */
export type LeadListFilters = {
    statusId?: string;
    /** BR-C3.5 — «المحوَّل» خارج القائمة الافتراضية؛ يُطلَب صراحةً حين يُراد. */
    includeConverted?: boolean;
    sourceId?: string;
    ownerUserId?: string;
    search?: string;
    from?: Date;
    to?: Date;
};
export declare const crmLeadsDao: {
    readonly list: (clinicId: string, filters: LeadListFilters) => Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        email: string | null;
        city: string | null;
        code: string;
        status: {
            name: string;
            id: string;
            order: number;
            kind: import("@/generated/prisma/client").CrmLeadStatusKind;
            color: string;
        };
        sourceId: string | null;
        source: {
            name: string;
            id: string;
        } | null;
        statusId: string;
        ownerUserId: string | null;
        mobile: string;
        fullName: string;
        slaPolicyId: string | null;
        responseBy: Date | null;
        firstRespondedAt: Date | null;
        slaStatus: import("@/generated/prisma/client").CrmSlaStatus | null;
        ownerUser: {
            name: string;
            id: string;
        } | null;
    }[]>;
    readonly byId: (clinicId: string, id: string) => Prisma.Prisma__CrmLeadClient<{
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
            kind: import("@/generated/prisma/client").CrmLeadStatusKind;
            color: string;
        };
        firstName: string;
        lastName: string | null;
        sourceId: string | null;
        source: {
            name: string;
            id: string;
        } | null;
        petNotes: string | null;
        statusId: string;
        ownerUserId: string | null;
        mobile: string;
        petSpecies: string | null;
        petCount: number | null;
        lostReasonId: string | null;
        lostNotes: string | null;
        fullName: string;
        slaPolicyId: string | null;
        responseBy: Date | null;
        firstRespondedAt: Date | null;
        slaStatus: import("@/generated/prisma/client").CrmSlaStatus | null;
        ownerUser: {
            name: string;
            id: string;
        } | null;
        lostReason: {
            name: string;
            id: string;
        } | null;
        convertedDealId: string | null;
        convertedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    readonly statusLog: (clinicId: string, leadId: string) => Prisma.PrismaPromise<{
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
    /**
     * §8.4 — أنشطة المستند المحذوف تختفي معه ولا تتيتّم في خيطٍ زمني آخر: كل قراءة هنا
     * مقيَّدة بـ(النوع، المعرّف) وبـ`isDeleted: false` على النشاط نفسه.
     */
    readonly notes: (clinicId: string, leadId: string) => Prisma.PrismaPromise<{
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
    readonly tasks: (clinicId: string, leadId: string) => Prisma.PrismaPromise<{
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
    readonly comments: (clinicId: string, leadId: string) => Prisma.PrismaPromise<{
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
    /** صفحة «المهام»: مهامّي أو كل مهامّ الأكاديمية، حسب سلطة القارئ. */
    readonly taskInbox: (clinicId: string, assignedToUserId?: string) => Prisma.PrismaPromise<{
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
};
