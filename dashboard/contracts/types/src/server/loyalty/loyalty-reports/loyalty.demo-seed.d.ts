/**
 * الأرقام المثبَّتة — عين ما تؤكّده `loyalty.demo-seed.test.ts`، وما يجب أن يقرأه وليّ الأمر
 * على الشاشة. أيّ تعديلٍ هنا يكسر الحزمة عمدًا.
 */
export declare const LOYALTY_DEMO: {
    /** ١٢٠٠ + ٨٠٠ + ٥٠٠ */
    readonly granted: 2500;
    readonly redeemed: 300;
    readonly adjusted: 200;
    /** (٣٠٠ − ٠) ÷ ٢٥٠٠ */
    readonly redemptionRatePercent: "12.00";
    /** منحة ٢٠٢٤ انتهت في ٢٠٢٥ ⇒ تسقط؛ ٩٠٠ متبقّية + ٨٠٠ + تسوية ٢٠٠ */
    readonly liabilityPoints: 1900;
    /** ١٩٠٠ × ٠٫١ */
    readonly liabilityValue: "190.00";
    readonly liabilityOwners: 1;
    /** الرصيد المشتقّ: المجموع ناقص متبقّي المنحة المنتهية */
    readonly balance: 1900;
};
export declare function seedLoyaltyDemo(clinicId: string): Promise<{
    created: string[];
    existing: string[];
    ownerId: string;
    programId: string;
}>;
