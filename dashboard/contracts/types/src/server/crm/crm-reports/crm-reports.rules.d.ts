/**
 * [CRM-P6] §12 — حساب التقارير، خالصًا.
 *
 * الدوالّ هنا تأخذ صفوفًا وتعيد أرقامًا: لا قاعدة بيانات، فتُختبر في الحزمة السريعة.
 * وهو ما تحتاجه هذه المرحلة تحديدًا — رقمٌ خاطئ في تقرير لا يرمي استثناءً ولا يُوقف
 * شاشة، بل يُقرأ ويُصدَّق ويُبنى عليه قرار.
 */
/** قسمةٌ آمنة تعيد صفرًا بدل `NaN`/`Infinity`: «٠٪» تُقرأ، و`NaN%` لا تعني شيئًا. */
export declare const rate: (part: number, whole: number) => number;
/**
 * §12 — القمع: كم عميلًا محتملًا دخل، وكم تحوّل، وكم صفقةً كُسبت.
 *
 * النسب **تراكمية على المدخل** لا على المرحلة السابقة: «٪ التحويل» و«٪ الكسب» كلاهما
 * من إجمالي العملاء المحتملين. النسبة المرحلية تبدو أجمل وتخفي التسرّب — ومن يقرأ
 * قمعًا يريد أن يعرف كم بقي من مئة، لا كم بقي من العشرة الذين نجوا.
 */
export declare function buildFunnel(input: {
    totalLeads: number;
    convertedLeads: number;
    wonDeals: number;
}): {
    totalLeads: number;
    convertedLeads: number;
    wonDeals: number;
    conversionRate: number;
    winRate: number;
};
/**
 * §12 — متوسط المدّة بالأيّام من صفوف مدّةٍ بالدقائق.
 *
 * يتجاهل الصفوف الفارغة بدل عدّها أصفارًا: صفقةٌ لم تُكسب بعد ليست صفقةً كُسبت في صفر
 * يوم، وعدّها كذلك يسحب المتوسّط إلى رقمٍ متفائل كذبًا.
 */
export declare function averageDays(durationsInMinutes: (number | null)[]): number | null;
/** §12 — التنبّؤ: مجموع القيمة المتوقّعة بحسب شهر الإغلاق المتوقّع. */
export declare function forecastByMonth(rows: {
    expectedCloseDate: Date | null;
    expectedValue: number;
}[]): {
    month: string;
    total: number;
}[];
