import { GroomingLane, GroomingModifierCalc, GroomingModifierCode, GroomingServiceKind, GroomingSizeBand } from "@/generated/prisma/enums";
/**
 * التعريفات الافتراضية لدورات التجميل — مصدر واحد بلغة واحدة.
 *
 * لماذا هنا لا في ترحيل SQL: الترحيل يخدم الأكاديميات القائمة وحدها، فتبقى كل أكاديمية
 * تُنشأ بعده أمام شاشة «لا توجد دورات تجميل معرَّفة بعد». والنسختان — واحدة في
 * SQL وأخرى في الشيفرة — تتباعدان مع أول تعديل. التهيئة الكسولة تغطّي الجميع من
 * مصدر واحد، وهي عُرف قائم في المستودع (`ensureDefaultWarehouseId`).
 *
 * **الأسعار أرقام بداية لا أحكام.** وُضعت لتكون معقولة في السوق السعودي ويُتوقَّع
 * أن تعدّلها كل أكاديمية من شاشة الكتالوج. لا شيء هنا مقدَّس.
 */
type GroomingDefaultRow = {
    /** اسم الدورة كما زرعه ترحيل الكتالوج — المطابقة به لأن المعرّفات cuid لكل قاعدة */
    name: string;
    kind: GroomingServiceKind;
    lane: GroomingLane;
    requiresVetOrder: boolean;
    isAddOn: boolean;
    basePrice: number;
    baseDurationMin: number;
    dryingMinutes: number;
    requiresStation: boolean;
};
export declare const GROOMING_DEFAULT_DEFINITIONS: readonly GroomingDefaultRow[];
type ModifierDefault = {
    code: GroomingModifierCode;
    labelAr: string;
    calc: GroomingModifierCalc;
    value: number;
    autoAppliesFrom: number | null;
    requiresOwnerApproval: boolean;
};
/**
 * بلا هذه الصفوف لا يطبّق المحرّك أي رسم، فيخرج طفل ملبَّد الفرو بسعر طفل
 * مُعتنى به. العتبة تُقرأ بحسب الرمز: رتبة درجة التعقّد لـ MATTING، وسنوات العمر
 * لـ SENIOR. المستعجل وخارج الدوام يدويّان دائمًا مهما كانت العتبة.
 */
export declare const GROOMING_DEFAULT_MODIFIERS: readonly ModifierDefault[];
/** صفوف المصفوفة المشتقّة من تعريف واحد — تُصدَّر ليختبرها الاختبار النقي */
export declare const defaultPriceRulesFor: (definition: {
    kind: GroomingServiceKind;
    basePrice: number;
    baseDurationMin: number;
    dryingMinutes: number;
}) => {
    sizeBand: GroomingSizeBand;
    price: number;
    durationMin: number;
    dryingMinutes: number;
}[];
export {};
