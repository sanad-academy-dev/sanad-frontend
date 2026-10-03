import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { CatalogSpecies } from "@/generated/prisma/enums";

export type { CatalogSpecies };

// ── standards ───────────────────────────────────────────────────────────────

export const drugStandardSelectShape = {
	id: true,
	code: true,
	nameEn: true,
	nameAr: true,
	countryCode: true,
	authorityEn: true,
	authorityAr: true,
	sourceUrl: true,
	dataVersion: true,
	fetchedAt: true,
	productCount: true,
	coverageNoteAr: true,
	coverageNoteEn: true,
} as const;

export type DrugStandardResponse = Prisma.DrugStandardGetPayload<{
	select: typeof drugStandardSelectShape;
}>;

/**
 * A standard as one clinic sees it: the global record plus this clinic's on/off
 * state. `enabled` is always resolved — never undefined — see `DEFAULT_ENABLED`.
 */
export type ClinicDrugStandardResponse = DrugStandardResponse & {
	enabled: boolean;
	/**
	 * false when no explicit choice was ever saved for this clinic and `enabled`
	 * came from the country default. Lets the UI mark it as a suggestion.
	 */
	isExplicit: boolean;
};

// ── catalog products ────────────────────────────────────────────────────────

export const catalogProductSelectShape = {
	id: true,
	registerNumber: true,
	tradeName: true,
	tradeNameAr: true,
	genericName: true,
	genericNameAr: true,
	genericKey: true,
	strength: true,
	strengthUnit: true,
	dosageForm: true,
	routeOfAdministration: true,
	packageType: true,
	packageSize: true,
	packageUnit: true,
	drugType: true,
	legalStatus: true,
	authorizationStatus: true,
	marketingStatus: true,
	shelfLifeMonths: true,
	storageConditions: true,
	manufacturerName: true,
	marketingCompany: true,
	agentName: true,
	atcVetCode: true,
	withdrawalPeriod: true,
	targetAnimalsRaw: true,
	allSpecies: true,
	therapeuticClassCode: true,
	therapeuticClass: { select: { code: true, nameAr: true, nameEn: true } },
	species: { select: { species: true } },
	standard: { select: { id: true, code: true, nameAr: true, nameEn: true, sourceUrl: true } },
} as const;

export type CatalogProductResponse = Prisma.DrugCatalogProductGetPayload<{
	select: typeof catalogProductSelectShape;
}>;

export type CatalogProductListResponse = {
	items: CatalogProductResponse[];
	total: number;
	page: number;
	pageSize: number;
};

// ── query / mutation input ──────────────────────────────────────────────────

export const catalogSearchSchema = z.object({
	q: z.string().optional(),
	standardId: z.string().optional(),
	species: z.enum(CatalogSpecies).optional(),
	dosageForm: z.string().optional(),
	/** Canonical therapeutic class code (ANTIBIOTIC, ANAESTHETIC, ...). */
	therapeuticClass: z.string().optional(),
	/** Registries keep suspended products listed; hidden unless asked for. */
	includeSuspended: z.boolean().optional().default(false),
	page: z.coerce.number().int().min(1).optional().default(1),
	pageSize: z.coerce.number().int().min(1).max(100).optional().default(25),
});

export type CatalogSearchInput = z.infer<typeof catalogSearchSchema>;

export const toggleStandardSchema = z.object({
	enabled: z.boolean({ error: "الحالة مطلوبة" }),
});

export type ToggleStandardFormInput = z.infer<typeof toggleStandardSchema>;

/**
 * A standard with no saved choice for a clinic defaults to ON when it is the
 * clinic's own country's regulator, OFF otherwise. Rows are written only when
 * someone actually flips a switch, so a new standard shipped later reaches
 * every clinic in the right default state without a backfill migration.
 */
export const DEFAULT_ENABLED = (
	standardCountryCode: string,
	clinicCountryCode: string | null,
) =>
	!!clinicCountryCode && standardCountryCode.toUpperCase() === clinicCountryCode.toUpperCase();

/**
 * Prefill for "create an inventory item from this registered product".
 * Only descriptive fields — never price, stock, or expiry: those are the
 * clinic's own commercial data and the registry knows nothing about them.
 */
export type CatalogPrefill = Pick<
	CatalogProductResponse,
	"tradeName" | "genericName" | "dosageForm" | "routeOfAdministration" | "manufacturerName"
> & {
	catalogProductId: string;
	strengthLabel: string | null;
	packageLabel: string | null;
};

export function toCatalogPrefill(product: CatalogProductResponse): CatalogPrefill {
	const strengthLabel =
		[product.strength, product.strengthUnit].filter(Boolean).join(" ") || null;
	const packageLabel =
		[product.packageSize, product.packageUnit].filter(Boolean).join(" ") ||
		product.packageType ||
		null;

	return {
		catalogProductId: product.id,
		tradeName: product.tradeName,
		genericName: product.genericName,
		dosageForm: product.dosageForm,
		routeOfAdministration: product.routeOfAdministration,
		// APVMA names the registration holder, SFDA the manufacturer — show whichever exists
		manufacturerName: product.manufacturerName ?? product.marketingCompany,
		strengthLabel,
		packageLabel,
	};
}
