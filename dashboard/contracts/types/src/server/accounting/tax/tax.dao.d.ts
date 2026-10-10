/** [P4.1] Prisma reads for the §4.11 masters. */
export declare const taxDao: {
    listSalesTemplates(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isDefault: boolean;
        taxCategoryId: string | null;
        taxes: {
            id: string;
            description: string;
            idx: number;
            chargeType: import("@/server/accounting/tax/tax.type").TaxChargeType;
            rate: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            rowId: number | null;
            includedInPrintRate: boolean;
            accountHead: {
                accountName: string;
            };
            accountHeadId: string;
            costCenterId: string | null;
        }[];
    }[]>;
    listPurchaseTemplates(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        isDefault: boolean;
        taxCategoryId: string | null;
        taxes: {
            id: string;
            description: string;
            idx: number;
            chargeType: import("@/server/accounting/tax/tax.type").TaxChargeType;
            rate: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            rowId: number | null;
            includedInPrintRate: boolean;
            accountHead: {
                accountName: string;
            };
            accountHeadId: string;
            costCenterId: string | null;
            category: import("@/server/accounting/tax/tax.type").TaxRowCategory;
            addDeductTax: import("@/server/accounting/tax/tax.type").TaxAddDeduct;
        }[];
    }[]>;
    listItemTemplates(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        rows: {
            id: string;
            taxRate: import("@prisma/client-runtime-utils").Decimal;
            taxTypeAccountId: string;
            taxType: {
                accountName: string;
            };
        }[];
    }[]>;
    listCategories(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
    }[]>;
    listRules(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        priority: number;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        taxCategoryId: string | null;
        partyType: string | null;
        partyId: string | null;
        fromDate: Date | null;
        toDate: Date | null;
        itemId: string | null;
        taxType: string;
        salesTaxTemplateId: string | null;
        purchaseTaxTemplateId: string | null;
        itemCategory: string | null;
        salesTemplate: {
            title: string;
        } | null;
        purchaseTemplate: {
            title: string;
        } | null;
    }[]>;
};
