import { DocStatus } from "@/generated/prisma/enums";
/**
 * [P0.2] Voucher lifecycle state machine (BRD AR-1). Pure — no DB/env imports — so the
 * transition rules are unit-testable in isolation. Client-facing errors are Arabic
 * (repo convention: thrown Error with an Arabic message passes the app.ts allow-list).
 *
 * Legal transitions:
 *   DRAFT ──submit──▶ SUBMITTED ──cancel──▶ CANCELLED ──amend──▶ (new DRAFT, linked)
 * Submitting is the ONLY event that writes to the ledger; cancels only append reversals.
 */
export { DocStatus };
export declare function assertCanSubmit(status: DocStatus): void;
export declare function assertCanCancel(status: DocStatus): void;
export declare function assertCanAmend(status: DocStatus): void;
/**
 * Guard for editing an existing voucher (BRD AR-1 immutability):
 *  - DRAFT     → any field editable
 *  - SUBMITTED → only fields in `updatableAfterSubmit` may change (the whitelist P5's
 *                on_update_after_submit repost detection later plugs into)
 *  - CANCELLED → immutable; no field may change
 */
export declare function assertCanUpdate(status: DocStatus, changedFields: string[], updatableAfterSubmit: readonly string[]): void;
/** The base columns every voucher carries — the generic lifecycle only touches these. */
export type BaseVoucher = {
    id: string;
    clinicId: string;
    documentNo: string | null;
    docstatus: DocStatus;
    postingDate: Date;
    amendedFromId: string | null;
};
