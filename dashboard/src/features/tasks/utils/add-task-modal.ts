import type { DeadlinePreset } from "@/features/tasks/types/add-task-modal.types";

export const getDeadlineDate = (date: Date) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);

export const getPresetDeadlineDate = (preset: DeadlinePreset) => {
	const date = getDeadlineDate(new Date());

	if (preset === "tomorrow") {
		date.setDate(date.getDate() + 1);
		return date;
	}

	if (preset === "afterWeek") {
		date.setDate(date.getDate() + 7);
		return date;
	}

	return date;
};
