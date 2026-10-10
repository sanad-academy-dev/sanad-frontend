import type { CatalogSpecies, VaccinationDoseKind } from "@/generated/prisma/enums";
/**
 * البيانات المرجعية للتطعيمات: المُستضِدّات والبروتوكولات الأساسية للكلاب والقطط.
 *
 * هذا الملف هو **التعريف المرجعي**، لكنه ليس آلية الشحن: `ensureGlobalDefaults`
 * يتوقّف مبكرًا على أي قاعدة بيانات مأهولة، فتعديل ملفات التهيئة لا يصل إلى أكاديمية
 * قائمة أبدًا. الصفوف تُشحن داخل ملف الهجرة (SQL) بمعرّفات ثابتة، ويتكفّل
 * `vaccinations.seed-data.test.ts` بأن يبقى الملفان متطابقين.
 *
 * المعرّفات نصوص دلالية لا `cuid()` — عمدًا: الإدراج يجب أن يكون
 * `ON CONFLICT DO NOTHING` قابلًا لإعادة التشغيل، والصفوف العالمية يجب أن تكون
 * قابلة للإشارة إليها من هجرة لاحقة. نفس منطق `TherapeuticClass` و`Antigen`.
 *
 * المصدر: إرشادات التطعيم الصادرة عن WSAVA (مجموعة إرشادات التطعيم، ٢٠٢٤).
 * الجرعات المذكورة أساسية (core) ما لم يُذكر خلاف ذلك؛ الجرعات غير الأساسية
 * تُشحن في بروتوكول منفصل لأن إعطاءها قرار طبي مرتبط بنمط حياة الطفل.
 */
export type SeedAntigen = {
    code: string;
    nameEn: string;
    nameAr: string;
    noteAr?: string;
    order: number;
    /** فترة اكتساب المناعة بالأيام — انظر تعليق `SEED_ANTIGENS` أدناه */
    immunityOnsetDays: number;
};
export type SeedProtocolDose = {
    id: string;
    order: number;
    antigenCode: string;
    label: string;
    kind: VaccinationDoseKind;
    /** عمر الطفل بالأسابيع عند هذه الجرعة — مرساة الجرعة الأولى */
    ageWeeksMin?: number;
    ageWeeksMax?: number;
    /** الفاصل بالأيام عن الجرعة السابقة داخل السلسلة */
    intervalDaysFromPrev?: number;
    /** دورية التكرار مدى الحياة بعد بلوغ هذه الجرعة (بالأيام) */
    boosterIntervalDays?: number;
    notes?: string;
};
export type SeedProtocol = {
    id: string;
    code: string;
    name: string;
    nameEn: string;
    species: CatalogSpecies;
    isCore: boolean;
    isDefault: boolean;
    notes?: string;
    doses: SeedProtocolDose[];
};
/**
 * **فترة اكتساب المناعة (`immunityOnsetDays`)** — الأيام بين إعطاء الجرعة وبدء
 * الحماية الفعلية. الجرعة ليست حماية لحظة حقنها، والبوابة التي تقرأ تاريخ الإعطاء
 * وحده (كبوابة قبول التجميل) تُدخل طفلًا لم يكتسب مناعته بعد.
 *
 * **قاعدة اختيار الرقم:** الأطول بين المستحضرات المسجَّلة الشائعة لكل مُستضِدّ، لا
 * المتوسط ولا الأقصر. البوابة تخطئ في اتجاه واحد آمن: تأخير قبول طفل محميّ خطؤه
 * موعد يُؤجَّل، وقبول طفل غير محميّ خطؤه عدوى في صالة مشتركة. المستحضر الأسرع
 * يُصحَّح على صفّه في الكتالوج عبر `Vaccine.immunityOnsetDays` من نشرته.
 *
 * **المصادر:** إرشادات WSAVA للتطعيم (٢٠٢٤)، ونشرات المستحضرات المعتمدة (SPC):
 * - كلاب: Nobivac DHP/DHPPi و Versican Plus DHPPi/L4 و Nobivac L4 و Nobivac KC.
 * - قطط: Nobivac Tricat Trio و Purevax RCP و Purevax FeLV.
 * - سُعار: Nobivac Rabies و Rabisin — ٢١ يومًا، وهي أيضًا المدّة المعتمدة دوليًا
 *   في اشتراطات سفر الأطفال الأليفة، فيقرأها الطاقم رقمًا مألوفًا لا اجتهادًا.
 */
export declare const SEED_ANTIGENS: readonly SeedAntigen[];
export declare const SEED_PROTOCOLS: readonly SeedProtocol[];
/**
 * ربط اسم النوع الافتراضي بمحور الأنواع في الكتالوج. أنواع الأطفال الافتراضية
 * تُنشأ برموز عشوائية (`P-XXXX`) فلا يوجد مفتاح دلالي؛ الاسم الإنجليزي هو الرابط
 * الوحيد الثابت، وعليه يقوم الملء الرجعي في الهجرة.
 */
export declare const ANIMAL_TYPE_SPECIES_MAP: Readonly<Record<string, CatalogSpecies>>;
/**
 * الأنواع الافتراضية التي لا مقابل لها في `CatalogSpecies` (الهامستر، الزواحف،
 * السلاحف، خنزير غينيا) تبقى `species = null` عمدًا: لا بروتوكول عالمي يخصّها،
 * ولا يصحّ إسنادها لنوع مجاور. الأكاديمية تكتب لها بروتوكولًا خاصًا عبر `animalTypeId`.
 */
