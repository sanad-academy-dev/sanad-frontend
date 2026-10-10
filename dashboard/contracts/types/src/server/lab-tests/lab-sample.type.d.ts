import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { LabFastingStatus, LabSampleQuality, LabTubeType } from "@/generated/prisma/enums";
declare const preAnalyticalSelect: {
    readonly id: true;
    readonly orderId: true;
    readonly fastingStatus: true;
    readonly fastingHours: true;
    readonly medications: true;
    readonly ivFluids24h: true;
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
export declare const preAnalyticalSelectShape: {
    readonly id: true;
    readonly orderId: true;
    readonly fastingStatus: true;
    readonly fastingHours: true;
    readonly medications: true;
    readonly ivFluids24h: true;
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
export type LabPreAnalyticalResponse = Prisma.LabPreAnalyticalGetPayload<{
    select: typeof preAnalyticalSelect;
}>;
declare const sampleCollectionSelect: {
    readonly id: true;
    readonly itemId: true;
    readonly tubeType: true;
    readonly drawSite: true;
    readonly volumeMl: true;
    readonly attempts: true;
    readonly collectedAt: true;
    readonly quality: true;
    readonly collectionNotes: true;
    readonly analyzerId: true;
    readonly analyzerName: true;
    readonly handedOverAt: true;
    readonly labelsPrinted: true;
    readonly collectedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export declare const sampleCollectionSelectShape: {
    readonly id: true;
    readonly itemId: true;
    readonly tubeType: true;
    readonly drawSite: true;
    readonly volumeMl: true;
    readonly attempts: true;
    readonly collectedAt: true;
    readonly quality: true;
    readonly collectionNotes: true;
    readonly analyzerId: true;
    readonly analyzerName: true;
    readonly handedOverAt: true;
    readonly labelsPrinted: true;
    readonly collectedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type LabSampleCollectionResponse = Prisma.LabSampleCollectionGetPayload<{
    select: typeof sampleCollectionSelect;
}>;
export declare const FASTING_LABELS: Record<LabFastingStatus, string>;
export declare const TUBE_LABELS: Record<LabTubeType, {
    label: string;
    hint: string;
}>;
export declare const QUALITY_META: Record<LabSampleQuality, {
    label: string;
    className: string;
}>;
/**
 * مواقع سحب العيّنة — مجموعة مقترحة قابلة للبحث، ولا تمنع إدخال موقع مخصّص.
 * مقسّمة حسب نوع العيّنة لتسهيل الاختيار.
 */
export declare const DRAW_SITE_GROUPS: {
    label: string;
    options: string[];
}[];
/** الأدوية الحالية — خيارات ثابتة؛ "لا يتناول أدوية" يُلغي البقية */
export declare const MEDICATION_OPTIONS: readonly ["المضادات الحيوية", "الستيرويدات", "مدرات البول", "مضادات الالتهاب", "أدوية القلب"];
export declare const NO_MEDICATIONS = "\u0644\u0627 \u064A\u062A\u0646\u0627\u0648\u0644 \u0623\u062F\u0648\u064A\u0629";
/** ① التقييم ما قبل التحليلي — كل الحقول اختيارية ليُحفظ تدريجيًا */
export declare const preAnalyticalSchema: z.ZodObject<{
    fastingStatus: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly FASTED: "FASTED";
        readonly PARTIAL: "PARTIAL";
        readonly NOT_FASTED: "NOT_FASTED";
    }>>>;
    fastingHours: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    medications: z.ZodDefault<z.ZodArray<z.ZodString>>;
    ivFluids24h: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strip>;
export type PreAnalyticalFormInput = z.input<typeof preAnalyticalSchema>;
export type PreAnalyticalFormValues = z.output<typeof preAnalyticalSchema>;
/** ② تفاصيل الجمع */
export declare const collectionDetailsSchema: z.ZodObject<{
    tubeType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly EDTA: "EDTA";
        readonly SST: "SST";
        readonly CITRATE: "CITRATE";
        readonly HEPARIN: "HEPARIN";
        readonly URINE: "URINE";
        readonly SWAB: "SWAB";
    }>>>;
    collectedById: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    drawSite: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    volumeMl: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    attempts: z.ZodOptional<z.ZodNullable<z.ZodCoercedNumber<unknown>>>;
    collectedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    quality: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly EXCELLENT: "EXCELLENT";
        readonly GOOD: "GOOD";
        readonly ACCEPTABLE: "ACCEPTABLE";
        readonly REJECTED: "REJECTED";
    }>>>;
    collectionNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CollectionDetailsFormInput = z.input<typeof collectionDetailsSchema>;
export type CollectionDetailsFormValues = z.output<typeof collectionDetailsSchema>;
/** ③ تسليم العيّنة لقسم المعالجة + عدد الملصقات المطبوعة */
export declare const handoverSchema: z.ZodObject<{
    labelsPrinted: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type HandoverFormInput = z.input<typeof handoverSchema>;
export {};
