import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	BankClearanceSummaryReport,
	BankReconciliationStatementReport,
} from "@/server/accounting/bank/bank-clearance.service";

/** [P11.4] §18 bank report hooks — read-only over the bank GL + clearance stamps. */

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

/** FR-14.5 — GL balance vs bank balance with every uncleared voucher explaining the delta. */
export const useBankReconciliationStatement = (params: {
	bankAccountId: string | null;
	asOf: string;
}) => {
	const enabled = !!params.bankAccountId && !!params.asOf;
	const { data, isLoading } = useQuery<BankReconciliationStatementReport>({
		queryKey: ["accounting", "reports", "bank-reconciliation-statement", params],
		enabled,
		queryFn: async () => {
			const { data, error } = await api.accounting.reports[
				"bank-reconciliation-statement"
			].get({
				query: { bankAccountId: params.bankAccountId as string, asOf: params.asOf },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل كشف التسوية البنكية"));
			return data as BankReconciliationStatementReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading: enabled && isLoading };
};

/** Bank clearance summary — vouchers on the bank GL in a range with their clearance stamps. */
export const useBankClearanceSummary = (params: {
	bankAccountId: string | null;
	fromDate: string;
	toDate: string;
}) => {
	const enabled = !!params.bankAccountId && !!params.fromDate && !!params.toDate;
	const { data, isLoading } = useQuery<BankClearanceSummaryReport>({
		queryKey: ["accounting", "reports", "bank-clearance-summary", params],
		enabled,
		queryFn: async () => {
			const { data, error } = await api.accounting.reports["bank-clearance-summary"].get({
				query: {
					bankAccountId: params.bankAccountId as string,
					fromDate: params.fromDate,
					toDate: params.toDate,
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل ملخص المقاصة"));
			return data as BankClearanceSummaryReport;
		},
		staleTime: 1000 * 30,
	});
	return { report: data ?? null, isLoading: enabled && isLoading };
};
