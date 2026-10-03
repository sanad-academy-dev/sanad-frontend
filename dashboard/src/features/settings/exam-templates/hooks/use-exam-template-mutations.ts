import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EXAM_TEMPLATES_QUERY_KEY } from "@/features/settings/exam-templates/hooks/use-exam-templates";
import { api } from "@/lib/api";
import type {
	ExamTemplateResponse,
	UpsertExamTemplateFormInput,
} from "@/server/clinical-notes/clinical-notes.type";

/**
 * [S3] حفظ قالب فحص.
 *
 * الخادم يقرّر بنفسه أهو تعديل في مكانه أم إصدار جديد: قالبٌ له ملاحظات لا يُعدَّل
 * أبدًا، لأن معرّفات كتله هي مفاتيح `answers` المخزّنة. الواجهة لا تختار — هي
 * تُنبّه فقط (راجع محرّر القالب)، والقرار يبقى حيث تُفرض القاعدة.
 */
export const useExamTemplateMutations = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: UpsertExamTemplateFormInput) => {
			const res = await api["exam-templates"].post(input);
			if (res.error) {
				const details = (res.error.value as { message?: string } | null)?.message;
				throw new Error(details || "فشل حفظ القالب");
			}
			return res.data as ExamTemplateResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EXAM_TEMPLATES_QUERY_KEY });
		},
	});

	const saveTemplate = (input: UpsertExamTemplateFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ حفظ القالب...",
			success: (template) =>
				template.version > 1 ? `حُفظ القالب كإصدار ${template.version}` : "حُفظ القالب بنجاح",
			error: (error: Error) => error.message || "فشل حفظ القالب",
		});

	return { saveTemplate, isPending };
};
