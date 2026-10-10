import Elysia from "elysia";
export declare const staffConsultationTypesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "staff-consultation-types.add": import("@sinclair/typebox").TObject<{
            consultationTypeId: import("@sinclair/typebox").TString;
        }>;
        readonly "staff-consultation-types.update": import("@sinclair/typebox").TObject<{
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
