import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ReportPayload } from "@/server/reports/reports.type";

/**
 * Fetches one computed report. The window is part of the query key, so switching dates
 * re-fetches while the previous window stays cached — flipping back and forth is free.
 *
 * `reportId` is a plain string: callers already hold a `ReportDef` that came out of the
 * catalogue, and the server re-validates the id before it reaches a builder.
 */
export const useReport = (reportId: string, from: string, to: string) => {
	const tzOffset = new Date().getTimezoneOffset();

	const { data, isLoading, isFetching, error, refetch } = useQuery<ReportPayload>({
		queryKey: ["report", reportId, from, to],
		queryFn: async () => {
			const { data, error } = await api.reports({ reportId }).get({
				query: { from, to, tzOffset },
			});
			if (error) throw new Error("تعذّر تحميل التقرير");
			return data as ReportPayload;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { report: data, isLoading, isFetching, error, refetch };
};
