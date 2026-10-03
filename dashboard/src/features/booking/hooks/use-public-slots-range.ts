import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PublicSlotRangeResponse } from "@/server/public/public.type";

type Args = {
	slug: string;
	staffId: string | null;
	serviceId: string | null;
	from: string | null;
	to: string | null;
};

// Eden Treaty auto-parses ISO date strings into Date objects on the client;
// normalize back to "YYYY-MM-DD" strings so consumers can treat day.date as a string.
const toYmd = (value: string | Date): string => {
	if (value instanceof Date) {
		const y = value.getFullYear();
		const m = String(value.getMonth() + 1).padStart(2, "0");
		const d = String(value.getDate()).padStart(2, "0");
		return `${y}-${m}-${d}`;
	}
	return String(value);
};

export const usePublicSlotsRange = ({ slug, staffId, serviceId, from, to }: Args) => {
	const enabled = Boolean(slug && staffId && serviceId && from && to);

	const { data, isLoading, isFetching, error } = useQuery<PublicSlotRangeResponse>({
		queryKey: ["public", "clinic", slug, "staff", staffId, "slots", serviceId, from, to],
		queryFn: async () => {
			const res = await api.public
				.clinic({ slug })
				.staff({ staffId: staffId as string })
				.slots.get({
					query: { serviceId: serviceId as string, from: from as string, to: to as string },
				});
			if (res.error) throw new Error("فشل جلب الزيارات المتاحة");
			const raw = res.data as PublicSlotRangeResponse;
			return {
				...raw,
				days: raw.days.map((d) => ({ ...d, date: toYmd(d.date) })),
			};
		},
		retry: false,
		staleTime: 1000 * 30,
		enabled,
	});

	return { data, isLoading, isFetching, error };
};
