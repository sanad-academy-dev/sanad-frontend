import { useQuery } from "@tanstack/react-query";

import { useI18n } from "@/hooks/use-i18n";
import { api } from "@/lib/api";
import type { TaskSheetResponse } from "@/server/tasks/tasks.type";

export const useTask = (id: string | null) => {
	const { t } = useI18n();
	const { data, isLoading } = useQuery<TaskSheetResponse>({
		queryKey: ["task", id],
		queryFn: async () => {
			if (!id) throw new Error("no id");
			const res = await api.tasks({ id }).get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? t("tasks.errors.fetchTask"));
			}
			return res.data as TaskSheetResponse;
		},
		enabled: !!id,
		staleTime: 30 * 1000,
	});

	return { task: data, isLoading };
};
