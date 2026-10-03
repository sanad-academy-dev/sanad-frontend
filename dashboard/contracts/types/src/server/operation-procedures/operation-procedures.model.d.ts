import Elysia from "elysia";
export declare const operationProceduresModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "operationProcedures.upsertDefinition": import("@sinclair/typebox").TObject<{
            defaultTier: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MINOR">, import("@sinclair/typebox").TLiteral<"INTERMEDIATE">, import("@sinclair/typebox").TLiteral<"MAJOR">]>;
            defaultAnesthesia: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"ANXIOLYSIS">, import("@sinclair/typebox").TLiteral<"SEDATION">, import("@sinclair/typebox").TLiteral<"GENERAL_ANESTHESIA">]>>;
            defaultWoundClass: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CLEAN">, import("@sinclair/typebox").TLiteral<"CLEAN_CONTAMINATED">, import("@sinclair/typebox").TLiteral<"CONTAMINATED">, import("@sinclair/typebox").TLiteral<"DIRTY">]>]>>;
            requiresLaterality: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            bodySystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            codes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TObject<{
                snomed: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                cpt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                icd10pcs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                venom: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>]>>;
            specializationId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            prepNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            kitItems: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                inventoryItemId: import("@sinclair/typebox").TString;
                quantity: import("@sinclair/typebox").TInteger;
            }>>>;
        }>;
        readonly "operationProcedures.saveChecklistTemplate": import("@sinclair/typebox").TObject<{
            scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"OPERATION_SIGN_IN">, import("@sinclair/typebox").TLiteral<"OPERATION_TIME_OUT">, import("@sinclair/typebox").TLiteral<"OPERATION_SIGN_OUT">, import("@sinclair/typebox").TLiteral<"OPERATION_MINOR_COMBINED">]>;
            tier: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MINOR">, import("@sinclair/typebox").TLiteral<"INTERMEDIATE">, import("@sinclair/typebox").TLiteral<"MAJOR">]>]>>;
            nameAr: import("@sinclair/typebox").TString;
            nameEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                textAr: import("@sinclair/typebox").TString;
                textEn: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
                required: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                responseType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CONFIRM">, import("@sinclair/typebox").TLiteral<"YES_NO_NA">, import("@sinclair/typebox").TLiteral<"TEXT">, import("@sinclair/typebox").TLiteral<"NUMBER">]>>;
            }>>;
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
