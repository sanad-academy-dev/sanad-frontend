import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";

const EMPTY_PATIENTS: PatientResponse[] = [];

export const usePatients = () => {
	const { data, isLoading } = useQuery<PatientResponse[]>({
		queryKey: ["patients"],
		queryFn: async () => {
			const res = await api.patients.get();
			if (res.error) throw new Error("فشل تحميل الأطفال");
			return res.data as PatientResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { patients: data ?? EMPTY_PATIENTS, isLoading };
};
