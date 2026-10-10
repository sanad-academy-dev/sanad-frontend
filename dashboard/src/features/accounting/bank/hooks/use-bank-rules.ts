import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { RuleRunResult } from "@/server/accounting/bank/bank-rules.service";
import type {
	BankRuleResponse,
	UpsertBankRuleFormInput,
} from "@/server/accounting/bank/bank-transaction.type";

/** [P12A.3] Data hooks for «قواعد البنك» (FR-14.3). */

/** under the shared bank prefix — the reconciliation invalidations clear rules too */
const QUERY_KEY = ["accounting", "bank", "rules"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

const resource = api.accounting["bank-transactions"];

export const useBankRules = () => {
	const { data, isLoading } = useQuery<BankRuleResponse[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await resource.rules.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل قواعد البنك"));
			return data as BankRuleResponse[];
		},
		staleTime: 1000 * 30,
	});
	return { rules: data ?? [], isLoading };
};

export const useBankRuleActions = () => {
	const queryClient = useQueryClient();
	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: QUERY_KEY });
	};
	// the sweep books JEs and settles transactions, so the whole bank workspace refetches
	const invalidateAfterRun = () => {
		queryClient.invalidateQueries({ queryKey: ["accounting", "bank"] });
		queryClient.invalidateQueries({ queryKey: ["accounting", "journal-entries"] });
	};

	const upsertMutation = useMutation({
		mutationFn: async (input: UpsertBankRuleFormInput & { id?: string }) => {
			const { data, error } = await resource.rules.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر حفظ القاعدة"));
			return data as BankRuleResponse;
		},
		onSuccess: invalidate,
	});
	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await resource.rules({ ruleId: id }).delete();
			if (error) throw new Error(errorMessage(error, "تعذّر حذف القاعدة"));
		},
		onSuccess: invalidate,
	});
	const runMutation = useMutation({
		mutationFn: async () => {
			const { data, error } = await resource.rules.apply.post();
			if (error) throw new Error(errorMessage(error, "تعذّر تشغيل القواعد"));
			return data as RuleRunResult;
		},
		onSuccess: invalidateAfterRun,
	});

	const upsertRule = (input: UpsertBankRuleFormInput & { id?: string }) =>
		toast.promise(upsertMutation.mutateAsync(input), {
			loading: "جارٍ حفظ القاعدة...",
			success: input.id ? "تم حفظ القاعدة" : "أُنشئت القاعدة",
			error: (e: Error) => e.message,
		});
	const deleteRule = (id: string) =>
		toast.promise(deleteMutation.mutateAsync(id), {
			loading: "جارٍ حذف القاعدة...",
			success: "حُذفت القاعدة",
			error: (e: Error) => e.message,
		});
	/** Returns the run result so the page can render the scanned/settled panel in place. */
	const runRules = () => {
		const promise = runMutation.mutateAsync();
		toast.promise(promise, {
			loading: "جارٍ تشغيل القواعد...",
			success: (result: RuleRunResult) =>
				`اكتمل التشغيل: فُحصت ${result.scanned} حركة وسُوّيت ${result.settled.length}`,
			error: (e: Error) => e.message,
		});
		return promise;
	};

	const isPending =
		upsertMutation.isPending || deleteMutation.isPending || runMutation.isPending;

	return { upsertRule, deleteRule, runRules, isPending };
};
