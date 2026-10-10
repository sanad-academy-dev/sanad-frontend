import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

// الدفع التجريبي لصفحة /pay — ينقل الزيارة من "مجدول" إلى "تسجيل دخول"
export const useCompletePayment = (room: string) => {
	const mutation = useMutation({
		mutationFn: async () => {
			const res = await api["video-calls"]["complete-payment"].post({ room });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إتمام الدفع");
			}
			return res.data;
		},
	});

	const completePayment = () =>
		toast.promise(mutation.mutateAsync(), {
			loading: "جارٍ تأكيد الدفع...",
			success: "تم الدفع بنجاح",
			error: (err: Error) => err.message || "فشل إتمام الدفع",
		});

	return { completePayment, isPending: mutation.isPending, isSuccess: mutation.isSuccess };
};
