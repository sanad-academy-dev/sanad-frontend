import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ClearanceVoucherRow } from "@/server/accounting/bank/bank-clearance.service";

/** [P11.4] Data hooks for «مقاصة البنك» — the FR-14.4 manual clearance tool. */

/** Same prefix as the other bank hooks — one invalidation refreshes the whole bank area. */
const QUERY_KEY = ["accounting", "bank"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export type ClearanceUpdate = {
	paymentDocument: ClearanceVoucherRow["paymentDocument"];
	voucherId: string;
	/** journal_entry clearance is row-level (P11.1) — REQUIRED for JE rows */
	rowId?: string | null;
	clearanceDate: string | null;
};

/** FR-14.4 — the UNCLEARED vouchers touching the bank GL in the range. */
export const useClearanceVouchers = (params: {
	bankAccountId: string | null;
	fromDate: string;
	toDate: string;
}) => {
	const enabled = !!params.bankAccountId && !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<ClearanceVoucherRow[]>({
		queryKey: [...QUERY_KEY, "clearance", params],
		enabled,
		queryFn: async () => {
			const { data, error } = await api.accounting["bank-transactions"].clearance.get({
				query: {
					bankAccountId: params.bankAccountId as string,
					fromDate: params.fromDate,
					toDate: params.toDate,
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل سندات المقاصة"));
			return data as ClearanceVoucherRow[];
		},
		staleTime: 1000 * 30,
	});
	return { vouchers: data ?? [], isLoading: enabled && isLoading };
};

export const useClearanceActions = () => {
	const queryClient = useQueryClient();

	const stampMutation = useMutation({
		mutationFn: async (updates: ClearanceUpdate[]) => {
			const { data, error } = await api.accounting["bank-transactions"].clearance.post({
				updates,
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تثبيت تاريخ المقاصة"));
			return data as { updated: number };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
			// the §18 bank reports read the same stamps
			queryClient.invalidateQueries({ queryKey: ["accounting", "reports"] });
		},
	});

	const stamp = (updates: ClearanceUpdate[]) =>
		toast.promise(stampMutation.mutateAsync(updates), {
			loading: "جارٍ تثبيت تاريخ المقاصة...",
			success: (result) => `تم تثبيت المقاصة على ${result.updated} سند`,
			error: (e: Error) => e.message,
		});

	return { stamp, isPending: stampMutation.isPending };
};
