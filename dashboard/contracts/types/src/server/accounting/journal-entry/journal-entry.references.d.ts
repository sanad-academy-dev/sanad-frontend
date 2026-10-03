import type { Prisma } from "@/generated/prisma/client";
/**
 * [P3.4] JE voucher references — the BR-7.1.2 validation shell.
 *
 * A JE row may settle AGAINST another voucher (`referenceType`/`referenceId`); the row's
 * allocation then reduces that voucher's outstanding through the PLE (`against_voucher` =
 * the reference — wired in `buildGlMap`). Validation, per BR-7.1.2:
 *   1. the reference doctype must be registered here (a resolver exists),
 *   2. the referenced doc exists in the same clinic and is SUBMITTED,
 *   3. it belongs to the SAME party as the referencing row,
 *   4. it still has outstanding, and the row's allocation ≤ that outstanding.
 *
 * Only `journal_entry` is referenceable in P3 — `sales_invoice` (P5) and
 * `purchase_invoice` (P6) add their resolvers to {@link REFERENCE_RESOLVERS} when their
 * doctypes land. The registry IS the "targets arrive later" seam.
 */
type Tx = Prisma.TransactionClient;
export type ResolvedReference = {
    docstatus: string;
    documentNo: string | null;
};
type ReferenceResolver = (tx: Tx, clinicId: string, referenceId: string) => Promise<ResolvedReference | null>;
export declare const REFERENCE_RESOLVERS: Record<string, ReferenceResolver>;
export type JeReferenceRow = {
    accountName: string;
    debit: string;
    credit: string;
    partyType?: string | null;
    partyId?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
};
/** Draft-time (light) checks: shape only — no outstanding reads while amounts move. */
export declare function assertReferenceShape(row: JeReferenceRow): void;
/**
 * Submit-time (full) BR-7.1.2 validation — runs inside the submit transaction so the
 * outstanding it reads is the one the posting will consume.
 */
export declare function validateJeReferences(tx: Tx, clinicId: string, rows: JeReferenceRow[]): Promise<void>;
export {};
