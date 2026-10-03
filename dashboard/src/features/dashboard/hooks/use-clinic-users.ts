import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ClinicUserResponse } from "@/server/users/users.controller";

const EMPTY_CLINIC_USERS: ClinicUserResponse[] = [];

export const useClinicUsers = () => {
	const { data, isLoading } = useQuery<ClinicUserResponse[]>({
		queryKey: ["clinic-users"],
		queryFn: async () => {
			const res = await api.users.get();
			if (res.error) throw new Error("Failed to fetch clinic users");
			return res.data;
		},
	});

	return { users: data ?? EMPTY_CLINIC_USERS, isLoading };
};
