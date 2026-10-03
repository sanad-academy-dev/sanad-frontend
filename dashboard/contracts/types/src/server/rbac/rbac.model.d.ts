import Elysia from "elysia";
export declare const rbacModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "rbac.create-role": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "rbac.update-role": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "rbac.set-grants": import("@sinclair/typebox").TObject<{
            grants: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                key: import("@sinclair/typebox").TString;
                scope: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ALL">, import("@sinclair/typebox").TLiteral<"BRANCH">, import("@sinclair/typebox").TLiteral<"OWN">]>;
            }>>;
        }>;
        readonly "rbac.from-template": import("@sinclair/typebox").TObject<{
            templateKey: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "rbac.set-super-admin": import("@sinclair/typebox").TObject<{
            isSuperAdmin: import("@sinclair/typebox").TBoolean;
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
