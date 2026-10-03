import type {
	NotificationChannel,
	OutboxStatus,
	RecallContactChannel,
	RecallOutcome,
	ReminderTrigger,
} from "@/generated/prisma/enums";

/**
 * [RC0] ثوابت العرض لوحدة التذكيرات.
 *
 * الوسوم العربية للأسباب والقنوات تعيش على الخادم (`reminders.defaults.ts`) وتصل
 * عبر `/reminders/meta` — فلا نسخة ثانية منها هنا. وما في هذا الملفّ هو ما لا
 * يعرفه الخادم: ألوان الشارات، وترتيب التبويبات، ونصوص الحالات المعروضة.
 */

export const REMINDER_TABS = [
	{ value: "recall", label: "طاولة الاستدعاء" },
	{ value: "rules", label: "القواعد" },
	{ value: "outbox", label: "الصندوق الصادر" },
	{ value: "jobs", label: "المُجدوِل" },
] as const;

export type ReminderTab = (typeof REMINDER_TABS)[number]["value"];

/** كل الأسباب في مرشِّح واحد — القيمة الفارغة تعني «الكلّ». */
export const ALL_TRIGGERS = "ALL";

export const OUTBOX_STATUS_META: Record<
	OutboxStatus,
	{ label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
	QUEUED: { label: "بانتظار الموعد", variant: "outline" },
	SENDING: { label: "قيد التسليم", variant: "secondary" },
	SENT: { label: "أُرسلت", variant: "default" },
	FAILED: { label: "فشلت", variant: "destructive" },
	// «متعذّرة» لا «فشلت»: قرارٌ نهائيّ بسببٍ معروف (لا قناة، لا عنوان)، لا عُطل
	// يُعاد. عرضُها حمراء يجعل الشاشة تبدو معطوبة وهي تعمل بالضبط كما صُمّمت.
	SKIPPED: { label: "متعذّرة", variant: "outline" },
	CANCELLED: { label: "أُلغيت", variant: "outline" },
	AWAITING_MANUAL: { label: "بانتظار إرسالك", variant: "secondary" },
};

export const CONTACT_CHANNELS: { value: RecallContactChannel; label: string }[] = [
	{ value: "PHONE", label: "مكالمة هاتفية" },
	{ value: "WHATSAPP", label: "واتساب" },
	{ value: "SMS", label: "رسالة نصية" },
	{ value: "EMAIL", label: "بريد إلكتروني" },
	{ value: "IN_PERSON", label: "حضوريًّا" },
	{ value: "INBOX", label: "عبر النظام" },
];

export const CONTACT_OUTCOMES: {
	value: RecallOutcome;
	label: string;
	/** يُخفي البند من قائمة العمل — الفرق بين «عولج» و«حاولنا» */
	closes: boolean;
}[] = [
	{ value: "BOOKED", label: "حُجز موعد", closes: true },
	{ value: "INFORMED", label: "أُبلغ", closes: true },
	{ value: "SNOOZED", label: "أجّله وليّ الأمر", closes: true },
	{ value: "DECLINED", label: "رفض", closes: true },
	{ value: "WRONG_NUMBER", label: "رقم خاطئ", closes: true },
	// هاتان لا تُغلقان البند عمدًا: وليّ أمرٌ لم يردّ يجب أن يبقى في قائمة الغد،
	// وإخفاؤه لمجرّد أن أحدهم حاول هو كيف يضيع نصف الاستدعاءات
	{ value: "NO_ANSWER", label: "لم يردّ", closes: false },
	{ value: "CALLBACK_REQUESTED", label: "طلب معاودة الاتصال", closes: false },
];

export const CHANNEL_ORDER: NotificationChannel[] = [
	"WHATSAPP",
	"EMAIL",
	"SMS",
	"PUSH",
	"INBOX",
];

/** نصّ التأخّر — «متأخّر ٣ أيام» / «بعد ٥ أيام» / «اليوم». */
export function latenessLabel(daysUntilDue: number | null): string {
	if (daysUntilDue === null) return "—";
	if (daysUntilDue === 0) return "اليوم";
	if (daysUntilDue < 0) return `متأخّر ${Math.abs(daysUntilDue)} يوم`;
	return `بعد ${daysUntilDue} يوم`;
}

/** لون شارة السبب — تدرّج واحد بثلاث شدّات، لا لون لكل سبب. */
export function latenessTone(daysUntilDue: number | null): string {
	if (daysUntilDue === null) return "text-muted-foreground";
	if (daysUntilDue < 0) return "text-destructive";
	if (daysUntilDue <= 3) return "text-foreground";
	return "text-muted-foreground";
}

const dateFmt = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });
const dateTimeFmt = new Intl.DateTimeFormat("ar", {
	dateStyle: "medium",
	timeStyle: "short",
});

export const formatDate = (value: string | Date | null | undefined): string =>
	value ? dateFmt.format(new Date(value)) : "—";

export const formatDateTime = (value: string | Date | null | undefined): string =>
	value ? dateTimeFmt.format(new Date(value)) : "—";

/** ساعات → نصّ إزاحة مقروء. السالب يعني «بعد» لا «قبل». */
export function offsetLabel(offsetHours: number): string {
	if (offsetHours === 0) return "يوم الاستحقاق";
	const abs = Math.abs(offsetHours);
	const when = offsetHours > 0 ? "قبل" : "بعد";
	if (abs % 24 === 0) return `${when} ${abs / 24} يوم`;
	return `${when} ${abs} ساعة`;
}

/** دقائق من منتصف الليل → «21:00». */
export function minutesToClock(minutes: number | null): string {
	if (minutes === null) return "—";
	const h = String(Math.floor(minutes / 60)).padStart(2, "0");
	const m = String(minutes % 60).padStart(2, "0");
	return `${h}:${m}`;
}

export const TRIGGER_KEYS: ReminderTrigger[] = [
	"VACCINATION_DUE",
	"GROOMING_DUE",
	"NUTRITION_RECHECK_DUE",
	"APPOINTMENT_UPCOMING",
	"APPOINTMENT_NO_SHOW",
	"CARE_PLAN_VISIT_DUE",
	"INVOICE_OVERDUE",
	"MEMBERSHIP_RENEWAL",
	"POST_OP_FOLLOW_UP",
];
