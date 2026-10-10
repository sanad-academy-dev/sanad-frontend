import type { TaxAddDeduct, TaxRowCategory } from "@/generated/prisma/enums";
import { type CalcResult, type CalcTaxRow } from "@/server/accounting/tax/tax-calculator";
/** the §8 pricing surface an invoice item exposes — both SI and PI rows satisfy it */
export type CalcBridgeItem = {
    qty: string;
    rate: string;
    priceListRate?: string | null;
    marginType?: "PERCENTAGE" | "AMOUNT" | null;
    marginRateOrAmount?: string | null;
    discountPercentage?: string | null;
    discountAmount?: string | null;
    isFreeItem: boolean;
    resolvedItemTaxRates?: Record<string, string> | null;
};
/** the §8 tax-row surface; category/addDeductTax ride only on purchase rows */
export type CalcBridgeTaxRow = {
    chargeType: CalcTaxRow["chargeType"];
    accountHeadId: string;
    rate: string;
    taxAmount: string;
    rowId?: number | null;
    includedInPrintRate: boolean;
    category?: TaxRowCategory | null;
    addDeductTax?: TaxAddDeduct | null;
};
export type InvoiceCalcParams = {
    items: CalcBridgeItem[];
    taxes: CalcBridgeTaxRow[];
    applyDiscountOn: "GRAND_TOTAL" | "NET_TOTAL";
    additionalDiscountPercentage: string;
    discountAmount: string;
    isCashOrNonTradeDiscount: boolean;
    disableRoundedTotal: boolean;
    currencyPrecision: number;
};
export type InvoiceCalcOutput = {
    result: CalcResult;
    /** per input-index computed item values (§8 outputs, strings) */
    items: {
        rate: string;
        amount: string;
        netRate: string;
        netAmount: string;
    }[];
    /** per input-index computed tax-row values */
    taxes: {
        taxAmount: string;
        total: string;
    }[];
    /** (itemIdx, taxIdx) → detail — persisted as item_wise_tax_detail on submit (P5.3) */
    itemWiseTaxDetail: {
        itemIdx: number;
        taxIdx: number;
        rate: string;
        amount: string;
        taxableAmount: string;
    }[];
    totals: {
        total: string;
        netTotal: string;
        totalTaxesAndCharges: string;
        grandTotal: string;
        roundedTotal: string;
        roundingAdjustment: string;
        discountApplied: string;
    };
};
/**
 * §8 with the invoice's discount block. A percentage discount is resolved to an amount
 * exactly the ERPNext way: percentage × (the apply-on total of a FIRST, discount-free
 * pass), then the engine runs again with the concrete amount — both passes are the P4
 * calculator; this file never does the distribution itself.
 */
export declare function runInvoiceCalculation(params: InvoiceCalcParams): InvoiceCalcOutput;
