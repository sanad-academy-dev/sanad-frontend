import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { VideoCallTokenResponse } from "@/server/video-calls/video-calls.type";

// room هنا هو اسم القاعة الكامل من رابط الدعوة — لا يتطلب تسجيل دخول
export const useGuestCallToken = (room: string, name: string | null) => {
	const { data, isLoading, error } = useQuery<VideoCallTokenResponse>({
		queryKey: ["guest-call-token", room, name],
		queryFn: async () => {
			const { data, error } = await api["video-calls"]["guest-token"].post({
				room,
				name: name ?? "",
			});
			if (error) {
				const message = (error.value as { message?: string } | null)?.message;
				throw new Error(message || "Failed to fetch guest call token");
			}
			return data;
		},
		enabled: !!room && !!name,
		// الرمز صالح لمدة قصيرة — لا نعيد استخدام رمز قديم من الكاش
		staleTime: 0,
		gcTime: 0,
		retry: false,
	});

	return { call: data ?? null, isLoading, error };
};
