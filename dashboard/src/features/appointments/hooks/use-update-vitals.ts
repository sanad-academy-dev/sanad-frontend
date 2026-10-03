import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { VitalsFormInput } from "@/server/clinical-exams/clinical-exams.type";

type Input = VitalsFormInput & { currentStep?: number };

export const useUpdateVitals = (appointmentId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api
				.appointments({ id: appointmentId })
				["clinical-exam"].vitals.patch(input);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر حفظ العلامات الحيوية");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinical-exam", appointmentId] });
		},
	});

	const updateVitals = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ العلامات الحيوية",
			error: (err: Error) => err.message || "فشل الحفظ",
		});

	return { updateVitals, isPending: mutation.isPending };
};
