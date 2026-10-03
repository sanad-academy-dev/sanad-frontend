import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CompanyAccountingSettingsResponse,
	UpdateCompanyAccountingSettingsFormInput,
} from "@/server/accounting/company-settings/company-settings.type";
import type { FinanceBookResponse } from "@/server/accounting/finance-book/finance-book.type";

/**
 * [P2-fix] Company accounting defaults (BRD §4.1) — the P0.1 `company-settings` API had no
 * consumer until now. Server truth: `CompanyAccountingSettingsResponse`.
 */

const QUERY_KEY = ["accounting", "company-settings"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCompanyAccountingSettings = () => {
	const { data, isLoading, refetch } = useQuery<CompanyAccountingSettingsResponse>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["company-settings"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الإعدادات الافتراضية"));
			return data as CompanyAccountingSettingsResponse;
		},
		staleTime: 1000 * 60 * 5,
	});
	return { settings: data, isLoading, refetch };
};

export const useUpdateCompanyAccountingSettings = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: UpdateCompanyAccountingSettingsFormInput) => {
			const { data, error } = await api.accounting["company-settings"].patch(input);
			if (error) throw new Error(errorMessage(error, "فشل حفظ الإعدادات الافتراضية"));
			return data as CompanyAccountingSettingsResponse;
		},
		onSuccess: (updated) => {
			queryClient.setQueryData(QUERY_KEY, updated);
		},
	});

	const updateSettings = (input: UpdateCompanyAccountingSettingsFormInput) =>
		toast.promise(mutateAsync(input), {
			loading: "جارٍ حفظ الإعدادات...",
			success: "تم حفظ الإعدادات الافتراضية",
			error: (e: Error) => e.message || "فشل حفظ الإعدادات الافتراضية",
		});

	return { updateSettings, isPending };
};

/** Finance books for the default-book picker — first client consumer of the P1.10 API. */
export const useFinanceBooks = () => {
	const { data, isLoading } = useQuery<FinanceBookResponse[]>({
		queryKey: ["accounting", "finance-books"],
		queryFn: async () => {
			const { data, error } = await api.accounting["finance-books"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الدفاتر المالية"));
			return data as FinanceBookResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { financeBooks: data ?? [], isLoading };
};
