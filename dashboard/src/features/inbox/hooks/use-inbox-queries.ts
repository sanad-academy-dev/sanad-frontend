import { useQuery } from "@tanstack/react-query";
import type { InboxSort } from "@/features/inbox/types/inbox.type";
import { api } from "@/lib/api";
import type {
	InboxActivityResponse,
	InboxItemDetailResponse,
	InboxItemResponse,
} from "@/server/inbox/inbox.type";

type ListParams = {
	kind: "NOTIFICATION" | "APPROVAL";
	sort: InboxSort;
	showRead: boolean;
	showUnread: boolean;
};

// قائمة عناصر الوارد (إشعارات أو موافقات) حسب التبويب والفلاتر
export function useInboxList({ kind, sort, showRead, showUnread }: ListParams) {
	const query = useQuery<InboxItemResponse[]>({
		queryKey: ["inbox", kind, { sort, showRead, showUnread }],
		queryFn: async () => {
			const res = await api.inbox.get({ query: { kind, sort, showRead, showUnread } });
			if (res.error) throw new Error("تعذّر تحميل الوارد");
			return res.data;
		},
		staleTime: 1000 * 30,
	});
	return { items: query.data ?? [], isLoading: query.isLoading };
}

// تفاصيل عنصر محدد (مع النشاط)
export function useInboxDetail(id: string | null) {
	const query = useQuery<InboxItemDetailResponse>({
		queryKey: ["inbox-item", id],
		queryFn: async () => {
			if (!id) throw new Error("no id");
			const res = await api.inbox({ id }).get();
			if (res.error) throw new Error("تعذّر تحميل التفاصيل");
			return res.data as InboxItemDetailResponse;
		},
		enabled: !!id,
		staleTime: 1000 * 30,
	});
	return { item: query.data ?? null, isLoading: query.isLoading };
}

// سجل نشاط عنصر (منفصل — يُحدَّث عند إضافة تعليق)
export function useInboxActivity(id: string | null) {
	const query = useQuery<InboxActivityResponse[]>({
		queryKey: ["inbox-activity", id],
		queryFn: async () => {
			if (!id) throw new Error("no id");
			const res = await api.inbox({ id }).activity.get();
			if (res.error) throw new Error("تعذّر تحميل النشاط");
			return res.data;
		},
		enabled: !!id,
		staleTime: 1000 * 30,
	});
	return { activity: query.data ?? [], isLoading: query.isLoading };
}

// عدد غير المقروء (لشارة الشريط الجانبي)
export function useInboxUnreadCount() {
	const query = useQuery<number>({
		queryKey: ["inbox", "unread-count"],
		queryFn: async () => {
			const res = await api.inbox["unread-count"].get();
			if (res.error) throw new Error("تعذّر تحميل العدد");
			return res.data.count;
		},
		staleTime: 1000 * 60,
	});
	return { unreadCount: query.data ?? 0 };
}
