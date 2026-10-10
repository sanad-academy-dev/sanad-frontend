import type { Prisma } from "@/generated/prisma/client";
import { type CreatePeriodClosingVoucherInput, type PeriodClosingVoucherResponse } from "@/server/accounting/period-closing/period-closing.type";
import { type VoucherActor } from "@/server/accounting/voucher/voucher.service";
/**
 * [P10.2] Period Closing Voucher (BRD FR-12.3) — closes a period's P&L into the closing
 * account head. Submit assigns the C7 number and ENQUEUES the closing build (AR-7); the
 * job (period-closing.job.ts) posts the closing GLEs and writes the §5.3 snapshots, then
 * stamps `gleProcessingStatus` on the document. With no worker process in this stack, the
 * service RUNS the queued job immediately after the submit/cancel transaction commits —
 * AR-7's constraint (never inside the voucher transaction) is honored, and a future cron
 * changes nothing (idempotencyKey makes re-runs no-ops). Logged decision.
 *
 * BR-12.4 lives here as {@link assertPcvBackPostingAllowed}: after a submitted PCV,
 * postings and cancellations on/before its period end are blocked. ERPNext-parity
 * semantics for opening entries (BRD §12.4 phrasing is ambiguous — logged decision):
 * an all-`isOpening` batch passes ONLY when `ignore_is_opening_check_for_reporting` is
 * on; the PCV's own rows (and their reversals) are always exempt.
 */
type Tx = Prisma.TransactionClient;
/** BR-12.4 — the engine (step 7) and the cancel path both call this. */
export declare function assertPcvBackPostingAllowed(tx: Tx, clinicId: string, postingDate: Date, voucherType: string, allRowsAreOpening: boolean): Promise<void>;
export declare function createPeriodClosingVoucher(input: CreatePeriodClosingVoucherInput): Promise<PeriodClosingVoucherResponse>;
export declare function deletePeriodClosingVoucher(clinicId: string, id: string): Promise<void>;
export declare function listPeriodClosingVouchers(clinicId: string): Promise<PeriodClosingVoucherResponse[]>;
export declare function getPeriodClosingVoucher(clinicId: string, id: string): Promise<PeriodClosingVoucherResponse>;
export declare function submitPeriodClosingVoucher(clinicId: string, id: string, actor: VoucherActor): Promise<PeriodClosingVoucherResponse>;
export declare function cancelPeriodClosingVoucher(clinicId: string, id: string, actor: VoucherActor): Promise<PeriodClosingVoucherResponse>;
export {};
