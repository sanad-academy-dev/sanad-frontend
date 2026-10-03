import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

/**
 * [IP1] إشغال القاعات — عدد الأقفاص المشغولة من إجماليها لكل قاعة.
 *
 * مصدر الرقم هو `CageAssignment` بلا `releasedAt`، أي الإسكان القائم فعلًا.
 * `Room.capacity` يبقى تقديرًا مكتوبًا في الإعدادات ولا يُستعمل هنا: قاعةٌ كُتب
 * أنّها تتّسع لستّة وفيها أربعة أقفاص فعلية تُقرأ «٢/٤» لا «٢/٦».
 */

type RoomOccupancyRow = { roomId: string; cages: number; occupied: number };

export const useRoomOccupancy = (branchId?: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ["inpatients", "occupancy", branchId ?? "all"],
		queryFn: async () => {
			const { data, error } = await api.inpatients["room-occupancy"].get({
				query: branchId ? { branchId } : {},
			});
			// الإشغال معلومة مساعدة على شاشة إعدادات — إخفاقها لا يُفشل الجدول كلّه
			if (error) return [] as RoomOccupancyRow[];
			return data as unknown as RoomOccupancyRow[];
		},
		staleTime: 1000 * 30,
	});

	const occupancyByRoom = Object.fromEntries(
		(data ?? []).map((row) => [row.roomId, row]),
	) as Record<string, RoomOccupancyRow | undefined>;

	return { occupancyByRoom, isLoading };
};
