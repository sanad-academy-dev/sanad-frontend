import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { staffSchedulingQueryKey } from "@/features/services/staff/hooks/use-staff-scheduling";
import type { Weekday } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	StaffSchedulingResponse,
	StaffWorkingHourResponse,
	UpdateStaffWorkingHourInput,
} from "@/server/staff-scheduling/staff-scheduling.type";

type UpdateInput = { weekday: Weekday } & UpdateStaffWorkingHourInput;

export const useUpdateStaffWorkingHour = (staffId: string) => {
	const queryClient = useQueryClient();
	const key = staffSchedulingQueryKey(staffId);

	const mutation = useMutation({
		mutationFn: async ({ weekday, ...body }: UpdateInput) => {
			const res = await api
				.staff({ id: staffId })
				.scheduling["working-hours"]({ weekday })
				.patch(body);
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ??
					"فشل حفظ ساعات العمل";
				throw new Error(message);
			}
			return res.data as StaffWorkingHourResponse;
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: key });
			const previous = queryClient.getQueryData<StaffSchedulingResponse>(key);
			if (previous) {
				queryClient.setQueryData<StaffSchedulingResponse>(key, {
					...previous,
					workingHours: previous.workingHours.map((row) =>
						row.weekday === input.weekday ? { ...row, ...input } : row,
					),
				});
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(key, ctx.previous);
			toast.error(err.message || "فشل حفظ ساعات العمل");
		},
		onSuccess: (data) => {
			const current = queryClient.getQueryData<StaffSchedulingResponse>(key);
			if (current) {
				queryClient.setQueryData<StaffSchedulingResponse>(key, {
					...current,
					workingHours: current.workingHours.map((row) =>
						row.weekday === data.weekday ? data : row,
					),
				});
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: key });
		},
	});

	return { updateWorkingHour: mutation.mutate, isPending: mutation.isPending };
};
