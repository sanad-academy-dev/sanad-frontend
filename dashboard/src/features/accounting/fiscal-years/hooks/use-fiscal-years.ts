import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateFiscalYearFormValues,
	FiscalYearResponse,
	UpdateFiscalYearFormInput,
} from "@/server/accounting/fiscal-year/fiscal-year.type";

const QUERY_KEY = ["accounting", "fiscal-years"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useFiscalYears = () => {
	const { data, isLoading } = useQuery<FiscalYearResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["fiscal-years"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل السنوات المالية"));
			return data as FiscalYearResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { fiscalYears: data ?? [], isLoading };
};

export const useFiscalYearActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateFiscalYearFormValues) => {
			const { data, error } = await api.accounting["fiscal-years"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء السنة المالية"));
			return data as FiscalYearResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: UpdateFiscalYearFormInput;
		}) => {
			const { data, error } = await api.accounting["fiscal-years"]({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل السنة المالية"));
			return data as FiscalYearResponse;
		},
		onSuccess: invalidate,
	});
	const nextMutation = useMutation({
		mutationFn: async () => {
			const { data, error } = await api.accounting["fiscal-years"].next.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء السنة التالية"));
			return data as FiscalYearResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting["fiscal-years"]({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف السنة المالية"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateFiscalYearFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ الإنشاء...",
			success: "تم إنشاء السنة المالية",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: UpdateFiscalYearFormInput) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ التعديل",
			error: (e: Error) => e.message,
		});
	const createNext = () =>
		toast.promise(nextMutation.mutateAsync(), {
			loading: "جارٍ اشتقاق السنة التالية...",
			success: (fy) => `تم إنشاء السنة ${fy.year}`,
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
		createNext,
		remove,
		isSaving: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
};
