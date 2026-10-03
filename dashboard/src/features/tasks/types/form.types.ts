import { z } from "zod";
import { TaskPriority, TaskStatus, TaskType } from "@/generated/prisma/enums";

export const getAddTaskSchema = (message: {
	titleRequired: string;
	typeRequired: string;
	statusRequired: string;
	priorityRequired: string;
	invalidDate: string;
}) =>
	z.object({
		title: z.string({ error: message.titleRequired }).min(1, message.titleRequired),
		content: z.string().optional(),
		type: z.enum(TaskType, { error: message.typeRequired }),
		status: z.enum(TaskStatus, { error: message.statusRequired }).default(TaskStatus.PENDING),
		priority: z.enum(TaskPriority, { error: message.priorityRequired }),
		assigneeIds: z.array(z.string()).default([]),
		deadline: z.coerce.date({ error: message.invalidDate }).optional(),
		images: z.array(z.instanceof(File)).default([]),
		emailNotification: z.boolean().default(false),
		createMultiple: z.boolean().default(false),
	});

export const addTaskSchema = getAddTaskSchema({
	titleRequired: "Task title is required",
	typeRequired: "Task type is required",
	statusRequired: "Task status is required",
	priorityRequired: "Task priority is required",
	invalidDate: "Invalid date",
});

export type AddTaskFormInput = z.input<typeof addTaskSchema>;
export type AddTaskFormValues = z.output<typeof addTaskSchema>;
