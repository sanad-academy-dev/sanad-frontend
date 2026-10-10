import {
	IconClipboardText,
	IconPackage,
	IconReport,
	IconRoute,
	IconSettings,
	IconStethoscope,
	IconUsers,
	type TablerIcon,
} from "@tabler/icons-react";

// قائمة الوكلاء الفرعية القابلة للتفعيل في إعدادات الذكاء الاصطناعي (frame 4103)
export type SubAgentSetting = {
	key: string;
	title: string;
	description: string;
	icon: TablerIcon;
	enabled: boolean; // مفعّل الآن أم "متاح للربط"
};

export const SUB_AGENTS: SubAgentSetting[] = [
	{
		key: "general",
		title: "مساعد أوكس العام",
		description:
			"المساعد الذي يفهم الأوامر ويربط النظام — يجيب على الأسئلة وينفّذ الأوامر عبر جميع الوحدات.",
		icon: IconSettings,
		enabled: true,
	},
	{
		key: "hr",
		title: "وكيل الموارد البشرية",
		description: "إنشاء المجموعات وإدارة الموظفين والرواتب بشكل تلقائي.",
		icon: IconUsers,
		enabled: false,
	},
	{
		key: "visits",
		title: "وكيل الزيارات",
		description: "تحويل الطلبات إلى جلسات منظمة.",
		icon: IconClipboardText,
		enabled: false,
	},
	{
		key: "inventory",
		title: "وكيل المخزون",
		description: "تحليل الأدوية والكميات والتنبيهات المستقبلية.",
		icon: IconPackage,
		enabled: false,
	},
	{
		key: "workflow",
		title: "وكيل سير العمل",
		description: "تنفيذ المهام: إنشاء المهام وإرسال الإشعارات التلقائية.",
		icon: IconRoute,
		enabled: false,
	},
	{
		key: "nursing",
		title: "وكيل التطفل",
		description: "متابعة الحالات الحرجة وتذكيرات الرعاية.",
		icon: IconStethoscope,
		enabled: false,
	},
	{
		key: "reports",
		title: "وكيل التقارير",
		description: "استخراج البيانات كملف SOAP Notes لتلخيص الزيارات الطبية.",
		icon: IconReport,
		enabled: false,
	},
];

// صفوف الإعدادات العامة (تفتح شاشات فرعية لاحقًا)
export type GeneralSettingRow = {
	key: string;
	title: string;
	description: string;
	badge: string;
};

export const GENERAL_SETTINGS: GeneralSettingRow[] = [
	{
		key: "workflow-commands",
		title: "أوامر سير العمل",
		description: "الأوامر الأكثر استخدامًا — اضغط لتخصيص الـ Prompt.",
		badge: "08 أوامر",
	},
	{
		key: "capabilities",
		title: "قدرات الذكاء الاصطناعي",
		description: "تحكم في ما يستطيع الوكيل فعله داخل النظام.",
		badge: "08 قدرات مفعلة",
	},
	{
		key: "skills-market",
		title: "سوق مهارات الـ AI",
		description: "مهارات قابلة للتفعيل تُضاف لوكيل الذكاء دون الحاجة إلى تعديل النظام.",
		badge: "08 قدرات مفعلة",
	},
	{
		key: "integrations",
		title: "التكاملات الخارجية",
		description: "ربط الـ AI مع التطبيقات الخارجية.",
		badge: "08 قدرات مفعلة",
	},
	{
		key: "guardrails",
		title: "الحواجز السلوكية",
		description: "قواعد سلوكية تمنع تنفيذ الذكاء الاصطناعي من تجاوز قيم أو سياسات الأكاديمية.",
		badge: "18 قاعدة حماية مفعلة",
	},
];
