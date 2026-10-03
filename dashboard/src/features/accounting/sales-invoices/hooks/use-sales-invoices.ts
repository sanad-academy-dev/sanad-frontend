import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateSalesInvoiceFormValues,
	SalesInvoiceListRow,
	SalesInvoiceResponse,
} from "@/server/accounting/sales-invoice/sales-invoice.type";

/** [P5.7] Data hooks for the ACCOUNTING Sales Invoice lifecycle (BRD §7.2). */

const QUERY_KEY = ["accounting", "sales-invoices"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["sales-invoices"];

export const useSalesInvoices = () => {
	const { data, isLoading } = useQuery<SalesInvoiceListRow[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل فواتير المبيعات"));
			return data as SalesInvoiceListRow[];
		},
		staleTime: 1000 * 30,
	});
	return { invoices: data ?? [], isLoading };
};

export const useSalesInvoice = (id: string | null) => {
	const { data, isLoading } = useQuery<SalesInvoiceResponse>({
		queryKey: [...QUERY_KEY, id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await resource({ id: id as string }).get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الفاتورة"));
			return data as SalesInvoiceResponse;
		},
	});
	return { invoice: data ?? null, isLoading };
};

export const useSalesInvoiceActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateSalesInvoiceFormValues) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الفاتورة"));
			return data as SalesInvoiceResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: CreateSalesInvoiceFormValues;
		}) => {
			const { data, error } = await resource({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ الفاتورة"));
			return data as SalesInvoiceResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر ترحيل الفاتورة"));
			return data as SalesInvoiceResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء الفاتورة"));
			return data as SalesInvoiceResponse;
		},
		onSuccess: invalidate,
	});
	const amendMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).amend.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء نسخة معدَّلة"));
			return data as SalesInvoiceResponse;
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
	const returnDraftMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id })["return-draft"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تجهيز المرتجع"));
			return data as CreateSalesInvoiceFormValues;
		},
	});
	const create = (input: CreateSalesInvoiceFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء المسودة...",
			success: "تم إنشاء مسودة الفاتورة",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: CreateSalesInvoiceFormValues) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ الفاتورة",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الترحيل...",
			success: (invoice) => `تم الترحيل برقم ${invoice.documentNo ?? ""}`,
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "أُلغيت الفاتورة وعُكست قيودها",
			error: (e: Error) => e.message,
		});
	const amend = (id: string) =>
		toast.promise(amendMutation.mutateAsync(id), {
			loading: "جارٍ إنشاء نسخة معدَّلة...",
			success: "أُنشئت مسودة معدَّلة",
			error: (e: Error) => e.message,
		});
	const remove = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ الحذف...",
			success: "حُذفت المسودة",
			error: (e: Error) => e.message,
		});
	/** «إنشاء مرتجع» — resolves with the negated pre-fill (BR-7.2.2) */
	const fetchReturnDraft = (id: string) => {
		const promise = returnDraftMutation.mutateAsync(id);
		toast.promise(promise, {
			loading: "جارٍ تجهيز المرتجع...",
			success: "جاهز — راجع الكميات ثم احفظ",
			error: (e: Error) => e.message,
		});
		return promise;
	};

	const isPending =
		createMutation.isPending ||
		updateMutation.isPending ||
		submitMutation.isPending ||
		cancelMutation.isPending ||
		amendMutation.isPending ||
		deleteMutation.isPending ||
		returnDraftMutation.isPending;

	return {
		create,
		update,
		submit,
		cancel,
		amend,
		remove,
		fetchReturnDraft,
		isPending,
	};
};
