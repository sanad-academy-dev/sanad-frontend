import { useQuery } from "@tanstack/react-query";

import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import type { TaskActivityResponse } from "@/server/tasks/tasks.type";

const EMPTY: TaskActivityResponse[] = [];

export const useTaskActivity = (taskId: string | null) => {
	const { t } = useI18n();
	const { data, isLoading } = useQuery<TaskActivityResponse[]>({
		queryKey: ["task-activity", taskId],
		queryFn: async () => {
			if (!taskId) throw new Error("no id");
			const res = await api.tasks({ id: taskId }).activity.get();
			if (res.error) throw new Error(t("tasks.errors.fetchActivity"));
			return (res.data ?? []) as TaskActivityResponse[];
		},
		enabled: !!taskId,
	});

	return { activity: data ?? EMPTY, isLoading };
};
