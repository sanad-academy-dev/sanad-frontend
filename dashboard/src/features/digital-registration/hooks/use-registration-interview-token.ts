import { useQuery } from "@tanstack/react-query";

import type { VideoCallTokenResponse } from "@/server/video-calls/video-calls.type";
import { api } from "@/lib/api";

/**
 * رمز مقابلة التسجيل يختلف عن رمز المكالمة العامة: الخادم يتحقق من أن المستخدم
 * هو المراجع المعين أو مدير النظام، وأن الطلب يملك موعداً بعيداً فعالاً.
 */
export const useRegistrationInterviewToken = (requestId: string | null) => {
	const { data, isLoading, error } = useQuery<VideoCallTokenResponse>({
		queryKey: ["registration-interview-token", requestId],
		queryFn: async () => {
			const { data, error } = await api["video-calls"]["registration-token"].post({
				requestId: requestId ?? "",
			});
			if (error) {
				const message = (error.value as { message?: string } | null)?.message;
				throw new Error(message || "تعذر تجهيز مقابلة التسجيل");
			}
			return data;
		},
		enabled: Boolean(requestId),
		staleTime: 0,
		gcTime: 0,
		retry: false,
	});

	return { call: data ?? null, isLoading, error };
};
