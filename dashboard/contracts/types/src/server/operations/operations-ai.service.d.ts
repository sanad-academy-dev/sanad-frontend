export type OperationNoteDraft = {
    proceduresPerformed: string | null;
    findings: string | null;
    technique: string | null;
    closureDetails: string | null;
};
export type GenerateOperationNoteResult = {
    ok: true;
    draft: OperationNoteDraft;
} | {
    ok: false;
    reason: "not-found" | "note-signed" | "provider";
};
/** مسودة التقرير الجراحي من وقائع الحالة المسجَّلة — لا اختلاق لما لم يُسجَّل */
export declare const generateOperationNoteDraft: (caseId: string, clinicId: string) => Promise<GenerateOperationNoteResult>;
export type GenerateDischargeResult = {
    ok: true;
    instructions: string;
} | {
    ok: false;
    reason: "not-found" | "provider";
};
/** مسودة تعليمات الخروج والرعاية المنزلية من إجراءات الحالة ومضاعفاتها */
export declare const generateDischargeInstructionsDraft: (caseId: string, clinicId: string) => Promise<GenerateDischargeResult>;
