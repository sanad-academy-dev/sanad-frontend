import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ApplyDiscountOn, DocStatus, MarginType, SalesInvoiceStatus, TaxChargeType } from "@/generated/prisma/enums";
export { ApplyDiscountOn, DocStatus, MarginType, SalesInvoiceStatus, TaxChargeType };
/**
 * [P5.1] Types for the ACCOUNTING Sales Invoice (BRD §7.2). Contract C3: this voucher is
 * NOT the clinic's operational `Invoice` — the legacy screen keeps its table and numbering;
 * an adapter posts it into this ledger in a later wiring task.
 *
 * Totals on these types are §8 calculator OUTPUTS (tax-calculator.ts). No caller may
 * compute them locally — the service recalculates on every save and the values here are
 * snapshots of that one source of truth.
 */
export declare const salesInvoiceListSelect: {
    readonly id: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly status: true;
    readonly postingDate: true;
    readonly dueDate: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly currencyCode: true;
    readonly isReturn: true;
    readonly returnAgainstId: true;
    readonly grandTotal: true;
    readonly roundedTotal: true;
    readonly disableRoundedTotal: true;
    readonly outstandingAmount: true;
    readonly createdAt: true;
};
export type SalesInvoiceListPayload = Prisma.SalesInvoiceGetPayload<{
    select: typeof salesInvoiceListSelect;
}>;
/** list rows carry the resolved party display name (service joins the party master) */
export type SalesInvoiceListRow = SalesInvoiceListPayload & {
    partyName: string | null;
};
export declare const salesInvoiceItemSelect: {
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
    readonly incomeAccountId: true;
    readonly costCenterId: true;
    readonly discountAccountId: true;
    readonly itemTaxTemplateId: true;
    readonly itemTaxRates: true;
    readonly projectId: true;
    readonly enableDeferredRevenue: true;
    readonly deferredAccountId: true;
    readonly serviceStartDate: true;
    readonly serviceEndDate: true;
    readonly serviceStopDate: true;
    readonly incomeAccount: {
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
export declare const salesInvoiceTaxSelect: {
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
    readonly accountHead: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
        };
    };
};
export declare const salesInvoiceSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly status: true;
    readonly amendedFromId: true;
    readonly postingDate: true;
    readonly postingTime: true;
    readonly setPostingTime: true;
    readonly dueDate: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly currencyCode: true;
    readonly conversionRate: true;
    readonly debitToId: true;
    readonly partyAccountCurrencyCode: true;
    readonly isReturn: true;
    readonly returnAgainstId: true;
    readonly updateOutstandingForSelf: true;
    readonly isOpening: true;
    readonly isInternalCustomer: true;
    readonly unrealizedProfitLossAccountId: true;
    readonly poNo: true;
    readonly poDate: true;
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
    readonly debitTo: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
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
            readonly incomeAccountId: true;
            readonly costCenterId: true;
            readonly discountAccountId: true;
            readonly itemTaxTemplateId: true;
            readonly itemTaxRates: true;
            readonly projectId: true;
            readonly enableDeferredRevenue: true;
            readonly deferredAccountId: true;
            readonly serviceStartDate: true;
            readonly serviceEndDate: true;
            readonly serviceStopDate: true;
            readonly incomeAccount: {
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
export type SalesInvoicePayload = Prisma.SalesInvoiceGetPayload<{
    select: typeof salesInvoiceSelect;
}>;
export declare const paymentScheduleSelect: {
    readonly id: true;
    readonly idx: true;
    readonly paymentTermId: true;
    readonly description: true;
    readonly dueDate: true;
    readonly invoicePortion: true;
    readonly paymentAmount: true;
    readonly outstanding: true;
    readonly discountType: true;
    readonly discount: true;
    readonly discountDate: true;
    readonly modeOfPaymentId: true;
};
export type PaymentScheduleRow = Prisma.PaymentScheduleGetPayload<{
    select: typeof paymentScheduleSelect;
}>;
/** full document = invoice payload + its polymorphic schedule + resolved party name */
export type SalesInvoiceResponse = SalesInvoicePayload & {
    partyName: string | null;
    schedule: PaymentScheduleRow[];
};
export declare const salesInvoiceItemSchema: z.ZodObject<{
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
    incomeAccountId: z.ZodString;
    costCenterId: z.ZodString;
    discountAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    itemTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    projectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enableDeferredRevenue: z.ZodOptional<z.ZodBoolean>;
    deferredAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serviceStartDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serviceEndDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    serviceStopDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const salesInvoiceTaxRowSchema: z.ZodObject<{
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
}, z.core.$strip>;
export declare const paymentScheduleRowSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodString;
    invoicePortion: z.ZodString;
    paymentAmount: z.ZodString;
    modeOfPaymentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** [P7.5] FR-11.1 — one advance row: an open PE/JE credit consumed by this invoice */
export declare const invoiceAdvanceRowSchema: z.ZodObject<{
    referenceType: z.ZodEnum<{
        journal_entry: "journal_entry";
        payment_entry: "payment_entry";
    }>;
    referenceId: z.ZodString;
    allocatedAmount: z.ZodString;
}, z.core.$strip>;
export declare const createSalesInvoiceSchema: z.ZodObject<{
    postingDate: z.ZodString;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    currencyCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversionRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyType: z.ZodDefault<z.ZodString>;
    partyId: z.ZodString;
    debitToId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isReturn: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    returnAgainstId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updateOutstandingForSelf: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    isOpening: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    poNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    poDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
        incomeAccountId: z.ZodString;
        costCenterId: z.ZodString;
        discountAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        itemTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        projectId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        enableDeferredRevenue: z.ZodOptional<z.ZodBoolean>;
        deferredAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        serviceStartDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        serviceEndDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        serviceStopDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
export type CreateSalesInvoiceFormInput = z.input<typeof createSalesInvoiceSchema>;
export type CreateSalesInvoiceFormValues = z.output<typeof createSalesInvoiceSchema>;
export type SalesInvoiceItemInput = z.output<typeof salesInvoiceItemSchema>;
export type SalesInvoiceTaxRowInput = z.output<typeof salesInvoiceTaxRowSchema>;
export type PaymentScheduleRowInput = z.output<typeof paymentScheduleRowSchema>;
export type CreateSalesInvoiceInput = CreateSalesInvoiceFormValues & {
    clinicId: string;
    createdById?: string | null;
};
export type ListSalesInvoiceFilter = {
    docstatus?: DocStatus;
    status?: SalesInvoiceStatus;
    partyId?: string;
    fromDate?: string;
    toDate?: string;
    isReturn?: boolean;
    limit?: number;
};
