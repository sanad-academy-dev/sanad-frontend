import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import type { RateSide } from "@/server/accounting/currency-exchange/currency-exchange.rules";

/**
 * [P1.8] Types for Currency Exchange (BRD §4.7): manual dated rates + the document-facing
 * rate resolver (manual → stored → provider stub → error) with the stale guard.
 */

export const currencyExchangeSelect = {
	id: true,
	clinicId: true,
	date: true,
	fromCurrencyCode: true,
	toCurrencyCode: true,
	exchangeRate: true,
	forBuying: true,
	forSelling: true,
	createdAt: true,
	updatedAt: true,
} as const satisfies Prisma.CurrencyExchangeSelect;

export type CurrencyExchangeResponse = Prisma.CurrencyExchangeGetPayload<{
	select: typeof currencyExchangeSelect;
}>;

/** Rates travel as strings so decimal precision survives JSON (contract C2 — rates too). */
const rateString = z
	.string({ error: "سعر الصرف مطلوب" })
	.regex(/^\d+(\.\d{1,9})?$/, "سعر الصرف يجب أن يكون رقمًا موجبًا بحد أقصى 9 منازل عشرية")
	.refine((v) => Number.parseFloat(v) !== 0, "سعر الصرف لا يمكن أن يكون صفرًا");

export const createCurrencyExchangeSchema = z
	.object({
		date: z.string({ error: "التاريخ مطلوب" }).regex(/^\d{4}-\d{2}-\d{2}$/, "التاريخ مطلوب"),
		fromCurrencyCode: z.string({ error: "العملة المصدر مطلوبة" }).trim().min(1),
		toCurrencyCode: z.string({ error: "العملة الهدف مطلوبة" }).trim().min(1),
		exchangeRate: rateString,
		forBuying: z.boolean().optional().default(true),
		forSelling: z.boolean().optional().default(true),
	})
	.refine((v) => v.fromCurrencyCode !== v.toCurrencyCode, {
		message: "العملة المصدر والهدف يجب أن تختلفا",
		path: ["toCurrencyCode"],
	})
	.refine((v) => v.forBuying || v.forSelling, {
		message: "يجب تفعيل شراء أو بيع على الأقل",
		path: ["forSelling"],
	});
export type CreateCurrencyExchangeFormInput = z.input<typeof createCurrencyExchangeSchema>;
export type CreateCurrencyExchangeFormValues = z.output<typeof createCurrencyExchangeSchema>;

type CurrencyExchangeCreateFields = Prisma.CurrencyExchangeUncheckedCreateInput;
export type CreateCurrencyExchangeInput = Pick<
	CurrencyExchangeCreateFields,
	"clinicId" | "fromCurrencyCode" | "toCurrencyCode" | "exchangeRate"
> & { date: Date } & Partial<
		Pick<CurrencyExchangeCreateFields, "forBuying" | "forSelling" | "createdById">
	>;

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
