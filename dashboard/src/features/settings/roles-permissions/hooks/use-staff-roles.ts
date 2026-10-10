import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { StaffRoleResponse } from "@/server/staff-roles/staff-roles.type";

export const useStaffRoles = () => {
	const { data, isLoading, refetch } = useQuery<StaffRoleResponse[]>({
		queryKey: ["staff-roles"],
		queryFn: async () => {
			const { data, error } = await api["staff-roles"].get();
			if (error) throw new Error("فشل تحميل الأدوار");
			return data as StaffRoleResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { roles: data ?? [], isLoading, refetch };
};
