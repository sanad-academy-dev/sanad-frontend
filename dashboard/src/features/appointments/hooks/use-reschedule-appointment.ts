import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

type Input = {
	startsAt: Date;
	comment?: string;
};

export const useRescheduleAppointment = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api.appointments({ id: appointmentId }).reschedule.patch({
				startsAt: input.startsAt.toISOString(),
				comment: input.comment,
			});
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إعادة الجدولة");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({
				queryKey: ["appointment-activity", appointmentId],
			});
		},
	});

	const reschedule = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إعادة الجدولة...",
			success: "تمت إعادة الجدولة",
			error: (err: Error) => err.message || "فشل إعادة الجدولة",
		});

	return { reschedule, isPending: mutation.isPending };
};
