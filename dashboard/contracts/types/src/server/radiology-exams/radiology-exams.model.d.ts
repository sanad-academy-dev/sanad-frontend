import Elysia from "elysia";
export declare const radiologyExamsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "radiologyExams.upsertDefinition": import("@sinclair/typebox").TObject<{
            modality: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"XRAY">, import("@sinclair/typebox").TLiteral<"CT">, import("@sinclair/typebox").TLiteral<"MRI">, import("@sinclair/typebox").TLiteral<"ULTRASOUND">, import("@sinclair/typebox").TLiteral<"FLUOROSCOPY">, import("@sinclair/typebox").TLiteral<"MAMMOGRAPHY">, import("@sinclair/typebox").TLiteral<"NUCLEAR">, import("@sinclair/typebox").TLiteral<"PET">, import("@sinclair/typebox").TLiteral<"DENTAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            bodyPart: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            defaultViews: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            lateralityRequired: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            contrastDefault: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            sedationDefault: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NONE">, import("@sinclair/typebox").TLiteral<"ANXIOLYSIS">, import("@sinclair/typebox").TLiteral<"SEDATION">, import("@sinclair/typebox").TLiteral<"GENERAL_ANESTHESIA">]>>;
            prepNotes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
