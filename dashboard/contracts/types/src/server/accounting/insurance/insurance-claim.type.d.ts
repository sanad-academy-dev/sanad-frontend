import type { Prisma } from "@/generated/prisma/client";
/** [MI-P4] Insurance Claim types (MI §9.2, FR-I9.2) — server truth for list + detail. */
export declare const insuranceClaimListSelect: {
    readonly id: true;
    readonly documentNo: true;
    readonly status: true;
    readonly claimedAmount: true;
    readonly approvedAmount: true;
    readonly settledAmount: true;
    readonly serviceDate: true;
    readonly policyNumberSnapshot: true;
    readonly submittedAt: true;
    readonly createdAt: true;
    readonly insurer: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly invoice: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly total: true;
            readonly copayShare: true;
        };
    };
};
export type InsuranceClaimListResponse = Prisma.InsuranceClaimGetPayload<{
    select: typeof insuranceClaimListSelect;
}>;
export declare const insuranceClaimDetailSelect: {
    readonly policyId: true;
    readonly rejectionReason: true;
    readonly adjudicatedAt: true;
    readonly insurerReference: true;
    readonly rejectionResolution: true;
    readonly resolutionJournalEntryId: true;
    readonly resolvedAt: true;
    readonly coverageSnapshot: true;
    readonly lines: {
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly lineRef: true;
            readonly description: true;
            readonly lineTotal: true;
            readonly coveragePercent: true;
            readonly insurerAmount: true;
        };
        readonly orderBy: {
            readonly idx: "asc";
        };
    };
    readonly id: true;
    readonly documentNo: true;
    readonly status: true;
    readonly claimedAmount: true;
    readonly approvedAmount: true;
    readonly settledAmount: true;
    readonly serviceDate: true;
    readonly policyNumberSnapshot: true;
    readonly submittedAt: true;
    readonly createdAt: true;
    readonly insurer: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly patient: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly invoice: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly total: true;
            readonly copayShare: true;
        };
    };
};
export type InsuranceClaimDetailResponse = Prisma.InsuranceClaimGetPayload<{
    select: typeof insuranceClaimDetailSelect;
}>;
