import { useQuery } from "@tanstack/react-query";
import type { TasksView } from "@/features/tasks/components/tasks-header";
import { api } from "@/lib/api";
import type { KanbanTaskResponse } from "@/server/tasks/tasks.type";

const EMPTY: KanbanTaskResponse[] = [];

export const useTasksKanban = (view: TasksView) => {
	const { data, isLoading } = useQuery<KanbanTaskResponse[]>({
		queryKey: ["tasks", "kanban", view],
		queryFn: async () => {
			const res = await api.tasks.kanban.get({ query: { view } });
			if (res.error) throw new Error("Failed to fetch tasks");
			return res.data as KanbanTaskResponse[];
		},
		staleTime: 1000 * 60 * 2,
	});

	return { tasks: data ?? EMPTY, isLoading };
};
