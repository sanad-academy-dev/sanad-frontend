import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";

type Input = {
	ownerId: string;
	comment?: string;
};

export const useTransferPatientOwnership = (patientId: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (input: Input) => {
			const res = await api.patients({ id: patientId })["transfer-ownership"].patch({
				ownerId: input.ownerId,
				comment: input.comment,
			});
			if (res.error) {
				const v = res.error.value as { message?: string } | undefined;
				throw new Error(v?.message ?? "تعذّر نقل ملكية الطفل");
			}
			return res.data;
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["patients"] });
			void queryClient.invalidateQueries({ queryKey: ["patient-activity", patientId] });
		},
	});

	const transferOwnership = async (input: Input) =>
		toast.promise(mutation.mutateAsync(input), {
			loading: "جارٍ نقل الملكية...",
			success: "تم نقل ملكية الطفل",
			error: (err: Error) => err.message || "فشل نقل ملكية الطفل",
		});

	return { transferOwnership, isPending: mutation.isPending };
};
