import type { MembershipBenefitType } from "@/generated/prisma/enums";
export type BenefitPricingLine = {
    /** decimal-string gross amount of the WHOLE line */
    amount: string;
    /** integral billable units on the line (services with quantity; otherwise 1) */
    qty: number;
    serviceId?: string | null;
    inventoryItemId?: string | null;
    /** stable audit ref, e.g. "service:<rowId>" — travels to the adjustment row */
    lineRef: string;
};
export type SnapshotBenefitInput = {
    id: string;
    benefitType: MembershipBenefitType;
    serviceId: string | null;
    discountPercent: string | null;
    discountAmount: string | null;
    unitsPerPeriod: number | null;
    idx: number;
};
export type EntitlementInput = {
    id: string;
    benefitId: string;
    unitsGranted: number;
    unitsConsumed: number;
    periodStart: Date;
    periodEnd: Date;
};
export type MembershipAdjustmentIntent = {
    lineIndex: number;
    lineRef: string;
    benefitId: string;
    benefitType: MembershipBenefitType;
    serviceId: string | null;
    /** the reduction applied to the line, 2dp decimal-string */
    amount: string;
    unitsConsumed: number;
    entitlementId: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
};
export type ApplyBenefitsInput = {
    lines: BenefitPricingLine[];
    /** non-superseded snapshot rows, plan order */
    benefits: SnapshotBenefitInput[];
    /** current-period entitlement counters */
    entitlements: EntitlementInput[];
    /** ancestor chain per line serviceId: [self, parent, grandparent, …] */
    serviceAncestors: Record<string, string[]>;
    /** BR-M6.3: the document's patient belongs to the member owner (false ⇒ service benefits off) */
    serviceBenefitsEligible: boolean;
    stacksWithCoupons: boolean;
    /** the existing manual/coupon lump discount on the document */
    couponDiscount: string;
};
export type ApplyBenefitsResult = {
    /** adjusted line amounts, positionally aligned with input */
    lineAmounts: string[];
    adjustments: MembershipAdjustmentIntent[];
    /** the coupon amount that should reach the §8 engine (zeroed when suppressed) */
    couponDiscount: string;
    membershipDiscountTotal: string;
    /** BR-M6.6 OFF outcomes */
    couponSuppressed: boolean;
    membershipSuppressed: boolean;
};
/**
 * deepest matching node wins; ties by lower idx (BR-M4.2.2).
 * EXPORTED for the [MI-P3] insurance coverage resolver — MI §8.2 mandates "subtree +
 * specificity resolution identical to BR-M4.2.2 — same resolver code, one implementation".
 */
export declare function pickMostSpecific<T extends {
    serviceId: string | null;
    idx: number;
}>(candidates: T[], ancestors: string[]): T | null;
export declare function applyMembershipBenefits(input: ApplyBenefitsInput): ApplyBenefitsResult;
