import Elysia from "elysia";
export declare const quizAttemptsModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "quizAttempts.start": import("@sinclair/typebox").TObject<{
            assignmentId: import("@sinclair/typebox").TString;
        }>;
        readonly "quizAttempts.startByQuiz": import("@sinclair/typebox").TObject<{
            quizId: import("@sinclair/typebox").TString;
        }>;
        readonly "quizAttempts.submit": import("@sinclair/typebox").TObject<{
            answers: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                questionId: import("@sinclair/typebox").TString;
                selectedOptions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TInteger>>;
                answerText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>>;
        }>;
        readonly "quizAttempts.grade": import("@sinclair/typebox").TObject<{
            grades: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                questionId: import("@sinclair/typebox").TString;
                awardedPoints: import("@sinclair/typebox").TInteger;
            }>>;
        }>;
        readonly "quizAttempts.aiSuggest": import("@sinclair/typebox").TObject<{
            attemptId: import("@sinclair/typebox").TString;
            questionId: import("@sinclair/typebox").TString;
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
