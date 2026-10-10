import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

type DeleteArgs = {
	staffId: string;
	date: string; // yyyy-MM-dd
};

export const useDeleteShift = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ staffId, date }: DeleteArgs) => {
			const res = await api.shifts.delete({}, { query: { staffId, date } });
			if (res.error) throw new Error("فشل حذف المناوبة");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["shifts"] });
		},
	});

	const remove = async (args: DeleteArgs) =>
		toast.promise(mutation.mutateAsync(args), {
			loading: "جارٍ الحذف...",
			success: "تم حذف المناوبة",
			error: (err: Error) => err.message || "فشل الحذف",
		});

	// حذف بلا توست افتراضي — للسماح للمستدعي بعرض توست مخصّص
	const removeAsync = (args: DeleteArgs) => mutation.mutateAsync(args);

	return { remove, removeAsync, isPending: mutation.isPending };
};
