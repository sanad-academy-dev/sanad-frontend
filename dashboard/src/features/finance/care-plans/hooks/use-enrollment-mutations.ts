import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CarePlanEnrollmentResponse,
	EnrollCarePlanInput,
} from "@/server/care-plans/care-plans.type";

const errorMessage = (error: unknown, fallback: string): string => {
	const v = (error as { value?: { message?: string } })?.value;
	return v?.message ?? fallback;
};

export const useEnrollmentMutations = () => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: ["care-plan-enrollments"] });
		void queryClient.invalidateQueries({ queryKey: ["care-plans"] });
		// التعيين قد يُنشئ جلسات مجدولة — حدّث قوائم/تقويم الجلسات
		void queryClient.invalidateQueries({ queryKey: ["appointments"] });
	};

	const enrollMutation = useMutation({
		mutationFn: async ({
			carePlanId,
			payload,
		}: {
			carePlanId: string;
			payload: EnrollCarePlanInput;
		}) => {
			const res = await api["care-plans"]({ id: carePlanId }).enroll.post(payload);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر الاشتراك في الخطة"));
			return res.data as CarePlanEnrollmentResponse;
		},
		onSuccess: invalidate,
	});

	const cancelMutation = useMutation({
		mutationFn: async (enrollmentId: string) => {
			const res = await api["care-plans"].enrollments({ id: enrollmentId }).cancel.post();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إلغاء الاشتراك"));
			return res.data as CarePlanEnrollmentResponse;
		},
		onSuccess: invalidate,
	});

	const enroll = (carePlanId: string, payload: EnrollCarePlanInput) => {
		const promise = enrollMutation.mutateAsync({ carePlanId, payload });
		toast.promise(promise, {
			loading: "جارٍ الاشتراك في الخطة...",
			success: "تم الاشتراك بنجاح",
			error: (err: Error) => err.message || "فشل الاشتراك",
		});
		return promise;
	};

	const cancel = (enrollmentId: string) => {
		const promise = cancelMutation.mutateAsync(enrollmentId);
		toast.promise(promise, {
			loading: "جارٍ إلغاء الاشتراك...",
			success: "تم إلغاء الاشتراك",
			error: (err: Error) => err.message || "فشل إلغاء الاشتراك",
		});
		return promise;
	};

	return {
		enroll,
		cancel,
		isEnrolling: enrollMutation.isPending,
		isCancelling: cancelMutation.isPending,
	};
};
