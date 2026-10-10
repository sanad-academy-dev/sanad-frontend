import { type MembershipAdjustmentIntent } from "@/server/accounting/membership/membership-benefits.rules";
import { type CalcBridgeTaxRow, type InvoiceCalcOutput } from "@/server/accounting/sales-invoice/sales-invoice.calc";
import { type ResolvedSalesTaxTemplate } from "@/server/accounting/tax/sales-tax-template.resolver";
import { type LoyaltyRedemptionIntent } from "@/server/loyalty/loyalty-redemption/loyalty-redemption.service";
export declare class SaleTaxTemplateMissingError extends Error {
    constructor();
}
/**
 * [P12C.1] The resolution order moved to `sales-tax-template.resolver.ts` when the
 * clinic-invoice side needed the identical rule. Re-exported here so POS call sites and the
 * [P12B.3] tests keep their import, but there is now exactly ONE implementation.
 */
export type ResolvedSaleTaxTemplate = ResolvedSalesTaxTemplate;
export declare function resolveSaleTaxTemplate(params: {
    clinicId: string;
    partyId?: string | null;
    date: Date;
}): Promise<ResolvedSaleTaxTemplate>;
export type SalePricingItem = {
    name: string;
    unitPrice: number | string;
    quantity: number | string;
    inventoryItemId?: string | null;
};
export type SaleMembershipOutcome = {
    membershipId: string;
    adjustments: MembershipAdjustmentIntent[];
    membershipDiscountTotal: string;
    couponSuppressed: boolean;
};
export type SalePricingResult = {
    template: ResolvedSaleTaxTemplate;
    calc: InvoiceCalcOutput;
    /** [MI-P2] null unless a live membership actually discounted this cart */
    membership: SaleMembershipOutcome | null;
    /** [LY-P2] BR-M6.4 step 4 — null unless points were actually redeemed on this cart */
    loyalty: LoyaltyRedemptionIntent | null;
    /** rounded to the sale's fraction units — what gets persisted and printed */
    totals: {
        subtotal: string;
        discount: string;
        netTotal: string;
        taxAmount: string;
        total: string;
        /**
         * DERIVED display percentage (tax ÷ net), never an input. A two-row template
         * collapses here, which is exactly why the per-row breakdown is returned too and
         * why the receipt prints the rows rather than this number alone.
         */
        effectiveTaxRate: string;
    };
    /** per-row tax detail, positionally aligned with `template.taxes` */
    taxRows: {
        idx: number;
        chargeType: CalcBridgeTaxRow["chargeType"];
        accountHeadId: string;
        rate: string;
        taxAmount: string;
        total: string;
        rowId: number | null;
        description: string;
        includedInPrintRate: boolean;
    }[];
};
/**
 * Price a cart through §8. `discountAmount` is an absolute amount on the net total — the
 * POS discount box already resolves its own percentage mode to an amount before it gets
 * here, and the engine takes it from there.
 */
export declare function priceSale(params: {
    clinicId: string;
    items: SalePricingItem[];
    discountAmount?: number | string | null;
    partyId?: string | null;
    date?: Date;
    /** [MI-P2] the cashier-picked member owner — absent ⇒ pricing exactly as before */
    membership?: {
        ownerId: string | null | undefined;
    };
    /**
     * [LY-P2] BR-M6.4 step 4. `redeemPoints` absent or zero ⇒ **not one query runs** and
     * every returned figure is bit-identical to the pre-LY-P2 output (BR-L8.4).
     */
    loyalty?: {
        ownerId: string | null | undefined;
        redeemPoints?: number | null;
    };
}): Promise<SalePricingResult>;
