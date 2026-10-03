import Elysia from "elysia";
export declare const chatModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "chat.createConversation": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DIRECT">, import("@sinclair/typebox").TLiteral<"GROUP">]>;
            memberIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            body: import("@sinclair/typebox").TString;
        }>;
        readonly "chat.sendMessage": import("@sinclair/typebox").TObject<{
            body: import("@sinclair/typebox").TString;
        }>;
        readonly "chat.sendAttachment": import("@sinclair/typebox").TObject<{
            file: import("@sinclair/typebox").TUnsafe<File>;
            body: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "chat.updateMember": import("@sinclair/typebox").TObject<{
            pinned: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            muted: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "chat.addMembers": import("@sinclair/typebox").TObject<{
            memberIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
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
