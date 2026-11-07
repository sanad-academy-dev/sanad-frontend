export const DEFAULT_CLINIC_TIMEZONE = "Africa/Cairo";

/**
 * تنسيق موعد المقابلة بالتاريخ والوقت مع ضمان التقيد بالمنطقة الزمنية للمركز/الأكاديمية دائماً
 * لمنع انزياح الساعة (مثلاً 1:00 م إلى 12:00 م) بسبب اختلاف المنطقة الزمنية لمتصفح المستخدم
 */
export function formatAppointmentDateTime(
	date: Date | string | number | null | undefined,
	timeZone: string = DEFAULT_CLINIC_TIMEZONE,
	locale: string = "ar-EG-u-nu-latn",
): string {
	if (!date) return "لم يُحدد بعد";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "غير صالح";
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timeZone || DEFAULT_CLINIC_TIMEZONE,
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(d);
	} catch {
		return d.toLocaleString(locale);
	}
}

/**
 * تنسيق التاريخ مع مراعاة المنطقة الزمنية للمركز
 */
export function formatAppointmentDate(
	date: Date | string | number | null | undefined,
	timeZone: string = DEFAULT_CLINIC_TIMEZONE,
	locale: string = "ar-EG-u-nu-latn",
	options?: Intl.DateTimeFormatOptions,
): string {
	if (!date) return "غير محدد";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "غير صالح";
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timeZone || DEFAULT_CLINIC_TIMEZONE,
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			...options,
		}).format(d);
	} catch {
		return d.toLocaleDateString(locale);
	}
}

/**
 * تنسيق الوقت فقط مع مراعاة المنطقة الزمنية للمركز (مثال: 01:00 م)
 */
export function formatAppointmentTime(
	date: Date | string | number | null | undefined,
	timeZone: string = DEFAULT_CLINIC_TIMEZONE,
	locale: string = "ar-EG-u-nu-latn",
): string {
	if (!date) return "--:--";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "--:--";
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timeZone || DEFAULT_CLINIC_TIMEZONE,
			hour: "2-digit",
			minute: "2-digit",
		}).format(d);
	} catch {
		return d.toLocaleTimeString(locale);
	}
}
