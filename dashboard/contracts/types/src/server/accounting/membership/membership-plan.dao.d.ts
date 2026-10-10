import { Prisma } from "@/generated/prisma/client";
import type { MembershipPlanStatus } from "@/generated/prisma/enums";
import { type CreateMembershipPlanFormInput, type MembershipPlanResponse } from "@/server/accounting/membership/membership-plan.type";
export declare const membershipPlanDao: {
    list(clinicId: string, status?: MembershipPlanStatus): Promise<MembershipPlanResponse[]>;
    find(clinicId: string, id: string): Promise<MembershipPlanResponse | null>;
    create(clinicId: string, input: CreateMembershipPlanFormInput): Promise<MembershipPlanResponse>;
    /** replace-all benefits with idx re-sequencing; snapshots are untouched (AR-M2) */
    update(clinicId: string, id: string, input: CreateMembershipPlanFormInput): Promise<MembershipPlanResponse>;
    /** P1-Q4: no delete endpoint — INACTIVE (not sellable) is the only retirement path */
    setStatus(clinicId: string, id: string, status: MembershipPlanStatus): Promise<MembershipPlanResponse>;
    /**
     * [MI-P2] §17.1-R1 (owner decision P2-Q1) — a WARNING, never a block: estimate the
     * per-period value of the plan's benefits from the clinic's own service prices
     * (`ClinicServiceConfig.price`) and compare to the fee. Category nodes carry no price
     * and INCLUDED_UNITS on a category cannot be valued — those rows are skipped and the
     * estimate says so (partial = the warning may UNDERestimate, which is the safe side).
     */
    assessPlanValue(clinicId: string, plan: Pick<CreateMembershipPlanFormInput, "fee" | "benefits">): Promise<{
        estimatedValue: string;
        fee: string;
        belowValue: boolean;
        partial: boolean;
    }>;
    findWithBenefits(clinicId: string, id: string, tx?: Prisma.TransactionClient): Promise<({
        benefits: {
            id: string;
            idx: number;
            labelAr: string | null;
            serviceId: string | null;
            discountAmount: import("@prisma/client-runtime-utils").Decimal | null;
            discountPercent: import("@prisma/client-runtime-utils").Decimal | null;
            planId: string;
            benefitType: import("@/generated/prisma/enums").MembershipBenefitType;
            unitsPerPeriod: number | null;
        }[];
    } & {
        name: string;
        id: string;
        clinicId: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        status: MembershipPlanStatus;
        tierRank: number;
        billingInterval: import("@/generated/prisma/enums").SubscriptionInterval;
        intervalCount: number;
        fee: import("@prisma/client-runtime-utils").Decimal;
        enrollmentFee: import("@prisma/client-runtime-utils").Decimal;
        deferRevenue: boolean;
        maxPatients: number | null;
        autoRenew: boolean;
        graceDays: number;
    }) | null>;
};
