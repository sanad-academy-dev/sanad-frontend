import type { Prisma } from "@/generated/prisma/client";
import type { AccountingDoctypeKey } from "@/server/accounting/permissions/accounting-permissions";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
import { type BaseVoucher } from "@/server/accounting/voucher/voucher.state";
/**
 * [P0.2] Generic voucher lifecycle (BRD AR-1, AR-4, NFR-1).
 *
 * Prisma has no model inheritance, so instead of a base class each voucher supplies a
 * {@link VoucherConfig} of small model-specific closures; the generic core owns the
 * invariant behaviour every voucher must share:
 *   - the legal state transitions (voucher.state.ts),
 *   - gap-free documentNo allocation on submit (naming-series, contract C7),
 *   - submitted-doc immutability except a per-voucher whitelist (updateVoucher),
 *   - the audit trail (submittedBy/At, cancelledBy/At),
 *   - the permission gate (P0.3, BRD NFR-5) — checked here rather than only in controllers
 *     so background jobs and posting adapters go through the same door,
 *   - **ONE database transaction per lifecycle event** (NFR-1), retried on transient
 *     Serializable conflicts (serializable-tx.ts),
 *   - ordered submit/cancel hook slots where later phases inject the ledger
 *     (P2 make_gl_entries on submit, make_reverse_gl_entries on cancel).
 *
 * Concurrency: Serializable + optimistic retry. True `SELECT … FOR UPDATE` row-locking on
 * referenced vouchers lands with the posting engine in P2 (BRD §6 cancel path / NFR-1).
 */
/**
 * Who is acting. Deliberately the full {@link AccountingActor} rather than a bare user id:
 * the lifecycle cannot check NFR-5 without the actor's role and permissions, and defaulting
 * a missing actor to "allowed" would make the gate fail open. Non-interactive callers pass
 * `SYSTEM_ACTOR` explicitly.
 */
export type VoucherActor = AccountingActor;
export type SubmitHookContext<T> = {
    tx: Prisma.TransactionClient;
    /** the persisted, now-Submitted document (documentNo assigned) */
    doc: T;
};
export type CancelHookContext<T> = {
    tx: Prisma.TransactionClient;
    /** the persisted, now-Cancelled document */
    doc: T;
};
/** A partial set of field→value changes to apply to a voucher (validated per AR-1). */
export type VoucherChanges = Record<string, unknown>;
export type VoucherConfig<T extends BaseVoucher> = {
    /** naming-series doctype + prefix, e.g. { doctype: "Journal Entry", prefix: "JV" } */
    doctype: string;
    prefix: string;
    /** registry key this voucher's permissions are read from ([P0.3], BRD NFR-5) */
    permissionKey: AccountingDoctypeKey;
    /**
     * Fields editable AFTER submit (BRD AR-1 immutability whitelist). Empty ⇒ fully
     * immutable once submitted. This is where P5's on_update_after_submit repost detection
     * will hook in for account-field edits on submitted invoices.
     */
    updatableAfterSubmit?: readonly string[];
    /** Load the row inside the lifecycle transaction (model-specific). */
    loadForUpdate: (tx: Prisma.TransactionClient, id: string) => Promise<T | null>;
    /** Persist the Draft→Submitted transition with the allocated number + audit stamp. */
    applySubmit: (tx: Prisma.TransactionClient, id: string, patch: {
        documentNo: string;
        submittedAt: Date;
        submittedById: string | null;
    }) => Promise<T>;
    /** Persist the Submitted→Cancelled transition with the audit stamp. */
    applyCancel: (tx: Prisma.TransactionClient, id: string, patch: {
        cancelledAt: Date;
        cancelledById: string | null;
    }) => Promise<T>;
    /** Create a fresh Draft copy of a Cancelled doc, linked via amendedFromId. */
    createAmendment: (tx: Prisma.TransactionClient, source: T, actorId: string | null) => Promise<T>;
    /** Persist an allowed field edit (required to use updateVoucher). */
    applyUpdate?: (tx: Prisma.TransactionClient, id: string, changes: VoucherChanges) => Promise<T>;
    /** Optional validation run before the number is allocated (throw to abort). */
    validateSubmit?: (tx: Prisma.TransactionClient, doc: T) => Promise<void>;
    /** Ledger hook — later phases build & persist GL/PLE here (P2). */
    onSubmit?: (ctx: SubmitHookContext<T>) => Promise<void>;
    /** Ledger reversal hook — later phases append reversals here (P2). */
    onCancel?: (ctx: CancelHookContext<T>) => Promise<void>;
};
/**
 * Draft → Submitted. Allocates the gap-free documentNo, runs validation + the ledger
 * hook, and stamps the audit trail — all inside ONE Serializable transaction (NFR-1).
 */
export declare function submitVoucher<T extends BaseVoucher>(config: VoucherConfig<T>, id: string, actor: VoucherActor): Promise<T>;
/**
 * [P8.2] The submit body, callable INSIDE an already-open voucher transaction — for
 * system documents another voucher's submit must book atomically (BR-7.4.4 EGOL JEs).
 * Permission is the CALLER's responsibility (the outer submit already gated the action).
 */
export declare function submitVoucherInTx<T extends BaseVoucher>(tx: Parameters<VoucherConfig<T>["loadForUpdate"]>[0], config: VoucherConfig<T>, id: string, actor: VoucherActor): Promise<T>;
/**
 * Submitted → Cancelled. Cancels only append (reversals arrive via onCancel in P2);
 * the original document number is retained for audit.
 */
export declare function cancelVoucher<T extends BaseVoucher>(config: VoucherConfig<T>, id: string, actor: VoucherActor): Promise<T>;
/** [P8.2] The cancel body inside an open transaction — see submitVoucherInTx. */
export declare function cancelVoucherInTx<T extends BaseVoucher>(tx: Parameters<VoucherConfig<T>["loadForUpdate"]>[0], config: VoucherConfig<T>, id: string, actor: VoucherActor): Promise<T>;
/**
 * Cancelled → new Draft (BRD AR-1 amend). Creates a fresh editable copy whose
 * amendedFromId points at the cancelled original; the new doc gets its own number on its
 * own submit. Returns the new Draft.
 */
export declare function amendVoucher<T extends BaseVoucher>(config: VoucherConfig<T>, id: string, actor: VoucherActor): Promise<T>;
/**
 * Edit an existing voucher under the AR-1 immutability rule: any field on a DRAFT, only
 * whitelisted fields on a SUBMITTED doc, nothing on a CANCELLED doc. Runs in one
 * Serializable transaction.
 */
export declare function updateVoucher<T extends BaseVoucher>(config: VoucherConfig<T>, id: string, changes: VoucherChanges, actor: VoucherActor): Promise<T>;
