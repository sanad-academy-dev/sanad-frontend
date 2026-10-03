import type { StatItem } from "@/features/dashboard/types/dashboard.types";

// بطاقات إحصائيات تبويب الحضور والانصراف (مطابقة لتصميم Figma)
export const ATTENDANCE_STATS: StatItem[] = [
	{ title: "# للموظفين", value: 0, tooltip: "إجمالي عدد الموظفين المسجلين" },
	{ title: "# حاضرين", value: 0, tooltip: "عدد الموظفين الحاضرين اليوم" },
	{ title: "# غائبين", value: 0, tooltip: "عدد الموظفين الغائبين اليوم" },
	{ title: "# في أجازة", value: 0, tooltip: "عدد الموظفين في إجازة اليوم" },
	{ title: "معدل الالتزام بالدوام", value: 0, tooltip: "نسبة الالتزام بجلسات الدوام" },
];

// حالات الحضور (مفهرسة بقيمة enum) — تُستخدم لتلوين خلايا الشبكة
export const ATTENDANCE_STATUSES = [
	{ key: "present", label: "حاضر", color: "#16A34A" },
	{ key: "absent", label: "غائب", color: "#DC2626" },
	{ key: "late", label: "متأخر", color: "#F59E0B" },
	{ key: "leave", label: "إجازة", color: "#F9CE35" },
	{ key: "mission", label: "مأمورية", color: "#14B8A6" },
	{ key: "overtime", label: "إضافة", color: "#6366F1" },
] as const;

export type AttendanceStatusKey = (typeof ATTENDANCE_STATUSES)[number]["key"];

// دليل الألوان كما في تصميم Figma (Frame 1984079481)
export const ATTENDANCE_LEGEND = [
	{ key: "present", label: "حاضر", color: "#16A34A" },
	{ key: "absent", label: "غائب", color: "#DC2626" },
	{ key: "leave", label: "إجازة", color: "#A855F7" },
	{ key: "late", label: "متأخر", color: "#F59E0B" },
	{ key: "shift", label: "مناوبة", color: "#3B82F6" },
] as const;

export type AttendanceLegendKey = (typeof ATTENDANCE_LEGEND)[number]["key"];
