import Elysia from "elysia";
/** [CRM-P4] مخططات حدود HTTP (NFR-3). */
export declare const crmWhatsappModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "crmWhatsapp.credentials": import("@sinclair/typebox").TObject<{
            instanceId: import("@sinclair/typebox").TString;
            apiToken: import("@sinclair/typebox").TString;
        }>;
        readonly "crmWhatsapp.send": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
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
