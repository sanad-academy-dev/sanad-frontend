import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { VideoCallTokenResponse } from "@/server/video-calls/video-calls.type";

export const useVideoCallToken = (room: string | null) => {
	const { data, isLoading, error } = useQuery<VideoCallTokenResponse>({
		queryKey: ["video-call-token", room],
		queryFn: async () => {
			const { data, error } = await api["video-calls"].token.post({ room: room ?? "" });
			if (error) {
				const message = (error.value as { message?: string } | null)?.message;
				throw new Error(message || "Failed to fetch video call token");
			}
			return data;
		},
		enabled: !!room,
		// الرمز صالح لمدة قصيرة — لا نعيد استخدام رمز قديم من الكاش
		staleTime: 0,
		gcTime: 0,
		retry: false,
	});

	return { call: data ?? null, isLoading, error };
};
