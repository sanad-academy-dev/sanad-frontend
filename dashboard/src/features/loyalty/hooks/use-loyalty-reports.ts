import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

/** [LY-P4] §11 — تقريرا الالتزام والحركة. */

const errorMessage = (error: unknown, fallback: string): string =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

/**
 * §11.1 — الالتزام القائم. البوابة §0.3 ترفض بـ٤٠٠ حين تكون الوحدة مطفأة، وهي الحالة
 * المتوقّعة لا عطل — فتُعاد `null` بدل تنبيهٍ أحمر عن وضعٍ طبيعي.
 */
export const useLoyaltyLiability = (enabled: boolean) => {
	const { data, isLoading } = useQuery({
		queryKey: ["loyalty", "reports", "liability"],
		enabled,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty.reports.liability.get();
			if (error) return null;
			return data;
		},
	});
	return { liability: data ?? null, isLoading };
};

export const useLoyaltyActivity = (enabled: boolean, from?: string, to?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["loyalty", "reports", "activity", from ?? null, to ?? null],
		enabled,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty.reports.activity.get({
				query: { ...(from ? { from } : {}), ...(to ? { to } : {}) },
			});
			if (error) throw new Error(errorMessage(error, "تعذّر تحميل تقرير الحركة"));
			return data;
		},
	});
	return { activity: data ?? null, isLoading };
};

/** §11.3 — توزيع المستويات (من لقطة المهمّة، ومعه ختم وقتها). */
export const useLoyaltyTierDistribution = (enabled: boolean) => {
	const { data, isLoading } = useQuery({
		queryKey: ["loyalty", "reports", "tier-distribution"],
		enabled,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty.reports["tier-distribution"].get();
			if (error) return null;
			return data;
		},
	});
	return { distribution: data ?? null, isLoading };
};

/** §11.4 — من توشك نقاطهم أن تنتهي. */
export const useLoyaltyExpiringSoon = (enabled: boolean, days?: number) => {
	const { data, isLoading } = useQuery({
		queryKey: ["loyalty", "reports", "expiring-soon", days ?? null],
		enabled,
		retry: false,
		queryFn: async () => {
			const { data, error } = await api.loyalty.reports["expiring-soon"].get({
				query: days ? { days } : {},
			});
			if (error) return null;
			return data;
		},
	});
	return { expiring: data ?? null, isLoading };
};
