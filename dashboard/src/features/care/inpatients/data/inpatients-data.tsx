import {
	IconAlertTriangle,
	IconBedFlat,
	IconCheck,
	IconClock,
	IconDroplet,
	IconEye,
	IconHeartbeat,
	IconLogout,
	IconMeat,
	IconPill,
	IconStethoscope,
	IconVirus,
	IconWalk,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import type {
	InpatientAcuity,
	InpatientOrderKind,
	InpatientStayKind,
	InpatientStayStatus,
} from "@/generated/prisma/enums";
import type { InpatientDueStatus } from "@/server/inpatients/inpatient-due.service";

// [IP1] بيانات عرض ثابتة — الأعمدة والألوان والأيقونات.
// التسميات تُستورد من ملفّ سير العمل على الخادم فلا يختلف نصّان على شيء واحد.

export type BoardColumn = {
	id: InpatientStayStatus;
	label: string;
	hint: string;
};

/**
 * أعمدة اللوحة. «طلب تنويم» عمودٌ أوّل لا حالةٌ مخفيّة: الطلب المكتوب ينتظر
 * قفصًا، ومن يملك العنبر يقرأ اللوحة لا صندوق الوارد.
 */
export const INPATIENT_BOARD_COLUMNS: BoardColumn[] = [
	{ id: "REQUESTED", label: "طلب تنويم", hint: "بانتظار الإسكان — اختر قفصًا وأدخِل" },
	{ id: "ADMITTED", label: "دخل", hint: "وزن الدخول وإقرار التنويم قبل بدء الرعاية" },
	{ id: "IN_CARE", label: "قيد الرعاية", hint: "الجرعات والقياسات تجري" },
	{ id: "DISCHARGE_PENDING", label: "قيد الخروج", hint: "تصفية الفاتورة والتعليمات" },
];

/**
 * لون درجة الحرجية — شريط على حافّة الكرت لا خلفية كاملة.
 *
 * الشدّة تُقرأ بالشكل قبل النصّ: العنبر يُمسح بالنظر من بعيد، ومن يبحث عن الحالة
 * الحرجة لا يقرأ أربع كلمات في كل كرت. اللون هنا دلالي (خطر/تحذير) ومنفصل عن
 * لون الهويّة، فلا يتنافسان.
 */
export const ACUITY_META: Record<
	InpatientAcuity,
	{ label: string; bar: string; dot: string; text: string }
> = {
	CRITICAL: {
		label: "حرج جدًا",
		bar: "bg-destructive",
		dot: "bg-destructive",
		text: "text-destructive",
	},
	HIGH: {
		label: "حرج",
		bar: "bg-amber-500",
		dot: "bg-amber-500",
		text: "text-amber-600 dark:text-amber-500",
	},
	MEDIUM: {
		label: "متوسّط",
		bar: "bg-primary/50",
		dot: "bg-primary/60",
		text: "text-foreground",
	},
	LOW: {
		label: "مستقرّ",
		bar: "bg-muted-foreground/30",
		dot: "bg-muted-foreground/40",
		text: "text-muted-foreground",
	},
};

export const STAY_KIND_META: Record<
	InpatientStayKind,
	{ label: string; icon: ComponentType<{ className?: string }> }
> = {
	MEDICAL: { label: "تنويم طبي", icon: IconStethoscope },
	SURGICAL: { label: "ما بعد العملية", icon: IconHeartbeat },
	ICU: { label: "عناية مركّزة", icon: IconAlertTriangle },
	ISOLATION: { label: "عزل", icon: IconVirus },
	BOARDING: { label: "إقامة", icon: IconBedFlat },
};

/**
 * حالة الاستحقاق — الشارة التي تُرتَّب بها اللوحة.
 *
 * الفائت وحده أحمر. جعلُ «المستحقّ الآن» أحمر أيضًا يُلغي معنى الأحمر: نصف
 * العنبر مستحقٌّ في أي لحظة، وأحمرُ دائمٌ لا يُقرأ.
 */
export const DUE_STATUS_META: Record<
	InpatientDueStatus,
	{ label: string; className: string; icon: ComponentType<{ className?: string }> }
> = {
	OVERDUE: {
		label: "فات موعده",
		className: "bg-destructive/10 text-destructive border-destructive/25",
		icon: IconAlertTriangle,
	},
	DUE: {
		label: "مستحقّ الآن",
		className: "bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-500/25",
		icon: IconClock,
	},
	DUE_SOON: {
		label: "يقترب",
		className: "bg-muted text-muted-foreground border-border",
		icon: IconClock,
	},
	ON_TRACK: {
		label: "منضبط",
		className: "bg-muted/50 text-muted-foreground border-transparent",
		icon: IconCheck,
	},
};

export const ORDER_KIND_META: Record<
	InpatientOrderKind,
	{ label: string; icon: ComponentType<{ className?: string }> }
> = {
	MEDICATION: { label: "دواء", icon: IconPill },
	FLUID: { label: "سوائل", icon: IconDroplet },
	MONITORING: { label: "مراقبة", icon: IconEye },
	FEEDING: { label: "تغذية", icon: IconMeat },
	ACTIVITY: { label: "نشاط", icon: IconWalk },
	WOUND_CARE: { label: "عناية بالجرح", icon: IconHeartbeat },
	LAB: { label: "تحليل", icon: IconStethoscope },
	IMAGING: { label: "تصوير", icon: IconStethoscope },
	OTHER: { label: "أخرى", icon: IconStethoscope },
};

export const ADMIN_STATUS_META: Record<
	string,
	{ label: string; className: string; icon: ComponentType<{ className?: string }> }
> = {
	PENDING: {
		label: "بانتظار",
		className: "bg-muted text-muted-foreground",
		icon: IconClock,
	},
	GIVEN: {
		label: "أُعطي",
		className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500",
		icon: IconCheck,
	},
	SKIPPED: { label: "تُخطّي", className: "bg-muted text-muted-foreground", icon: IconX },
	HELD: { label: "موقوف", className: "bg-muted text-muted-foreground", icon: IconLogout },
};

/** أوقات جاهزة لجدول الجرعات — تُختار بضغطة بدل كتابة كل موعد */
export const SCHEDULE_PRESETS = [
	{ label: "كل ٤ ساعات (q4h)", intervalHours: 4 },
	{ label: "كل ٦ ساعات (q6h)", intervalHours: 6 },
	{ label: "كل ٨ ساعات (q8h)", intervalHours: 8 },
	{ label: "كل ١٢ ساعة (q12h)", intervalHours: 12 },
	{ label: "مرّة يوميًا (q24h)", intervalHours: 24 },
] as const;

export const MONITORING_PRESETS = [
	{ label: "كل ساعة", minutes: 60 },
	{ label: "كل ساعتين", minutes: 120 },
	{ label: "كل ٤ ساعات", minutes: 240 },
	{ label: "كل ٨ ساعات", minutes: 480 },
] as const;
