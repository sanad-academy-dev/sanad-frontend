import { useQuery } from "@tanstack/react-query";

import { GOVERNANCE_QUERY_KEY } from "@/features/accounting/governance/hooks/use-accounting-periods";
import { api } from "@/lib/api";
import type { AccountingReadiness } from "@/server/accounting/readiness/accounting-readiness.service";

/** [P12C.2] «جاهزية الترحيل» — قراءة فقط (contract KL-7). */

const QUERY_KEY = [...GOVERNANCE_QUERY_KEY, "readiness"] as const;

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useAccountingReadiness = () => {
	const { data, isLoading } = useQuery<AccountingReadiness>({
		queryKey: QUERY_KEY,
		queryFn: async () => {
			const { data, error } = await api.accounting.readiness.get();
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل حالة الجاهزية"));
			return data as AccountingReadiness;
		},
		// الجاهزية تتغيّر بفعل المستخدم على شاشات أخرى — مدّة قصيرة تُبقيها صادقة
		staleTime: 1000 * 15,
	});
	return { readiness: data ?? null, isLoading };
};
