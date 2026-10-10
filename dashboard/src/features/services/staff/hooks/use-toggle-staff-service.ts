import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffServicesQueryKey } from "@/features/services/staff/hooks/use-staff-services";
import { api } from "@/lib/api";
import type { StaffServiceResponse } from "@/server/staff-services/staff-services.type";

type Input = { id: string; isActive: boolean };

export const useToggleStaffService = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffServicesQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async ({ id, isActive }: Input) => {
			const res = await api
				.staff({ id: staffId })
				.services({ serviceRowId: id })
				.patch({ isActive });
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل التحديث";
				throw new Error(message);
			}
			return res.data as StaffServiceResponse;
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<StaffServiceResponse[]>(key);
			if (previous) {
				queryClient.setQueryData<StaffServiceResponse[]>(
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

	return { toggleService: mutation.mutate, isPending: mutation.isPending };
};
