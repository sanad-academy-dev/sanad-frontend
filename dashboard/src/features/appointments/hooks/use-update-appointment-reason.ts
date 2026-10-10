import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useUpdateAppointmentReason = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (reason: string | null) => {
			const res = await api.appointments({ id: appointmentId }).reason.patch({ reason });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تحديث سبب الزيارة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
		},
	});

	const updateReason = async (reason: string | null) =>
		toast.promise(mutation.mutateAsync(reason), {
			loading: "جارٍ حفظ السبب...",
			success: "تم حفظ سبب الزيارة",
			error: (err: Error) => err.message || "فشل حفظ السبب",
		});

	return { updateReason, isPending: mutation.isPending };
};
