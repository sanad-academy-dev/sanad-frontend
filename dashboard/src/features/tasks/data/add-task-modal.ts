import {
	IconAlertCircle,
	IconArrowDown,
	IconArrowUp,
	IconBriefcase,
	IconCash,
	IconChartBar,
	IconCircle,
	IconCircleCheck,
	IconCircleX,
	IconClockHour4,
	IconCopy,
	IconInbox,
	IconMicroscope,
	IconPackage,
	IconPill,
	IconPlayerPlay,
	IconSparkles,
	IconStethoscope,
} from "@tabler/icons-react";
import type { TFunction } from "i18next";
import type { DefaultValues } from "react-hook-form";

import type { SelectOption } from "@/features/tasks/types/add-task-modal.types";
import type { AddTaskFormInput } from "@/features/tasks/types/form.types";
import type { TaskPriority, TaskStatus, TaskType } from "@/generated/prisma/enums";

export const ADD_TASK_FORM_DEFAULTS: DefaultValues<AddTaskFormInput> = {
	title: "",
	content: "",
	type: undefined,
	status: undefined,
	priority: undefined,
	assigneeIds: [],
	deadline: undefined,
	images: [],
	emailNotification: false,
	createMultiple: false,
};

export const getTaskTypeOptions = (t: TFunction): SelectOption<TaskType>[] => [
	{
		value: "ADMINISTRATIVE",
		label: t("dashboard.addTaskModal.taskTypes.ADMINISTRATIVE"),
		icon: IconBriefcase,
	},
	{
		value: "PHARMACEUTICALS",
		label: t("dashboard.addTaskModal.taskTypes.PHARMACEUTICALS"),
		icon: IconPill,
	},
	{
		value: "INVENTORY",
		label: t("dashboard.addTaskModal.taskTypes.INVENTORY"),
		icon: IconPackage,
	},
	{
		value: "FINANCE",
		label: t("dashboard.addTaskModal.taskTypes.FINANCE"),
		icon: IconCash,
	},
	{
		value: "LABORATORY",
		label: t("dashboard.addTaskModal.taskTypes.LABORATORY"),
		icon: IconMicroscope,
	},
	{
		value: "COSMETICS",
		label: t("dashboard.addTaskModal.taskTypes.COSMETICS"),
		icon: IconSparkles,
	},
	{
		value: "MEDICAL",
		label: t("dashboard.addTaskModal.taskTypes.MEDICAL"),
		icon: IconStethoscope,
	},
];

export const getTaskStatusOptions = (t: TFunction): SelectOption<TaskStatus>[] => [
	{
		value: "PENDING",
		label: t("dashboard.addTaskModal.taskStatuses.PENDING"),
		priority: 1,
		icon: IconClockHour4,
		iconClassName: "text-amber-500",
		badgeClassName: "border-amber-200 text-amber-600 bg-amber-50",
	},
	{
		value: "NOT_YET_STARTED",
		label: t("dashboard.addTaskModal.taskStatuses.NOT_YET_STARTED"),
		priority: 2,
		icon: IconCircle,
		iconClassName: "text-slate-400",
		badgeClassName: "border-slate-200 text-slate-500 bg-slate-50",
	},
	{
		value: "IN_PROGRESS",
		label: t("dashboard.addTaskModal.taskStatuses.IN_PROGRESS"),
		priority: 3,
		icon: IconPlayerPlay,
		iconClassName: "text-blue-500",
		badgeClassName: "border-blue-200 text-blue-600 bg-blue-50",
	},
	{
		value: "COMPLETED",
		label: t("dashboard.addTaskModal.taskStatuses.COMPLETED"),
		priority: 4,
		icon: IconCircleCheck,
		iconClassName: "text-green-500",
		badgeClassName: "border-green-200 text-green-600 bg-green-50",
	},
	{
		value: "CANCELLED",
		label: t("dashboard.addTaskModal.taskStatuses.CANCELLED"),
		priority: 5,
		icon: IconCircleX,
		iconClassName: "text-red-500",
		badgeClassName: "border-red-200 text-red-600 bg-red-50",
	},
	{
		value: "DUPLICATE",
		label: t("dashboard.addTaskModal.taskStatuses.DUPLICATE"),
		priority: 6,
		icon: IconCopy,
		iconClassName: "text-rose-500",
		badgeClassName: "border-rose-200 text-rose-600 bg-rose-50",
	},
	{
		value: "QUEUE",
		label: t("dashboard.addTaskModal.taskStatuses.QUEUE"),
		priority: 0,
		icon: IconInbox,
		iconClassName: "text-pink-500",
		badgeClassName: "border-pink-200 text-pink-600 bg-pink-50",
	},
];

export const getTaskPriorityOptions = (t: TFunction): SelectOption<TaskPriority>[] => [
	{
		value: "URGENT",
		label: t("dashboard.addTaskModal.taskPriorities.URGENT"),
		icon: IconAlertCircle,
		iconClassName: "text-red-500",
	},
	{
		value: "HIGH",
		label: t("dashboard.addTaskModal.taskPriorities.HIGH"),
		icon: IconArrowUp,
		iconClassName: "text-orange-500",
	},
	{
		value: "MEDIUM",
		label: t("dashboard.addTaskModal.taskPriorities.MEDIUM"),
		icon: IconChartBar,
		iconClassName: "text-amber-500",
	},
	{
		value: "LOW",
		label: t("dashboard.addTaskModal.taskPriorities.LOW"),
		icon: IconArrowDown,
		iconClassName: "text-slate-400",
	},
];
