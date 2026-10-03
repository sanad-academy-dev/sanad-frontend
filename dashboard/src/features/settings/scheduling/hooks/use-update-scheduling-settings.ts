import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ClinicSchedulingSettingsResponse,
	UpdateSchedulingSettingsInput,
} from "@/server/scheduling/scheduling.type";

export const useUpdateSchedulingSettings = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: UpdateSchedulingSettingsInput,
		): Promise<ClinicSchedulingSettingsResponse> => {
			const res = await api.scheduling.patch(input);
			if (res.error) throw new Error("فشل تحديث إعدادات الجدولة");
			return res.data as ClinicSchedulingSettingsResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["scheduling-settings"] });
		},
	});

	const updateSchedulingSettings = (input: UpdateSchedulingSettingsInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ إعدادات الجدولة...",
			success: "تم حفظ إعدادات الجدولة بنجاح",
			error: (err: Error) => err.message || "فشل حفظ إعدادات الجدولة",
		});

	return { updateSchedulingSettings, isPending: mutation.isPending };
};
