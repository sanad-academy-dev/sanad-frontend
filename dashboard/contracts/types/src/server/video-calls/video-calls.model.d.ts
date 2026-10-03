import Elysia from "elysia";
export declare const videoCallsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "video-calls.token": import("@sinclair/typebox").TObject<{
            room: import("@sinclair/typebox").TString;
        }>;
        readonly "video-calls.guest-token": import("@sinclair/typebox").TObject<{
            room: import("@sinclair/typebox").TString;
            name: import("@sinclair/typebox").TString;
        }>;
        readonly "video-calls.participant": import("@sinclair/typebox").TObject<{
            room: import("@sinclair/typebox").TString;
            identity: import("@sinclair/typebox").TString;
        }>;
        readonly "video-calls.room-query": import("@sinclair/typebox").TObject<{
            room: import("@sinclair/typebox").TString;
        }>;
        readonly "video-calls.questionnaire.save": import("@sinclair/typebox").TObject<{
            room: import("@sinclair/typebox").TString;
            answers: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TBoolean>;
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
