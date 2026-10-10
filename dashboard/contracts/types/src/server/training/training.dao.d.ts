import type { AiCoursePreview, CompletionSettingsInput, CourseListItemResponse, CourseResponse, CourseStatsResponse, CreateCourseInput, CreateLessonInput, CreateLevelInput, CreateUnitInput, ReorderContentInput, UpdateCourseInput, UpdateLessonInput, UpdateUnitInput } from "@/server/training/training.type";
type DaoResult<T> = T | "not-found";
export declare const trainingDao: {
    listByClinic(clinicId: string): Promise<CourseListItemResponse[]>;
    stats(clinicId: string): Promise<CourseStatsResponse>;
    getById(id: string, clinicId: string): Promise<DaoResult<unknown>>;
    create(data: CreateCourseInput): Promise<CourseResponse | "invalid-role">;
    createFromAi(clinicId: string, preview: AiCoursePreview): Promise<{
        id: string;
    }>;
    update(id: string, clinicId: string, data: UpdateCourseInput): Promise<DaoResult<unknown> | "invalid-role" | "not-ready-content" | "not-ready-dates">;
    remove(id: string, clinicId: string): Promise<DaoResult<true>>;
    duplicateCourse(id: string, clinicId: string): Promise<DaoResult<unknown>>;
    createUnit(clinicId: string, { lessons, ...data }: CreateUnitInput): Promise<DaoResult<unknown>>;
    updateUnit(id: string, clinicId: string, data: UpdateUnitInput): Promise<DaoResult<unknown> | "invalid-level">;
    reorderContents(courseId: string, clinicId: string, items: ReorderContentInput[]): Promise<DaoResult<unknown>>;
    listLevels(courseId: string, clinicId: string): Promise<DaoResult<unknown>>;
    createLevel(clinicId: string, data: CreateLevelInput): Promise<DaoResult<unknown>>;
    updateLevel(id: string, clinicId: string, name: string): Promise<DaoResult<unknown>>;
    removeLevel(id: string, clinicId: string): Promise<DaoResult<true>>;
    getCompletionSettings(courseId: string, clinicId: string): Promise<DaoResult<unknown>>;
    upsertCompletionSettings(courseId: string, clinicId: string, data: CompletionSettingsInput): Promise<DaoResult<unknown>>;
    duplicateUnit(id: string, clinicId: string): Promise<DaoResult<unknown>>;
    removeUnit(id: string, clinicId: string): Promise<DaoResult<true>>;
    createLesson(clinicId: string, data: CreateLessonInput): Promise<DaoResult<unknown>>;
    updateLesson(id: string, clinicId: string, data: UpdateLessonInput): Promise<DaoResult<unknown>>;
    removeLesson(id: string, clinicId: string): Promise<DaoResult<true>>;
    setTrainers(courseId: string, clinicId: string, staffIds: string[]): Promise<DaoResult<{
        count: number;
    }>>;
    submitReview(courseId: string, clinicId: string, staffId: string, data: {
        rating: number;
        comment?: string | null;
    }): Promise<"not-found" | "review-disabled" | "not-assigned" | {
        id: string;
    }>;
    staffIdForUser(userId: string, clinicId: string): Promise<string | null>;
};
export {};
