import Elysia from "elysia";
export declare const onboardingModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "onboarding.clinic-info": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            slug: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "onboarding.profile": import("@sinclair/typebox").TObject<{
            specialtyType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"VET_CLINIC">, import("@sinclair/typebox").TLiteral<"VET_HOSPITAL">, import("@sinclair/typebox").TLiteral<"GROOMING_CENTER">, import("@sinclair/typebox").TLiteral<"MOBILE_SERVICES">, import("@sinclair/typebox").TLiteral<"SPECIALIZED_SURGERY">, import("@sinclair/typebox").TLiteral<"MULTI_SERVICES">]>]>>;
            mainGoal: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"APPOINTMENTS_MANAGEMENT">, import("@sinclair/typebox").TLiteral<"PATIENTS_MANAGEMENT">, import("@sinclair/typebox").TLiteral<"INVENTORY_MANAGEMENT">, import("@sinclair/typebox").TLiteral<"BILLING_MANAGEMENT">, import("@sinclair/typebox").TLiteral<"REVENUE_IMPROVEMENT">, import("@sinclair/typebox").TLiteral<"WORKFLOW_AUTOMATION">, import("@sinclair/typebox").TLiteral<"PAPERWORK_REDUCTION">, import("@sinclair/typebox").TLiteral<"CUSTOMER_EXPERIENCE">]>]>>;
            clinicSize: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SOLO">, import("@sinclair/typebox").TLiteral<"SMALL">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"MEDICAL_CENTER">, import("@sinclair/typebox").TLiteral<"HOSPITAL">]>]>>;
            animalTypes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            monthlyVisits: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"UNDER_50">, import("@sinclair/typebox").TLiteral<"RANGE_50_100">, import("@sinclair/typebox").TLiteral<"RANGE_101_250">, import("@sinclair/typebox").TLiteral<"OVER_1000">]>]>>;
            monthlyPatients: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"UNDER_50">, import("@sinclair/typebox").TLiteral<"RANGE_50_100">, import("@sinclair/typebox").TLiteral<"RANGE_101_250">, import("@sinclair/typebox").TLiteral<"OVER_1000">]>]>>;
            multiBranch: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TBoolean]>>;
            serviceDelivery: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"IN_CLINIC">, import("@sinclair/typebox").TLiteral<"REMOTE">, import("@sinclair/typebox").TLiteral<"MOBILE_CLINIC">, import("@sinclair/typebox").TLiteral<"ALL">]>]>>;
            referralSource: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FRIEND">, import("@sinclair/typebox").TLiteral<"GOOGLE">, import("@sinclair/typebox").TLiteral<"TWITTER">, import("@sinclair/typebox").TLiteral<"LINKEDIN">, import("@sinclair/typebox").TLiteral<"BLOG">, import("@sinclair/typebox").TLiteral<"NEWSLETTER">, import("@sinclair/typebox").TLiteral<"PODCAST">, import("@sinclair/typebox").TLiteral<"OTHER">]>]>>;
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
