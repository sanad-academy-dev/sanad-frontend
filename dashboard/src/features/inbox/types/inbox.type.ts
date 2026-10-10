import { z } from "zod";

/**
 * الوارد (Inbox) — UI-first feature backed by mock data.
 *
 * NOTE: There is no Prisma model for the inbox notification feed yet. The
 * `InboxNotification` / `InboxActivity` shapes below are hand-authored mock
 * types. When the backend lands, replace them with
 * `Prisma.InboxNotificationGetPayload<{ select: ... }>` (see AGENTS.md "Type
 * Reuse") rather than duplicating fields.
 */

// فئات الفلترة أعلى قائمة الوارد (الكل / الجلسات / ...)
export const INBOX_CATEGORIES = [
	{ value: "all", label: "الكل" },
	{ value: "appointments", label: "الجلسات" },
	{ value: "owners", label: "أولياء الأمور" },
	{ value: "patients", label: "المرضي" },
	{ value: "staff", label: "الموظفين" },
	{ value: "inventory", label: "المخزون" },
	{ value: "billing", label: "الفوتره" },
	{ value: "system", label: "النظام" },
] as const;

export type InboxCategory = (typeof INBOX_CATEGORIES)[number]["value"];

// الفئات الفعلية للإشعارات (بدون "الكل" التي هي فلتر فقط)
export type InboxNotificationCategory = Exclude<InboxCategory, "all">;

// نوع الأيقونة المعروضة في شارة الصف — يحدد الأيقونة واللون
export type InboxIcon =
	| "appointment-cancelled"
	| "appointment-new"
	| "appointment-pending"
	| "appointment-confirmed"
	| "system"
	| "task"
	| "invoice"
	| "mention";

export type InboxImportance = "low" | "normal" | "high";

export type InboxStatus = "draft" | "open" | "resolved";

// مجموعات القائمة الزمنية (اليوم / أمس / آخر أسبوع)
export const INBOX_TIME_GROUPS = [
	{ value: "today", label: "اليوم" },
	{ value: "yesterday", label: "أمس" },
	{ value: "lastWeek", label: "آخر أسبوع" },
] as const;

export type InboxTimeGroup = (typeof INBOX_TIME_GROUPS)[number]["value"];

// مرجع لطفل مرتبط بالإشعار (يظهر في شريط التفاصيل)
export type InboxPatientRef = {
	code: string;
	name: string;
	species: string;
};

// جهة معنية بالإشعار (مدرّب / وليّ أمر) تظهر في قسم "المعنيون"
export type InboxContact = {
	id: string;
	name: string;
	kind: "staff" | "owner";
	phone?: string;
};

// عنصر في سجل النشاط أسفل التفاصيل
export type InboxActivity = {
	id: string;
	actorName: string;
	action: string;
	createdAt: string; // ISO
	// تعليق حر أضافه مستخدم (بدلاً من حدث نظام)
	comment?: string;
};

export type InboxNotification = {
	id: string;
	title: string;
	category: InboxNotificationCategory;
	icon: InboxIcon;
	importance: InboxImportance;
	status: InboxStatus;
	createdAt: string; // ISO
	timeGroup: InboxTimeGroup;
	read: boolean;
	patient?: InboxPatientRef;
	contacts: InboxContact[];
	activity: InboxActivity[];
	// الزيارة المرتبطة — عند النقر يُفتح تفاصيلها (إشعارات الإشارة/الجلسات)
	appointmentId?: string;
	// المهمة المرتبطة — عند النقر تُفتح تفاصيلها (إشعارات إشارة المهام)
	taskId?: string;
	// محادثة «الرسائل» المرتبطة — عند النقر تُفتح المحادثة نفسها
	conversationId?: string;
};

// نموذج إضافة تعليق في قسم النشاط
export const addCommentSchema = z.object({
	comment: z.string({ error: "التعليق مطلوب" }).min(1, "التعليق مطلوب"),
});

export type AddCommentFormInput = z.infer<typeof addCommentSchema>;

// ترتيب قائمة الوارد (الأحدث / الأقدم / الأهمية)
export const INBOX_SORT_OPTIONS = [
	{ value: "newest", label: "الأحدث" },
	{ value: "oldest", label: "الأقدم" },
	{ value: "importance", label: "الأهمية" },
] as const;

export type InboxSort = (typeof INBOX_SORT_OPTIONS)[number]["value"];

// خصائص العرض القابلة للتبديل (رقائق "خصائص العرض")
export const INBOX_DISPLAY_PROPERTIES = [
	{ value: "type", label: "النوع" },
	{ value: "importance", label: "درجة الأهمية" },
	{ value: "statusIcon", label: "الحالة والأيقونة" },
	{ value: "id", label: "المعرف" },
] as const;

export type InboxDisplayProperty = (typeof INBOX_DISPLAY_PROPERTIES)[number]["value"];

// تبويبات رأس الوارد (الإشعارات / الموافقات)
export type InboxTab = "notifications" | "approvals";

// عنصر في قائمة الموافقات — عنوان + رقاقة نوع + درجة أهمية + وقت
export type InboxApproval = {
	id: string;
	title: string;
	// رقاقة النوع (عناية / مختبر / موعد / مخزون / مالية / تحديث ...)
	typeLabel: string;
	importance: InboxImportance;
	createdAt: string; // ISO
	timeGroup: InboxTimeGroup;
	read: boolean;
	patient?: InboxPatientRef;
};
