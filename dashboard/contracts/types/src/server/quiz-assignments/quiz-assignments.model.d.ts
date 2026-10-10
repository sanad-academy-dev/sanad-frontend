import Elysia from "elysia";
export declare const quizAssignmentsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "quizAssignments.assign": import("@sinclair/typebox").TObject<{
            quizId: import("@sinclair/typebox").TString;
            staffIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MANUAL">, import("@sinclair/typebox").TLiteral<"AUTO">, import("@sinclair/typebox").TLiteral<"ENROLL_ALL">]>>;
            startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "quizAssignments.enrollAll": import("@sinclair/typebox").TObject<{
            quizId: import("@sinclair/typebox").TString;
        }>;
        readonly "quizAssignments.enrollByRole": import("@sinclair/typebox").TObject<{
            quizId: import("@sinclair/typebox").TString;
            roleId: import("@sinclair/typebox").TString;
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
