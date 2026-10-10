import Elysia from "elysia";
export declare const courseAssignmentsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "courseAssignments.assign": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
            staffIds: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            source: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"MANUAL">, import("@sinclair/typebox").TLiteral<"AUTO">, import("@sinclair/typebox").TLiteral<"ENROLL_ALL">]>>;
        }>;
        readonly "courseAssignments.enrollAll": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
        }>;
        readonly "courseAssignments.enrollByRole": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
            roleId: import("@sinclair/typebox").TString;
        }>;
        readonly "courseAssignments.assignTime": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
            startDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            dueDate: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            timezone: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
        }>;
        readonly "courseAssignments.progress": import("@sinclair/typebox").TObject<{
            progress: import("@sinclair/typebox").TInteger;
        }>;
        readonly "courseAssignments.lessonProgress": import("@sinclair/typebox").TObject<{
            lessonId: import("@sinclair/typebox").TString;
        }>;
        readonly "courseAssignments.saveRules": import("@sinclair/typebox").TObject<{
            courseId: import("@sinclair/typebox").TString;
            rules: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                entityType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"BRANCH">, import("@sinclair/typebox").TLiteral<"ROLE">, import("@sinclair/typebox").TLiteral<"SPECIALIZATION">]>;
                entityId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            }>>;
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
