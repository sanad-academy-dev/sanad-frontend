import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RadiologyOrderResponse } from "@/server/radiology/radiology.type";

const EMPTY: RadiologyOrderResponse[] = [];

/** طلبات الأشعة المرتبطة بزيارة — تُعرض داخل تبويبات الزيارة */
export const useRadiologyByAppointment = (appointmentId: string | null) => {
	const { data, isLoading } = useQuery<RadiologyOrderResponse[]>({
		queryKey: ["radiology", "by-appointment", appointmentId],
		enabled: !!appointmentId,
		queryFn: async () => {
			const res = await api.radiology.get({
				query: { appointmentId: appointmentId as string },
			});
			if (res.error) throw new Error("فشل جلب أشعة الزيارة");
			return res.data as RadiologyOrderResponse[];
		},
		staleTime: 30_000,
	});

	return { radiologyOrders: data ?? EMPTY, isLoading };
};
