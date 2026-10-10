import type { Prisma } from "@/generated/prisma/client";
/**
 * [P0.2] Run a callback in ONE Serializable transaction (NFR-1), retrying on transient
 * serialization failures (Prisma P2034 / Postgres 40001) up to {@link MAX_ATTEMPTS} times.
 * Serializable aborts conflicting transactions instead of blocking, so a retry — not a
 * 500 — is the correct response. Non-serialization errors propagate immediately.
 *
 * Raw `SELECT … FOR UPDATE` pessimistic locking on referenced vouchers is scheduled for
 * the P2 posting engine (P2.3); until then this optimistic retry is the concurrency guard.
 */
export declare function runSerializable<R>(fn: (tx: Prisma.TransactionClient) => Promise<R>, maxAttempts?: number): Promise<R>;
