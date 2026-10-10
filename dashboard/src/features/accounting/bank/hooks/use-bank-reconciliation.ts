import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { BankAccountResponse } from "@/server/accounting/bank/bank.type";
import type {
	AllocationInput,
	ReconciliationCandidate,
} from "@/server/accounting/bank/bank-reconciliation.service";
import type {
	BankTransactionResponse,
	BankTransactionStatus,
	ImportStatementFormInput,
	ImportStatementResult,
} from "@/server/accounting/bank/bank-transaction.type";
import type { BankImportMappingConfig } from "@/server/accounting/bank/statement-parser";

/** [P11.3] Data hooks for «التسوية البنكية» (BRD §14, FR-14.2). */

/** ALL bank queries key under this prefix — one invalidation clears the workspace. */
const QUERY_KEY = ["accounting", "bank"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["bank-transactions"];

/** The `/import-presets` row — the controller maps `BANK_IMPORT_PRESETS` to this shape. */
export type BankImportPreset = {
	key: string;
	labelAr: string;
	verified: boolean;
	config: BankImportMappingConfig;
};

export const useBankAccounts = () => {
	const { data, isLoading } = useQuery<BankAccountResponse[]>({
		queryKey: [...QUERY_KEY, "accounts"],
		queryFn: async () => {
			const { data, error } = await api.accounting.banks.accounts.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الحسابات البنكية"));
			return data as BankAccountResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { bankAccounts: data ?? [], isLoading };
};

export type BankTransactionsParams = {
	bankAccountId?: string;
	status?: BankTransactionStatus;
	fromDate?: string;
	toDate?: string;
};

export const useBankTransactions = (params: BankTransactionsParams) => {
	const { data, isLoading } = useQuery<BankTransactionResponse[]>({
		queryKey: [...QUERY_KEY, "transactions", params],
		queryFn: async () => {
			const { data, error } = await resource.get({
				query: {
					...(params.bankAccountId ? { bankAccountId: params.bankAccountId } : {}),
					...(params.status ? { status: params.status } : {}),
					...(params.fromDate ? { fromDate: params.fromDate } : {}),
					...(params.toDate ? { toDate: params.toDate } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل الحركات البنكية"));
			return data as BankTransactionResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { transactions: data ?? [], isLoading };
};

/** FR-14.2 — ranked book-side matches for ONE transaction; disabled until one is selected. */
export const useReconciliationCandidates = (transactionId: string | null) => {
	const enabled = !!transactionId;
	const { data, isLoading } = useQuery<ReconciliationCandidate[]>({
		queryKey: [...QUERY_KEY, "candidates", transactionId],
		enabled,
		queryFn: async () => {
			const { data, error } = await resource({ id: transactionId as string }).candidates.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل المطابقات المقترحة"));
			return data as ReconciliationCandidate[];
		},
	});
	return { candidates: data ?? [], isLoading: enabled && isLoading };
};

export const useImportPresets = () => {
	const { data, isLoading } = useQuery<BankImportPreset[]>({
		queryKey: [...QUERY_KEY, "import-presets"],
		queryFn: async () => {
			const { data, error } = await resource["import-presets"].get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل قوالب الاستيراد"));
			return data as BankImportPreset[];
		},
		staleTime: 1000 * 60 * 5,
	});
	return { presets: data ?? [], isLoading };
};

export const useBankReconciliationActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: QUERY_KEY });
	};
	// the "book it now" actions create vouchers, so their lists must refetch too
	const invalidateWithVouchers = () => {
		invalidate();
		queryClient.invalidateQueries({ queryKey: ["accounting", "journal-entries"] });
		queryClient.invalidateQueries({ queryKey: ["accounting", "payment-entries"] });
	};

	const allocateMutation = useMutation({
		mutationFn: async (input: { transactionId: string; allocations: AllocationInput[] }) => {
			const { data, error } = await resource({ id: input.transactionId }).allocate.post({
				allocations: input.allocations,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تخصيص المطابقة"));
			return data as BankTransactionResponse;
		},
		onSuccess: invalidate,
	});
	const unallocateMutation = useMutation({
		mutationFn: async (input: { transactionId: string; paymentId: string }) => {
			const { data, error } = await resource({ id: input.transactionId })
				.unallocate({ paymentId: input.paymentId })
				.post();
			if (error) throw new Error(errorMessage(error, "تعذّر فك التخصيص"));
			return data as BankTransactionResponse;
		},
		onSuccess: invalidate,
	});
	const createJournalEntryMutation = useMutation({
		mutationFn: async (input: {
			transactionId: string;
			contraAccountId: string;
			remark?: string | null;
		}) => {
			const { data, error } = await resource({ id: input.transactionId })[
				"create-journal-entry"
			].post({ contraAccountId: input.contraAccountId, remark: input.remark ?? null });
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء قيد اليومية"));
			return data;
		},
		onSuccess: invalidateWithVouchers,
	});
	const createPaymentEntryMutation = useMutation({
		mutationFn: async (input: {
			transactionId: string;
			partyType: string;
			partyId: string;
			/** [P12A-fix5] المستخدم أقرّ صراحةً أن هذه دفعة منفصلة عن الحركة المطابقة */
			confirmDuplicate?: boolean;
		}) => {
			const { data, error } = await resource({ id: input.transactionId })[
				"create-payment-entry"
			].post({
				partyType: input.partyType,
				partyId: input.partyId,
				confirmDuplicate: input.confirmDuplicate === true,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء سند الدفع"));
			return data;
		},
		onSuccess: invalidateWithVouchers,
	});
	const internalTransferMutation = useMutation({
		mutationFn: async (input: {
			transactionId: string;
			counterpartTransactionId?: string;
		}) => {
			const { data, error } = await resource({ id: input.transactionId })[
				"internal-transfer"
			].post(
				input.counterpartTransactionId
					? { counterpartTransactionId: input.counterpartTransactionId }
					: {},
			);
			if (error) throw new Error(errorMessage(error, "تعذّرت مطابقة التحويل الداخلي"));
			return data;
		},
		onSuccess: invalidateWithVouchers,
	});
	const importMutation = useMutation({
		mutationFn: async (input: ImportStatementFormInput) => {
			const { data, error } = await resource.import.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر استيراد الكشف"));
			return data as ImportStatementResult;
		},
		onSuccess: invalidate,
	});

	const allocate = (transactionId: string, allocations: AllocationInput[]) =>
		toast.promise(allocateMutation.mutateAsync({ transactionId, allocations }), {
			loading: "جارٍ التسوية...",
			success: "تم تخصيص المطابقة وتحديث حالة الحركة",
			error: (e: Error) => e.message,
		});
	const unallocate = (transactionId: string, paymentId: string) =>
		toast.promise(unallocateMutation.mutateAsync({ transactionId, paymentId }), {
			loading: "جارٍ فك التخصيص...",
			success: "فُكَّ التخصيص وأُزيل تاريخ المقاصة",
			error: (e: Error) => e.message,
		});
	const createJournalEntry = (
		transactionId: string,
		input: { contraAccountId: string; remark?: string | null },
	) =>
		toast.promise(createJournalEntryMutation.mutateAsync({ transactionId, ...input }), {
			loading: "جارٍ إنشاء القيد...",
			success: "أُنشئ قيد اليومية وخُصص للحركة",
			error: (e: Error) => e.message,
		});
	const createPaymentEntry = (
		transactionId: string,
		input: { partyType: string; partyId: string; confirmDuplicate?: boolean },
	) =>
		toast.promise(createPaymentEntryMutation.mutateAsync({ transactionId, ...input }), {
			loading: "جارٍ إنشاء السند...",
			success: "أُنشئ سند الدفع وخُصص للحركة",
			error: (e: Error) => e.message,
		});
	const internalTransfer = (transactionId: string, counterpartTransactionId?: string) =>
		toast.promise(
			internalTransferMutation.mutateAsync({ transactionId, counterpartTransactionId }),
			{
				loading: "جارٍ مطابقة التحويل الداخلي...",
				success: "تمت مطابقة التحويل الداخلي وقُيّد التحويل",
				error: (e: Error) => e.message,
			},
		);
	/** Returns the result so the import dialog can render the summary in place. */
	const importStatement = (input: ImportStatementFormInput) => {
		const promise = importMutation.mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ استيراد الكشف...",
			success: (result: ImportStatementResult) =>
				`اكتمل الاستيراد: ${result.importedRows} حركة جديدة`,
			error: (e: Error) => e.message,
		});
		return promise;
	};

	const isPending =
		allocateMutation.isPending ||
		unallocateMutation.isPending ||
		createJournalEntryMutation.isPending ||
		createPaymentEntryMutation.isPending ||
		internalTransferMutation.isPending ||
		importMutation.isPending;

	return {
		allocate,
		unallocate,
		createJournalEntry,
		createPaymentEntry,
		internalTransfer,
		importStatement,
		isPending,
	};
};
