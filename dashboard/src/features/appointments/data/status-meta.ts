import {
	IconAlertCircle,
	IconArrowDown,
	IconArrowsLeftRight,
	IconArrowUp,
	IconCalendarCheck,
	IconCalendarClock,
	IconChartBar,
	IconCircle,
	IconCircleCheck,
	IconCircleX,
	IconDots,
	IconFirstAidKit,
	IconPlayerPlay,
	IconReceipt2,
	IconStopwatch,
	IconUserOff,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { AppointmentStatus, QueueStatus, TaskPriority } from "@/generated/prisma/enums";
import { STATUS_LABELS } from "@sanad/contracts/runtime/server/appointments/appointments.workflow";

export type StatusAccent =
	| "neutral"
	| "amber"
	| "indigo"
	| "blue"
	| "green"
	| "purple"
	| "orange"
	| "emerald"
	| "red";

export type AppointmentStatusMeta = {
	label: string;
	icon: ComponentType<{ className?: string }>;
	color: string;
	accent: StatusAccent;
};

export const STATUS_META: Record<AppointmentStatus, AppointmentStatusMeta> = {
	[AppointmentStatus.WAITING]: {
		label: STATUS_LABELS[AppointmentStatus.WAITING],
		icon: IconArrowsLeftRight,
		color: "text-foreground",
		accent: "neutral",
	},
	[AppointmentStatus.SCHEDULED]: {
		label: STATUS_LABELS[AppointmentStatus.SCHEDULED],
		icon: IconCircle,
		color: "text-muted-foreground",
		accent: "neutral",
	},
	[AppointmentStatus.CHECK_IN]: {
		label: STATUS_LABELS[AppointmentStatus.CHECK_IN],
		icon: IconStopwatch,
		color: "text-indigo-500",
		accent: "indigo",
	},
	[AppointmentStatus.IN_SERVICE]: {
		label: STATUS_LABELS[AppointmentStatus.IN_SERVICE],
		icon: IconPlayerPlay,
		color: "text-orange-500",
		accent: "orange",
	},
	[AppointmentStatus.HOSPITALIZED]: {
		label: STATUS_LABELS[AppointmentStatus.HOSPITALIZED],
		icon: IconFirstAidKit,
		color: "text-foreground",
		accent: "neutral",
	},
	[AppointmentStatus.AWAITING_PAYMENT]: {
		label: STATUS_LABELS[AppointmentStatus.AWAITING_PAYMENT],
		icon: IconReceipt2,
		color: "text-blue-500",
		accent: "blue",
	},
	[AppointmentStatus.DONE]: {
		label: STATUS_LABELS[AppointmentStatus.DONE],
		icon: IconCircleCheck,
		color: "text-blue-500",
		accent: "blue",
	},
	[AppointmentStatus.CANCELLED]: {
		label: STATUS_LABELS[AppointmentStatus.CANCELLED],
		icon: IconCircleX,
		color: "text-muted-foreground",
		accent: "neutral",
	},
};

export type StatusActionConfig = {
	label: string;
	nextStatus: AppointmentStatus;
};

export const STATUS_ACTION_CONFIG: Partial<Record<AppointmentStatus, StatusActionConfig>> = {
	[AppointmentStatus.SCHEDULED]: {
		label: "تأكيد الزيارة",
		nextStatus: AppointmentStatus.CHECK_IN,
	},
	[AppointmentStatus.CHECK_IN]: {
		label: "بدء الفحص",
		nextStatus: AppointmentStatus.IN_SERVICE,
	},
	[AppointmentStatus.IN_SERVICE]: {
		label: "إنهاء الزيارة",
		nextStatus: AppointmentStatus.AWAITING_PAYMENT,
	},
	[AppointmentStatus.HOSPITALIZED]: {
		label: "إنهاء التنويم",
		nextStatus: AppointmentStatus.AWAITING_PAYMENT,
	},
	[AppointmentStatus.AWAITING_PAYMENT]: {
		label: "تأكيد الدفع",
		nextStatus: AppointmentStatus.DONE,
	},
};

export type QueueStatusMeta = {
	label: string;
	icon: ComponentType<{ className?: string }>;
	color: string;
};

export const QUEUE_STATUS_META: Record<QueueStatus, QueueStatusMeta> = {
	[QueueStatus.ON_HOLD]: {
		label: "معلق",
		icon: IconCalendarClock,
		color: "text-amber-500",
	},
	[QueueStatus.NO_SHOW]: {
		label: "لم يحضر",
		icon: IconUserOff,
		color: "text-rose-500",
	},
	[QueueStatus.CONFIRMED]: {
		label: "مؤكد",
		icon: IconCalendarCheck,
		color: "text-emerald-600",
	},
};

export type PriorityMeta = {
	label: string;
	/** ترتيب أعلى = أولوية أعلى (للفرز في الطابور) */
	rank: number;
	className: string;
};

// أولوية الزيارة تعيد استخدام TaskPriority — تُعرض كوسم وتُرتّب الطابور طبيًا
export const PRIORITY_META: Record<TaskPriority, PriorityMeta> = {
	[TaskPriority.URGENT]: {
		label: "عاجلة",
		rank: 4,
		className: "border-red-200 text-red-600 dark:border-red-800 dark:text-red-400",
	},
	[TaskPriority.HIGH]: {
		label: "مرتفعة",
		rank: 3,
		className: "border-orange-200 text-orange-600 dark:border-orange-800 dark:text-orange-400",
	},
	[TaskPriority.MEDIUM]: {
		label: "متوسطة",
		rank: 2,
		className: "border-amber-200 text-amber-600 dark:border-amber-800 dark:text-amber-400",
	},
	[TaskPriority.LOW]: {
		label: "منخفضة",
		rank: 1,
		className: "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400",
	},
};

export const priorityRank = (priority: TaskPriority | null): number =>
	priority ? PRIORITY_META[priority].rank : 0;

/**
 * قائمة اختيار الأولوية بأيقوناتها — مرتّبة من الأعلى إلى الأدنى (عاجلة أولًا).
 * مشتركة بين نافذة إضافة الزيارة وقوائم الأولوية في البطاقات، فتُعرض الأولوية
 * بالشكل نفسه أينما تُختار.
 */
export const PRIORITY_OPTIONS = [
	{
		value: TaskPriority.URGENT,
		label: "عاجلة",
		icon: IconAlertCircle,
		iconClassName: "text-red-500",
	},
	{
		value: TaskPriority.HIGH,
		label: "مرتفعة",
		icon: IconArrowUp,
		iconClassName: "text-orange-500",
	},
	{
		value: TaskPriority.MEDIUM,
		label: "متوسطة",
		icon: IconChartBar,
		iconClassName: "text-amber-500",
	},
	{
		value: TaskPriority.LOW,
		label: "منخفضة",
		icon: IconArrowDown,
		iconClassName: "text-slate-400",
	},
] as const;

/** خيار "بدون أولوية" — نفس مظهره في نافذة الزيارة */
export const NO_PRIORITY_OPTION = {
	label: "بدون أولوية",
	icon: IconDots,
	iconClassName: "text-muted-foreground",
} as const;
