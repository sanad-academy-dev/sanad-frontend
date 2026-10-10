import { useInfiniteQuery } from "@tanstack/react-query";
import type { CrmSubjectType } from "@/features/crm/hooks/use-crm-activities";
import { api } from "@/lib/api";
import type { CrmTimelinePage } from "@/server/crm/crm-timeline/crm-timeline.type";

/**
 * [CRM-P3] §8.3 — الخيط الزمني من نقطة نهايةٍ واحدة.
 *
 * حلّ محلّ دمجٍ في المتصفّح كان يجمع أربعة نداءات ويرتّبها. `useInfiniteQuery` لأنّ
 * الترقيم بالمؤشّر: الصفحة التالية تُشتقّ من آخر سطرٍ وصل، لا من رقم صفحةٍ يزيح كلّما
 * أُضيف نشاطٌ جديد أثناء التصفّح.
 */

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCrmTimeline = (
	subjectId: string | null,
	type: CrmSubjectType = "LEAD",
	kinds?: string,
) => {
	const query = useInfiniteQuery<CrmTimelinePage>({
		queryKey: [
			"crm",
			type === "DEAL" ? "deals" : "leads",
			subjectId,
			"timeline",
			kinds ?? "all",
		],
		enabled: !!subjectId,
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (last) => last.nextCursor ?? undefined,
		queryFn: async ({ pageParam }) => {
			const search = {
				...(kinds ? { types: kinds } : {}),
				...(pageParam ? { cursor: pageParam as string } : {}),
			};
			const { data, error } =
				type === "DEAL"
					? await api.crm.deals({ id: subjectId as string }).timeline.get({ query: search })
					: await api.crm.leads({ id: subjectId as string }).timeline.get({ query: search });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الخيط الزمني"));
			return data as CrmTimelinePage;
		},
	});

	return {
		entries: query.data?.pages.flatMap((page) => page.entries) ?? [],
		isLoading: query.isLoading,
		hasMore: query.hasNextPage,
		loadMore: query.fetchNextPage,
		isLoadingMore: query.isFetchingNextPage,
	};
};
