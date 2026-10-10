import type { ShiftType } from "@/server/shifts/shifts.type";

// أنواع المناوبات (مفهرسة بقيمة enum) — تُستخدم للألوان والشارات والقوائم
export const SHIFT_TYPES: {
	key: ShiftType;
	label: string;
	shortLabel: string;
	color: string;
	// وقت البدء/الانتهاء الافتراضي (بالدقائق من منتصف الليل)
	defaultStart: number;
	defaultEnd: number;
	defaultHours: number;
}[] = [
	{
		key: "MORNING",
		label: "نوبة الصباح",
		shortLabel: "صباحًا",
		color: "#F59E0B",
		defaultStart: 480, // 08:00
		defaultEnd: 960, // 16:00
		defaultHours: 8,
	},
	{
		key: "EVENING",
		label: "نوبة المساء",
		shortLabel: "مساءً",
		color: "#6366F1",
		defaultStart: 960, // 16:00
		defaultEnd: 1440, // 24:00
		defaultHours: 8,
	},
	{
		key: "NIGHT",
		label: "نوبة الليل",
		shortLabel: "ليلًا",
		color: "#3B82F6",
		defaultStart: 0, // 00:00
		defaultEnd: 480, // 08:00
		defaultHours: 8,
	},
];

// خريطة سريعة: نوع المناوبة → بياناتها
export const SHIFT_TYPE_MAP = Object.fromEntries(SHIFT_TYPES.map((s) => [s.key, s])) as Record<
	ShiftType,
	(typeof SHIFT_TYPES)[number]
>;

// دليل الألوان أسفل الشبكة
export const SHIFT_LEGEND = [
	{ key: "MORNING", label: "نوبة الصباح", color: "#F59E0B" },
	{ key: "EVENING", label: "نوبة المساء", color: "#6366F1" },
	{ key: "NIGHT", label: "نوبة الليل", color: "#3B82F6" },
	{ key: "leave", label: "في أجازة", color: "#A855F7" },
] as const;
