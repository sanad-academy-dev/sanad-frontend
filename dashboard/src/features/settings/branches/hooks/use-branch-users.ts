import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BranchUserWithDetails } from "@/server/branches/branches.type";

const EMPTY_BRANCH_USERS: BranchUserWithDetails[] = [];

export const useBranchUsers = (branchId: string) => {
	const { data, isLoading } = useQuery<BranchUserWithDetails[]>({
		queryKey: ["branch-users", branchId],
		queryFn: async () => {
			const res = await api.branches({ id: branchId }).users.get();
			if (res.error) throw new Error("فشل جلب أعضاء الفرع");
			return res.data as BranchUserWithDetails[];
		},
		enabled: !!branchId,
	});
	return { branchUsers: data ?? EMPTY_BRANCH_USERS, isLoading };
};
