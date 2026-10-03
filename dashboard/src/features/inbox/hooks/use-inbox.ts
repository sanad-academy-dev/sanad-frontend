import { useEffect, useMemo, useRef } from "react";
import { useMarkInboxRead } from "@/features/inbox/hooks/use-inbox-mutations";
import { useInboxDetail, useInboxList } from "@/features/inbox/hooks/use-inbox-queries";
import { useInboxStore } from "@/features/inbox/stores/inbox.store";
import {
	INBOX_TIME_GROUPS,
	type InboxApproval,
	type InboxNotification,
	type InboxTimeGroup,
} from "@/features/inbox/types/inbox.type";
import {
	mapApproval,
	mapNotification,
	mapNotificationDetail,
} from "@/features/inbox/utils/inbox-map";

export type InboxGroup = {
	group: InboxTimeGroup;
	label: string;
	items: InboxNotification[];
};

export type InboxApprovalGroup = {
	group: InboxTimeGroup;
	label: string;
	items: InboxApproval[];
};

function groupByTime<T extends { timeGroup: InboxTimeGroup }>(items: T[]) {
	return INBOX_TIME_GROUPS.map(({ value, label }) => ({
		group: value,
		label,
		items: items.filter((i) => i.timeGroup === value),
	})).filter((g) => g.items.length > 0);
}

// مطابقة نص البحث على عنوان الإشعار واسم الطفل وأسماء المعنيين (غير حساس لحالة الأحرف)
function matchesNotification(n: InboxNotification, query: string) {
	const haystack = [n.title, n.patient?.name, ...n.contacts.map((c) => c.name)]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
	return haystack.includes(query);
}

function matchesApproval(a: InboxApproval, query: string) {
	const haystack = [a.title, a.typeLabel, a.patient?.name]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();
	return haystack.includes(query);
}

/**
 * مصدر بيانات الوارد من الـ API. يجلب القائمة حسب التبويب، يطبّق فلتر الفئة
 * على العميل، يجمّع زمنيًا، ويشتق العنصر المحدد. يحافظ على نفس شكل الإرجاع
 * الذي تعتمده المكوّنات.
 */
export function useInbox() {
	const {
		activeTab,
		selectedId,
		activeCategory,
		searchQuery,
		sort,
		showRead,
		showUnread,
		displayProperties,
		setTab,
		select,
		setCategory,
		setSearchQuery,
		setSort,
		setShowRead,
		setShowUnread,
		toggleDisplayProperty,
	} = useInboxStore();

	// عبارة البحث المطبّعة (مقصوصة وبأحرف صغيرة) — فارغة تعني لا فلترة
	const normalizedQuery = searchQuery.trim().toLowerCase();

	const isApprovals = activeTab === "approvals";
	const { items, isLoading } = useInboxList({
		kind: isApprovals ? "APPROVAL" : "NOTIFICATION",
		sort,
		showRead,
		showUnread,
	});

	// تفاصيل العنصر المحدد (مع النشاط)
	const { item: detailRaw } = useInboxDetail(selectedId);
	const markRead = useMarkInboxRead();

	// علّم المحدد كمقروء تلقائيًا مرة واحدة فقط لكل عنصر (تفادي حلقة إعادة الجلب)
	const markedRef = useRef<Set<string>>(new Set());
	useEffect(() => {
		if (!selectedId || !detailRaw || detailRaw.read) return;
		if (markedRef.current.has(selectedId)) return;
		markedRef.current.add(selectedId);
		markRead(selectedId);
		// نعتمد فقط على selectedId — العنصر يُعلَّم مقروءًا مرة واحدة عند فتحه
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedId, markRead, detailRaw?.read, detailRaw]);

	// ── إشعارات ──────────────────────────────────────────────────────────────
	const notifications = useMemo(() => {
		let mapped = items.map(mapNotification);
		if (activeCategory !== "all") {
			mapped = mapped.filter((n) => n.category === activeCategory);
		}
		if (normalizedQuery) {
			mapped = mapped.filter((n) => matchesNotification(n, normalizedQuery));
		}
		return mapped;
	}, [items, activeCategory, normalizedQuery]);

	const groups = useMemo<InboxGroup[]>(
		() => (isApprovals ? [] : groupByTime(notifications)),
		[isApprovals, notifications],
	);

	// ── موافقات ──────────────────────────────────────────────────────────────
	const approvals = useMemo(() => {
		if (!isApprovals) return [];
		const mapped = items.map(mapApproval);
		return normalizedQuery
			? mapped.filter((a) => matchesApproval(a, normalizedQuery))
			: mapped;
	}, [isApprovals, items, normalizedQuery]);
	const approvalGroups = useMemo<InboxApprovalGroup[]>(
		() => (isApprovals ? groupByTime(approvals) : []),
		[isApprovals, approvals],
	);

	// العنصر المحدد (بشكل الواجهة) — من التفاصيل إن توفّرت
	const selected = useMemo<InboxNotification | null>(() => {
		if (isApprovals || !selectedId) return null;
		if (detailRaw && detailRaw.id === selectedId) return mapNotificationDetail(detailRaw);
		return notifications.find((n) => n.id === selectedId) ?? null;
	}, [isApprovals, selectedId, detailRaw, notifications]);

	const selectedApproval = useMemo<InboxApproval | null>(() => {
		if (!isApprovals || !selectedId) return null;
		return approvals.find((a) => a.id === selectedId) ?? null;
	}, [isApprovals, selectedId, approvals]);

	// فارغ = لا نتائج للتبويب النشط بعد تطبيق الفلاتر/البحث (وليس فقط لا بيانات)
	const isEmpty =
		!isLoading && (isApprovals ? approvals.length === 0 : notifications.length === 0);

	return {
		activeTab,
		groups,
		approvalGroups,
		selected,
		selectedApproval,
		selectedId,
		activeCategory,
		searchQuery,
		setSearchQuery,
		isLoading,
		isEmpty,
		// إعدادات العرض
		sort,
		showRead,
		showUnread,
		displayProperties,
		setTab,
		select,
		setCategory,
		setSort,
		setShowRead,
		setShowUnread,
		toggleDisplayProperty,
	};
}
