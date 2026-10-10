/** [CRM-P3] استعلامات Prisma فقط (NFR-3). */
export declare const crmEmailDao: {
    readonly templates: (clinicId: string, includeInactive: boolean) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        name: string;
        subject: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        body: string;
    }[]>;
    readonly templateById: (clinicId: string, id: string) => import("../../../../generated/prisma/models").Prisma__CrmEmailTemplateClient<{
        name: string;
        subject: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        active: boolean;
        body: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
