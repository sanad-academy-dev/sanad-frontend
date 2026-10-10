import { MobileBookingRequestStatus, PreferredWindow } from "@/generated/prisma/enums";

export const REQUEST_STATUS_LABELS: Record<MobileBookingRequestStatus, string> = {
	[MobileBookingRequestStatus.NEW]: "جديد",
	[MobileBookingRequestStatus.CONTACTED]: "تم الاتصال",
	[MobileBookingRequestStatus.SCHEDULED]: "حُوِّل إلى زيارة",
	[MobileBookingRequestStatus.REJECTED]: "مرفوض",
	[MobileBookingRequestStatus.SPAM]: "غير جادّ",
};

export const REQUEST_STATUS_COLORS: Record<MobileBookingRequestStatus, string> = {
	[MobileBookingRequestStatus.NEW]: "text-blue-600",
	[MobileBookingRequestStatus.CONTACTED]: "text-amber-600",
	[MobileBookingRequestStatus.SCHEDULED]: "text-emerald-600",
	[MobileBookingRequestStatus.REJECTED]: "text-destructive",
	[MobileBookingRequestStatus.SPAM]: "text-muted-foreground",
};

export const PREFERRED_WINDOW_LABELS: Record<PreferredWindow, string> = {
	[PreferredWindow.MORNING]: "صباحًا",
	[PreferredWindow.AFTERNOON]: "بعد الظهر",
	[PreferredWindow.EVENING]: "مساءً",
	[PreferredWindow.ANY]: "أي وقت",
};

export const PREFERRED_WINDOW_OPTIONS = Object.values(PreferredWindow).map((value) => ({
	value,
	label: PREFERRED_WINDOW_LABELS[value],
}));
