import { create } from "zustand";

import type {
	InboxCategory,
	InboxDisplayProperty,
	InboxSort,
	InboxTab,
} from "@/features/inbox/types/inbox.type";

interface InboxStore {
	// التبويب النشط (الإشعارات / الموافقات)
	activeTab: InboxTab;
	// معرّف العنصر المحدد حاليًا (إشعار أو موافقة حسب التبويب) — null = لا يوجد تحديد
	selectedId: string | null;
	// فئة الفلترة النشطة أعلى القائمة
	activeCategory: InboxCategory;
	// نص البحث الحالي (يفلتر القائمة حسب العنوان/الطفل/المعنيين)
	searchQuery: string;
	// هل حقل البحث مفتوح؟ (يحلّ محلّ شريط الفئات في القائمة عند فتحه)
	searchOpen: boolean;
	// إعدادات العرض (من قائمة الإعدادات)
	sort: InboxSort;
	showRead: boolean;
	showUnread: boolean;
	displayProperties: InboxDisplayProperty[];
	setTab: (tab: InboxTab) => void;
	select: (id: string | null) => void;
	setCategory: (category: InboxCategory) => void;
	setSearchQuery: (query: string) => void;
	// فتح/إغلاق حقل البحث؛ الإغلاق يُفرّغ النص أيضًا
	openSearch: () => void;
	closeSearch: () => void;
	setSort: (sort: InboxSort) => void;
	setShowRead: (value: boolean) => void;
	setShowUnread: (value: boolean) => void;
	toggleDisplayProperty: (property: InboxDisplayProperty) => void;
}

export const useInboxStore = create<InboxStore>()((set, get) => ({
	activeTab: "notifications",
	selectedId: null,
	activeCategory: "all",
	searchQuery: "",
	searchOpen: false,
	sort: "newest",
	showRead: true,
	showUnread: true,
	displayProperties: ["type", "importance", "statusIcon", "id"],
	// تبديل التبويب يمسح التحديد الحالي (العنصر المحدد يخص التبويب السابق)
	// ويغلق البحث ويُفرّغه لتفادي فلترة قائمة لا تظهر
	setTab: (tab) =>
		set({ activeTab: tab, selectedId: null, searchOpen: false, searchQuery: "" }),
	select: (id) => set({ selectedId: id }),
	setCategory: (category) => set({ activeCategory: category }),
	setSearchQuery: (query) => set({ searchQuery: query }),
	openSearch: () => set({ searchOpen: true }),
	closeSearch: () => set({ searchOpen: false, searchQuery: "" }),
	setSort: (sort) => set({ sort }),
	setShowRead: (value) => set({ showRead: value }),
	setShowUnread: (value) => set({ showUnread: value }),
	toggleDisplayProperty: (property) => {
		const current = get().displayProperties;
		set({
			displayProperties: current.includes(property)
				? current.filter((p) => p !== property)
				: [...current, property],
		});
	},
}));
