import type { TFunction } from "i18next";
import { STATUS_TO_COLUMN } from "@/features/tasks/data/task-columns";
import type { TaskCardData, TaskColumnId } from "@/features/tasks/types/task.types";
import type { Language } from "@/lib/data/constants";
import type { KanbanTaskResponse } from "@/server/tasks/tasks.type";

const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

const formatDeadlineLabel = (date: Date, t: TFunction, lang: Language): string => {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (isSameDay(date, today)) return t("tasks.dates.today");
	if (isSameDay(date, tomorrow)) return t("tasks.dates.tomorrow");
	if (isSameDay(date, yesterday)) return t("tasks.dates.yesterday");
	return date.toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
		day: "numeric",
		month: "short",
	});
};

export const mapTaskToCard = (
	task: KanbanTaskResponse,
	t: TFunction,
	lang: Language,
): TaskCardData => {
	const deadline = task.deadline ? new Date(task.deadline) : null;
	return {
		id: task.id,
		name: task.title,
		column: STATUS_TO_COLUMN[task.status] as TaskColumnId,
		code: task.code,
		title: task.title,
		type: task.type,
		priority: task.priority,
		deadline,
		deadlineLabel: deadline ? formatDeadlineLabel(deadline, t, lang) : null,
		assigneeName:
			task.assignees.length > 0 ? task.assignees.map((a) => a.name).join("، ") : null,
		assigneeInitials: task.assignees[0]?.name?.charAt(0) ?? null,
		subtasksTotal: task.subtasks.length,
		subtasksCompleted: task.subtasks.filter((s) => s.isCompleted).length,
		commentsCount: task._count.activity,
	};
};
