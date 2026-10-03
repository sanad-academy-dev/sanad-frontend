import {
	InventoryCategory,
	type PurchaseOrderStatus,
	StockVoucherType,
} from "@/generated/prisma/enums";
import type { MovementType } from "@/server/stock/stock.type";

export const INVENTORY_CATEGORY_LABELS: Record<InventoryCategory, string> = {
	[InventoryCategory.ANTIBIOTIC]: "مضاد حيوي",
	[InventoryCategory.ANTI_INFLAMMATORY]: "مضاد إلتهاب",
	[InventoryCategory.VACCINE]: "تطعيم",
	[InventoryCategory.HORMONE]: "هرمون",
	[InventoryCategory.SUPPLEMENT]: "مكمل غذائي",
	[InventoryCategory.CRUSTACEAN]: "قشريات",
	[InventoryCategory.SURGICAL_TOOLS]: "أدوات جراحية",
	[InventoryCategory.SUPPLIES]: "مستلزمات",
};

export const INVENTORY_CATEGORY_OPTIONS = Object.values(InventoryCategory).map((value) => ({
	value,
	label: INVENTORY_CATEGORY_LABELS[value],
}));

// ─── حركات المخزون ───────────────────────────────────────
// تسميات أنواع الحركة في النموذج (استلام/صرف/تحويل)
export const MOVEMENT_TYPE_OPTIONS: { value: MovementType; label: string }[] = [
	{ value: "RECEIPT", label: "استلام (إدخال)" },
	{ value: "ISSUE", label: "صرف (إخراج)" },
	{ value: "TRANSFER", label: "تحويل بين مستودعين" },
];

// تسميات أنواع سطور الدفتر (لعرض سجل الحركات)
export const VOUCHER_TYPE_LABELS: Record<StockVoucherType, string> = {
	[StockVoucherType.OPENING]: "رصيد افتتاحي",
	[StockVoucherType.RECEIPT]: "استلام",
	[StockVoucherType.ISSUE]: "صرف",
	[StockVoucherType.SALE]: "بيع",
	[StockVoucherType.SALE_RETURN]: "إرجاع بيع",
	[StockVoucherType.ADJUSTMENT]: "تسوية",
	[StockVoucherType.TRANSFER]: "تحويل",
	[StockVoucherType.CARE_PLAN]: "خطة رعاية",
	[StockVoucherType.VACCINATION]: "تطعيم",
	[StockVoucherType.MOBILE_CLINIC]: "أكاديمية متنقلة",
	[StockVoucherType.PHARMACY_DISPENSE]: "صرف صيدلية",
	[StockVoucherType.INPATIENT_ADMINISTRATION]: "إعطاء لطفل منوَّم",
};

// ─── أوامر الشراء ────────────────────────────────────────
export const PURCHASE_STATUS_META: Record<
	PurchaseOrderStatus,
	{ label: string; className: string }
> = {
	DRAFT: { label: "مسودّة", className: "text-muted-foreground" },
	ORDERED: { label: "تم الطلب", className: "text-blue-600" },
	PARTIALLY_RECEIVED: { label: "استلام جزئي", className: "text-amber-600" },
	RECEIVED: { label: "مستلم", className: "text-emerald-600" },
	CANCELLED: { label: "ملغى", className: "text-red-600" },
};

// تسميات حقول نموذج المنتج (تُستخدم في نافذة "تغييرات غير محفوظة")
export const INVENTORY_FIELD_LABELS: Record<string, string> = {
	name: "اسم المنتج",
	category: "الفئة",
	supplier: "المورد",
	sku: "رمز المنتج",
	barcode: "الباركود",
	stock: "الكمية الحالية",
	reorderPoint: "نقطة إعادة الطلب",
	maxQuantity: "الحد الأقصى",
	unitCost: "تكلفة الوحدة",
	price: "سعر البيع",
	expiryDate: "تاريخ الصلاحية",
	location: "موقع المنتج",
	notes: "ملاحظات",
};
