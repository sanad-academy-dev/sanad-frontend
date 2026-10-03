import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { AppointmentLocation } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

export const useUpdateAppointmentLocation = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (location: AppointmentLocation) => {
			const res = await api.appointments({ id: appointmentId }).location.patch({ location });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تحديث مكان الزيارة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
		},
	});

	const updateLocation = async (location: AppointmentLocation) =>
		toast.promise(mutation.mutateAsync(location), {
			loading: "جارٍ تحديث مكان الزيارة...",
			success: "تم تحديث مكان الزيارة",
			error: (err: Error) => err.message || "فشل تحديث مكان الزيارة",
		});

	return { updateLocation, isPending: mutation.isPending };
};
