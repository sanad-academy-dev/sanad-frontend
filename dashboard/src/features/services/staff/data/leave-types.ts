import { COMPENSATORY_LEAVE_TYPE } from "@sanad/contracts/runtime/server/compensatory/compensatory.type";

// أنواع الإجازات وفق نظام العمل السعودي + الإجازة التعويضية.
// مصدر واحد لكل قوائم اختيار "نوع الإجازة" في التطبيق — لا تُعرّف القائمة محليًا في المكوّنات.
// entitlement: المدة النظامية للإجازة (للعرض كتلميح مساعد عند الاختيار).
export const LEAVE_TYPES = [
	{ label: "إجازة سنوية", entitlement: "لا تقل عن 21 يومًا" },
	{ label: "إجازة الأعياد", entitlement: "أربعة أيام" },
	{ label: "المناسبات الوطنية", entitlement: "يوم واحد" },
	{ label: "إجازة وفاة", entitlement: "خمسة أيام" },
	{ label: "إجازة مولود جديد", entitlement: "ثلاثة أيام" },
	{ label: "إجازة الوضع", entitlement: "عشرة أسابيع" },
	{ label: "إجازة الاختبارات", entitlement: "بعدد أيام الاختبارات الفعلية" },
	{ label: "إجازة زواج", entitlement: "خمسة أيام" },
	{ label: "إجازة أداء فريضة الحج", entitlement: "من 10 إلى 15 يوم" },
	{ label: "إجازة مرضية", entitlement: "بعدد أيام المرض" },
	{ label: COMPENSATORY_LEAVE_TYPE, entitlement: "تُخصم من الرصيد التعويضي" },
] as const;

export type LeaveTypeOption = (typeof LEAVE_TYPES)[number];
export type LeaveTypeLabel = LeaveTypeOption["label"];
