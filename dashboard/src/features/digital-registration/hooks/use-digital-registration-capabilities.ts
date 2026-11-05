import { useMemo } from "react";
import { useRegistrationShareAccess } from "./use-digital-registration";
import {
	SAFE_READONLY_CAPABILITIES,
	type DigitalRegistrationCapabilities,
	type ShareAccessMember,
} from "../types/campaign-share.types";

export interface DigitalRegistrationCapabilitiesState {
	capabilities: DigitalRegistrationCapabilities;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	accessLevel: "full" | "can_edit" | "can_view" | undefined;
	isReadOnly: boolean;
	isAdmin: boolean;
	isEditor: boolean;
	isViewer: boolean;
	currentUser: ShareAccessMember | undefined;
}

/**
 * المصدر المركزي الموحد لصلاحيات التسجيل الرقمي:
 * - مشتق مباشرة من response الباك إند الحقيقي عبر GET /api/digital-registration/share-access.
 * - يطبق سياسة Fail-Closed الصارمة: أثناء التحميل أو عند حدوث خطأ تكون كافة الصلاحيات false.
 * - can_view: عرض فقط حقيقي، كافة صلاحيات التعديل والإجراءات الإدارية والتشغيلية معطلة.
 * - can_edit: تشغيل الطلبات فقط، بدون صلاحيات الإدارة، الحذف، التصدير، أو تنزيل المستندات.
 * - admin: كامل الصلاحيات.
 */
export function useDigitalRegistrationCapabilities(
	campaignId?: string,
): DigitalRegistrationCapabilitiesState {
	const { data, isLoading, isError, error } = useRegistrationShareAccess(campaignId);

	const capabilities = useMemo<DigitalRegistrationCapabilities>(() => {
		if (isLoading || isError || !data?.capabilities) {
			return SAFE_READONLY_CAPABILITIES;
		}
		return data.capabilities;
	}, [isLoading, isError, data?.capabilities]);

	const accessLevel = data?.currentUser?.accessLevel;
	const isReadOnly = !capabilities.canEdit;
	const isAdmin = Boolean(capabilities.canManageTeam);
	const isEditor = Boolean(capabilities.canEdit && !isAdmin);
	const isViewer = Boolean(capabilities.canView && !capabilities.canEdit);

	return {
		capabilities,
		isLoading,
		isError,
		error,
		accessLevel,
		isReadOnly,
		isAdmin,
		isEditor,
		isViewer,
		currentUser: data?.currentUser,
	};
}
