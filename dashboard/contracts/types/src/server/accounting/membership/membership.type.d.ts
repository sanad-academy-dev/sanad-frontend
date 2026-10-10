import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [MI-P1] Membership types (MI BRD §5). BROWSER-SAFE: Prisma appears as a TYPE only.
 */
export declare const enrollMembershipSchema: z.ZodObject<{
    ownerId: z.ZodString;
    planId: z.ZodString;
}, z.core.$strip>;
export type EnrollMembershipFormInput = z.infer<typeof enrollMembershipSchema>;
/** BR-M5.2.1 + [P12B.1] discipline: cancel demands a reason, always */
export declare const cancelMembershipSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type CancelMembershipFormInput = z.infer<typeof cancelMembershipSchema>;
export declare const schedulePlanChangeSchema: z.ZodObject<{
    planId: z.ZodString;
}, z.core.$strip>;
export type SchedulePlanChangeFormInput = z.infer<typeof schedulePlanChangeSchema>;
export declare const membershipBenefitSelect: {
    readonly id: true;
    readonly idx: true;
    readonly benefitType: true;
    readonly serviceId: true;
    readonly service: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly discountPercent: true;
    readonly discountAmount: true;
    readonly unitsPerPeriod: true;
    readonly labelAr: true;
    readonly supersededAt: true;
};
export declare const membershipEntitlementSelect: {
    readonly id: true;
    readonly benefitId: true;
    readonly periodStart: true;
    readonly periodEnd: true;
    readonly unitsGranted: true;
    readonly unitsConsumed: true;
    readonly benefit: {
        readonly select: {
            readonly benefitType: true;
            readonly serviceId: true;
            readonly labelAr: true;
            readonly service: {
                readonly select: {
                    readonly name: true;
                };
            };
        };
    };
};
export declare const membershipSelect: {
    readonly id: true;
    readonly code: true;
    readonly clinicId: true;
    readonly ownerId: true;
    readonly owner: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
            readonly phone: true;
        };
    };
    readonly planId: true;
    readonly plan: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly tierRank: true;
            readonly status: true;
        };
    };
    readonly scheduledPlanId: true;
    readonly scheduledPlan: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly subscriptionId: true;
    readonly subscription: {
        readonly select: {
            readonly startDate: true;
        };
    };
    readonly status: true;
    readonly currentPeriodStart: true;
    readonly currentPeriodEnd: true;
    readonly feeSnapshot: true;
    readonly intervalSnapshot: true;
    readonly intervalCountSnapshot: true;
    readonly graceDaysSnapshot: true;
    readonly autoRenewSnapshot: true;
    readonly cancelledAt: true;
    readonly cancelReason: true;
    readonly createdAt: true;
};
export type MembershipResponse = Prisma.MembershipGetPayload<{
    select: typeof membershipSelect;
}>;
export type MembershipBenefitResponse = Prisma.MembershipBenefitGetPayload<{
    select: typeof membershipBenefitSelect;
}>;
export type MembershipEntitlementResponse = Prisma.MembershipEntitlementGetPayload<{
    select: typeof membershipEntitlementSelect;
}>;
/** the current period's generated invoice, for the pay-now handoff */
export type MembershipInvoiceRef = {
    salesInvoiceId: string;
    documentNo: string | null;
    status: string;
    outstandingAmount: string;
    periodStartDate: string;
    periodEndDate: string;
} | null;
export type MembershipDetailResponse = MembershipResponse & {
    benefits: MembershipBenefitResponse[];
    entitlements: MembershipEntitlementResponse[];
    currentInvoice: MembershipInvoiceRef;
};
export type EnrollMembershipResult = {
    membership: MembershipDetailResponse;
    /** non-null when the first invoice could not be generated — the daily job retries */
    billingError: string | null;
};
