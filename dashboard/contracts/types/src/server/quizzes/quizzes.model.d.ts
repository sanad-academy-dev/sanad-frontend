import Elysia from "elysia";
export declare const quizzesModel: Elysia<"", {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    typebox: {
        readonly "quizzes.aiGenerate": import("@sinclair/typebox").TObject<{
            brief: import("@sinclair/typebox").TString;
            options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
                questionCount: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                difficulty: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                language: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
                answerTypes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SINGLE">, import("@sinclair/typebox").TLiteral<"MULTIPLE">, import("@sinclair/typebox").TLiteral<"TEXT">]>>>;
                pointsPerQuestion: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                researchTopic: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            }>>;
        }>;
        readonly "quizzes.createQuiz": import("@sinclair/typebox").TObject<{
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            targetRoleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            coverKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            passMark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            timeLimitMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxAttempts: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            shuffleQuestions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            showAnswers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            gamificationPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            questions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                text: import("@sinclair/typebox").TString;
                answerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SINGLE">, import("@sinclair/typebox").TLiteral<"MULTIPLE">, import("@sinclair/typebox").TLiteral<"TEXT">]>>;
                points: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    text: import("@sinclair/typebox").TString;
                    correct: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                }>>>;
                answerText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>>>;
            title: import("@sinclair/typebox").TString;
        }>;
        readonly "quizzes.updateQuiz": import("@sinclair/typebox").TObject<{
            description: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            targetRoleId: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            coverKey: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TString]>>;
            passMark: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            timeLimitMinutes: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            maxAttempts: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TNull, import("@sinclair/typebox").TInteger]>>;
            shuffleQuestions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            showAnswers: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
            gamificationPoints: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
            questions: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                text: import("@sinclair/typebox").TString;
                answerType: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"SINGLE">, import("@sinclair/typebox").TLiteral<"MULTIPLE">, import("@sinclair/typebox").TLiteral<"TEXT">]>>;
                points: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
                options: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
                    text: import("@sinclair/typebox").TString;
                    correct: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
                }>>>;
                answerText: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            }>>>;
            title: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
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
