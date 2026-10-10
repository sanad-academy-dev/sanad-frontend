import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffConsultationTypesQueryKey } from "@/features/services/staff/hooks/use-staff-consultation-types";
import { api } from "@/lib/api";
import type { StaffConsultationTypeResponse } from "@/server/staff-consultation-types/staff-consultation-types.type";

type Input = { id: string; isActive: boolean };

export const useToggleStaffConsultationType = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffConsultationTypesQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async ({ id, isActive }: Input) => {
			const res = await api
				.staff({ id: staffId })
				["consultation-types"]({ consultationTypeRowId: id })
				.patch({ isActive });
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل التحديث";
				throw new Error(message);
			}
			return res.data as StaffConsultationTypeResponse;
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<StaffConsultationTypeResponse[]>(key);
			if (previous) {
				queryClient.setQueryData<StaffConsultationTypeResponse[]>(
					key,
					previous.map((row) =>
						row.id === input.id ? { ...row, isActive: input.isActive } : row,
					),
				);
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
			toast.error(err.message || "فشل التحديث");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { toggleConsultationType: mutation.mutate, isPending: mutation.isPending };
};
