import {
	IconAtom,
	IconAward,
	IconBook,
	IconBooks,
	IconBrain,
	IconCode,
	IconCpu,
	IconCube,
	IconGlobe,
	IconHeart,
	IconRobot,
	IconRocket,
	IconSchool,
	IconSparkles,
	IconStar,
	IconUsers,
} from "@tabler/icons-react";

/**
 * Remove internal metadata tags (`[stage:...]`, `[notes:...]`, `[duration:...]`, `[icon:...]`, `[color:...]`)
 * stored inside a course or track description before displaying plain description text.
 */
export function stripSystemTags(text?: string | null): string {
	if (!text) return "";
	const cleaned = text
		.replace(/<p>\s*\[courses:[^\]]*\]\s*<\/p>/gi, "")
		.replace(/<div>\s*\[courses:[^\]]*\]\s*<\/div>/gi, "")
		.replace(/\[courses:[^\]]*\]/gi, "")
		.replace(/\[track_structure:[\s\S]*?\]/gi, "")
		.replace(/(?:\[(?:المرحلة|stage):[^\]]+\]|\n?(?:المرحلة|stage):[^\n]+)/gi, "")
		.replace(/(?:\[(?:notes|ملاحظات):[\s\S]*?\])/gi, "")
		.replace(/(?:\[(?:duration|مدة):[^\]]+\])/gi, "")
		.replace(/(?:\[icon:[^\]]+\])/gi, "")
		.replace(/(?:\[color:[^\]]+\])/gi, "")
		.replace(/&#91;courses:[^&]*&#93;/gi, "")
		.replace(/\[[a-zA-Z0-9_\u0600-\u06FF]+:[^\]]*\]/gi, "")
		.replace(/\[[^\]]*\]/g, "")
		.replace(/id":"item-[^"]*"/gi, "")
		.replace(/"[a-zA-Z0-9_-]+"\s*:\s*"?[^",}\]]*"?/gi, "")
		.replace(/[{}[\]"]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (!cleaned || cleaned.length < 2 || /^[{}[\]":,\s]+$/.test(cleaned)) {
		return "";
	}
	return cleaned;
}

export function extractSystemTag(text: string | null | undefined, tag: string): string {
	if (!text) return "";
	const regex = new RegExp(`\\[${tag}:([^\\]]+)\\]`, "i");
	const match = text.match(regex);
	return match?.[1]?.trim() || "";
}

export function extractNotesTag(text: string | null | undefined): string {
	if (!text) return "";
	const match = text.match(/\[notes:([\s\S]*?)\]/i);
	return match?.[1]?.trim() || "";
}

export function extractCourseDuration(course: {
	startDate?: Date | string | null;
	dueDate?: Date | string | null;
	estimatedDurationWeeks?: number | null;
	description?: string | null;
}): string | null {
	const fromTag =
		extractSystemTag(course.description, "duration") ||
		extractSystemTag(course.description, "مدة");
	if (fromTag) return fromTag;
	if (course.estimatedDurationWeeks) {
		const w = course.estimatedDurationWeeks;
		if (w % 4 === 0 && w >= 4) {
			const m = w / 4;
			return m === 1 ? "شهر" : m === 2 ? "شهران" : m <= 10 ? `${m} أشهر` : `${m} شهراً`;
		}
		return w === 1
			? "أسبوع واحد"
			: w === 2
				? "أسبوعان"
				: w <= 10
					? `${w} أسابيع`
					: `${w} أسبوعاً`;
	}
	return null;
}

export function extractCourseAcademicStage(course: {
	academicStage?: string | null;
	description?: string | null;
}): string {
	return (
		course.academicStage?.trim() ||
		extractSystemTag(course.description, "stage") ||
		extractSystemTag(course.description, "المرحلة")
	);
}

export const COURSE_ICON_OPTIONS = [
	{ id: "cube", name: "مكعب فضاء", icon: IconCube },
	{ id: "code", name: "برمجة كود", icon: IconCode },
	{ id: "cpu", name: "معالج تقنية", icon: IconCpu },
	{ id: "robot", name: "روبوت ذكاء اصطناعي", icon: IconRobot },
	{ id: "school", name: "مدرسة أكاديمية", icon: IconSchool },
	{ id: "book", name: "كتاب قراءة", icon: IconBook },
	{ id: "books", name: "كتب مكتبة", icon: IconBooks },
	{ id: "brain", name: "عقل تفكير ذكاء", icon: IconBrain },
	{ id: "atom", name: "ذرة علوم فيزياء", icon: IconAtom },
	{ id: "sparkles", name: "تميز إبداع لمعان", icon: IconSparkles },
	{ id: "rocket", name: "صاروخ سرعة انطلاق", icon: IconRocket },
	{ id: "star", name: "نجمة تفوق أداء", icon: IconStar },
	{ id: "award", name: "جائزة وسام بطولة", icon: IconAward },
	{ id: "heart", name: "قلب صحة رعاية", icon: IconHeart },
	{ id: "users", name: "فريق طلاب جماعي", icon: IconUsers },
	{ id: "globe", name: "عالم لغات دولي", icon: IconGlobe },
] as const;

export const COURSE_COLOR_OPTIONS = [
	{
		id: "blue",
		label: "أزرق",
		bg: "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400",
	},
	{
		id: "purple",
		label: "بنفسجي",
		bg: "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-400",
	},
	{
		id: "emerald",
		label: "أخضر",
		bg: "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400",
	},
	{
		id: "amber",
		label: "برتقالي",
		bg: "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400",
	},
	{
		id: "rose",
		label: "وردي",
		bg: "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400",
	},
] as const;

export function resolveCourseAppearance(description?: string | null) {
	const iconId = extractSystemTag(description, "icon");
	const colorId = extractSystemTag(description, "color");
	const Icon = COURSE_ICON_OPTIONS.find((item) => item.id === iconId)?.icon ?? IconSchool;
	const colorClass =
		COURSE_COLOR_OPTIONS.find((item) => item.id === colorId)?.bg ?? COURSE_COLOR_OPTIONS[0].bg;
	return { Icon, colorClass };
}
