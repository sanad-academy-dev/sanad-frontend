import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

type Input = {
	staffId: string;
	comment?: string;
};

export const useReferAppointment = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api.appointments({ id: appointmentId }).refer.patch({
				staffId: input.staffId,
				comment: input.comment,
			});
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إحالة الزيارة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
			void queryClient.invalidateQueries({
				queryKey: ["appointment-activity", appointmentId],
			});
		},
	});

	const referAppointment = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إحالة الزيارة...",
			success: "تمت إحالة الزيارة",
			error: (err: Error) => err.message || "فشل إحالة الزيارة",
		});

	return { referAppointment, isPending: mutation.isPending };
};
