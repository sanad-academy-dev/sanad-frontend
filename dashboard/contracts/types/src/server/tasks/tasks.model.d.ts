import Elysia from "elysia";
export declare const tasksModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "tasks.query": import("@sinclair/typebox").TObject<{
            view: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"all">, import("@sinclair/typebox").TLiteral<"for-me">, import("@sinclair/typebox").TLiteral<"done">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"NOT_YET_STARTED">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">, import("@sinclair/typebox").TLiteral<"DUPLICATE">, import("@sinclair/typebox").TLiteral<"QUEUE">]>>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADMINISTRATIVE">, import("@sinclair/typebox").TLiteral<"PHARMACEUTICALS">, import("@sinclair/typebox").TLiteral<"INVENTORY">, import("@sinclair/typebox").TLiteral<"FINANCE">, import("@sinclair/typebox").TLiteral<"LABORATORY">, import("@sinclair/typebox").TLiteral<"COSMETICS">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>>;
            assigneeId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        }>;
        readonly "tasks.dashboardQuery": import("@sinclair/typebox").TObject<{
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"NOT_YET_STARTED">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">, import("@sinclair/typebox").TLiteral<"DUPLICATE">, import("@sinclair/typebox").TLiteral<"QUEUE">]>>;
            limit: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        }>;
        readonly "tasks.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
            content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            type: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADMINISTRATIVE">, import("@sinclair/typebox").TLiteral<"PHARMACEUTICALS">, import("@sinclair/typebox").TLiteral<"INVENTORY">, import("@sinclair/typebox").TLiteral<"FINANCE">, import("@sinclair/typebox").TLiteral<"LABORATORY">, import("@sinclair/typebox").TLiteral<"COSMETICS">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"NOT_YET_STARTED">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">, import("@sinclair/typebox").TLiteral<"DUPLICATE">, import("@sinclair/typebox").TLiteral<"QUEUE">]>>;
            priority: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>;
            assigneeIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            deadline: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            images: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "tasks.update": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            content: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ADMINISTRATIVE">, import("@sinclair/typebox").TLiteral<"PHARMACEUTICALS">, import("@sinclair/typebox").TLiteral<"INVENTORY">, import("@sinclair/typebox").TLiteral<"FINANCE">, import("@sinclair/typebox").TLiteral<"LABORATORY">, import("@sinclair/typebox").TLiteral<"COSMETICS">, import("@sinclair/typebox").TLiteral<"MEDICAL">]>>;
            status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"PENDING">, import("@sinclair/typebox").TLiteral<"NOT_YET_STARTED">, import("@sinclair/typebox").TLiteral<"IN_PROGRESS">, import("@sinclair/typebox").TLiteral<"COMPLETED">, import("@sinclair/typebox").TLiteral<"CANCELLED">, import("@sinclair/typebox").TLiteral<"DUPLICATE">, import("@sinclair/typebox").TLiteral<"QUEUE">]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>>;
            assigneeIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            deadline: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            images: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "tasks.subtask.create": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TString;
        }>;
        readonly "tasks.subtask.update": import("@sinclair/typebox").TObject<{
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            isCompleted: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
        }>;
        readonly "tasks.comment.create": import("@sinclair/typebox").TObject<{
            content: import("@sinclair/typebox").TString;
            mentionedStaffIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        }>;
        readonly "tasks.accept": import("@sinclair/typebox").TObject<{
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            deadline: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            priority: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"LOW">, import("@sinclair/typebox").TLiteral<"MEDIUM">, import("@sinclair/typebox").TLiteral<"HIGH">, import("@sinclair/typebox").TLiteral<"URGENT">]>>;
        }>;
        readonly "tasks.decline": import("@sinclair/typebox").TObject<{
            comment: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            assigneeIds: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
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
