// مستويات صوت التنبيه المتاحة (القيمة 0..100 تُخزَّن في soundVolume)
export const INBOX_VOLUME_OPTIONS = [
	{ value: 25, label: "منخفض" },
	{ value: 50, label: "متوسط" },
	{ value: 75, label: "مرتفع" },
	{ value: 100, label: "الأقصى" },
] as const;
