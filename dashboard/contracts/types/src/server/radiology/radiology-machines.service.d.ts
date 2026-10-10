export type RadiologyMachineAvailability = {
    id: string;
    name: string;
    modality: string;
    room: string;
    connected: boolean;
    slots: number;
    /** الأماكن المشغولة الآن */
    used: number;
    /** متاح للاختيار: موصول وفيه مكان شاغر */
    available: boolean;
    /** سبب عدم الإتاحة — يُعرض على الخيار المعطَّل */
    blockedReason: string | null;
};
export declare const MACHINE_OFF_LABEL = "\u0645\u0639\u0637\u0644";
export declare const MACHINE_FULL_LABEL = "\u0645\u0634\u063A\u0648\u0644";
/**
 * أجهزة الفرع مع إشغالها. `exceptItemId` يستثني الفحص الحالي من العدّ حتى
 * لا يحجب الجهاز عن نفسه عند إعادة فتح خطوة التعيين.
 */
export declare const listMachineAvailability: (branchId: string, clinicId: string, exceptItemId?: string | null, modality?: string | null) => Promise<RadiologyMachineAvailability[]>;
/** يتحقّق من إتاحة الجهاز ويُعيد اسمه وغرفته للقطة، أو رسالة المنع */
export declare const resolveMachineForAssignment: (branchId: string, clinicId: string, machineId: string, exceptItemId: string, modality?: string | null) => Promise<{
    name: string;
    room: string;
} | {
    error: string;
}>;
