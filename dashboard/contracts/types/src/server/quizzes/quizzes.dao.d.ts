import type { QuizStatus } from "@/generated/prisma/enums";
import { type CreateQuizInput, type QuizListItemResponse, type QuizResponse, type QuizStatsResponse, type UpdateQuizInput } from "@/server/quizzes/quizzes.type";
export declare const quizzesDao: {
    stats(clinicId: string): Promise<QuizStatsResponse>;
    listByClinic(clinicId: string): Promise<QuizListItemResponse[]>;
    getById(id: string, clinicId: string): Promise<QuizResponse | "not-found">;
    create(data: CreateQuizInput): Promise<QuizResponse | "invalid-role">;
    update(id: string, clinicId: string, data: UpdateQuizInput): Promise<QuizResponse | "not-found" | "invalid-role">;
    remove(id: string, clinicId: string): Promise<"ok" | "not-found">;
    setStatus(id: string, clinicId: string, status: QuizStatus): Promise<QuizResponse | "not-found" | "not-ready">;
};
