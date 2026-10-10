import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { RoomResponse } from "@/server/rooms/rooms.type";

const EMPTY_ROOMS: RoomResponse[] = [];

export const useRooms = (branchId: string | null | undefined) => {
	const { data, isLoading } = useQuery<RoomResponse[]>({
		queryKey: ["rooms", branchId],
		queryFn: async () => {
			if (!branchId) return [];

			const res = await api.branches({ id: branchId }).rooms.get();
			if (res.error) throw new Error("فشل جلب القاعات");
			return res.data as RoomResponse[];
		},
		enabled: !!branchId,
	});
	return { rooms: data ?? EMPTY_ROOMS, isLoading };
};
