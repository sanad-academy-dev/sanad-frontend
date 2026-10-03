import Elysia from "elysia";
/** [CRM-P3] مخططات حدود HTTP (NFR-3). */
export declare const crmEmailModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "crmEmail.template.create": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TString;
            subject: import("@sinclair/typebox").TString;
            body: import("@sinclair/typebox").TString;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmEmail.template.update": import("@sinclair/typebox").TObject<{
            name: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            subject: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            body: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            active: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "crmEmail.template.query": import("@sinclair/typebox").TObject<{
            includeInactive: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        /** القالب أو النصّ الحرّ — التحقّق من وجود أحدهما في الدورة، حيث الرسالة عربية. */
        readonly "crmEmail.send": import("@sinclair/typebox").TObject<{
            templateId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            subject: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            body: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            to: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
