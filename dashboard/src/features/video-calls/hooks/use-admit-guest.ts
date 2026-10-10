import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

// قبول/رفض ضيف من قاعة الانتظار — room بالاسم الكامل (مع بادئة الأكاديمية)
export const useAdmitGuest = (room: string) => {
	const admitMutation = useMutation({
		mutationFn: async (identity: string) => {
			const res = await api["video-calls"].admit.post({ room, identity });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر قبول الضيف");
			}
			return res.data;
		},
	});

	const rejectMutation = useMutation({
		mutationFn: async (identity: string) => {
			const res = await api["video-calls"].reject.post({ room, identity });
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر رفض الضيف");
			}
			return res.data;
		},
	});

	const admitGuest = (identity: string) =>
		toast.promise(admitMutation.mutateAsync(identity), {
			loading: "جارٍ قبول الضيف...",
			success: "تم قبول الضيف",
			error: (err: Error) => err.message || "فشل قبول الضيف",
		});

	const rejectGuest = (identity: string) =>
		toast.promise(rejectMutation.mutateAsync(identity), {
			loading: "جارٍ رفض الضيف...",
			success: "تم رفض الضيف",
			error: (err: Error) => err.message || "فشل رفض الضيف",
		});

	return {
		admitGuest,
		rejectGuest,
		isPending: admitMutation.isPending || rejectMutation.isPending,
	};
};
