import { useSession } from "@/lib/auth/client";

export const usePermissions = () => {
	const { data: session } = useSession();
	const role = session?.session.role;
	const isAdmin = role === "ADMIN";

	const permissions: string[] = (() => {
		if (isAdmin) return [];
		const raw = session?.session.permissions;
		if (!raw) return [];
		try {
			return JSON.parse(raw) as string[];
		} catch {
			return [];
		}
	})();

	const hasPermission = (permission: string): boolean => {
		if (isAdmin) return true;
		return permissions.includes(permission);
	};

	const hasAnyPermission = (perms: string[]): boolean => {
		if (isAdmin) return true;
		return perms.some((p) => permissions.includes(p));
	};

	/**
	 * القراءة عبر النظامين معًا خلال هجرة الصلاحيات: الكتالوج القديم يمنح
	 * `view_limited`/`view_full`، وسجلّ RBAC الجديد يمنح `read` والنطاق على المنحة
	 * لا في المفتاح. وحدة جديدة (كالتنويم) لا تملك إلا الشكل الجديد، فالاكتفاء
	 * بالقديم يُخفيها عن كل من ليس مدير نظام.
	 */
	const canView = (resource: string): boolean => {
		if (isAdmin) return true;
		return (
			permissions.includes(`${resource}.read`) ||
			permissions.includes(`${resource}.view_limited`) ||
			permissions.includes(`${resource}.view_full`)
		);
	};

	return { hasPermission, hasAnyPermission, canView, isAdmin, permissions };
};
