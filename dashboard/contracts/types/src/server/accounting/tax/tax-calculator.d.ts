export type CalcChargeType = "ACTUAL" | "ON_NET_TOTAL" | "ON_PREVIOUS_ROW_AMOUNT" | "ON_PREVIOUS_ROW_TOTAL" | "ON_ITEM_QUANTITY";
export type CalcItem = {
    /** stable identity echoed into the breakdown (invoice child-row id) */
    key: string;
    qty: string;
    /** entered rate — used directly when no priceListRate resolution applies */
    rate?: string;
    priceListRate?: string | null;
    marginType?: "PERCENTAGE" | "AMOUNT" | null;
    marginRateOrAmount?: string | null;
    discountPercentage?: string | null;
    /** per-unit discount amount (applied after margin, like ERPNext) */
    discountAmount?: string | null;
    isFreeItem?: boolean;
    /** item-tax-template override: accountHead → rate; an explicit "0" MEANS zero */
    itemTaxRates?: Record<string, string> | null;
};
export type CalcTaxRow = {
    key: string;
    chargeType: CalcChargeType;
    accountHead: string;
    rate?: string;
    /** entered amount for ACTUAL rows */
    taxAmount?: string;
    /** 1-based reference for On Previous Row types */
    rowId?: number | null;
    includedInPrintRate?: boolean;
    /** purchase-only (§8 step 7); defaults TOTAL/ADD */
    category?: "TOTAL" | "VALUATION" | "VALUATION_AND_TOTAL";
    addDeductTax?: "ADD" | "DEDUCT";
};
export type CalcDoc = {
    currencyPrecision?: number;
    roundRowWiseTax?: boolean;
    applyDiscountOn?: "NET_TOTAL" | "GRAND_TOTAL" | null;
    discountAmount?: string | null;
    /** GRAND only: discount posts to its own account — totals untouched except grand */
    isCashOrNonTradeDiscount?: boolean;
    items: CalcItem[];
    taxes: CalcTaxRow[];
};
export type ItemWiseDetail = {
    itemKey: string;
    taxRowKey: string;
    rate: string;
    amount: string;
    taxableAmount: string;
};
export type CalcResult = {
    items: {
        key: string;
        qty: string;
        rate: string;
        amount: string;
        netRate: string;
        netAmount: string;
    }[];
    taxes: {
        key: string;
        accountHead: string;
        chargeType: CalcChargeType;
        taxAmount: string;
        /** running cumulative (net total + Total-affecting taxes up to this row) */
        total: string;
    }[];
    itemWiseTaxDetail: ItemWiseDetail[];
    /** purchase: valuation tax loaded per item (signed) */
    itemValuationTax: Record<string, string>;
    netTotal: string;
    total: string;
    taxTotal: string;
    grandTotal: string;
    roundedTotal: string;
    roundingAdjustment: string;
    discountApplied: string;
};
export declare function calculate(doc: CalcDoc): CalcResult;
