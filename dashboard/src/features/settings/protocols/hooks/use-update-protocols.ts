import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type {
	ClinicProtocolsResponse,
	UpdateProtocolsInput,
} from "@/server/protocols/protocols.type";

export const useUpdateProtocols = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: UpdateProtocolsInput): Promise<ClinicProtocolsResponse> => {
			const res = await api.protocols.patch(input);
			if (res.error) throw new Error("فشل تحديث بروتوكولات الأكاديمية");
			return res.data as ClinicProtocolsResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["protocols"] });
		},
	});

	const updateProtocols = (input: UpdateProtocolsInput) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ حفظ البروتوكولات...",
			success: "تم حفظ بروتوكولات الأكاديمية بنجاح",
			error: (err: Error) => err.message || "فشل حفظ البروتوكولات",
		});

	return { updateProtocols, isPending: mutation.isPending };
};
