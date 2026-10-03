import type { GlMapRow } from "@/server/accounting/gl/gl-map";
import type { SalesInvoicePayload } from "@/server/accounting/sales-invoice/sales-invoice.type";
export type SalesInvoiceGlContext = {
    /** resolved "Temporary Opening" account — required only when doc.isOpening */
    temporaryOpeningAccountId?: string | null;
    /** §4.1 round-off account — required only when a rounding adjustment exists */
    roundOffAccountId?: string | null;
    roundOffCostCenterId?: string | null;
    /** display name of the customer for the `against` text */
    partyName: string | null;
};
export declare function buildSalesInvoiceGlMap(doc: SalesInvoicePayload, ctx: SalesInvoiceGlContext): GlMapRow[];
