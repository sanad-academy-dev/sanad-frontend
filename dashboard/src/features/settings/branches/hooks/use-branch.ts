import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { BranchWithManager } from "@/server/branches/branches.type";

export const useBranch = (id: string) => {
	const { data, isLoading } = useQuery<BranchWithManager>({
		queryKey: ["branches", id],
		queryFn: async () => {
			const res = await api.branches({ id }).get();
			if (res.error) throw new Error("فشل جلب الفرع");
			return res.data as BranchWithManager;
		},
		enabled: !!id,
	});
	return { branch: data, isLoading };
};
