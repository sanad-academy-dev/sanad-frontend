import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [P7.3] Allocation math (BR-7.4.2 / BR-7.4.3).
 *
 * Two halves, deliberately separated:
 *
 *  - PURE math (`assertAllocationSign`, `assertDifferenceZero`) — deterministic on the
 *    figures alone, unit-tested without a database.
 *
 *  - `lockAndRevalidateReferences` — the CONCURRENCY GUARD. Draft-time checks ran on
 *    snapshots; between save and submit another payment may have consumed the same
 *    outstanding. So the submit transaction takes ROW LOCKS on every referenced voucher
 *    (stable order: doctype then id — no deadlocks between two payments locking the
 *    same set), and only then re-reads the live PLE outstanding through the [P7.1]
 *    loaders. A second payment allocating against the same invoice BLOCKS on the lock
 *    until the first commits, then re-reads the reduced outstanding and rejects if the
 *    remainder can't cover its allocation — over-allocation is impossible by
 *    construction, not by luck. (runSerializable adds the belt to these braces: even a
 *    plan that dodges the lock aborts on serialization failure.)
 */
type Tx = Prisma.TransactionClient;
/**
 * The lockable reference targets, DERIVED from the one referenceable-doctype list — every
 * doctype's `@@map` table carries the doctype's own name, so the list IS the map.
 *
 * It used to be a hand-kept copy, and [MI-P5] proved what that costs: `insurance_claim`
 * reached the loaders, the allowlist and both validators, then died HERE at submit with
 * «نوع مرجع غير مدعوم» — a payment could be drafted against a claim and never posted.
 * Deriving keeps the `$queryRawUnsafe` guarantee intact (the names are still a fixed
 * literal set from a `as const` list, never user input) while removing the drift.
 */
export declare const LOCK_TABLES: Record<string, string>;
export type AllocationRow = {
    referenceDoctype: string;
    referenceId: string;
    allocatedAmount: string;
    /** display label for errors */
    referenceNo?: string | null;
};
/**
 * BR-7.4.3 sign rule — allocation must run WITH the outstanding's direction and never
 * beyond it: a positive outstanding (invoice) takes 0 < allocated ≤ outstanding; a
 * negative outstanding (return/CN/credit pulled into the payment) takes
 * outstanding ≤ allocated < 0.
 */
export declare function assertAllocationSign(label: string, allocated: PrismaNs.Decimal, outstanding: PrismaNs.Decimal): void;
/** BR-7.4.2 — the difference must be exactly zero at submit (same-currency P7). */
export declare function assertDifferenceZero(difference: PrismaNs.Decimal): void;
export type RevalidatedReference = {
    referenceDoctype: string;
    referenceId: string;
    referenceNo: string | null;
    allocated: PrismaNs.Decimal;
    outstanding: PrismaNs.Decimal;
    dueDate: Date | null;
    billNo: string | null;
    totalAmount: PrismaNs.Decimal;
};
/**
 * The submit-transaction guard: lock every referenced voucher row, then re-read the
 * live outstanding and re-run the BR-7.4.3 sign/cap rules on CURRENT data.
 */
export declare function lockAndRevalidateReferences(tx: Tx, clinicId: string, rows: AllocationRow[]): Promise<RevalidatedReference[]>;
export {};
