import type { ComponentType, CSSProperties } from "react";

import { resolveCover } from "@/features/services/training/utils/cover";

// لون الغلاف الافتراضي حين لا غلاف (أو حين الغلاف صورة لا لون لها)
const DEFAULT_COVER_COLOR = "#6366F1";

// أيقونة المحتوى التدريبي (دورة/اختبار) في القوائم — بلا مربّع خلفية،
// ولونها مأخوذ من غلاف المحتوى نفسه.
export function ContentAvatar({
	Icon,
	coverKey,
}: {
	Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
	coverKey?: string | null;
}) {
	const cover = resolveCover(coverKey);
	const color = cover?.type === "color" ? cover.color : DEFAULT_COVER_COLOR;

	return (
		<Icon
			// أكبر قليلًا وبخطّ أنحف — يوازن ارتفاع سطرَي الاسم/المعرّف بجانبه
			className="size-6 shrink-0 stroke-[1.75]"
			style={{ color }}
		/>
	);
}
