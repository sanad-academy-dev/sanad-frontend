import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDisablePatient = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.patients({ id }).patch({ active: false });
			if (res.error) throw new Error("فشل تعطيل الطفل");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"] });
		},
	});

	const disablePatient = (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ تعطيل الطفل...",
			success: "تم تعطيل الطفل بنجاح",
			error: (err: Error) => err.message || "فشل تعطيل الطفل",
		});

	return { disablePatient, isPending: mutation.isPending };
};
