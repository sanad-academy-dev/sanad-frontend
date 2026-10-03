import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	CreateOpeningInvoicesFormInput,
	OpeningInvoiceToolResult,
	OpeningToolStatus,
} from "@/server/accounting/opening/opening-invoice-tool.type";

/** [P12A.1] hooks for «الافتتاح» — the FR-17.3 opening-invoice mass-creation tool. */

const STATUS_KEY = ["accounting", "governance", "opening-status"] as const;

export const useOpeningToolStatus = () => {
	const { data, isLoading } = useQuery<OpeningToolStatus>({
		queryKey: STATUS_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting["opening-invoices"].status.get();
			if (error) throw new Error("تعذّر تحميل حالة أداة الافتتاح");
			return data as OpeningToolStatus;
		},
		staleTime: 1000 * 30,
	});
	return { status: data ?? null, isLoading };
};

export const useOpeningInvoiceActions = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: CreateOpeningInvoicesFormInput) => {
			const { data, error } = await api.accounting["opening-invoices"].post(input);
			if (error) {
				throw new Error(
					(error as { value?: { message?: string } })?.value?.message ??
						"فشل إنشاء فواتير الافتتاح",
				);
			}
			return data as OpeningInvoiceToolResult;
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["accounting"] });
		},
	});

	// the caller needs the RESULT (created rows + per-row errors) for the summary panel,
	// so return the underlying promise and let toast.promise observe it
	const createOpeningInvoices = (input: CreateOpeningInvoicesFormInput) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ إنشاء فواتير الافتتاح…",
			success: (result: OpeningInvoiceToolResult) =>
				result.errors.length === 0
					? `تم إنشاء ${result.created.length} فاتورة افتتاحية`
					: `تم إنشاء ${result.created.length} — تعذّر ${result.errors.length} (راجع الأخطاء أدناه)`,
			error: (error: Error) => error.message || "فشل إنشاء فواتير الافتتاح",
		});
		return promise;
	};

	return { createOpeningInvoices, isPending };
};
