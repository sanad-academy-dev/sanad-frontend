import Elysia from "elysia";
export declare const inboxSettingsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "inbox-settings.update": import("@sinclair/typebox").TObject<{
            liveEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            toastEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            soundEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            soundName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"CHIME">, import("@sinclair/typebox").TLiteral<"PING">, import("@sinclair/typebox").TLiteral<"MARIMBA">, import("@sinclair/typebox").TLiteral<"KNOCK">]>>;
            soundVolume: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            desktopEnabled: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            onlyHighImportance: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeAppointments: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeLab: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeRadiology: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeTasks: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeStock: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeInvoices: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeMentions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeApprovals: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeSystem: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            typeInpatients: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
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
