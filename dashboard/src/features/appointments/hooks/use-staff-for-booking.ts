import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { StaffForBookingResponse } from "@/server/appointments/appointments.type";

const EMPTY: StaffForBookingResponse[] = [];

export const useStaffForBooking = () => {
	const { data, isLoading } = useQuery<StaffForBookingResponse[]>({
		queryKey: ["appointments", "staff-for-booking"],
		queryFn: async () => {
			const res = await api.appointments["staff-for-booking"].get();
			if (res.error) throw new Error("فشل جلب المدرّبين");
			return res.data as StaffForBookingResponse[];
		},
		staleTime: 60 * 1000,
	});

	return { staff: data ?? EMPTY, isLoading };
};
