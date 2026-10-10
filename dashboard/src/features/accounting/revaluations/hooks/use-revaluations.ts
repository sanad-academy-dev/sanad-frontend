import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ErrScanRow } from "@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.service";
import type {
	CreateExchangeRateRevaluationFormValues,
	ExchangeRateRevaluationResponse,
} from "@/server/accounting/exchange-rate-revaluation/exchange-rate-revaluation.type";

/** [P8.4] Data hooks for Exchange Rate Revaluation (FR-9.3). */

const QUERY_KEY = ["accounting", "revaluations"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["exchange-rate-revaluations"];

export const useRevaluations = () => {
	const { data, isLoading } = useQuery<ExchangeRateRevaluationResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل إعادة التقييم"));
			return data as ExchangeRateRevaluationResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { revaluations: data ?? [], isLoading };
};

/** the FR-9.3 scan — on demand for the creation sheet */
export const useRevaluationScan = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (date: string) => {
			const { data, error } = await resource.scan.get({ query: { date } });
			if (error) throw new Error(errorMessage(error, "تعذّر فحص الأرصدة"));
			return data as ErrScanRow[];
		},
	});
	return { scan: mutateAsync, isScanning: isPending };
};

export const useRevaluationActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["accounting"] });
	};

	const createMutation = useMutation({
		mutationFn: async (input: CreateExchangeRateRevaluationFormValues) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء المستند"));
			return data as ExchangeRateRevaluationResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر الترحيل"));
			return data as ExchangeRateRevaluationResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر الإلغاء"));
			return data as ExchangeRateRevaluationResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await resource({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف المسودة"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateExchangeRateRevaluationFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء المسودة...",
			success: "تم إنشاء مسودة إعادة التقييم",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الترحيل...",
			success: (doc) => `تم الترحيل برقم ${doc.documentNo ?? ""} — أُنشئ قيد إعادة التقييم`,
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "أُلغي المستند وقُيِّد عكس القيد المرتبط",
			error: (e: Error) => e.message,
		});
	const remove = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "حُذفت المسودة",
			error: (e: Error) => e.message,
		});

	return {
		create,
		submit,
		cancel,
		remove,
		isPending:
			createMutation.isPending ||
			submitMutation.isPending ||
			cancelMutation.isPending ||
			deleteMutation.isPending,
	};
};
