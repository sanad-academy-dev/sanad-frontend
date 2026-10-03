import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { QuizAnswerType } from "@/generated/prisma/enums";
export { AssignmentSource, AssignmentStatus, QuizAnswerType, QuizGradingStatus, QuizStatus, } from "@/generated/prisma/enums";
export declare const quizOptionSchema: z.ZodObject<{
    text: z.ZodString;
    correct: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const quizQuestionSchema: z.ZodObject<{
    text: z.ZodString;
    answerType: z.ZodOptional<z.ZodEnum<{
        readonly SINGLE: "SINGLE";
        readonly MULTIPLE: "MULTIPLE";
        readonly TEXT: "TEXT";
    }>>;
    points: z.ZodOptional<z.ZodNumber>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        correct: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    answerText: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type QuizQuestionFormInput = z.infer<typeof quizQuestionSchema>;
export declare const createQuizSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    targetRoleId: z.ZodOptional<z.ZodString>;
    coverKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    passMark: z.ZodOptional<z.ZodNumber>;
    timeLimitMinutes: z.ZodOptional<z.ZodNumber>;
    maxAttempts: z.ZodOptional<z.ZodNumber>;
    shuffleQuestions: z.ZodOptional<z.ZodBoolean>;
    showAnswers: z.ZodOptional<z.ZodBoolean>;
    gamificationPoints: z.ZodOptional<z.ZodNumber>;
    questions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        answerType: z.ZodOptional<z.ZodEnum<{
            readonly SINGLE: "SINGLE";
            readonly MULTIPLE: "MULTIPLE";
            readonly TEXT: "TEXT";
        }>>;
        points: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            correct: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        answerText: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type CreateQuizFormInput = z.infer<typeof createQuizSchema>;
export declare const updateQuizSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    targetRoleId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    coverKey: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    passMark: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    timeLimitMinutes: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    maxAttempts: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    shuffleQuestions: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    showAnswers: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    gamificationPoints: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    questions: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        answerType: z.ZodOptional<z.ZodEnum<{
            readonly SINGLE: "SINGLE";
            readonly MULTIPLE: "MULTIPLE";
            readonly TEXT: "TEXT";
        }>>;
        points: z.ZodOptional<z.ZodNumber>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            correct: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>>;
        answerText: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export type UpdateQuizFormInput = z.infer<typeof updateQuizSchema>;
export type QuizQuestionInput = Pick<Prisma.QuizQuestionUncheckedCreateInput, "text"> & {
    answerType?: QuizAnswerType;
    points?: number;
    answerText?: string | null;
    options?: {
        text: string;
        correct?: boolean;
    }[];
};
export type CreateQuizInput = Pick<Prisma.QuizUncheckedCreateInput, "clinicId" | "title"> & Partial<Pick<Prisma.QuizUncheckedCreateInput, "description" | "targetRoleId" | "coverKey" | "passMark" | "timeLimitMinutes" | "maxAttempts" | "shuffleQuestions" | "showAnswers" | "gamificationPoints">> & {
    questions?: QuizQuestionInput[];
};
export type UpdateQuizInput = Partial<Omit<CreateQuizInput, "clinicId">>;
declare const quizQuestionSelect: {
    readonly id: true;
    readonly order: true;
    readonly text: true;
    readonly answerType: true;
    readonly points: true;
    readonly options: true;
    readonly answerText: true;
};
declare const quizSelect: {
    readonly id: true;
    readonly code: true;
    readonly title: true;
    readonly description: true;
    readonly status: true;
    readonly targetRoleId: true;
    readonly coverKey: true;
    readonly passMark: true;
    readonly timeLimitMinutes: true;
    readonly maxAttempts: true;
    readonly shuffleQuestions: true;
    readonly showAnswers: true;
    readonly gamificationPoints: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly targetRole: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly questions: {
        readonly select: {
            readonly id: true;
            readonly order: true;
            readonly text: true;
            readonly answerType: true;
            readonly points: true;
            readonly options: true;
            readonly answerText: true;
        };
        readonly orderBy: {
            readonly order: "asc";
        };
    };
};
declare const quizListSelect: {
    readonly id: true;
    readonly code: true;
    readonly title: true;
    readonly coverKey: true;
    readonly status: true;
    readonly passMark: true;
    readonly timeLimitMinutes: true;
    readonly maxAttempts: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly targetRole: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly _count: {
        readonly select: {
            readonly questions: true;
            readonly assignments: true;
        };
    };
};
export declare const quizSelects: {
    readonly quizSelect: {
        readonly id: true;
        readonly code: true;
        readonly title: true;
        readonly description: true;
        readonly status: true;
        readonly targetRoleId: true;
        readonly coverKey: true;
        readonly passMark: true;
        readonly timeLimitMinutes: true;
        readonly maxAttempts: true;
        readonly shuffleQuestions: true;
        readonly showAnswers: true;
        readonly gamificationPoints: true;
        readonly editsCount: true;
        readonly createdAt: true;
        readonly updatedAt: true;
        readonly targetRole: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
        readonly questions: {
            readonly select: {
                readonly id: true;
                readonly order: true;
                readonly text: true;
                readonly answerType: true;
                readonly points: true;
                readonly options: true;
                readonly answerText: true;
            };
            readonly orderBy: {
                readonly order: "asc";
            };
        };
    };
    readonly quizQuestionSelect: {
        readonly id: true;
        readonly order: true;
        readonly text: true;
        readonly answerType: true;
        readonly points: true;
        readonly options: true;
        readonly answerText: true;
    };
    readonly quizListSelect: {
        readonly id: true;
        readonly code: true;
        readonly title: true;
        readonly coverKey: true;
        readonly status: true;
        readonly passMark: true;
        readonly timeLimitMinutes: true;
        readonly maxAttempts: true;
        readonly editsCount: true;
        readonly createdAt: true;
        readonly updatedAt: true;
        readonly targetRole: {
            readonly select: {
                readonly id: true;
                readonly name: true;
            };
        };
        readonly _count: {
            readonly select: {
                readonly questions: true;
                readonly assignments: true;
            };
        };
    };
};
export type QuizQuestionResponse = Prisma.QuizQuestionGetPayload<{
    select: typeof quizQuestionSelect;
}>;
export type QuizResponse = Prisma.QuizGetPayload<{
    select: typeof quizSelect;
}>;
export type QuizListItemResponse = Prisma.QuizGetPayload<{
    select: typeof quizListSelect;
}>;
export type QuizStatsResponse = {
    total: number;
    published: number;
    draft: number;
};
export declare const aiQuizOptionsSchema: z.ZodObject<{
    questionCount: z.ZodOptional<z.ZodNumber>;
    difficulty: z.ZodOptional<z.ZodEnum<{
        INTERMEDIATE: "INTERMEDIATE";
        BEGINNER: "BEGINNER";
        ADVANCED: "ADVANCED";
    }>>;
    language: z.ZodOptional<z.ZodEnum<{
        AR: "AR";
        EN: "EN";
    }>>;
    answerTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        readonly SINGLE: "SINGLE";
        readonly MULTIPLE: "MULTIPLE";
        readonly TEXT: "TEXT";
    }>>>;
    pointsPerQuestion: z.ZodOptional<z.ZodNumber>;
    researchTopic: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type AiQuizOptions = z.infer<typeof aiQuizOptionsSchema>;
export declare const aiQuizQuestionSchema: z.ZodObject<{
    text: z.ZodCatch<z.ZodString>;
    answerType: z.ZodCatch<z.ZodEnum<{
        readonly SINGLE: "SINGLE";
        readonly MULTIPLE: "MULTIPLE";
        readonly TEXT: "TEXT";
    }>>;
    points: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
    options: z.ZodCatch<z.ZodArray<z.ZodObject<{
        text: z.ZodCatch<z.ZodString>;
        correct: z.ZodCatch<z.ZodBoolean>;
    }, z.core.$strip>>>;
    answerText: z.ZodCatch<z.ZodString>;
    explanation: z.ZodCatch<z.ZodString>;
}, z.core.$strip>;
export type AiQuizQuestion = z.infer<typeof aiQuizQuestionSchema>;
export declare const aiQuizSchema: z.ZodObject<{
    title: z.ZodCatch<z.ZodString>;
    description: z.ZodCatch<z.ZodString>;
    questions: z.ZodCatch<z.ZodArray<z.ZodObject<{
        text: z.ZodCatch<z.ZodString>;
        answerType: z.ZodCatch<z.ZodEnum<{
            readonly SINGLE: "SINGLE";
            readonly MULTIPLE: "MULTIPLE";
            readonly TEXT: "TEXT";
        }>>;
        points: z.ZodCatch<z.ZodCoercedNumber<unknown>>;
        options: z.ZodCatch<z.ZodArray<z.ZodObject<{
            text: z.ZodCatch<z.ZodString>;
            correct: z.ZodCatch<z.ZodBoolean>;
        }, z.core.$strip>>>;
        answerText: z.ZodCatch<z.ZodString>;
        explanation: z.ZodCatch<z.ZodString>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type AiQuizPreview = z.infer<typeof aiQuizSchema>;
