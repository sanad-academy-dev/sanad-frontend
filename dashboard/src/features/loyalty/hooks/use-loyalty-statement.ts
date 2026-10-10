import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

/** [LY-P5] §10.5 — كشف الحركة عبر أولياء الأمور، والتسوية اليدوية (BR-L9.2). */

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export type StatementQuery = {
	ownerId?: string;
	kind?: "EARN" | "REDEEM" | "EXPIRY" | "REVERSAL" | "REDEMPTION_RESTORE" | "ADJUSTMENT";
	from?: string;
	to?: string;
};

export const useClinicLoyaltyStatement = (enabled: boolean, query: StatementQuery) => {
	const { data, isLoading } = useQuery({
		queryKey: ["loyalty", "clinic-statement", query],
		enabled,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty.statement.get({
				query: {
					...(query.ownerId ? { ownerId: query.ownerId } : {}),
					...(query.kind ? { kind: query.kind } : {}),
					...(query.from ? { from: query.from } : {}),
					...(query.to ? { to: query.to } : {}),
				},
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل كشف الحركة"));
			return data;
		},
	});
	return { entries: data ?? [], isLoading };
};

/**
 * BR-L9.2 — التسوية اليدوية. الرفض يصل من الخادم بالعربية ويُعرض كما هو: الحدود
 * (رصيدٌ لا يكفي للخصم، سببٌ قصير) قرارات عمل لا أعطال.
 */
export const useLoyaltyAdjustment = () => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: async (input: { ownerId: string; points: number; reason: string }) => {
			const { data, error } = await api.loyalty.adjustments.post(input);
			if (error) throw new Error(errorMessage(error, "تعذّر تسجيل التسوية"));
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["loyalty"] });
		},
	});

	const adjust = (input: { ownerId: string; points: number; reason: string }) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ تسجيل التسوية...",
			success: "سُجِّلت التسوية",
			error: (error: Error) => error.message || "تعذّر تسجيل التسوية",
		});

	return { adjust, isAdjusting: mutation.isPending };
};
