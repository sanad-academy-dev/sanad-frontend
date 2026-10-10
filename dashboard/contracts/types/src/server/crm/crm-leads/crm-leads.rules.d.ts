import type { CrmLeadStatusKind } from "@/generated/prisma/enums";
/**
 * [CRM-P1] قواعد §3 خالصة — بلا قاعدة بيانات، فتُختبر بالجدول وتعمل في الحزمة السريعة.
 */
/**
 * BR-C3.1 — الاسم الكامل يُشتقّ من الجزأين، وعنوان العرض يتراجع إلى الجوال حين لا اسم.
 * السبب في التراجع: الاستقبال يسجّل مكالمةً بالجوال قبل أن يعرف الاسم، وصفٌّ بلا عنوان
 * لا يمكن العثور عليه في قائمة.
 */
export declare function deriveFullName(firstName: string, lastName?: string | null): string;
export declare function deriveLeadTitle(firstName: string, lastName: string | null | undefined, mobile: string): string;
/**
 * BR-C3.3 — الانتقال إلى حالةٍ من نوع «مفقود» يوجب سبب فقد. الرفض عربي ومُسمّى.
 */
export declare function assertLostReason(targetKind: CrmLeadStatusKind, lostReasonId: string | null | undefined): void;
/**
 * BR-C3.5 (تمهيد) — «محوَّل» حالةٌ تصنعها عملية التحويل وحدها، لا اليد. التحويل نفسه
 * يصل في CRM-P2؛ وحتى ذلك الحين يُمنع الانتقال اليدوي إليها، لأنّ عميلًا محتملًا
 * «محوَّلًا» بلا صفقةٍ خلفه يكذب على كل تقرير يعدّ التحويلات.
 */
export declare function assertNotManualConversion(targetKind: CrmLeadStatusKind): void;
/**
 * BR-C3.4 — مدة البقاء في الحالة السابقة بالثواني. أول تسجيلٍ لعميل محتمل لا سابقة له،
 * فالمدة `null` لا صفر: الصفر يعني «انتقل فورًا»، وهو ادّعاءٌ مختلف تمامًا.
 */
export declare function durationInPreviousSeconds(previousAt: Date | null | undefined, now: Date): number | null;
/**
 * BR-C3.2 — التكرار **تحذير** لا رفض: مكاتب الاستقبال تعيد إدخال الأشخاص، ورفضُ الإدخال
 * يدفع الموظف إلى تحريف الرقم ليمرّ. تُعيد الدالة الصفّ المطابق ليُعرَض مرتبطًا.
 */
export type DuplicateWarning = {
    duplicateOf: {
        id: string;
        code: string;
        fullName: string;
    };
} | null;
export declare function buildDuplicateWarning(match: {
    id: string;
    code: string;
    fullName: string;
} | null): DuplicateWarning;
