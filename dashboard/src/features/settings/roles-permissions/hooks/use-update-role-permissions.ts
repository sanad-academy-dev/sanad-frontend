import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";

export const useUpdateRolePermissions = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({ id, permissions }: { id: string; permissions: string[] }) => {
			const { error } = await api["staff-roles"]({ id }).permissions.patch({ permissions });
			if (error)
				throw new Error(
					(error as { value?: { message?: string } }).value?.message ?? "فشل تحديث الصلاحيات",
				);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff-roles"] });
		},
	});

	const updatePermissions = (
		data: { id: string; permissions: string[] },
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutateAsync(data, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ حفظ الصلاحيات...",
			success: "تم حفظ الصلاحيات",
			error: (e: Error) => e.message || "فشل حفظ الصلاحيات",
		});

	return { updatePermissions, isPending };
};
