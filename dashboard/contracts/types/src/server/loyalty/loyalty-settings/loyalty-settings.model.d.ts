import Elysia from "elysia";
export declare const loyaltySettingsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "loyaltySettings.update": import("@sinclair/typebox").TObject<{
            enableLoyaltyModule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            loyaltyTierWindowMonths: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            loyaltyExpiryNoticeDays: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
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
