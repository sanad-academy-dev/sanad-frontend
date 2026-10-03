import type { TFunction } from "i18next";
import { useMemo } from "react";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { getTaskStatusLabel } from "@/features/tasks/data/task-columns";
import type { TaskStatus } from "@/generated/prisma/enums";
import type { BranchSettings } from "@/server/branches/branches.type";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

/**
 * إعدادات المهام + دالة تسمية المراحل، مطبِّقةً تخصيصات الفرع الرئيسي.
 * المهام على مستوى الأكاديمية، فنعتمد إعدادات الفرع الرئيسي (نفس منطق الزيارات).
 */
export function useTaskSettings(t: TFunction): {
	settings: BranchSettings["tasks"];
	statusLabel: (status: TaskStatus | string) => string;
} {
	const { branches } = useBranches();

	return useMemo(() => {
		const primary = branches.find((b) => b.type === "PRIMARY") ?? branches[0];
		const settings = parseBranchSettings(primary?.settings).tasks;
		const overrides = settings.statusLabels;
		const statusLabel = (status: TaskStatus | string) =>
			overrides[status]?.trim() || getTaskStatusLabel(t, status);
		return { settings, statusLabel };
	}, [branches, t]);
}
