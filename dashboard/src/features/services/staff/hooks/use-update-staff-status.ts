import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { StaffStatus } from "@/server/staff/staff.type";

export const useUpdateStaffStatus = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: StaffStatus }) => {
			const res = await api.staff({ id }).patch({ status });
			if (res.error) throw new Error("فشل تحديث الحالة");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff"] });
		},
	});

	const updateStatus = async ({ id, status }: { id: string; status: StaffStatus }) =>
		toast.promise(mutation.mutateAsync({ id, status }), {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث الحالة",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});

	return {
		updateStatus,
		isPending: mutation.isPending,
		updatingId: mutation.isPending ? mutation.variables?.id : undefined,
	};
};
