/**
 * [RC0] أخطاء مجال التذكيرات والاستدعاء.
 *
 * **يجب أن يُسجَّل اسم الصنف في `CLIENT_ERROR_NAMES` داخل `src/server/app.ts`.**
 * وإلّا ابتُلعت كل رسالة هنا في «حدث خطأ غير متوقّع» 500، ولا يمسك ذلك فحصُ الأنواع
 * ولا البناء ولا أيّ اختبار على مستوى الدورة — يمسكه `domain-error-reachability`
 * وحده (سقط `PosShiftError` و`AdvanceAccountError` من القائمة قبلُ، فابتُلعت ١٧ رسالة).
 */
export declare class RemindersError extends Error {
    readonly kind: RemindersErrorKind;
    constructor(message: string, kind: RemindersErrorKind);
}
export type RemindersErrorKind = "RULE_NOT_FOUND" | "RULE_DUPLICATE" | "TEMPLATE_UNKNOWN_TAG" | "TEMPLATE_EMPTY" | "NO_CHANNELS" | "INVALID_QUIET_HOURS" | "OUTBOX_NOT_FOUND" | "OUTBOX_NOT_PENDING" | "OUTBOX_NOT_MANUAL" | "OWNER_NOT_FOUND" | "UNKNOWN_TRIGGER";
export declare const isRemindersError: (e: unknown) => e is RemindersError;
