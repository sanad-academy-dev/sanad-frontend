import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ApplyDiscountOn, DocStatus, MarginType, PurchaseInvoiceStatus, TaxAddDeduct, TaxChargeType, TaxRowCategory } from "@/generated/prisma/enums";
import type { PaymentScheduleRow } from "@/server/accounting/sales-invoice/sales-invoice.type";
export { ApplyDiscountOn, DocStatus, MarginType, PurchaseInvoiceStatus, TaxAddDeduct, TaxChargeType, TaxRowCategory, };
/**
 * [P6.1] Types for the ACCOUNTING Purchase Invoice (BRD §7.3) — the AP mirror of
 * sales-invoice.type.ts. Contract C3: the legacy `Expense` screen is untouched; its
 * adapter is a later wiring task. Totals are §8 calculator OUTPUTS only.
 */
export declare const purchaseInvoiceListSelect: {
    readonly id: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly status: true;
    readonly postingDate: true;
    readonly dueDate: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly currencyCode: true;
    readonly billNo: true;
    readonly billDate: true;
    readonly onHold: true;
    readonly releaseDate: true;
    readonly isPaid: true;
    readonly isReturn: true;
    readonly returnAgainstId: true;
    readonly grandTotal: true;
    readonly roundedTotal: true;
    readonly disableRoundedTotal: true;
    readonly outstandingAmount: true;
    readonly createdAt: true;
};
export type PurchaseInvoiceListPayload = Prisma.PurchaseInvoiceGetPayload<{
    select: typeof purchaseInvoiceListSelect;
}>;
export type PurchaseInvoiceListRow = PurchaseInvoiceListPayload & {
    partyName: string | null;
};
export declare const purchaseInvoiceItemSelect: {
    readonly id: true;
    readonly idx: true;
    readonly itemCode: true;
    readonly itemName: true;
    readonly description: true;
    readonly qty: true;
    readonly uom: true;
    readonly conversionFactor: true;
    readonly priceListRate: true;
    readonly marginType: true;
    readonly marginRateOrAmount: true;
    readonly discountPercentage: true;
    readonly discountAmount: true;
    readonly rate: true;
    readonly amount: true;
    readonly netRate: true;
    readonly netAmount: true;
    readonly isFreeItem: true;
    readonly expenseAccountId: true;
    readonly costCenterId: true;
    readonly itemTaxTemplateId: true;
    readonly itemTaxRates: true;
    readonly projectId: true;
    readonly expenseAccount: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
    readonly costCenter: {
        readonly select: {
            readonly costCenterName: true;
        };
    };
    readonly itemTaxTemplate: {
        readonly select: {
            readonly title: true;
        };
    };
};
export declare const purchaseInvoiceTaxSelect: {
    readonly id: true;
    readonly idx: true;
    readonly chargeType: true;
    readonly accountHeadId: true;
    readonly rate: true;
    readonly taxAmount: true;
    readonly taxAmountAfterDiscountAmount: true;
    readonly total: true;
    readonly rowId: true;
    readonly description: true;
    readonly includedInPrintRate: true;
    readonly costCenterId: true;
    readonly category: true;
    readonly addDeductTax: true;
    readonly accountHead: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
};
export declare const purchaseInvoiceSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly status: true;
    readonly amendedFromId: true;
    readonly postingDate: true;
    readonly dueDate: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly currencyCode: true;
    readonly conversionRate: true;
    readonly creditToId: true;
    readonly partyAccountCurrencyCode: true;
    readonly billNo: true;
    readonly billDate: true;
    readonly onHold: true;
    readonly releaseDate: true;
    readonly holdComment: true;
    readonly isPaid: true;
    readonly modeOfPaymentId: true;
    readonly cashBankAccountId: true;
    readonly paidAmount: true;
    readonly isReturn: true;
    readonly returnAgainstId: true;
    readonly updateOutstandingForSelf: true;
    readonly isOpening: true;
    readonly isInternalSupplier: true;
    readonly unrealizedProfitLossAccountId: true;
    readonly taxesAndChargesTemplateId: true;
    readonly taxCategoryId: true;
    readonly applyDiscountOn: true;
    readonly additionalDiscountPercentage: true;
    readonly discountAmount: true;
    readonly isCashOrNonTradeDiscount: true;
    readonly additionalDiscountAccountId: true;
    readonly total: true;
    readonly netTotal: true;
    readonly totalTaxesAndCharges: true;
    readonly grandTotal: true;
    readonly roundingAdjustment: true;
    readonly roundedTotal: true;
    readonly disableRoundedTotal: true;
    readonly inWords: true;
    readonly outstandingAmount: true;
    readonly totalAdvance: true;
    readonly applyTds: true;
    readonly taxWithholdingCategoryId: true;
    readonly taxWithholdingAmount: true;
    readonly writeOffAmount: true;
    readonly writeOffAccountId: true;
    readonly writeOffCostCenterId: true;
    readonly paymentTermsTemplateId: true;
    readonly ignoreDefaultPaymentTermsTemplate: true;
    readonly costCenterId: true;
    readonly projectId: true;
    readonly remarks: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly clinic: {
        readonly select: {
            readonly name: true;
        };
    };
    readonly creditTo: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
    readonly cashBankAccount: {
        readonly select: {
            readonly accountName: true;
        };
    };
    readonly taxesAndChargesTemplate: {
        readonly select: {
            readonly title: true;
        };
    };
    readonly paymentTermsTemplate: {
        readonly select: {
            readonly templateName: true;
        };
    };
    readonly returnAgainst: {
        readonly select: {
            readonly documentNo: true;
        };
    };
    readonly items: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly itemCode: true;
            readonly itemName: true;
            readonly description: true;
            readonly qty: true;
            readonly uom: true;
            readonly conversionFactor: true;
            readonly priceListRate: true;
            readonly marginType: true;
            readonly marginRateOrAmount: true;
            readonly discountPercentage: true;
            readonly discountAmount: true;
            readonly rate: true;
            readonly amount: true;
            readonly netRate: true;
            readonly netAmount: true;
            readonly isFreeItem: true;
            readonly expenseAccountId: true;
            readonly costCenterId: true;
            readonly itemTaxTemplateId: true;
            readonly itemTaxRates: true;
            readonly projectId: true;
            readonly expenseAccount: {
                readonly select: {
                    readonly accountName: true;
                    readonly accountNumber: true;
                };
            };
            readonly costCenter: {
                readonly select: {
                    readonly costCenterName: true;
                };
            };
            readonly itemTaxTemplate: {
                readonly select: {
                    readonly title: true;
                };
            };
        };
    };
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
            readonly taxAmountAfterDiscountAmount: true;
            readonly total: true;
            readonly rowId: true;
            readonly description: true;
            readonly includedInPrintRate: true;
            readonly costCenterId: true;
            readonly category: true;
            readonly addDeductTax: true;
            readonly accountHead: {
                readonly select: {
                    readonly accountName: true;
                    readonly accountNumber: true;
                };
            };
        };
    };
    readonly advances: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly referenceType: true;
            readonly referenceId: true;
            readonly advanceAmount: true;
            readonly allocatedAmount: true;
            readonly refExchangeRate: true;
            readonly exchangeGainLoss: true;
            readonly exchangeGainLossJeId: true;
        };
    };
};
export type PurchaseInvoicePayload = Prisma.PurchaseInvoiceGetPayload<{
    select: typeof purchaseInvoiceSelect;
}>;
/** full document = payload + polymorphic schedule + resolved supplier name */
export type PurchaseInvoiceResponse = PurchaseInvoicePayload & {
    partyName: string | null;
    schedule: PaymentScheduleRow[];
};
export declare const purchaseInvoiceItemSchema: z.ZodObject<{
    itemCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    itemName: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    qty: z.ZodString;
    uom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priceListRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    marginType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly PERCENTAGE: "PERCENTAGE";
        readonly AMOUNT: "AMOUNT";
    }>>>;
    marginRateOrAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountPercentage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rate: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isFreeItem: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    expenseAccountId: z.ZodString;
    costCenterId: z.ZodString;
    itemTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    projectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const purchaseInvoiceTaxRowSchema: z.ZodObject<{
    chargeType: z.ZodEnum<{
        readonly ACTUAL: "ACTUAL";
        readonly ON_NET_TOTAL: "ON_NET_TOTAL";
        readonly ON_PREVIOUS_ROW_AMOUNT: "ON_PREVIOUS_ROW_AMOUNT";
        readonly ON_PREVIOUS_ROW_TOTAL: "ON_PREVIOUS_ROW_TOTAL";
        readonly ON_ITEM_QUANTITY: "ON_ITEM_QUANTITY";
    }>;
    accountHeadId: z.ZodString;
    rate: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    taxAmount: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    rowId: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    description: z.ZodString;
    includedInPrintRate: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    category: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly TOTAL: "TOTAL";
        readonly VALUATION: "VALUATION";
        readonly VALUATION_AND_TOTAL: "VALUATION_AND_TOTAL";
    }>>>;
    addDeductTax: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly ADD: "ADD";
        readonly DEDUCT: "DEDUCT";
    }>>>;
}, z.core.$strip>;
export declare const paymentScheduleRowSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodString;
    invoicePortion: z.ZodString;
    paymentAmount: z.ZodString;
    modeOfPaymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const createPurchaseInvoiceSchema: z.ZodObject<{
    postingDate: z.ZodString;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    currencyCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversionRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyType: z.ZodDefault<z.ZodString>;
    partyId: z.ZodString;
    creditToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    billNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    billDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isPaid: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    modeOfPaymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cashBankAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    paidAmount: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isReturn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    returnAgainstId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updateOutstandingForSelf: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    isOpening: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    taxesAndChargesTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    taxCategoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    applyDiscountOn: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly GRAND_TOTAL: "GRAND_TOTAL";
        readonly NET_TOTAL: "NET_TOTAL";
    }>>>;
    additionalDiscountPercentage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    discountAmount: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    isCashOrNonTradeDiscount: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    additionalDiscountAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    disableRoundedTotal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    applyTds: z.ZodOptional<z.ZodBoolean>;
    taxWithholdingCategoryId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    writeOffAmount: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    writeOffAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    writeOffCostCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    paymentTermsTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ignoreDefaultPaymentTermsTemplate: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    projectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    remarks: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        itemCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        itemName: z.ZodString;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        qty: z.ZodString;
        uom: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceListRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        marginType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            readonly PERCENTAGE: "PERCENTAGE";
            readonly AMOUNT: "AMOUNT";
        }>>>;
        marginRateOrAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        discountPercentage: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        discountAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rate: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        isFreeItem: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        expenseAccountId: z.ZodString;
        costCenterId: z.ZodString;
        itemTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        projectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
    taxes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        chargeType: z.ZodEnum<{
            readonly ACTUAL: "ACTUAL";
            readonly ON_NET_TOTAL: "ON_NET_TOTAL";
            readonly ON_PREVIOUS_ROW_AMOUNT: "ON_PREVIOUS_ROW_AMOUNT";
            readonly ON_PREVIOUS_ROW_TOTAL: "ON_PREVIOUS_ROW_TOTAL";
            readonly ON_ITEM_QUANTITY: "ON_ITEM_QUANTITY";
        }>;
        accountHeadId: z.ZodString;
        rate: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        taxAmount: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        rowId: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        description: z.ZodString;
        includedInPrintRate: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        category: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            readonly TOTAL: "TOTAL";
            readonly VALUATION: "VALUATION";
            readonly VALUATION_AND_TOTAL: "VALUATION_AND_TOTAL";
        }>>>;
        addDeductTax: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            readonly ADD: "ADD";
            readonly DEDUCT: "DEDUCT";
        }>>>;
    }, z.core.$strip>>>>;
    schedule: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dueDate: z.ZodString;
        invoicePortion: z.ZodString;
        paymentAmount: z.ZodString;
        modeOfPaymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>>;
    allocateAdvancesAutomatically: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    advances: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        referenceType: z.ZodEnum<{
            journal_entry: "journal_entry";
            payment_entry: "payment_entry";
        }>;
        referenceId: z.ZodString;
        allocatedAmount: z.ZodString;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
/** [P6.3] BR-7.3.2 — hold is a flag on a SUBMITTED invoice, never a status. */
export declare const holdPurchaseInvoiceSchema: z.ZodObject<{
    holdComment: z.ZodString;
    releaseDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type HoldPurchaseInvoiceFormInput = z.infer<typeof holdPurchaseInvoiceSchema>;
export type CreatePurchaseInvoiceFormInput = z.input<typeof createPurchaseInvoiceSchema>;
export type CreatePurchaseInvoiceFormValues = z.output<typeof createPurchaseInvoiceSchema>;
export type PurchaseInvoiceItemInput = z.output<typeof purchaseInvoiceItemSchema>;
export type PurchaseInvoiceTaxRowInput = z.output<typeof purchaseInvoiceTaxRowSchema>;
export type CreatePurchaseInvoiceInput = CreatePurchaseInvoiceFormValues & {
    clinicId: string;
    createdById?: string | null;
};
export type ListPurchaseInvoiceFilter = {
    docstatus?: DocStatus;
    status?: PurchaseInvoiceStatus;
    partyId?: string;
    fromDate?: string;
    toDate?: string;
    isReturn?: boolean;
    onHold?: boolean;
    limit?: number;
};
