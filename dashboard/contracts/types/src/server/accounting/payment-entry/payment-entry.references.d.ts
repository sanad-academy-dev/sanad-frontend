import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
/**
 * [P7.1] Payment Entry reference loaders — the §7.4 reference-row source of truth.
 *
 * One loader per referenceable doctype (the P7 set: both accounting invoices and the
 * journal entry). A loader returns the document's identity + the SNAPSHOT figures a
 * reference row stores (total, due date, bill no) — the live outstanding always comes
 * from the PLE (`getVoucherOutstanding`), never from the document (BR-5.2.2).
 *
 * Draft-time use: populate/refresh snapshots. Submit-time use ([P7.3]): the same
 * loaders run inside the submit transaction AFTER row locks, so the re-validated
 * outstanding is the one the posting consumes (BR-7.4.3).
 */
type Tx = Prisma.TransactionClient;
export type ReferenceSnapshot = {
    docstatus: DocStatus;
    documentNo: string | null;
    partyType: string | null;
    partyId: string | null;
    postingDate: Date | null;
    dueDate: Date | null;
    billNo: string | null;
    totalAmount: PrismaNs.Decimal;
    /** live PLE outstanding (signed per the §5.2 matrix), in the ACCOUNT currency */
    outstanding: PrismaNs.Decimal;
    /** [P8.2] the rate the reference was BOOKED at (invoice conversionRate; derived
     *  base/acc ratio for PE/JE credits; 1 for base-currency documents) — the BR-7.4.4
     *  gain/loss compares the payment's rate against THIS figure */
    conversionRate: PrismaNs.Decimal;
};
type ReferenceLoader = (tx: Tx, clinicId: string, referenceId: string) => Promise<ReferenceSnapshot | null>;
export declare const PE_REFERENCE_LOADERS: Record<string, ReferenceLoader>;
/** Load one snapshot or throw the Arabic not-found/unsupported errors. */
export declare function loadReferenceSnapshot(tx: Tx, clinicId: string, referenceDoctype: string, referenceId: string): Promise<ReferenceSnapshot>;
export {};
