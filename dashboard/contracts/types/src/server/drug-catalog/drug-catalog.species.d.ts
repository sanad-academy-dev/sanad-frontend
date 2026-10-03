import { CatalogSpecies } from "@/generated/prisma/enums";
/**
 * Target-species parsing for imported regulatory drug catalogs.
 *
 * Registries publish target animals as free text, one column, no vocabulary:
 *   "Cattle (Calves), Sheep, Goat, Chicken, Turkey, Cats and Dogs"
 *   "Cattle, Sheep & Goats/ Camels"
 *   "Ruminant,Ruminant,Ruminant,Ruminant,Ruminant"
 * A prescribing screen cannot filter on that, so it is parsed into a child table
 * of normalized species while the original string is always kept verbatim
 * alongside it (regulatory text is never destroyed by our parsing).
 *
 * WORD BOUNDARIES ARE LOAD-BEARING: a naive /cat/ matches "Cattle" and silently
 * labels 600+ livestock-only products as feline. Every Latin pattern below is
 * anchored with \b and the test suite pins that case.
 */
/** One normalized species plus the evidence that produced it. */
export type ParsedTargetSpecies = {
    /** Normalized species, de-duplicated, in a stable order. */
    species: CatalogSpecies[];
    /** Registry said "all species" — must match every species filter. */
    allSpecies: boolean;
    /**
     * Text was present but produced no species. Callers surface this for review
     * rather than treating it as "targets nothing".
     */
    unrecognized: boolean;
};
/**
 * Parses a registry's free-text target-animal string into normalized species.
 * Never throws; unparseable input comes back as `unrecognized` so the importer
 * can report it instead of silently dropping a product's species.
 */
export declare function parseTargetSpecies(raw: string | null | undefined): ParsedTargetSpecies;
/**
 * Maps a catalog species onto the `AnimalType.enName` seeded in
 * `src/lib/seed-defaults.ts`, so a patient's animal type can filter the catalog.
 * Species with no clinic-side animal type (camel, swine, bee) map to null —
 * they still exist in the catalog, they just never match a patient filter.
 */
export declare const SPECIES_TO_ANIMAL_TYPE: Record<CatalogSpecies, string | null>;
/** Reverse lookup: which catalog species does this clinic animal type mean? */
export declare function speciesForAnimalType(animalTypeEnName: string): CatalogSpecies | null;
/**
 * Normalizes an active-ingredient name into the monograph join key.
 *
 * The SFDA registry publishes NO ATCvet codes (0 of 1365 products), so the
 * generic name is the only available join between a regulatory product and a
 * clinical monograph. It is noisy — trailing commas, "(as X salt)" qualifiers,
 * double spaces — so both sides key on this normalized form.
 */
export declare function normalizeGenericKey(genericName: string): string;
