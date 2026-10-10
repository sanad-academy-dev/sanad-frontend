/**
 * [CRM-P3] §9.1 — حلّ متغيّرات القالب `{{...}}`، خالصًا بلا قاعدة بيانات.
 *
 * القالب يُخزَّن بمتغيّراته الحرفية ويُحَلّ عند الإرسال وحده. الحلّ عند الحفظ كان
 * سيجمّد قيمَ لحظة الكتابة داخل القالب، فيرسل اسم أوّل عميلٍ استُعمل معه إلى كل من بعده.
 */
/** المتغيّرات المدعومة، معلنةً صراحةً: قائمةٌ مغلقة يقرؤها المحرّر ويتحقّق بها المدقّق. */
export declare const TEMPLATE_VARIABLES: readonly ["الاسم", "الجوال", "البريد", "المدينة", "الحالة", "الأكاديمية", "قيمة_الصفقة"];
export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];
export type TemplateContext = Partial<Record<TemplateVariable, string | null>>;
/**
 * يستخرج المتغيّرات المذكورة في نصّ، بلا تكرار وبترتيب ظهورها.
 * يخدم شيئين: تحذير المحرّر من متغيّرٍ مجهول، وعرض ما سيُملأ قبل الإرسال.
 */
export declare function extractVariables(text: string): string[];
/** المتغيّرات المذكورة وليست من القائمة المغلقة — خطأ كتابةٍ لا ميزة. */
export declare function unknownVariables(text: string): string[];
/**
 * الحلّ. متغيّرٌ بلا قيمة يصير **نصًّا فارغًا**، لا يبقى `{{الاسم}}` ظاهرًا في بريدٍ
 * وصل إلى عميل: قيمةٌ ناقصة عيبٌ في البيانات، أمّا قوسان في رسالةٍ مُرسَلة فعيبٌ يراه
 * المستلِم. والفراغ الناتج تلتقطه `assertNoUnresolved` قبل الإرسال حين يكون حاسمًا.
 */
export declare function renderTemplate(text: string, context: TemplateContext): string;
/**
 * §9.1 — الموضوع لا يجوز أن يصل فارغًا. بريدٌ بلا موضوع يُقرأ كأنّه رسالةٌ مبتورة، وهو
 * أوّل ما يراه المستلِم — بخلاف متغيّرٍ فارغٍ داخل الجسد، الذي يمرّ.
 */
export declare function assertSubjectResolves(subject: string, context: TemplateContext): string;
