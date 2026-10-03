import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { api } from "@/lib/api";
import type { ShiftAssignmentResponse } from "@/server/shifts/shifts.type";

const EMPTY: ShiftAssignmentResponse[] = [];

// تعيينات المناوبات لأسبوع (نطاق [start, end]) — تُستخدم للشبكة والإجماليات
export const useShifts = (start: Date, end: Date) => {
	const startKey = format(start, "yyyy-MM-dd");
	const endKey = format(end, "yyyy-MM-dd");

	const { data, isLoading } = useQuery<ShiftAssignmentResponse[]>({
		queryKey: ["shifts", startKey, endKey],
		queryFn: async () => {
			const res = await api.shifts.get({ query: { start: startKey, end: endKey } });
			if (res.error) throw new Error("فشل تحميل المناوبات");
			return res.data as ShiftAssignmentResponse[];
		},
		staleTime: 1000 * 60,
	});

	return { shifts: data ?? EMPTY, isLoading };
};
