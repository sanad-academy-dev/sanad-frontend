import { useQuery } from "@tanstack/react-query";

import { useRouteContext } from "@/features/agent/hooks/use-route-context";
import type { PresetsResponse } from "@/features/agent/types/preset.types";
import { backendUrl } from "@/lib/backend-fetch";

export const useAgentPresets = () => {
	const { context } = useRouteContext();

	const { data, isLoading } = useQuery<PresetsResponse>({
		queryKey: ["agent", "presets", context ?? "none"],
		queryFn: async () => {
			const params = context ? `?context=${encodeURIComponent(context)}` : "";
			const res = await fetch(backendUrl(`/api/agent/presets${params}`), {
				credentials: "include",
			});
			if (!res.ok) throw new Error("failed to load presets");
			return res.json();
		},
		staleTime: 1000 * 60 * 5,
	});

	return {
		presets: data?.presets ?? [],
		subAgents: data?.subAgents ?? [],
		isLoading,
	};
};
