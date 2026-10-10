import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicSchedulingSettingsResponse } from "@/server/scheduling/scheduling.type";

export const useSchedulingSettings = () => {
	const { data, isLoading } = useQuery<ClinicSchedulingSettingsResponse>({
		queryKey: ["scheduling-settings"],
		queryFn: async () => {
			const res = await api.scheduling.get();
			if (res.error) throw new Error("فشل جلب إعدادات الجدولة");
			return res.data as ClinicSchedulingSettingsResponse;
		},
	});

	return { schedulingSettings: data, isLoading };
};
