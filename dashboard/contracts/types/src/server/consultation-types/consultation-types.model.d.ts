import Elysia from "elysia";
export declare const consultationTypesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "consultation-types.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
        }>;
        readonly "consultation-types.setActive": import("@sinclair/typebox").TObject<{
            active: import("@sinclair/typebox").TBoolean;
        }>;
        readonly "consultation-types.updateConfig": import("@sinclair/typebox").TObject<{
            price: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TNumber]>>;
            examTemplateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
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
