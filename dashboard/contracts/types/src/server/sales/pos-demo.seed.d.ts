export declare const POS_DEMO: {
    readonly itemName: "شامبو علاجي (عرض)";
    /** بادئة فقط — الرمز نفسه يُولَّد، لأن `code` فريد على مستوى القاعدة كلها */
    readonly itemCodePrefix: "ITM-POS";
    readonly unitPrice: 80;
    readonly unitCost: 30;
    readonly openingQty: 10;
};
export declare function seedPosDemo(clinicId: string): Promise<{
    created: string[];
    existing: string[];
}>;
