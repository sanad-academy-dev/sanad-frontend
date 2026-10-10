import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PatientResponse } from "@/server/patients/patients.type";

const EMPTY_PATIENTS: PatientResponse[] = [];

export const usePatientsByOwner = (ownerId: string | undefined) => {
	const { data, isLoading } = useQuery<PatientResponse[]>({
		queryKey: ["patients", "by-owner", ownerId],
		queryFn: async () => {
			if (!ownerId) return [];
			const res = await api.patients.get({ query: { ownerId } });
			if (res.error) throw new Error("فشل تحميل أطفال وليّ الأمر");
			return res.data as PatientResponse[];
		},
		enabled: !!ownerId,
		staleTime: 1000 * 60 * 5,
	});

	return { patients: data ?? EMPTY_PATIENTS, isLoading };
};
