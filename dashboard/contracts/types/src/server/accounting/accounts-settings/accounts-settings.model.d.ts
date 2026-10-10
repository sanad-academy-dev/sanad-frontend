import Elysia from "elysia";
/**
 * [P0.4] Request validation for Accounts Settings (BRD §19).
 *
 * TypeBox guards the transport shape only — a record of known-ish primitives. The value
 * rules that matter (which keys exist, their type, enum options, min/max) live in the
 * definition registry and are enforced by `parseSettingValue`, which raises Arabic errors
 * naming the offending setting. Restating 44 keys here would duplicate that source of truth
 * and drift from it the first time a flag is added.
 */
export declare const accountsSettingsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "accounting-accounts-settings.update": import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TBoolean, import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TString, import("@sinclair/typebox").TNull, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>]>>;
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
