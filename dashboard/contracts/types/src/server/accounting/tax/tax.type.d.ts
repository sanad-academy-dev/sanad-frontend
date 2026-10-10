import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { TaxAddDeduct, TaxChargeType, TaxRowCategory } from "@/generated/prisma/enums";
/** [P4.1] Types for the §4.11 tax masters. BROWSER-SAFE (no Prisma values). */
export { TaxAddDeduct, TaxChargeType, TaxRowCategory };
export declare const salesTaxTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly title: true;
    readonly isDefault: true;
    readonly disabled: true;
    readonly taxCategoryId: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly taxes: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly chargeType: true;
            readonly accountHeadId: true;
            readonly rate: true;
            readonly taxAmount: true;
            readonly rowId: true;
            readonly description: true;
            readonly includedInPrintRate: true;
            readonly costCenterId: true;
            readonly accountHead: {
                readonly select: {
                    readonly accountName: true;
                };
            };
        };
    };
};
export type SalesTaxTemplateResponse = Prisma.SalesTaxesAndChargesTemplateGetPayload<{
    select: typeof salesTaxTemplateSelect;
}>;
export declare const purchaseTaxTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly title: true;
    readonly isDefault: true;
    readonly disabled: true;
    readonly taxCategoryId: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly taxes: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly category: true;
            readonly addDeductTax: true;
            readonly id: true;
            readonly idx: true;
            readonly chargeType: true;
            readonly accountHeadId: true;
            readonly rate: true;
            readonly taxAmount: true;
            readonly rowId: true;
            readonly description: true;
            readonly includedInPrintRate: true;
            readonly costCenterId: true;
            readonly accountHead: {
                readonly select: {
                    readonly accountName: true;
                };
            };
        };
    };
};
export type PurchaseTaxTemplateResponse = Prisma.PurchaseTaxesAndChargesTemplateGetPayload<{
    select: typeof purchaseTaxTemplateSelect;
}>;
export declare const itemTaxTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly title: true;
    readonly disabled: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly rows: {
        readonly select: {
            readonly id: true;
            readonly taxTypeAccountId: true;
            readonly taxRate: true;
            readonly taxType: {
                readonly select: {
                    readonly accountName: true;
                };
            };
        };
    };
};
export type ItemTaxTemplateResponse = Prisma.ItemTaxTemplateGetPayload<{
    select: typeof itemTaxTemplateSelect;
}>;
export declare const taxCategorySelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly title: true;
    readonly disabled: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type TaxCategoryResponse = Prisma.TaxCategoryGetPayload<{
    select: typeof taxCategorySelect;
}>;
export declare const taxRuleSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly taxType: true;
    readonly salesTaxTemplateId: true;
    readonly purchaseTaxTemplateId: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly itemId: true;
    readonly itemCategory: true;
    readonly taxCategoryId: true;
    readonly fromDate: true;
    readonly toDate: true;
    readonly priority: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly salesTemplate: {
        readonly select: {
            readonly title: true;
        };
    };
    readonly purchaseTemplate: {
        readonly select: {
            readonly title: true;
        };
    };
};
export type TaxRuleResponse = Prisma.TaxRuleGetPayload<{
    select: typeof taxRuleSelect;
}>;
export declare const taxRowSchema: z.ZodObject<{
    chargeType: z.ZodDefault<z.ZodEnum<{
        readonly ACTUAL: "ACTUAL";
        readonly ON_NET_TOTAL: "ON_NET_TOTAL";
        readonly ON_PREVIOUS_ROW_AMOUNT: "ON_PREVIOUS_ROW_AMOUNT";
        readonly ON_PREVIOUS_ROW_TOTAL: "ON_PREVIOUS_ROW_TOTAL";
        readonly ON_ITEM_QUANTITY: "ON_ITEM_QUANTITY";
    }>>;
    accountHeadId: z.ZodString;
    rate: z.ZodDefault<z.ZodString>;
    taxAmount: z.ZodDefault<z.ZodString>;
    rowId: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    description: z.ZodString;
    includedInPrintRate: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category: z.ZodOptional<z.ZodEnum<{
        readonly TOTAL: "TOTAL";
        readonly VALUATION: "VALUATION";
        readonly VALUATION_AND_TOTAL: "VALUATION_AND_TOTAL";
    }>>;
    addDeductTax: z.ZodOptional<z.ZodEnum<{
        readonly ADD: "ADD";
        readonly DEDUCT: "DEDUCT";
    }>>;
}, z.core.$strip>;
export type TaxRowFormValues = z.output<typeof taxRowSchema>;
export declare const createTaxTemplateSchema: z.ZodObject<{
    title: z.ZodString;
    isDefault: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    taxCategoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    taxes: z.ZodArray<z.ZodObject<{
        chargeType: z.ZodDefault<z.ZodEnum<{
            readonly ACTUAL: "ACTUAL";
            readonly ON_NET_TOTAL: "ON_NET_TOTAL";
            readonly ON_PREVIOUS_ROW_AMOUNT: "ON_PREVIOUS_ROW_AMOUNT";
            readonly ON_PREVIOUS_ROW_TOTAL: "ON_PREVIOUS_ROW_TOTAL";
            readonly ON_ITEM_QUANTITY: "ON_ITEM_QUANTITY";
        }>>;
        accountHeadId: z.ZodString;
        rate: z.ZodDefault<z.ZodString>;
        taxAmount: z.ZodDefault<z.ZodString>;
        rowId: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        description: z.ZodString;
        includedInPrintRate: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        category: z.ZodOptional<z.ZodEnum<{
            readonly TOTAL: "TOTAL";
            readonly VALUATION: "VALUATION";
            readonly VALUATION_AND_TOTAL: "VALUATION_AND_TOTAL";
        }>>;
        addDeductTax: z.ZodOptional<z.ZodEnum<{
            readonly ADD: "ADD";
            readonly DEDUCT: "DEDUCT";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateTaxTemplateFormInput = z.input<typeof createTaxTemplateSchema>;
export type CreateTaxTemplateFormValues = z.output<typeof createTaxTemplateSchema>;
export declare const createItemTaxTemplateSchema: z.ZodObject<{
    title: z.ZodString;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    rows: z.ZodArray<z.ZodObject<{
        taxTypeAccountId: z.ZodString;
        taxRate: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateItemTaxTemplateFormInput = z.input<typeof createItemTaxTemplateSchema>;
export type CreateItemTaxTemplateFormValues = z.output<typeof createItemTaxTemplateSchema>;
export declare const createTaxCategorySchema: z.ZodObject<{
    title: z.ZodString;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateTaxCategoryFormValues = z.output<typeof createTaxCategorySchema>;
export declare const createTaxRuleSchema: z.ZodObject<{
    taxType: z.ZodDefault<z.ZodEnum<{
        SALES: "SALES";
        PURCHASE: "PURCHASE";
    }>>;
    salesTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    purchaseTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    itemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    itemCategory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    taxCategoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fromDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    toDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateTaxRuleFormInput = z.input<typeof createTaxRuleSchema>;
export type CreateTaxRuleFormValues = z.output<typeof createTaxRuleSchema>;
