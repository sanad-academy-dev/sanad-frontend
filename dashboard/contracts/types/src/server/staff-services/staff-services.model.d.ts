import Elysia from "elysia";
export declare const staffServicesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "staff-services.add": import("@sinclair/typebox").TObject<{
            serviceId: import("@sinclair/typebox").TString;
        }>;
        readonly "staff-services.update": import("@sinclair/typebox").TObject<{
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
