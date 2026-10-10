import { TriageCategory } from "@/generated/prisma/enums";
/**
 * [E1] مُميِّزات قائمة الفرز البيطرية (VTL) — بيانات سريرية مُنسَّقة في الشيفرة.
 *
 * الخطة الحاكمة: `docs/emergency-workflow-plan.md` §4.7
 *
 * ── لماذا في الشيفرة لا في جدول ─────────────────────────────────────────────
 *
 * نفس سببَي `vital-reference-ranges.data.ts` حرفيًّا، والثاني منهما قسريّ:
 *
 * ١. **هذا نمط المستودع للمرجع السريري المُنسَّق**: بروتوكولات التطعيم في
 *    `vaccinations.seed-data.ts`، والمديات المرجعية في ملفّها، وكلاهما يحرسه
 *    اختبار. المُميِّز الذي يقرّر أن طفلًا يُرى «الآن» لا «بعد ساعتين» يُراجَع في
 *    طلب دمج، لا يُحرَّر من شاشة إعدادات بلا أثر.
 * ٢. **سقف عمق أنواع TypeScript**: جدولٌ ثالث لبيانات تتغيّر مرّة في السنة ثمنُه
 *    بناءٌ ساقط — وقد قِيس ذلك في هذه الوحدة نفسها.
 *
 * ── الحظر الصريح ────────────────────────────────────────────────────────────
 *
 * **توليد أيٍّ من هذه المُميِّزات أو ألوانها من نموذج لغوي ممنوع** — قاعدة
 * `DrugMonograph` نفسها. مُميِّزٌ ملفَّق يُنتج لونًا خاطئًا، واللون الخاطئ يُنتج
 * إنذارًا كاذبًا يُدرَّب الطاقم على تجاهله، فتضيع معه الإنذارات الصادقة. وهنا الثمن
 * ليس بيانات فاسدة بل طفلٌ يُترك في قاعة الانتظار وهو يحتضر.
 *
 * ── حالة هذه القائمة ────────────────────────────────────────────────────────
 *
 * الأصل المنشور (Ruys et al. 2012) يضمّ ٦٨ مُميِّزًا في ثماني مجموعات. المُدرَج
 * أدناه مجموعة أساسية مُختصرة تُشغّل المحرّك، وكلّ صفٍّ يحمل `reviewed: false` أي
 * **لم تُقرّه الأكاديمية بعد** فتعرضه الشاشة بعلامة. القرار D6 صريح: **الأكاديمية تسمّي
 * مرجعها وتعتمد ترجمتها**، وحتى تفعل، هذه مبدئية لا تُغني عن حكم ممرّض.
 */
/** مجموعات الأجهزة — تقسيم VTL نفسه */
export declare const TRIAGE_SYSTEMS: readonly ["RESPIRATORY", "CIRCULATORY", "NEUROLOGICAL", "GASTROINTESTINAL", "UROGENITAL", "OBSTETRIC", "TRAUMA", "GENERAL"];
export type TriageSystem = (typeof TRIAGE_SYSTEMS)[number];
export declare const TRIAGE_SYSTEM_LABELS: Record<TriageSystem, string>;
export type TriageDiscriminator = {
    /** كود ثابت يُخزَّن في `TriageAssessment.discriminators` — لا يُعاد استعماله أبدًا */
    code: string;
    system: TriageSystem;
    labelAr: string;
    labelEn: string;
    /** اللون الذي يفرضه هذا المُميِّز وحده */
    category: TriageCategory;
    sourceCitation: string;
    /** false = مبدئي ينتظر إقرار الأكاديمية (D6) */
    reviewed: boolean;
};
export declare const TRIAGE_DISCRIMINATORS: readonly TriageDiscriminator[];
/** فهرس بالكود — البحث عن مُميِّز واحد لا يمسح المصفوفة */
export declare const DISCRIMINATOR_BY_CODE: ReadonlyMap<string, TriageDiscriminator>;
export declare const discriminatorsForSystem: (system: TriageSystem) => TriageDiscriminator[];
/**
 * اللون الذي تقترحه مجموعة المُميِّزات المُختارة = **أشدّها**.
 *
 * قاعدة مانشستر نفسها: الطفل يأخذ لون أخطر ما فيه، لا متوسّط ما فيه. طفلٌ عنده
 * جرح سطحي (أخضر) وضيق تنفّس شديد (برتقالي) هو برتقالي — والمتوسّط هنا كان سيقتله.
 *
 * بلا مُميِّزات لا لون: `null` تعني «لم يُفرز بعد» لا «أخضر». الفرق جوهري — الافتراض
 * الصامت إلى الأخضر يجعل كل طفل لم يُفحص يبدو بخير.
 */
export declare const proposeCategory: (codes: readonly string[]) => TriageCategory | null;
