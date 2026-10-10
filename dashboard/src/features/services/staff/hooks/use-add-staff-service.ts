import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffServicesQueryKey } from "@/features/services/staff/hooks/use-staff-services";
import { api } from "@/lib/api";
import type { StaffServiceResponse } from "@/server/staff-services/staff-services.type";

export const useAddStaffService = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffServicesQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async (serviceId: string) => {
			const res = await api.staff({ id: staffId }).services.post({ serviceId });
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل إضافة الدورة";
				throw new Error(message);
			}
			return res.data as StaffServiceResponse;
		},
		onSuccess: (added) => {
			const current = queryClient.getQueryData<StaffServiceResponse[]>(key) ?? [];
			queryClient.setQueryData<StaffServiceResponse[]>(key, [...current, added]);
		},
		onError: (err: Error) => {
			toast.error(err.message || "فشل إضافة الدورة");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { addService: mutation.mutate, isPending: mutation.isPending };
};
