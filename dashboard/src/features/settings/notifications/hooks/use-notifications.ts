import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicNotificationSettingsResponse } from "@/server/notifications/notifications.type";

export const useNotifications = () => {
	const { data, isLoading } = useQuery<ClinicNotificationSettingsResponse>({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await api.notifications.get();
			if (res.error) throw new Error("فشل جلب إعدادات الإشعارات");
			return res.data as ClinicNotificationSettingsResponse;
		},
	});

	return { notifications: data, isLoading };
};
