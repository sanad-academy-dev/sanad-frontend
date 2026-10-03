import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { VitalSignsRecordResponse } from "@/server/vital-signs/vital-signs.type";

export const vitalSignsKeys = {
	list: (patientId: string, limit: number, offset: number) =>
		["vital-signs", patientId, limit, offset] as const,
	latest: (patientId: string) => ["vital-signs", "latest", patientId] as const,
	/** جذر مفاتيح الطفل — تُبطَّل به كل استعلاماته دفعة واحدة بعد أي كتابة */
	patient: (patientId: string) => ["vital-signs", patientId] as const,
};

export const useVitalSigns = (
	patientId: string,
	{ limit = 50, offset = 0 }: { limit?: number; offset?: number } = {},
) => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: vitalSignsKeys.list(patientId, limit, offset),
		enabled: !!patientId,
		queryFn: async () => {
			const { data, error } = await api["vital-signs"].get({
				query: { patientId, limit, offset },
			});
			if (error) throw new Error("تعذّر تحميل سجل العلامات الحيوية");
			return data;
		},
		staleTime: 1000 * 60,
	});

	return {
		records: (data?.rows ?? []) as VitalSignsRecordResponse[],
		total: data?.total ?? 0,
		isLoading,
		error,
		refetch,
	};
};

/**
 * آخر قياس صالح للاقتراح. الخادم يستبعد المُصحَّح والمحذوف، فما يصل هنا هو ما
 * يجوز ربطه بمستند جديد مباشرةً.
 */
export const useLatestVitalSigns = (patientId: string) => {
	const { data, isLoading, refetch } = useQuery({
		queryKey: vitalSignsKeys.latest(patientId),
		enabled: !!patientId,
		queryFn: async () => {
			const { data, error } = await api["vital-signs"].latest.get({ query: { patientId } });
			if (error) throw new Error("تعذّر تحميل آخر قياس");
			return data;
		},
		staleTime: 1000 * 30,
	});

	return { latest: (data ?? null) as VitalSignsRecordResponse | null, isLoading, refetch };
};
