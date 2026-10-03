import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { TaskStats } from "@/server/tasks/tasks.type";

const EMPTY_STATS: TaskStats = {
	total: 0,
	pending: 0,
	inProgress: 0,
	completed: 0,
	cancelled: 0,
};

export const useTasksStats = () => {
	const { data, isLoading } = useQuery<TaskStats>({
		queryKey: ["tasks", "stats"],
		queryFn: async () => {
			const res = await api.tasks.stats.get();
			if (res.error) throw new Error("Failed to fetch task stats");
			return res.data as TaskStats;
		},
		staleTime: 1000 * 60 * 2,
	});

	return { stats: data ?? EMPTY_STATS, isLoading };
};
