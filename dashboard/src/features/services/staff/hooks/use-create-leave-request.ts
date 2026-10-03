import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateLeaveRequestFormInput } from "@/server/leave-requests/leave-requests.type";

export const useCreateLeaveRequest = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CreateLeaveRequestFormInput) => {
			const res = await api["leave-requests"].post(input);
			if (res.error) throw new Error("فشل إنشاء طلب الإجازة");
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
		},
	});

	const createLeaveRequest = (input: CreateLeaveRequestFormInput) => {
		const promise = mutation.mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ إنشاء الطلب...",
			success: "تم إنشاء طلب الإجازة",
			error: (err: Error) => err.message || "فشل إنشاء الطلب",
			position: "bottom-left",
		});
		return promise;
	};

	// نسخة بدون توست — للاستخدام داخل عمليات مجمّعة (إنشاء طلبات لعدة موظفين)
	const createLeaveRequestAsync = (input: CreateLeaveRequestFormInput) =>
		mutation.mutateAsync(input);

	return { createLeaveRequest, createLeaveRequestAsync, isPending: mutation.isPending };
};
