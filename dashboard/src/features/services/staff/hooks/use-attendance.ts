import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import { api } from "@/lib/api";
import type { AttendanceResponse } from "@/server/attendance/attendance.type";

const EMPTY: AttendanceResponse[] = [];

// سجلات الحضور لأسبوع (نطاق [start, end]) — تُستخدم للشبكة والإجماليات
export const useAttendance = (start: Date, end: Date) => {
	const startKey = format(start, "yyyy-MM-dd");
	const endKey = format(end, "yyyy-MM-dd");

	const { data, isLoading } = useQuery<AttendanceResponse[]>({
		queryKey: ["attendance", startKey, endKey],
		queryFn: async () => {
			const res = await api.attendance.get({ query: { start: startKey, end: endKey } });
			if (res.error) throw new Error("فشل تحميل سجلات الحضور");
			return res.data as AttendanceResponse[];
		},
		staleTime: 1000 * 60,
	});

	return { records: data ?? EMPTY, isLoading };
};
