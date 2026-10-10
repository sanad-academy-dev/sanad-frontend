import { useQuery } from "@tanstack/react-query";

import { formatAmount } from "@/features/accounting/utils/format-amount";
import { api } from "@/lib/api";

/**
 * [MI-P6] «رصيد مفتوح» — what this owner still owes the clinic, in one figure.
 *
 * WHY IT EXISTS (MI-P5 §10.3a, recorded as a §17 addition): when an insurer rejects part
 * of a claim and the operator re-bills the owner, the money becomes an Owner AR row in
 * the ledger while the operational invoice deliberately stays PAID. From that moment the
 * invoice alone cannot tell a receptionist what is owed — only the party ledger can. So
 * this chip goes on the owner profile AND on the pay screen, the two places a debt gets
 * noticed before the client walks out.
 *
 * Renders nothing at zero, and nothing when the reader lacks the ledger permission (the
 * query simply fails and we stay quiet) — a silent chip is correct, a lying one is not.
 */
export const OwnerOpenBalanceChip = ({ ownerId }: { ownerId: string | null | undefined }) => {
	const { data } = useQuery({
		queryKey: ["accounting", "party-open-balance", "Owner", ownerId ?? ""],
		enabled: Boolean(ownerId),
		staleTime: 1000 * 15,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.accounting
				.parties({ partyType: "Owner" })({ partyId: ownerId as string })
				["open-balance"].get();
			if (error) return null;
			return data;
		},
	});

	if (!data || Number(data.outstanding) <= 0) return null;

	return (
		<div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900">
			<span className="font-medium text-sm">رصيد مفتوح</span>
			<span className="font-semibold text-sm tabular-nums">
				{formatAmount(data.outstanding)} ر.س
			</span>
			<span className="text-xs">
				على {data.voucherCount} مستند — يُحصَّل بسند قبض على طرف «وليّ الأمر»
			</span>
		</div>
	);
};
