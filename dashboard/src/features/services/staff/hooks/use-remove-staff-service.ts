import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffServicesQueryKey } from "@/features/services/staff/hooks/use-staff-services";
import { api } from "@/lib/api";
import type { StaffServiceResponse } from "@/server/staff-services/staff-services.type";

export const useRemoveStaffService = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffServicesQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.staff({ id: staffId }).services({ serviceRowId: id }).delete();
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل حذف الدورة";
				throw new Error(message);
			}
			return id;
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<StaffServiceResponse[]>(key);
			if (previous) {
				queryClient.setQueryData<StaffServiceResponse[]>(
					key,
					previous.filter((row) => row.id !== id),
				);
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
			toast.error(err.message || "فشل حذف الدورة");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { removeService: mutation.mutate, isPending: mutation.isPending };
};
