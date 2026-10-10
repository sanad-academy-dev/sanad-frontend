import { Prisma } from "@/generated/prisma/client";
import type { CrmDealStatusKind } from "@/generated/prisma/enums";
/**
 * BR-C4.2 — expectedValue = dealValue × probability ÷ 100, recomputed whenever EITHER
 * changes. Rounded to 2 places because it is money, and computed in Decimal because
 * `0.1 * 3` is not `0.3` in binary floating point and a forecast that drifts by cents is
 * a forecast nobody trusts.
 */
export declare function computeExpectedValue(dealValue: Prisma.Decimal | number | string, probability: Prisma.Decimal | number | string): Prisma.Decimal;
/**
 * BR-C6.1 — dealValue is Σ lineTotal whenever at least one product row exists, and only
 * a manual figure when there are none. Passing an empty array therefore does NOT zero a
 * manually-set value; the caller keeps it.
 */
export declare function deriveDealValue(lines: ReadonlyArray<{
    lineTotal: Prisma.Decimal | number | string;
}>, manualValue: Prisma.Decimal | number | string): Prisma.Decimal;
/** §6.1 — a product row's own total. Same Decimal discipline. */
export declare function computeLineTotal(qty: Prisma.Decimal | number | string, unitPrice: Prisma.Decimal | number | string): Prisma.Decimal;
/**
 * BR-C4.2 — the DELIBERATE DEVIATION from the reference, which silently re-defaults the
 * probability on every status change and so quietly discards a number the user typed.
 *
 * Here a status change re-defaults ONLY when the user has not overridden it. Returns the
 * probability to persist plus the flag's next value, so the caller cannot apply one
 * without the other.
 */
export declare function resolveProbabilityOnStatusChange(input: {
    statusDefault: Prisma.Decimal | number | string;
    current: Prisma.Decimal | number | string;
    overridden: boolean;
}): {
    probability: Prisma.Decimal;
    probabilityOverridden: boolean;
};
/**
 * BR-C4.2 — an explicit probability edit sets the flag. Once set it stays set: the user
 * has expressed an intent about THIS deal, and no later status move may quietly overrule
 * it. Clearing it is a separate, explicit action (the screen's «إعادة الافتراضي»).
 */
export declare function applyProbabilityOverride(value: Prisma.Decimal | number | string): {
    probability: Prisma.Decimal;
    probabilityOverridden: true;
};
/**
 * BR-C4.1 — WON is not a status you may simply select: it requires the §7 win flow to
 * resolve the Owner hand-off in the SAME transaction. A deal sitting WON without a
 * resolved Owner is exactly the broken state §7 exists to prevent, so the plain
 * status-change path refuses it and points at the button that does it properly.
 */
export declare function assertWonGoesThroughWinFlow(targetKind: CrmDealStatusKind): void;
/**
 * §4.1 — closedDate is stamped automatically when the deal enters a terminal kind, and
 * cleared when it leaves one. Reopening a closed deal that keeps its old close date would
 * report a deal closed in the past and still open, which no report can render honestly.
 */
export declare function resolveClosedDate(targetKind: CrmDealStatusKind, now: Date, current: Date | null): Date | null;
