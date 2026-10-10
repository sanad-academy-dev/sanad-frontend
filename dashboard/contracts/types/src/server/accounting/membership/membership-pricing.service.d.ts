import type { Prisma } from "@/generated/prisma/client";
import type { EntitlementInput, MembershipAdjustmentIntent, SnapshotBenefitInput } from "@/server/accounting/membership/membership-benefits.rules";
/**
 * [MI-P2] BR-M6.2.1 — the document → (owner, patient) → membership resolver, and the
 * BR-M5.3.1 consumption commit/restore. ONE resolver for every caller of both seams.
 *
 * Reality correction to the BRD's §6.2 worry (recorded in §17.2): every clinic document
 * (Appointment, LabTestOrder, RadiologyOrder, OperationCase) carries `ownerId` and
 * `patientId` as plain columns, so the callers pass them directly — no four-way join and
 * no denormalized Invoice columns needed (NFR-4 stays a guard clause + indexed reads).
 *
 * NFR-4: with the flag OFF this whole path costs the callers ONE settings read; the
 * membership/benefit/entitlement/patient/service reads run only for a resolved member.
 */
type Tx = Prisma.TransactionClient;
export type MembershipPricingContext = {
    membershipId: string;
    ownerId: string;
    benefits: SnapshotBenefitInput[];
    entitlements: EntitlementInput[];
    /** BR-M6.3: the document's patient belongs to the member owner */
    serviceBenefitsEligible: boolean;
    stacksWithCoupons: boolean;
};
/**
 * Resolve the pricing context for a document. Returns null when the module is OFF, the
 * owner is absent/not a live member, or the membership carries no benefits — the seams
 * treat null as "price exactly as before".
 */
export declare function resolveMembershipPricingContext(params: {
    clinicId: string;
    ownerId: string | null | undefined;
    patientId?: string | null;
    today?: Date;
}): Promise<MembershipPricingContext | null>;
/**
 * Ancestor chains for the line services: [self, parent, grandparent, …]. The tree is
 * three levels (CATEGORY→SUBCATEGORY→ITEM) but the walk is defensive against depth.
 */
export declare function resolveServiceAncestors(serviceIds: string[]): Promise<Record<string, string[]>>;
/**
 * Commit the invoice's consumption intents — INSIDE the payment transaction (NFR-1).
 * The guarded raw UPDATE is the concurrency lock: two invoices racing for the last unit
 * both re-derived intents at pricing, but only the UPDATE whose condition still holds
 * mutates a row; the loser's payment aborts with an Arabic error and reprices.
 */
export declare function commitInvoiceMembershipConsumption(tx: Tx, invoiceId: string): Promise<void>;
/**
 * BR-M5.3.2 — a refund returns consumed units IFF their period is still current; after
 * the period they were period-scoped and stay spent. The adjustment rows remain (audit),
 * with `consumedAt` cleared on the restored ones.
 */
export declare function restoreInvoiceMembershipConsumption(tx: Tx, invoiceId: string, today?: Date): Promise<void>;
/** persistence shape shared by the callers (replace-in-place, the taxes discipline) */
export declare function membershipAdjustmentWriteData(clinicId: string, membershipId: string, adjustments: MembershipAdjustmentIntent[]): {
    clinicId: string;
    idx: number;
    lineRef: string;
    benefitType: import("@/generated/prisma/client").MembershipBenefitType;
    membershipId: string;
    benefitId: string;
    serviceId: string | null;
    amount: string;
    unitsConsumed: number;
    entitlementId: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
}[];
export {};
