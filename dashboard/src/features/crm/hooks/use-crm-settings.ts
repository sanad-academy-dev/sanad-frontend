import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import {
	CRM_SETTINGS_DEFAULTS,
	type CrmSettingsFormInput,
	type CrmSettingsResponse,
} from "@sanad/contracts/runtime/server/crm/crm-settings/crm-settings.type";

/**
 * [CRM-P6] §14 — إعدادات الوحدة.
 *
 * القراءة تُرجع الافتراضيات حين لا سجلّ بعد (`CRM_SETTINGS_DEFAULTS`)، فالشاشة لا تحتاج
 * حالة «لا إعدادات»: أكاديميةٌ لم تسمع بالوحدة تقرأ ما تقرؤه أكاديميةٌ عطّلتها صراحةً (§0.3).
 */

const SETTINGS_KEY = ["crm", "settings"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCrmSettings = () => {
	const { data, isLoading } = useQuery<CrmSettingsResponse>({
		queryKey: SETTINGS_KEY,
		queryFn: async () => {
			const { data, error } = await api.crm.settings.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل إعدادات إدارة العملاء"));
			return data as CrmSettingsResponse;
		},
	});
	return { settings: data ?? CRM_SETTINGS_DEFAULTS, isLoading };
};

export const useCrmSettingsActions = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: CrmSettingsFormInput) => {
			const { data, error } = await api.crm.settings.patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الإعدادات"));
			return data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
	});

	const saveSettings = (input: CrmSettingsFormInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "حُفظت الإعدادات",
			error: (error: Error) => error.message,
		});

	return { saveSettings, isSaving: mutation.isPending };
};
