import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AccountingPeriodResponse,
	CreateAccountingPeriodFormInput,
} from "@/server/accounting/accounting-period/accounting-period.type";

/** [P11.6] Data hooks for «الفترات المحاسبية» (FR-12.2) inside the governance hub. */

/** One family prefix for the whole hub — one invalidation refreshes every governance tab. */
export const GOVERNANCE_QUERY_KEY = ["accounting", "governance"] as const;

const QUERY_KEY = [...GOVERNANCE_QUERY_KEY, "periods"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useAccountingPeriods = () => {
	const { data, isLoading } = useQuery<AccountingPeriodResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["accounting-periods"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الفترات المحاسبية"));
			return data as AccountingPeriodResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { periods: data ?? [], isLoading };
};

export const useAccountingPeriodActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: GOVERNANCE_QUERY_KEY });
	};

	const createMutation = useMutation({
		mutationFn: async (input: CreateAccountingPeriodFormInput) => {
			const { data, error } = await api.accounting["accounting-periods"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الفترة المحاسبية"));
			return data as AccountingPeriodResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["accounting-periods"]({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر اعتماد الفترة المحاسبية"));
			return data as AccountingPeriodResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["accounting-periods"]({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء الفترة المحاسبية"));
			return data as AccountingPeriodResponse;
		},
		onSuccess: invalidate,
	});
	const removeMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting["accounting-periods"]({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف الفترة المحاسبية"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateAccountingPeriodFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء الفترة...",
			success: "تم إنشاء الفترة المحاسبية",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الاعتماد...",
			success: "تم اعتماد الفترة — قفل المستندات ساري",
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "تم إلغاء الفترة — رُفع القفل",
			error: (e: Error) => e.message,
		});
	const remove = (id: string) =>
		toast.promise(removeMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "تم حذف المسودة",
			error: (e: Error) => e.message,
		});

	return {
		create,
		submit,
		cancel,
		remove,
		isSaving: createMutation.isPending,
		isPending:
			createMutation.isPending ||
			submitMutation.isPending ||
			cancelMutation.isPending ||
			removeMutation.isPending,
	};
};
