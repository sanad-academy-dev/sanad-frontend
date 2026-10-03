import type { Prisma } from "@/generated/prisma/client";
/**
 * [P5.5] Settlement subscription seam (BR-7.2.1 "on submit & every payment event").
 *
 * Every path that writes or reverses payment_ledger_entry rows notifies the doctypes
 * whose documents those rows settle AGAINST, so voucher-level outstanding/status stay
 * derived from the PLE — never recomputed ad hoc, never from GL. `sales_invoice`
 * registers here (P5.5); `purchase_invoice` joins in P6. Registration is module-load
 * side-effectful and the engine iterates only doctypes that actually registered, so the
 * gl layer keeps zero imports from voucher modules (no cycles).
 */
type Tx = Prisma.TransactionClient;
export type SettlementRef = {
    voucherType: string;
    voucherId: string;
};
export type SettlementSubscriber = (tx: Tx, clinicId: string, voucherId: string) => Promise<void>;
export declare function registerSettlementSubscriber(voucherType: string, subscriber: SettlementSubscriber): void;
/** Fan out to registered doctypes, deduplicated — call INSIDE the writing transaction. */
export declare function notifySettlementChange(tx: Tx, clinicId: string, refs: SettlementRef[]): Promise<void>;
export {};
