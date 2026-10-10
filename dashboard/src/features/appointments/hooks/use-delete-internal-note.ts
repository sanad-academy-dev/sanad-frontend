import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useDeleteInternalNote = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (noteId: string) => {
			const res = await api
				.appointments({ id: appointmentId })
				["internal-notes"]({ noteId })
				.delete();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حذف الملاحظة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["appointment-internal-notes", appointmentId],
			});
		},
	});

	const deleteNote = async (noteId: string) =>
		toast.promise(mutation.mutateAsync(noteId), {
			loading: "جارٍ حذف الملاحظة...",
			success: "تم حذف الملاحظة",
			error: (err: Error) => err.message || "فشل حذف الملاحظة",
		});

	return { deleteNote, isPending: mutation.isPending };
};
