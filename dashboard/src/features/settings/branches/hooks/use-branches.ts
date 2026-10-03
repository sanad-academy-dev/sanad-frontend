import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BranchWithManager } from "@/server/branches/branches.type";

const EMPTY_BRANCHES: BranchWithManager[] = [];

export const useBranches = () => {
	const { data, isLoading } = useQuery<BranchWithManager[]>({
		queryKey: ["branches"],
		queryFn: async () => {
			const res = await api.branches.get();
			if (res.error) throw new Error("فشل جلب الفروع");
			return res.data as BranchWithManager[];
		},
	});
	return { branches: data ?? EMPTY_BRANCHES, isLoading };
};
