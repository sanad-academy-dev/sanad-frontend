import { create } from "zustand";
import type { BranchWithManager } from "@/server/branches/branches.type";

interface BranchesStore {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	selectedBranch: BranchWithManager | null;
	setSelectedBranch: (branch: BranchWithManager | null) => void;
}

export const useBranchesStore = create<BranchesStore>()((set) => ({
	isOpen: false,
	setIsOpen: (isOpen) => set({ isOpen }),
	selectedBranch: null,
	setSelectedBranch: (branch) => set({ selectedBranch: branch }),
}));
