import { type AiQuizOptions, type AiQuizPreview } from "@/server/quizzes/quizzes.type";
export declare function generateQuiz(brief: string, options?: AiQuizOptions): Promise<AiQuizPreview>;
