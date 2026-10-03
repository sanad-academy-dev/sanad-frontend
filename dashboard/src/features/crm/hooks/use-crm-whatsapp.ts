import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { CrmSubjectType } from "@/features/crm/hooks/use-crm-activities";
import { api } from "@/lib/api";
import type {
	WhatsappCredentialsFormInput,
	WhatsappSettingsResponse,
} from "@/server/crm/crm-whatsapp/crm-whatsapp.type";

/** [CRM-P4] §9.2 — إعدادات قناة واتساب وإرسالها. */

const SETTINGS_KEY = ["crm", "whatsapp", "settings"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

/**
 * الاستجابة تقول «مضبوطة» لا «ما هي»: بيانات الاعتماد تدخل ولا تخرج (§17.2 صفّ ١٩)، فما
 * تعرضه الشاشة حالةٌ لا قيمة.
 */
export const useCrmWhatsappSettings = () => {
	const { data, isLoading } = useQuery<WhatsappSettingsResponse>({
		queryKey: SETTINGS_KEY,
		queryFn: async () => {
			const { data, error } = await api.crm.whatsapp.settings.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل إعدادات واتساب"));
			return data as WhatsappSettingsResponse;
		},
	});
	return { settings: data ?? null, isLoading };
};

export const useCrmWhatsappSettingsActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });

	const saveMutation = useMutation({
		mutationFn: async (input: WhatsappCredentialsFormInput) => {
			const { data, error } = await api.crm.whatsapp.settings.put(input);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ بيانات الاتصال"));
			return data;
		},
		onSuccess: invalidate,
	});

	const clearMutation = useMutation({
		mutationFn: async () => {
			const { data, error } = await api.crm.whatsapp.settings.delete();
			if (error) throw new Error(errorMessage(error, "تعذّر فصل الاتصال"));
			return data;
		},
		onSuccess: invalidate,
	});

	const saveCredentials = (input: WhatsappCredentialsFormInput) =>
		toast.promise(saveMutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "حُفظت بيانات الاتصال",
			error: (error: Error) => error.message,
		});

	const clearCredentials = () =>
		toast.promise(clearMutation.mutateAsync(), {
			loading: "جارٍ الفصل...",
			success: "فُصل الاتصال",
			error: (error: Error) => error.message,
		});

	return {
		saveCredentials,
		clearCredentials,
		isSaving: saveMutation.isPending || clearMutation.isPending,
	};
};

export const useSendCrmWhatsapp = (subjectId: string, type: CrmSubjectType = "LEAD") => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { body: string }) => {
			const { data, error } =
				type === "DEAL"
					? await api.crm.deals({ id: subjectId }).whatsapp.post(input)
					: await api.crm.leads({ id: subjectId }).whatsapp.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إرسال الرسالة"));
			return data;
		},
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: ["crm", type === "DEAL" ? "deals" : "leads", subjectId],
			}),
	});

	/**
	 * كالبريد في CRM-P3: الفشل يُسجَّل ولا يُرمى — الخادم يعيد ٢٠٠ مع `status: FAILED`،
	 * فرسالة المستخدم تُشتقّ من الحالة لا من نجاح النداء.
	 */
	const sendWhatsapp = (input: { body: string }) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ الإرسال...",
			success: (result) =>
				(result as { status?: string })?.status === "FAILED"
					? `فشل الإرسال — ${(result as { failureReason?: string }).failureReason ?? ""}`
					: "أُرسلت الرسالة",
			error: (error: Error) => error.message,
		});

	return { sendWhatsapp, isSending: isPending };
};
