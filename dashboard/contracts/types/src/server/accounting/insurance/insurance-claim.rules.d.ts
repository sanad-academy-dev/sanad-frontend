import type { InsuranceClaimStatus } from "@/generated/prisma/enums";
export type ClaimCapInput = {
    status: InsuranceClaimStatus;
    claimedAmount: string;
    approvedAmount: string | null;
};
/**
 * How much of the policy's annual cap this ONE claim consumes right now (BR-I9.6).
 *
 * · DRAFT / CANCELLED — nothing is claimed of the insurer yet (or ever again).
 * · SUBMITTED         — the full claimed amount is in play until the insurer answers.
 * · APPROVED / PARTIALLY_APPROVED / SETTLED — exactly what the insurer approved.
 * · REJECTED          — the insurer pays nothing, so nothing is consumed; the remainder's
 *                       re-bill/write-off resolution moves money between OUR accounts and
 *                       cannot consume an insurer's cap.
 */
export declare function claimCapContribution(claim: ClaimCapInput): string;
/** Σ of {@link claimCapContribution} — what `patient_policy.capConsumed` MUST equal. */
export declare function capConsumedTarget(claims: ClaimCapInput[]): string;
export type AdjudicationInput = {
    claimedAmount: string;
    approvedAmount: string;
    rejectionReason: string | null;
};
export type AdjudicationOutcome = {
    status: Extract<InsuranceClaimStatus, "APPROVED" | "PARTIALLY_APPROVED" | "REJECTED">;
    approvedAmount: string;
    /** claimed − approved: the amount BR-I9.4 forces to a re-bill or a write-off */
    rejectedAmount: string;
};
/**
 * §9.3 + BR-I9.4: the result is fixed by the approved figure, and a reason is MANDATORY
 * on any shortfall ("reason mandatory on any rejection (full or partial)" — §9.2).
 */
export declare function adjudicate(input: AdjudicationInput): AdjudicationOutcome;
/** Does this claim still owe a BR-I9.4 decision on a rejected remainder? */
export declare function needsRejectionResolution(claim: {
    status: InsuranceClaimStatus;
    claimedAmount: string;
    approvedAmount: string | null;
    rejectionResolution: string | null;
}): boolean;
export type SettlementInput = {
    status: InsuranceClaimStatus;
    claimedAmount: string;
    approvedAmount: string | null;
    /** live PLE outstanding of the claim's insurer receivable (BR-5.2.2) */
    outstanding: string;
    /** Σ of real insurer money allocated against the claim (payment_entry PLE rows) */
    settledAmount: string;
};
/**
 * SETTLED is DERIVED, never entered — and it reverts. Money, not a zero balance, is what
 * settles a claim: a rejected remainder written off also drives outstanding to zero, and
 * calling that "مُسوّاة" would tell the operator the insurer paid when it did not. So the
 * derivation needs BOTH an approved claim and insurer money, and unwinding the payment
 * (P7.7 unreconcile / PE cancel) puts the claim back where adjudication left it.
 */
export declare function deriveClaimStatus(input: SettlementInput): InsuranceClaimStatus;
