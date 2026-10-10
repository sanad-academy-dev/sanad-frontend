import type { Prisma } from "@/generated/prisma/client";
import { type AccountingPeriodResponse, type CreateAccountingPeriodInput } from "@/server/accounting/accounting-period/accounting-period.type";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P10.1] Accounting Period (BRD FR-12.2) — a submittable date-range lock. A SUBMITTED
 * period whose `closedDocuments` list a voucher type blocks that type from POSTING and
 * from CANCELLING inside [startDate, endDate]; the §6 engine consults
 * {@link assertPeriodOpenFor} at step 3 (submit path) and inside the cancel path's
 * reversal-date check (BR-3.1: the lock applies to the REVERSAL posting date).
 *
 * Lifecycle is implemented directly rather than through the P0.2 voucher framework:
 * a period is NAMED (`periodName`), not numbered — it has no `documentNo`/`postingDate`,
 * so the C7 naming series does not apply (logged convention). Two SUBMITTED periods that
 * close the SAME doc type may not overlap — validated at submit so drafts stay free.
 * Cancelling a period lifts its locks (enforcement only reads SUBMITTED rows).
 */
type Tx = Prisma.TransactionClient;
/**
 * THE FR-12.2 enforcement point — called by the §6 engine (step 3) on the posting date
 * and by the cancel path on the reversal date. Throws (Arabic) when a submitted period
 * closes `voucherType` over `date`.
 */
export declare function assertPeriodOpenFor(tx: Tx, clinicId: string, date: Date, voucherType: string): Promise<void>;
export declare function createAccountingPeriod(input: CreateAccountingPeriodInput): Promise<AccountingPeriodResponse>;
export declare function deleteAccountingPeriod(clinicId: string, id: string): Promise<void>;
export declare function listAccountingPeriods(clinicId: string): Promise<AccountingPeriodResponse[]>;
export declare function getAccountingPeriod(clinicId: string, id: string): Promise<AccountingPeriodResponse>;
export declare function submitAccountingPeriod(clinicId: string, id: string, actor: AccountingActor): Promise<AccountingPeriodResponse>;
export declare function cancelAccountingPeriod(clinicId: string, id: string, actor: AccountingActor): Promise<AccountingPeriodResponse>;
export {};
