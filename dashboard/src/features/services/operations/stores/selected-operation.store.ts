import { create } from "zustand";

export type OperationSheetTab = "details" | "comments" | "billing";

interface SelectedOperationStore {
	selectedCaseId: string | null;
	tab: OperationSheetTab;
	/** لوحة سير العمل الجانبية — نظيرة لوحة الفحص المفرد في الأشعة */
	workOpen: boolean;
	openCase: (caseId: string, tab?: OperationSheetTab) => void;
	openWork: (caseId: string) => void;
	setWorkOpen: (open: boolean) => void;
	setTab: (tab: OperationSheetTab) => void;
	close: () => void;
}

export const useSelectedOperationStore = create<SelectedOperationStore>()((set) => ({
	selectedCaseId: null,
	tab: "details",
	workOpen: false,
	openCase: (caseId, tab) =>
		set({ selectedCaseId: caseId, tab: tab ?? "details", workOpen: false }),
	openWork: (caseId) => set({ selectedCaseId: caseId, tab: "details", workOpen: true }),
	setWorkOpen: (open) => set({ workOpen: open }),
	setTab: (tab) => set({ tab }),
	close: () => set({ selectedCaseId: null, workOpen: false }),
}));
