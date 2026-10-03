/**
 * [E0] أخطاء مجال الطوارئ.
 *
 * **يجب أن يُسجَّل اسم الصنف في `CLIENT_ERROR_NAMES` داخل `src/server/app.ts`.**
 * وإلّا ابتُلعت كل رسالة هنا في «حدث خطأ غير متوقّع» 500، ولا يمسك ذلك فحصُ الأنواع
 * ولا البناء ولا أيّ اختبار على مستوى الدورة — أمسكه `domain-error-reachability`
 * وحده بعد أن ابتُلعت ١٧ رسالة فعليًّا مرّتين قبل هذا.
 */
export declare class EmergencyError extends Error {
    readonly kind: EmergencyErrorKind;
    constructor(message: string, kind: EmergencyErrorKind);
}
export type EmergencyErrorKind = "VET_UNRESOLVED" | "TRIAGE_REQUIRED" | "PATIENT_REQUIRED" | "PATIENT_ALREADY_LINKED" | "INVALID_ARRIVAL_TRANSITION" | "INVALID_TRANSITION" | "ARRIVAL_TERMINAL" | "LEFT_REASON_REQUIRED" | "OVERRIDE_REASON_REQUIRED" | "NO_DISCRIMINATORS" | "UNKNOWN_DISCRIMINATOR" | "EMERGENCY_DISABLED" | "EPISODE_NOT_FOUND" | "ALREADY_DISPOSED" | "DISPOSITION_INCOMPLETE" | "SURGERY_HANDOFF_FAILED" | "ARRIVAL_NOT_FOUND" | "APPOINTMENT_NOT_FOUND";
export declare const isEmergencyError: (e: unknown) => e is EmergencyError;
