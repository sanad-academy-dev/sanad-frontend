import { type CreateFiscalYearInput } from "@/server/accounting/fiscal-year/fiscal-year.type";
export declare function createFiscalYear(input: CreateFiscalYearInput): Promise<{
    id: string;
    clinicId: string;
    year: string;
    yearStartDate: Date;
    yearEndDate: Date;
    isShortYear: boolean;
    disabled: boolean;
    autoCreated: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function updateFiscalYear(clinicId: string, id: string, data: {
    year?: string;
    yearStartDate?: string;
    yearEndDate?: string;
    isShortYear?: boolean;
    disabled?: boolean;
}): Promise<{
    id: string;
    clinicId: string;
    year: string;
    yearStartDate: Date;
    yearEndDate: Date;
    isShortYear: boolean;
    disabled: boolean;
    autoCreated: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function deleteFiscalYear(clinicId: string, id: string): Promise<void>;
/** BR-4.2.2 — resolve the (enabled) fiscal year covering a posting date; throws if none. */
export declare function getFiscalYear(clinicId: string, date: Date): Promise<{
    id: string;
    clinicId: string;
    year: string;
    yearStartDate: Date;
    yearEndDate: Date;
    isShortYear: boolean;
    disabled: boolean;
    autoCreated: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
/** Rollover job stub (FR-4.2): create the year after the latest one, marked autoCreated. */
/**
 * [P12B.6-fix] Guarantee a fiscal year covering `date`, creating a calendar year if none
 * does. Idempotent.
 *
 * WHY. The owner's UI pass on a freshly seeded clinic hit
 * «لا توجد سنة مالية تغطي التاريخ 2026-08-19» from the POS adapter. The per-document
 * refusal is correct — posting outside every fiscal year must fail — but the SEED was the
 * defect: it provisioned FY 2024 and FY 2025 (the close-cycle and budget stories) and
 * nothing covering today, while `auto_create_fiscal_year` only fires near a year end. Same
 * class as the missing tax template: the product is right, the first-run path was not.
 *
 * The year is derived from the date, never hardcoded — a seed pinned to a literal year is
 * exactly the bug being fixed, just postponed to next January.
 *
 * CALLED FROM BOTH FIRST-RUN PATHS (owner, 2026-08-19): the demo seed AND real onboarding.
 * Fixing only the seed would have left a clinic created through the wizard in the same
 * hole, which is the shape KL-7 keeps producing. Provisioning was chosen over merely
 * REPORTING the gap in the [P12C.2] readiness panel because a fiscal year covering today
 * is derivable, not a business decision the owner should have to make on day one — the
 * panel still lists it, it just reads ✅ instead of "do this first". The one cost is stated
 * rather than hidden: a clinic on a non-calendar fiscal year must delete the auto-created
 * one before creating its own (BR-4.2.1 forbids overlap), which `autoCreated` makes
 * visible on «السنوات المالية».
 */
export declare function ensureFiscalYearCovering(clinicId: string, date: Date): Promise<{
    created: boolean;
    year: string;
}>;
export declare function createNextFiscalYear(clinicId: string): Promise<{
    id: string;
    clinicId: string;
    year: string;
    yearStartDate: Date;
    yearEndDate: Date;
    isShortYear: boolean;
    disabled: boolean;
    autoCreated: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
