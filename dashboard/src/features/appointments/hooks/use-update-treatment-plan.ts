import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { TreatmentPlanFormInput } from "@/server/clinical-exams/clinical-exams.type";

type Input = TreatmentPlanFormInput & { currentStep?: number; complete?: boolean };

export const useUpdateTreatmentPlan = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api
				.appointments({ id: appointmentId })
				["clinical-exam"]["treatment-plan"].patch(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حفظ خطة العلاج");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinical-exam", appointmentId] });
			// إتمام الفحص يفتح زر "إنهاء الزيارة" الذي يقرأ clinicalExam.completedAt من الموعد
			void queryClient.invalidateQueries({ queryKey: ["appointment", appointmentId] });
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
		},
	});

	const updateTreatmentPlan = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: input.complete ? "تم إتمام الفحص السريري" : "تم حفظ خطة العلاج",
			error: (err: Error) => err.message || "فشل الحفظ",
		});

	return { updateTreatmentPlan, isPending: mutation.isPending };
};
