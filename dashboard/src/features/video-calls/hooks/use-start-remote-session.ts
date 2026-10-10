import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AppointmentStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";

// بدء الجلسة عن بعد: يدفع حالة الزيارة إلى "جاري الدورة" عبر الانتقالات المسموحة
// (مجدول ← تأكيد ← جاري الدورة) قبل فتح شاشة المكالمة
export const useStartRemoteSession = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
			const steps =
				status === AppointmentStatus.SCHEDULED
					? [AppointmentStatus.CHECK_IN, AppointmentStatus.IN_SERVICE]
					: status === AppointmentStatus.CHECK_IN
						? [AppointmentStatus.IN_SERVICE]
						: [];
			for (const next of steps) {
				const res = await api.appointments({ id }).status.patch({ status: next });
				if (res.error) {
					const v = res.error.value as { message?: string } | undefined;
					throw new Error(v?.message ?? "تعذّر بدء الجلسة");
				}
			}
		},
		onSettled: (_data, _err, variables) => {
			void queryClient.invalidateQueries({ queryKey: ["appointments"] });
			void queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
		},
	});

	const startSession = (input: { id: string; status: AppointmentStatus }) => {
		const promise = mutation.mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ بدء الجلسة...",
			success: "بدأت الجلسة",
			error: (err: Error) => err.message || "فشل بدء الجلسة",
		});
		return promise;
	};

	return { startSession, isPending: mutation.isPending };
};
