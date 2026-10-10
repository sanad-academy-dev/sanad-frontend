import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { ClinicSettingsResponse } from "@/server/settings/settings.type";

export type UpdateSchedulingCustomizationInput = Partial<
	Pick<ClinicSettingsResponse, "timezone" | "calendarType" | "timeFormat">
>;

export const useUpdateSchedulingCustomization = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (
			input: UpdateSchedulingCustomizationInput,
		): Promise<ClinicSettingsResponse> => {
			const res = await api.settings.patch(input);
			if (res.error) throw new Error("فشل تحديث إعدادات التخصيص");
			return res.data as ClinicSettingsResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settings"] });
		},
	});

	const updateSchedulingCustomization = (input: UpdateSchedulingCustomizationInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ إعدادات التخصيص...",
			success: "تم حفظ إعدادات التخصيص بنجاح",
			error: (err: Error) => err.message || "فشل حفظ إعدادات التخصيص",
		});

	return { updateSchedulingCustomization, isPending: mutation.isPending };
};
