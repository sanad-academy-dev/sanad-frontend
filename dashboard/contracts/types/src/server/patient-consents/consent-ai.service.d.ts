import type { ConsentFieldValues } from "@/server/patient-consents/patient-consents.type";
export type DraftFieldResult = {
    ok: true;
    text: string;
} | {
    ok: false;
    reason: "not-found" | "not-draftable" | "provider";
};
/**
 * مسودّة نصّ حقل حرّ (وصف الإجراء، التشخيص المشتبه، تعليمات المنزل) من وقائع
 * الحالة المسجّلة. لا تُحفظ — تهبط في الحقل ليحرّرها الموظّف.
 */
export declare const draftConsentField: (clinicId: string, consentId: string, fieldKey: string) => Promise<DraftFieldResult>;
export type ExtractScanResult = {
    ok: true;
    fieldValues: ConsentFieldValues;
    unreadableKeys: string[];
} | {
    ok: false;
    reason: "not-found" | "provider";
};
/**
 * يقرأ نموذجًا ورقيًا موقَّعًا (صورة/مسح) ويستخرج القيم والمربّعات المؤشَّرة.
 * المخرَج مقترح يراجعه الموظّف؛ والصورة نفسها تبقى الأصل القانوني.
 */
export declare const extractConsentFromScan: (clinicId: string, consentId: string, imageDataUrl: string) => Promise<ExtractScanResult>;
