import type { BookingHourOption } from "@/generated/prisma/enums";
import { AppointmentStatus } from "@/generated/prisma/enums";
import type { ClinicSchedulingSettingsResponse } from "@/server/scheduling/scheduling.type";

// آلة حالات الزيارة — المصدر الوحيد للانتقالات المسموحة بين الحالات.
// موثّقة في docs/appointments-workflow.md — أي تعديل هنا يجب أن يُحدِّث ذلك الملف في نفس الـ PR.
// ملف بيانات/دوال نقية فقط (بدون db) — يُستورد من الخادم والواجهة معًا.

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
	[AppointmentStatus.WAITING]: "طابور",
	[AppointmentStatus.SCHEDULED]: "مجدول",
	[AppointmentStatus.CHECK_IN]: "تسجيل دخول",
	[AppointmentStatus.IN_SERVICE]: "جاري الدورة",
	[AppointmentStatus.HOSPITALIZED]: "دخول التنويم",
	[AppointmentStatus.AWAITING_PAYMENT]: "بإنتظار الدفع",
	[AppointmentStatus.DONE]: "تمت",
	[AppointmentStatus.CANCELLED]: "ملغي",
};

export const ALLOWED_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
	[AppointmentStatus.WAITING]: [
		AppointmentStatus.SCHEDULED,
		AppointmentStatus.CHECK_IN,
		AppointmentStatus.CANCELLED,
	],
	[AppointmentStatus.SCHEDULED]: [
		AppointmentStatus.CHECK_IN,
		AppointmentStatus.WAITING,
		AppointmentStatus.CANCELLED,
	],
	[AppointmentStatus.CHECK_IN]: [
		AppointmentStatus.IN_SERVICE,
		AppointmentStatus.SCHEDULED,
		AppointmentStatus.CANCELLED,
	],
	[AppointmentStatus.IN_SERVICE]: [
		AppointmentStatus.HOSPITALIZED,
		AppointmentStatus.AWAITING_PAYMENT,
		AppointmentStatus.CHECK_IN,
	],
	[AppointmentStatus.HOSPITALIZED]: [
		AppointmentStatus.AWAITING_PAYMENT,
		AppointmentStatus.IN_SERVICE,
	],
	[AppointmentStatus.AWAITING_PAYMENT]: [AppointmentStatus.DONE],
	[AppointmentStatus.DONE]: [],
	[AppointmentStatus.CANCELLED]: [],
};

// انتقالات "تراجع" — تصحيح خطأ إدخال خطوة واحدة للخلف، ولا تعبر حاجز الدفع أبدًا.
// مجموعة جزئية من ALLOWED_TRANSITIONS (تُختبر) — تُسجَّل في النشاط كأي انتقال آخر.
export const UNDO_TRANSITIONS: ReadonlyArray<readonly [AppointmentStatus, AppointmentStatus]> =
	[
		[AppointmentStatus.SCHEDULED, AppointmentStatus.WAITING],
		[AppointmentStatus.CHECK_IN, AppointmentStatus.SCHEDULED],
		[AppointmentStatus.IN_SERVICE, AppointmentStatus.CHECK_IN],
		[AppointmentStatus.HOSPITALIZED, AppointmentStatus.IN_SERVICE],
	];

export const TERMINAL_STATUSES = [
	AppointmentStatus.DONE,
	AppointmentStatus.CANCELLED,
] as const;

// الحالات التي يمكن أن "تولد" بها زيارة: مجدول (الافتراضي) أو طابور (حجز أونلاين / جدول ممتلئ)
export const CREATABLE_STATUSES = [
	AppointmentStatus.SCHEDULED,
	AppointmentStatus.WAITING,
] as const;

export const isTerminalStatus = (status: AppointmentStatus): boolean =>
	(TERMINAL_STATUSES as readonly AppointmentStatus[]).includes(status);

// صحة "تغيير" الحالة — نفس الحالة ليست انتقالًا (على المستدعي التعامل معها كـ no-op)
export const canTransition = (from: AppointmentStatus, to: AppointmentStatus): boolean =>
	ALLOWED_TRANSITIONS[from].includes(to);

export const isUndoTransition = (from: AppointmentStatus, to: AppointmentStatus): boolean =>
	UNDO_TRANSITIONS.some(([f, t]) => f === from && t === to);

export const invalidTransitionMessage = (
	from: AppointmentStatus,
	to: AppointmentStatus,
): string => `لا يمكن نقل الزيارة من "${STATUS_LABELS[from]}" إلى "${STATUS_LABELS[to]}"`;

// ── تبديل نوع الزيارة (المكان) ─────────────────────────────────────────────
// قاعدتان مستقلّتان، والخادم هو المرجع (الواجهة تعكس النتيجة فقط):
//  1) الحالة: يُقفل التبديل فور "تسجيل دخول" فما بعده — الزيارة بدأت فعليًا.
//  2) المهلة: قبل ذلك يُقفل إن كان المتبقّي على الموعد أقل من "أدنى مدة لتبديل الحجز"
//     (إعدادات الجدولة → rescheduleNotice*، تحت مفتاح "فعّل إعدادات الحجز").

export const LOCATION_LOCKED_STATUSES = [
	AppointmentStatus.CHECK_IN,
	AppointmentStatus.IN_SERVICE,
	AppointmentStatus.HOSPITALIZED,
	AppointmentStatus.AWAITING_PAYMENT,
	AppointmentStatus.DONE,
	AppointmentStatus.CANCELLED,
] as const;

export const isLocationLocked = (status: AppointmentStatus): boolean =>
	(LOCATION_LOCKED_STATUSES as readonly AppointmentStatus[]).includes(status);

export const BOOKING_HOUR_VALUES: Record<BookingHourOption, number> = { H12: 12, H24: 24 };

export type RescheduleNoticeSettings = Pick<
	ClinicSchedulingSettingsResponse,
	"bookingRulesEnabled" | "rescheduleNoticeEnabled" | "rescheduleNoticeHours"
>;

// عدد ساعات المهلة، أو null إن كانت القاعدة معطّلة (أو لا توجد إعدادات بعد).
export const rescheduleNoticeHours = (
	settings: RescheduleNoticeSettings | null | undefined,
): number | null =>
	settings?.bookingRulesEnabled && settings.rescheduleNoticeEnabled
		? BOOKING_HOUR_VALUES[settings.rescheduleNoticeHours]
		: null;

export type LocationChangeBlock =
	| { reason: "status"; status: AppointmentStatus }
	| { reason: "notice"; hours: number };

export const locationChangeBlock = ({
	status,
	startsAt,
	noticeHours,
	now,
}: {
	status: AppointmentStatus;
	startsAt: Date;
	noticeHours: number | null;
	now: Date;
}): LocationChangeBlock | null => {
	if (isLocationLocked(status)) return { reason: "status", status };
	if (
		noticeHours !== null &&
		startsAt.getTime() - now.getTime() < noticeHours * 60 * 60 * 1000
	)
		return { reason: "notice", hours: noticeHours };
	return null;
};

export const locationChangeBlockMessage = (block: LocationChangeBlock): string => {
	if (block.reason === "notice")
		return `لا يمكن تغيير نوع الزيارة قبل أقل من ${block.hours} ساعة من الموعد`;
	return isTerminalStatus(block.status)
		? `لا يمكن تغيير نوع الزيارة بعد انتهاء الزيارة (${STATUS_LABELS[block.status]})`
		: `لا يمكن تغيير نوع الزيارة بعد تسجيل الدخول (الحالة الحالية: ${STATUS_LABELS[block.status]})`;
};
