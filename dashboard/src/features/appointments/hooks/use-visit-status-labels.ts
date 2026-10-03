import { useMemo } from "react";

import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { STATUS_LABELS } from "@sanad/contracts/runtime/server/appointments/appointments.workflow";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

export type VisitStatusLabels = Record<AppointmentStatus, string>;

/**
 * أسماء مراحل سير عمل الزيارة مدموجةً مع تخصيصات الفرع الرئيسي.
 * اللوحة على مستوى الأكاديمية، فنطبّق تخصيص الفرع الرئيسي (نفس منطق اختيار الفرع
 * في نموذج إنشاء الزيارة). المفاتيح غير المخصّصة تسقط للأسماء الافتراضية.
 */
export function useVisitStatusLabels(): VisitStatusLabels {
	const { branches } = useBranches();

	return useMemo(() => {
		const primary = branches.find((b) => b.type === "PRIMARY") ?? branches[0];
		const overrides = primary ? parseBranchSettings(primary.settings).queue.statusLabels : {};
		const merged = { ...STATUS_LABELS } as VisitStatusLabels;
		for (const [status, label] of Object.entries(overrides)) {
			if (label && status in merged) merged[status as AppointmentStatus] = label;
		}
		return merged;
	}, [branches]);
}
