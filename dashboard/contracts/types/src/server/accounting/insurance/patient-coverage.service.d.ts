import { type CoverageRowInput } from "@/server/accounting/insurance/patient-coverage.rules";
/**
 * [MI-P3] The coverage resolver — the §8 analogue of MI-P2's membership resolver, and the
 * SAME structural shape (pure rules + DAO reads) so MI-P4 can call both side by side:
 * document → (patientId) → active policy → resolved coverage terms.
 *
 * WHAT IT DOES NOT DO (MI-P4's job, deliberately absent): it splits no invoice, posts
 * nothing, creates no claim, and touches neither pricing seam. Snapshotting of the terms
 * returned here happens at CLAIM time (§9.2 `coverageSnapshot`, AR-M2) — which is why the
 * return shape carries EVERYTHING the §9.2 claim snapshot needs: `policyNumber` (→
 * `policyNumberSnapshot`), the full product term set + coverage rows (→
 * `coverageSnapshot` and per-line `coveragePercent` via `resolveCoveragePercent`),
 * `policyId`/`insurerId`/`patientId` (denormalized claim FKs), the cap state
 * (BR-I9.6), and `settlementDays` (claim due date). ownerId comes from the document via
 * the MI-P2 resolver — the two run together at the P4 seam point (after §6.4 step 5).
 *
 * NFR-4: flag OFF ⇒ ONE settings read then null; policy/product reads only run when the
 * module is on and a patient is present.
 *
 * BR-I8.3.2: coverage exists ONLY when status=ACTIVE and serviceDate ∈ [policyStart,
 * policyEnd] — both conditions are in the query, so a stale-ACTIVE row past its end date
 * (daily job not yet run) can never resolve as coverage.
 */
/**
 * [MI-P3] MI §8.3: «EXPIRED تُشتق من policyEnd (المهمة اليومية + عند القراءة)» — خطوة
 * المهمة اليومية. تنضم إلى مُشغِّل مهمة العضويات القائم (لا مهمة جديدة)، خلف علم
 * التأمين المستقل: أكاديمية بعضويات بلا تأمين لا تدفع شيئًا هنا، والعكس بالعكس.
 */
export declare function runPolicyExpiryDaily(clinicId: string, asOf: Date): Promise<number>;
export type PatientCoverageContext = {
    policyId: string;
    policyNumber: string;
    policyStart: Date;
    policyEnd: Date;
    patientId: string;
    insurerId: string;
    insurerName: string;
    /** §8.1 — expected payment terms; MI-P4 derives the claim due date from it */
    settlementDays: number;
    product: {
        id: string;
        name: string;
        coveragePercentDefault: string;
        annualCap: string | null;
        perClaimCap: string | null;
        deductibleFixed: string;
        deductiblePercent: string;
    };
    /** ordered coverage rows for `resolveCoveragePercent` (BR-M4.2.2 discipline) */
    coverageRows: CoverageRowInput[];
    capConsumed: string;
    /** null = uncapped product */
    capRemaining: string | null;
};
export declare function resolvePatientCoverage(params: {
    clinicId: string;
    patientId: string | null | undefined;
    serviceDate?: Date;
}): Promise<PatientCoverageContext | null>;
