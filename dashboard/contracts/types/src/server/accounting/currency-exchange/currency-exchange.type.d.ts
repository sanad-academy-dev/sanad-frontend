import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { RateSide } from "@/server/accounting/currency-exchange/currency-exchange.rules";
/**
 * [P1.8] Types for Currency Exchange (BRD §4.7): manual dated rates + the document-facing
 * rate resolver (manual → stored → provider stub → error) with the stale guard.
 */
export declare const currencyExchangeSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly date: true;
    readonly fromCurrencyCode: true;
    readonly toCurrencyCode: true;
    readonly exchangeRate: true;
    readonly forBuying: true;
    readonly forSelling: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type CurrencyExchangeResponse = Prisma.CurrencyExchangeGetPayload<{
    select: typeof currencyExchangeSelect;
}>;
export declare const createCurrencyExchangeSchema: z.ZodObject<{
    date: z.ZodString;
    fromCurrencyCode: z.ZodString;
    toCurrencyCode: z.ZodString;
    exchangeRate: z.ZodString;
    forBuying: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    forSelling: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateCurrencyExchangeFormInput = z.input<typeof createCurrencyExchangeSchema>;
export type CreateCurrencyExchangeFormValues = z.output<typeof createCurrencyExchangeSchema>;
type CurrencyExchangeCreateFields = Prisma.CurrencyExchangeUncheckedCreateInput;
export type CreateCurrencyExchangeInput = Pick<CurrencyExchangeCreateFields, "clinicId" | "fromCurrencyCode" | "toCurrencyCode" | "exchangeRate"> & {
    date: Date;
} & Partial<Pick<CurrencyExchangeCreateFields, "forBuying" | "forSelling" | "createdById">>;
/** Inputs to the §4.7 document-facing rate resolution. */
export type ResolveRateParams = {
    clinicId: string;
    fromCurrencyCode: string;
    toCurrencyCode: string;
    /** the document's posting/transaction date */
    date: Date;
    side: RateSide;
    /** a manual rate already entered on the document — always wins when present */
    manualRate?: string | null;
};
/** Where the resolved rate came from — surfaced so documents can display/audit it. */
export type ResolvedRateSource = "manual" | "stored" | "provider" | "identity";
export type ResolvedRate = {
    rate: string;
    source: ResolvedRateSource;
    /** the stored entry's date when source = stored */
    rateDate: Date | null;
};
export {};
