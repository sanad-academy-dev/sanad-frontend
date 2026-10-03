import { type AutoAssignRuleFormInput, type CreateAssignmentInput } from "@/server/course-assignments/course-assignments.type";
type DaoResult<T> = T | "not-found";
export declare const courseAssignmentsDao: {
    listByCourse(courseId: string, clinicId: string): Promise<DaoResult<unknown>>;
    listEligible(courseId: string, clinicId: string, branchId?: string): Promise<DaoResult<unknown>>;
    assign(clinicId: string, courseId: string, staffIds: string[], source: CreateAssignmentInput["source"]): Promise<DaoResult<unknown> | "invalid-staff">;
    enrollAll(clinicId: string, courseId: string): Promise<DaoResult<unknown>>;
    enrollByRole(clinicId: string, courseId: string, roleId: string): Promise<DaoResult<unknown>>;
    unassign(id: string, clinicId: string): Promise<DaoResult<true>>;
    setAssignTime(courseId: string, clinicId: string, data: {
        startDate?: Date | null;
        dueDate?: Date | null;
        timezone?: string | null;
    }): Promise<DaoResult<unknown>>;
    startAssignment(id: string, clinicId: string): Promise<DaoResult<unknown>>;
    setProgress(id: string, clinicId: string, progress: number): Promise<DaoResult<unknown> | "completed-locked">;
    markLessonProgress(id: string, clinicId: string, lessonId: string): Promise<DaoResult<unknown> | "completed-locked" | "lesson-not-found">;
    getLessonProgress(id: string, clinicId: string): Promise<DaoResult<{
        lessonId: string;
    }[]>>;
    issueCertificateIfEnabled(assignmentId: string): Promise<void>;
    listRules(courseId: string, clinicId: string): Promise<DaoResult<unknown>>;
    saveRules(courseId: string, clinicId: string, rules: AutoAssignRuleFormInput[]): Promise<DaoResult<unknown> | "invalid-entity">;
    applyForStaff(staffId: string): Promise<number>;
    applyDueReEnrollments(clinicId: string): Promise<void>;
};
export {};
