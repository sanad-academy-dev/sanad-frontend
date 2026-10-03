import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import type { ClaimRejectionResolution } from "@/generated/prisma/enums";
/**
 * [MI-P5] §10.3 — the two rejection resolutions, as SYSTEM journal entries booked inside
 * the resolving transaction (the [P8.2] EGOL vehicle, verbatim: `isSystemGenerated`,
 * submitted in-tx per NFR-1, its id stored on the claim so a later cancel is a LOOKUP and
 * never a search).
 *
 *   (a) إعادة التحميل على وليّ الأمر — Dr Owner AR      / Cr Insurer AR   (rejectedAmount)
 *   (b) شطب                      — Dr write-off acc / Cr Insurer AR   (rejectedAmount)
 *
 * The insurer leg carries `referenceType/referenceId = insurance_claim`, which is what
 * drives the claim's own PLE outstanding down (the P3.4 seam) — that, and not a stored
 * column, is how the claim stops being an open insurer receivable. The owner leg carries
 * NO reference: it is a NEW receivable on the owner, open until they pay it.
 */
type Tx = Prisma.TransactionClient;
export declare function bookClaimResolutionJe(tx: Tx, params: {
    clinicId: string;
    claimId: string;
    claimNo: string | null;
    resolution: ClaimRejectionResolution;
    /** the rejected remainder, positive */
    amount: PrismaNs.Decimal;
    postingDate: Date;
    insurerId: string;
    insurerName: string;
    ownerId: string;
    ownerName: string;
}): Promise<string>;
/** AR-2 append-only reversal of a resolution JE — by id, never by search. */
export declare function cancelClaimResolutionJe(tx: Tx, clinicId: string, jeId: string): Promise<void>;
export {};
