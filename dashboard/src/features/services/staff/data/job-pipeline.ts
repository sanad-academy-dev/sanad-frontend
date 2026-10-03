import {
	IconArmchair,
	IconCircleX,
	IconClipboardText,
	IconFileCheck,
	IconList,
	IconListNumbers,
} from "@tabler/icons-react";

// مراحل خط التوظيف — مصدر واحد للترتيب والألوان والأيقونات (عيّنة، لا يوجد ربط خلفي بعد)
// color: لون العدّاد والشريط، badge: خلفية العدّاد، labelColor: لون التسمية والأيقونة.
// الأيقونات من Tabler وهي أقرب المتاح لأيقونات Hugeicons المستدورة في التصميم.
export const PIPELINE_STAGES = [
	{
		key: "applications",
		label: "طلبات التوظيف",
		Icon: IconListNumbers,
		color: "#3B82F6",
		badge: "rgba(59, 130, 246, 0.05)",
		labelColor: "#08090A",
	},
	{
		key: "shortlist",
		label: "القائمة المختصرة",
		Icon: IconList,
		color: "#08090A",
		badge: "#F5F5F6",
		labelColor: "#08090A",
	},
	{
		key: "interview",
		label: "المقابلة",
		Icon: IconArmchair,
		color: "#CD8100",
		badge: "rgba(245, 158, 11, 0.05)",
		labelColor: "#08090A",
	},
	{
		key: "offer",
		label: "العرض المقدم",
		Icon: IconClipboardText,
		color: "#880BF5",
		badge: "rgba(136, 11, 245, 0.05)",
		labelColor: "#880BF5",
	},
	{
		key: "hired",
		label: "التعيين",
		Icon: IconFileCheck,
		color: "#009E3A",
		badge: "rgba(0, 158, 58, 0.05)",
		labelColor: "#08090A",
	},
	{
		key: "rejected",
		label: "مرفوضة",
		Icon: IconCircleX,
		color: "#FF6467",
		badge: "rgba(255, 100, 103, 0.05)",
		labelColor: "#08090A",
	},
] as const;

// أعداد المرشّحين لكل مرحلة في وظيفة بعينها — مشتقّة من معرّف الوظيفة
// حتى تُعطي كل وظيفة أرقامًا مختلفة وثابتة عبر كل الشاشات إلى حين ربط الـ backend.
export function jobStageCounts(code: string) {
	const seed = [...code].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
	return PIPELINE_STAGES.map((_, i) => 2 + ((seed + i * 7) % 10));
}

// عدد الوظائف المشغولة من أصل المتاح — عيّنة أيضًا، مشتقّة من عدد من وصلوا مرحلة «التعيين»
export function jobFilledPositions(code: string, total: number) {
	if (total <= 0) return 0;
	return jobStageCounts(code)[4] % (total + 1);
}
