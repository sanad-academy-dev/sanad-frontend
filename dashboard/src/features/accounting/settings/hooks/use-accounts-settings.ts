import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AccountsSettingsValues,
	UpdateAccountsSettingsInput,
} from "@/server/accounting/accounts-settings/accounts-settings.type";

/**
 * [P0.4] Accounts Settings (BRD §19). The response type is the server's own
 * `AccountsSettingsValues` — the settings screen never redeclares the §19 shape.
 */

const QUERY_KEY = ["accounting", "accounts-settings"] as const;

export const useAccountsSettings = () => {
	const { data, isLoading, refetch } = useQuery<AccountsSettingsValues>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["accounts-settings"].get();
			if (error) throw new Error("تعذّر تحميل إعدادات الحسابات");
			return data as AccountsSettingsValues;
		},
		staleTime: 1000 * 60 * 5,
	});

	return { settings: data, isLoading, refetch };
};

export const useUpdateAccountsSettings = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: UpdateAccountsSettingsInput) => {
			const { data, error } = await api.accounting["accounts-settings"].patch(input);
			if (error) {
				throw new Error(
					(error as { value?: { message?: string } }).value?.message ??
						"فشل حفظ إعدادات الحسابات",
				);
			}
			return data as AccountsSettingsValues;
		},
		onSuccess: (updated) => {
			queryClient.setQueryData(QUERY_KEY, updated);
		},
	});

	const updateSettings = (input: UpdateAccountsSettingsInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ حفظ الإعدادات...",
			success: "تم حفظ الإعدادات",
			error: (e: Error) => e.message || "فشل حفظ إعدادات الحسابات",
		});

	return { updateSettings, isPending };
};
