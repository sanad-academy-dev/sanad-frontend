import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { GOVERNANCE_QUERY_KEY } from "@/features/accounting/governance/hooks/use-accounting-periods";
import { api } from "@/lib/api";
import type {
	BudgetResponse,
	CreateBudgetFormInput,
} from "@/server/accounting/budget/budget.type";

/** [P11.6] Data hooks for «الموازنات» (§13) inside the governance hub. */

const QUERY_KEY = [...GOVERNANCE_QUERY_KEY, "budgets"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useBudgets = () => {
	const { data, isLoading } = useQuery<BudgetResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting.budgets.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الموازنات"));
			return data as BudgetResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { budgets: data ?? [], isLoading };
};

export const useBudgetActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: GOVERNANCE_QUERY_KEY });
	};

	const createMutation = useMutation({
		mutationFn: async (input: CreateBudgetFormInput) => {
			const { data, error } = await api.accounting.budgets.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الموازنة"));
			return data as BudgetResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting.budgets({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر اعتماد الموازنة"));
			return data as BudgetResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting.budgets({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء الموازنة"));
			return data as BudgetResponse;
		},
		onSuccess: invalidate,
	});
	const removeMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting.budgets({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف الموازنة"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateBudgetFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء الموازنة...",
			success: "تم إنشاء الموازنة",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الاعتماد...",
			success: "تم اعتماد الموازنة — الحدود سارية",
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "تم إلغاء الموازنة",
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
