import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateAccountFormInput,
	LedgerAccountResponse,
	UpdateAccountFormInput,
} from "@/server/accounting/account/account.type";
import type { ImportPlan } from "@/server/accounting/account/coa-import";

/**
 * [P1.2] Data hooks for the Chart of Accounts. Every mutation invalidates the whole tree
 * because a structural change (create/move/delete) re-projects `lft`/`rgt` across the tree,
 * not just the touched row.
 */

const QUERY_KEY = ["accounting", "accounts"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useAccounts = () => {
	const { data, isLoading, refetch } = useQuery<LedgerAccountResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting.accounts.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل شجرة الحسابات"));
			return data as LedgerAccountResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { accounts: data ?? [], isLoading, refetch };
};

export const useAccountActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const createMutation = useMutation({
		mutationFn: async (input: CreateAccountFormInput) => {
			const { data, error } = await api.accounting.accounts.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر إنشاء الحساب"));
			return data as LedgerAccountResponse;
		},
		onSuccess: invalidate,
	});

	const updateMutation = useMutation({
		mutationFn: async ({ id, changes }: { id: string; changes: UpdateAccountFormInput }) => {
			const { data, error } = await api.accounting.accounts({ id }).patch(changes);
			if (error) throw new Error(errorMessage(error, "تعذّر تعديل الحساب"));
			return data as LedgerAccountResponse;
		},
		onSuccess: invalidate,
	});

	const moveMutation = useMutation({
		mutationFn: async ({
			id,
			parentAccountId,
		}: {
			id: string;
			parentAccountId: string | null;
		}) => {
			const { data, error } = await api.accounting
				.accounts({ id })
				.move.post({ parentAccountId });
			if (error) throw new Error(errorMessage(error, "تعذّر نقل الحساب"));
			return data as LedgerAccountResponse;
		},
		onSuccess: invalidate,
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.accounting.accounts({ id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف الحساب"));
		},
		onSuccess: invalidate,
	});

	const create = (input: CreateAccountFormInput) =>
		toast.promise(createMutation.mutateAsync(input), {
			loading: "جارٍ إنشاء الحساب...",
			success: "تم إنشاء الحساب",
			error: (e: Error) => e.message,
		});

	const update = (id: string, changes: UpdateAccountFormInput) =>
		toast.promise(updateMutation.mutateAsync({ id, changes }), {
			loading: "جارٍ حفظ التعديلات...",
			success: "تم حفظ التعديلات",
			error: (e: Error) => e.message,
		});

	const setDisabled = (id: string, disabled: boolean) =>
		toast.promise(updateMutation.mutateAsync({ id, changes: { disabled } }), {
			loading: disabled ? "جارٍ التعطيل..." : "جارٍ التفعيل...",
			success: disabled ? "تم تعطيل الحساب" : "تم تفعيل الحساب",
			error: (e: Error) => e.message,
		});

	const move = (id: string, parentAccountId: string | null) =>
		toast.promise(moveMutation.mutateAsync({ id, parentAccountId }), {
			loading: "جارٍ نقل الحساب...",
			success: "تم نقل الحساب",
			error: (e: Error) => e.message,
		});

	const remove = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ حذف الحساب...",
			success: "تم حذف الحساب",
			error: (e: Error) => e.message,
		});

	return {
		create,
		update,
		setDisabled,
		move,
		remove,
		isSaving: createMutation.isPending || updateMutation.isPending,
		isMutating:
			createMutation.isPending ||
			updateMutation.isPending ||
			moveMutation.isPending ||
			deleteMutation.isPending,
	};
};

/** [P1.3] CoA importer actions: dry-run preview, commit, and apply the Standard chart. */
export const useAccountImport = () => {
	const queryClient = useQueryClient();
	const invalidate = () => queryClient.invalidateQueries({ queryKey: QUERY_KEY });

	const preview = async (csv: string): Promise<ImportPlan> => {
		const { data, error } = await api.accounting.accounts.import.preview.post({ csv });
		if (error) throw new Error(errorMessage(error, "تعذّرت المعاينة"));
		return data as ImportPlan;
	};

	const commit = (csv: string) =>
		toast.promise(
			(async () => {
				const { data, error } = await api.accounting.accounts.import.commit.post({ csv });
				if (error) throw new Error(errorMessage(error, "تعذّر الاستيراد"));
				invalidate();
				return `تم استيراد ${(data as { created: number }).created} حساب`;
			})(),
			{ loading: "جارٍ الاستيراد...", success: (m) => m, error: (e: Error) => e.message },
		);

	const applyStandard = () =>
		toast.promise(
			(async () => {
				const { data, error } = await api.accounting.accounts.import["seed-standard"].post();
				if (error) throw new Error(errorMessage(error, "تعذّر تطبيق الشجرة القياسية"));
				invalidate();
				return `تمت إضافة ${(data as { created: number }).created} حساب`;
			})(),
			{ loading: "جارٍ التطبيق...", success: (m) => m, error: (e: Error) => e.message },
		);

	return { preview, commit, applyStandard };
};
