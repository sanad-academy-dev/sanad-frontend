import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import { z } from "zod";

/**
 * البلد المفترَض حين يكتب المستخدم رقمًا **محلّيًّا** بلا مفتاح دولي.
 *
 * لا مفرّ من افتراض بلد: «0501234567» لا يحمل ما يدلّ على دولته، وهو الشكل الذي
 * يكتبه الناس فعلًا — بل هو النصّ الإرشادي في حقل التطبيق نفسه. والافتراض هنا آمن
 * لأن المفتاح الصريح **يتقدّم عليه دائمًا**: «+9647719031294» يبقى عراقيًّا.
 */
const DEFAULT_COUNTRY = "SA" as const;

/**
 * يحوّل ما كتبه المستخدم إلى صيغة E.164، أو `null` إن تعذّر بيقين.
 *
 * ── لماذا البلد الافتراضي لازم ────────────────────────────────────────────
 *
 * بدونه كان `parsePhoneNumber("0501234567")` يعيد `undefined`، فيُرفض الرقم برسالة
 * «رقم جوال غير صالح» — بينما هو الشكل الذي يطلبه التطبيق حرفيًّا في حقله
 * («05xxxxxxxx»). النتيجة: وليّ أمرٌ يكتب رقمه كما يعرفه ويُخبَر أنه غير صالح، فيجرّب
 * كلمات مرور مختلفة ظنًّا أن العطل فيها حتى يُقفل حسابه.
 *
 * لا يُخمَّن شيء عند الفشل: رقمٌ لا يُفهم يبقى `null` ويُعالَج صراحةً، لأن تخمينه
 * يربط وليّ أمرًا بسجلّ غيره.
 */
export const normalizePhone = (raw: string): string | null => {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	try {
		const parsed = parsePhoneNumber(trimmed, DEFAULT_COUNTRY);
		return parsed?.number ?? null;
	} catch {
		return null;
	}
};

export const phoneSchema = z
	.string({ error: "رقم الجوال مطلوب" })
	.trim()
	.min(1, "رقم الجوال مطلوب")
	// نفس البلد الافتراضي: حقلٌ يقبل «05…» ثم يرفضه المُطبِّع لاحقًا هو أسوأ الحالتين.
	.refine((v) => isValidPhoneNumber(v, DEFAULT_COUNTRY), { message: "رقم جوال غير صالح" });

/**
 * [CRM-P1] `.optional()` LAST — see the note on `trimmedOptional` in crm-leads.type.ts.
 * `.optional().transform(...)` infers a required-but-undefined key and breaks every caller
 * that passes a TypeBox-validated body. Runtime behaviour is unchanged.
 */
export const optionalPhoneSchema = z
	.string()
	.trim()
	.transform((v) => (v && v.length > 0 ? v : undefined))
	.refine((v) => v === undefined || isValidPhoneNumber(v, DEFAULT_COUNTRY), {
		message: "رقم جوال غير صالح",
	})
	.optional();
