import { useQuery } from "@tanstack/react-query";

import {
	type DashboardDateRange,
	resolveRange,
} from "@/features/dashboard/components/dashboard-date-range-filter";
import { api } from "@/lib/api";
import type { DashboardVolumeResponse } from "@/server/dashboard/dashboard.type";

const EMPTY_VOLUME: DashboardVolumeResponse = { cells: [], max: 0, busiest: [] };

export const useAppointmentVolume = (range?: DashboardDateRange) => {
	const resolved = range ? resolveRange(range) : null;
	const query = resolved
		? { from: resolved.from.toISOString(), to: resolved.to.toISOString() }
		: undefined;

	const { data, isLoading, isError } = useQuery<DashboardVolumeResponse>({
		queryKey: ["dashboard", "volume", query?.from ?? null, query?.to ?? null],
		queryFn: async () => {
			const res = await api.dashboard.volume.get(query ? { query } : undefined);
			if (res.error) throw new Error("Failed to fetch appointment volume");
			return res.data as DashboardVolumeResponse;
		},
		staleTime: 1000 * 60 * 2,
	});

	return { volume: data ?? EMPTY_VOLUME, isLoading, isError };
};
