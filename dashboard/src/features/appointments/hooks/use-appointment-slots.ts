import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppointmentSlot } from "@/server/appointments/appointments.type";

type Params = {
	staffId: string | undefined;
	date: Date | undefined;
	durationMinutes: number;
	excludeAppointmentId?: string;
};

const EMPTY: AppointmentSlot[] = [];

export const useAppointmentSlots = ({
	staffId,
	date,
	durationMinutes,
	excludeAppointmentId,
}: Params) => {
	const dateKey = date ? date.toISOString().slice(0, 10) : null;

	const { data, isLoading, isFetching } = useQuery<AppointmentSlot[]>({
		queryKey: [
			"appointments",
			"slots",
			staffId,
			dateKey,
			durationMinutes,
			excludeAppointmentId ?? null,
		],
		queryFn: async () => {
			if (!staffId || !date || durationMinutes <= 0) return [];
			const res = await api.appointments.slots.get({
				query: {
					staffId,
					date: date.toISOString(),
					durationMinutes,
					...(excludeAppointmentId && { excludeAppointmentId }),
				},
			});
			if (res.error) throw new Error("فشل جلب الأوقات المتاحة");
			return res.data as AppointmentSlot[];
		},
		enabled: !!staffId && !!date && durationMinutes > 0,
		staleTime: 30 * 1000,
	});

	return { slots: data ?? EMPTY, isLoading: isLoading || isFetching };
};
