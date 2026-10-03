import Elysia from "elysia";
/**
 * [E0] مخطّطات تحقّق الطلبات — TypeBox مع تعدادات prismabox (AGENTS.md).
 */
export declare const emergencyModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "emergency.createArrival": import("@sinclair/typebox").TObject<{
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"WALK_IN">, import("@sinclair/typebox").TLiteral<"PHONE">, import("@sinclair/typebox").TLiteral<"PUBLIC_BOOKING">, import("@sinclair/typebox").TLiteral<"PET_PORTAL">, import("@sinclair/typebox").TLiteral<"AGENT">, import("@sinclair/typebox").TLiteral<"REFERRAL">, import("@sinclair/typebox").TLiteral<"MOBILE_REQUEST">, import("@sinclair/typebox").TLiteral<"SCHEDULED_VISIT">]>>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            provisionalLabel: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            presentingComplaint: import("@sinclair/typebox").TString;
            expectedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            arrivedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.transitionArrival": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"EN_ROUTE">, import("@sinclair/typebox").TLiteral<"ARRIVED">, import("@sinclair/typebox").TLiteral<"TRIAGED">, import("@sinclair/typebox").TLiteral<"DISPOSED">, import("@sinclair/typebox").TLiteral<"LEFT_WITHOUT_TRIAGE">, import("@sinclair/typebox").TLiteral<"CANCELLED">]>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.assess": import("@sinclair/typebox").TObject<{
            arrivalId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            appointmentId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            discriminators: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"RED">, import("@sinclair/typebox").TLiteral<"ORANGE">, import("@sinclair/typebox").TLiteral<"YELLOW">, import("@sinclair/typebox").TLiteral<"GREEN">, import("@sinclair/typebox").TLiteral<"BLUE">]>]>>;
            overrideReason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            patientId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            staffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            stability: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"STABLE">, import("@sinclair/typebox").TLiteral<"UNSTABLE">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
            vitalsRecordId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.dispose": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DISCHARGED">, import("@sinclair/typebox").TLiteral<"ADMITTED">, import("@sinclair/typebox").TLiteral<"TO_SURGERY">, import("@sinclair/typebox").TLiteral<"TRANSFERRED">, import("@sinclair/typebox").TLiteral<"LEFT_AGAINST_ADVICE">, import("@sinclair/typebox").TLiteral<"DIED">, import("@sinclair/typebox").TLiteral<"EUTHANIZED">]>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            transferDestination: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            admit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TObject<{
                kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEDICAL">, import("@sinclair/typebox").TLiteral<"SURGICAL">, import("@sinclair/typebox").TLiteral<"ICU">, import("@sinclair/typebox").TLiteral<"ISOLATION">, import("@sinclair/typebox").TLiteral<"BOARDING">]>]>>;
                acuity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"CRITICAL">]>]>>;
                attendingStaffId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>]>>;
            surgery: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TObject<{
                procedureServiceId: import("@sinclair/typebox").TString;
                surgeonStaffId: import("@sinclair/typebox").TString;
                estimatedDurationMin: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            }>]>>;
        }>;
        readonly "emergency.registerPatient": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            gender: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MALE">, import("@sinclair/typebox").TLiteral<"FEMALE">, import("@sinclair/typebox").TLiteral<"UNKNOWN">]>;
            animalTypeId: import("@sinclair/typebox").TString;
            birthDate: import("@sinclair/typebox").TString;
            ownerId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            weight: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "emergency.boardQuery": import("@sinclair/typebox").TObject<{
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            q: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "emergency.createPatientAlert": import("@sinclair/typebox").TObject<{
            patientId: import("@sinclair/typebox").TString;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALLERGY">, import("@sinclair/typebox").TLiteral<"CHRONIC_CONDITION">, import("@sinclair/typebox").TLiteral<"BITE_RISK">, import("@sinclair/typebox").TLiteral<"CODE_STATUS">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            label: import("@sinclair/typebox").TString;
            severity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MILD">, import("@sinclair/typebox").TLiteral<"MODERATE">, import("@sinclair/typebox").TLiteral<"SEVERE">]>>;
            notes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
