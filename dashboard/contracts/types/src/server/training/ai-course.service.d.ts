import { type AiCoursePreview, type AiGenerateOptions } from "@/server/training/training.type";
export declare function generateClarifyingQuestions(brief: string): Promise<string[]>;
export declare function generateCourseStructure(brief: string, options?: AiGenerateOptions): Promise<AiCoursePreview>;
