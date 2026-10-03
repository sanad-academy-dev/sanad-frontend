import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useUpdateRole = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const { error } = await api["staff-roles"]({ id }).patch({ name });
			if (error)
				throw new Error(
					(error as { value?: { message?: string } }).value?.message ?? "فشل تحديث الدور",
				);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff-roles"] });
		},
	});

	const updateRole = (
		data: { id: string; name: string },
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutateAsync(data, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ تحديث الدور...",
			success: "تم تحديث الدور",
			error: (e: Error) => e.message || "فشل تحديث الدور",
		});

	return { updateRole, isPending };
};
