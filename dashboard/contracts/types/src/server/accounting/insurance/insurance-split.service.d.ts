import type { Prisma } from "@/generated/prisma/client";
import { type SplitResult } from "@/server/accounting/insurance/insurance-split.rules";
import { type PatientCoverageContext } from "@/server/accounting/insurance/patient-coverage.service";
/**
 * [MI-P4] The split at the seam's step-5 entry point (§9.1) + the claim document's
 * creation slice. The split is computed at invoice FINALIZATION (the pay confirmation),
 * snapshotted onto the claim (AR-M2 — §9.2 `coverageSnapshot` + line rows), and never
 * recomputed afterwards: an invoice carrying a live claim has FROZEN figures.
 *
 * O5/O5a (owner, 2026-08-23): the invoice stays in the OWNER's name; the split divides
 * who owes the taxed gross — copay collected at the counter, insurer share outstanding
 * on the Insurer party (posted by the extended adapter at claim SUBMIT, §10.2).
 */
type Tx = Prisma.TransactionClient;
export type PricedLineForSplit = {
    lineRef: string;
    serviceId: string | null;
    inventoryItemId: string | null;
    effectiveAmount: string;
};
export type PreparedInsuranceSplit = {
    coverage: PatientCoverageContext;
    split: SplitResult;
    excludedLineRefs: string[];
};
/**
 * Resolve coverage + compute the split for a document about to be finalized. Throws the
 * Arabic refusal when the module is off or the patient holds no live coverage — the
 * operator explicitly asked for a claim (BR-I9.1.2 preview → confirm), so silence would
 * hide a real state.
 */
export declare function prepareInsuranceSplit(params: {
    clinicId: string;
    patientId: string | null;
    pricedLines: PricedLineForSplit[];
    invoiceTotal: string;
    serviceDate?: Date;
    excludedLineRefs?: string[];
}): Promise<PreparedInsuranceSplit>;
/**
 * Create the DRAFT claim inside the payment transaction (§9.1 step 4, NFR-1) and stamp
 * the invoice's split columns. §9.2 snapshots freeze here: line rows + `coverageSnapshot`
 * (the product terms, the policy identity, and the full workings — support can answer
 * "why this copay" without re-deriving).
 */
export declare function createInsuranceClaimOnPay(tx: Tx, params: {
    clinicId: string;
    invoiceId: string;
    ownerId: string;
    prepared: PreparedInsuranceSplit;
    serviceDate?: Date;
}): Promise<{
    claimId: string;
    insurerShare: string;
    copayShare: string;
}>;
/** the claim (if any) that still binds the invoice — CANCELLED claims bind nothing */
export declare function findLiveClaimForInvoice(invoiceId: string, client?: Tx): Promise<{
    id: string;
    status: string;
    copayShare: string | null;
} | null>;
/**
 * BR-I9.1.3 / BR-I9.5 — called by void AND refund before touching an insured invoice:
 * no claim → proceed; DRAFT → cancelled automatically here and the caller proceeds;
 * anything else → the Arabic refusal (v1 directs to a manual JE; automated insurer
 * refunds are [P2]).
 */
export declare function assertInvoiceClaimReversible(tx: Tx, invoiceId: string): Promise<void>;
export {};
