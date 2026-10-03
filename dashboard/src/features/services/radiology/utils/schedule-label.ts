import { radiologyMinutesUntilDue } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

// صياغة موعد الفحص للعرض. القريب يُقاس بالوقت المتبقّي («بعد ٢٠ دقيقة») لأنه
// ما يهمّ الفنّي الآن، والبعيد يُعرض بتاريخه. المتأخّر يُقال صراحةً.

const time = new Intl.DateTimeFormat("ar-EG", {
	hour: "numeric",
	minute: "2-digit",
	calendar: "gregory",
});

const dayAndTime = new Intl.DateTimeFormat("ar-EG", {
	day: "numeric",
	month: "short",
	hour: "numeric",
	minute: "2-digit",
	calendar: "gregory",
});

const isSameDay = (a: Date, b: Date) =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();

export const formatScheduleLabel = (
	scheduledAt: Date | string,
	now: Date = new Date(),
): string => {
	const at = typeof scheduledAt === "string" ? new Date(scheduledAt) : scheduledAt;
	if (Number.isNaN(at.getTime())) return "—";

	const minutes = radiologyMinutesUntilDue(at, now) ?? 0;

	// تأخّر عن موعده — الحالة التي تستدعي تدخّلًا
	if (minutes < 0) {
		const late = Math.abs(minutes);
		if (late < 60) return `تأخّر ${late} دقيقة`;
		if (late < 60 * 24) return `تأخّر ${Math.floor(late / 60)} ساعة`;
		return `متأخّر — ${dayAndTime.format(at)}`;
	}

	if (minutes < 60) return `بعد ${minutes || 1} دقيقة — ${time.format(at)}`;
	if (isSameDay(at, now)) return `اليوم ${time.format(at)}`;

	const tomorrow = new Date(now);
	tomorrow.setDate(tomorrow.getDate() + 1);
	if (isSameDay(at, tomorrow)) return `غدًا ${time.format(at)}`;

	return dayAndTime.format(at);
};
