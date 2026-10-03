import type { BranchWithManager } from "@/server/branches/branches.type";

export interface ManagerAvatarProps {
	name: string;
}

export interface BranchStatusCellProps {
	branch: BranchWithManager;
}
