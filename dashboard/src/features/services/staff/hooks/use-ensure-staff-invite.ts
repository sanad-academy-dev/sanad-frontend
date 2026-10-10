import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export type EnsureStaffInviteError = {
	status: number;
	message: string;
};

export const useEnsureStaffInvite = (staffId: string | undefined) => {
	return useQuery({
		queryKey: ["staff-invite", staffId],
		enabled: !!staffId,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 60_000,
		queryFn: async () => {
			if (!staffId) throw { status: 0, message: "" } satisfies EnsureStaffInviteError;
			const res = await api.staff({ id: staffId }).invite.ensure.post();
			if (res.error) {
				const message =
					(res.error.value as { message?: string })?.message ?? "تعذّر إنشاء رابط الدعوة";
				throw { status: res.status, message } satisfies EnsureStaffInviteError;
			}
			return res.data;
		},
	});
};
