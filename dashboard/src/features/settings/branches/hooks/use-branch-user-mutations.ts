import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useBranchUserMutations = (branchId: string) => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["branch-users", branchId] });
		queryClient.invalidateQueries({ queryKey: ["branches"] });
	};

	const assignMutation = useMutation({
		mutationFn: async (userId: string) => {
			const res = await api.branches({ id: branchId }).users.post({ userId });
			if (res.error) {
				const message = (res.error.value as { message?: string } | undefined)?.message;
				throw new Error(message || "فشل تعيين الموظف");
			}
			return res.data;
		},
		onSuccess: invalidate,
	});

	const removeMutation = useMutation({
		mutationFn: async (userId: string) => {
			const res = await api.branches({ id: branchId }).users({ userId }).delete();
			if (res.error) {
				const message = (res.error.value as { message?: string } | undefined)?.message;
				throw new Error(message || "فشل إزالة الموظف من الفرع");
			}
			return res.data;
		},
		onSuccess: invalidate,
	});

	const assignUser = (userId: string) => {
		const p = assignMutation.mutateAsync(userId);
		toast.promise(p, {
			loading: "جارٍ تعيين الموظف...",
			success: "تم تعيين الموظف للفرع",
			error: (err: Error) => err.message || "فشل تعيين الموظف",
		});
		return p;
	};

	const removeUser = (userId: string) => {
		const p = removeMutation.mutateAsync(userId);
		toast.promise(p, {
			loading: "جارٍ إزالة الموظف...",
			success: "تمت إزالة الموظف من الفرع",
			error: (err: Error) => err.message || "فشل إزالة الموظف من الفرع",
		});
		return p;
	};

	return {
		assignUser,
		removeUser,
		isPending: assignMutation.isPending || removeMutation.isPending,
	};
};
