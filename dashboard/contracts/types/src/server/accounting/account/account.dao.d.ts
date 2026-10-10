export declare const accountDao: {
    /** Full chart in tree order (nested-set `lft`). */
    listTree(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        accountName: string;
        accountNumber: string | null;
        parentAccountId: string | null;
        isGroup: boolean;
        rootType: import("../../../../generated/prisma/enums").AccountRootType;
        reportType: import("../../../../generated/prisma/enums").AccountReportType;
        accountType: import("../../../../generated/prisma/enums").AccountType | null;
        accountCurrencyCode: string;
        taxRate: import("@prisma/client-runtime-utils").Decimal | null;
        balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
        freezeAccount: boolean;
        lft: number;
        rgt: number;
    }[]>;
    findById(clinicId: string, id: string): import("../../../../generated/prisma/models").Prisma__LedgerAccountClient<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        accountName: string;
        accountNumber: string | null;
        parentAccountId: string | null;
        isGroup: boolean;
        rootType: import("../../../../generated/prisma/enums").AccountRootType;
        reportType: import("../../../../generated/prisma/enums").AccountReportType;
        accountType: import("../../../../generated/prisma/enums").AccountType | null;
        accountCurrencyCode: string;
        taxRate: import("@prisma/client-runtime-utils").Decimal | null;
        balanceMustBe: import("../../../../generated/prisma/enums").BalanceMustBe;
        freezeAccount: boolean;
        lft: number;
        rgt: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
};
