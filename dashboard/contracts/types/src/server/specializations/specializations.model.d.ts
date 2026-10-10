import Elysia from "elysia";
export declare const specializationsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "specializations.createCategory": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "specializations.createSubcategory": import("@sinclair/typebox").TObject<{
            categoryId: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "specializations.rename": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
        }>;
        readonly "specializations.toggle": import("@sinclair/typebox").TObject<{
            isActive: import("@sinclair/typebox").TBoolean;
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
