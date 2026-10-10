import type { MembershipStatus } from "@/generated/prisma/enums";
/**
 * [MI-P1] FR-M5.2 — membership status derivation (AR-M4: statuses are DERIVED).
 *
 * One pure function, two callers: the daily job (persists the result) and the on-read
 * check in GET (returns and persists). Nothing else may write PAST_DUE / LAPSED /
 * EXPIRED; only CANCELLED is a manual transition and it never passes through here.
 *
 * The §5.2 table, in rule order:
 *  - CANCELLED / EXPIRED are terminal — echoed back untouched.
 *  - PENDING_PAYMENT waits on the FIRST invoice: paid → ACTIVE, unpaid → stays (it never
 *    becomes PAST_DUE — grace applies to renewals, not to a sale that was never closed).
 *  - past the period end: non-renewing → EXPIRED (BR-M5.2 table row 6); renewing with the
 *    period's invoice unpaid → LAPSED and now terminal (BR-M5.2.3 second half); paid →
 *    ACTIVE until the job rolls the period (deriving punishment for a not-yet-generated
 *    renewal invoice would be inventing debt).
 *  - within the period: paid → ACTIVE (this IS the BR-M5.2.3 reactivation when coming
 *    from LAPSED); unpaid → PAST_DUE through the grace window, LAPSED after it.
 */
export type MembershipDeriveInput = {
    status: MembershipStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    graceDaysSnapshot: number;
    autoRenewSnapshot: boolean;
    /**
     * the membership is still in its FIRST billing period (currentPeriodStart equals the
     * subscription's startDate). §5.2 scopes the grace machinery to RENEWAL invoices —
     * an unpaid first invoice is the PENDING_PAYMENT row of the table, and with
     * `membership_active_on_enroll` it was deliberately set ACTIVE (counter sale): the
     * flag's whole point is that the wait is skipped, so derivation must not walk it
     * back down to PAST_DUE while the cashier is still typing the payment.
     */
    isFirstPeriod: boolean;
};
/** payment state of the CURRENT period's generated invoice (SalesInvoice truth, P5.5) */
export type PeriodInvoiceState = {
    /** a generated invoice covering the current period exists */
    exists: boolean;
    /** that invoice is submitted and fully paid (SalesInvoiceStatus PAID) */
    paid: boolean;
};
export declare function deriveMembershipStatus(membership: MembershipDeriveInput, invoice: PeriodInvoiceState, today: Date): MembershipStatus;
/**
 * BR-M5.1.1 terminal set (owner decision P1-Q5): CANCELLED and EXPIRED always;
 * LAPSED only once its period has passed — within the period it can still reactivate
 * (BR-M5.2.3), so it still blocks a new enrollment.
 */
export declare function isTerminalMembership(membership: Pick<MembershipDeriveInput, "status" | "currentPeriodEnd">, today: Date): boolean;
/** statuses that can possibly be non-terminal — the BR-M5.1.1 query filter */
export declare const POSSIBLY_ACTIVE_STATUSES: readonly ["PENDING_PAYMENT", "ACTIVE", "PAST_DUE", "LAPSED"];
