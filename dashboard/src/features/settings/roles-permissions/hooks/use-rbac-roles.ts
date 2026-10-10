import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/api";
import type { PermissionScope } from "@sanad/contracts/runtime/lib/rbac/rbac-registry";
import type { RoleResponse } from "@/server/rbac/rbac.type";

const ROLES_KEY = ["rbac", "roles"] as const;

const errorMessage = (error: unknown, fallback: string) =>
	(error as { value?: { message?: string } })?.value?.message ?? fallback;

export const useRbacRoles = () => {
	const { data, isLoading, refetch } = useQuery<RoleResponse[]>({
		queryKey: ROLES_KEY,
		queryFn: async () => {
			const { data, error } = await api.rbac.roles.get();
			if (error) throw new Error(errorMessage(error, "فشل تحميل الأدوار"));
			return data as RoleResponse[];
		},
		staleTime: 1000 * 60 * 5,
	});

	return { roles: data ?? [], isLoading, refetch };
};

export const useCreateRbacRole = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { name: string; description?: string }) => {
			const { data, error } = await api.rbac.roles.post(input);
			if (error) throw new Error(errorMessage(error, "فشل إنشاء الدور"));
			return data as RoleResponse;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
	});

	const createRole = (
		input: { name: string; description?: string },
		options?: { onSuccess?: (role: RoleResponse) => void },
	) =>
		toast.promise(mutateAsync(input, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ إنشاء الدور...",
			success: "تم إنشاء الدور",
			error: (e: Error) => e.message || "فشل إنشاء الدور",
		});

	return { createRole, isPending };
};

/** Create a role pre-filled from one of the ready-made templates. */
export const useCreateRoleFromTemplate = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (input: { templateKey: string; name?: string }) => {
			const { data, error } = await api.rbac.roles["from-template"].post(input);
			if (error) throw new Error(errorMessage(error, "فشل إنشاء الدور من القالب"));
			return data as RoleResponse;
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
	});

	const createFromTemplate = (
		input: { templateKey: string; name?: string },
		options?: { onSuccess?: (role: RoleResponse) => void },
	) =>
		toast.promise(mutateAsync(input, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ إنشاء الدور...",
			success: (role) => `تم إنشاء «${role.name}» بصلاحياته الجاهزة`,
			error: (e: Error) => e.message || "فشل إنشاء الدور من القالب",
		});

	return { createFromTemplate, isPending };
};

export const useUpdateRbacRole = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({
			id,
			...body
		}: {
			id: string;
			name: string;
			description?: string;
		}) => {
			const { error } = await api.rbac.roles({ id }).patch(body);
			if (error) throw new Error(errorMessage(error, "فشل تحديث الدور"));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
	});

	const updateRole = (
		input: { id: string; name: string; description?: string },
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutateAsync(input, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ حفظ الدور...",
			success: "تم حفظ الدور",
			error: (e: Error) => e.message || "فشل حفظ الدور",
		});

	return { updateRole, isPending };
};

/**
 * Replace a role's grants. The server bumps the clinic's `rbacVersion`, so everyone holding
 * this role picks the change up on their next request — no re-login, which is what the old
 * implementation forced by deleting their sessions outright.
 */
export const useSetRoleGrants = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async ({
			id,
			grants,
		}: {
			id: string;
			grants: { key: string; scope: PermissionScope }[];
		}) => {
			const { error } = await api.rbac.roles({ id }).grants.put({ grants });
			if (error) throw new Error(errorMessage(error, "فشل حفظ الصلاحيات"));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
	});

	const setGrants = (
		input: { id: string; grants: { key: string; scope: PermissionScope }[] },
		options?: { onSuccess?: () => void },
	) =>
		toast.promise(mutateAsync(input, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ حفظ الصلاحيات...",
			success: "تم حفظ الصلاحيات — تسري فورًا دون إعادة تسجيل الدخول",
			error: (e: Error) => e.message || "فشل حفظ الصلاحيات",
		});

	return { setGrants, isPending };
};

export const useDeleteRbacRole = () => {
	const queryClient = useQueryClient();

	const { mutateAsync, isPending } = useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.rbac.roles({ id }).delete();
			if (error) throw new Error(errorMessage(error, "فشل حذف الدور"));
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ROLES_KEY }),
	});

	const deleteRole = (id: string, options?: { onSuccess?: () => void }) =>
		toast.promise(mutateAsync(id, { onSuccess: options?.onSuccess }), {
			loading: "جارٍ حذف الدور...",
			success: "تم حذف الدور",
			error: (e: Error) => e.message || "فشل حذف الدور",
		});

	return { deleteRole, isPending };
};
