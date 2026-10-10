import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	LoyaltyLedgerEntryResponse,
	OwnerLoyaltySummary,
} from "@/server/loyalty/loyalty-ledger/loyalty-ledger.type";

/** [LY-P1] §10.3 — رصيد وليّ الأمر وكشف حسابه. */

const OWNER_KEY = (ownerId: string) => ["loyalty", "owner", ownerId] as const;

/**
 * الملخّص **صامتٌ عند الفشل**: ملفّ وليّ الأمر شاشةٌ عامّة، ومن لا يملك صلاحية دفتر النقاط
 * يُردّ ٤٠٣ — وهي حالةٌ متوقّعة لا عطل. تُعاد `null` فتختفي الشريحة، ولا `retry` يكرّر
 * طلبًا محسومًا. (نفس ما تفعله شريحة الرصيد المفتوح في MI-P6.)
 */
export const useOwnerLoyaltySummary = (ownerId: string | null | undefined) => {
	const { data } = useQuery<OwnerLoyaltySummary | null>({
		queryKey: [...OWNER_KEY(ownerId ?? ""), "summary"],
		enabled: Boolean(ownerId),
		staleTime: 1000 * 15,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty
				.owners({ ownerId: ownerId as string })
				.summary.get();
			if (error) return null;
			return data as OwnerLoyaltySummary;
		},
	});
	return { summary: data ?? null };
};

/** الكشف يُطلب عند الفتح فقط — لا يُحمَّل عمرُ وليّ الأمر خلف شريحة مغلقة. */
export const useOwnerLoyaltyStatement = (
	ownerId: string | null | undefined,
	open: boolean,
) => {
	const { data, isLoading } = useQuery<LoyaltyLedgerEntryResponse[]>({
		queryKey: [...OWNER_KEY(ownerId ?? ""), "statement"],
		enabled: Boolean(ownerId) && open,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty
				.owners({ ownerId: ownerId as string })
				.statement.get({ query: {} });
			if (error) throw new Error("تعذّر تحميل كشف النقاط");
			return data as LoyaltyLedgerEntryResponse[];
		},
	});
	return { entries: data ?? [], isLoading };
};
