import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useCreateAppointmentComment = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (body: string) => {
			const res = await api.appointments({ id: appointmentId }).comments.post({ body });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة التعليق");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: ["appointment-activity", appointmentId],
			});
		},
	});

	const addComment = async (body: string) =>
		toast.promise(mutation.mutateAsync(body), {
			loading: "جارٍ إضافة التعليق...",
			success: "تم إضافة التعليق",
			error: (err: Error) => err.message || "فشل إضافة التعليق",
		});

	return { addComment, isPending: mutation.isPending };
};
