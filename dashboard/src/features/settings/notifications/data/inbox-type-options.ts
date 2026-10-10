import type { InboxSettingsResponse } from "@/server/inbox-settings/inbox-settings.type";

// أنواع عناصر الوارد التي يمكن للمستخدم كتم تنبيهها.
// المفتاح مُتحقَّق منه مقابل شكل الإعدادات — أي إعادة تسمية في المخطّط تكسر البناء.
export const INBOX_TYPE_OPTIONS = [
	{ key: "typeAppointments", label: "الجلسات", subtitle: "حجز الزيارات وتأكيدها وإلغاؤها" },
	{ key: "typeLab", label: "المختبر", subtitle: "طلبات التحاليل والنتائج والعيّنات" },
	{
		key: "typeRadiology",
		label: "الأشعة",
		subtitle: "طلبات الأشعة والتقارير والنتائج الحرجة",
	},
	{ key: "typeTasks", label: "المهام", subtitle: "إسناد المهام وتحديثاتها" },
	{ key: "typeStock", label: "المخزون", subtitle: "تنبيهات المخزون المنخفض" },
	{ key: "typeInvoices", label: "الفواتير والمصروفات", subtitle: "الفواتير وطلبات المصروفات" },
	{
		key: "typeMentions",
		label: "الإشارات (@)",
		subtitle: "عند الإشارة إليك في ملاحظة أو تعليق",
	},
	{ key: "typeApprovals", label: "طلبات الموافقة", subtitle: "الطلبات التي تنتظر قرارك" },
	{ key: "typeSystem", label: "النظام", subtitle: "إشعارات النظام وخطط الرعاية" },
] as const satisfies readonly {
	key: keyof InboxSettingsResponse;
	label: string;
	subtitle: string;
}[];
