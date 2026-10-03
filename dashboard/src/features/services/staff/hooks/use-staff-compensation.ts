import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	StaffCompensationFormValues,
	StaffCompensationResponse,
} from "@/server/staff-compensation/staff-compensation.type";

export const staffCompensationKey = (staffId: string) => ["staff-compensation", staffId];

export const useStaffCompensation = (staffId: string) => {
	const { data, isLoading } = useQuery<StaffCompensationResponse | null>({
		queryKey: staffCompensationKey(staffId),
		enabled: !!staffId,
		queryFn: async () => {
			const res = await api.staff({ id: staffId }).compensation.get();
			if (res.error) throw new Error("فشل تحميل بيانات التعويضات");
			return res.data;
		},
	});

	return { compensation: data ?? null, isLoading };
};

export const useSaveStaffCompensation = (staffId: string) => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: StaffCompensationFormValues) => {
			const res = await api.staff({ id: staffId }).compensation.put({
				...input,
				iban: input.iban || null,
				bankName: input.bankName || null,
				effectiveFrom: input.effectiveFrom || null,
				notes: input.notes || null,
				allowances: input.allowances.map((a) => ({ ...a, note: a.note || null })),
			});
			if (res.error) {
				const message =
					(res.error.value as { message?: string } | undefined)?.message ??
					"فشل حفظ بيانات التعويضات";
				throw new Error(message);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: staffCompensationKey(staffId) });
		},
	});

	const saveCompensation = (input: StaffCompensationFormValues) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ حفظ بيانات التعويضات...",
			success: "تم حفظ بيانات التعويضات بنجاح",
			error: (err: Error) => err.message || "فشل حفظ بيانات التعويضات",
		});
		return promise;
	};

	return { saveCompensation, isPending };
};
