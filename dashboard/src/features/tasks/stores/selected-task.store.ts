import { create } from "zustand";

import type { TaskCardData } from "@/features/tasks/types/task.types";

interface SelectedTaskStore {
	selected: TaskCardData | null;
	select: (card: TaskCardData | null) => void;
	close: () => void;
}

export const useSelectedTaskStore = create<SelectedTaskStore>()((set) => ({
	selected: null,
	select: (card) => set({ selected: card }),
	close: () => set({ selected: null }),
}));
