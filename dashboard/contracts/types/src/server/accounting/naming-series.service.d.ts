import type { Prisma } from "@/generated/prisma/client";
import { type NextDocumentNoArgs, type NextDocumentNoResult } from "@/server/accounting/naming-series.format";
/**
 * [P0.1] Voucher naming series — `{PREFIX}-{YYYY}-{#####}` per (company, doctype, year).
 *
 * Legal voucher numbers must be gap-free per company and year, so the counter is assigned
 * **on submit, inside the submit transaction** (contract C7). `nextDocumentNo` therefore
 * takes a Prisma transaction client and participates in the caller's transaction — never
 * allocate a number for a draft.
 */
export { formatDocumentNo, type NextDocumentNoArgs, type NextDocumentNoResult, seriesYearOf, } from "@/server/accounting/naming-series.format";
/**
 * Allocate the next sequential number for (clinic, doctype, year) atomically.
 * MUST be called with the submit transaction's client so the number is only consumed
 * when the voucher actually submits. The unique (clinicId, doctype, year) constraint +
 * the atomic increment keep the sequence gap-free under concurrency.
 */
export declare function nextDocumentNo(tx: Prisma.TransactionClient, args: NextDocumentNoArgs): Promise<NextDocumentNoResult>;
/**
 * Standalone allocation for callers not already inside a transaction (tooling, backfills,
 * tests). Voucher submits must prefer {@link nextDocumentNo} inside their own submit
 * transaction (contract C7) so a rolled-back submit never burns a number.
 *
 * Deliberately NOT Serializable: the allocation is a single atomic upsert whose
 * `counter + 1` is evaluated against the latest committed row version, so Read Committed
 * is already gap-free — and it *blocks* on contention instead of aborting, where
 * Serializable would abort every concurrent allocator (SQLSTATE 40001) and turn a hot
 * counter into a retry storm. The only race left is two callers creating the very first
 * row for a (clinic, doctype, year); that surfaces as a unique violation and is retried,
 * after which the row exists and every caller takes the conflict-free update path.
 */
export declare function allocateDocumentNo(args: NextDocumentNoArgs): Promise<NextDocumentNoResult>;
