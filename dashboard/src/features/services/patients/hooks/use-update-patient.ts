import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

type PatchBody = Parameters<ReturnType<(typeof api)["patients"]>["patch"]>[0];

export const useUpdatePatient = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async ({ id, data }: { id: string; data: PatchBody }) => {
			const res = await api.patients({ id }).patch(data);
			if (res.error) {
				const msg = (res.error.value as { message?: string })?.message ?? "فشل تحديث الطفل";
				throw new Error(msg);
			}
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["patients"] });
		},
	});

	const updatePatient = (id: string, data: PatchBody) =>
		toast.promise(mutation.mutateAsync({ id, data }), {
			loading: "جارٍ تحديث بيانات الطفل...",
			success: "تم تحديث بيانات الطفل",
			error: (err: Error) => err.message || "فشل تحديث الطفل",
		});

	return { updatePatient, isPending: mutation.isPending };
};
