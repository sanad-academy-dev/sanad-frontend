import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ExpenseAttachmentKind } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type { ExpenseDecision, ExpenseResponse } from "@/server/expenses/expenses.type";

// حمولة إنشاء/تحديث المصروف المُرسَلة للخادم
export type ExpensePayload = {
	name: string;
	amount: number;
	requesterId?: string | null;
	paymentMethod?: string | null;
	categoryLabel?: string | null;
	departmentLabel?: string | null;
	branchId?: string | null;
	supplierId?: string | null;
	staffId?: string | null;
	recoverFromPayroll?: boolean;
	notes?: string | null;
	reminderEnabled?: boolean;
	reminderOffset?: string | null;
	attachments?: {
		kind: ExpenseAttachmentKind;
		label: string;
		url: string;
		sizeBytes?: number;
	}[];
};

const errorMessage = (error: unknown, fallback: string): string => {
	const v = (error as { value?: { message?: string } })?.value;
	return v?.message ?? fallback;
};

export const useExpenseMutations = () => {
	const queryClient = useQueryClient();

	const invalidate = () => {
		void queryClient.invalidateQueries({ queryKey: ["expenses"] });
	};

	const createMutation = useMutation({
		mutationFn: async (payload: ExpensePayload) => {
			// biome-ignore lint/suspicious/noExplicitAny: Treaty body typing across nullable unions
			const res = await api.expenses.post(payload as any);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إنشاء المصروف"));
			return res.data as ExpenseResponse;
		},
		onSuccess: invalidate,
	});

	const sendReviewMutation = useMutation({
		mutationFn: async ({
			id,
			recipientIds,
			subject,
			body,
		}: {
			id: string;
			recipientIds?: string[];
			subject?: string;
			body?: string;
		}) => {
			const res = await api.expenses({ id })["send-review"].post({
				recipientIds,
				subject,
				body,
			});
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إرسال الطلب للمراجعة"));
			return res.data as ExpenseResponse;
		},
		onSuccess: invalidate,
	});

	const decideMutation = useMutation({
		mutationFn: async ({
			id,
			stepId,
			decision,
			reason,
			signed,
			signatureName,
		}: {
			id: string;
			stepId: string;
			decision: ExpenseDecision;
			reason?: string;
			signed?: boolean;
			signatureName?: string;
		}) => {
			const res = await api
				.expenses({ id })
				.steps({ stepId })
				.decision.post({ decision, reason, signed, signatureName });
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تنفيذ القرار"));
			return res.data as ExpenseResponse;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, payload }: { id: string; payload: ExpensePayload }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Treaty body typing across nullable unions
			const res = await api.expenses({ id }).patch(payload as any);
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر تعديل المصروف"));
			return res.data as ExpenseResponse;
		},
		onSuccess: invalidate,
	});

	const cancelMutation = useMutation({
		mutationFn: async ({ id, cancelReason }: { id: string; cancelReason: string }) => {
			const res = await api.expenses({ id }).cancel.post({ cancelReason });
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر إلغاء المصروف"));
			return res.data as ExpenseResponse;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await api.expenses({ id }).delete();
			if (res.error) throw new Error(errorMessage(res.error, "تعذّر حذف المصروف"));
			return res.data as ExpenseResponse;
		},
		onSuccess: invalidate,
	});

	const create = (payload: ExpensePayload) => {
		const promise = createMutation.mutateAsync(payload);
		toast.promise(promise, {
			loading: "جارٍ حفظ المصروف...",
			success: "تم حفظ المصروف بنجاح",
			error: (err: Error) => err.message || "فشل حفظ المصروف",
		});
		return promise;
	};

	const sendReview = (args: {
		id: string;
		recipientIds?: string[];
		subject?: string;
		body?: string;
	}) => {
		const promise = sendReviewMutation.mutateAsync(args);
		toast.promise(promise, {
			loading: "جارٍ إرسال الطلب...",
			success: "تم إرسال طلب الصرف بنجاح...",
			error: (err: Error) => err.message || "فشل إرسال الطلب",
		});
		return promise;
	};

	// القرار لا يستخدم toast.promise لأن نجاحه له إشعار مخصّص (اعتماد/رفض) في المكوّن
	const decide = (args: {
		id: string;
		stepId: string;
		decision: ExpenseDecision;
		reason?: string;
		signed?: boolean;
		signatureName?: string;
	}) => decideMutation.mutateAsync(args);

	// تعديل الطلب — قد يُعيد ضبط المسار على الخادم إذا كان قد أُرسل
	const update = (args: { id: string; payload: ExpensePayload }) => {
		const promise = updateMutation.mutateAsync(args);
		toast.promise(promise, {
			loading: "جارٍ حفظ التعديلات...",
			success: "تم تحديث المصروف بنجاح",
			error: (err: Error) => err.message || "فشل تحديث المصروف",
		});
		return promise;
	};

	const cancel = (args: { id: string; cancelReason: string }) => {
		const promise = cancelMutation.mutateAsync(args);
		toast.promise(promise, {
			loading: "جارٍ إلغاء الطلب...",
			success: "تم إلغاء طلب المصروف",
			error: (err: Error) => err.message || "فشل إلغاء الطلب",
		});
		return promise;
	};

	const remove = (id: string) => {
		const promise = deleteMutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ حذف المصروف...",
			success: "تم حذف طلب المصروف",
			error: (err: Error) => err.message || "فشل حذف المصروف",
		});
		return promise;
	};

	return {
		create,
		sendReview,
		decide,
		update,
		cancel,
		remove,
		isCreating: createMutation.isPending,
		isSendingReview: sendReviewMutation.isPending,
		isDeciding: decideMutation.isPending,
		isUpdating: updateMutation.isPending,
		isCanceling: cancelMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
};
