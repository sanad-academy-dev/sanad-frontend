import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { DiagnosisFormInput } from "@/server/clinical-exams/clinical-exams.type";

type Input = DiagnosisFormInput & { currentStep?: number };

export const useUpdateDiagnosis = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api
				.appointments({ id: appointmentId })
				["clinical-exam"].diagnosis.patch(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حفظ التشخيص");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinical-exam", appointmentId] });
		},
	});

	const updateDiagnosis = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ التشخيص",
			error: (err: Error) => err.message || "فشل الحفظ",
		});

	return { updateDiagnosis, isPending: mutation.isPending };
};
