import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { CurrencyResponse } from "@/server/accounting/currency/currency.type";
import type {
	CreateCurrencyExchangeFormValues,
	CurrencyExchangeResponse,
} from "@/server/accounting/currency-exchange/currency-exchange.type";

/** [P1.8 UI] Data hooks for the manual Currency Exchange table (BRD §4.7). */

const QUERY_KEY = ["accounting", "currency-exchanges"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["currency-exchanges"];

export const useCurrencyExchanges = () => {
	const { data, isLoading } = useQuery<CurrencyExchangeResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل أسعار الصرف"));
			return data as CurrencyExchangeResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { rates: data ?? [], isLoading };
};

export const useCurrencies = () => {
	const { data, isLoading } = useQuery<CurrencyResponse[]>({
		queryKey: ["accounting", "currencies"],
		queryFn: async () => {
			const { data, error } = await api.accounting.currencies.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل العملات"));
			return data as CurrencyResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { currencies: data ?? [], isLoading };
};

export const useCurrencyExchangeActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateCurrencyExchangeFormValues) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إضافة سعر الصرف"));
			return data as CurrencyExchangeResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await resource({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف سعر الصرف"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateCurrencyExchangeFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ الإضافة...",
			success: "تمت إضافة سعر الصرف",
			error: (e: Error) => e.message,
		});
	const remove = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "تم الحذف",
			error: (e: Error) => e.message,
		});

	return { create, remove, isSaving: createMutation.isPending };
};
