import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	BankAccountResponse,
	BankResponse,
	UpsertBankAccountFormInput,
	UpsertBankFormInput,
} from "@/server/accounting/bank/bank.type";

/** [P11.1] Data hooks for the Bank + Bank Account masters (BRD §14). */

/** Same prefix as `use-bank-reconciliation.ts` — one invalidation refreshes the whole bank area. */
const QUERY_KEY = ["accounting", "bank"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useBanks = () => {
	const { data, isLoading } = useQuery<BankResponse[]>({
		queryKey: [...QUERY_KEY, "banks"],
		queryFn: async () => {
			const { data, error } = await api.accounting.banks.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل البنوك"));
			return data as BankResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { banks: data ?? [], isLoading };
};

export const useBankActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: QUERY_KEY });
	};

	const createBankMutation = useMutation({
		mutationFn: async (input: UpsertBankFormInput) => {
			const { data, error } = await api.accounting.banks.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء البنك"));
			return data as BankResponse;
		},
		onSuccess: invalidate,
	});
	const updateBankMutation = useMutation({
		mutationFn: async (input: { id: string; changes: Partial<UpsertBankFormInput> }) => {
			const { data, error } = await api.accounting
				.banks({ id: input.id })
				.patch(input.changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل البنك"));
			return data as BankResponse;
		},
		onSuccess: invalidate,
	});
	const removeBankMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting.banks({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف البنك"));
		},
		onSuccess: invalidate,
	});
	const createAccountMutation = useMutation({
		mutationFn: async (input: UpsertBankAccountFormInput) => {
			const { data, error } = await api.accounting.banks.accounts.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الحساب البنكي"));
			return data as BankAccountResponse;
		},
		onSuccess: invalidate,
	});
	const updateAccountMutation = useMutation({
		mutationFn: async (input: {
			id: string;
			changes: Partial<UpsertBankAccountFormInput>;
		}) => {
			const { data, error } = await api.accounting.banks
				.accounts({ id: input.id })
				.patch(input.changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل الحساب البنكي"));
			return data as BankAccountResponse;
		},
		onSuccess: invalidate,
	});

	const createBank = (input: UpsertBankFormInput) =>
		toast.promise(createBankMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء البنك...",
			success: "تم إنشاء البنك",
			error: (e: Error) => e.message,
		});
	const updateBank = (id: string, changes: Partial<UpsertBankFormInput>) =>
		toast.promise(updateBankMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ حفظ التعديلات...",
			success: "تم حفظ التعديلات",
			error: (e: Error) => e.message,
		});
	const setBankDisabled = (id: string, disabled: boolean) =>
		toast.promise(updateBankMutation.mutateAsync({ id, changes: { disabled } }), {
			loading: disabled ? "جارٍ التعطيل..." : "جارٍ التفعيل...",
			success: disabled ? "تم تعطيل البنك" : "تم تفعيل البنك",
			error: (e: Error) => e.message,
		});
	const removeBank = (id: string) =>
		toast.promise(removeBankMutation.mutateAsync(id), {
			loading: "جارٍ حذف البنك...",
			success: "تم حذف البنك",
			error: (e: Error) => e.message,
		});
	const createAccount = (input: UpsertBankAccountFormInput) =>
		toast.promise(createAccountMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء الحساب البنكي...",
			success: "تم إنشاء الحساب البنكي",
			error: (e: Error) => e.message,
		});
	const updateAccount = (id: string, changes: Partial<UpsertBankAccountFormInput>) =>
		toast.promise(updateAccountMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ حفظ التعديلات...",
			success: "تم حفظ التعديلات",
			error: (e: Error) => e.message,
		});

	const isSaving =
		createBankMutation.isPending ||
		updateBankMutation.isPending ||
		createAccountMutation.isPending ||
		updateAccountMutation.isPending;

	return {
		createBank,
		updateBank,
		setBankDisabled,
		removeBank,
		createAccount,
		updateAccount,
		isSaving,
		isMutating: isSaving || removeBankMutation.isPending,
	};
};
