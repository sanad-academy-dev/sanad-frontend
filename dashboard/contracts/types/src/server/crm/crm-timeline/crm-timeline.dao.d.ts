import type { CrmReferenceType } from "@/generated/prisma/enums";
/**
 * [CRM-P3] §8.3 — استعلامات الخيط الزمني فقط (NFR-3).
 *
 * كل مصدرٍ يُجلب منه `limit + 1` صفًّا بحدٍّ أقصى ومقيَّدًا بالمؤشّر، فالكلفة محدودة بعدد
 * الأنواع لا بطول التاريخ. الدمج نفسه خالصٌ في `.rules.ts`.
 */
type Args = {
    clinicId: string;
    referenceType: CrmReferenceType;
    referenceId: string;
    take: number;
    /** الحدّ الأعلى للوقت: `lte` لا `lt`، فصفوف اللحظة نفسها لا تُقصّ قبل الدمج. */
    before: Date | null;
};
export declare const crmTimelineDao: {
    readonly statusLog: (args: Args) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    readonly notes: (args: Args) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    readonly tasks: (args: Args) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        priority: import("@/generated/prisma/enums").CrmTaskPriority;
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        status: import("@/generated/prisma/enums").CrmTaskStatus;
        referenceId: string;
        assignedTo: {
            name: string;
            id: string;
        } | null;
        dueAt: Date | null;
        assignedToUserId: string | null;
    }[]>;
    readonly comments: (args: Args) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    readonly emails: (args: Args) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        subject: string;
        replyTo: string | null;
        id: string;
        templateId: string | null;
        status: import("@/generated/prisma/enums").CrmEmailStatus;
        body: string;
        failureReason: string | null;
        sentBy: {
            name: string;
            id: string;
        } | null;
        toAddress: string;
        sentAt: Date;
    }[]>;
    readonly whatsapp: (args: Args) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        at: Date;
        id: string;
        status: import("@/generated/prisma/enums").CrmWhatsappStatus | null;
        body: string;
        direction: import("@/generated/prisma/enums").CrmWhatsappDirection;
        failureReason: string | null;
        chatId: string;
        sentBy: {
            name: string;
            id: string;
        } | null;
    }[]>;
    /** §2 — أسماء المراحل: السجلّ يخزّن معرّفات، والاسم يُحَلّ هنا لا في المتصفّح. */
    readonly statusNames: (clinicId: string, referenceType: CrmReferenceType) => Promise<Map<string, string>>;
};
export {};
