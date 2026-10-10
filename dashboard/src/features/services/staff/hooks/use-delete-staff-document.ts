import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { StaffDocumentCategory } from "@/server/staff-documents/staff-documents.type";

export const useDeleteStaffDocument = (staffId: string, category: StaffDocumentCategory) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (documentId: string) => {
			const res = await api.staff({ id: staffId }).documents({ documentId }).delete();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حذف المستند");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["staff", staffId, "documents", category],
			});
		},
	});

	const deleteDocument = async (documentId: string) =>
		toast.promise(mutation.mutateAsync(documentId), {
			loading: "جارٍ حذف المستند...",
			success: "تم حذف المستند",
			error: (err: Error) => err.message || "فشل حذف المستند",
		});

	return { deleteDocument, isPending: mutation.isPending };
};
