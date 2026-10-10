import type { CatalogSpecies } from "@/generated/prisma/enums";
/**
 * [PH2.1] بوّابات السلامة — BRD_Pharmacy_Module.md §6.
 *
 * نقيّ: لا قاعدة بيانات ولا ساعة. المتحكّم يجمع الحقائق، وهذا الملفّ يقرّر.
 */
/**
 * مانع الاستعمال **رفض لا تحذير**، وغير قابل للتجاوز في الإصدار الأول (§6.1).
 *
 * لماذا لا يُتجاوز: التجاوز المتاح يُستعمل. والحالة النموذجية هنا (الباراسيتامول
 * للقطط) ليست «جرعة كبيرة» بل «لا جرعة آمنة أصلًا» — فلا يوجد رقم يجعلها صحيحة،
 * ومربّع «أنا متأكّد» لا يغيّر ذلك. أي مسار كسر لاحقًا يحتاج قرار وليّ أمر وتسجيلًا
 * مثل سجل المواد المراقبة.
 */
export declare function isContraindicated(monographDose: {
    contraindicated: boolean;
} | null): boolean;
/**
 * تجاوز المدى **مسموح**، والصمت عنه ليس كذلك: سببٌ مسجَّل شرطُ القبول.
 *
 * يُعاد `null` عند القبول، أو نصّ الرفض بالعربية. لا يُرفض التجاوز نفسه — المدرّب
 * قد يكون على حقّ، والنشرة قد تكون أضيق من الواقع السريري. المرفوض هو تجاوزٌ لا
 * يُعرف سببُه بعد شهر.
 */
export declare function validateOverride(input: {
    doseSource: "CALCULATED" | "MANUAL" | "OVERRIDE";
    overrideReasonAr: string | null | undefined;
}): string | null;
export type ActiveTherapyRow = {
    prescriptionCode: string;
    itemName: string;
    therapeuticClassCode: string | null;
};
export type DuplicateTherapyWarning = {
    therapeuticClassCode: string;
    conflictsWith: {
        prescriptionCode: string;
        itemName: string;
    }[];
};
/**
 * تحذير لا رفض (§6.3): وصفُ دوائين من فئة علاجية واحدة قد يكون مقصودًا (تصعيد،
 * تبديل، تغطية) وقد يكون سهوًا. النظام لا يعرف أيّهما، فيُسمّي التعارض ويترك القرار.
 *
 * **الفئة الفارغة لا تُنتج تحذيرًا.** ٨٪ من الكتالوج بلا تصنيف، ومطابقة الفراغ
 * بالفراغ كانت ستُنتج تحذيرًا على كل زوج غير مصنَّف — وهو أسوأ من لا تحذير: تحذيرٌ
 * يتكرّر بلا معنى يُدرَّب المستخدم على تجاهله، فيتجاهل الصحيح معه.
 */
export declare function findDuplicateTherapy(candidateClassCode: string | null, activeTherapies: ActiveTherapyRow[]): DuplicateTherapyWarning | null;
/** الأنواع المنتِجة للغذاء — التحريم يخصّها وحدها */
export declare const FOOD_PRODUCING_SPECIES: ReadonlySet<CatalogSpecies>;
export type WithdrawalDisclosure = {
    applies: false;
} | {
    applies: true;
    stated: true;
    text: string;
} | {
    applies: true;
    stated: false;
    text: string;
};
/**
 * **الفراغ يعني «غير مذكور في السجل»، لا «لا توجد فترة تحريم»** — §0.4، وتعليمة
 * موجودة أصلًا كتعليق عمود في المخطط.
 *
 * الفرق ليس لفظيًّا: لحمٌ أو حليبٌ يدخل السلسلة الغذائية بناءً على «لا تحريم»
 * مستنتَجة من خانة فارغة هو ضرر عامّ لا خطأ عرض. والبيانات هنا شبه غائبة —
 * ١١ صفًّا من ١٣٦٥ في سجل الغذاء والدواء السعودي (BRD §2.4) — فالحالة الغالبة
 * هي بالضبط الحالة الخطرة.
 */
export declare function withdrawalDisclosure(species: CatalogSpecies | null, withdrawalPeriod: string | null | undefined): WithdrawalDisclosure;
