import Elysia from "elysia";
export declare const staffDocumentsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "staff-documents.create": import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOCUMENT">, import("@sinclair/typebox").TLiteral<"CERTIFICATE">, import("@sinclair/typebox").TLiteral<"IMAGE">]>;
            kind: import("@sinclair/typebox").TLiteral<"FILE">;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>, import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DOCUMENT">, import("@sinclair/typebox").TLiteral<"CERTIFICATE">, import("@sinclair/typebox").TLiteral<"IMAGE">]>;
            kind: import("@sinclair/typebox").TLiteral<"LINK">;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
        }>]>;
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
