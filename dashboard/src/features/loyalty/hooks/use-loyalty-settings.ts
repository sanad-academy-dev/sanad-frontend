import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import {
	LOYALTY_SETTINGS_DEFAULTS,
	type LoyaltySettingsFormInput,
	type LoyaltySettingsResponse,
} from "@sanad/contracts/runtime/server/loyalty/loyalty-settings/loyalty-settings.type";

/**
 * [LY-P0] §13 — إعدادات الوحدة.
 *
 * القراءة تُرجع الافتراضيات حين لا سجلّ بعد، فالشاشة لا تحتاج حالة «لا إعدادات»: أكاديميةٌ
 * لم تسمع بالوحدة تقرأ ما تقرؤه أكاديميةٌ عطّلتها صراحةً (§0.3).
 */

const SETTINGS_KEY = ["loyalty", "settings"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useLoyaltySettings = () => {
	const { data, isLoading } = useQuery<LoyaltySettingsResponse>({
		queryKey: SETTINGS_KEY,
		queryFn: async () => {
			const { data, error } = await api.loyalty.settings.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل إعدادات الولاء"));
			return data as LoyaltySettingsResponse;
		},
	});
	return { settings: data ?? LOYALTY_SETTINGS_DEFAULTS, isLoading };
};

export const useLoyaltySettingsActions = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: LoyaltySettingsFormInput) => {
			const { data, error } = await api.loyalty.settings.patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الإعدادات"));
			return data;
		},
		// إبطال المفتاح الجذر: قلبُ المفتاح يغيّر ما تعيده كل مسارات الوحدة (§0.3)
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["loyalty"] }),
	});

	const saveSettings = (input: LoyaltySettingsFormInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ الحفظ...",
			success: "حُفظت الإعدادات",
			error: (error: Error) => error.message,
		});

	return { saveSettings, isSaving: mutation.isPending };
};
