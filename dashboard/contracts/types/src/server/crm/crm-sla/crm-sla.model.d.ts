import Elysia from "elysia";
/** [CRM-P5] مخططات حدود HTTP (NFR-3). */
export declare const crmSlaModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "crmSla.policy": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            appliesTo: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LEAD">, import("@sinclair/typebox").TLiteral<"DEAL">, import("@sinclair/typebox").TLiteral<"BOTH">]>;
            firstResponseMinutes: import("@sinclair/typebox").TInteger;
            order: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            isActive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            sources: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                sourceId: import("@sinclair/typebox").TString;
                firstResponseMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            }>>>;
        }>;
        readonly "crmSla.view": import("@sinclair/typebox").TObject<{
            entity: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LEAD">, import("@sinclair/typebox").TLiteral<"DEAL">]>;
            name: import("@sinclair/typebox").TString;
            filters: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TUnknown>>;
            sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TObject<{
                field: import("@sinclair/typebox").TString;
                direction: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"asc">, import("@sinclair/typebox").TLiteral<"desc">]>;
            }>]>>;
            visibleColumns: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            layout: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LIST">, import("@sinclair/typebox").TLiteral<"KANBAN">]>>;
            isPinned: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            isPublic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmSla.views.query": import("@sinclair/typebox").TObject<{
            entity: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LEAD">, import("@sinclair/typebox").TLiteral<"DEAL">]>>;
        }>;
        readonly "crmSla.policies.query": import("@sinclair/typebox").TObject<{
            includeInactive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
