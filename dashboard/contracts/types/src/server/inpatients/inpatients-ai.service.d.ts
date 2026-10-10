export type InpatientDraftResult = {
    ok: true;
    text: string;
} | {
    ok: false;
    reason: "not-found" | "empty" | "provider";
};
/**
 * مسودّة تقرير الخروج — الوثيقة التي يقرؤها وليّ الأمر، فلغتها له لا للمدرّب.
 */
export declare const draftDischargeSummary: (stayId: string, clinicId: string) => Promise<InpatientDraftResult>;
/**
 * مسودّة تسليم الوردية — آخر N ساعة، بلغة الطاقم لا وليّ الأمر.
 *
 * تجيب سؤال المناوبة القادمة: ما الذي تغيّر، وما الذي يحتاج انتباهًا الليلة.
 */
export declare const draftShiftHandover: (stayId: string, clinicId: string, hours?: number) => Promise<InpatientDraftResult>;
