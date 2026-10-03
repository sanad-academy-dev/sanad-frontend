import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useUpdateInternalNote = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ noteId, body }: { noteId: string; body: string }) => {
			const res = await api
				.appointments({ id: appointmentId })
				["internal-notes"]({ noteId })
				.patch({ body });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تحديث الملاحظة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["appointment-internal-notes", appointmentId],
			});
		},
	});

	const updateNote = async (input: { noteId: string; body: string }) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تحديث الملاحظة...",
			success: "تم تحديث الملاحظة",
			error: (err: Error) => err.message || "فشل تحديث الملاحظة",
		});

	return { updateNote, isPending: mutation.isPending };
};
