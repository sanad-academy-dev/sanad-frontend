import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ChecklistTemplateResponse,
	OperationDefinitionFormValues,
	OperationProcedureTemplateResponse,
} from "@/server/operation-procedures/operation-procedures.type";

const EMPTY_TEMPLATES: OperationProcedureTemplateResponse[] = [];
const EMPTY_CHECKLISTS: ChecklistTemplateResponse[] = [];

const serverMessage = (error: { value?: unknown } | null, fallback: string) => {
	const data = error?.value as { message?: string } | undefined;
	return data?.message ?? fallback;
};

/** كل قوالب الإجراءات الجراحية (دورات فئة «العمليات الجراحية» مع تعريفاتها) */
export const useOperationProcedureTemplates = () => {
	const { data, isLoading } = useQuery<OperationProcedureTemplateResponse[]>({
		queryKey: ["operation-procedure-templates"],
		queryFn: async () => {
			const res = await api["operation-procedures"].templates.get();
			if (res.error) throw new Error("فشل جلب قوالب الإجراءات الجراحية");
			return res.data as OperationProcedureTemplateResponse[];
		},
	});

	return { templates: data ?? EMPTY_TEMPLATES, isLoading };
};

/** قوالب قوائم التحقق الجراحية (WHO) المتاحة للأكاديمية — قراءة فقط في OP0 */
export const useOperationChecklistTemplates = () => {
	const { data, isLoading } = useQuery<ChecklistTemplateResponse[]>({
		queryKey: ["operation-checklist-templates"],
		queryFn: async () => {
			const res = await api["operation-procedures"]["checklist-templates"].get();
			if (res.error) throw new Error("فشل جلب قوالب قوائم التحقق");
			return res.data as ChecklistTemplateResponse[];
		},
	});

	return { checklists: data ?? EMPTY_CHECKLISTS, isLoading };
};

/** حفظ تعريف إجراء (الدرجة والتخدير وخصائصه) — إنشاء أو تحديث في خطوة واحدة */
export const useUpsertOperationDefinition = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({
			serviceId,
			...input
		}: OperationDefinitionFormValues & { serviceId: string }) => {
			const res = await api["operation-procedures"].service({ serviceId }).put({
				defaultTier: input.defaultTier,
				defaultAnesthesia: input.defaultAnesthesia,
				defaultWoundClass: input.defaultWoundClass ?? null,
				requiresLaterality: input.requiresLaterality,
				bodySystem: input.bodySystem ?? null,
				codes: input.codes ?? null,
				specializationId: input.specializationId ?? null,
				prepNotes: input.prepNotes ?? null,
				active: input.active,
				kitItems: input.kitItems,
			});
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ تعريف الإجراء"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["operation-procedure-templates"] });
		},
	});

	const upsertDefinition = (input: OperationDefinitionFormValues & { serviceId: string }) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ تعريف الإجراء",
			error: (err: Error) => err.message || "فشل حفظ تعريف الإجراء",
		});
		return p;
	};

	return { upsertDefinition, isPending: mutation.isPending };
};

/** حفظ نسخة أكاديمية من قالب قائمة تحقق — نسخة جديدة دائمًا والتاريخ مصون (OP8) */
export const useSaveChecklistTemplate = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: Parameters<
				(typeof api)["operation-procedures"]["checklist-templates"]["post"]
			>[0],
		) => {
			const res = await api["operation-procedures"]["checklist-templates"].post(input);
			if (res.error) throw new Error(serverMessage(res.error, "تعذّر حفظ القالب"));
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["operation-checklist-templates"] });
		},
	});

	const saveTemplate = (input: Parameters<typeof mutation.mutateAsync>[0]) => {
		const p = mutation.mutateAsync(input);
		toast.promise(p, {
			loading: "جارٍ الحفظ...",
			success: "حُفظت نسخة جديدة من القالب",
			error: (err: Error) => err.message || "فشل حفظ القالب",
		});
		return p;
	};

	return { saveTemplate, isPending: mutation.isPending };
};
