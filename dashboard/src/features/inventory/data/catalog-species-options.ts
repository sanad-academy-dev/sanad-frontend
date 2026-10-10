import { CatalogSpecies } from "@/generated/prisma/enums";

/**
 * Arabic labels for the normalized catalog species, in the order used across
 * the catalog UI. Derived from the Prisma enum so a new species can't be added
 * to the schema and silently go unlabelled.
 */
export const CATALOG_SPECIES_OPTIONS: { value: CatalogSpecies; label: string }[] = [
	{ value: CatalogSpecies.DOG, label: "كلاب" },
	{ value: CatalogSpecies.CAT, label: "قطط" },
	{ value: CatalogSpecies.HORSE, label: "خيول" },
	{ value: CatalogSpecies.CATTLE, label: "أبقار" },
	{ value: CatalogSpecies.SHEEP, label: "أغنام" },
	{ value: CatalogSpecies.GOAT, label: "ماعز" },
	{ value: CatalogSpecies.CAMEL, label: "إبل" },
	{ value: CatalogSpecies.POULTRY, label: "دواجن وطيور" },
	{ value: CatalogSpecies.RABBIT, label: "أرانب" },
	{ value: CatalogSpecies.SWINE, label: "خنازير" },
	{ value: CatalogSpecies.FISH, label: "أسماك" },
	{ value: CatalogSpecies.BEE, label: "نحل" },
];

export const CATALOG_SPECIES_LABEL: Record<CatalogSpecies, string> = Object.fromEntries(
	CATALOG_SPECIES_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CatalogSpecies, string>;
