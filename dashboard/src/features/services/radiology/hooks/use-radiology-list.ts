import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	RadiologyOrderResponse,
	RadiologyPeriod,
	RadiologyView,
} from "@/server/radiology/radiology.type";

const EMPTY: RadiologyOrderResponse[] = [];

// تحديث دوري يغذّي شارة "مباشر" في شريط التنبيهات
export const RADIOLOGY_REFETCH_INTERVAL_MS = 60_000;
export const RADIOLOGY_CLIENT_TICK_MS = 30_000;

export const useRadiologyList = (period: RadiologyPeriod, view: RadiologyView) => {
	const { data, isLoading, isError, failureCount, dataUpdatedAt } = useQuery<
		RadiologyOrderResponse[]
	>({
		queryKey: ["radiology", "list", period, view],
		queryFn: async () => {
			const res = await api.radiology.get({ query: { period, view } });
			if (res.error) throw new Error("فشل جلب طلبات الأشعة");
			return res.data as RadiologyOrderResponse[];
		},
		staleTime: 30_000,
		refetchInterval: RADIOLOGY_REFETCH_INTERVAL_MS,
		refetchIntervalInBackground: false,
	});

	return { radiologyOrders: data ?? EMPTY, isLoading, isError, failureCount, dataUpdatedAt };
};
