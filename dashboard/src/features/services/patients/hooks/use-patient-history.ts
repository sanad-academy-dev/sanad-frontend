import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PatientHistoryEntry } from "@/server/patients/patients.type";

export const patientHistoryKey = (patientId: string) => ["patient-history", patientId];

/**
 * الخط الزمني الكامل للطفل. الخادم يعيده مرتّبًا تنازليًا وغير مُصفّى —
 * التصفية بالنوع والتجميع باليوم يقعان في الواجهة على المصفوفة نفسها.
 */
export const usePatientHistory = (patientId: string) => {
	const { data, isLoading, error, refetch } = useQuery<PatientHistoryEntry[]>({
		queryKey: patientHistoryKey(patientId),
		enabled: !!patientId,
		staleTime: 60 * 1000,
		queryFn: async () => {
			const res = await api.patients({ id: patientId }).history.get();
			if (res.error) {
				const value = res.error.value as { message?: string } | undefined;
				throw new Error(value?.message ?? "تعذّر جلب سجل الطفل");
			}
			return res.data as PatientHistoryEntry[];
		},
	});

	return { history: data ?? [], isLoading, error, refetch };
};
