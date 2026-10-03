import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicUserResponse } from "@/server/users/users.controller";

// جميع مستخدمي الأكاديمية — لقائمة "مقدم الطلب"
export const useClinicUsers = () => {
	const { data, isLoading } = useQuery<ClinicUserResponse[]>({
		queryKey: ["clinic-users"],
		queryFn: async () => {
			const res = await api.users.get();
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر جلب المستخدمين");
			}
			return (res.data as ClinicUserResponse[]) ?? [];
		},
		staleTime: 5 * 60 * 1000,
	});

	return { users: data ?? [], isLoading };
};
