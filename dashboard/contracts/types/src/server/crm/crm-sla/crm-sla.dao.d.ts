/**
 * `filters` مُصرَّحٌ بها `InputJsonObject`: مُخطَّط Zod يصفها `Record<string, unknown>`
 * لأنّ شكل المرشّحات يتبع شاشته، و`unknown` لا تنطبق على نوع Prisma للـJSON. التصريح عند
 * الحدّ لا في المُخطَّط: التحقّق يبقى مكانه، والنوع يُضبط حيث يُكتب الصفّ.
 */
import type { Prisma } from "@/generated/prisma/client";
import { type CrmSavedViewFormInput, type CrmSlaPolicyFormInput } from "@/server/crm/crm-sla/crm-sla.type";
/** [CRM-P5] استعلامات فقط — لا منطق أعمال (AGENTS.md). */
export declare const crmSlaDao: {
    listPolicies: (clinicId: string, includeInactive: boolean) => Prisma.PrismaPromise<{
        name: string;
        id: string;
        createdAt: Date;
        order: number;
        isActive: boolean;
        sources: {
            id: string;
            sourceId: string;
            source: {
                name: string;
                id: string;
            };
            firstResponseMinutes: number | null;
        }[];
        firstResponseMinutes: number;
        appliesTo: import("@/generated/prisma/client").CrmSlaAppliesTo;
    }[]>;
    findPolicy: (clinicId: string, id: string) => Prisma.Prisma__CrmSlaPolicyClient<{
        name: string;
        id: string;
        createdAt: Date;
        order: number;
        isActive: boolean;
        sources: {
            id: string;
            sourceId: string;
            source: {
                name: string;
                id: string;
            };
            firstResponseMinutes: number | null;
        }[];
        firstResponseMinutes: number;
        appliesTo: import("@/generated/prisma/client").CrmSlaAppliesTo;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createPolicy: (clinicId: string, input: CrmSlaPolicyFormInput) => Prisma.Prisma__CrmSlaPolicyClient<{
        name: string;
        id: string;
        createdAt: Date;
        order: number;
        isActive: boolean;
        sources: {
            id: string;
            sourceId: string;
            source: {
                name: string;
                id: string;
            };
            firstResponseMinutes: number | null;
        }[];
        firstResponseMinutes: number;
        appliesTo: import("@/generated/prisma/client").CrmSlaAppliesTo;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /**
     * التعديل يستبدل صفوف المصادر كاملةً داخل معاملة: الواجهة ترسل القائمة النهائية،
     * والفرق (أُضيف/حُذف/تغيّر تجاوزه) لا يعني الخادم — وحسابه هنا كان سيضيف حالاتٍ
     * بلا فائدة.
     */
    updatePolicy: (clinicId: string, id: string, input: CrmSlaPolicyFormInput) => Promise<{
        name: string;
        id: string;
        createdAt: Date;
        order: number;
        isActive: boolean;
        sources: {
            id: string;
            sourceId: string;
            source: {
                name: string;
                id: string;
            };
            firstResponseMinutes: number | null;
        }[];
        firstResponseMinutes: number;
        appliesTo: import("@/generated/prisma/client").CrmSlaAppliesTo;
    } | null>;
    /** حذفٌ ناعم كبقيّة بيانات §2 المرجعية: سجلّاتٌ قائمة تحمل لقطة هذه السياسة. */
    softDeletePolicy: (clinicId: string, id: string) => Promise<boolean>;
    /**
     * §11.3 — ما يراه المستخدم: عروضه هو، وكلّ عرضٍ منشور في الأكاديمية. المنشور من غيره
     * يظهر للقراءة، وتعديله محكومٌ في المتحكّم لا هنا.
     */
    listViews: (clinicId: string, userId: string, entity?: "LEAD" | "DEAL") => Prisma.PrismaPromise<{
        sort: import("@prisma/client/runtime/client").JsonValue;
        user: {
            name: string;
            id: string;
        };
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        filters: import("@prisma/client/runtime/client").JsonValue;
        entity: import("@/generated/prisma/client").CrmReferenceType;
        visibleColumns: string[];
        layout: import("@/generated/prisma/client").CrmViewLayout;
        isPinned: boolean;
        isPublic: boolean;
    }[]>;
    findView: (clinicId: string, id: string) => Prisma.Prisma__CrmSavedViewClient<{
        sort: import("@prisma/client/runtime/client").JsonValue;
        user: {
            name: string;
            id: string;
        };
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        filters: import("@prisma/client/runtime/client").JsonValue;
        entity: import("@/generated/prisma/client").CrmReferenceType;
        visibleColumns: string[];
        layout: import("@/generated/prisma/client").CrmViewLayout;
        isPinned: boolean;
        isPublic: boolean;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    createView: (clinicId: string, userId: string, input: CrmSavedViewFormInput) => Prisma.Prisma__CrmSavedViewClient<{
        sort: import("@prisma/client/runtime/client").JsonValue;
        user: {
            name: string;
            id: string;
        };
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        filters: import("@prisma/client/runtime/client").JsonValue;
        entity: import("@/generated/prisma/client").CrmReferenceType;
        visibleColumns: string[];
        layout: import("@/generated/prisma/client").CrmViewLayout;
        isPinned: boolean;
        isPublic: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    updateView: (clinicId: string, id: string, input: CrmSavedViewFormInput) => Prisma.Prisma__CrmSavedViewClient<{
        sort: import("@prisma/client/runtime/client").JsonValue;
        user: {
            name: string;
            id: string;
        };
        name: string;
        id: string;
        createdAt: Date;
        userId: string;
        filters: import("@prisma/client/runtime/client").JsonValue;
        entity: import("@/generated/prisma/client").CrmReferenceType;
        visibleColumns: string[];
        layout: import("@/generated/prisma/client").CrmViewLayout;
        isPinned: boolean;
        isPublic: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDeleteView: (clinicId: string, id: string) => Promise<boolean>;
};
