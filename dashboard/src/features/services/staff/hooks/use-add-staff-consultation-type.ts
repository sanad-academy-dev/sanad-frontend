import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffConsultationTypesQueryKey } from "@/features/services/staff/hooks/use-staff-consultation-types";
import { api } from "@/lib/api";
import type { StaffConsultationTypeResponse } from "@/server/staff-consultation-types/staff-consultation-types.type";

export const useAddStaffConsultationType = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffConsultationTypesQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async (consultationTypeId: string) => {
			const res = await api
				.staff({ id: staffId })
				["consultation-types"].post({ consultationTypeId });
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل إضافة الكشف";
				throw new Error(message);
			}
			return res.data as StaffConsultationTypeResponse;
		},
		onSuccess: (added) => {
			const current = queryClient.getQueryData<StaffConsultationTypeResponse[]>(key) ?? [];
			queryClient.setQueryData<StaffConsultationTypeResponse[]>(key, [...current, added]);
		},
		onError: (err: Error) => {
			toast.error(err.message || "فشل إضافة الكشف");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { addConsultationType: mutation.mutate, isPending: mutation.isPending };
};
