import { type PreparedInsuranceSplit } from "@/server/accounting/insurance/insurance-split.service";
/**
 * [MI-P4] BR-I9.1.2 — the split PREVIEW the operator sees before confirming. One
 * invoice-id entry point for all four clinic-invoice sources (the same dispatch shape as
 * `payByInvoiceId`): recompute the document's effective lines through its own pricing
 * path, resolve coverage, and return the full workings. The operator may EXCLUDE lines
 * (pushing them to the copay) and preview again — reduce only; the computed figure is
 * the ceiling, enforced server-side because the pay call recomputes everything.
 */
export type InsurancePreviewResult = {
    kind: "not-found";
} | {
    kind: "no-coverage";
    message: string;
} | {
    kind: "already-claimed";
    claimId: string;
    status: string;
} | {
    kind: "ok";
    invoiceId: string;
    total: string;
    prepared: PreparedInsuranceSplit;
};
export declare function previewInvoiceInsuranceSplit(params: {
    clinicId: string;
    invoiceId: string;
    excludedLineRefs?: string[];
}): Promise<InsurancePreviewResult>;
