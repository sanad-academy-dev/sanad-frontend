import { fromZonedTime, toZonedTime } from "date-fns-tz";
import type { Language } from "@/lib/data/constants";

export type CalendarType = "GREGORIAN" | "HIJRI";

// ─── Locale mappings ─────────────────────────────────────────────────────────

const INTL_LOCALE: Record<Language, string> = {
	ar: "ar-SA",
	en: "en-US",
};

const INTL_CALENDAR: Record<CalendarType, string> = {
	GREGORIAN: "gregory",
	HIJRI: "islamic-umalqura",
};

// ─── Context ──────────────────────────────────────────────────────────────────

export type DateContext = {
	/** IANA timezone string, e.g. "Asia/Riyadh" */
	timezone: string;
	/** UI language */
	lang: Language;
	/** Calendar system to display */
	calendarType: CalendarType;
};

// ─── Display helpers ─────────────────────────────────────────────────────────

/**
 * Format a date for display in the clinic's timezone, language, and calendar.
 *
 * @example
 * formatDate(task.deadline, ctx)
 * // ar + HIJRI → "الأربعاء، ٢٤ شوال ١٤٤٧"
 * // en + GREGORIAN → "Wed, Apr 23, 2026"
 */
export function formatDate(
	date: Date | string | number,
	ctx: DateContext,
	dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "medium",
): string {
	return new Intl.DateTimeFormat(INTL_LOCALE[ctx.lang], {
		timeZone: ctx.timezone,
		calendar: INTL_CALENDAR[ctx.calendarType],
		dateStyle,
	}).format(new Date(date));
}

/**
 * Format a month label (e.g. chart axes) in the clinic's language and calendar.
 * Gregorian → "يناير" / "Jan"; Hijri → "محرم" / "Muharram".
 * Pass `withYear` to disambiguate a 12-month window that spans a year boundary.
 *
 * @example
 * formatMonthLabel("2026-01-01", ctx)            // ar + HIJRI → "رجب"
 * formatMonthLabel("2026-01-01", ctx, true)      // ar + HIJRI → "رجب ١٤٤٧"
 */
export function formatMonthLabel(
	date: Date | string | number,
	ctx: DateContext,
	withYear = false,
): string {
	return new Intl.DateTimeFormat(INTL_LOCALE[ctx.lang], {
		timeZone: ctx.timezone,
		calendar: INTL_CALENDAR[ctx.calendarType],
		month: "long",
		...(withYear ? { year: "numeric" } : {}),
	}).format(new Date(date));
}

/**
 * Format a time for display in the clinic's timezone and language.
 *
 * @example
 * formatTime(task.deadline, ctx)
 * // ar → "١٠:٣٠ ص"
 * // en → "10:30 AM"
 */
export function formatTime(
	date: Date | string | number,
	ctx: Pick<DateContext, "timezone" | "lang">,
	timeStyle: Intl.DateTimeFormatOptions["timeStyle"] = "short",
): string {
	return new Intl.DateTimeFormat(INTL_LOCALE[ctx.lang], {
		timeZone: ctx.timezone,
		timeStyle,
	}).format(new Date(date));
}

/**
 * Format a date and time together in the clinic's locale.
 *
 * @example
 * formatDateTime(task.deadline, ctx)
 * // ar + HIJRI → "٢٤ شوال ١٤٤٧، ١٠:٣٠ ص"
 * // en + GREGORIAN → "Apr 23, 2026, 10:30 AM"
 */
export function formatDateTime(
	date: Date | string | number,
	ctx: DateContext,
	dateStyle: Intl.DateTimeFormatOptions["dateStyle"] = "medium",
	timeStyle: Intl.DateTimeFormatOptions["timeStyle"] = "short",
): string {
	return new Intl.DateTimeFormat(INTL_LOCALE[ctx.lang], {
		timeZone: ctx.timezone,
		calendar: INTL_CALENDAR[ctx.calendarType],
		dateStyle,
		timeStyle,
	}).format(new Date(date));
}

/**
 * Format a relative time ("3 hours ago", "منذ ٣ ساعات").
 * Uses the clinic timezone to compute the diff correctly.
 *
 * @example
 * formatRelative(task.createdAt, ctx)
 * // ar → "منذ ٣ ساعات"
 * // en → "3 hours ago"
 */
export function formatRelative(
	date: Date | string | number,
	ctx: Pick<DateContext, "timezone" | "lang">,
): string {
	const d = toZonedTime(new Date(date), ctx.timezone);
	const now = toZonedTime(new Date(), ctx.timezone);

	const diffMs = now.getTime() - d.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	const diffMins = Math.floor(diffSecs / 60);
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);
	const diffWeeks = Math.floor(diffDays / 7);
	const diffMonths = Math.floor(diffDays / 30);
	const diffYears = Math.floor(diffDays / 365);

	const rtf = new Intl.RelativeTimeFormat(INTL_LOCALE[ctx.lang], {
		numeric: "auto",
	});

	if (Math.abs(diffYears) >= 1) return rtf.format(-diffYears, "year");
	if (Math.abs(diffMonths) >= 1) return rtf.format(-diffMonths, "month");
	if (Math.abs(diffWeeks) >= 1) return rtf.format(-diffWeeks, "week");
	if (Math.abs(diffDays) >= 1) return rtf.format(-diffDays, "day");
	if (Math.abs(diffHours) >= 1) return rtf.format(-diffHours, "hour");
	if (Math.abs(diffMins) >= 1) return rtf.format(-diffMins, "minute");
	return rtf.format(-diffSecs, "second");
}

// ─── Conversion helpers (for date pickers) ───────────────────────────────────

/**
 * Convert a "local" Date from a date picker to UTC for sending to the server.
 *
 * Date pickers give you a Date whose value represents the user's *intended*
 * local time (e.g. 9:00 AM clinic time). This function reinterprets it as
 * being in `timezone` and converts to UTC.
 *
 * @example
 * // Picker gives: new Date(2026, 3, 23, 9, 0) — "April 23 at 9:00"
 * const utc = localToUTC(pickerDate, "Asia/Riyadh");
 * // → 2026-04-23T06:00:00.000Z  (UTC+3 offset applied)
 */
export function localToUTC(localDate: Date, timezone: string): Date {
	return fromZonedTime(localDate, timezone);
}

/**
 * Convert a UTC Date from the server to the clinic's local time.
 * Use this to feed a UTC date back into a date picker.
 *
 * The returned Date object's `.getHours()`, `.getDate()` etc. reflect
 * the clinic's local time when treated as a "wall clock" value.
 *
 * @example
 * const local = utcToLocal(task.deadline, "Asia/Riyadh");
 * // task.deadline = 2026-04-23T06:00:00Z → local.getHours() === 9
 */
export function utcToLocal(utcDate: Date | string, timezone: string): Date {
	return toZonedTime(new Date(utcDate), timezone);
}
