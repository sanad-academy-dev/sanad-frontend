import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateItemTaxTemplateFormValues,
	CreateTaxCategoryFormValues,
	CreateTaxRuleFormValues,
	CreateTaxTemplateFormValues,
	ItemTaxTemplateResponse,
	PurchaseTaxTemplateResponse,
	SalesTaxTemplateResponse,
	TaxCategoryResponse,
	TaxRuleResponse,
} from "@/server/accounting/tax/tax.type";
import type { CalcDoc, CalcResult } from "@/server/accounting/tax/tax-calculator";

/** [P4.4] Data hooks for the «الضرائب» hub (BRD §4.11) + the §8 preview sandbox. */

const KEY = (kind: string) => ["accounting", "tax", kind] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

function useTaxList<T>(kind: string, fetcher: () => Promise<T[]>) {
	const { data, isLoading } = useQuery<T[]>({
		queryKey: KEY(kind),
		queryFn: fetcher,
		staleTime: 1000 * 30,
	});
	return { rows: data ?? [], isLoading };
}

export const useSalesTaxTemplates = () =>
	useTaxList<SalesTaxTemplateResponse>("sales-templates", async () => {
		const { data, error } = await api.accounting.tax["sales-templates"].get();
		if (error) throw new Error(errorMessage(error, "تعذّر تحميل قوالب المبيعات"));
		return data as SalesTaxTemplateResponse[];
	});

export const usePurchaseTaxTemplates = () =>
	useTaxList<PurchaseTaxTemplateResponse>("purchase-templates", async () => {
		const { data, error } = await api.accounting.tax["purchase-templates"].get();
		if (error) throw new Error(errorMessage(error, "تعذّر تحميل قوالب المشتريات"));
		return data as PurchaseTaxTemplateResponse[];
	});

export const useItemTaxTemplates = () =>
	useTaxList<ItemTaxTemplateResponse>("item-templates", async () => {
		const { data, error } = await api.accounting.tax["item-templates"].get();
		if (error) throw new Error(errorMessage(error, "تعذّر تحميل قوالب الأصناف"));
		return data as ItemTaxTemplateResponse[];
	});

export const useTaxCategories = () =>
	useTaxList<TaxCategoryResponse>("categories", async () => {
		const { data, error } = await api.accounting.tax.categories.get();
		if (error) throw new Error(errorMessage(error, "تعذّر تحميل فئات الضريبة"));
		return data as TaxCategoryResponse[];
	});

export const useTaxRules = () =>
	useTaxList<TaxRuleResponse>("rules", async () => {
		const { data, error } = await api.accounting.tax.rules.get();
		if (error) throw new Error(errorMessage(error, "تعذّر تحميل قواعد الضريبة"));
		return data as TaxRuleResponse[];
	});

export const useTaxActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["accounting", "tax"] });

	const wrap = <T>(promise: Promise<T>, loading: string, success: string) =>
		toast.promise(
			promise.then((value) => {
				invalidate();
				return value;
			}),
			{ loading, success, error: (e: Error) => e.message },
		);

	const run = async <T>(
		call: () => Promise<{ data: T; error: unknown }>,
		fallback: string,
	): Promise<T> => {
		const { data, error } = await call();
		if (error) throw new Error(errorMessage(error, fallback));
		return data;
	};

	return {
		saveSalesTemplate: (input: CreateTaxTemplateFormValues, id?: string) =>
			wrap(
				run(
					() =>
						id
							? api.accounting.tax["sales-templates"]({ id }).patch(input)
							: api.accounting.tax["sales-templates"].post(input),
					"تعذّر حفظ القالب",
				),
				"جارٍ الحفظ...",
				"تم حفظ قالب المبيعات",
			),
		removeSalesTemplate: (id: string) =>
			wrap(
				run(() => api.accounting.tax["sales-templates"]({ id }).delete(), "تعذّر الحذف"),
				"جارٍ الحذف...",
				"تم الحذف",
			),
		savePurchaseTemplate: (input: CreateTaxTemplateFormValues, id?: string) =>
			wrap(
				run(
					() =>
						id
							? api.accounting.tax["purchase-templates"]({ id }).patch(input)
							: api.accounting.tax["purchase-templates"].post(input),
					"تعذّر حفظ القالب",
				),
				"جارٍ الحفظ...",
				"تم حفظ قالب المشتريات",
			),
		removePurchaseTemplate: (id: string) =>
			wrap(
				run(() => api.accounting.tax["purchase-templates"]({ id }).delete(), "تعذّر الحذف"),
				"جارٍ الحذف...",
				"تم الحذف",
			),
		saveItemTemplate: (input: CreateItemTaxTemplateFormValues, id?: string) =>
			wrap(
				run(
					() =>
						id
							? api.accounting.tax["item-templates"]({ id }).patch(input)
							: api.accounting.tax["item-templates"].post(input),
					"تعذّر حفظ القالب",
				),
				"جارٍ الحفظ...",
				"تم حفظ قالب الصنف",
			),
		removeItemTemplate: (id: string) =>
			wrap(
				run(() => api.accounting.tax["item-templates"]({ id }).delete(), "تعذّر الحذف"),
				"جارٍ الحذف...",
				"تم الحذف",
			),
		createCategory: (input: CreateTaxCategoryFormValues) =>
			wrap(
				run(() => api.accounting.tax.categories.post(input), "تعذّر إنشاء الفئة"),
				"جارٍ الإنشاء...",
				"تم إنشاء الفئة",
			),
		removeCategory: (id: string) =>
			wrap(
				run(() => api.accounting.tax.categories({ id }).delete(), "تعذّر الحذف"),
				"جارٍ الحذف...",
				"تم الحذف",
			),
		createRule: (input: CreateTaxRuleFormValues) =>
			wrap(
				run(() => api.accounting.tax.rules.post(input), "تعذّر إنشاء القاعدة"),
				"جارٍ الإنشاء...",
				"تم إنشاء القاعدة",
			),
		removeRule: (id: string) =>
			wrap(
				run(() => api.accounting.tax.rules({ id }).delete(), "تعذّر الحذف"),
				"جارٍ الحذف...",
				"تم الحذف",
			),
	};
};

/** [P4.4] the sandbox — POSTs the doc to the pure calculator, no persistence. */
export const useTaxPreview = () => {
	const { mutateAsync, isPending, data } = useMutation({
		mutationFn: async (doc: CalcDoc) => {
			const { data, error } = await api.accounting.tax.preview.post(doc as never);
			if (error) throw new Error(errorMessage(error, "تعذّر حساب المعاينة"));
			return data as CalcResult;
		},
	});
	return { preview: mutateAsync, result: data ?? null, isCalculating: isPending };
};
