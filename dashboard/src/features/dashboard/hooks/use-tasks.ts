import { useQuery } from "@tanstack/react-query";
import type { TaskStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { DashboardTaskResponse } from "@/server/tasks/tasks.type";

export const useTasks = ({ status }: { status?: TaskStatus } = {}) => {
	const { data, isLoading, isError } = useQuery<DashboardTaskResponse[]>({
		queryKey: ["tasks", "dashboard", status ?? "all"],
		queryFn: async () => {
			const res = await api.tasks.dashboard.get({
				query: {
					...(status ? { status } : {}),
				},
			});

			if (res.error) throw new Error("Failed to fetch tasks");
			return (res.data as DashboardTaskResponse[]) ?? [];
		},
		retry: 1,
	});

	return { tasks: data ?? [], isLoading, isError };
};
