import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CostCenterAllocationResponse,
	CreateCostCenterAllocationFormInput,
} from "@/server/accounting/cost-center-allocation/cost-center-allocation.type";

/**
 * [P1.6 UI] Data hooks for the Cost Center Allocation lifecycle (BRD §4.4). Every mutation
 * invalidates the list: submitting assigns a document number and amending creates a second row.
 */

const QUERY_KEY = ["accounting", "cost-center-allocations"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["cost-center-allocations"];

export const useCostCenterAllocations = () => {
	const { data, isLoading } = useQuery<CostCenterAllocationResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل توزيعات مراكز التكلفة"));
			return data as CostCenterAllocationResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { allocations: data ?? [], isLoading };
};

export const useCostCenterAllocationActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateCostCenterAllocationFormInput) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء التوزيع"));
			return data as CostCenterAllocationResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: CreateCostCenterAllocationFormInput;
		}) => {
			const { data, error } = await resource({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل التوزيع"));
			return data as CostCenterAllocationResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر ترحيل التوزيع"));
			return data as CostCenterAllocationResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء التوزيع"));
			return data as CostCenterAllocationResponse;
		},
		onSuccess: invalidate,
	});
	const amendMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).amend.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء نسخة معدَّلة"));
			return data as CostCenterAllocationResponse;
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateCostCenterAllocationFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء المسودة...",
			success: "تم إنشاء مسودة التوزيع",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: CreateCostCenterAllocationFormInput) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ حفظ التعديل...",
			success: "تم حفظ التعديل",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الترحيل...",
			success: (a) => `تم الترحيل برقم ${a.documentNo ?? ""}`,
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "تم إلغاء التوزيع",
			error: (e: Error) => e.message,
		});
	const amend = (id: string) =>
		toast.promise(amendMutation.mutateAsync(id), {
			loading: "جارٍ إنشاء نسخة معدَّلة...",
			success: "تم إنشاء مسودة جديدة معدَّلة",
			error: (e: Error) => e.message,
		});

	const isPending =
		createMutation.isPending ||
		updateMutation.isPending ||
		submitMutation.isPending ||
		cancelMutation.isPending ||
		amendMutation.isPending;

	return { create, update, submit, cancel, amend, isPending };
};
