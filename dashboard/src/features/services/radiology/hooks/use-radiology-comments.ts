import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

// تعليقات طلب الأشعة — تُحمّل مع الطلب نفسه، فالكتابة والحذف يُبطّلان الطلب.

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const useInvalidateOrder = () => {
	const queryClient = useQueryClient();
	return (id?: string) => {
		void queryClient.invalidateQueries({ queryKey: ["radiology"] });
		if (id) void queryClient.invalidateQueries({ queryKey: ["radiology-order", id] });
	};
};

export const useAddRadiologyComment = () => {
	const invalidate = useInvalidateOrder();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			body,
			mentionedStaffIds,
		}: {
			id: string;
			body: string;
			mentionedStaffIds?: string[];
		}) => {
			const res = await api.radiology({ id }).comments.post({
				body,
				mentionedStaffIds: mentionedStaffIds ?? [],
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر إضافة التعليق"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.id),
	});

	const addComment = (input: { id: string; body: string; mentionedStaffIds?: string[] }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الإضافة...",
			success: "أُضيف التعليق",
			error: (err: Error) => err.message || "فشل إضافة التعليق",
		});
		return p;
	};

	return { addComment, isPending: mutation.isPending };
};

export const useDeleteRadiologyComment = () => {
	const invalidate = useInvalidateOrder();

	const mutation = useMutation({
		mutationFn: async ({ commentId }: { commentId: string; orderId: string }) => {
			const res = await api.radiology.comments({ commentId }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف التعليق"));
			return res.data;
		},
		onSuccess: (_d, v) => invalidate(v.orderId),
	});

	const deleteComment = (input: { commentId: string; orderId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحذف...",
			success: "حُذف التعليق",
			error: (err: Error) => err.message || "فشل حذف التعليق",
		});
		return p;
	};

	return { deleteComment, isPending: mutation.isPending };
};
