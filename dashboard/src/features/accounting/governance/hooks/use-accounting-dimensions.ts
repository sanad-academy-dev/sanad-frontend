import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { GOVERNANCE_QUERY_KEY } from "@/features/accounting/governance/hooks/use-accounting-periods";
import { api } from "@/lib/api";
import type {
	AccountingDimensionResponse,
	UpsertAccountingDimensionFormInput,
	UpsertDimensionFilterFormInput,
} from "@/server/accounting/accounting-dimension/accounting-dimension.type";

/** [P11.6] Data hooks for «الأبعاد» (§4.5) inside the governance hub. */

const QUERY_KEY = [...GOVERNANCE_QUERY_KEY, "dimensions"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useAccountingDimensions = () => {
	const { data, isLoading } = useQuery<AccountingDimensionResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting.dimensions.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الأبعاد المحاسبية"));
			return data as AccountingDimensionResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { dimensions: data ?? [], isLoading };
};

export const useAccountingDimensionActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: GOVERNANCE_QUERY_KEY });
	};

	const upsertMutation = useMutation({
		mutationFn: async (input: UpsertAccountingDimensionFormInput) => {
			const { data, error } = await api.accounting.dimensions.put(input);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ البعد المحاسبي"));
			return data as AccountingDimensionResponse;
		},
		onSuccess: invalidate,
	});
	const setFilterMutation = useMutation({
		mutationFn: async (input: { id: string; filter: UpsertDimensionFilterFormInput }) => {
			const { data, error } = await api.accounting
				.dimensions({ id: input.id })
				.filter.put(input.filter);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ فلتر البعد"));
			return data as AccountingDimensionResponse;
		},
		onSuccess: invalidate,
	});
	const clearFilterMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting.dimensions({ id }).filter.delete();
			if (error) throw new Error(errorMessage(error, "تعذّر مسح فلتر البعد"));
		},
		onSuccess: invalidate,
	});

	const upsert = (input: UpsertAccountingDimensionFormInput) =>
		toast.promise(upsertMutation.mutateAsync(input), {
			loading: "جارٍ حفظ البعد...",
			success: "تم حفظ البعد المحاسبي",
			error: (e: Error) => e.message,
		});
	const setFilter = (id: string, filter: UpsertDimensionFilterFormInput) =>
		toast.promise(setFilterMutation.mutateAsync({ id, filter }), {
			loading: "جارٍ حفظ الفلتر...",
			success: "تم حفظ فلتر البعد",
			error: (e: Error) => e.message,
		});
	const clearFilter = (id: string) =>
		toast.promise(clearFilterMutation.mutateAsync(id), {
			loading: "جارٍ مسح الفلتر...",
			success: "تم مسح الفلتر",
			error: (e: Error) => e.message,
		});

	return {
		upsert,
		setFilter,
		clearFilter,
		isSaving: upsertMutation.isPending,
		isPending:
			upsertMutation.isPending || setFilterMutation.isPending || clearFilterMutation.isPending,
	};
};
