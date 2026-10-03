import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { GOVERNANCE_QUERY_KEY } from "@/features/accounting/governance/hooks/use-accounting-periods";
import { AccountingJobStatus } from "@/generated/prisma/enums";
import { api } from "@/lib/api";
import type {
	CreatePeriodClosingVoucherFormInput,
	PeriodClosingVoucherResponse,
} from "@/server/accounting/period-closing/period-closing.type";

/**
 * [P11.6] Data hooks for «إقفال الفترة» (FR-12.3). Submit/cancel run the closing build as a
 * background job (AR-7) — while any row's job is QUEUED/IN_PROGRESS the list polls every
 * 4s so `gleProcessingStatus` is a live monitor; once every job settles, polling stops.
 */

const QUERY_KEY = [...GOVERNANCE_QUERY_KEY, "period-closing"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const isJobLive = (row: PeriodClosingVoucherResponse): boolean =>
	row.gleProcessingStatus === AccountingJobStatus.QUEUED ||
	row.gleProcessingStatus === AccountingJobStatus.IN_PROGRESS;

export const usePeriodClosingVouchers = () => {
	const { data, isLoading } = useQuery<PeriodClosingVoucherResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["period-closing-vouchers"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سندات الإقفال"));
			return data as PeriodClosingVoucherResponse[];
		},
		staleTime: 1000 * 30,
		// live only while a closing job is actually running — no idle polling
		refetchInterval: (query) =>
			query.state.data?.some((row) => row.docstatus !== "DRAFT" && isJobLive(row))
				? 4000
				: false,
	});
	return { vouchers: data ?? [], isLoading };
};

export const usePeriodClosingActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: GOVERNANCE_QUERY_KEY });
	};

	const createMutation = useMutation({
		mutationFn: async (input: CreatePeriodClosingVoucherFormInput) => {
			const { data, error } = await api.accounting["period-closing-vouchers"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء سند الإقفال"));
			return data as PeriodClosingVoucherResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["period-closing-vouchers"]({
				id,
			}).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر تشغيل الإقفال"));
			return data as PeriodClosingVoucherResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await api.accounting["period-closing-vouchers"]({
				id,
			}).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء سند الإقفال"));
			return data as PeriodClosingVoucherResponse;
		},
		onSuccess: invalidate,
	});
	const removeMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting["period-closing-vouchers"]({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف سند الإقفال"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreatePeriodClosingVoucherFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء سند الإقفال...",
			success: "تم إنشاء مسودة سند الإقفال",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ تشغيل الإقفال...",
			success: "بدأ الإقفال — القيود تُرحَّل في الخلفية",
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "بدأ الإلغاء — العكس يُرحَّل في الخلفية",
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
