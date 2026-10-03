import { Prisma as PrismaNs } from "@/generated/prisma/client";
/**
 * [PH7.1] تحويل الجرعة من ملّيغرام إلى ما يُقاس فعلًا — BRD_Pharmacy_Module.md §5.
 *
 * ── لماذا هذا الملفّ أهمّ ما في الحاسبة ───────────────────────────────────────
 * محرّك الجرعة يُخرج **ملّيغرامات**. والمدرّب لا يسحب ملّيغرامات في محقنة، بل
 * ملّيلترات؛ ولا يعطي القطّ ملّيغرامات، بل أقراصًا. والخطوة بينهما — القسمة على
 * التركيز — هي الموضع الذي تقع فيه أخطاء العامل ١٠ في الطبّ البيطري: ٥٠ مغ من
 * محلول ١٠٠ مغ/مل هي ٠٫٥ مل، ومن محلول ١٠ مغ/مل هي ٥ مل. عشرة أضعاف، بنفس الرقم
 * على الورقة.
 *
 * والبيانات لهذا التحويل **موجودة فعلًا ومقيسة**: `strength` مذكور في ٩٦٪ من سجل
 * الغذاء والدواء و٦٤٪ من السجل الأسترالي، و`dosageForm` في ١٠٠٪. فالتحويل هنا
 * حسابٌ على بيانات نشرة مسجَّلة، لا اختراع سريري — وهذا ما يفصله عن الجرعة نفسها،
 * التي تبقى ممنوعة على التوليد (§0.4).
 *
 * ── ما يرفضه هذا المحلّل، وهو نصف قيمته ───────────────────────────────────────
 * حقل `strength` في السجل ليس رقمًا نظيفًا دائمًا. المقيس في سجل الغذاء والدواء:
 * `"20.20.20"` (مركّب ثلاثي)، `"6.0 & 3.0"` (مكوّنان)، `mg` مجرّدة على سائل (لكل
 * عبوة؟ لكل مل؟)، ووحدات بيولوجية مثل `log10 EID50/dose` و`PFU/dose` لا تقبل
 * القسمة أصلًا. كلّها تُردّ **رفضًا مُصنَّفًا** لا تخمينًا: «أدخل الحجم بنفسك» صحيحة،
 * و«٠٫٥ مل» مبنيّة على قراءة خاطئة لـ`"20.20.20"` تقتل.
 */
export type ConcentrationRefusalReason = 
/** لا `strength` مذكور في السجل */
"NO_STRENGTH"
/** رقم غير مفرد: مركّب متعدّد المكوّنات مثل «20.20.20» أو «6.0 & 3.0» */
 | "COMPOUND_STRENGTH"
/** وحدة لا تقبل التحويل الكتلي (لقاحات ووحدات بيولوجية) */
 | "BIOLOGICAL_UNIT"
/** `mg` مجرّدة على شكل صيدلاني سائل — لكل عبوة أم لكل مل؟ السجل لا يقول */
 | "AMBIGUOUS_PER_UNIT"
/** نسبة مئوية خارج المدى المعقول — بيانات معطوبة لا تركيز */
 | "IMPLAUSIBLE_PERCENT"
/**
 * وحدة فاعلية لا كتلة (IU، U، PD50). تحويلها إلى ملّيغرام ليس حسابًا بل اختراع
 * معامل يختلف بين مادة وأخرى — وهو ما يمنعه §0.4.
 */
 | "POTENCY_UNIT"
/** وحدة غير معروفة */
 | "UNKNOWN_UNIT";
export type ParsedConcentration = {
    ok: true;
    /** كمّية المادة الفعّالة لكل وحدة قياس */
    amountPerUnit: PrismaNs.Decimal;
    /** وحدة المادة الفعّالة — دائمًا mg بعد التطبيع */
    amountUnit: "mg";
    /** الوحدة التي تُقاس بها الجرعة عمليًّا */
    measureUnit: "mL" | "g" | "قرص";
    /** كيف عُرف التركيز — يُعرض للمدرّب فلا يثق برقم لا يعرف مصدره */
    basis: string;
};
export type ConcentrationRefusal = {
    ok: false;
    reason: ConcentrationRefusalReason;
};
export type ConcentrationResult = ParsedConcentration | ConcentrationRefusal;
/**
 * هل نصّ القوّة رقم مفرد؟ «20.20.20» و«6.0 & 3.0» و«100 + 50» كلها مركّبات.
 *
 * تُفحص قبل أي تحليل: `Number("20.20.20")` تُعطي NaN فتُلتقط، لكن `parseFloat`
 * تُعطي 20 بصمت — وهي بالضبط القراءة التي تقتل.
 */
export declare function isSingleValue(raw: string): boolean;
/**
 * يحوّل (`strength`, `strengthUnit`, `dosageForm`) من السجل إلى تركيز صالح للقسمة.
 *
 * كل مسار إمّا يُعيد رقمًا يعرف مصدره، أو يرفض بسبب مُسمّى. لا مسار ثالث.
 */
export declare function parseConcentration(input: {
    strength: string | null | undefined;
    strengthUnit: string | null | undefined;
    dosageForm: string | null | undefined;
}): ConcentrationResult;
export type DoseVolume = {
    /** ما يُقاس فعلًا — مل أو غرام أو عدد أقراص */
    amount: PrismaNs.Decimal;
    unit: "mL" | "g" | "قرص";
    basis: string;
};
/**
 * يحوّل جرعة بالملّيغرام إلى حجم/عدد قابل للقياس.
 *
 * **لا تقريب هنا.** الرقم يُعاد بدقّته الكاملة ويُقرَّب عند العرض وحده: تقريبٌ في
 * منتصف السلسلة يتراكم، وفي جرعة قطّة وزنها ٢ كغ يكون فرق ٠٫٠٥ مل معتبَرًا.
 */
export declare function doseToVolume(doseMg: PrismaNs.Decimal, concentration: ParsedConcentration): DoseVolume;
/**
 * تقريب العرض: الأقراص إلى أقرب نصف قرص (القرص يُشطر ولا يُربّع عمليًّا)، والسوائل
 * إلى منزلتين — وهو ما تسمح به محقنة الأنسولين ١ مل.
 */
export declare function displayVolume(v: DoseVolume): string;
export declare const CONCENTRATION_REFUSAL_MESSAGES: Record<ConcentrationRefusalReason, string>;
