import { CrmError } from "@sanad/contracts/runtime/server/crm/crm-error";

/**
 * [CRM-P3] §9.1 — حلّ متغيّرات القالب `{{...}}`، خالصًا بلا قاعدة بيانات.
 *
 * القالب يُخزَّن بمتغيّراته الحرفية ويُحَلّ عند الإرسال وحده. الحلّ عند الحفظ كان
 * سيجمّد قيمَ لحظة الكتابة داخل القالب، فيرسل اسم أوّل عميلٍ استُعمل معه إلى كل من بعده.
 */

/** المتغيّرات المدعومة، معلنةً صراحةً: قائمةٌ مغلقة يقرؤها المحرّر ويتحقّق بها المدقّق. */
export const TEMPLATE_VARIABLES = [
	"الاسم",
	"الجوال",
	"البريد",
	"المدينة",
	"الحالة",
	"الأكاديمية",
	"قيمة_الصفقة",
] as const;
export type TemplateVariable = (typeof TEMPLATE_VARIABLES)[number];

export type TemplateContext = Partial<Record<TemplateVariable, string | null>>;

/** `{{ الاسم }}` و`{{الاسم}}` سواء — المسافات حول الاسم لا تُغيّر المتغيّر المقصود. */
const PLACEHOLDER = /\{\{\s*([^{}]+?)\s*\}\}/g;

/**
 * يستخرج المتغيّرات المذكورة في نصّ، بلا تكرار وبترتيب ظهورها.
 * يخدم شيئين: تحذير المحرّر من متغيّرٍ مجهول، وعرض ما سيُملأ قبل الإرسال.
 */
export function extractVariables(text: string): string[] {
	const found: string[] = [];
	for (const match of text.matchAll(PLACEHOLDER)) {
		const name = match[1];
		if (name && !found.includes(name)) found.push(name);
	}
	return found;
}

/** المتغيّرات المذكورة وليست من القائمة المغلقة — خطأ كتابةٍ لا ميزة. */
export function unknownVariables(text: string): string[] {
	return extractVariables(text).filter(
		(name) => !(TEMPLATE_VARIABLES as readonly string[]).includes(name),
	);
}

/**
 * الحلّ. متغيّرٌ بلا قيمة يصير **نصًّا فارغًا**، لا يبقى `{{الاسم}}` ظاهرًا في بريدٍ
 * وصل إلى عميل: قيمةٌ ناقصة عيبٌ في البيانات، أمّا قوسان في رسالةٍ مُرسَلة فعيبٌ يراه
 * المستلِم. والفراغ الناتج تلتقطه `assertNoUnresolved` قبل الإرسال حين يكون حاسمًا.
 */
export function renderTemplate(text: string, context: TemplateContext): string {
	return text.replace(PLACEHOLDER, (_whole, rawName: string) => {
		const name = rawName.trim() as TemplateVariable;
		const value = context[name];
		return value === null || value === undefined ? "" : value;
	});
}

/**
 * §9.1 — الموضوع لا يجوز أن يصل فارغًا. بريدٌ بلا موضوع يُقرأ كأنّه رسالةٌ مبتورة، وهو
 * أوّل ما يراه المستلِم — بخلاف متغيّرٍ فارغٍ داخل الجسد، الذي يمرّ.
 */
export function assertSubjectResolves(subject: string, context: TemplateContext): string {
	const rendered = renderTemplate(subject, context).trim();
	if (rendered.length === 0) throw new CrmError("موضوع الرسالة فارغ بعد حلّ المتغيّرات");
	return rendered;
}
