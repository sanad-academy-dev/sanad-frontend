export type LabAnalyzerAvailability = {
    id: string;
    name: string;
    category: string;
    connected: boolean;
    slots: number;
    /** الأماكن المشغولة الآن */
    used: number;
    /** متاح للاختيار: موصول وفيه مكان شاغر */
    available: boolean;
    /** سبب عدم الإتاحة — يُعرض على الخيار المعطَّل */
    blockedReason: string | null;
};
export declare const ANALYZER_OFF_LABEL = "\u0645\u0639\u0637\u0644";
export declare const ANALYZER_FULL_LABEL = "\u0645\u0645\u062A\u0644\u0626";
/**
 * أجهزة الفرع مع إشغالها. `exceptItemId` يستثني التحليل الحالي من العدّ حتى
 * لا يحجب الجهاز عن نفسه عند إعادة فتح خطوة التعيين.
 */
export declare const listAnalyzerAvailability: (branchId: string, clinicId: string, exceptItemId?: string | null) => Promise<LabAnalyzerAvailability[]>;
/** يتحقّق من إتاحة الجهاز ويُعيد اسمه للقطة، أو رسالة المنع */
export declare const resolveAnalyzerForAssignment: (branchId: string, clinicId: string, analyzerId: string, exceptItemId: string) => Promise<{
    name: string;
} | {
    error: string;
}>;
