import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { CompensatorySource } from "@/server/compensatory/compensatory.type";

type CreateArgs = {
	staffId: string;
	minutes: number; // موجب = إضافة، سالب = خصم
	source: CompensatorySource;
	reason?: string;
	date: string; // yyyy-MM-dd
};

// إنشاء قيد رصيد تعويضي (بدون توست — يستدعيه المستدعي ضمن تدفّقه الخاص)
export const useCreateCompensatoryEntry = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateArgs) => {
			const res = await api.compensatory.post(input);
			if (res.error) throw new Error("فشل تسجيل الرصيد التعويضي");
			return res.data;
		},
		onSuccess: () => {
			// تحديث أرصدة الإجازات (تتضمّن الرصيد التعويضي)
			queryClient.invalidateQueries({ queryKey: ["attendance", "leave-balance"] });
		},
	});

	return { createCompensatoryAsync: mutation.mutateAsync, isPending: mutation.isPending };
};
