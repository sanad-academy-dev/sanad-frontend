export declare const fiscalYearDao: {
    list(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        year: string;
        yearStartDate: Date;
        yearEndDate: Date;
        isShortYear: boolean;
        disabled: boolean;
        autoCreated: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__FiscalYearClient<{
        id: string;
        clinicId: string;
        year: string;
        yearStartDate: Date;
        yearEndDate: Date;
        isShortYear: boolean;
        disabled: boolean;
        autoCreated: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
