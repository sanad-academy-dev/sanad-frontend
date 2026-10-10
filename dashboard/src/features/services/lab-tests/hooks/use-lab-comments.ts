import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

// تعليقات الطلب الداخلية — تُعيد وعد الطفرة نفسه (لا نتيجة toast.promise) ليعمل الانتظار

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

const useInvalidate = () => {
	const queryClient = useQueryClient();
	return (id?: string) => {
		void queryClient.invalidateQueries({ queryKey: ["lab-tests"] });
		if (id) void queryClient.invalidateQueries({ queryKey: ["lab-test", id] });
	};
};

export const useAddLabComment = () => {
	const invalidate = useInvalidate();

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
			const res = await api["lab-tests"]({ id }).comments.post({
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
			loading: "جارٍ إضافة التعليق...",
			success: "تمت إضافة التعليق",
			error: (err: Error) => err.message || "فشل إضافة التعليق",
		});
		return p;
	};

	return { addComment, isPending: mutation.isPending };
};

export const useUpdateLabComment = () => {
	const invalidate = useInvalidate();

	const mutation = useMutation({
		mutationFn: async ({
			commentId,
			body,
			mentionedStaffIds,
		}: {
			commentId: string;
			body: string;
			mentionedStaffIds?: string[];
		}) => {
			const res = await api["lab-tests"].comments({ commentId }).patch({
				body,
				mentionedStaffIds: mentionedStaffIds ?? [],
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر تعديل التعليق"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const updateComment = (input: {
		commentId: string;
		body: string;
		mentionedStaffIds?: string[];
	}) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ حفظ التعديل...",
			success: "تم تعديل التعليق",
			error: (err: Error) => err.message || "فشل تعديل التعليق",
		});
		return p;
	};

	return { updateComment, isPending: mutation.isPending };
};

export const useDeleteLabComment = () => {
	const invalidate = useInvalidate();

	const mutation = useMutation({
		mutationFn: async ({ commentId }: { commentId: string }) => {
			const res = await api["lab-tests"].comments({ commentId }).delete();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حذف التعليق"));
			return res.data;
		},
		onSuccess: (d) => invalidate(d?.id),
	});

	const deleteComment = (input: { commentId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ حذف التعليق...",
			success: "تم حذف التعليق",
			error: (err: Error) => err.message || "فشل حذف التعليق",
		});
		return p;
	};

	return { deleteComment, isPending: mutation.isPending };
};
