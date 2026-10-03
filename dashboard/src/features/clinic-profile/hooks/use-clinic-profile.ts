import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { PublicClinicResponse } from "@/server/public/public.type";

export type ClinicProfileStatus = "loading" | "ok" | "not-found" | "error";

type Result = {
	clinic: PublicClinicResponse | null;
	status: ClinicProfileStatus;
};

export const useClinicProfile = (slug: string) => {
	const { data, isLoading, error } = useQuery<Result>({
		queryKey: ["public", "clinic", slug],
		queryFn: async () => {
			const res = await api.public.clinic({ slug }).get();
			if (res.error) {
				if (res.error.status === 404) return { clinic: null, status: "not-found" };
				throw new Error("فشل جلب بيانات الأكاديمية");
			}
			return { clinic: res.data as PublicClinicResponse, status: "ok" };
		},
		retry: false,
		staleTime: 1000 * 60 * 5,
		enabled: Boolean(slug),
	});

	const status: ClinicProfileStatus = isLoading
		? "loading"
		: error
			? "error"
			: (data?.status ?? "error");

	return { clinic: data?.clinic ?? null, status };
};
