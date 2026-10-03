import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type {
	CreateStaffRoleFormInput,
	StaffRoleResponse,
} from "@/server/staff-roles/staff-roles.type";

export const useCreateRole = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (data: CreateStaffRoleFormInput): Promise<StaffRoleResponse> => {
			const { data: role, error } = await api["staff-roles"].post(data);
			if (error)
				throw new Error(
					(error as { value?: { message?: string } }).value?.message ?? "فشل إنشاء الدور",
				);
			return role as StaffRoleResponse;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["staff-roles"] });
		},
	});

	const createRole = (
		data: CreateStaffRoleFormInput,
		options?: { onSuccess?: (role: StaffRoleResponse) => void },
	) =>
		toast.promise(
			mutateAsync(data).then((role) => {
				options?.onSuccess?.(role);
				return role;
			}),
			{
				loading: "جارٍ إنشاء الدور...",
				success: "تم إنشاء الدور",
				error: (e: Error) => e.message || "فشل إنشاء الدور",
			},
		);

	return { createRole, isPending };
};
