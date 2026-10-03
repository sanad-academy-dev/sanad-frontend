export function formatRelativeDate(date: Date | string | null | undefined): string {
	if (!date) return "—";

	const d = new Date(date);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "اليوم";
	if (diffDays === 1) return "أمس";
	if (diffDays < 7) return "هذا الأسبوع";
	if (diffDays < 14) return "الأسبوع الماضي";
	if (diffDays < 30) return "هذا الشهر";
	if (diffDays < 60) return "الشهر الماضي";

	return d.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });
}

export function formatCompactRelativeDate(date: Date | string): string {
	const d = new Date(date);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "اليوم";
	if (diffDays === 1) return "أمس";
	if (diffDays < 7) return "هذا الأسبوع";
	if (diffDays < 30) return "هذا الشهر";

	return d.toLocaleDateString("ar-SA", { day: "numeric", month: "long", year: "numeric" });
}
