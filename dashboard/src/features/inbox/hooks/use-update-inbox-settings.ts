import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	InboxSettingsResponse,
	UpdateInboxSettingsInput,
} from "@/server/inbox-settings/inbox-settings.type";

export function useUpdateInboxSettings() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: UpdateInboxSettingsInput): Promise<InboxSettingsResponse> => {
			const res = await api["inbox-settings"].patch(input);
			if (res.error) throw new Error("فشل تحديث إعدادات الوارد");
			return res.data;
		},
		onSuccess: (data) => {
			// اكتب الرد مباشرة حتى يلتقط مستمع البثّ التفضيل الجديد فورًا
			queryClient.setQueryData(["inbox-settings"], data);
		},
	});

	const updateInboxSettings = (input: UpdateInboxSettingsInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ الإعدادات...",
			success: "تم حفظ إعدادات الوارد بنجاح",
			error: (err: Error) => err.message || "فشل حفظ إعدادات الوارد",
		});

	return { updateInboxSettings, isPending: mutation.isPending };
}
