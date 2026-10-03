import type { InpatientGate } from "@/server/inpatients/inpatients.workflow";
/**
 * [IP0] أخطاء مجال التنويم التي يجب أن تصل المستخدم بنصّها العربي.
 *
 * الأصناف الثلاثة مُدرَجة حرفيًّا في `CLIENT_ERROR_NAMES` داخل `src/server/app.ts`،
 * فرسالتها تصل كما هي بدل «حدث خطأ غير متوقع». صنفٌ رابع يُضاف هنا ولا يُدرَج
 * هناك يمرّ الترجمة والبناء صامتًا ويسقط عند الاستعمال وحده — وهو ما يحرسه
 * `domain-error-reachability.audit.test.ts`.
 *
 * `this.name` يُضبط في الباني لا كحقل صنف: المطابقة في `app.ts` بالاسم النصّي،
 * وحقلُ الصنف يُسنَد بعد `super()` في بعض أهداف الترجمة فيبقى "Error" لحظة
 * المطابقة. الحارس نفسه يفرض هذه الصيغة.
 */
/** مُدخل غير صالح أو ناقص — 422 */
export declare class InpatientValidationError extends Error {
    constructor(message: string);
}
/** العملية لا تصحّ على حالة الإقامة الراهنة (انتقال ممنوع، صفّ مُعطى يُعدَّل) — 409 */
export declare class InpatientStateError extends Error {
    constructor(message: string);
}
/**
 * بوابة أمان مرفوضة — 409 مع اسم البوابة.
 *
 * البوابة تُعاد باسمها لا برسالتها وحدها: الواجهة تُبرز المتطلَّب الناقص عندها
 * (تفتح لسان الأوامر، أو تُظهر زرّ الإسكان) بدل رسالة صمّاء يقرؤها المستخدم
 * ولا يعرف أين يذهب.
 */
export declare class InpatientGateError extends Error {
    readonly gate: InpatientGate;
    readonly overridable: boolean;
    constructor(message: string, gate: InpatientGate, overridable: boolean);
}
