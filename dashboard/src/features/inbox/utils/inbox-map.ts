import type {
	InboxImportance as ClientImportance,
	InboxActivity,
	InboxApproval,
	InboxContact,
	InboxIcon,
	InboxNotification,
	InboxNotificationCategory,
	InboxTimeGroup,
} from "@/features/inbox/types/inbox.type";
import type { InboxImportance, InboxItemType } from "@/generated/prisma/enums";
import type {
	InboxActivityResponse,
	InboxItemDetailResponse,
	InboxItemResponse,
} from "@/server/inbox/inbox.type";

// نوع الإشعار (enum قاعدة البيانات) → أيقونة الصف + الفئة + رقاقة النوع
const TYPE_MAP: Record<
	InboxItemType,
	{ icon: InboxIcon; category: InboxNotificationCategory; label: string }
> = {
	APPOINTMENT_CANCELLED: {
		icon: "appointment-cancelled",
		category: "appointments",
		label: "موعد",
	},
	APPOINTMENT_NEW: { icon: "appointment-new", category: "appointments", label: "موعد" },
	APPOINTMENT_PENDING: {
		icon: "appointment-pending",
		category: "appointments",
		label: "موعد",
	},
	APPOINTMENT_CONFIRMED: {
		icon: "appointment-confirmed",
		category: "appointments",
		label: "موعد",
	},
	INVOICE: { icon: "invoice", category: "billing", label: "مالية" },
	MEMBERSHIP: { icon: "invoice", category: "billing", label: "عضوية" },
	INSURANCE: { icon: "invoice", category: "billing", label: "تأمين" },
	TASK: { icon: "task", category: "staff", label: "مهمة" },
	SYSTEM: { icon: "system", category: "system", label: "تحديث" },
	LAB: { icon: "system", category: "patients", label: "مختبر" },
	RADIOLOGY: { icon: "system", category: "patients", label: "أشعة" },
	CARE: { icon: "task", category: "patients", label: "عناية" },
	GROOMING: { icon: "task", category: "patients", label: "تجميل" },
	STOCK: { icon: "system", category: "inventory", label: "مخزون" },
	OPERATION: { icon: "system", category: "patients", label: "عمليات" },
	VACCINATION: { icon: "system", category: "patients", label: "تطعيم" },
	MENTION: { icon: "mention", category: "appointments", label: "إشارة" },
	// [CRM-P1] §3.2 — إشعار إسناد عميل محتمل: صفٌّ قابل للتنفيذ كالمهمّة، وفئته «الفريق»
	// لأنه موجَّه إلى الموظّف المُسنَد إليه، ريثما تُفرد فئة خاصة بإدارة العملاء.
	LEAD: { icon: "task", category: "staff", label: "عميل محتمل" },
	// [CRM-P2] §4 — إشعار إسناد صفقة: نفس شكل إسناد العميل المحتمل تمامًا
	DEAL: { icon: "task", category: "staff", label: "صفقة" },
	INPATIENT: { icon: "system", category: "patients", label: "تنويم" },
	// [E0] الطوارئ — وصول، تجاوز هدف انتظار، ترقية فرز. فئتها «الأطفال» كالتنويم
	// والعمليات: حدثٌ على طفل بعينه لا تحديثٌ إداريّ.
	TRIAGE: { icon: "system", category: "patients", label: "طوارئ" },
};

const IMPORTANCE_MAP: Record<InboxImportance, ClientImportance> = {
	HIGH: "high",
	NORMAL: "normal",
	LOW: "low",
};

export function mapImportance(importance: InboxImportance): ClientImportance {
	return IMPORTANCE_MAP[importance];
}

export function mapType(type: InboxItemType) {
	return TYPE_MAP[type];
}

// يحسب المجموعة الزمنية (اليوم/أمس/آخر أسبوع) من تاريخ الإنشاء
export function timeGroupFor(createdAt: string | Date): InboxTimeGroup {
	const created = new Date(createdAt);
	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const createdMs = created.getTime();
	if (createdMs >= startOfToday) return "today";
	if (createdMs >= startOfToday - 86_400_000) return "yesterday";
	return "lastWeek";
}

// يبني قائمة "المعنيون" من الطفل/وليّ الأمر المرتبطين
function buildContacts(item: InboxItemResponse | InboxItemDetailResponse): InboxContact[] {
	const contacts: InboxContact[] = [];
	if (item.owner) {
		contacts.push({
			id: item.owner.id,
			name: item.owner.name,
			kind: "owner",
			phone: item.owner.phone,
		});
	}
	return contacts;
}

// شكل الطفل للواجهة (من علاقة patient)
function mapPatient(item: InboxItemResponse | InboxItemDetailResponse) {
	if (!item.patient) return undefined;
	return {
		code: item.patient.code,
		name: item.patient.name,
		species: item.patient.animalType?.arName ?? "",
	};
}

// عنصر نشاط الخادم → شكل الواجهة
export function mapActivity(a: InboxActivityResponse): InboxActivity {
	return {
		id: a.id,
		actorName: a.author.name ?? "—",
		action:
			a.type === "COMMENT"
				? "علّق"
				: a.type === "ACCEPTED"
					? "وافق"
					: a.type === "REJECTED"
						? "رفض"
						: "أنشأ هذا الإشعار",
		createdAt: new Date(a.createdAt).toISOString(),
		comment: a.type === "COMMENT" ? (a.body ?? undefined) : undefined,
	};
}

// عنصر إشعار الخادم → شكل الواجهة (قائمة الإشعارات)
export function mapNotification(item: InboxItemResponse): InboxNotification {
	const t = mapType(item.type);
	return {
		id: item.id,
		title: item.title,
		category: t.category,
		icon: t.icon,
		importance: mapImportance(item.importance),
		status:
			item.status === "RESOLVED" ? "resolved" : item.status === "DRAFT" ? "draft" : "open",
		createdAt: new Date(item.createdAt).toISOString(),
		timeGroup: timeGroupFor(item.createdAt),
		read: item.read,
		patient: mapPatient(item),
		contacts: buildContacts(item),
		activity: [],
		appointmentId: item.appointmentId ?? undefined,
		taskId: item.taskId ?? undefined,
		conversationId: item.conversationId ?? undefined,
	};
}

// عنصر إشعار مفصّل (مع النشاط) → شكل الواجهة
export function mapNotificationDetail(item: InboxItemDetailResponse): InboxNotification {
	return {
		...mapNotification(item),
		activity: item.activity.map(mapActivity),
	};
}

// عنصر موافقة الخادم → شكل الواجهة (قائمة الموافقات)
export function mapApproval(item: InboxItemResponse): InboxApproval {
	return {
		id: item.id,
		title: item.title,
		typeLabel: mapType(item.type).label,
		importance: mapImportance(item.importance),
		createdAt: new Date(item.createdAt).toISOString(),
		timeGroup: timeGroupFor(item.createdAt),
		read: item.read,
		patient: mapPatient(item),
	};
}
