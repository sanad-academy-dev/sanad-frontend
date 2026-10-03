import Elysia from "elysia";
export declare const staffRolesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "staff-roles.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
        }>;
        readonly "staff-roles.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
        }>;
        readonly "staff-roles.update-permissions": import("@sinclair/typebox").TObject<{
            permissions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
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
