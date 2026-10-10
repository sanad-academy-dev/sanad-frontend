import type { PatientPolicyStatus } from "@/generated/prisma/enums";
/**
 * [MI-P3] Coverage rules — PURE (fast tier). Two facts live here:
 *
 * 1. Per-service coverage resolution (MI §8.2): the coverage rows follow "subtree +
 *    specificity resolution identical to BR-M4.2.2 — same resolver code, one
 *    implementation" — so this file IMPORTS `pickMostSpecific` from the membership
 *    engine rather than re-implementing it. 0% is a real answer (explicit exclusion),
 *    which is why the return distinguishes "matched row says 0" from "no row → default".
 *
 * 2. Status derivation (MI §8.3, AR-M4): `EXPIRED` derives from `policyEnd` — only an
 *    ACTIVE policy expires by date; SUSPENDED/CANCELLED are manual states that a past
 *    end date does not overwrite (the record keeps saying what an operator decided).
 */
export type CoverageRowInput = {
    serviceId: string;
    coveragePercent: string;
    idx: number;
};
export declare function derivePatientPolicyStatus(policy: {
    status: PatientPolicyStatus;
    policyEnd: Date;
}, today: Date): PatientPolicyStatus;
export type ResolvedLineCoverage = {
    /** decimal-string percent that applies to the line (may be "0" = excluded) */
    coveragePercent: string;
    /** the matched row's serviceId, or null when the product default applied */
    matchedServiceId: string | null;
    /** true iff a row matched and says 0 — an explicit exclusion, not a missing rule */
    excluded: boolean;
};
/**
 * Resolve the coverage percent for one line's service. `ancestors` is the line service's
 * chain [self, parent, …] (the MI-P2 `resolveServiceAncestors` shape). A line with no
 * service (consultation fee, product line) has no ancestors and gets the default.
 */
export declare function resolveCoveragePercent(rows: CoverageRowInput[], ancestors: string[], defaultPercent: string): ResolvedLineCoverage;
/** remaining annual cap for the policy year; null = the product is uncapped */
export declare function capRemaining(annualCap: string | null, capConsumed: string): string | null;
