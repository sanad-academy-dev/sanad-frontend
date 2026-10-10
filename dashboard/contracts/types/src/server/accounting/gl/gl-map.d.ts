import { Prisma } from "@/generated/prisma/client";
export declare const ZERO: import("@prisma/client-runtime-utils").Decimal;
/** One row of a voucher's gl_map, BEFORE the engine processes it. Amounts as strings. */
export type GlMapRow = {
    accountId: string;
    /** base-currency pair — required */
    debit: string;
    credit: string;
    /** account-currency pair — defaults to the base pair (single-currency P0–P7, rate=1) */
    debitInAccountCurrency?: string;
    creditInAccountCurrency?: string;
    /** transaction-currency pair — defaults to the base pair */
    transactionCurrencyCode?: string | null;
    transactionExchangeRate?: string | null;
    debitInTransactionCurrency?: string;
    creditInTransactionCurrency?: string;
    partyType?: string | null;
    partyId?: string | null;
    against?: string | null;
    voucherDetailNo?: string | null;
    againstVoucherType?: string | null;
    againstVoucherId?: string | null;
    costCenterId?: string | null;
    projectId?: string | null;
    financeBookId?: string | null;
    dim1?: string | null;
    dim2?: string | null;
    dim3?: string | null;
    dim4?: string | null;
    isOpening?: boolean;
    isAdvance?: boolean;
    dueDate?: Date | null;
    remarks?: string | null;
    transactionDate?: Date | null;
    /** §6 5b — a row may opt out of merging (ERPNext `_skip_merge`) */
    skipMerge?: boolean;
};
/** The three debit/credit pairs a GLE carries (AR-5), as decimals for engine math. */
export type Triplet = {
    debit: Prisma.Decimal;
    credit: Prisma.Decimal;
    debitInAccountCurrency: Prisma.Decimal;
    creditInAccountCurrency: Prisma.Decimal;
    debitInTransactionCurrency: Prisma.Decimal;
    creditInTransactionCurrency: Prisma.Decimal;
};
export type WorkingRow = Omit<GlMapRow, "debit" | "credit" | "debitInAccountCurrency" | "creditInAccountCurrency" | "debitInTransactionCurrency" | "creditInTransactionCurrency"> & Triplet;
/** Lift string amounts to decimals; missing account/transaction pairs default to base. */
export declare function toWorkingRow(row: GlMapRow): WorkingRow;
/**
 * §6 5b merge key: rows that agree on ALL of these merge into one GLE. `voucher_no` is in
 * ERPNext's key but is constant within one batch here (one voucher per make_gl_entries
 * call), so it is omitted.
 */
export declare function mergeKey(row: WorkingRow): string;
/** The EGOL exemption (§6 5b + 8): Exchange Gain Or Loss entries survive zero-drops. */
export declare function isExchangeGainLoss(voucherSubtype: string | null | undefined): boolean;
/**
 * §6 5b — merge similar entries. `skipMerge` rows pass through untouched. After merging,
 * rows whose debit AND credit both round to zero at `precision` are dropped — unless the
 * batch is an Exchange Gain Or Loss entry (`keepZeroRows`).
 */
export declare function mergeSimilar(rows: WorkingRow[], options: {
    mergeEntries: boolean;
    precision: number;
    keepZeroRows: boolean;
}): WorkingRow[];
/**
 * §6 5c — toggle negatives: a negative debit becomes a positive credit (and vice versa),
 * applied independently to each of the three currency pairs so all triplets stay aligned.
 */
export declare function toggleNegatives(rows: WorkingRow[]): WorkingRow[];
/** Σdebit − Σcredit in base currency, rounded to `precision` (§6 step 8). */
export declare function sumDifference(rows: WorkingRow[], precision: number): Prisma.Decimal;
/**
 * §6 step 8 allowance table: Journal Entry & Payment Entry → 5/10^precision; every other
 * voucher → 0.5 (absorbable into round-off).
 */
export declare function allowanceFor(voucherType: string, precision: number): Prisma.Decimal;
/** The smallest representable amount at `precision` — diffs below it are ignored. */
export declare function smallestUnit(precision: number): Prisma.Decimal;
export type RoundOffDecision = {
    kind: "balanced";
} | {
    kind: "round_off";
    diff: Prisma.Decimal;
} | {
    kind: "throw";
    diff: Prisma.Decimal;
};
/** §6 step 8 decision: ignore, absorb via round-off GLE, or reject the batch. */
export declare function decideRoundOff(diff: Prisma.Decimal, allowance: Prisma.Decimal, precision: number): RoundOffDecision;
