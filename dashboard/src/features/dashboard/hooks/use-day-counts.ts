import { useQuery } from "@tanstack/react-query";
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";

import { api } from "@/lib/api";
import type { DashboardDayCount } from "@/server/dashboard/dashboard.type";

const EMPTY_COUNTS: ReadonlyMap<string, DashboardDayCount> = new Map();

// Eden Treaty يحوّل أي نص بصيغة ISO إلى Date تلقائيًا، فيصل `date` كـ Date لا كنص.
// نُعيده إلى `yyyy-MM-dd` (باليوم نفسه الذي أرسله الخادم) ليطابق مفتاح البحث في التقويم.
const dayKey = (date: DashboardDayCount["date"]) => new Date(date).toISOString().slice(0, 10);

/**
 * عدّاد الزيارات/الجلسات لكل يوم في الشهر المعروض داخل التقويم.
 * يُرجع خريطة مفتاحها `yyyy-MM-dd` ليقرأها زر اليوم مباشرة.
 */
export const useDayCounts = (month: Date, enabled = true) => {
	// نغطي الأسابيع الظاهرة كاملة لأن التقويم يعرض أيامًا من الشهرين المجاورين.
	const from = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
	const to = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });

	const { data, isLoading } = useQuery({
		queryKey: ["dashboard", "day-counts", format(month, "yyyy-MM")],
		queryFn: async () => {
			const res = await api.dashboard["day-counts"].get({
				query: {
					from: from.toISOString(),
					to: to.toISOString(),
					tzOffset: new Date().getTimezoneOffset(),
				},
			});
			if (res.error) throw new Error("Failed to fetch day counts");
			return new Map(res.data.map((day) => [dayKey(day.date), day]));
		},
		enabled,
		staleTime: 1000 * 60 * 2,
	});

	return { countsByDay: data ?? EMPTY_COUNTS, isLoading };
};
