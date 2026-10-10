import type { CatalogSpecies } from "@/generated/prisma/enums";
/**
 * [IP3] المديات المرجعية للعلامات الحيوية — بيانات مُنسَّقة في الشيفرة.
 *
 * ── لماذا في الشيفرة لا في جدول ─────────────────────────────────────────────
 *
 * سببان، الثاني منهما قسريّ:
 *
 * ١. **هذا هو نمط المستودع للمرجع السريري المُنسَّق أصلًا**: بروتوكولات التطعيم
 *    تعيش في `vaccinations.seed-data.ts` ويحرسها اختبار، لا في جدول يحرّره
 *    المستخدم. عتبةٌ تقرّر متى يصرخ النظام في الثالثة فجرًا تُراجَع في طلب دمج
 *    ويوقّعها إنسان، لا تُغيَّر من شاشة إعدادات بلا أثر.
 *
 * ٢. **سقف عمق أنواع TypeScript**: رسم أنواع Prisma في هذا المستودع بلغ حدّه،
 *    وقياسُ ذلك مباشر — إضافة نماذج هذه الوحدة أسقطت TS2589 في ملفّات محاسبة
 *    لا صلة لها بالتنويم، وحذفُ نموذجَين أعاد الهامش. فجدولٌ ثالث لبيانات
 *    تتغيّر مرّة في السنة ثمنُه بناءٌ ساقط.
 *
 * ── عقد التنسيق ─────────────────────────────────────────────────────────────
 *
 * كل صفّ يحمل مرجعه، و`reviewed: false` تعني **لم تُقرّها الأكاديمية بعد** فتظهر
 * الشاشة الصفّ بعلامة. وتوليد هذه العتبات من نموذج لغوي ممنوع — نفس قاعدة
 * `DrugMonograph` حرفيًّا: عتبة ملفَّقة تُنتج إنذارًا كاذبًا يُدرَّب الطاقم على
 * تجاهله، فتضيع معه الإنذارات الصادقة.
 *
 * القيم أدناه هي المديات المنشورة المتداولة في المراجع البيطرية العامّة، وهي
 * متقاربة بينها وليست متطابقة، وتختلف بالسلالة وطريقة القياس وحالة الطفل لحظة
 * القياس. القرار D6 في الخطة صريح: **الأكاديمية تسمّي مرجعها** — وحتى تفعل، هذه
 * مبدئية تُشغّل المحرّك ولا تُغني عن إقرار مدرّب.
 */
/**
 * المقاييس التي لها مدى مرجعي. اتحاد نصّي لا تعداد Prisma (انظر السبب ٢ أعلاه).
 * الوزن ودرجة السِمنة خارجه: لا مدى «طبيعيًا» لهما يُقاس على النوع، وضغط الدم
 * نصّ لا رقم.
 */
export declare const VITAL_PARAMETERS: readonly ["TEMPERATURE", "HEART_RATE", "RESPIRATORY_RATE", "OXYGEN_SATURATION", "CAPILLARY_REFILL", "PAIN_SCORE"];
export type VitalParameter = (typeof VITAL_PARAMETERS)[number];
export type VitalReferenceRow = {
    species: CatalogSpecies;
    parameter: VitalParameter;
    /** نافذة العمر بالأسابيع — null من الطرفين تعني «كل الأعمار» */
    ageMinWeeks: number | null;
    ageMaxWeeks: number | null;
    low: number;
    high: number;
    /** تجاوزها يُصعَّد للمدرّب المعالج فورًا. null = لا حدّ حرج موثَّق، لا «لا خطر» */
    criticalLow: number | null;
    criticalHigh: number | null;
    unit: string;
    sourceCitation: string;
    /** false = مبدئي ينتظر إقرار الأكاديمية */
    reviewed: boolean;
};
export declare const VITAL_REFERENCE_RANGES: readonly VitalReferenceRow[];
/** صفوف نوع بعينه — مدخل محرّك الإنذارات */
export declare const referenceRangesForSpecies: (species: CatalogSpecies) => readonly VitalReferenceRow[];
export declare const VITAL_PARAMETER_UNITS: Record<VitalParameter, string>;
