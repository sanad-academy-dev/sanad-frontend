import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeleteAppointmentDocument = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (documentId: string) => {
			const res = await api
				.appointments({ id: appointmentId })
				.documents({ documentId })
				.delete();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حذف المستند");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["appointment-documents", appointmentId],
			});
			void queryClient.invalidateQueries({
				queryKey: ["appointment-activity", appointmentId],
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
