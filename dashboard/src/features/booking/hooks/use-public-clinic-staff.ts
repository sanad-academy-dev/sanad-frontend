import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PublicClinicStaffResponse } from "@/server/public/public.type";

export const usePublicClinicStaff = (slug: string) => {
	const { data, isLoading, error } = useQuery<PublicClinicStaffResponse[]>({
		queryKey: ["public", "clinic", slug, "staff"],
		queryFn: async () => {
			const res = await api.public.clinic({ slug }).staff.get();
			if (res.error) throw new Error("فشل جلب قائمة المدرّبين");
			return res.data as PublicClinicStaffResponse[];
		},
		retry: false,
		staleTime: 1000 * 60 * 5,
		enabled: Boolean(slug),
	});

	return { staff: data ?? [], isLoading, error };
};
