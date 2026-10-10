import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ClinicNotificationSettingsResponse,
	UpdateNotificationsInput,
} from "@/server/notifications/notifications.type";

export const useUpdateNotifications = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: UpdateNotificationsInput,
		): Promise<ClinicNotificationSettingsResponse> => {
			const res = await api.notifications.patch(input);
			if (res.error) throw new Error("فشل تحديث إعدادات الإشعارات");
			return res.data as ClinicNotificationSettingsResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});

	const updateNotifications = (input: UpdateNotificationsInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ الإعدادات...",
			success: "تم حفظ إعدادات الإشعارات بنجاح",
			error: (err: Error) => err.message || "فشل حفظ إعدادات الإشعارات",
		});

	return { updateNotifications, isPending: mutation.isPending };
};
