import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffSchedulingQueryKey } from "@/features/services/staff/hooks/use-staff-scheduling";
import { api } from "@/lib/api";
import type {
	StaffSchedulingResponse,
	StaffSchedulingSettingsResponse,
	UpdateStaffSchedulingSettingsInput,
} from "@/server/staff-scheduling/staff-scheduling.type";

export const useUpdateStaffSchedulingSettings = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffSchedulingQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async (input: UpdateStaffSchedulingSettingsInput) => {
			const res = await api.staff({ id: staffId }).scheduling.settings.patch(input);
			if (res.error) throw new Error("فشل حفظ إعدادات الجدولة");
			return res.data as StaffSchedulingSettingsResponse;
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<StaffSchedulingResponse>(key);
			if (previous) {
				queryClient.setQueryData<StaffSchedulingResponse>(key, {
					...previous,
					settings: { ...previous.settings, ...input },
				});
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
			toast.error(err.message || "فشل حفظ إعدادات الجدولة");
		},
		onSuccess: (data) => {
			const current = queryClient.getQueryData<StaffSchedulingResponse>(key);
			if (current) {
				queryClient.setQueryData<StaffSchedulingResponse>(key, {
					...current,
					settings: data,
				});
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { updateSettings: mutation.mutate, isPending: mutation.isPending };
};
