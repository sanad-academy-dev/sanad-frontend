import type { DiscountStatus, DiscountType, OwnerType } from "@/generated/prisma/enums";
import type { DiscountFormInput } from "@/server/discounts/discounts.type";

export const DISCOUNT_TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
	{ value: "PERCENTAGE", label: "نسبة مئوية" },
	{ value: "FIXED", label: "مبلغ ثابت" },
];

export const CUSTOMER_TYPE_OPTIONS: { value: OwnerType; label: string }[] = [
	{ value: "ALL", label: "جميع العملاء" },
	{ value: "NEW", label: "عملاء جدد" },
	{ value: "CURRENT", label: "عملاء حاليون" },
	{ value: "VIP", label: "عملاء مميّزون (VIP)" },
	{ value: "LOYALTY", label: "عملاء الولاء" },
];

export const CUSTOMER_TYPE_LABEL: Record<OwnerType, string> = {
	ALL: "جميع العملاء",
	NEW: "عملاء جدد",
	CURRENT: "عملاء حاليون",
	VIP: "عملاء مميّزون",
	LOYALTY: "عملاء الولاء",
};

export const DISCOUNT_STATUS_CONFIG: Record<
	DiscountStatus,
	{ label: string; dotClass: string; pillClass: string }
> = {
	ACTIVE: {
		label: "نشط",
		dotClass: "bg-emerald-500",
		pillClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
	},
	INACTIVE: {
		label: "معطّل",
		dotClass: "bg-muted-foreground/60",
		pillClass: "border-muted bg-muted text-muted-foreground",
	},
	EXPIRED: {
		label: "منتهي الصلاحية",
		dotClass: "bg-rose-500",
		pillClass: "border-rose-200 bg-rose-50 text-rose-700",
	},
	SCHEDULED: {
		label: "مجدول",
		dotClass: "bg-amber-500",
		pillClass: "border-amber-200 bg-amber-50 text-amber-700",
	},
};

// الحالات القابلة للتبديل يدوياً من قائمة الحالة داخل الجدول
export const TOGGLEABLE_STATUSES: DiscountStatus[] = ["ACTIVE", "INACTIVE"];

export const DISCOUNT_FORM_DEFAULTS: DiscountFormInput = {
	name: "",
	couponCode: "",
	type: "PERCENTAGE",
	value: 0,
	validFrom: null,
	validTo: null,
	usageLimit: 0,
	perCustomerLimit: 0,
	customerType: "ALL",
	serviceIds: [],
	notes: null,
};
