import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { UpdateStaffInput } from "@/server/staff/staff.type";

export const useUpdateStaff = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateStaffInput }) => {
			const res = await api.staff({ id }).patch(data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل تحديث الموظف";
				throw new Error(msg);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff"] });
		},
	});

	const updateStaff = (id: string, data: UpdateStaffInput) => {
		const promise = mutateAsync({ id, data });
		toast.promise(promise, {
			loading: "جارٍ تحديث الموظف...",
			success: "تم تحديث الموظف بنجاح",
			error: (err: Error) => err.message || "فشل تحديث الموظف",
		});
		return promise;
	};

	return { updateStaff, isPending };
};
