import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDisableOwner = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, newOwnerId }: { id: string; newOwnerId?: string }) => {
			const res = await api.owners({ id }).disable.post({ newOwnerId });
			if (res.error) throw new Error("فشل تعطيل وليّ الأمر");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["owners"] });
		},
	});

	const disableOwner = (id: string, newOwnerId?: string) =>
		toast.promise(mutation.mutateAsync({ id, newOwnerId }), {
			loading: "جارٍ تعطيل وليّ الأمر...",
			success: "تم تعطيل وليّ الأمر بنجاح",
			error: (err: Error) => err.message || "فشل تعطيل وليّ الأمر",
		});

	return { disableOwner, isPending: mutation.isPending };
};
