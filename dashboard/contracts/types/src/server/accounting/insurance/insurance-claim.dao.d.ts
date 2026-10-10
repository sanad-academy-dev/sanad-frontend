import type { InsuranceClaimStatus } from "@/generated/prisma/enums";
import { type InsuranceClaimDetailResponse, type InsuranceClaimListResponse } from "@/server/accounting/insurance/insurance-claim.type";
/**
 * [MI-P4] Claim lifecycle — THIS PHASE'S SLICE only (§9.3): DRAFT→SUBMITTED and
 * DRAFT→CANCELLED. Adjudication/settlement transitions are MI-P5 and refuse loudly.
 *
 * SUBMIT is the legal moment (C7 + BR-I9.6, one Serializable transaction, NFR-1):
 * the CLM- number is allocated gap-free, the snapshot is already frozen from creation,
 * and `capConsumed` moves by the claimed amount. It is also the §10.2 posting trigger —
 * the extended clinic-invoice adapter picks the invoice up on its next run precisely
 * because the claim left DRAFT.
 */
export declare const insuranceClaimDao: {
    list(clinicId: string, filter?: {
        status?: InsuranceClaimStatus;
        insurerId?: string;
    }): Promise<InsuranceClaimListResponse[]>;
    find(clinicId: string, id: string): Promise<InsuranceClaimDetailResponse | null>;
    /** DRAFT → SUBMITTED: CLM- number + BR-I9.6 cap consumption, one transaction */
    submit(clinicId: string, id: string): Promise<InsuranceClaimDetailResponse>;
    /**
     * DRAFT → CANCELLED (manual — §9.3: draft-only). The invoice returns to an UNINSURED
     * state: split columns cleared, and its status re-derived from what the owner actually
     * paid vs the FULL total — the remainder is collected at the counter normally.
     */
    cancel(clinicId: string, id: string): Promise<InsuranceClaimDetailResponse>;
};
