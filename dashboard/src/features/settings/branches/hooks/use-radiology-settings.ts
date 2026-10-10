import type { RadiologySettings } from "@/features/settings/branches/data/radiology-settings";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useUpdateBranchSettings } from "@/features/settings/branches/hooks/use-update-branch-settings";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

/**
 * الحالة المشتركة لصفحات إعدادات الأشعة — كل قسم صفحة مستقلة لكنها تقرأ
 * وتكتب نفس كتلة `settings.radiology`، وتُعطَّل حتى تُفعَّل الدورة للفرع.
 */
export const useRadiologySettings = (branchId: string) => {
	const { branch, isLoading } = useBranch(branchId);
	const { updateSettings, isPending } = useUpdateBranchSettings(branchId);

	const settings = branch ? parseBranchSettings(branch.settings) : null;
	const enabled = settings?.services.radiology ?? false;

	const update = (patch: Partial<RadiologySettings>) => {
		if (!settings) return Promise.resolve();
		return updateSettings({ ...settings, radiology: { ...settings.radiology, ...patch } });
	};

	const setEnabled = (checked: boolean) => {
		if (!settings) return Promise.resolve();
		return updateSettings({
			...settings,
			services: { ...settings.services, radiology: checked },
		});
	};

	return {
		branch,
		isLoading,
		isPending,
		radiology: settings?.radiology ?? null,
		enabled,
		// إعدادات الأشعة تبقى مقروءة لكن غير قابلة للتعديل قبل تفعيل الدورة
		configDisabled: isPending || !enabled,
		update,
		setEnabled,
	};
};
