import { type CatalogProductListResponse, type CatalogProductResponse, type CatalogSearchInput, type ClinicDrugStandardResponse, type DrugStandardResponse } from "@/server/drug-catalog/drug-catalog.type";
export declare const drugCatalogDao: {
    /** Every globally active standard, with this clinic's resolved on/off state. */
    listStandards(clinicId: string): Promise<ClinicDrugStandardResponse[]>;
    /** Switches a standard on/off for one clinic. Catalog rows are never touched. */
    setStandardEnabled(clinicId: string, standardId: string, enabled: boolean, userId: string | null): Promise<void>;
    /**
     * Searches the catalogs the clinic has enabled. Returns an empty page — never
     * every standard — when nothing is enabled, so a disabled catalog cannot leak
     * products into a prescribing screen.
     */
    searchProducts(clinicId: string, input: CatalogSearchInput): Promise<CatalogProductListResponse>;
    /** One product, only if its standard is enabled for this clinic. */
    getProduct(clinicId: string, productId: string): Promise<CatalogProductResponse | null>;
    /**
     * Browses ONE standard's contents regardless of whether the clinic has it
     * enabled — this backs the settings screen, where the point is to inspect a
     * catalog before deciding to turn it on. Safe because catalogs are global,
     * read-only reference data with no clinic rows in them.
     *
     * Deliberately NOT the path used by the inventory picker: that one goes
     * through `searchProducts`, which enforces enablement.
     */
    browseStandardProducts(standardId: string, input: Omit<CatalogSearchInput, "standardId">): Promise<CatalogProductListResponse & {
        standard: DrugStandardResponse | null;
    }>;
    /** The therapeutic classes actually present in a standard — drives the filter. */
    listStandardClasses(standardId: string): Promise<{
        code: string;
        nameAr: string;
        order: number;
        nameEn: string;
    }[]>;
    /** Distinct dosage forms within one standard — drives the settings filter. */
    listStandardDosageForms(standardId: string): Promise<string[]>;
    /** Distinct dosage forms across the enabled catalogs — drives the filter list. */
    listDosageForms(clinicId: string): Promise<string[]>;
};
