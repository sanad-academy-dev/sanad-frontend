import { type AmountInput } from "@/server/accounting/format/currency-format";
/**
 * [P0.6] Number to words in Arabic and English — the `in_words` field printed on invoices
 * (BRD §7.2, NFR-6).
 *
 * Pure: takes an amount plus the currency's fraction units and names, and returns a string.
 * The amount is split by {@link splitAmount}, so the fraction is an integer count of the
 * currency's smallest unit (50 halalas for 1.50 SAR, 500 fils for 1.500 JOD) rather than a
 * decimal — 3-decimal currencies are the whole reason this is not `Math.round(x * 100)`.
 *
 * Arabic scope note: the numeral words are inflected (ألف / ألفان / آلاف / ألفًا), but the
 * *currency* name is used as stored — full case agreement (ريال / ريالًا / ريالات) would
 * need per-currency grammatical data the BRD's currency master (§4.7) does not carry.
 */
export type InWordsLang = "ar" | "en";
export type InWordsOptions = {
    fractionUnits: number;
    /** currency name in the target language, e.g. "Saudi Riyal" / "ريال سعودي" */
    currencyName: string;
    /** smallest-unit name, e.g. "Halala" / "هللة" — omitted ⇒ fraction is not spelled out */
    fractionName?: string | null;
    lang: InWordsLang;
};
/** Integer (as a digit string, so amounts beyond 2^53 stay exact) → English words. */
export declare function integerToWordsEn(value: string): string;
/** Integer (as a digit string) → Arabic words. */
export declare function integerToWordsAr(value: string): string;
export declare function integerToWords(value: string, lang: InWordsLang): string;
/**
 * The printable `in_words` string.
 *
 * ```
 * amountInWords("1160.50", { fractionUnits: 2, currencyName: "ريال سعودي",
 *                            fractionName: "هللة", lang: "ar" })
 * // "ألف ومائة وستون ريال سعودي وخمسون هللة فقط لا غير"
 * ```
 */
export declare function amountInWords(amount: AmountInput, options: InWordsOptions): string;
