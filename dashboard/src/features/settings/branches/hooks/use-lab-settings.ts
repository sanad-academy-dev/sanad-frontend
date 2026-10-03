import type { LabSettings } from "@/features/settings/branches/data/lab-settings";
import { useBranch } from "@/features/settings/branches/hooks/use-branch";
import { useUpdateBranchSettings } from "@/features/settings/branches/hooks/use-update-branch-settings";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

/**
 * الحالة المشتركة لصفحات إعدادات المختبر — كل قسم صفحة مستقلة لكنها تقرأ
 * وتكتب نفس كتلة `settings.labTests`، وتُعطَّل حتى تُفعَّل الدورة للفرع.
 */
export const useLabSettings = (branchId: string) => {
	const { branch, isLoading } = useBranch(branchId);
	const { updateSettings, isPending } = useUpdateBranchSettings(branchId);

	const settings = branch ? parseBranchSettings(branch.settings) : null;
	const enabled = settings?.services.labTests ?? false;

	const update = (patch: Partial<LabSettings>) => {
		if (!settings) return Promise.resolve();
		return updateSettings({ ...settings, labTests: { ...settings.labTests, ...patch } });
	};

	const setEnabled = (checked: boolean) => {
		if (!settings) return Promise.resolve();
		return updateSettings({
			...settings,
			services: { ...settings.services, labTests: checked },
		});
	};

	return {
		branch,
		isLoading,
		isPending,
		lab: settings?.labTests ?? null,
		enabled,
		// إعدادات المختبر تبقى مقروءة لكن غير قابلة للتعديل قبل تفعيل الدورة
		configDisabled: isPending || !enabled,
		update,
		setEnabled,
	};
};
