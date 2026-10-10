import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { LabTestOrderResponse } from "@/server/lab-tests/lab-tests.type";

const EMPTY: LabTestOrderResponse[] = [];

/** تحاليل زيارة معيّنة — الربط المزدوج بين لوحة التحاليل وخطة العلاج داخل الزيارة */
export const useLabTestsByAppointment = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<LabTestOrderResponse[]>({
		queryKey: ["lab-tests", "by-appointment", appointmentId],
		enabled: !!appointmentId,
		queryFn: async () => {
			const res = await api["lab-tests"].get({
				query: { appointmentId: appointmentId as string },
			});
			if (res.error) throw new Error("فشل جلب تحاليل الزيارة");
			return res.data as LabTestOrderResponse[];
		},
	});

	return { labTests: data ?? EMPTY, isLoading };
};
