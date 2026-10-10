import {
	PEAK_SCHEDULED_THRESHOLD,
	PEAK_WEEKDAYS,
} from "@/features/inbox/data/inbox-constants";

// نص شريط الرؤى أعلى قائمة الوارد — تجاوز العتبة أولوية لأنه أكثر تحديدًا من يوم الذروة
export const getInboxInsight = (now: Date, scheduledTodayCount: number): string => {
	if (scheduledTodayCount > PEAK_SCHEDULED_THRESHOLD)
		return `ذروة متوقعة اليوم: تجاوزت الزيارات المجدولة ${PEAK_SCHEDULED_THRESHOLD} زيارة (${scheduledTodayCount} زيارة)`;
	if (PEAK_WEEKDAYS.includes(now.getDay()))
		return "اليوم من أوقات الذروة المتوقعة — أيام الجمعة والسبت";
	return "تم توقع أوقات الذروة القادمة أيام الجمعة والسبت";
};
