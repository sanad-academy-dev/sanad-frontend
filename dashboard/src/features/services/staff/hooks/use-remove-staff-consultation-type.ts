import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffConsultationTypesQueryKey } from "@/features/services/staff/hooks/use-staff-consultation-types";
import { api } from "@/lib/api";
import type { StaffConsultationTypeResponse } from "@/server/staff-consultation-types/staff-consultation-types.type";

export const useRemoveStaffConsultationType = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffConsultationTypesQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api
				.staff({ id: staffId })
				["consultation-types"]({ consultationTypeRowId: id })
				.delete();
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل حذف الكشف";
				throw new Error(message);
			}
			return id;
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<StaffConsultationTypeResponse[]>(key);
			if (previous) {
				queryClient.setQueryData<StaffConsultationTypeResponse[]>(
					key,
					previous.filter((row) => row.id !== id),
				);
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
			toast.error(err.message || "فشل حذف الكشف");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { removeConsultationType: mutation.mutate, isPending: mutation.isPending };
};
