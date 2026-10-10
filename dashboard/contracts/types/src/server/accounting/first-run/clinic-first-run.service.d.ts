/**
 * [P12B.6-fix] Everything a brand-new clinic must have before it can transact, in ONE
 * place, called from BOTH first-run paths — real onboarding (`src/lib/auth/index.ts`) and
 * the demo seed (`pos-demo.seed.ts`).
 *
 * WHY IT IS A FUNCTION AND NOT TWO CALLS AT THE CALL SITE (owner, 2026-08-19). The
 * fiscal-year gap and the tax-template gap were found weeks apart and fixed separately, and
 * the second one was fixed for the SEED only — leaving a clinic created through the wizard
 * in exactly the same hole. That is the shape KL-7 keeps producing: the product is correct,
 * the path a new clinic walks is not. Collecting the guarantees here means the next one is
 * added once and both paths get it, and a test can assert the whole set rather than each
 * call site separately.
 *
 * WHY PROVISION RATHER THAN REPORT. The alternative was to let the [P12C.2] readiness panel
 * tell the owner what is missing and link them to the screen. Both are needed, but a
 * calendar fiscal year covering today and a VAT template at the clinic's own configured rate
 * are DERIVABLE — not business decisions an owner should have to make before their first
 * document. The panel still lists them; they just read ✅. What the panel must genuinely
 * report is the chart of accounts and the §4.1 posting defaults, which are real choices.
 *
 * NOT transactional, and deliberately so: these are operating guarantees, not preconditions
 * of creating an account. Each failure is isolated and logged by the caller — the worst
 * outcome is a clear Arabic refusal at the first document, naming the screen that fixes it,
 * which is strictly better than a failed signup.
 */
export type ClinicFirstRunResult = {
    fiscalYear: {
        created: boolean;
        year: string;
    };
    salesTaxTemplate: {
        created: boolean;
    };
};
export declare function provisionClinicFirstRun(clinicId: string, now?: Date): Promise<ClinicFirstRunResult>;
