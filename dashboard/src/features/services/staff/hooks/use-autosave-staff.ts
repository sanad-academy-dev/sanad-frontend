import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { StaffResponse, UpdateStaffInput } from "@/server/staff/staff.type";

export const useAutosaveStaff = (staffId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: UpdateStaffInput) => {
			const res = await api.staff({ id: staffId }).patch(data);
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ?? "فشل الحفظ";
				throw new Error(message);
			}
			return res.data as StaffResponse;
		},
		onMutate: async (input) => {
			await queryClient.cancelQueries({ queryKey: ["staff"] });
			const previous = queryClient.getQueryData<StaffResponse[]>(["staff"]);
			if (previous) {
				// hireDate يُرسل نصًا بينما الاستجابة تحمله كـ Date — يُفصل ويُحوَّل
				const { hireDate, ...rest } = input;
				const patch = {
					...rest,
					...(hireDate !== undefined
						? { hireDate: hireDate ? new Date(hireDate) : null }
						: {}),
				};
				queryClient.setQueryData<StaffResponse[]>(
					["staff"],
					previous.map((row) => (row.id === staffId ? { ...row, ...patch } : row)),
				);
			}
			return { previous };
		},
		onError: (err: Error, _input, ctx) => {
			if (ctx?.previous) queryClient.setQueryData(["staff"], ctx.previous);
			toast.error(err.message || "فشل الحفظ");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["staff"] });
		},
	});

	return { autosave: mutation.mutate, isPending: mutation.isPending };
};
