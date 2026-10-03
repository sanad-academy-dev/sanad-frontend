import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { MucousMembrane, type VitalSignsSource } from "@/generated/prisma/enums";
export type { MucousMembrane, VitalSignsSource };
export declare const VITALS_FRESHNESS: {
    /** أحدث من ذلك: يُختار مسبقًا بلا تنبيه */
    readonly FRESH_MINUTES: number;
    /** أقدم من ذلك: لا يُختار مسبقًا */
    readonly STALE_MINUTES: number;
};
export type VitalsFreshness = "FRESH" | "AGING" | "STALE";
export declare function vitalsFreshness(recordedAt: Date | string, now?: Date): VitalsFreshness;
declare const vitalSignsSelect: {
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
export declare const vitalSignsSelectShape: {
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
export type VitalSignsRecordResponse = Prisma.VitalSignsRecordGetPayload<{
    select: typeof vitalSignsSelect;
}>;
/** السجل مع المستندات المرتبطة به — يُستعمل لفحص قابلية التعديل/الحذف */
export type VitalSignsRecordWithLinks = Prisma.VitalSignsRecordGetPayload<{
    select: typeof vitalSignsSelect & {
        clinicalExams: {
            select: {
                id: true;
            };
        };
        preAnalyticals: {
            select: {
                id: true;
            };
        };
        safetyScreenings: {
            select: {
                id: true;
            };
        };
    };
}>;
/** المفاتيح الرقمية القابلة للرسم البياني — مصدر واحد للجدول والرسم */
export declare const VITALS_METRIC_KEYS: readonly ["weight", "temperature", "heartRate", "respiratoryRate", "oxygenSaturation", "painScore", "bodyConditionScore", "capillaryRefillSec"];
export type VitalsMetricKey = (typeof VITALS_METRIC_KEYS)[number];
export declare const createVitalSignsSchema: z.ZodObject<{
    patientId: z.ZodString;
    recordedAt: z.ZodOptional<z.ZodDate>;
    branchId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    weight: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    temperature: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    heartRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    respiratoryRate: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    oxygenSaturation: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    bloodPressure: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    painScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    bodyConditionScore: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    capillaryRefillSec: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    mucousMembrane: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly PINK: "PINK";
        readonly PALE: "PALE";
        readonly CYANOTIC: "CYANOTIC";
        readonly ICTERIC: "ICTERIC";
        readonly CONGESTED: "CONGESTED";
        readonly MUDDY: "MUDDY";
    }>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/** كل ما يُعدّ قياسًا — المقاييس الرقمية إضافةً إلى ضغط الدم والأغشية المخاطية */
export declare const VITALS_MEASUREMENT_KEYS: readonly ["weight", "temperature", "heartRate", "respiratoryRate", "oxygenSaturation", "painScore", "bodyConditionScore", "capillaryRefillSec", "bloodPressure", "mucousMembrane"];
export type VitalsMeasurementKey = (typeof VITALS_MEASUREMENT_KEYS)[number];
/**
 * سجل بلا أي قياس لا معنى له — يشوّش الجدول ويضيف نقطة فارغة للرسم البياني.
 * الفحص دالة مستقلة لا refine على المخطط: خطأ المستوى الأعلى في zodResolver
 * يصل بمسار فارغ يصعب عرضه، والقاعدة نفسها يفرضها الخادم على كل مسار كتابة.
 */
export declare function hasAnyMeasurement(v: Partial<Record<VitalsMeasurementKey, unknown>>): boolean;
export declare const EMPTY_RECORD_MESSAGE = "\u0623\u062F\u062E\u0644 \u0642\u064A\u0627\u0633\u064B\u0627 \u0648\u0627\u062D\u062F\u064B\u0627 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644";
export type CreateVitalSignsFormInput = z.input<typeof createVitalSignsSchema>;
export type CreateVitalSignsFormValues = z.output<typeof createVitalSignsSchema>;
/** مدخل الـ DAO — مشتق من Prisma لا مكتوب يدويًا */
export type CreateVitalSignsInput = Pick<Prisma.VitalSignsRecordUncheckedCreateInput, "clinicId" | "patientId" | "branchId" | "recordedAt" | "source" | "recordedById" | "appointmentId" | "labOrderId" | "radiologyOrderId" | "operationId" | "weight" | "temperature" | "heartRate" | "respiratoryRate" | "oxygenSaturation" | "bloodPressure" | "painScore" | "bodyConditionScore" | "capillaryRefillSec" | "mucousMembrane" | "notes" | "correctsId">;
export type UpdateVitalSignsInput = Partial<Omit<CreateVitalSignsInput, "clinicId" | "patientId" | "source" | "correctsId">>;
export declare const VITALS_ATTACH_TYPES: readonly ["VISIT", "LAB", "RADIOLOGY", "OPERATION"];
export type VitalsAttachType = (typeof VITALS_ATTACH_TYPES)[number];
/** «أنشئ واستعمل هنا» — الإنشاء والربط في نداء واحد داخل معاملة واحدة */
export type VitalsAttachTarget = {
    type: VitalsAttachType;
    id: string;
};
/** نتائج الـ DAO التي يترجمها المتحكّم إلى رموز HTTP ورسائل عربية */
export type VitalsDaoError = "not-found" | "patient-not-found" | "linked-immutable" | "linked-undeletable" | "attach-target-not-found" | "empty-record";
