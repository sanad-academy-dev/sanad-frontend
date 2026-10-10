import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { OperationNoteDraft } from "@/server/operations/operations-ai.service";

// مسودات الذكاء الاصطناعي — نمط توليد تقرير المختبر: المخرَج يهبط في حقول
// قابلة للتحرير دائمًا ولا يُحفظ آليًا؛ التوثيق قرار الجرّاح (S21).

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** مسودة التقرير الجراحي من وقائع الحالة */
export const useGenerateOperationNote = () => {
	const mutation = useMutation({
		mutationFn: async ({ caseId }: { caseId: string }) => {
			const res = await api.operations({ id: caseId }).note.generate.post();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توليد المسودة"));
			return res.data as OperationNoteDraft;
		},
	});

	const generateNote = (input: { caseId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ صياغة التقرير...",
			success: "صيغت مسودّة التقرير — راجعها قبل الحفظ والتوقيع",
			error: (err: Error) => err.message || "فشل توليد المسودة",
		});
		return p;
	};

	return { generateNote, isPending: mutation.isPending };
};

/** مسودة تعليمات الخروج والرعاية المنزلية */
export const useGenerateDischargeInstructions = () => {
	const mutation = useMutation({
		mutationFn: async ({ caseId }: { caseId: string }) => {
			const res = await api
				.operations({ id: caseId })
				["discharge-instructions"].generate.post();
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر توليد التعليمات"));
			return res.data as { instructions: string };
		},
	});

	const generateInstructions = (input: { caseId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ صياغة التعليمات...",
			success: "صيغت مسودّة التعليمات — راجعها قبل الإصدار",
			error: (err: Error) => err.message || "فشل توليد التعليمات",
		});
		return p;
	};

	return { generateInstructions, isPending: mutation.isPending };
};
