import type { PatientResponse } from "@sanad/contracts/runtime/server/patients/patients.type";
import { useQuery } from "@tanstack/react-query";
import { usePatients } from "@/features/services/patients/hooks/use-patients";
import { api } from "@/lib/api";

export const usePatient = (patientId?: string) => {
	const { patients, isLoading: isListLoading } = usePatients();
	const cached = patients.find((p) => p.id === patientId);

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["patients", patientId],
		queryFn: async () => {
			if (!patientId) throw new Error("معرف الطالب مطلوب");
			const res = await api.patients({ id: patientId }).get();
			if (res.error) throw new Error("فشل تحميل بيانات الطالب");
			return res.data as PatientResponse;
		},
		enabled: !!patientId,
		placeholderData: () => cached,
		staleTime: 1000 * 30,
	});

	return {
		patient: data ?? cached ?? null,
		isLoading: isLoading && !cached && !data,
		error,
		refetch,
	};
};
