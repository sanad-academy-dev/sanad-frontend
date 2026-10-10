import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CostCenterResponse,
	CreateCostCenterFormValues,
	UpdateCostCenterFormInput,
} from "@/server/accounting/cost-center/cost-center.type";

const QUERY_KEY = ["accounting", "cost-centers"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useCostCenters = () => {
	const { data, isLoading } = useQuery<CostCenterResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["cost-centers"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل مراكز التكلفة"));
			return data as CostCenterResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { costCenters: data ?? [], isLoading };
};

export const useCostCenterActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (
			input: CreateCostCenterFormValues & { parentCostCenterId?: string | null },
		) => {
			const { data, error } = await api.accounting["cost-centers"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء مركز التكلفة"));
			return data as CostCenterResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: UpdateCostCenterFormInput;
		}) => {
			const { data, error } = await api.accounting["cost-centers"]({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل مركز التكلفة"));
			return data as CostCenterResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting["cost-centers"]({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف مركز التكلفة"));
		},
		onSuccess: invalidate,
	});

	const create = (
		input: CreateCostCenterFormValues & { parentCostCenterId?: string | null },
	) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ الإنشاء...",
			success: "تم إنشاء مركز التكلفة",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: UpdateCostCenterFormInput) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ التعديل",
			error: (e: Error) => e.message,
		});
	const remove = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "تم الحذف",
			error: (e: Error) => e.message,
		});

	return {
		create,
		update,
		remove,
		isSaving: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
};
