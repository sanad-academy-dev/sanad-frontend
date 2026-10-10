import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreatePaymentTermFormValues,
	CreatePaymentTermsTemplateFormValues,
	PaymentTermResponse,
	PaymentTermsTemplateResponse,
} from "@/server/accounting/payment-terms/payment-terms.type";

/** [P3.5] Data hooks for «شروط الدفع» (BRD §4.9). */

const TERMS_KEY = ["accounting", "payment-terms"] as const;
const TEMPLATES_KEY = ["accounting", "payment-terms-templates"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const usePaymentTerms = () => {
	const { data, isLoading } = useQuery<PaymentTermResponse[]>({
		queryKey: TERMS_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["payment-terms"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل شروط الدفع"));
			return data as PaymentTermResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { terms: data ?? [], isLoading };
};

export const usePaymentTermsTemplates = () => {
	const { data, isLoading } = useQuery<PaymentTermsTemplateResponse[]>({
		queryKey: TEMPLATES_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["payment-terms"].templates.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل القوالب"));
			return data as PaymentTermsTemplateResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { templates: data ?? [], isLoading };
};

export const usePaymentTermsActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: TERMS_KEY });
		queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
	};

	const createTermMutation = useMutation({
		mutationFn: async (input: CreatePaymentTermFormValues) => {
			const { data, error } = await api.accounting["payment-terms"].post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الشرط"));
			return data;
		},
		onSuccess: invalidate,
	});
	const updateTermMutation = useMutation({
		mutationFn: async ({ id, input }: { id: string; input: CreatePaymentTermFormValues }) => {
			const { data, error } = await api.accounting["payment-terms"]({ id }).patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل الشرط"));
			return data;
		},
		onSuccess: invalidate,
	});
	const deleteTermMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting["payment-terms"]({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف الشرط"));
		},
		onSuccess: invalidate,
	});
	const createTemplateMutation = useMutation({
		mutationFn: async (input: CreatePaymentTermsTemplateFormValues) => {
			const { data, error } = await api.accounting["payment-terms"].templates.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء القالب"));
			return data;
		},
		onSuccess: invalidate,
	});
	const updateTemplateMutation = useMutation({
		mutationFn: async ({
			id,
			input,
		}: {
			id: string;
			input: CreatePaymentTermsTemplateFormValues;
		}) => {
			const { data, error } = await api.accounting["payment-terms"]
				.templates({ id })
				.patch(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل القالب"));
			return data;
		},
		onSuccess: invalidate,
	});
	const deleteTemplateMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting["payment-terms"].templates({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف القالب"));
		},
		onSuccess: invalidate,
	});

	const wrap = <T>(promise: Promise<T>, loading: string, success: string) =>
		toast.promise(promise, { loading, success, error: (e: Error) => e.message });

	return {
		createTerm: (input: CreatePaymentTermFormValues) =>
			wrap(createTermMutation.mutateAsync(input), "جارٍ الإنشاء...", "تم إنشاء الشرط"),
		updateTerm: (id: string, input: CreatePaymentTermFormValues) =>
			wrap(updateTermMutation.mutateAsync({ id, input }), "جارٍ الحفظ...", "تم حفظ الشرط"),
		removeTerm: (id: string) =>
			wrap(deleteTermMutation.mutateAsync(id), "جارٍ الحذف...", "تم حذف الشرط"),
		createTemplate: (input: CreatePaymentTermsTemplateFormValues) =>
			wrap(createTemplateMutation.mutateAsync(input), "جارٍ الإنشاء...", "تم إنشاء القالب"),
		updateTemplate: (id: string, input: CreatePaymentTermsTemplateFormValues) =>
			wrap(updateTemplateMutation.mutateAsync({ id, input }), "جارٍ الحفظ...", "تم حفظ القالب"),
		removeTemplate: (id: string) =>
			wrap(deleteTemplateMutation.mutateAsync(id), "جارٍ الحذف...", "تم حذف القالب"),
		isSaving:
			createTermMutation.isPending ||
			updateTermMutation.isPending ||
			createTemplateMutation.isPending ||
			updateTemplateMutation.isPending,
	};
};
