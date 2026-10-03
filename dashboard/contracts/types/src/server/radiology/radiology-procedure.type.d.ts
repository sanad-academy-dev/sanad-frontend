import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ContrastRoute, RadiologyImageQuality, RadiologyModality, SedationLevel } from "@/generated/prisma/enums";
declare const safetyScreeningSelect: {
    readonly id: true;
    readonly orderId: true;
    readonly fastingStatus: true;
    readonly fastingHours: true;
    readonly medications: true;
    readonly pregnancyPossible: true;
    readonly metalImplants: true;
    readonly implantNotes: true;
    readonly priorContrastReaction: true;
    readonly allergies: true;
    readonly asaClass: true;
    readonly vitalsRecordId: true;
    readonly vitalsRecord: {
        readonly select: {
            id: true;
            code: true;
            patientId: true;
            branchId: true;
            recordedAt: true;
            source: true;
            appointmentId: true;
            labOrderId: true;
            radiologyOrderId: true;
            operationId: true;
            weight: true;
            temperature: true;
            heartRate: true;
            respiratoryRate: true;
            oxygenSaturation: true;
            bloodPressure: true;
            painScore: true;
            bodyConditionScore: true;
            capillaryRefillSec: true;
            mucousMembrane: true;
            notes: true;
            correctsId: true;
            editsCount: true;
            createdAt: true;
            updatedAt: true;
            recordedBy: {
                select: {
                    id: true;
                    name: true;
                };
            };
            correction: {
                select: {
                    id: true;
                    code: true;
                    recordedAt: true;
                };
            };
        };
    };
};
export declare const safetyScreeningSelectShape: {
    readonly id: true;
    readonly orderId: true;
    readonly fastingStatus: true;
    readonly fastingHours: true;
    readonly medications: true;
    readonly pregnancyPossible: true;
    readonly metalImplants: true;
    readonly implantNotes: true;
    readonly priorContrastReaction: true;
    readonly allergies: true;
    readonly asaClass: true;
    readonly vitalsRecordId: true;
    readonly vitalsRecord: {
        readonly select: {
            id: true;
            code: true;
            patientId: true;
            branchId: true;
            recordedAt: true;
            source: true;
            appointmentId: true;
            labOrderId: true;
            radiologyOrderId: true;
            operationId: true;
            weight: true;
            temperature: true;
            heartRate: true;
            respiratoryRate: true;
            oxygenSaturation: true;
            bloodPressure: true;
            painScore: true;
            bodyConditionScore: true;
            capillaryRefillSec: true;
            mucousMembrane: true;
            notes: true;
            correctsId: true;
            editsCount: true;
            createdAt: true;
            updatedAt: true;
            recordedBy: {
                select: {
                    id: true;
                    name: true;
                };
            };
            correction: {
                select: {
                    id: true;
                    code: true;
                    recordedAt: true;
                };
            };
        };
    };
};
export type RadiologySafetyScreeningResponse = Prisma.RadiologySafetyScreeningGetPayload<{
    select: typeof safetyScreeningSelect;
}>;
declare const examExecutionSelect: {
    readonly id: true;
    readonly itemId: true;
    readonly machineId: true;
    readonly machineName: true;
    readonly roomName: true;
    readonly positioning: true;
    readonly sedationUsed: true;
    readonly sedationAgent: true;
    readonly readyAt: true;
    readonly startedAt: true;
    readonly finishedAt: true;
    readonly viewsPerformed: true;
    readonly exposuresCount: true;
    readonly retakeCount: true;
    readonly kvp: true;
    readonly mas: true;
    readonly doseDap: true;
    readonly ctdiVol: true;
    readonly dlp: true;
    readonly contrastUsed: true;
    readonly contrastAgent: true;
    readonly contrastRoute: true;
    readonly contrastVolumeMl: true;
    readonly contrastLot: true;
    readonly imageQuality: true;
    readonly qcNotes: true;
    readonly executionNotes: true;
    readonly performedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export declare const examExecutionSelectShape: {
    readonly id: true;
    readonly itemId: true;
    readonly machineId: true;
    readonly machineName: true;
    readonly roomName: true;
    readonly positioning: true;
    readonly sedationUsed: true;
    readonly sedationAgent: true;
    readonly readyAt: true;
    readonly startedAt: true;
    readonly finishedAt: true;
    readonly viewsPerformed: true;
    readonly exposuresCount: true;
    readonly retakeCount: true;
    readonly kvp: true;
    readonly mas: true;
    readonly doseDap: true;
    readonly ctdiVol: true;
    readonly dlp: true;
    readonly contrastUsed: true;
    readonly contrastAgent: true;
    readonly contrastRoute: true;
    readonly contrastVolumeMl: true;
    readonly contrastLot: true;
    readonly imageQuality: true;
    readonly qcNotes: true;
    readonly executionNotes: true;
    readonly performedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type RadiologyExamExecutionResponse = Prisma.RadiologyExamExecutionGetPayload<{
    select: typeof examExecutionSelect;
}>;
declare const instanceSelect: {
    readonly id: true;
    readonly sopUid: true;
    readonly instanceNumber: true;
    readonly kind: true;
    readonly fileName: true;
    readonly sizeBytes: true;
    readonly mimeType: true;
    readonly transferSyntax: true;
    readonly rows: true;
    readonly columns: true;
    readonly frames: true;
};
declare const seriesSelect: {
    readonly id: true;
    readonly seriesUid: true;
    readonly seriesNumber: true;
    readonly modalityCode: true;
    readonly description: true;
    readonly bodyPart: true;
    readonly instances: {
        readonly select: {
            readonly id: true;
            readonly sopUid: true;
            readonly instanceNumber: true;
            readonly kind: true;
            readonly fileName: true;
            readonly sizeBytes: true;
            readonly mimeType: true;
            readonly transferSyntax: true;
            readonly rows: true;
            readonly columns: true;
            readonly frames: true;
        };
        readonly orderBy: {
            readonly instanceNumber: "asc";
        };
    };
};
declare const studySelect: {
    readonly id: true;
    readonly itemId: true;
    readonly studyUid: true;
    readonly description: true;
    readonly studyDate: true;
    readonly modality: true;
    readonly createdAt: true;
    readonly uploadedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly series: {
        readonly select: {
            readonly id: true;
            readonly seriesUid: true;
            readonly seriesNumber: true;
            readonly modalityCode: true;
            readonly description: true;
            readonly bodyPart: true;
            readonly instances: {
                readonly select: {
                    readonly id: true;
                    readonly sopUid: true;
                    readonly instanceNumber: true;
                    readonly kind: true;
                    readonly fileName: true;
                    readonly sizeBytes: true;
                    readonly mimeType: true;
                    readonly transferSyntax: true;
                    readonly rows: true;
                    readonly columns: true;
                    readonly frames: true;
                };
                readonly orderBy: {
                    readonly instanceNumber: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly seriesNumber: "asc";
        };
    };
};
export declare const radiologyInstanceSelectShape: {
    readonly id: true;
    readonly sopUid: true;
    readonly instanceNumber: true;
    readonly kind: true;
    readonly fileName: true;
    readonly sizeBytes: true;
    readonly mimeType: true;
    readonly transferSyntax: true;
    readonly rows: true;
    readonly columns: true;
    readonly frames: true;
};
export declare const radiologySeriesSelectShape: {
    readonly id: true;
    readonly seriesUid: true;
    readonly seriesNumber: true;
    readonly modalityCode: true;
    readonly description: true;
    readonly bodyPart: true;
    readonly instances: {
        readonly select: {
            readonly id: true;
            readonly sopUid: true;
            readonly instanceNumber: true;
            readonly kind: true;
            readonly fileName: true;
            readonly sizeBytes: true;
            readonly mimeType: true;
            readonly transferSyntax: true;
            readonly rows: true;
            readonly columns: true;
            readonly frames: true;
        };
        readonly orderBy: {
            readonly instanceNumber: "asc";
        };
    };
};
export declare const radiologyStudySelectShape: {
    readonly id: true;
    readonly itemId: true;
    readonly studyUid: true;
    readonly description: true;
    readonly studyDate: true;
    readonly modality: true;
    readonly createdAt: true;
    readonly uploadedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly series: {
        readonly select: {
            readonly id: true;
            readonly seriesUid: true;
            readonly seriesNumber: true;
            readonly modalityCode: true;
            readonly description: true;
            readonly bodyPart: true;
            readonly instances: {
                readonly select: {
                    readonly id: true;
                    readonly sopUid: true;
                    readonly instanceNumber: true;
                    readonly kind: true;
                    readonly fileName: true;
                    readonly sizeBytes: true;
                    readonly mimeType: true;
                    readonly transferSyntax: true;
                    readonly rows: true;
                    readonly columns: true;
                    readonly frames: true;
                };
                readonly orderBy: {
                    readonly instanceNumber: "asc";
                };
            };
        };
        readonly orderBy: {
            readonly seriesNumber: "asc";
        };
    };
};
export type RadiologyInstanceResponse = Prisma.RadiologyInstanceGetPayload<{
    select: typeof instanceSelect;
}>;
export type RadiologySeriesResponse = Prisma.RadiologySeriesGetPayload<{
    select: typeof seriesSelect;
}>;
export type RadiologyStudyResponse = Prisma.RadiologyStudyGetPayload<{
    select: typeof studySelect;
}>;
export declare const MODALITY_META: Record<RadiologyModality, {
    label: string;
    dicomCode: string;
}>;
export declare const SEDATION_LABELS: Record<SedationLevel, string>;
export declare const CONTRAST_ROUTE_LABELS: Record<ContrastRoute, string>;
export declare const IMAGE_QUALITY_META: Record<RadiologyImageQuality, {
    label: string;
    className: string;
}>;
/**
 * الإسقاطات (Views) المقترحة — قابلة للبحث ولا تمنع إدخال إسقاط مخصّص.
 * مقسّمة حسب منطقة التصوير لتسهيل الاختيار.
 */
export declare const VIEW_GROUPS: {
    label: string;
    options: string[];
}[];
/** مناطق التصوير المقترحة — قابلة للبحث مع إدخال حرّ */
export declare const BODY_PART_OPTIONS: readonly ["صدر", "بطن", "حوض", "عمود فقري — رقبي", "عمود فقري — صدري قطني", "جمجمة / رأس", "طرف أمامي", "طرف خلفي", "مفصل الورك", "مفصل الركبة", "مفصل الكوع", "أسنان / فك", "قلب", "جهاز بولي", "رحم / حمل", "كامل الجسم"];
/** ① فحص السلامة — كل الحقول اختيارية ليُحفظ تدريجيًا */
export declare const radiologySafetySchema: z.ZodObject<{
    fastingStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly FASTED: "FASTED";
        readonly PARTIAL: "PARTIAL";
        readonly NOT_FASTED: "NOT_FASTED";
    }>>>;
    fastingHours: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    medications: z.ZodDefault<z.ZodArray<z.ZodString>>;
    pregnancyPossible: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    metalImplants: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    implantNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priorContrastReaction: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    allergies: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    asaClass: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export type RadiologySafetyFormInput = z.input<typeof radiologySafetySchema>;
export type RadiologySafetyFormValues = z.output<typeof radiologySafetySchema>;
/** ② تجهيز الطفل — الوضعية والتهدئة */
export declare const radiologyPrepSchema: z.ZodObject<{
    positioning: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sedationUsed: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NONE: "NONE";
        readonly ANXIOLYSIS: "ANXIOLYSIS";
        readonly SEDATION: "SEDATION";
        readonly GENERAL_ANESTHESIA: "GENERAL_ANESTHESIA";
    }>>>;
    sedationAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RadiologyPrepFormInput = z.input<typeof radiologyPrepSchema>;
export type RadiologyPrepFormValues = z.output<typeof radiologyPrepSchema>;
/** ⑤ الالتقاط — الإسقاطات المنفَّذة ومعاملات التعريض والجرعة والتباين */
export declare const radiologyAcquisitionSchema: z.ZodObject<{
    performedById: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    viewsPerformed: z.ZodDefault<z.ZodArray<z.ZodString>>;
    exposuresCount: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    retakeCount: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    kvp: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    mas: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    doseDap: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    ctdiVol: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    dlp: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    contrastUsed: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    contrastAgent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contrastRoute: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly IV: "IV";
        readonly ORAL: "ORAL";
        readonly RECTAL: "RECTAL";
        readonly INTRA_ARTICULAR: "INTRA_ARTICULAR";
        readonly OTHER: "OTHER";
    }>>>;
    contrastVolumeMl: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    contrastLot: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    executionNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RadiologyAcquisitionFormInput = z.input<typeof radiologyAcquisitionSchema>;
export type RadiologyAcquisitionFormValues = z.output<typeof radiologyAcquisitionSchema>;
/** ⑦ فحص جودة الصور */
export declare const radiologyImageQcSchema: z.ZodObject<{
    imageQuality: z.ZodEnum<{
        readonly DIAGNOSTIC: "DIAGNOSTIC";
        readonly LIMITED: "LIMITED";
        readonly NON_DIAGNOSTIC: "NON_DIAGNOSTIC";
    }>;
    qcNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type RadiologyImageQcFormInput = z.input<typeof radiologyImageQcSchema>;
export type RadiologyImageQcFormValues = z.output<typeof radiologyImageQcSchema>;
/** ⑥ تسجيل دراسة مرفوعة — البيانات الوصفية بعد رفع الملفات إلى التخزين */
export declare const registerInstanceSchema: z.ZodObject<{
    sopUid: z.ZodString;
    instanceNumber: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    kind: z.ZodDefault<z.ZodEnum<{
        readonly DICOM: "DICOM";
        readonly IMAGE: "IMAGE";
    }>>;
    fileKey: z.ZodString;
    fileName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    transferSyntax: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    rows: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    columns: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    frames: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
}, z.core.$strip>;
export declare const registerSeriesSchema: z.ZodObject<{
    seriesUid: z.ZodString;
    seriesNumber: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    modalityCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bodyPart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    instances: z.ZodArray<z.ZodObject<{
        sopUid: z.ZodString;
        instanceNumber: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        kind: z.ZodDefault<z.ZodEnum<{
            readonly DICOM: "DICOM";
            readonly IMAGE: "IMAGE";
        }>>;
        fileKey: z.ZodString;
        fileName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        transferSyntax: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        rows: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        columns: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        frames: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const registerStudySchema: z.ZodObject<{
    studyUid: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    studyDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    modality: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly XRAY: "XRAY";
        readonly CT: "CT";
        readonly MRI: "MRI";
        readonly ULTRASOUND: "ULTRASOUND";
        readonly FLUOROSCOPY: "FLUOROSCOPY";
        readonly MAMMOGRAPHY: "MAMMOGRAPHY";
        readonly NUCLEAR: "NUCLEAR";
        readonly PET: "PET";
        readonly DENTAL: "DENTAL";
        readonly OTHER: "OTHER";
    }>>>;
    series: z.ZodArray<z.ZodObject<{
        seriesUid: z.ZodString;
        seriesNumber: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        modalityCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        bodyPart: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        instances: z.ZodArray<z.ZodObject<{
            sopUid: z.ZodString;
            instanceNumber: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
            kind: z.ZodDefault<z.ZodEnum<{
                readonly DICOM: "DICOM";
                readonly IMAGE: "IMAGE";
            }>>;
            fileKey: z.ZodString;
            fileName: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            sizeBytes: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
            mimeType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            transferSyntax: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            rows: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
            columns: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
            frames: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type RegisterStudyInput = z.infer<typeof registerStudySchema>;
export {};
