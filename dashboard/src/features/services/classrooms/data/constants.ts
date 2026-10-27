import type { LearningMode } from "@/server/classrooms/classrooms.type";

export const AGE_GROUPS = [
	"4-6 سنه",
	"7-8 سنه",
	"9-11 سنة",
	"12-14 سنة",
	"12-14 سنة",
	"15-17 سنة",
	"18-20 سنة",
	"21-23 سنة",
	"23-26 سنة",
	"26+ سنة"
] as const;

export const CATEGORIES = [
	"مختلط",
	"بنين",
	"بنات",
] as const;

export type ClassroomCategory = (typeof CATEGORIES)[number];

export const LEARNING_MODES: Record<
	LearningMode,
	{ label: string; className: string }
> = {
	REMOTE: {
		label: "عن بعد",
		className: "bg-amber-500 text-white dark:bg-amber-600 border-amber-600",
	},
	IN_PERSON: {
		label: "حضوري",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
	},
	HYBRID: {
		label: "مدمج",
		className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
	},
};
