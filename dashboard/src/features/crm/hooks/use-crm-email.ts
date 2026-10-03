import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CrmSubjectType } from "@/features/crm/hooks/use-crm-activities";
import { api } from "@/lib/api";
import type {
	CrmEmailTemplateFormInput,
	CrmEmailTemplateResponse,
} from "@/server/crm/crm-email/crm-email.type";

/** [CRM-P3] §9.1 — قوالب البريد، هويّة المُرسِل، والإرسال. */

const TEMPLATES_KEY = ["crm", "email", "templates"] as const;
const IDENTITY_KEY = ["crm", "email", "identity"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCrmEmailTemplates = (includeInactive = false) => {
	const { data, isLoading } = useQuery<CrmEmailTemplateResponse[]>({
		queryKey: [...TEMPLATES_KEY, includeInactive],
		queryFn: async () => {
			const { data, error } = await api.crm.email.templates.get({
				query: { includeInactive },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل القوالب"));
			return data as CrmEmailTemplateResponse[];
		},
	});
	return { templates: data ?? [], isLoading };
};

/**
 * §9.1 — ما سيراه المستلِم. الشاشة تعرضه لأنّ الظرف عالميّ: المستخدم يجب أن يعرف بأيّ
 * اسمٍ تخرج رسالته وإلى أين تعود الردود — أو أنّها لن تعود إليه أصلًا.
 */
export const useCrmEmailIdentity = () => {
	const { data, isLoading } = useQuery<{ fromName: string | null; replyTo: string | null }>({
		queryKey: IDENTITY_KEY,
		queryFn: async () => {
			const { data, error } = await api.crm.email.identity.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل هويّة المُرسِل"));
			return data as { fromName: string | null; replyTo: string | null };
		},
		staleTime: 1000 * 60 * 5,
	});
	return { identity: data ?? null, isLoading };
};

export const useCrmEmailTemplateActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CrmEmailTemplateFormInput) => {
			const { data, error } = await api.crm.email.templates.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت إضافة القالب"));
			return data;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			...input
		}: Partial<CrmEmailTemplateFormInput> & { id: string }) => {
			const { data, error } = await api.crm.email.templates({ id }).patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل القالب"));
			return data;
		},
		onSuccess: invalidate,
	});

	const removeMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.crm.email.templates({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف القالب"));
			return data;
		},
		onSuccess: invalidate,
	});

	/** المتغيّر المجهول تحذيرٌ لا رفض — يظهر بعد الحفظ لأنّ الحفظ نجح فعلًا. */
	const warnUnknown = <T>(result: T): T => {
		const unknown = (result as { unknownVariables?: string[] })?.unknownVariables ?? [];
		if (unknown.length > 0) {
			toast.warning(`متغيّرات غير معروفة ستظهر فارغة: ${unknown.join("، ")}`);
		}
		return result;
	};

	const createTemplate = (input: CrmEmailTemplateFormInput) =>
		toast.promise(createMutation.mutateAsync(input).then(warnUnknown), {
			loading: "جارٍ الحفظ...",
			success: "أُضيف القالب",
			error: (error: Error) => error.message,
		});

	const updateTemplate = (input: Partial<CrmEmailTemplateFormInput> & { id: string }) =>
		toast.promise(updateMutation.mutateAsync(input).then(warnUnknown), {
			loading: "جارٍ الحفظ...",
			success: "حُدِّث القالب",
			error: (error: Error) => error.message,
		});

	const removeTemplate = (id: string) =>
		toast.promise(removeMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "حُذف القالب",
			error: (error: Error) => error.message,
		});

	return {
		createTemplate,
		updateTemplate,
		removeTemplate,
		isSaving: createMutation.isPending || updateMutation.isPending,
	};
};

export const useSendCrmEmail = (subjectId: string, type: CrmSubjectType = "LEAD") => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { templateId?: string; subject?: string; body?: string }) => {
			const { data, error } =
				type === "DEAL"
					? await api.crm.deals({ id: subjectId }).email.post(input)
					: await api.crm.leads({ id: subjectId }).email.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إرسال البريد"));
			return data;
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ["crm", type === "DEAL" ? "deals" : "leads", subjectId],
			}),
	});

	/**
	 * الفشل يُسجَّل ولا يُرمى: الخادم يعيد ٢٠٠ مع `status: FAILED`. فالنجاح هنا يعني «وصل
	 * السجلّ»، والرسالة للمستخدم تُشتقّ من الحالة لا من نجاح النداء.
	 */
	const sendEmail = (input: { templateId?: string; subject?: string; body?: string }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الإرسال...",
			success: (result) =>
				(result as { status?: string })?.status === "FAILED"
					? `فشل الإرسال — ${(result as { failureReason?: string }).failureReason ?? ""}`
					: "أُرسلت الرسالة",
			error: (error: Error) => error.message,
		});

	return { sendEmail, isSending: isPending };
};
