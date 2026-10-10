import Elysia from "elysia";
export declare const clinicDocumentsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "clinic-documents.create": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LICENSE">, import("@sinclair/typebox").TLiteral<"REGISTRATION">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"POLICY">, import("@sinclair/typebox").TLiteral<"FINANCIAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>;
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FILE">, import("@sinclair/typebox").TLiteral<"LINK">]>;
            title: import("@sinclair/typebox").TString;
            url: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            issuedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            mimeType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            sizeBytes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
        }>;
        readonly "clinic-documents.update": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LICENSE">, import("@sinclair/typebox").TLiteral<"REGISTRATION">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"POLICY">, import("@sinclair/typebox").TLiteral<"FINANCIAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            issuedAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            expiresAt: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "clinic-documents.list": import("@sinclair/typebox").TObject<{
            category: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LICENSE">, import("@sinclair/typebox").TLiteral<"REGISTRATION">, import("@sinclair/typebox").TLiteral<"CONTRACT">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"POLICY">, import("@sinclair/typebox").TLiteral<"FINANCIAL">, import("@sinclair/typebox").TLiteral<"OTHER">]>>;
            branchId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            expiry: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"valid">, import("@sinclair/typebox").TLiteral<"expiring">, import("@sinclair/typebox").TLiteral<"expired">]>>;
            search: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"FILE">, import("@sinclair/typebox").TLiteral<"LINK">]>>;
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
