import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { StaffRoleResponse } from "@/server/staff-roles/staff-roles.type";

export const useDeleteRole = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api["staff-roles"]({ id }).delete();
			if (error)
				throw new Error(
					(error as { value?: { message?: string } }).value?.message ?? "فشل حذف الدور",
				);
			return id;
		},
		onSuccess: (id) => {
			queryClient.setQueryData<StaffRoleResponse[]>(
				["staff-roles"],
				(old) => old?.filter((r) => r.id !== id) ?? [],
			);
		},
	});

	const deleteRole = (id: string, options?: { onSuccess?: () => void }) =>
		toast.promise(
			mutateAsync(id).then((result) => {
				options?.onSuccess?.();
				return result;
			}),
			{
				loading: "جارٍ حذف الدور...",
				success: "تم حذف الدور",
				error: (e: Error) => e.message || "فشل حذف الدور",
			},
		);

	return { deleteRole, isPending };
};
