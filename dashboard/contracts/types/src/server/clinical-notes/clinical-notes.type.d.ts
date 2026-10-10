import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ClinicalNoteStatus, DiagnosisKind, DiagnosisSeverity, ExamCondition } from "@/generated/prisma/enums";
export { ClinicalNoteStatus, DiagnosisKind, DiagnosisSeverity, ExamCondition };
export declare const SOAP_SECTIONS: readonly ["S", "O", "A", "P"];
export type SoapSection = (typeof SOAP_SECTIONS)[number];
/** عناوين الأقسام كما تُطبع في النصّ المُصيَّر */
export declare const SOAP_SECTION_LABEL_AR: Record<SoapSection, string>;
export type BlockOption = {
    value: string;
    labelAr: string;
    labelEn?: string;
};
export type ChecklistItem = {
    key: string;
    labelAr: string;
    labelEn?: string;
    required?: boolean;
};
export type BodySystem = {
    key: string;
    labelAr: string;
    labelEn?: string;
};
type ExamBlockBase = {
    /**
     * ثابت مدى حياة القالب — وهو مفتاح `answers`. تغييره ييتّم كل إجابة مخزّنة،
     * ولذلك يُحرَّر القالب بإصدار جديد ولا تُعدَّل المعرّفات في مكانها ([S3]).
     */
    id: string;
    section: SoapSection;
    labelAr: string;
    labelEn?: string;
    required?: boolean;
};
export type ExamBlock = ExamBlockBase & ({
    kind: "prose";
    placeholderAr?: string;
} | {
    kind: "select";
    options: BlockOption[];
} | {
    kind: "multiselect";
    options: BlockOption[];
} | {
    kind: "scale";
    min: number;
    max: number;
    labelsAr?: string[];
} | {
    kind: "bodySystems";
    systems: BodySystem[];
} | {
    kind: "checklist";
    items: ChecklistItem[];
} | {
    kind: "vitalsRef";
});
export type ExamBlockKind = ExamBlock["kind"];
export declare const EXAM_BLOCK_KINDS: readonly ["prose", "select", "multiselect", "scale", "bodySystems", "checklist", "vitalsRef"];
export type ParsedBlocks = {
    ok: true;
    blocks: ExamBlock[];
} | {
    ok: false;
    error: string;
};
/** يتحقّق من الكتل ويُعيدها مصنّفة، أو رسالة عربية واحدة تسمّي أوّل عطب */
export declare function parseExamBlocks(input: unknown): ParsedBlocks;
export declare const noteAnswerValueSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>>, z.ZodNull]>;
export declare const noteAnswersSchema: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>>, z.ZodNull]>>;
export type NoteAnswerValue = z.infer<typeof noteAnswerValueSchema>;
export type NoteAnswers = z.infer<typeof noteAnswersSchema>;
export declare const noteDiagnosisSchema: z.ZodObject<{
    text: z.ZodString;
    kind: z.ZodEnum<{
        readonly DIFFERENTIAL: "DIFFERENTIAL";
        readonly WORKING: "WORKING";
        readonly FINAL: "FINAL";
    }>;
    severity: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly MILD: "MILD";
        readonly MODERATE: "MODERATE";
        readonly SEVERE: "SEVERE";
        readonly CRITICAL: "CRITICAL";
    }>>>;
    code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    codeSystem: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const createClinicalNoteSchema: z.ZodObject<{
    patientId: z.ZodString;
    appointmentId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    templateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    vitalsRecordId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    answers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>>, z.ZodNull]>>>;
    diagnoses: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        kind: z.ZodEnum<{
            readonly DIFFERENTIAL: "DIFFERENTIAL";
            readonly WORKING: "WORKING";
            readonly FINAL: "FINAL";
        }>;
        severity: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            readonly MILD: "MILD";
            readonly MODERATE: "MODERATE";
            readonly SEVERE: "SEVERE";
            readonly CRITICAL: "CRITICAL";
        }>>>;
        code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        codeSystem: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateClinicalNoteSchema: z.ZodObject<{
    answers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>, z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodBoolean]>>, z.ZodNull]>>>;
    vitalsRecordId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    diagnoses: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        kind: z.ZodEnum<{
            readonly DIFFERENTIAL: "DIFFERENTIAL";
            readonly WORKING: "WORKING";
            readonly FINAL: "FINAL";
        }>;
        severity: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            readonly MILD: "MILD";
            readonly MODERATE: "MODERATE";
            readonly SEVERE: "SEVERE";
            readonly CRITICAL: "CRITICAL";
        }>>>;
        code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        codeSystem: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const addendumSchema: z.ZodObject<{
    text: z.ZodString;
}, z.core.$strip>;
export declare const upsertExamTemplateSchema: z.ZodObject<{
    key: z.ZodString;
    titleAr: z.ZodString;
    titleEn: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    presentingComplaint: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    animalTypeId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    blocks: z.ZodArray<z.ZodUnknown>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateClinicalNoteFormInput = z.infer<typeof createClinicalNoteSchema>;
export type UpdateClinicalNoteFormInput = z.infer<typeof updateClinicalNoteSchema>;
export type AddendumFormInput = z.infer<typeof addendumSchema>;
export type UpsertExamTemplateFormInput = z.infer<typeof upsertExamTemplateSchema>;
export type NoteDiagnosisFormInput = z.infer<typeof noteDiagnosisSchema>;
export declare const examTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly key: true;
    readonly version: true;
    readonly titleAr: true;
    readonly titleEn: true;
    readonly presentingComplaint: true;
    readonly animalTypeId: true;
    readonly blocks: true;
    readonly isDefault: true;
    readonly active: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    /**
     * [S3] عدد الملاحظات المثبَّتة على هذا القالب. المحرّر يقرؤه ليُنذر قبل الحفظ:
     * قالبٌ استُعمل لا يُعدَّل في مكانه بل يُصدَر من جديد، لأن معرّفات كتله هي
     * مفاتيح `answers` المخزّنة. الخادم يفرض القاعدة؛ هذا الرقم يجعلها مرئية.
     */
    readonly _count: {
        readonly select: {
            readonly notes: true;
        };
    };
};
export type ExamTemplateResponse = Prisma.ExamTemplateGetPayload<{
    select: typeof examTemplateSelect;
}>;
export declare const clinicalNoteSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly patientId: true;
    readonly appointmentId: true;
    readonly templateId: true;
    readonly templateKey: true;
    readonly templateVersion: true;
    readonly authorUserId: true;
    readonly status: true;
    readonly subjective: true;
    readonly objective: true;
    readonly assessment: true;
    readonly plan: true;
    readonly answers: true;
    readonly vitalsRecordId: true;
    readonly finalizedAt: true;
    readonly finalizedById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly finalizedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    /**
     * كتل القالب الذي **ثُبِّتت عليه** الملاحظة، لا القالب النشط الآن. الفرق ليس
     * نظريًّا: ملاحظةٌ على الإصدار الأوّل بينما صدر ثانٍ كانت ستُعرض بكتل الإصدار
     * الثاني — أو بلا كتل أصلًا لو عُطِّل الأوّل — فتُقرأ إجاباتها في نموذج لم تُكتب فيه.
     */
    readonly template: {
        readonly select: {
            readonly id: true;
            readonly key: true;
            readonly version: true;
            readonly blocks: true;
        };
    };
    readonly diagnoses: {
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly text: true;
            readonly code: true;
            readonly codeSystem: true;
            readonly kind: true;
            readonly severity: true;
        };
    };
    readonly addenda: {
        readonly select: {
            readonly id: true;
            readonly text: true;
            readonly authoredById: true;
            readonly createdAt: true;
            readonly authoredBy: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type ClinicalNoteResponse = Prisma.ClinicalNoteGetPayload<{
    select: typeof clinicalNoteSelect;
}>;
