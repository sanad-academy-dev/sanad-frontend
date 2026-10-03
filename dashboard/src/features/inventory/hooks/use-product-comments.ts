import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ProductCommentResponse } from "@/server/product-comments/product-comments.type";

/** تعليقات منتج محدّد + إضافة تعليق جديد */
export const useProductComments = (itemId?: string, opts?: { enabled?: boolean }) => {
	const queryClient = useQueryClient();
	const queryKey = ["product-comments", itemId ?? "none"];

	const { data, isLoading } = useQuery<ProductCommentResponse[]>({
		queryKey,
		enabled: (opts?.enabled ?? true) && !!itemId,
		queryFn: async () => {
			const res = await api["product-comments"].get({ query: { itemId: itemId ?? "" } });
			if (res.error) throw new Error("فشل جلب التعليقات");
			return res.data as ProductCommentResponse[];
		},
		staleTime: 1000 * 30,
	});

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (body: string): Promise<ProductCommentResponse> => {
			const res = await api["product-comments"].post({ itemId: itemId ?? "", body });
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message || "فشل إضافة التعليق";
				throw new Error(msg);
			}
			return res.data as ProductCommentResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const addComment = (body: string): Promise<ProductCommentResponse> => {
		const promise = mutateAsync(body);
		toast.promise(promise, {
			loading: "جارٍ إضافة التعليق...",
			success: "تمت إضافة التعليق",
			error: (err: Error) => err.message || "فشل إضافة التعليق",
		});
		return promise;
	};

	return {
		comments: Array.isArray(data) ? data : [],
		isLoading,
		addComment,
		isAdding: isPending,
	};
};
