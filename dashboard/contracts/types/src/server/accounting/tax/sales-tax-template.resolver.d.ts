import type { Prisma } from "@/generated/prisma/client";
/**
 * [P12C.1] Resolving a Sales Taxes and Charges Template — ONE implementation, shared by
 * every revenue path.
 *
 * WHY IT LIVES HERE RATHER THAN BESIDE ITS FIRST CALLER. [P12B.3] built this resolution
 * order inside the POS pricing service. [P12C.1] then needed exactly the same order for
 * clinic invoices — and copying it would have recreated, one layer up, precisely the defect
 * this phase pair exists to delete: the same rule written in two places, free to drift.
 * The clinic-invoice side already paid that price once with four copies of
 * `DEFAULT_VAT_RATE = 15`.
 *
 * The order is ERPNext's and the BRD's (§4.11 / P4.1): a matching **Tax Rule** wins, because
 * it is the one that knows about this party and this date; otherwise the clinic's **default**
 * template. A disabled template is never used — that is what disabling means.
 *
 * NO FALLBACK RATE, EVER (owner 2026-08-15). When nothing resolves, the caller's own
 * `onMissing` error is thrown, worded for the screen the operator is standing on. Inventing
 * a rate is what this work removes; charging zero is an under-collection nobody notices.
 */
export declare const salesTaxTemplateWithRows: {
    readonly id: true;
    readonly title: true;
    readonly taxes: {
        readonly select: {
            readonly idx: true;
            readonly chargeType: true;
            readonly accountHeadId: true;
            readonly rate: true;
            readonly taxAmount: true;
            readonly rowId: true;
            readonly description: true;
            readonly includedInPrintRate: true;
        };
        readonly orderBy: {
            readonly idx: "asc";
        };
    };
};
export type ResolvedSalesTaxTemplate = Prisma.SalesTaxesAndChargesTemplateGetPayload<{
    select: typeof salesTaxTemplateWithRows;
}>;
export declare function resolveSalesTaxTemplateOrThrow(params: {
    clinicId: string;
    partyId?: string | null;
    date: Date;
    /** the refusal to raise when nothing resolves — worded for the caller's screen */
    onMissing: () => Error;
}): Promise<ResolvedSalesTaxTemplate>;
