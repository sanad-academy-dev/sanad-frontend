import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	BranchWithManager,
	UpdateBranchFormInput,
} from "@/server/branches/branches.type";

export const useUpdateBranch = (branchId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Partial<UpdateBranchFormInput>): Promise<BranchWithManager> => {
			const res = await api.branches({ id: branchId }).patch(input);
			if (res.error) throw new Error("فشل تحديث الفرع");
			return res.data as BranchWithManager;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["branches"] });
		},
	});

	const updateBranch = async (input: Partial<UpdateBranchFormInput>) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ التغييرات...",
			success: "تم الحفظ",
			error: (err: Error) => err.message || "فشل تحديث الفرع",
		});

	return { updateBranch, isPending: mutation.isPending };
};
