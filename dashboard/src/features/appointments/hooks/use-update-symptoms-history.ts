import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { SymptomsHistoryPartialInput } from "@/server/clinical-exams/clinical-exams.type";

type Input = SymptomsHistoryPartialInput & { currentStep?: number };

export const useUpdateSymptomsHistory = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api
				.appointments({ id: appointmentId })
				["clinical-exam"]["symptoms-history"].patch(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حفظ الأعراض والتاريخ");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinical-exam", appointmentId] });
		},
	});

	const updateSymptomsHistory = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ الأعراض والتاريخ",
			error: (err: Error) => err.message || "فشل الحفظ",
		});

	return { updateSymptomsHistory, isPending: mutation.isPending };
};
