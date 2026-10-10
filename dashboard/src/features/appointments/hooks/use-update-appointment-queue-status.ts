import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { QueueStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

export const useUpdateAppointmentQueueStatus = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			queueStatus,
		}: {
			id: string;
			queueStatus: QueueStatus | null;
		}) => {
			const res = await api.appointments({ id })["queue-status"].patch({ queueStatus });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تحديث الحالة");
			}
			return res.data;
		},
		onSuccess: (_data, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({
				queryKey: ["appointment-activity", variables.id],
			});
		},
	});

	const updateQueueStatus = async (input: { id: string; queueStatus: QueueStatus | null }) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تحديث الحالة...",
			success: "تم تحديث الحالة",
			error: (err: Error) => err.message || "فشل تحديث الحالة",
		});

	return { updateQueueStatus, isPending: mutation.isPending };
};
