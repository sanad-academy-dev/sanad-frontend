import Elysia from "elysia";
export declare const clinicalExamsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "clinicalExams.upsertSymptomsHistory": import("@sinclair/typebox").TObject<{
            chiefComplaint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            duration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            presentIllnessHistory: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ownerNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            symptoms: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VOMITING">, import("@sinclair/typebox").TLiteral<"DIARRHEA">, import("@sinclair/typebox").TLiteral<"COUGH">, import("@sinclair/typebox").TLiteral<"SNEEZING">, import("@sinclair/typebox").TLiteral<"LETHARGY">]>>>;
            urination: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"INCREASED">, import("@sinclair/typebox").TLiteral<"DECREASED">, import("@sinclair/typebox").TLiteral<"ABSENT">]>]>>;
            defecation: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"INCREASED">, import("@sinclair/typebox").TLiteral<"DECREASED">, import("@sinclair/typebox").TLiteral<"ABSENT">]>]>>;
            appetite: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"INCREASED">, import("@sinclair/typebox").TLiteral<"DECREASED">, import("@sinclair/typebox").TLiteral<"ABSENT">]>]>>;
            waterIntake: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"INCREASED">, import("@sinclair/typebox").TLiteral<"DECREASED">, import("@sinclair/typebox").TLiteral<"ABSENT">]>]>>;
            currentStep: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "clinicalExams.upsertVitals": import("@sinclair/typebox").TObject<{
            hydration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            skinCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            hairCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            eyeCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            boneCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            respiratorySystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            digestiveSystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            nervousSystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            earCondition: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NORMAL">, import("@sinclair/typebox").TLiteral<"ABNORMAL">, import("@sinclair/typebox").TLiteral<"NOT_EXAMINED">]>]>>;
            checklistPatientData: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            checklistChiefComplaint: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            checklistSymptomDuration: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            checklistDiet: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            checklistVaccinations: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            vaccinationReviewedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            checklistPreviousTreatments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            checklistTemperature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            currentStep: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "clinicalExams.upsertDiagnosis": import("@sinclair/typebox").TObject<{
            preliminaryDiagnosis: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MILD">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
            diagnosisDescription: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            currentStep: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "clinicalExams.upsertTreatmentPlan": import("@sinclair/typebox").TObject<{
            dietPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            monitoringPlan: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            currentStep: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            complete: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
    };
    error: {};
}, {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
}, {}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}, {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
}>;
