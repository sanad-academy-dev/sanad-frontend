import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { UpdateOwnerInput } from "@/server/owners/owners.type";

export const useUpdateOwner = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: UpdateOwnerInput }) => {
			const res = await api.owners({ id }).patch(data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message ?? "فشل تحديث وليّ الأمر";
				throw new Error(msg);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["owners"] });
		},
	});

	const updateOwner = (id: string, data: UpdateOwnerInput) =>
		toast.promise(mutation.mutateAsync({ id, data }), {
			loading: "جارٍ تحديث بيانات وليّ الأمر...",
			success: "تم تحديث بيانات وليّ الأمر",
			error: (err: Error) => err.message || "فشل تحديث وليّ الأمر",
		});

	return { updateOwner, isPending: mutation.isPending };
};
