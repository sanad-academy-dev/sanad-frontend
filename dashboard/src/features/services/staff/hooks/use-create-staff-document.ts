import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CreateStaffDocumentFormInput } from "@/server/staff-documents/staff-documents.type";

export const useCreateStaffDocument = (staffId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (body: CreateStaffDocumentFormInput) => {
			const res = await api.staff({ id: staffId }).documents.post(body);
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة المستند");
			}
			return res.data;
		},
		onSuccess: (_data, variables) => {
			void queryClient.invalidateQueries({
				queryKey: ["staff", staffId, "documents", variables.category],
			});
		},
	});

	const createDocument = async (input: CreateStaffDocumentFormInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ إضافة المستند...",
			success: "تم إضافة المستند",
			error: (err: Error) => err.message || "فشل إضافة المستند",
		});

	return { createDocument, isPending: mutation.isPending };
};
