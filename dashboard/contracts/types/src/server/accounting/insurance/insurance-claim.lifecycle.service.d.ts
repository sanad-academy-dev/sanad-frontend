import type { Prisma } from "@/generated/prisma/client";
import type { ClaimRejectionResolution } from "@/generated/prisma/enums";
import { type InsuranceClaimDetailResponse } from "@/server/accounting/insurance/insurance-claim.type";
/**
 * [MI-P5] The second half of §9.3 — adjudication, the BR-I9.4 rejection resolutions and
 * the derived SETTLED state, each in ONE Serializable transaction (NFR-1).
 *
 * Nothing here posts by hand: the resolution books a §10.3 system JE through the journal
 * engine, and settlement is a plain Payment Entry (§10.4 — "Nothing new") whose PLE write
 * calls back into {@link refreshClaimSettlement} through the [P5.5] settlement-subscriber
 * seam. The claim therefore never writes a GL row itself, and its `settledAmount`/status
 * cannot drift from the ledger: both are RE-DERIVED on every payment event.
 */
type Tx = Prisma.TransactionClient;
export type AdjudicateClaimInput = {
    approvedAmount: string;
    insurerReference?: string | null;
    rejectionReason?: string | null;
};
export declare function adjudicateClaim(clinicId: string, claimId: string, input: AdjudicateClaimInput): Promise<InsuranceClaimDetailResponse>;
export declare function resolveClaimRejection(clinicId: string, claimId: string, resolution: ClaimRejectionResolution): Promise<InsuranceClaimDetailResponse>;
/**
 * Re-derive `settledAmount` + status from the PLE, inside the writing transaction.
 *
 * `settledAmount` counts MONEY only — the Σ of allocations whose voucher is a Payment
 * Entry. A write-off or a re-bill also drives the claim's outstanding to zero, and
 * counting those as "settled" would report insurer payments that never arrived.
 */
export declare function refreshClaimSettlement(tx: Tx, clinicId: string, claimId: string): Promise<void>;
export type CapAuditRow = {
    policyId: string;
    policyNumber: string;
    stored: string;
    expected: string;
    drift: string;
};
/**
 * BR-I9.6's last sentence: "a nightly audit job recomputes from claims and alarms on
 * drift". It recomputes with the SAME pure function the transitions move by, repairs the
 * stored figure (the ledger of record is the claim set, not the cached counter) and files
 * a HIGH inbox notice naming the policy — silence would make the cache authoritative
 * again, which is the failure the rule exists to prevent.
 */
export declare function runClaimCapAudit(clinicId: string): Promise<CapAuditRow[]>;
export {};
