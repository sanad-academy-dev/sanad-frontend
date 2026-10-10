import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppointmentStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

// إنهاء الجلسة عن بعد: الدفع تم قبل الجلسة، فنتخطى مرحلة "بإنتظار الدفع"
// بالمرور عبرها مباشرة إلى "تمت" (انتقالان متتاليان ضمن آلة الحالات)
export const useEndRemoteSession = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
			const steps =
				status === AppointmentStatus.IN_SERVICE
					? [AppointmentStatus.AWAITING_PAYMENT, AppointmentStatus.DONE]
					: status === AppointmentStatus.AWAITING_PAYMENT
						? [AppointmentStatus.DONE]
						: [];
			for (const next of steps) {
				const res = await api.appointments({ id }).status.patch({ status: next });
				if (res.error) {
					const v = res.error.value as { message?: string } | undefined;
					throw new Error(v?.message ?? "تعذّر إنهاء الجلسة");
				}
			}
		},
		onSettled: (_data, _err, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
		},
	});

	const endSession = (input: { id: string; status: AppointmentStatus }) => {
		const promise = mutation.mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ إنهاء الجلسة...",
			success: "تمت الزيارة بنجاح",
			error: (err: Error) => err.message || "فشل إنهاء الجلسة",
		});
		return promise;
	};

	return { endSession, isPending: mutation.isPending };
};
