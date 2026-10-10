import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicSettingsResponse } from "@/server/settings/settings.type";

export const useClinicInfo = () => {
	const { data, isLoading } = useQuery<ClinicSettingsResponse>({
		queryKey: ["settings"],
		queryFn: async () => {
			const res = await api.settings.get();
			if (res.error) throw new Error("فشل جلب معلومات الأكاديمية");
			return res.data as ClinicSettingsResponse;
		},
	});

	return { clinicInfo: data, isLoading };
};
