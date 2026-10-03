import Elysia from "elysia";
export declare const animalTypesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "animal-types.create": import("@sinclair/typebox").TObject<{
            arName: import("@sinclair/typebox").TString;
            enName: import("@sinclair/typebox").TString;
        }>;
        readonly "animal-types.update": import("@sinclair/typebox").TObject<{
            arName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            enName: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
