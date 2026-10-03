import {
	IconCircle,
	IconCircleCheck,
	IconCircleX,
	IconClockHour4,
	IconCopy,
	IconInbox,
	IconPlayerPlay,
} from "@tabler/icons-react";
import type { TFunction } from "i18next";

import type { TaskColumn, TaskColumnId } from "@/features/tasks/types/task.types";
import type { TaskPriority, TaskStatus, TaskType } from "@/generated/prisma/enums";

export const STATUS_TO_COLUMN: Record<TaskStatus, TaskColumnId> = {
	QUEUE: "queue",
	PENDING: "pending",
	NOT_YET_STARTED: "not-yet-started",
	IN_PROGRESS: "in-progress",
	COMPLETED: "completed",
	CANCELLED: "cancelled",
	DUPLICATE: "duplicate",
};

export const COLUMN_TO_STATUS: Record<TaskColumnId, TaskStatus> = {
	queue: "QUEUE",
	pending: "PENDING",
	"not-yet-started": "NOT_YET_STARTED",
	"in-progress": "IN_PROGRESS",
	completed: "COMPLETED",
	cancelled: "CANCELLED",
	duplicate: "DUPLICATE",
};

export const TASK_TYPE_BADGE: Record<string, string> = {
	ADMINISTRATIVE: "bg-slate-100 text-slate-700 border-slate-200",
	PHARMACEUTICALS: "bg-purple-100 text-purple-700 border-purple-200",
	INVENTORY: "bg-amber-100 text-amber-700 border-amber-200",
	FINANCE: "bg-green-100 text-green-700 border-green-200",
	LABORATORY: "bg-blue-100 text-blue-700 border-blue-200",
	COSMETICS: "bg-pink-100 text-pink-700 border-pink-200",
	MEDICAL: "bg-red-100 text-red-700 border-red-200",
};

export const getTaskStatusLabel = (t: TFunction, status: TaskStatus | string) =>
	t(`tasks.labels.status.${status}`, { defaultValue: status });

export const getTaskPriorityLabel = (t: TFunction, priority: TaskPriority | string) =>
	t(`tasks.labels.priority.${priority}`, { defaultValue: priority });

export const getTaskTypeLabel = (t: TFunction, type: TaskType | string) =>
	t(`tasks.labels.type.${type}`, { defaultValue: type });

export const getTaskColumns = (t: TFunction): TaskColumn[] => [
	{
		id: "queue",
		name: t("tasks.labels.status.QUEUE"),
		count: 0,
		icon: <IconInbox className="size-4 text-pink-500" />,
	},
	{
		id: "pending",
		name: t("tasks.labels.status.PENDING"),
		count: 0,
		icon: <IconClockHour4 className="size-4 text-amber-500" />,
	},
	{
		id: "not-yet-started",
		name: t("tasks.labels.status.NOT_YET_STARTED"),
		count: 0,
		icon: <IconCircle className="size-4 text-slate-400" />,
	},
	{
		id: "in-progress",
		name: t("tasks.labels.status.IN_PROGRESS"),
		count: 0,
		icon: <IconPlayerPlay className="size-4 text-blue-500" />,
	},
	{
		id: "completed",
		name: t("tasks.labels.status.COMPLETED"),
		count: 0,
		icon: <IconCircleCheck className="size-4 text-green-500" />,
	},
	{
		id: "cancelled",
		name: t("tasks.labels.status.CANCELLED"),
		count: 0,
		icon: <IconCircleX className="size-4 text-red-500" />,
	},
	{
		id: "duplicate",
		name: t("tasks.labels.status.DUPLICATE"),
		count: 0,
		icon: <IconCopy className="size-4 text-rose-500" />,
	},
];
