import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { AdvanceSource } from "@/server/accounting/payment-entry/advances.service";
import type { OutstandingForParty } from "@/server/accounting/payment-entry/get-outstanding.service";
import type {
	CreatePaymentEntryFormValues,
	PaymentEntryListRow,
	PaymentEntryResponse,
} from "@/server/accounting/payment-entry/payment-entry.type";
import type {
	ReconciliationAllocation,
	ReconciliationResult,
} from "@/server/accounting/payment-entry/reconciliation.service";
import type { UnreconcileSelection } from "@/server/accounting/payment-entry/unreconcile.service";

/** [P7.9] Data hooks for the Payment Entry lifecycle + reconciliation (BRD §7.4/§10). */

const QUERY_KEY = ["accounting", "payment-entries"] as const;
const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["payment-entries"];
const reconciliation = api.accounting["payment-reconciliation"];

export const usePaymentEntries = () => {
	const { data, isLoading } = useQuery<PaymentEntryListRow[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.get({ query: {} });
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل السندات"));
			return data as PaymentEntryListRow[];
		},
		staleTime: 1000 * 30,
	});
	return { entries: data ?? [], isLoading };
};

export const usePaymentEntry = (id: string | null) => {
	const { data, isLoading } = useQuery<PaymentEntryResponse>({
		queryKey: [...QUERY_KEY, id],
		enabled: !!id,
		queryFn: async () => {
			const { data, error } = await resource({ id: id as string }).get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل السند"));
			return data as PaymentEntryResponse;
		},
	});
	return { entry: data ?? null, isLoading };
};

/** FR-7.5.1 — the Get Outstanding dialog data (party-scoped, on demand) */
export const useGetOutstanding = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (params: { partyType: string; partyId: string }) => {
			const { data, error } = await resource.outstanding.get({ query: params });
			if (error) throw new Error(errorMessage(error, "تعذّر جلب المستحقات"));
			return data as OutstandingForParty;
		},
	});
	return { fetchOutstanding: mutateAsync, isFetching: isPending };
};

/** FR-11.1 — the invoice forms' advances fetch */
export const useGetAdvances = () => {
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (params: { partyType: string; partyId: string }) => {
			const { data, error } = await resource.advances.get({ query: params });
			if (error) throw new Error(errorMessage(error, "تعذّر جلب الدفعات المقدمة"));
			return data as AdvanceSource[];
		},
	});
	return { fetchAdvances: mutateAsync, isFetching: isPending };
};

export const usePaymentEntryActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		// settlements move invoice lists too
		queryClient.invalidateQueries({ queryKey: ["accounting", "sales-invoices"] });
		queryClient.invalidateQueries({ queryKey: ["accounting", "purchase-invoices"] });
	};

	const createMutation = useMutation({
		mutationFn: async (input: CreatePaymentEntryFormValues) => {
			const { data, error } = await resource.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء السند"));
			return data as PaymentEntryResponse;
		},
		onSuccess: invalidate,
	});
	const updateMutation = useMutation({
		mutationFn: async ({
			id,
			changes,
		}: {
			id: string;
			changes: CreatePaymentEntryFormValues;
		}) => {
			const { data, error } = await resource({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ السند"));
			return data as PaymentEntryResponse;
		},
		onSuccess: invalidate,
	});
	const submitMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).submit.post();
			if (error) throw new Error(errorMessage(error, "تعذّر ترحيل السند"));
			return data as PaymentEntryResponse;
		},
		onSuccess: invalidate,
	});
	const cancelMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).cancel.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إلغاء السند"));
			return data as PaymentEntryResponse;
		},
		onSuccess: invalidate,
	});
	const amendMutation = useMutation({
		mutationFn: async (id: string) => {
			const { data, error } = await resource({ id }).amend.post();
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء نسخة معدَّلة"));
			return data as PaymentEntryResponse;
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

	const create = (input: CreatePaymentEntryFormValues) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء المسودة...",
			success: "تم إنشاء مسودة السند",
			error: (e: Error) => e.message,
		});
	const update = (id: string, changes: CreatePaymentEntryFormValues) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ الحفظ...",
			success: "تم حفظ السند",
			error: (e: Error) => e.message,
		});
	const submit = (id: string) =>
		toast.promise(submitMutation.mutateAsync(id), {
			loading: "جارٍ الترحيل...",
			success: (entry) => `تم الترحيل برقم ${entry.documentNo ?? ""}`,
			error: (e: Error) => e.message,
		});
	const cancel = (id: string) =>
		toast.promise(cancelMutation.mutateAsync(id), {
			loading: "جارٍ الإلغاء...",
			success: "أُلغي السند وعُكست قيوده",
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

	const isPending =
		createMutation.isPending ||
		updateMutation.isPending ||
		submitMutation.isPending ||
		cancelMutation.isPending ||
		amendMutation.isPending ||
		deleteMutation.isPending;

	return { create, update, submit, cancel, amend, remove, isPending };
};

/* ── [P7.6/P7.7] reconciliation ───────────────────────────────────────────────────────── */

export const useReconciliationPanes = (partyType: string | null, partyId: string | null) => {
	const enabled = !!partyType && !!partyId;
	const { data, isLoading, refetch } = useQuery<OutstandingForParty>({
		queryKey: ["accounting", "payment-reconciliation", partyType, partyId],
		enabled,
		queryFn: async () => {
			const { data, error } = await reconciliation.get({
				query: { partyType: partyType as string, partyId: partyId as string },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل بيانات التسوية"));
			return data as OutstandingForParty;
		},
	});
	return {
		panes: data ?? { invoices: [], credits: [] },
		isLoading: enabled && isLoading,
		refetch,
	};
};

export const useReconciliationActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["accounting"] });
	};

	const reconcileMutation = useMutation({
		mutationFn: async (input: {
			partyType: string;
			partyId: string;
			allocations: ReconciliationAllocation[];
		}) => {
			const { data, error } = await reconciliation.reconcile.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّرت التسوية"));
			return data as ReconciliationResult[];
		},
		onSuccess: invalidate,
	});
	const unreconcileMutation = useMutation({
		mutationFn: async (input: {
			paymentType: string;
			paymentId: string;
			partyType: string;
			partyId: string;
			selections: UnreconcileSelection[];
		}) => {
			const { data, error } = await reconciliation.unreconcile.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر فك التسوية"));
			return data;
		},
		onSuccess: invalidate,
	});

	const reconcile = (input: {
		partyType: string;
		partyId: string;
		allocations: ReconciliationAllocation[];
	}) =>
		toast.promise(reconcileMutation.mutateAsync(input), {
			loading: "جارٍ التسوية...",
			success: (results: ReconciliationResult[]) => {
				const failed = results.filter((result) => !result.ok);
				return failed.length === 0
					? "تمت التسوية بالكامل"
					: `تمت ${results.length - failed.length} من ${results.length} — ${failed[0]?.error ?? ""}`;
			},
			error: (e: Error) => e.message,
		});
	const unreconcile = (input: {
		paymentType: string;
		paymentId: string;
		partyType: string;
		partyId: string;
		selections: UnreconcileSelection[];
	}) =>
		toast.promise(unreconcileMutation.mutateAsync(input), {
			loading: "جارٍ فك التسوية...",
			success: "فُكَّت التسوية واستُعيد المستحق",
			error: (e: Error) => e.message,
		});

	return {
		reconcile,
		unreconcile,
		isPending: reconcileMutation.isPending || unreconcileMutation.isPending,
	};
};
