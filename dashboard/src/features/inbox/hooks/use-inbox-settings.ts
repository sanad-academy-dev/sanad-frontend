import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import {
	DEFAULT_INBOX_SETTINGS,
	type InboxSettingsResponse,
} from "@sanad/contracts/runtime/server/inbox-settings/inbox-settings.type";

// تفضيلات التنبيه المباشر للمستخدم الحالي في الأكاديمية النشطة
export function useInboxSettings() {
	const query = useQuery<InboxSettingsResponse>({
		queryKey: ["inbox-settings"],
		queryFn: async () => {
			const res = await api["inbox-settings"].get();
			if (res.error) throw new Error("تعذّر تحميل إعدادات الوارد");
			return res.data;
		},
		staleTime: 1000 * 60 * 5,
	});

	// الافتراضيات حتى يصل الرد — حتى لا يُكتم أوّل إشعار بسبب التحميل
	return { settings: query.data ?? DEFAULT_INBOX_SETTINGS, isLoading: query.isLoading };
}
