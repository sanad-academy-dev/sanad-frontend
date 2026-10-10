import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeleteClinicDocument = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api["clinic-documents"]({ id }).delete();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حذف المستند");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinic-documents"] });
		},
	});

	const deleteDocument = async (id: string) =>
		toast.promise(mutation.mutateAsync(id), {
			loading: "جارٍ حذف المستند...",
			success: "تم حذف المستند",
			error: (err: Error) => err.message || "فشل حذف المستند",
		});

	return { deleteDocument, isPending: mutation.isPending };
};
