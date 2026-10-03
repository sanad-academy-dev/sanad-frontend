import { create } from "zustand";

import type { AnnouncementCardData } from "@/features/services/staff/components/announcements/announcement-card";

interface AnnouncementsStore {
	announcements: AnnouncementCardData[];
	addAnnouncement: (announcement: AnnouncementCardData) => void;
	deleteAnnouncement: (id: string) => void;
	// إعادة إعلان محذوف إلى موضعه الأصلي (لدعم "تراجع")
	restoreAnnouncement: (announcement: AnnouncementCardData, index: number) => void;
}

// متجر مشترك للإعلانات — يقرأ منه تبويب "الإعلان" وتبويب إعلانات الموظف معًا،
// فيظهر كل إعلان جديد تلقائيًا في بروفايل الموظفين المستلمين.
export const useAnnouncementsStore = create<AnnouncementsStore>()((set) => ({
	announcements: [],
	addAnnouncement: (announcement) =>
		set((state) => ({ announcements: [announcement, ...state.announcements] })),
	deleteAnnouncement: (id) =>
		set((state) => ({
			announcements: state.announcements.filter((a) => a.id !== id),
		})),
	restoreAnnouncement: (announcement, index) =>
		set((state) => {
			const next = [...state.announcements];
			next.splice(index, 0, announcement);
			return { announcements: next };
		}),
}));
