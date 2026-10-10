import Elysia from "elysia";
export declare const inboxModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "inbox.query": import("@sinclair/typebox").TObject<{
            kind: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"NOTIFICATION">, import("@sinclair/typebox").TLiteral<"APPROVAL">]>>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MEMBERSHIP">, import("@sinclair/typebox").TLiteral<"INSURANCE">, import("@sinclair/typebox").TLiteral<"LEAD">, import("@sinclair/typebox").TLiteral<"DEAL">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_CANCELLED">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_NEW">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_PENDING">, import("@sinclair/typebox").TLiteral<"APPOINTMENT_CONFIRMED">, import("@sinclair/typebox").TLiteral<"INVOICE">, import("@sinclair/typebox").TLiteral<"TASK">, import("@sinclair/typebox").TLiteral<"SYSTEM">, import("@sinclair/typebox").TLiteral<"LAB">, import("@sinclair/typebox").TLiteral<"RADIOLOGY">, import("@sinclair/typebox").TLiteral<"CARE">, import("@sinclair/typebox").TLiteral<"STOCK">, import("@sinclair/typebox").TLiteral<"MENTION">, import("@sinclair/typebox").TLiteral<"OPERATION">, import("@sinclair/typebox").TLiteral<"VACCINATION">, import("@sinclair/typebox").TLiteral<"GROOMING">, import("@sinclair/typebox").TLiteral<"INPATIENT">, import("@sinclair/typebox").TLiteral<"TRIAGE">]>>;
            sort: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"newest">, import("@sinclair/typebox").TLiteral<"oldest">, import("@sinclair/typebox").TLiteral<"importance">]>>;
            showRead: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            showUnread: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "inbox.comment.create": import("@sinclair/typebox").TObject<{
            comment: import("@sinclair/typebox").TString;
        }>;
        readonly "inbox.approval.action": import("@sinclair/typebox").TObject<{
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "inbox.delete.query": import("@sinclair/typebox").TObject<{
            scope: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"read">, import("@sinclair/typebox").TLiteral<"completed">]>>;
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
