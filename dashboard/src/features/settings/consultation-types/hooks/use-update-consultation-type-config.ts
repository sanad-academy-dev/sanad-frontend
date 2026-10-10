import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

export const useUpdateConsultationTypeConfig = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			id,
			...patch
		}: {
			id: string;
			price?: number | null;
			examTemplateId?: string | null;
		}) => {
			// يُرسل ما تغيّر فقط — الخادم لا يمسّ حقلًا لم يصل، فحفظ القالب لا يمحو السعر
			const res = await api["consultation-types"]({ id }).config.patch(patch);
			if (res.error) throw new Error("فشل تحديث إعداد نوع الكشف");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["consultation-types"] });
		},
	});

	const updateConsultationTypeConfig = (
		id: string,
		patch: { price?: number | null; examTemplateId?: string | null },
	) => {
		const isTemplate = patch.examTemplateId !== undefined;
		return toast.promise(mutation.mutateAsync({ id, ...patch }), {
			loading: isTemplate ? "جارٍ تحديث القالب..." : "جارٍ تحديث السعر...",
			success: isTemplate ? "تم تحديث قالب الفحص" : "تم تحديث السعر",
			error: (err: Error) => err.message || "فشل التحديث",
		});
	};

	return { updateConsultationTypeConfig, isPending: mutation.isPending };
};
