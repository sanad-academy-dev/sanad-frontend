import { create } from "zustand";

import type {
	ConversationKind,
	MessagesFilter,
	ProfileTab,
} from "@/features/messages/types/messages.type";

interface MessagesStore {
	/** المحادثة المفتوحة حاليًا */
	selectedId: string | null;
	select: (id: string | null) => void;

	/** تصفية القائمة من تبويبات الهيدر */
	filter: MessagesFilter;
	setFilter: (filter: MessagesFilter) => void;

	/** بحث داخل قائمة المحادثات */
	listQuery: string;
	setListQuery: (query: string) => void;

	/** شريط البحث داخل المحادثة المفتوحة */
	chatSearchOpen: boolean;
	chatQuery: string;
	openChatSearch: () => void;
	closeChatSearch: () => void;
	setChatQuery: (query: string) => void;

	/** لوحة بروفايل المحادثة (يسار الشاشة في RTL) */
	profileOpen: boolean;
	profileTab: ProfileTab;
	openProfile: () => void;
	closeProfile: () => void;
	toggleProfile: () => void;
	setProfileTab: (tab: ProfileTab) => void;

	/** نوع المحادثة الجديدة قيد الإنشاء — null يعني اللوحة مغلقة */
	composerKind: ConversationKind | null;
	openComposer: (kind: ConversationKind) => void;
	closeComposer: () => void;
}

export const useMessagesStore = create<MessagesStore>()((set) => ({
	selectedId: null,
	select: (id) => set({ selectedId: id, chatSearchOpen: false, chatQuery: "" }),

	filter: "all",
	setFilter: (filter) => set({ filter }),

	listQuery: "",
	setListQuery: (listQuery) => set({ listQuery }),

	chatSearchOpen: false,
	chatQuery: "",
	openChatSearch: () => set({ chatSearchOpen: true }),
	closeChatSearch: () => set({ chatSearchOpen: false, chatQuery: "" }),
	setChatQuery: (chatQuery) => set({ chatQuery }),

	profileOpen: false,
	profileTab: "visits",
	openProfile: () => set({ profileOpen: true }),
	closeProfile: () => set({ profileOpen: false }),
	toggleProfile: () => set((state) => ({ profileOpen: !state.profileOpen })),
	setProfileTab: (profileTab) => set({ profileTab }),

	composerKind: null,
	openComposer: (composerKind) => set({ composerKind }),
	closeComposer: () => set({ composerKind: null }),
}));
