export declare const financeBookDao: {
    list(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        financeBookName: string;
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__FinanceBookClient<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        financeBookName: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
