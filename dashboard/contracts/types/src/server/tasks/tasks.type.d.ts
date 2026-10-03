import { z } from "zod";
import type { Prisma, SubTask, Task } from "@/generated/prisma/client";
export type TaskWriteFields = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type SubTaskWriteFields = Omit<SubTask, "id" | "createdAt">;
export type CreateTaskInput = Pick<TaskWriteFields, "clinicId" | "title" | "type" | "priority"> & Partial<Pick<TaskWriteFields, "content" | "status" | "createdById" | "deadline" | "images">> & {
    assigneeIds?: string[];
};
export type UpdateTaskInput = Partial<Omit<TaskWriteFields, "clinicId">> & {
    assigneeIds?: string[];
};
export type TaskView = "all" | "for-me" | "done";
export type TaskFilters = Partial<Pick<TaskWriteFields, "status" | "type" | "priority">> & {
    view?: TaskView;
    assigneeId?: string;
};
export type DashboardTaskFilters = {
    status?: TaskWriteFields["status"];
};
export type CreateSubTaskInput = Pick<Prisma.SubTaskUncheckedCreateInput, "taskId" | "title">;
export type UpdateSubTaskInput = Partial<Pick<SubTaskWriteFields, "title" | "isCompleted">>;
export type TaskStats = {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
};
export type TaskWithAssignees = Prisma.TaskGetPayload<{
    include: {
        assignees: {
            select: {
                id: true;
                name: true;
                image: true;
            };
        };
    };
}>;
export type KanbanTaskResponse = Prisma.TaskGetPayload<{
    select: {
        id: true;
        code: true;
        title: true;
        type: true;
        status: true;
        priority: true;
        deadline: true;
        assignees: {
            select: {
                id: true;
                name: true;
                image: true;
            };
        };
        subtasks: {
            select: {
                isCompleted: true;
            };
        };
        _count: {
            select: {
                activity: {
                    where: {
                        type: "COMMENT";
                    };
                };
            };
        };
    };
}>;
declare const taskActivitySelect: {
    id: true;
    taskId: true;
    type: true;
    body: true;
    metadata: true;
    createdAt: true;
    author: {
        select: {
            id: true;
            name: true;
        };
    };
    mentions: {
        select: {
            staff: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
export type TaskActivityResponse = Prisma.TaskActivityGetPayload<{
    select: typeof taskActivitySelect;
}>;
export { taskActivitySelect };
export type TaskSheetResponse = Prisma.TaskGetPayload<{
    select: {
        id: true;
        code: true;
        title: true;
        content: true;
        status: true;
        priority: true;
        type: true;
        deadline: true;
        createdAt: true;
        assignees: {
            select: {
                id: true;
                name: true;
                image: true;
                phone: true;
            };
        };
        subtasks: {
            select: {
                id: true;
                title: true;
                isCompleted: true;
            };
        };
    };
}>;
export declare const acceptTaskSchema: z.ZodObject<{
    comment: z.ZodOptional<z.ZodString>;
    deadline: z.ZodOptional<z.ZodDate>;
    priority: z.ZodOptional<z.ZodEnum<{
        readonly LOW: "LOW";
        readonly MEDIUM: "MEDIUM";
        readonly HIGH: "HIGH";
        readonly URGENT: "URGENT";
    }>>;
}, z.core.$strip>;
export type AcceptTaskFormInput = z.infer<typeof acceptTaskSchema>;
export declare const declineTaskSchema: z.ZodObject<{
    comment: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
    assigneeIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type DeclineTaskFormInput = z.infer<typeof declineTaskSchema>;
export type AcceptTaskInput = {
    comment?: string;
    deadline?: Date;
    priority?: Task["priority"];
};
export type DeclineTaskInput = {
    comment?: string;
    reason?: string;
    assigneeIds?: string[];
};
export type DashboardTaskResponse = Prisma.TaskGetPayload<{
    select: {
        id: true;
        title: true;
        status: true;
        deadline: true;
        assignees: {
            select: {
                id: true;
                name: true;
            };
        };
    };
}>;
