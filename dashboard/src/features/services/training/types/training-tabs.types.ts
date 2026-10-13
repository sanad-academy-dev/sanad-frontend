// تبويبات وحدة الدورات التدريبية المعروضة في الهيدر العلوي
export type TrainingModuleTab = "all" | "recurring" | "library";

// التبويب النشط عبر الوحدة كلها — تبويبات الدورات
export type TrainingTab = TrainingModuleTab;

// الترتيب هنا هو ترتيب DOM داخل حاوية RTL: أول عنصر يظهر في أقصى اليمين.
// «دوري» معطّل عمدًا («قريباً») — التكرار ميزة مستقبلية غير مُنمذجة بعد (قرار مقفل #4)
export const TRAINING_MODULE_TABS: {
	value: TrainingModuleTab;
	label: string;
	disabled: boolean;
	tooltip?: string;
}[] = [
	// الترتيب حسب الأهمية: المفعّلة أولًا (الكل ثم المكتبة)، ثم «دوري» المعطّلة («قريباً»)
	{ value: "all", label: "الكل", disabled: false },
	{ value: "library", label: "مكتبة الدورات", disabled: false },
	{ value: "recurring", label: "دوري", disabled: true, tooltip: "قريباً" },
];

// تبويبات أنواع المحتوى (من منتقي «إنشاء محتوى جديد»)
export const TRAINING_CONTENT_TABS: {
	label: string;
	value?: TrainingTab;
	disabled: boolean;
	tooltip?: string;
}[] = [
	{ label: "صفحة", disabled: true, tooltip: "قريباً" },
	{ label: "تكليف", disabled: true, tooltip: "قريباً" },
	{ label: "مسار تعلّم", disabled: true, tooltip: "قريباً" },
	{ label: "ويكي", disabled: true, tooltip: "قريباً" },
];
