import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	BranchWithManager,
	CreateBranchFormInput,
} from "@/server/branches/branches.type";

export const useCreateBranch = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateBranchFormInput): Promise<BranchWithManager> => {
			const res = await api.branches.post({
				name: input.name,
				// الحقول الاختيارية الفارغة تُرسل null حتى لا تصل سلاسل فارغة لقاعدة البيانات
				branchCode: input.branchCode?.trim() || null,
				icon: input.icon || null,
				type: input.type,
				managerIds: input.managerIds,
				email: input.email,
				city: input.city,
				address: input.address,
				active: input.active,
				enableWarehouse: input.enableWarehouse,
			});
			if (res.error) {
				const message = (res.error.value as { message?: string } | undefined)?.message;
				throw new Error(message || "فشل إنشاء الفرع");
			}
			return res.data as BranchWithManager;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["branches"] });
		},
	});

	const createBranch = (input: CreateBranchFormInput) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ إنشاء الفرع...",
			success: "تم إنشاء الفرع بنجاح",
			error: (err: Error) => err.message || "فشل إنشاء الفرع",
		});
		return p;
	};

	return { createBranch, isPending: mutation.isPending, data: mutation.data };
};
