import Elysia from "elysia";
export declare const marketingAccountsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "marketing-accounts.list": import("@sinclair/typebox").TObject<{
            platform: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">, import("@sinclair/typebox").TLiteral<"LINKEDIN">, import("@sinclair/typebox").TLiteral<"TIKTOK">, import("@sinclair/typebox").TLiteral<"X">, import("@sinclair/typebox").TLiteral<"PINTEREST">, import("@sinclair/typebox").TLiteral<"SNAPCHAT">]>>;
        }>;
        readonly "marketing-accounts.ensure": import("@sinclair/typebox").TObject<{
            platform: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FACEBOOK">, import("@sinclair/typebox").TLiteral<"INSTAGRAM">]>;
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
