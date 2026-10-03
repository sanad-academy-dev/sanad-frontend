import { ChecklistItemResponse, ChecklistResponseType, SopDomain } from "@/generated/prisma/enums";
import { type ResolvedSopResponse, type SaveSopTemplateInput, type SopLibraryRowResponse, type SopRunResponse, type SopRunTarget, type SopTemplateResponse } from "@/server/sops/sops.type";
export type SopsDaoError = "service-not-found" | "service-domain-mismatch" | "template-not-found" | "template-is-system" | "sop-not-configured" | "run-not-found" | "run-completed-immutable" | "run-incomplete" | "run-step-not-found";
export declare const sopsDao: {
    /** القالب الفعّال لدورة، مع بيان مصدره (خاص بالعنصر أم موروث) */
    resolveForService(clinicId: string, serviceId: string): Promise<ResolvedSopResponse | SopsDaoError>;
    /**
     * مكتبة البروتوكولات: كل عناصر الوحدة مع ملخّص قالبها الفعّال. استعلامان
     * فقط — الشجرة ثم القوالب — والوراثة تُحسب في الذاكرة.
     */
    listLibrary(clinicId: string, domain: SopDomain): Promise<SopLibraryRowResponse[]>;
    /**
     * حفظ نسخة أكاديمية من بروتوكول: كل حفظ نسخة جديدة برقم أعلى، والنسخ الأقدم
     * تُعطَّل لا تُمحى — التشغيلات التقطت لقطتها وقت التنفيذ فلا يعيد التاريخ
     * كتابة نفسه (نفس عقد ChecklistTemplate).
     */
    saveTemplate(input: SaveSopTemplateInput): Promise<SopTemplateResponse | SopsDaoError>;
    /**
     * إلغاء تخصيص الأكاديمية: تعطيل قوالبها لهذه الدورة فيعود قالب النظام أو
     * القالب الموروث. قوالب النظام لا تُعطَّل من الأكاديمية.
     */
    revertToSystem(clinicId: string, serviceId: string): Promise<{
        reverted: number;
    }>;
    /**
     * تشغيل الهدف إن وُجد — تُستدعى عند فتح لوحة البروتوكول. مقيّدة بالأكاديمية:
     * الهدف معرّف يمكن تخمينه، فبلا التقييد يقرأ مستخدمُ أكاديميةٍ تشغيلَ أخرى.
     */
    findRunByTarget(clinicId: string, target: SopRunTarget): Promise<SopRunResponse | null>;
    /**
     * تشغيل البروتوكول على هدف — يلتقط لقطة نصية من القالب بنسخته. مُتماثل
     * الاستدعاء: وجود تشغيل يعيده كما هو، فلا يمسح فتحُ اللوحة تقدّمًا سابقًا.
     */
    ensureRun(args: {
        clinicId: string;
        userId: string;
        domain: SopDomain;
        serviceId: string;
        target: SopRunTarget;
    }): Promise<SopRunResponse | SopsDaoError>;
    /** استجابة خطوة — التشغيل المكتمل مصون فلا يقبل تعديلًا */
    respondStep(args: {
        clinicId: string;
        userId: string;
        runId: string;
        stepId: string;
        response: ChecklistItemResponse | null;
        valueText?: string | null;
        valueNumber?: number | null;
    }): Promise<SopRunResponse | SopsDaoError>;
    /** إقفال التشغيل — كل خطوة إلزامية يجب أن تحمل استجابة */
    completeRun(args: {
        clinicId: string;
        userId: string;
        runId: string;
    }): Promise<SopRunResponse | SopsDaoError>;
};
/** الاستجابة الافتراضية لنوع الخطوة — الزرّ الواحد يعني «تأكيد» */
export declare const defaultResponseFor: (type: ChecklistResponseType) => ChecklistItemResponse;
