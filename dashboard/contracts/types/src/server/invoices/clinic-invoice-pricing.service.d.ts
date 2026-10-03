import { Prisma } from "@/generated/prisma/client";
import { type MembershipAdjustmentIntent } from "@/server/accounting/membership/membership-benefits.rules";
import { type CalcBridgeTaxRow, type InvoiceCalcOutput } from "@/server/accounting/sales-invoice/sales-invoice.calc";
import { type ResolvedSalesTaxTemplate } from "@/server/accounting/tax/sales-tax-template.resolver";
import { type LoyaltyRedemptionIntent } from "@/server/loyalty/loyalty-redemption/loyalty-redemption.service";
/** clinic invoices persist money at Decimal(10,2) — round at the document boundary (C2) */
export declare const CLINIC_INVOICE_PRECISION = 2;
export declare class ClinicInvoiceTaxTemplateMissingError extends Error {
    constructor();
}
/**
 * One priced line. `serviceId` / `inventoryItemId` are what resolve the §8 step-5 override;
 * a line with neither (the consultation fee) simply takes the template rate.
 */
export type ClinicInvoiceLine = {
    amount: Prisma.Decimal | string | number;
    serviceId?: string | null;
    inventoryItemId?: string | null;
    /** [MI-P2] stable audit ref for the membership adjustment row (optional — unused when the module is off) */
    lineRef?: string;
    /** [MI-P2] integral billable units on the line (INCLUDED_UNITS granularity); defaults to 1 */
    qty?: number;
};
export type ClinicInvoiceMembershipOutcome = {
    membershipId: string;
    adjustments: MembershipAdjustmentIntent[];
    membershipDiscountTotal: string;
    /** BR-M6.6 OFF: the manual/coupon discount lost to the larger membership reduction */
    couponSuppressed: boolean;
};
export type ClinicInvoicePricingResult = {
    template: ResolvedSalesTaxTemplate;
    calc: InvoiceCalcOutput;
    /** [MI-P2] null unless a live membership actually adjusted this document */
    membership: ClinicInvoiceMembershipOutcome | null;
    /** [LY-P2] BR-M6.4 step 4 — null unless points were actually redeemed on this document */
    loyalty: LoyaltyRedemptionIntent | null;
    /**
     * [MI-P4] the non-zero lines with their POST-membership amounts, positionally the §8
     * items — the insurance split (§6.4 step 6) distributes the taxed gross over these
     */
    effectiveLines: {
        lineRef: string;
        serviceId: string | null;
        inventoryItemId: string | null;
        effectiveAmount: string;
    }[];
    /** rounded to the invoice's fraction units — exactly what is persisted */
    subtotal: Prisma.Decimal;
    discount: Prisma.Decimal;
    netTotal: Prisma.Decimal;
    vatAmount: Prisma.Decimal;
    total: Prisma.Decimal;
    /**
     * DERIVED display percentage (tax ÷ net), never an input. Kept because two screens and
     * the print layout still read `Invoice.vatRate`; the truth is `taxRows`.
     */
    vatRate: Prisma.Decimal;
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
export declare function priceClinicInvoice(params: {
    clinicId: string;
    lines: ClinicInvoiceLine[];
    discount?: Prisma.Decimal | string | number | null;
    partyId?: string | null;
    date?: Date;
    /** [MI-P2] document context for membership benefits — absent ⇒ pricing exactly as before */
    membership?: {
        ownerId: string | null | undefined;
        patientId?: string | null;
    };
    /**
     * [LY-P2] BR-M6.4 step 4. `redeemPoints` absent or zero ⇒ **not one query runs** and
     * every returned figure is bit-identical to the pre-LY-P2 output (BR-L8.4).
     */
    loyalty?: {
        ownerId: string | null | undefined;
        redeemPoints?: number | null;
    };
}): Promise<ClinicInvoicePricingResult>;
/**
 * Persisting the tax rows. Replace-in-place rather than append: an invoice is refreshed
 * every time its lines change, and stale rows would double-count on the adapter's next run.
 */
export declare function invoiceTaxRowsWriteData(result: ClinicInvoicePricingResult): {
    idx: number;
    chargeType: import("../accounting/tax/tax-calculator").CalcChargeType;
    accountHeadId: string;
    rate: import("@prisma/client-runtime-utils").Decimal;
    taxAmount: import("@prisma/client-runtime-utils").Decimal;
    total: import("@prisma/client-runtime-utils").Decimal;
    rowId: number | null;
    description: string;
    includedInPrintRate: boolean;
}[];
