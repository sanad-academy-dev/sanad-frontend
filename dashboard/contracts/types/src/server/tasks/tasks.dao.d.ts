import type { AcceptTaskInput, CreateSubTaskInput, CreateTaskInput, DashboardTaskFilters, DeclineTaskInput, TaskActivityResponse, TaskFilters, TaskSheetResponse, TaskStats, UpdateSubTaskInput, UpdateTaskInput } from "@/server/tasks/tasks.type";
export declare const tasksDao: {
    create(data: CreateTaskInput): Promise<{
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    }>;
    findById(id: string, clinicId: string): Promise<({
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    }) | null>;
    findByIdForSheet(id: string, clinicId: string): Promise<TaskSheetResponse | null>;
    list(clinicId: string, filters?: TaskFilters): Promise<({
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    })[]>;
    listForKanban(clinicId: string, userId: string, filters?: TaskFilters): Promise<{
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        _count: {
            activity: number;
        };
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        deadline: Date | null;
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
        subtasks: {
            isCompleted: boolean;
        }[];
    }[]>;
    listForDashboard(clinicId: string, filters?: DashboardTaskFilters): Promise<{
        id: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        deadline: Date | null;
        assignees: {
            name: string;
            id: string;
        }[];
    }[]>;
    stats(clinicId: string, userId: string): Promise<TaskStats>;
    update(id: string, clinicId: string, data: UpdateTaskInput, authorUserId?: string): Promise<({
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    }) | null>;
    accept(id: string, clinicId: string, data: AcceptTaskInput, authorUserId: string): Promise<({
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    }) | null>;
    decline(id: string, clinicId: string, data: DeclineTaskInput, authorUserId: string): Promise<({
        assignees: {
            name: string;
            id: string;
            image: string | null;
        }[];
    } & {
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    }) | null>;
    delete(id: string, clinicId: string): Promise<{
        type: import("@/generated/prisma/client").TaskType;
        priority: import("@/generated/prisma/client").TaskPriority;
        id: string;
        clinicId: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string;
        title: string;
        status: import("@/generated/prisma/client").TaskStatus;
        content: string | null;
        images: string[];
        deadline: Date | null;
        declinedAt: Date | null;
        declineReason: string | null;
    } | null>;
    createSubTask(data: CreateSubTaskInput): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        taskId: string;
        isCompleted: boolean;
    }>;
    updateSubTask(subtaskId: string, taskId: string, data: UpdateSubTaskInput): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        taskId: string;
        isCompleted: boolean;
    } | null>;
    deleteSubTask(subtaskId: string, taskId: string): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        taskId: string;
        isCompleted: boolean;
    } | null>;
    listActivity(taskId: string, clinicId: string): Promise<TaskActivityResponse[] | null>;
    addComment(taskId: string, clinicId: string, authorUserId: string, content: string, mentionedStaffIds?: string[]): Promise<TaskActivityResponse | "COMMENTS_DISABLED">;
};
