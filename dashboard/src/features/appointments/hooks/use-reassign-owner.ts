import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

type Input = {
	ownerId: string;
	comment?: string;
};

export const useReassignOwner = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api.appointments({ id: appointmentId })["reassign-owner"].patch({
				ownerId: input.ownerId,
				comment: input.comment,
			});
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إحالة الطفل");
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

	const reassignOwner = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إحالة الطفل...",
			success: "تمت إحالة الطفل",
			error: (err: Error) => err.message || "فشل إحالة الطفل",
		});

	return { reassignOwner, isPending: mutation.isPending };
};
