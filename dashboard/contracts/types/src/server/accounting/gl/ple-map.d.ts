import type { Prisma } from "@/generated/prisma/client";
/**
 * [P3.2] PLE derivation math (BRD §5.2) — PURE module, mirror of `gl-map.ts`.
 *
 * Sign convention (the §5.2 matrix, unit-locked in `ple-map.test.ts`):
 *
 * |            | debit | credit |
 * |------------|-------|--------|
 * | RECEIVABLE |   +   |   −    |
 * | PAYABLE    |   −   |   +    |
 *
 * An invoice DEBITS its receivable (customer owes more) ⇒ +amount; a receipt CREDITS it
 * ⇒ −amount; the payable side mirrors. Outstanding (BR-5.2.2) is then a plain Σ of
 * non-delinked rows pointing at the voucher.
 */
export type PleSide = "RECEIVABLE" | "PAYABLE";
export declare const PLE_SIDES: readonly PleSide[];
export declare function isPleSide(value: string | null | undefined): value is PleSide;
/** Signed PLE amount for one GLE (§5.2): net of the row's debit/credit, sign per side. */
export declare function pleAmount(side: PleSide, debit: Prisma.Decimal, credit: Prisma.Decimal): Prisma.Decimal;
/** BR-5.2.1: PLE derivation is skipped entirely for the Period Closing Voucher. */
export declare function skipPleFor(voucherType: string): boolean;
export type PleSliceSplit = {
    consumedBase: Prisma.Decimal;
    consumedAcc: Prisma.Decimal;
    remainderBase: Prisma.Decimal;
    remainderAcc: Prisma.Decimal;
};
/**
 * [P8.0] Split one PLE self-row into a consumed slice and a remainder, FX-proportionally
 * (P8 dossier risk 1). The row carries TWO amounts — base (`amount`) and account currency
 * (`amountInAccountCurrency`) — which differ once exchange rates ≠ 1. Consumption is
 * expressed in ACCOUNT currency (that is what `getVoucherOutstanding`/BR-5.2.2 sums and
 * what every caller allocates in); the base share derives proportionally at ledger
 * precision. The remainder is computed by SUBTRACTION, never by a second proportion, so
 * `consumed + remainder` reconstructs the original row EXACTLY in both columns — the §5.2
 * Σ-per-voucher invariant survives any rounding of the division.
 *
 * All figures are magnitudes (callers own the §5.2 sign).
 */
export declare function splitPleSlice(rowBase: Prisma.Decimal, rowAcc: Prisma.Decimal, consumedAcc: Prisma.Decimal, precision?: number): PleSliceSplit;
