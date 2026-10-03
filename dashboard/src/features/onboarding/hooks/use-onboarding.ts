import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
	OnboardingProfileResponse,
	UpsertProfileInput,
} from "@/server/onboarding/onboarding.type";

type ClinicInfoInput = { name: string; slug?: string | null };

export type SlugConflictError = {
	message: string;
	suggestions: string[];
};

export const useOnboarding = () => {
	const queryClient = useQueryClient();

	const clinicInfoMutation = useMutation({
		mutationFn: async (data: ClinicInfoInput) => {
			const res = await api.onboarding["clinic-info"].patch(data);
			if (res.error) {
				const value = res.error.value as { message?: string; suggestions?: string[] };
				const err = new Error(value?.message ?? "فشل حفظ معلومات الأكاديمية") as Error & {
					suggestions?: string[];
				};
				err.suggestions = value?.suggestions;
				throw err;
			}
			return res.data;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["settings"] }),
	});

	const profileMutation = useMutation({
		mutationFn: async (data: UpsertProfileInput): Promise<OnboardingProfileResponse> => {
			const res = await api.onboarding.profile.patch(
				data as Parameters<typeof api.onboarding.profile.patch>[0],
			);
			if (res.error) {
				throw new Error(
					(res.error.value as { message?: string })?.message ?? "فشل حفظ بيانات الأكاديمية",
				);
			}
			return res.data as OnboardingProfileResponse;
		},
	});

	const completeMutation = useMutation({
		mutationFn: async () => {
			const res = await api.onboarding.complete.post({});
			if (res.error) throw new Error("فشل إكمال الإعداد");
			return res.data;
		},
	});

	return {
		saveClinicInfo: clinicInfoMutation.mutateAsync,
		isClinicInfoPending: clinicInfoMutation.isPending,
		saveProfile: (data: UpsertProfileInput) => profileMutation.mutateAsync(data),
		isProfilePending: profileMutation.isPending,
		completeOnboarding: completeMutation.mutateAsync,
		isCompletePending: completeMutation.isPending,
	};
};
