import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { ClinicalLevel, ClinicalSymptom, DiagnosisSeverity, ExamCondition } from "@/generated/prisma/enums";
export type { ClinicalLevel, ClinicalSymptom, DiagnosisSeverity, ExamCondition };
declare const clinicalExamSelect: {
    id: true;
    appointmentId: true;
    startedAt: true;
    completedAt: true;
    currentStep: true;
    chiefComplaint: true;
    duration: true;
    presentIllnessHistory: true;
    ownerNotes: true;
    symptoms: true;
    urination: true;
    defecation: true;
    appetite: true;
    waterIntake: true;
    vitalsRecordId: true;
    vitalsRecord: {
        select: {
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
    hydration: true;
    skinCondition: true;
    hairCondition: true;
    eyeCondition: true;
    boneCondition: true;
    respiratorySystem: true;
    digestiveSystem: true;
    nervousSystem: true;
    earCondition: true;
    checklistPatientData: true;
    checklistChiefComplaint: true;
    checklistSymptomDuration: true;
    checklistDiet: true;
    checklistVaccinations: true;
    vaccinationReviewedAt: true;
    checklistPreviousTreatments: true;
    checklistTemperature: true;
    checklistHeartRate: true;
    checklistBloodPressure: true;
    checklistHydration: true;
    checklistBehavior: true;
    checklistAppetite: true;
    checklistOxygen: true;
    checklistSkin: true;
    checklistSeverity: true;
    checklistAppearance: true;
    checklistRespiration: true;
    checklistDigestive: true;
    checklistNervous: true;
    checklistEar: true;
    checklistVomiting: true;
    checklistConsciousness: true;
    checklistDiagnosis: true;
    checklistUltrasound: true;
    checklistReferral: true;
    checklistXray: true;
    checklistFollowup: true;
    preliminaryDiagnosis: true;
    severity: true;
    diagnosisDescription: true;
    dietPlan: true;
    monitoringPlan: true;
    createdAt: true;
    appointment: {
        select: {
            patientId: true;
        };
    };
    updatedAt: true;
};
export declare const clinicalExamSelectShape: {
    id: true;
    appointmentId: true;
    startedAt: true;
    completedAt: true;
    currentStep: true;
    chiefComplaint: true;
    duration: true;
    presentIllnessHistory: true;
    ownerNotes: true;
    symptoms: true;
    urination: true;
    defecation: true;
    appetite: true;
    waterIntake: true;
    vitalsRecordId: true;
    vitalsRecord: {
        select: {
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
    hydration: true;
    skinCondition: true;
    hairCondition: true;
    eyeCondition: true;
    boneCondition: true;
    respiratorySystem: true;
    digestiveSystem: true;
    nervousSystem: true;
    earCondition: true;
    checklistPatientData: true;
    checklistChiefComplaint: true;
    checklistSymptomDuration: true;
    checklistDiet: true;
    checklistVaccinations: true;
    vaccinationReviewedAt: true;
    checklistPreviousTreatments: true;
    checklistTemperature: true;
    checklistHeartRate: true;
    checklistBloodPressure: true;
    checklistHydration: true;
    checklistBehavior: true;
    checklistAppetite: true;
    checklistOxygen: true;
    checklistSkin: true;
    checklistSeverity: true;
    checklistAppearance: true;
    checklistRespiration: true;
    checklistDigestive: true;
    checklistNervous: true;
    checklistEar: true;
    checklistVomiting: true;
    checklistConsciousness: true;
    checklistDiagnosis: true;
    checklistUltrasound: true;
    checklistReferral: true;
    checklistXray: true;
    checklistFollowup: true;
    preliminaryDiagnosis: true;
    severity: true;
    diagnosisDescription: true;
    dietPlan: true;
    monitoringPlan: true;
    createdAt: true;
    appointment: {
        select: {
            patientId: true;
        };
    };
    updatedAt: true;
};
export type ClinicalExamResponse = Prisma.ClinicalExamGetPayload<{
    select: typeof clinicalExamSelect;
}>;
export declare const symptomsHistoryStrictSchema: z.ZodObject<{
    chiefComplaint: z.ZodString;
    duration: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    presentIllnessHistory: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ownerNotes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    symptoms: z.ZodArray<z.ZodEnum<{
        readonly VOMITING: "VOMITING";
        readonly DIARRHEA: "DIARRHEA";
        readonly COUGH: "COUGH";
        readonly SNEEZING: "SNEEZING";
        readonly LETHARGY: "LETHARGY";
    }>>;
    urination: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>;
    defecation: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>;
    appetite: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>;
    waterIntake: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>;
}, z.core.$strip>;
export declare const symptomsHistoryPartialSchema: z.ZodObject<{
    chiefComplaint: z.ZodOptional<z.ZodString>;
    duration: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    presentIllnessHistory: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    ownerNotes: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    symptoms: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        readonly VOMITING: "VOMITING";
        readonly DIARRHEA: "DIARRHEA";
        readonly COUGH: "COUGH";
        readonly SNEEZING: "SNEEZING";
        readonly LETHARGY: "LETHARGY";
    }>>>;
    urination: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>>;
    defecation: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>>;
    appetite: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>>;
    waterIntake: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly INCREASED: "INCREASED";
        readonly DECREASED: "DECREASED";
        readonly ABSENT: "ABSENT";
    }>>>>;
}, z.core.$strip>;
export type SymptomsHistoryFormInput = z.infer<typeof symptomsHistoryStrictSchema>;
export type SymptomsHistoryPartialInput = z.infer<typeof symptomsHistoryPartialSchema>;
export type UpsertSymptomsHistoryInput = Pick<Prisma.ClinicalExamUncheckedCreateInput, "chiefComplaint" | "duration" | "presentIllnessHistory" | "ownerNotes" | "urination" | "defecation" | "appetite" | "waterIntake"> & {
    symptoms?: ClinicalSymptom[];
    currentStep?: number;
};
export declare const vitalsSchema: z.ZodObject<{
    hydration: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    skinCondition: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    hairCondition: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    eyeCondition: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    boneCondition: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    respiratorySystem: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    digestiveSystem: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    nervousSystem: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    earCondition: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly NORMAL: "NORMAL";
        readonly ABNORMAL: "ABNORMAL";
        readonly NOT_EXAMINED: "NOT_EXAMINED";
    }>>>;
    checklistPatientData: z.ZodBoolean;
    checklistChiefComplaint: z.ZodBoolean;
    checklistSymptomDuration: z.ZodBoolean;
    checklistDiet: z.ZodBoolean;
    checklistVaccinations: z.ZodBoolean;
    checklistPreviousTreatments: z.ZodBoolean;
    checklistTemperature: z.ZodBoolean;
    checklistHeartRate: z.ZodBoolean;
    checklistBloodPressure: z.ZodBoolean;
    checklistHydration: z.ZodBoolean;
    checklistBehavior: z.ZodBoolean;
    checklistAppetite: z.ZodBoolean;
    checklistOxygen: z.ZodBoolean;
    checklistSkin: z.ZodBoolean;
    checklistSeverity: z.ZodBoolean;
    checklistAppearance: z.ZodBoolean;
    checklistRespiration: z.ZodBoolean;
    checklistDigestive: z.ZodBoolean;
    checklistNervous: z.ZodBoolean;
    checklistEar: z.ZodBoolean;
    checklistVomiting: z.ZodBoolean;
    checklistConsciousness: z.ZodBoolean;
    checklistDiagnosis: z.ZodBoolean;
    checklistUltrasound: z.ZodBoolean;
    checklistReferral: z.ZodBoolean;
    checklistXray: z.ZodBoolean;
    checklistFollowup: z.ZodBoolean;
    vaccinationReviewedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type VitalsFormInput = z.infer<typeof vitalsSchema>;
export type UpsertVitalsInput = Pick<Prisma.ClinicalExamUncheckedCreateInput, "hydration" | "skinCondition" | "hairCondition" | "eyeCondition" | "boneCondition" | "respiratorySystem" | "digestiveSystem" | "nervousSystem" | "earCondition" | "checklistPatientData" | "checklistChiefComplaint" | "checklistSymptomDuration" | "checklistDiet" | "checklistVaccinations" | "checklistPreviousTreatments" | "checklistTemperature" | "checklistHeartRate" | "checklistBloodPressure" | "checklistHydration" | "checklistBehavior" | "checklistAppetite" | "checklistOxygen" | "checklistSkin" | "checklistSeverity" | "checklistAppearance" | "checklistRespiration" | "checklistDigestive" | "checklistNervous" | "checklistEar" | "checklistVomiting" | "checklistConsciousness" | "checklistDiagnosis" | "checklistUltrasound" | "checklistReferral" | "checklistXray" | "checklistFollowup" | "vaccinationReviewedAt"> & {
    currentStep?: number;
};
export declare const diagnosisStrictSchema: z.ZodObject<{
    preliminaryDiagnosis: z.ZodString;
    severity: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        readonly MILD: "MILD";
        readonly MODERATE: "MODERATE";
        readonly SEVERE: "SEVERE";
        readonly CRITICAL: "CRITICAL";
    }>>>;
    diagnosisDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type DiagnosisFormInput = z.infer<typeof diagnosisStrictSchema>;
export type UpsertDiagnosisInput = Pick<Prisma.ClinicalExamUncheckedCreateInput, "preliminaryDiagnosis" | "severity" | "diagnosisDescription"> & {
    currentStep?: number;
};
export declare const treatmentPlanSchema: z.ZodObject<{
    dietPlan: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    monitoringPlan: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type TreatmentPlanFormInput = z.infer<typeof treatmentPlanSchema>;
export type UpsertTreatmentPlanInput = Pick<Prisma.ClinicalExamUncheckedCreateInput, "dietPlan" | "monitoringPlan"> & {
    currentStep?: number;
    complete?: boolean;
};
