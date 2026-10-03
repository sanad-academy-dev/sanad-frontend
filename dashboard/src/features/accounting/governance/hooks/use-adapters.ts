import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	AdapterKey,
	AdapterRunResult,
	SourceModuleAdapter,
} from "@/server/accounting/adapters/adapter.type";

/** [P12A.2e] hooks for «المحولات» — §C3 run-control over the source-module adapters. */

const QUERY_KEY = ["accounting", "governance", "adapters"] as const;

/** GET /accounting/adapters row — registry metadata + live unreversed-postings count. */
export type AdapterListRow = Pick<SourceModuleAdapter, "key" | "flagKey" | "labelAr"> & {
	postings: number;
};

export const useAdapters = () => {
	const { data, isLoading } = useQuery<AdapterListRow[]>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting.adapters.get();
			if (error) throw new Error("تعذّر تحميل المحولات");
			return data as AdapterListRow[];
		},
		staleTime: 1000 * 30,
	});
	return { adapters: data ?? [], isLoading };
};

export const useAdapterActions = () => {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { key: AdapterKey; fromDate: string; toDate: string }) => {
			const { data, error } = await api.accounting
				.adapters({ key: input.key })
				.run.post({ fromDate: input.fromDate, toDate: input.toDate });
			if (error) {
				throw new Error(
					(error as { value?: { message?: string } })?.value?.message ?? "فشل تشغيل المحول",
				);
			}
			return data as AdapterRunResult;
		},
		// a run posts real GLEs — refresh every accounting read (ledgers, reports, counts)
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["accounting"] });
		},
	});

	// the caller needs the RESULT (posted/reversed/errors) for the run panel, so return the
	// underlying promise and let toast.promise observe it — the opening-tool pattern
	const runAdapter = (input: { key: AdapterKey; fromDate: string; toDate: string }) => {
		const promise = mutateAsync(input);
		toast.promise(promise, {
			loading: "جارٍ تشغيل المحول…",
			success: (result: AdapterRunResult) =>
				result.errors.length === 0
					? `اكتمل التشغيل: ${result.posted.length} ترحيل · ${result.reversed.length} عكس`
					: `اكتمل التشغيل: ${result.posted.length} ترحيل — تعذّر ${result.errors.length} (راجع الأخطاء أدناه)`,
			error: (error: Error) => error.message || "فشل تشغيل المحول",
		});
		return promise;
	};

	return { runAdapter, isPending };
};
