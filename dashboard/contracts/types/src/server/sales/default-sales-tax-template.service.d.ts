export declare function ensureDefaultSalesTaxTemplate(clinicId: string): Promise<{
    created: false;
    reason: "already-configured";
} | {
    created: true;
    templateId: string;
    rate: string;
}>;
