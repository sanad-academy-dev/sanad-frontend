import type { ReactNode } from "react";

export type TaskColumnId =
	| "queue"
	| "pending"
	| "not-yet-started"
	| "in-progress"
	| "completed"
	| "cancelled"
	| "duplicate";

export type TaskColumn = {
	id: TaskColumnId;
	name: string;
	count: number;
	icon: ReactNode;
};

export type TaskCardData = {
	id: string;
	name: string;
	column: TaskColumnId;
	code: string;
	title: string;
	type: string;
	priority: string;
	deadline: Date | null;
	deadlineLabel: string | null;
	assigneeName: string | null;
	assigneeInitials: string | null;
	subtasksTotal: number;
	subtasksCompleted: number;
	commentsCount: number;
};
