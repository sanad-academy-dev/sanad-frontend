import { z } from "zod";
import type { QuizAnswerType, QuizGradingStatus } from "@/generated/prisma/enums";
export { QuizAnswerType, QuizGradingStatus } from "@/generated/prisma/enums";
export declare const submitAttemptSchema: z.ZodObject<{
    answers: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        selectedOptions: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        answerText: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type SubmitAttemptFormInput = z.infer<typeof submitAttemptSchema>;
export type StoredOption = {
    text: string;
    correct: boolean;
};
export declare function parseOptions(json: unknown): StoredOption[];
export type PlayerQuestion = {
    id: string;
    text: string;
    answerType: QuizAnswerType;
    points: number;
    options: {
        text: string;
    }[];
};
export type PlayerAttemptResponse = {
    attempt: {
        id: string;
        attemptNo: number;
        startedAt: Date | string;
    };
    quiz: {
        id: string;
        title: string;
        passMark: number;
        timeLimitMinutes: number | null;
        showAnswers: boolean;
    };
    questions: PlayerQuestion[];
};
export type ReviewQuestion = {
    id: string;
    text: string;
    answerType: QuizAnswerType;
    points: number;
    options: {
        text: string;
        correct?: boolean;
    }[];
    myAnswer: {
        selectedOptions: number[];
        answerText: string | null;
    };
    isCorrect: boolean | null;
    awardedPoints: number | null;
    pending: boolean;
};
export type AttemptResultResponse = {
    attempt: {
        id: string;
        attemptNo: number;
        startedAt: Date | string;
        submittedAt: Date | string | null;
        scorePercent: number | null;
        passed: boolean | null;
        gradingStatus: QuizGradingStatus;
    };
    quiz: {
        id: string;
        title: string;
        passMark: number;
        showAnswers: boolean;
        maxAttempts: number | null;
    };
    attemptsUsed: number;
    review: ReviewQuestion[];
};
export type AttemptListItemResponse = {
    id: string;
    attemptNo: number;
    submittedAt: Date | string | null;
    scorePercent: number | null;
    passed: boolean | null;
    gradingStatus: QuizGradingStatus;
};
export declare const gradeAttemptSchema: z.ZodObject<{
    grades: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        awardedPoints: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type GradeAttemptFormInput = z.infer<typeof gradeAttemptSchema>;
export type GradingTextAnswer = {
    questionId: string;
    text: string;
    points: number;
    modelAnswer: string | null;
    staffAnswer: string | null;
    awardedPoints: number | null;
};
export type GradingResponse = {
    attempt: {
        id: string;
        attemptNo: number;
        scorePercent: number | null;
        passed: boolean | null;
        gradingStatus: QuizGradingStatus;
    };
    quiz: {
        id: string;
        title: string;
        passMark: number;
    };
    staffName: string;
    aiAvailable: boolean;
    textAnswers: GradingTextAnswer[];
};
export type AiSuggestResponse = {
    questionId: string;
    suggestedPoints: number;
    rationale: string;
};
export type QuizRosterRowResponse = {
    assignmentId: string;
    staff: {
        id: string;
        name: string;
        code: string;
        avatar: string | null;
    };
    status: string;
    attemptsUsed: number;
    bestScore: number | null;
    passed: boolean | null;
    gradingStatus: QuizGradingStatus | null;
    pendingAttemptId: string | null;
    bestAttemptId: string | null;
};
