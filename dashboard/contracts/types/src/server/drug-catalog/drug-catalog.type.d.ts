import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { CatalogSpecies } from "@/generated/prisma/enums";
export type { CatalogSpecies };
export declare const drugStandardSelectShape: {
    readonly id: true;
    readonly code: true;
    readonly nameEn: true;
    readonly nameAr: true;
    readonly countryCode: true;
    readonly authorityEn: true;
    readonly authorityAr: true;
    readonly sourceUrl: true;
    readonly dataVersion: true;
    readonly fetchedAt: true;
    readonly productCount: true;
    readonly coverageNoteAr: true;
    readonly coverageNoteEn: true;
};
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
export declare const catalogProductSelectShape: {
    readonly id: true;
    readonly registerNumber: true;
    readonly tradeName: true;
    readonly tradeNameAr: true;
    readonly genericName: true;
    readonly genericNameAr: true;
    readonly genericKey: true;
    readonly strength: true;
    readonly strengthUnit: true;
    readonly dosageForm: true;
    readonly routeOfAdministration: true;
    readonly packageType: true;
    readonly packageSize: true;
    readonly packageUnit: true;
    readonly drugType: true;
    readonly legalStatus: true;
    readonly authorizationStatus: true;
    readonly marketingStatus: true;
    readonly shelfLifeMonths: true;
    readonly storageConditions: true;
    readonly manufacturerName: true;
    readonly marketingCompany: true;
    readonly agentName: true;
    readonly atcVetCode: true;
    readonly withdrawalPeriod: true;
    readonly targetAnimalsRaw: true;
    readonly allSpecies: true;
    readonly therapeuticClassCode: true;
    readonly therapeuticClass: {
        readonly select: {
            readonly code: true;
            readonly nameAr: true;
            readonly nameEn: true;
        };
    };
    readonly species: {
        readonly select: {
            readonly species: true;
        };
    };
    readonly standard: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly nameAr: true;
            readonly nameEn: true;
            readonly sourceUrl: true;
        };
    };
};
export type CatalogProductResponse = Prisma.DrugCatalogProductGetPayload<{
    select: typeof catalogProductSelectShape;
}>;
export type CatalogProductListResponse = {
    items: CatalogProductResponse[];
    total: number;
    page: number;
    pageSize: number;
};
export declare const catalogSearchSchema: z.ZodObject<{
    q: z.ZodOptional<z.ZodString>;
    standardId: z.ZodOptional<z.ZodString>;
    species: z.ZodOptional<z.ZodEnum<{
        readonly DOG: "DOG";
        readonly CAT: "CAT";
        readonly HORSE: "HORSE";
        readonly CATTLE: "CATTLE";
        readonly SHEEP: "SHEEP";
        readonly GOAT: "GOAT";
        readonly CAMEL: "CAMEL";
        readonly POULTRY: "POULTRY";
        readonly RABBIT: "RABBIT";
        readonly SWINE: "SWINE";
        readonly FISH: "FISH";
        readonly BEE: "BEE";
    }>>;
    dosageForm: z.ZodOptional<z.ZodString>;
    therapeuticClass: z.ZodOptional<z.ZodString>;
    includeSuspended: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    page: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    pageSize: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type CatalogSearchInput = z.infer<typeof catalogSearchSchema>;
export declare const toggleStandardSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
}, z.core.$strip>;
export type ToggleStandardFormInput = z.infer<typeof toggleStandardSchema>;
/**
 * A standard with no saved choice for a clinic defaults to ON when it is the
 * clinic's own country's regulator, OFF otherwise. Rows are written only when
 * someone actually flips a switch, so a new standard shipped later reaches
 * every clinic in the right default state without a backfill migration.
 */
export declare const DEFAULT_ENABLED: (standardCountryCode: string, clinicCountryCode: string | null) => boolean;
/**
 * Prefill for "create an inventory item from this registered product".
 * Only descriptive fields — never price, stock, or expiry: those are the
 * clinic's own commercial data and the registry knows nothing about them.
 */
export type CatalogPrefill = Pick<CatalogProductResponse, "tradeName" | "genericName" | "dosageForm" | "routeOfAdministration" | "manufacturerName"> & {
    catalogProductId: string;
    strengthLabel: string | null;
    packageLabel: string | null;
};
export declare function toCatalogPrefill(product: CatalogProductResponse): CatalogPrefill;
