import type { GlMapRow } from "@/server/accounting/gl/gl-map";
import type { PurchaseInvoicePayload } from "@/server/accounting/purchase-invoice/purchase-invoice.type";
export type PurchaseInvoiceGlContext = {
    /** resolved "Temporary Opening" account — required only when doc.isOpening */
    temporaryOpeningAccountId?: string | null;
    /** §4.1 round-off account — required only when a rounding adjustment exists */
    roundOffAccountId?: string | null;
    roundOffCostCenterId?: string | null;
    /** display name of the supplier for the `against` text */
    partyName: string | null;
    /** [P12.3] BR-8.2 — the category's liability account; required only when tax was withheld */
    taxWithholdingAccountId?: string | null;
};
export declare function buildPurchaseInvoiceGlMap(doc: PurchaseInvoicePayload, ctx: PurchaseInvoiceGlContext): GlMapRow[];
