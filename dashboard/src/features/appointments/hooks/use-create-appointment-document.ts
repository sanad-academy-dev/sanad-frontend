import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateAppointmentDocumentFormInput } from "@/server/appointments/appointments.type";

export const useCreateAppointmentDocument = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (body: CreateAppointmentDocumentFormInput) => {
			const res = await api.appointments({ id: appointmentId }).documents.post(body);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة المستند");
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

	const createDocument = async (input: CreateAppointmentDocumentFormInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة المستند...",
			success: "تم إضافة المستند",
			error: (err: Error) => err.message || "فشل إضافة المستند",
		});

	return { createDocument, isPending: mutation.isPending };
};
