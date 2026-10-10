import { create } from "zustand";
import { persist } from "zustand/middleware";

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type TaskDraftFields = {
	title: string;
	content: string;
	type: string | undefined;
	status: string | undefined;
	priority: string | undefined;
	assigneeIds: string[];
	deadline: string | undefined; // ISO string — Date is not serializable
	emailNotification: boolean;
};

type TaskDraftStore = TaskDraftFields & {
	lastUpdatedAt: number | null;
	setFields: (fields: Partial<TaskDraftFields>) => void;
	reset: () => void;
	hasDraft: () => boolean;
};

const defaults: TaskDraftFields = {
	title: "",
	content: "",
	type: undefined,
	status: undefined,
	priority: undefined,
	assigneeIds: [],
	deadline: undefined,
	emailNotification: false,
};

export const useTaskDraftStore = create<TaskDraftStore>()(
	persist(
		(set, get) => ({
			...defaults,
			lastUpdatedAt: null,
			setFields: (fields) =>
				set((state) => ({ ...state, ...fields, lastUpdatedAt: Date.now() })),
			reset: () => set({ ...defaults, lastUpdatedAt: null }),
			hasDraft: () => {
				const s = get();
				return !!(
					s.title ||
					s.content ||
					s.type ||
					s.priority ||
					s.assigneeIds.length > 0 ||
					s.deadline
				);
			},
		}),
		{
			name: "elite-vet-task-draft",
			merge: (persistedState, currentState) => {
				const persisted = persistedState as Partial<TaskDraftStore> | undefined;
				if (!persisted?.lastUpdatedAt) return currentState;
				if (Date.now() - persisted.lastUpdatedAt > DRAFT_TTL_MS) return currentState;
				return { ...currentState, ...persisted };
			},
		},
	),
);
