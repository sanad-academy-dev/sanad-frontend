import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [PH1.2] محرّك الجرعة — BRD_Pharmacy_Module.md §5.
 *
 * **نقيّ تمامًا**: لا قاعدة بيانات، ولا ساعة، ولا دخل/خرج. يُنفَّذ في السويّة السريعة
 * على كل دفعة (القاعدة 14)، وهو المكان الصحيح لحسابٍ يقرّر ما يدخل جسم طفل.
 *
 * ── ما لا يفعله هذا الملفّ، وهو أهمّ ممّا يفعله ──────────────────────────────
 *
 * **لا يُخمّن، ولا يُكمل، ولا «يُعيد بناء» جرعة.** §0.4 من الـBRD، وتعليمة
 * `scripts/catalog/README.md` قبلها: «جرعة ملفَّقة في نظام سريري حادثةُ سلامة طفل،
 * لا عيب جودة بيانات». فكل نقص هنا يُعاد كـ**رفض مُصنَّف**، لا كرقم.
 *
 * **لا يقرأ `frequency` كعدد.** النشرة تحفظ التواتر نصًّا حرًّا («BID»، «q12h»،
 * «مرتين يوميًا»)، وتحويل ذلك النصّ إلى رقم هو تخمينٌ بالضبط: «q12h» ليست دائمًا
 * مرّتين، و«PRN» ليست عددًا أصلًا. فالواصف يُدخل `timesPerDay` صراحةً، والمحرّك
 * يضرب. النصّ يُعرض للمدرّب كما هو ولا يُفسَّر.
 *
 * **لا يقصّ الجرعة إلى حدود المدى.** جرعةٌ خارج [doseMin, doseMax] تُصنَّف `OVERRIDE`
 * وتطلب سببًا مسجَّلًا (§6.2). القصّ الصامت يُخفي قرارًا سريريًّا كان يجب أن يُرى.
 */
/** أسباب امتناع المحرّك عن إعطاء رقم — كلٌّ منها يُعرض بنصّه الخاصّ (§5.3) */
export type DoseRefusalReason = 
/** لا صفّ في الطبقة الثانية لهذه المادة — الحالة الغالبة يوم الإطلاق (§2.2) */
"NO_MONOGRAPH"
/** `AnimalType.species` فارغ: نوع الطفل غير مربوط بمحور الكتالوج (§1.4) */
 | "NO_SPECIES_MAPPING"
/** نشرة موجودة، ولا جرعة موثّقة لهذا النوع/الطريق */
 | "NO_DOSE_FOR_SPECIES"
/** لا وزن مقيس في `VitalSignsRecord` (§5.2) */
 | "NO_WEIGHT"
/** مانع استعمال موثّق لهذا النوع — رفضٌ لا تحذير (§6.1) */
 | "CONTRAINDICATED";
export type DoseRefusal = {
    ok: false;
    reason: DoseRefusalReason;
};
export type DoseCalculation = {
    ok: true;
    /** الجرعة للإعطاء الواحد، بوحدة `doseUnit` بعد ضرب الوزن */
    amountPerAdministration: PrismaNs.Decimal;
    /** داخل المدى الموثّق؟ خارجه يعني `OVERRIDE` وسببًا إلزاميًّا */
    withinDocumentedRange: boolean;
    /** `CALCULATED` داخل المدى، `OVERRIDE` خارجه */
    source: "CALCULATED" | "OVERRIDE";
    /** المدى الموثّق كما هو، للعرض بجانب الرقم */
    documentedRange: {
        min: PrismaNs.Decimal | null;
        max: PrismaNs.Decimal | null;
    };
};
export type DoseResult = DoseCalculation | DoseRefusal;
/** ما يحتاجه المحرّك من `drug_monograph_dose` — لا يستورد النموذج كي يبقى نقيًّا */
export type MonographDoseInput = {
    contraindicated: boolean;
    doseMin: PrismaNs.Decimal | string | number | null;
    doseMax: PrismaNs.Decimal | string | number | null;
    doseUnit: string | null;
};
/**
 * جرعة الإعطاء الواحد = الوزن × (mg/kg).
 *
 * `monographDose = null` تعني «لا نشرة» لا «لا قيود»: تُردّ `NO_MONOGRAPH`. والوزن
 * غير الموجب يُردّ `NO_WEIGHT` — صفرٌ أو سالب ليس وزنًا، وضربُه يعطي رقمًا يبدو
 * سليمًا ويقتل.
 */
export declare function calculateDose(input: {
    monographDose: MonographDoseInput | null;
    /** `null` يعني أنّ نوع الطفل غير مربوط بمحور الكتالوج */
    speciesMapped: boolean;
    /** موجود ومربوط، لكن بلا صفّ جرعة لهذا النوع/الطريق */
    monographExistsForDrug: boolean;
    weightKg: PrismaNs.Decimal | string | number | null;
}): DoseResult;
/** هل جرعة (mg/kg) داخل المدى الموثّق؟ حدٌّ غائب لا يقيّد من جهته */
export declare function isWithinRange(perKg: PrismaNs.Decimal, min: PrismaNs.Decimal | null, max: PrismaNs.Decimal | null): boolean;
/**
 * تصنيف جرعة **كتبها المدرّب بنفسه** مقابل المدى الموثّق (§5.4).
 *
 * `MANUAL` حين لا نشرة: لا مدى يُقاس عليه، فوصفه بـ«تجاوز» كذب. و`OVERRIDE` حين
 * توجد نشرة وخرجت الجرعة عن مداها — وهي وحدها ما يطلب سببًا ويدخل سجل التجاوزات.
 */
export declare function classifyManualDose(input: {
    perKg: PrismaNs.Decimal | string | number | null;
    monographDose: MonographDoseInput | null;
}): "MANUAL" | "OVERRIDE";
/**
 * الكمّية الإجمالية = جرعة الإعطاء × مرّات اليوم × عدد الأيام.
 *
 * `timesPerDay` يأتي من الواصف صراحةً ولا يُشتقّ من نصّ `frequency` — راجع رأس
 * الملفّ. ويُردّ `null` لأي مُدخَل غير موجب بدل تلفيق كمّية: بندٌ بلا مدّة أو بلا
 * تواتر (عند اللزوم مثلًا) كمّيتُه قرار المدرّب لا حاصل ضربٍ في صفر.
 */
export declare function calculateTotalQuantity(input: {
    amountPerAdministration: PrismaNs.Decimal | string | number;
    /** كسر صحيح من `perDayOf` — لا عدد عائم (قيد الدقّة C2) */
    perDay: {
        num: number;
        den: number;
    } | null;
    durationDays: number | null;
    /** «جرعة واحدة فقط»: المدّة لا تضرب شيئًا */
    singleDose?: boolean;
}): PrismaNs.Decimal | null;
/** نصوص الرفض بالعربية — مصدر واحد للخادم والواجهة (§5.3) */
export declare const DOSE_REFUSAL_MESSAGES: Record<DoseRefusalReason, string>;
