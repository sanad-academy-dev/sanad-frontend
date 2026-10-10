import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	RadiologyDefinitionFormValues,
	RadiologyExamTemplateResponse,
} from "@/server/radiology-exams/radiology-exams.type";

const EMPTY_TEMPLATES: RadiologyExamTemplateResponse[] = [];

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** كل قوالب فحوصات الأشعة (دورات فئة "الأشعة" مع تعريفاتها) */
export const useRadiologyTemplates = () => {
	const { data, isLoading } = useQuery<RadiologyExamTemplateResponse[]>({
		queryKey: ["radiology-templates"],
		queryFn: async () => {
			const res = await api["radiology-exams"].templates.get();
			if (res.error) throw new Error("فشل جلب قوالب فحوصات الأشعة");
			return res.data as RadiologyExamTemplateResponse[];
		},
	});

	return { templates: data ?? EMPTY_TEMPLATES, isLoading };
};

/** حفظ تعريف فحص (طريقة التصوير وخصائصه) — إنشاء أو تحديث في خطوة واحدة */
export const useUpsertRadiologyDefinition = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			serviceId,
			...input
		}: RadiologyDefinitionFormValues & { serviceId: string }) => {
			const res = await api["radiology-exams"].service({ serviceId }).put({
				modality: input.modality,
				bodyPart: input.bodyPart ?? null,
				defaultViews: input.defaultViews,
				lateralityRequired: input.lateralityRequired,
				contrastDefault: input.contrastDefault,
				sedationDefault: input.sedationDefault,
				prepNotes: input.prepNotes ?? null,
				active: input.active,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ تعريف الفحص"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["radiology-templates"] });
		},
	});

	const upsertDefinition = (input: RadiologyDefinitionFormValues & { serviceId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ تعريف الفحص",
			error: (err: Error) => err.message || "فشل حفظ تعريف الفحص",
		});
		return p;
	};

	return { upsertDefinition, isPending: mutation.isPending };
};
