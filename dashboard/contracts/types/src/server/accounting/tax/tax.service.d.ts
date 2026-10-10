import { type CreateItemTaxTemplateFormValues, type CreateTaxCategoryFormValues, type CreateTaxRuleFormValues, type CreateTaxTemplateFormValues } from "@/server/accounting/tax/tax.type";
export declare function createSalesTaxTemplate(clinicId: string, input: CreateTaxTemplateFormValues): Promise<{
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
}>;
export declare function updateSalesTaxTemplate(clinicId: string, id: string, input: CreateTaxTemplateFormValues): Promise<{
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
}>;
export declare function deleteSalesTaxTemplate(clinicId: string, id: string): Promise<void>;
export declare function createPurchaseTaxTemplate(clinicId: string, input: CreateTaxTemplateFormValues): Promise<{
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
}>;
export declare function updatePurchaseTaxTemplate(clinicId: string, id: string, input: CreateTaxTemplateFormValues): Promise<{
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
}>;
export declare function deletePurchaseTaxTemplate(clinicId: string, id: string): Promise<void>;
export declare function createItemTaxTemplate(clinicId: string, input: CreateItemTaxTemplateFormValues): Promise<{
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
}>;
export declare function updateItemTaxTemplate(clinicId: string, id: string, input: CreateItemTaxTemplateFormValues): Promise<{
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
}>;
export declare function deleteItemTaxTemplate(clinicId: string, id: string): Promise<void>;
export declare function createTaxCategory(clinicId: string, input: CreateTaxCategoryFormValues): Promise<{
    id: string;
    clinicId: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
}>;
export declare function deleteTaxCategory(clinicId: string, id: string): Promise<void>;
export declare function createTaxRule(clinicId: string, input: CreateTaxRuleFormValues): Promise<{
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
}>;
export declare function deleteTaxRule(clinicId: string, id: string): Promise<void>;
/** §4.11 — resolve the template a document should use, by best-matching rule. */
export declare function resolveTaxTemplate(params: {
    clinicId: string;
    taxType: "SALES" | "PURCHASE";
    partyType?: string | null;
    partyId?: string | null;
    itemId?: string | null;
    itemCategory?: string | null;
    taxCategoryId?: string | null;
    date: Date;
}): Promise<{
    templateId: string | null;
    ruleId: string | null;
}>;
