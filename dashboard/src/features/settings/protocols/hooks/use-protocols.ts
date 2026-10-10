import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { ClinicProtocolsResponse } from "@/server/protocols/protocols.type";

export const useProtocols = () => {
	const { data, isLoading } = useQuery<ClinicProtocolsResponse>({
		queryKey: ["protocols"],
		queryFn: async () => {
			const res = await api.protocols.get();
			if (res.error) throw new Error("فشل جلب بروتوكولات الأكاديمية");
			return res.data as ClinicProtocolsResponse;
		},
	});

	return { protocols: data, isLoading };
};
