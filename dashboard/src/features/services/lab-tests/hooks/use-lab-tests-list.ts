import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	LabTestOrderResponse,
	LabTestsPeriod,
	LabTestsView,
} from "@/server/lab-tests/lab-tests.type";

const EMPTY: LabTestOrderResponse[] = [];

// تحديث دوري يغذّي شارة "مباشر" في شريط التنبيهات
export const LAB_TESTS_REFETCH_INTERVAL_MS = 60_000;
export const LAB_TESTS_CLIENT_TICK_MS = 30_000;

export const useLabTestsList = (period: LabTestsPeriod, view: LabTestsView) => {
	const { data, isLoading, isError, failureCount, dataUpdatedAt } = useQuery<
		LabTestOrderResponse[]
	>({
		queryKey: ["lab-tests", "list", period, view],
		queryFn: async () => {
			const res = await api["lab-tests"].get({ query: { period, view } });
			if (res.error) throw new Error("فشل جلب التحاليل");
			return res.data as LabTestOrderResponse[];
		},
		staleTime: 30_000,
		refetchInterval: LAB_TESTS_REFETCH_INTERVAL_MS,
		refetchIntervalInBackground: false,
	});

	return { labTests: data ?? EMPTY, isLoading, isError, failureCount, dataUpdatedAt };
};
