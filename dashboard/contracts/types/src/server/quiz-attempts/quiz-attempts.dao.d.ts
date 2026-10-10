import { type AiSuggestResponse, type AttemptListItemResponse, type AttemptResultResponse, type GradeAttemptFormInput, type GradingResponse, type PlayerAttemptResponse, type QuizRosterRowResponse, type SubmitAttemptFormInput } from "@/server/quiz-attempts/quiz-attempts.type";
type Guard = "not-found" | "forbidden" | "not-published" | "no-attempts-left" | "already-submitted" | "time-exceeded" | "invalid-question" | "not-assigned";
export declare const quizAttemptsDao: {
    start(assignmentId: string, clinicId: string, userId: string): Promise<PlayerAttemptResponse | Guard>;
    startByQuiz(quizId: string, clinicId: string, userId: string): Promise<PlayerAttemptResponse | Guard>;
    myLatestResult(quizId: string, clinicId: string, userId: string): Promise<AttemptResultResponse | "not-found">;
    play(attemptId: string, clinicId: string, userId: string): Promise<PlayerAttemptResponse | Guard>;
    submit(attemptId: string, clinicId: string, userId: string, body: SubmitAttemptFormInput): Promise<AttemptResultResponse | Guard>;
    getResult(attemptId: string, clinicId: string): Promise<AttemptResultResponse | "not-found">;
    listByAssignment(assignmentId: string, clinicId: string): Promise<AttemptListItemResponse[] | "not-found">;
    getGrading(attemptId: string, clinicId: string): Promise<GradingResponse | "not-found">;
    grade(attemptId: string, clinicId: string, body: GradeAttemptFormInput): Promise<GradingResponse | "not-found" | "invalid-question">;
    aiSuggest(attemptId: string, questionId: string, clinicId: string): Promise<AiSuggestResponse | "not-found" | "invalid-question" | "ai-unavailable">;
    managerRoster(quizId: string, clinicId: string): Promise<QuizRosterRowResponse[] | "not-found">;
};
export {};
