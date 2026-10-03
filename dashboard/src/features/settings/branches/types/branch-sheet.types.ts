import type { BranchWithManager } from "@/server/branches/branches.type";

export interface BranchSheetProps {
	branch: BranchWithManager | null;
	open: boolean;
	onClose: () => void;
}
