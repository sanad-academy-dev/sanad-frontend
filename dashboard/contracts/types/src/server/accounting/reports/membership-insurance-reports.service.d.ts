import type { InsuranceClaimStatus } from "@/generated/prisma/enums";
export type ClaimsRegisterRow = {
    claimId: string;
    documentNo: string | null;
    insurerId: string;
    insurerName: string;
    patientName: string;
    ownerName: string;
    invoiceCode: string;
    serviceDate: Date;
    submittedAt: Date | null;
    status: InsuranceClaimStatus;
    claimedAmount: string;
    approvedAmount: string | null;
    settledAmount: string;
    /** what the insurer still owes on this claim: (approved ?? claimed) − settled */
    openAmount: string;
    /** days since SUBMISSION — the claim is only "with the insurer" once sent */
    ageDays: number | null;
    settlementDays: number | null;
    /** past the insurer's agreed settlement window with money still open */
    overdue: boolean;
};
export type ClaimsRegisterReport = {
    rows: ClaimsRegisterRow[];
    totals: {
        claimed: string;
        approved: string;
        settled: string;
        open: string;
    };
    overdueCount: number;
};
/**
 * FR-R12.1: "filterable register: insurer, status, ageing vs settlementDays,
 * claimed/approved/settled".
 *
 * Ageing runs from `submittedAt`, not from the service date: a DRAFT claim is not late,
 * it simply has not been sent, and dating its age from the visit would show a red row for
 * the clinic's own delay in submitting. Unsubmitted claims carry `ageDays: null`.
 */
export declare function claimsRegisterReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
    insurerId?: string;
    status?: InsuranceClaimStatus;
}): Promise<ClaimsRegisterReport>;
export type MembershipRevenueRow = {
    planId: string;
    planName: string;
    memberCount: number;
    invoiceCount: number;
    /** NET of tax — recognition is about revenue, and deferral works on net amounts */
    billed: string;
    recognized: string;
    deferredBalance: string;
};
export type MembershipRevenueReport = {
    rows: MembershipRevenueRow[];
    totals: {
        billed: string;
        recognized: string;
        deferredBalance: string;
    };
};
/**
 * FR-R12.3: "subscription invoices ∪ deferred schedule — billed vs recognized vs deferred
 * balance per plan".
 *
 * Everything is NET of tax on purpose: `billed` reads `netTotal`, not `grandTotal`,
 * because the deferral engine schedules `SalesInvoiceItem.netAmount`. Mixing a gross
 * billed figure with net recognition would make «المعترف به» wrong by exactly the VAT.
 *
 * Recognition has two sources, and both must count: a plan with `deferRevenue` OFF
 * recognises the whole line the moment the invoice is submitted (nothing is scheduled),
 * while a deferring plan recognises through `deferred_schedule_entry` rows as periods
 * pass. So recognized = (billed − scheduled) + posted-so-far.
 */
export declare function membershipRevenueReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
}): Promise<MembershipRevenueReport>;
export type BenefitUsageRow = {
    planId: string;
    planName: string;
    memberCount: number;
    /** what the discounted documents would have cost at list price */
    gross: string;
    /** what the member actually paid on them */
    net: string;
    /** Σ of the BR-M6.7 adjustment rows — the money the plan gave away */
    discountGiven: string;
    unitsGranted: number;
    unitsConsumed: number;
    /** consumed ÷ granted, 0–100, one decimal */
    consumptionPercent: string;
    /** Σ membership fees the plan's members have actually PAID */
    feesPaid: string;
    /** feesPaid − discountGiven: positive = the plan earns its keep */
    netContribution: string;
};
export type BenefitUsageReport = {
    rows: BenefitUsageRow[];
    totals: {
        discountGiven: string;
        feesPaid: string;
        netContribution: string;
    };
};
/**
 * FR-R12.4: "gross vs net, discount given per plan/benefit, entitlement consumption %,
 * member LTV vs fees paid".
 *
 * `feesPaid` is the LTV side and it counts PAID money only — `amountPaid` on the
 * subscription invoices, never what was billed. A member who was invoiced 990 and paid
 * nothing has given the clinic nothing, and a report that says otherwise would make an
 * unprofitable plan look profitable.
 */
export declare function benefitUsageReport(params: {
    clinicId: string;
    fromDate: Date;
    toDate: Date;
}): Promise<BenefitUsageReport>;
