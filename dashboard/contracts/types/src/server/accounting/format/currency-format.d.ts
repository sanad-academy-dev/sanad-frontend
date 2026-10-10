import { Prisma } from "@/generated/prisma/client";
/**
 * [P0.6] Currency rounding & formatting per the currency's fraction units
 * (BRD §4.7, BR-8.1, NFR-2; contract C2).
 *
 * Two rules this module exists to keep:
 *  1. **No JS floats.** Every amount is handled as `Prisma.Decimal` (decimal.js) or a
 *     string. `0.1 + 0.2` is not an acceptable answer in a ledger, and `toFixed` on a
 *     float already lost the digits it is rounding.
 *  2. **Rounding happens at document boundaries only.** Intermediate ledger and tax math
 *     stays at full `Decimal(21,9)` precision; this is what runs when a value is written to
 *     a document total, printed, or compared for "is it paid".
 *
 * Fraction units are per currency, not a constant 2 — JOD/KWD are 3-decimal currencies, and
 * getting that wrong silently mis-rounds every Jordanian invoice.
 */
export type AmountInput = Prisma.Decimal | string | number;
export declare function toDecimal(amount: AmountInput): Prisma.Decimal;
/** Round to the currency's fraction units. Returns a Decimal — still no floats. */
export declare function roundToFractionUnits(amount: AmountInput, fractionUnits: number): Prisma.Decimal;
/**
 * Round to the nearest whole currency unit — the `rounded_total` rule (BR-7.2.5).
 * `roundingAdjustment` = rounded − grand is what the §7 posting maps book.
 */
export declare function roundToNearestUnit(amount: AmountInput): Prisma.Decimal;
/** The canonical string form for storage/comparison at a document boundary. */
export declare function formatAmountPlain(amount: AmountInput, fractionUnits: number): string;
/** True when the amount rounds to zero at this precision — i.e. an invoice is settled. */
export declare function isZeroAtPrecision(amount: AmountInput, fractionUnits: number): boolean;
export type CurrencyFormatOptions = {
    fractionUnits: number;
    /** currency symbol (`ر.س`) or ISO code — appended after the number */
    symbol?: string | null;
    /** grouping locale; digits stay Latin in both languages (repo convention) */
    locale?: string;
};
/**
 * Display form: grouped digits at the currency's precision, symbol trailing.
 *
 * Deliberately not `Intl.NumberFormat({style:"currency"})` like `@/lib/format-currency`:
 * that derives the decimal count from the locale's own rules for the ISO code, which is
 * exactly the decision the currency master is supposed to own here (and it has no answer
 * for a currency the operator added). The existing helper stays for operational screens.
 */
export declare function formatAccountingAmount(amount: AmountInput, { fractionUnits, symbol, locale }: CurrencyFormatOptions): string;
/**
 * Split an amount into whole units and fraction units — what `in_words` needs.
 * The fraction is an integer count of the smallest unit (halalas, fils, agorot), so 1.5 SAR
 * gives 50 halalas and 1.5 JOD gives 500 fils.
 */
export declare function splitAmount(amount: AmountInput, fractionUnits: number): {
    isNegative: boolean;
    whole: string;
    fraction: number;
};
