import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AdminNote } from "@/features/services/staff/types/jobs.types";

interface JobNotesStore {
	notes: AdminNote[];
	addNote: (note: Pick<AdminNote, "scope" | "text" | "author">) => void;
	deleteNote: (id: string) => void;
}

// ملاحظات المسؤول المكتوبة من سجل النشاط — تُحفظ محليًا (localStorage) لأنه لا يوجد
// نموذج/نقطة نهاية لها في الخلفية بعد، فتبقى بعد إغلاق اللوحة وإعادة التحميل.
export const useJobNotesStore = create<JobNotesStore>()(
	persist(
		(set) => ({
			notes: [],
			addNote: ({ scope, text, author }) =>
				set((state) => ({
					notes: [
						...state.notes,
						{
							id: `${scope}-${Date.now()}`,
							scope,
							text,
							author,
							createdAt: new Date().toISOString(),
						},
					],
				})),
			deleteNote: (id) => set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
		}),
		{ name: "elite-vet-job-notes" },
	),
);
