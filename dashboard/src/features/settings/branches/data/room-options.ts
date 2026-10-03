import type { RoomType } from "@/server/rooms/rooms.type";

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
	{ value: "EXAMINATION", label: "قاعة الفحص" },
	{ value: "LABORATORY", label: "المختبر" },
	{ value: "WAITING", label: "قاعة الانتظار" },
	{ value: "OPERATING", label: "قاعة العمليات" },
	{ value: "VACCINATION", label: "قاعة التطعيم" },
	{ value: "ICU", label: "العناية المركزة" },
];

export const AVAILABLE_DEVICES = [
	"جهاز تخدير",
	"ليزر جراحي",
	"شاشات مراقبة",
	"أدوات جراحية بسيطة",
	"طاولة فحص",
	"جهاز سونار",
	"جهاز أشعة",
];

export const AVAILABLE_ABILITIES = [
	"أوكسجين",
	"تعقيم عالٍ",
	"عناية مركزة",
	"أشعة/تصوير",
	"مراقبة كاميرات",
	"تحكم مناخي",
	"قسم عزل",
	"طوارئ 24/7",
	"دورة سريعة",
	"جراحة أسنان",
	"عازل صوت",
];
