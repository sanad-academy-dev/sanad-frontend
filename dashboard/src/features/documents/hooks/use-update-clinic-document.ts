import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ClinicDocumentFormValues } from "@/server/clinic-documents/clinic-documents.type";

// التعديل يمسّ البيانات الوصفية فقط — استبدال الملف يتم بحذف وإعادة رفع، وإلا لبقي
// المفتاح القديم معلّقًا في التخزين بلا وليّ أمر.
export const useUpdateClinicDocument = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, values }: { id: string; values: ClinicDocumentFormValues }) => {
			const res = await api["clinic-documents"]({ id }).patch({
				category: values.category,
				title: values.title,
				description: values.description ?? null,
				branchId: values.branchId ?? null,
				issuedAt: values.issuedAt ?? null,
				expiresAt: values.expiresAt ?? null,
			});
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر تعديل المستند");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinic-documents"] });
		},
	});

	const updateDocument = async (id: string, values: ClinicDocumentFormValues) =>
		toast.promise(mutation.mutateAsync({ id, values }), {
			loading: "جارٍ حفظ التعديل...",
			success: "تم حفظ المستند",
			error: (err: Error) => err.message || "فشل حفظ المستند",
		});

	return { updateDocument, isPending: mutation.isPending };
};
