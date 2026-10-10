import { z } from "zod";
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
export declare const normalizePhone: (raw: string) => string | null;
export declare const phoneSchema: z.ZodString;
/**
 * [CRM-P1] `.optional()` LAST — see the note on `trimmedOptional` in crm-leads.type.ts.
 * `.optional().transform(...)` infers a required-but-undefined key and breaks every caller
 * that passes a TypeBox-validated body. Runtime behaviour is unchanged.
 */
export declare const optionalPhoneSchema: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string | undefined, string>>>;
