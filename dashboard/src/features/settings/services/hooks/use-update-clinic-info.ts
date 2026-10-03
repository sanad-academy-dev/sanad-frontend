import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { uploadFiles } from "@/hooks/use-upload-files";
import { api } from "@/lib/api";
import type { ClinicSettingsResponse } from "@/server/settings/settings.type";

export type UpdateClinicInfoInput = {
	name?: string | null;
	email?: string | null;
	phone?: string | null;
	licenseNumber?: string | null;
	taxRegistryNumber?: string | null;
	website?: string | null;
	city?: string | null;
	address?: string | null;
	slug?: string | null;
	countryCode?: string | null;
	timezone?: string | null;
	calendarType?: "GREGORIAN" | "HIJRI" | null;
	timeFormat?: "H12" | "H24" | null;
	currencyCode?: "SAR" | "AED" | "QAR" | "EGP" | null;
	attendanceEnabled?: boolean;
	kioskEnabled?: boolean;
	kioskPin?: string | null;
	logoFile?: File | null;
};

export const useUpdateClinicInfo = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: UpdateClinicInfoInput): Promise<ClinicSettingsResponse> => {
			const { logoFile, ...fields } = input;

			let logo: string | undefined;
			if (logoFile) {
				const [url] = await uploadFiles([logoFile]);
				logo = url;
			}

			const res = await api.settings.patch({
				...fields,
				timezone: fields.timezone ?? undefined,
				calendarType: fields.calendarType ?? undefined,
				timeFormat: fields.timeFormat ?? undefined,
				currencyCode: fields.currencyCode ?? undefined,
				countryCode: fields.countryCode ?? undefined,
				slug: fields.slug || undefined,
				...(logo !== undefined && { logo }),
			});
			if (res.error) {
				const message =
					(typeof res.error.value === "object" &&
					res.error.value !== null &&
					"message" in res.error.value
						? (res.error.value as { message?: string }).message
						: undefined) ?? "فشل تحديث معلومات الأكاديمية";
				throw new Error(message);
			}
			return res.data as ClinicSettingsResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settings"] });
		},
	});

	const updateClinicInfo = (input: UpdateClinicInfoInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ المعلومات...",
			success: "تم حفظ معلومات الأكاديمية بنجاح",
			error: (err: Error) => err.message || "فشل حفظ معلومات الأكاديمية",
		});

	return { updateClinicInfo, isPending: mutation.isPending };
};
