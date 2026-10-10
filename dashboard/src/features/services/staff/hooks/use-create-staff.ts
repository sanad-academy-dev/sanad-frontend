import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateStaffFormInput } from "@/server/staff/staff.type";

export const useCreateStaff = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateStaffFormInput) => {
			const res = await api.staff.post(data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة الموظف";
				throw new Error(msg);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff"] });
		},
	});

	const createStaff = (data: CreateStaffFormInput) => {
		const promise = mutateAsync(data);
		toast.promise(promise, {
			loading: "جارٍ إضافة الموظف...",
			success: "تمت إضافة الموظف بنجاح",
			error: (err: Error) => err.message || "فشل إضافة الموظف",
		});
		return promise;
	};

	return { createStaff, isPending };
};
