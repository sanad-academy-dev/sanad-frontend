import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { RepeatUnit } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

export const useEditRecurrence = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			groupId,
			repeatUnit,
			repeatCount,
		}: {
			groupId: string;
			repeatUnit: RepeatUnit;
			repeatCount: number;
		}) => {
			const res = await api.appointments.recurring({ groupId })["repeat-unit"].patch({
				repeatUnit,
				repeatCount,
			});
			if (res.error) {
				const data = res.error.value as { message?: string } | undefined;
				throw new Error(data?.message ?? "تعذّر تحديث التكرار");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
		},
	});

	const editRecurrence = async (input: {
		groupId: string;
		repeatUnit: RepeatUnit;
		repeatCount: number;
	}) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تحديث التكرار...",
			success: "تم تحديث التكرار لجميع الزيارات",
			error: (err: Error) => err.message || "فشل تحديث التكرار",
		});

	return { editRecurrence, isPending: mutation.isPending };
};
