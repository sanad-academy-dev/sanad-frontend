export function formatDuration(minutes: number | null): string {
	if (minutes === null) return "—";
	if (minutes < 60) return `${minutes} د`;

	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m > 0 ? `${h} س ${m} د` : `${h} ساعة`;
}
