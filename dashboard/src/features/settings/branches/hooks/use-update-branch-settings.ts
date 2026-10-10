import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { BranchSettings, BranchWithManager } from "@/server/branches/branches.type";

export const useUpdateBranchSettings = (branchId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (settings: BranchSettings): Promise<BranchWithManager> => {
			const res = await api.branches({ id: branchId }).settings.patch(settings);
			if (res.error) throw new Error("فشل حفظ الإعدادات");
			return res.data as BranchWithManager;
		},
		onSuccess: () => {
			// قائمة الفروع (["branches"]) وتفاصيل الفرع (["branches", id]) مفتاحان مختلفان
			queryClient.invalidateQueries({ queryKey: ["branches"] });
			queryClient.invalidateQueries({ queryKey: ["branches", branchId] });
		},
	});

	const updateSettings = (settings: BranchSettings) => {
		const p = mutation.mutateAsync(settings);
		toast.promise(p, {
			loading: "جارٍ حفظ الإعدادات...",
			success: "تم حفظ الإعدادات",
			error: (err: Error) => err.message || "فشل حفظ الإعدادات",
		});
		return p;
	};

	return { updateSettings, isPending: mutation.isPending };
};
