import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useCreateInternalNote = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: { body: string; mentionedStaffIds?: string[] }) => {
			const res = await api.appointments({ id: appointmentId })["internal-notes"].post(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة الملاحظة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["appointment-internal-notes", appointmentId],
			});
		},
	});

	const createNote = async (input: { body: string; mentionedStaffIds?: string[] }) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة الملاحظة...",
			success: "تم إضافة الملاحظة",
			error: (err: Error) => err.message || "فشل إضافة الملاحظة",
		});

	return { createNote, isPending: mutation.isPending };
};
