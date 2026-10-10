import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
	AgentSettingsResponse,
	UpdateAgentSettingsInput,
} from "@/server/agent/agent.type";
import { backendUrl } from "@/lib/backend-fetch";

const QUERY_KEY = ["agent", "settings"] as const;

// جلب إعدادات وكيل الذكاء للأكاديمية الحالية
export const useAgentSettings = () => {
	const { data, isLoading } = useQuery<AgentSettingsResponse>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const res = await fetch(backendUrl("/api/agent/settings"), {
				credentials: "include",
			});
			if (!res.ok) throw new Error("failed to load agent settings");
			return res.json();
		},
		staleTime: 1000 * 60 * 5,
	});

	return { settings: data, isLoading };
};

// تحديث الإعدادات (تفاؤلي مع إعادة الجلب)
export const useUpdateAgentSettings = () => {
	const qc = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: async (input: UpdateAgentSettingsInput) => {
			const res = await fetch(backendUrl("/api/agent/settings"), {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(input),
			});
			if (!res.ok) throw new Error("failed to update agent settings");
			return res.json() as Promise<AgentSettingsResponse>;
		},
		onMutate: async (input) => {
			await qc.cancelQueries({ queryKey: QUERY_KEY });
			const prev = qc.getQueryData<AgentSettingsResponse>(QUERY_KEY);
			if (prev) qc.setQueryData<AgentSettingsResponse>(QUERY_KEY, { ...prev, ...input });
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			if (ctx?.prev) qc.setQueryData(QUERY_KEY, ctx.prev);
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});

	return { updateSettings: mutate, isPending };
};
