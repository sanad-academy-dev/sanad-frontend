import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ClinicDocumentFormValues } from "@/server/clinic-documents/clinic-documents.type";

/**
 * النموذج مسطّح (حقل `kind` يبدّل الوضع)، بينما عقد الـ API اتحاد مُميَّز: حقول الملف
 * لا معنى لها في الرابط. هذه الترجمة تحدث هنا مرة واحدة بدل أن تتسرّب إلى الورقة.
 */
export const toClinicDocumentBody = (values: ClinicDocumentFormValues) => {
	const shared = {
		category: values.category,
		title: values.title,
		description: values.description ?? null,
		branchId: values.branchId ?? null,
		issuedAt: values.issuedAt ?? null,
		expiresAt: values.expiresAt ?? null,
	};

	return values.kind === "FILE"
		? {
				...shared,
				kind: "FILE" as const,
				url: values.url,
				mimeType: values.mimeType ?? null,
				sizeBytes: values.sizeBytes ?? null,
			}
		: { ...shared, kind: "LINK" as const, url: values.url };
};

export const useCreateClinicDocument = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (values: ClinicDocumentFormValues) => {
			const res = await api["clinic-documents"].post(toClinicDocumentBody(values));
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر إضافة المستند");
			}
			return res.data;
		},
		// مفتاح البادئة يبطل القائمة (بكل تركيبات الفلاتر) والملخّص معًا
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["clinic-documents"] });
		},
	});

	const createDocument = async (values: ClinicDocumentFormValues) =>
		toast.promise(mutation.mutateAsync(values), {
			loading: "جارٍ إضافة المستند...",
			success: "تم إضافة المستند",
			error: (err: Error) => err.message || "فشل إضافة المستند",
		});

	return { createDocument, isPending: mutation.isPending };
};
