import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { BranchWithManager } from "@/server/branches/branches.type";

export const useSetBranchManagers = (branchId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (managerIds: string[]): Promise<BranchWithManager> => {
			const res = await api.branches({ id: branchId }).managers.patch({ managerIds });
			if (res.error) throw new Error("فشل تحديث المسؤولين");
			return res.data as BranchWithManager;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["branches"] });
		},
	});

	const setManagers = (managerIds: string[]) => {
		const p = mutation.mutateAsync(managerIds);
		toast.promise(p, {
			loading: "جارٍ تحديث المسؤولين...",
			success: "تم تحديث المسؤولين",
			error: (err: Error) => err.message || "فشل تحديث المسؤولين",
		});
		return p;
	};

	return { setManagers, isPending: mutation.isPending };
};
