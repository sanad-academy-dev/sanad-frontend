import type { Prisma } from "@/generated/prisma/client";
import type { MembershipStatus } from "@/generated/prisma/enums";
import { type EnrollMembershipResult, type MembershipDetailResponse, type MembershipResponse, membershipSelect } from "@/server/accounting/membership/membership.type";
import { type PeriodInvoiceState } from "@/server/accounting/membership/membership-status.rules";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export declare function enrollMembership(params: {
    clinicId: string;
    ownerId: string;
    planId: string;
    actor: AccountingActor;
    today?: Date;
}): Promise<EnrollMembershipResult>;
export declare function getMembership(clinicId: string, id: string, today?: Date): Promise<MembershipDetailResponse>;
export declare function listMemberships(clinicId: string, filters?: {
    status?: MembershipStatus;
    planId?: string;
    ownerId?: string;
}, today?: Date): Promise<MembershipResponse[]>;
/** the owner-profile badge read: the owner's non-terminal membership, if any */
export declare function findOwnerMembership(clinicId: string, ownerId: string, today?: Date): Promise<MembershipDetailResponse | null>;
/**
 * BR-M5.2.2 / §17-O2: benefits stop immediately and NO automatic refund is posted — any
 * refund is the operator's explicit action through the existing invoice refund path
 * ([P12B.1], mandatory reason, audited). The engine's cancel leaves already-generated
 * invoices untouched (money genuinely owed is not erased by stopping the subscription).
 */
export declare function cancelMembership(params: {
    clinicId: string;
    id: string;
    reason: string;
    actor: AccountingActor;
}): Promise<MembershipDetailResponse>;
/** BR-M5.4.2 v1 — schedule the plan swap for the next roll; nothing moves mid-period */
export declare function schedulePlanChange(params: {
    clinicId: string;
    id: string;
    planId: string;
}): Promise<MembershipDetailResponse>;
export type MembershipDailyResult = {
    billed: number;
    rolled: number;
    statusChanges: {
        membershipId: string;
        from: MembershipStatus;
        to: MembershipStatus;
    }[];
    errors: {
        membershipId: string;
        message: string;
    }[];
};
/**
 * §5.4 in order: (1) the engine's idempotent billing run; (2) per-membership period roll
 * (BR-M5.4.1 re-snapshot / BR-M5.4.2 scheduled swap) + entitlement rows (BR-M5.3.4);
 * (3) status derivation; (4) inbox notifications. One membership failing never aborts the
 * run — the runner's own discipline.
 */
export declare function runMembershipDaily(clinicId: string, asOf: Date, actor: AccountingActor): Promise<MembershipDailyResult>;
/** shared with the controller's /run and tests — the SalesInvoice truth for one membership */
export type { PeriodInvoiceState };
export type MembershipRollProbe = Prisma.MembershipGetPayload<{
    select: typeof membershipSelect;
}>;
