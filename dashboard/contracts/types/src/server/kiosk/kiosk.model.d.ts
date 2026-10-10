import Elysia from "elysia";
export declare const kioskModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "kiosk.verify": import("@sinclair/typebox").TObject<{
            pin: import("@sinclair/typebox").TString;
        }>;
        readonly "kiosk.set-pin": import("@sinclair/typebox").TObject<{
            pin: import("@sinclair/typebox").TString;
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
