import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateModeOfPaymentFormValues,
	ModeOfPaymentResponse,
	UpdateModeOfPaymentFormInput,
} from "@/server/accounting/mode-of-payment/mode-of-payment.type";

/** [P1.7 UI] Data hooks for Mode of Payment (BRD §4.8). */

const QUERY_KEY = ["accounting", "modes-of-payment"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["modes-of-payment"];

export const useModesOfPayment = () => {
	const { data, isLoading } = useQuery<ModeOfPaymentResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل طرق الدفع"));
			return data as ModeOfPaymentResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { modes: data ?? [], isLoading };
};

export const useModeOfPaymentActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateModeOfPaymentFormValues) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء طريقة الدفع"));
			return data as ModeOfPaymentResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: UpdateModeOfPaymentFormInput;
		}) => {
			const { data, error } = await resource({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل طريقة الدفع"));
			return data as ModeOfPaymentResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await resource({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف طريقة الدفع"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateModeOfPaymentFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ الإنشاء...",
			success: "تم إنشاء طريقة الدفع",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: UpdateModeOfPaymentFormInput) =>
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
	};
};
