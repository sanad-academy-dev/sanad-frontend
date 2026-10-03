import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [P3.2] `update_voucher_outstanding` (BRD BR-5.2.2).
 *
 * Outstanding of a voucher = Σ `amountInAccountCurrency` of all NON-delinked PLEs whose
 * (againstVoucherType, againstVoucherId) point at it. A voucher is fully paid ⇔ the sum
 * rounds to 0 at the account currency's precision.
 *
 * P3 computes; P5 extends this to also STAMP the figure onto invoice documents when
 * those tables exist (the "update" half of the BRD name — there is no voucher table
 * carrying an outstanding column yet).
 */
type Tx = Prisma.TransactionClient;
export type VoucherOutstanding = {
    /** Σ signed non-delinked PLE amounts, account currency — full ledger precision */
    outstanding: PrismaNs.Decimal;
    /** the same sum in base currency */
    outstandingBase: PrismaNs.Decimal;
    accountCurrencyCode: string | null;
    /** true when no PLE points at the voucher at all (nothing owed through the ledger) */
    untracked: boolean;
};
export declare function getVoucherOutstanding(tx: Tx, params: {
    clinicId: string;
    voucherType: string;
    voucherId: string;
}): Promise<VoucherOutstanding>;
/**
 * BR-5.2.2 "fully paid" test at currency precision. `fractionUnits` = the account
 * currency's precision (resolve via the currency master at the call site).
 */
export declare function isFullyPaid(outstanding: PrismaNs.Decimal, fractionUnits: number): boolean;
export {};
