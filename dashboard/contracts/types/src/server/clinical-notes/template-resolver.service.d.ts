/**
 * [S2] اختيار القالب الافتراضي لزيارة — دالّة صرفة على قائمة مُرشَّحين.
 *
 * صرفة عمدًا: الاستعلام يجلب قوالب الأكاديمية وقوالب النظام معًا، والترتيب يجري هنا،
 * فيصير قابلًا للاختبار بلا قاعدة بيانات (القاعدة ١٤) — وهو المنطق الذي يقرّر أيّ
 * نموذج يراه المدرّب حين يفتح الزيارة.
 *
 * القاعدة الحاكمة: **قالب الأكاديمية يهزم قالب النظام دائمًا.** أكاديمية كتبت قالب
 * «التهاب الجلد» الخاص بها لا يجوز أن يُقترح عليها قالب النظام بدلًا منه لمجرّد أن
 * الأخير أحدثُ إصدارًا أو مُعلَّمٌ افتراضيًا.
 */
/** أقلّ ما يحتاجه الترتيب — لا شكل الاستجابة كاملًا، فالدالّة تُختبر بكائنات صغيرة */
export type TemplateCandidate = {
    id: string;
    clinicId: string | null;
    key: string;
    version: number;
    presentingComplaint: string | null;
    animalTypeId: string | null;
    isDefault: boolean;
    active: boolean;
};
export type ResolveTemplateInput = {
    presentingComplaint?: string | null;
    animalTypeId?: string | null;
    /**
     * قالب هذا الكشف كما ضبطته الأكاديمية (`ConsultationTypeConfig.examTemplateId`).
     *
     * يهزم كل شيء عداه: الأكاديمية قالت صراحةً «كشف الجلدية يُكتب بهذا القالب»، وهو
     * أخصّ من مطابقة شكوى نصّية. ويبقى الاختيار اليدوي في الزيارة فوقه — لأنه
     * قرار المدرّب الآن لا إعداد سابق، ولذلك لا يمرّ بهذه الدالّة أصلًا.
     */
    consultationTemplateId?: string | null;
};
/**
 * أفضل قالب للزيارة، أو `null` إن لم يصلح أيّ مُرشَّح.
 *
 * الفصل عند التعادل حتمي (الإصدار الأحدث، ثم المفتاح، ثم المعرّف) لا اعتباطي:
 * ترتيبٌ غير مستقرّ يجعل المدرّب يرى قالبًا مختلفًا عند كل فتح للشاشة.
 */
export declare function resolveTemplate(candidates: readonly TemplateCandidate[], input?: ResolveTemplateInput): TemplateCandidate | null;
