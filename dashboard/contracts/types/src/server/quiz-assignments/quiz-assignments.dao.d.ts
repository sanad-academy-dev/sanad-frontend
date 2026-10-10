import { type CreateQuizAssignmentInput } from "@/server/quiz-assignments/quiz-assignments.type";
type DaoResult<T> = T | "not-found";
export declare const quizAssignmentsDao: {
    listByQuiz(quizId: string, clinicId: string): Promise<DaoResult<unknown>>;
    listEligible(quizId: string, clinicId: string, branchId?: string): Promise<DaoResult<unknown>>;
    assign(clinicId: string, quizId: string, staffIds: string[], source: CreateQuizAssignmentInput["source"], window?: {
        startDate: Date | null;
        dueDate: Date | null;
    }): Promise<DaoResult<unknown> | "invalid-staff">;
    enrollAll(clinicId: string, quizId: string): Promise<DaoResult<unknown> | "invalid-staff">;
    enrollByRole(clinicId: string, quizId: string, roleId: string): Promise<DaoResult<unknown> | "invalid-staff">;
    unassign(id: string, clinicId: string): Promise<DaoResult<true>>;
};
export {};
