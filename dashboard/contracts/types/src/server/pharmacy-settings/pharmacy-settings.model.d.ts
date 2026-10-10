import Elysia from "elysia";
export declare const pharmacySettingsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "pharmacy-settings.update": import("@sinclair/typebox").TObject<{
            enabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            requireWitnessOnWaste: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            defaultLabelCopies: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            fefoSuggestion: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            controlledRegisterEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
