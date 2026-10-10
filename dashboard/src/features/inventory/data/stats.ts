import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import type { StockOverview } from "@/server/stock/stock.type";

// بطاقات لوحة المنتجات الحيّة — مبنية من ملخّص المخزون
export const buildInventoryStats = (o?: StockOverview): StatItem[] => [
	{
		title: "إجمالي المنتجات",
		value: o?.totalProducts ?? 0,
		tooltip: "إجمالي عدد المنتجات المسجّلة في المخزون",
	},
	{ title: "نفذ", value: o?.outOfStock ?? 0, tooltip: "المنتجات التي نفدت كميتها بالكامل" },
	{
		title: "تحت الحد الأدنى",
		value: o?.belowReorder ?? 0,
		tooltip: "المنتجات التي وصلت لنقطة إعادة البيع أو أقل",
	},
	{
		title: "قيمة المخزون",
		value: Math.round(o?.stockValue ?? 0),
		tooltip: "إجمالي قيمة المخزون بالتكلفة المتوسطة (ر.س)",
	},
	{ title: "حركة اليوم", value: o?.todayMovements ?? 0, tooltip: "عدد حركات المخزون اليوم" },
];

// بطاقات تبويب الصلاحية الحيّة
export const buildBatchesStats = (o?: StockOverview): StatItem[] => [
	{ title: "قرب الانتهاء", value: o?.nearExpiry ?? 0, tooltip: "دُفعات تنتهي خلال 30 يومًا" },
	{ title: "منتهية", value: o?.expired ?? 0, tooltip: "دُفعات انتهت صلاحيتها" },
	{ title: "إجمالي المنتجات", value: o?.totalProducts ?? 0, tooltip: "عدد المنتجات المسجّلة" },
	{ title: "نفذ", value: o?.outOfStock ?? 0, tooltip: "منتجات نفدت" },
	{ title: "تحت الحد الأدنى", value: o?.belowReorder ?? 0, tooltip: "منتجات قرب النفاد" },
];

// قيم ثابتة الآن — تُربط بـ endpoint لاحقًا (نفس نمط OWNERS_STATS)
export const INVENTORY_STATS: StatItem[] = [
	{
		title: "إجمالي المنتجات",
		value: 0,
		tooltip: "إجمالي عدد المنتجات المسجّلة في المخزون",
	},
	{
		title: "نفذ",
		value: 0,
		tooltip: "المنتجات التي نفدت كميتها بالكامل",
	},
	{
		title: "تحت الحد الأدنى",
		value: 0,
		tooltip: "المنتجات التي وصلت لنقطة إعادة البيع أو أقل",
	},
	{
		title: "قيمة المخزون",
		value: 0,
		tooltip: "إجمالي القيمة المالية للمخزون الحالي",
	},
	{
		title: "مبيعات",
		value: 0,
		tooltip: "إجمالي مبيعات المنتجات",
	},
];

// إحصاءات تبويب الحركات — قيم ثابتة الآن (تُربط بـ endpoint لاحقًا)
export const MOVEMENTS_STATS: StatItem[] = [
	{
		title: "# المستودعات",
		value: 0,
		tooltip: "عدد المستودعات المسجّلة في الأكاديمية",
	},
	{
		title: "حركات اليوم",
		value: 0,
		tooltip: "عدد حركات المخزون المسجّلة اليوم",
	},
	{
		title: "إدخالات",
		value: 0,
		tooltip: "إجمالي حركات الاستلام/الإدخال",
	},
	{
		title: "إخراجات",
		value: 0,
		tooltip: "إجمالي حركات الصرف/الإخراج",
	},
	{
		title: "تحويلات",
		value: 0,
		tooltip: "إجمالي حركات التحويل بين المستودعات",
	},
];

// إحصاءات تبويب المشتريات — قيم ثابتة الآن (تُربط بـ endpoint لاحقًا)
export const PURCHASES_STATS: StatItem[] = [
	{
		title: "# أوامر الشراء",
		value: 0,
		tooltip: "إجمالي عدد أوامر الشراء",
	},
	{
		title: "قيد الطلب",
		value: 0,
		tooltip: "أوامر تم طلبها ولم تُستلم بعد",
	},
	{
		title: "استلام جزئي",
		value: 0,
		tooltip: "أوامر استُلمت جزئيًا",
	},
	{
		title: "مستلمة",
		value: 0,
		tooltip: "أوامر مستلمة بالكامل",
	},
	{
		title: "قيمة المشتريات",
		value: 0,
		tooltip: "إجمالي قيمة أوامر الشراء",
	},
];

// إحصاءات تبويب الصلاحية/الدُفعات — قيم ثابتة الآن (تُربط بـ endpoint لاحقًا)
export const BATCHES_STATS: StatItem[] = [
	{ title: "# الدُفعات", value: 0, tooltip: "إجمالي الدُفعات النشطة" },
	{ title: "قرب الانتهاء", value: 0, tooltip: "دُفعات تنتهي خلال 30 يومًا" },
	{ title: "منتهية", value: 0, tooltip: "دُفعات انتهت صلاحيتها" },
	{ title: "أصناف متتبَّعة", value: 0, tooltip: "الأصناف المتتبّعة بالدُفعات والصلاحية" },
	{ title: "كمية معرّضة", value: 0, tooltip: "إجمالي الكمية في الدُفعات قرب الانتهاء" },
];

// إحصاءات تبويب التقارير — قيم ثابتة الآن (الأرقام الحيّة داخل التقرير نفسه)
export const REPORTS_STATS: StatItem[] = [
	{ title: "قيمة المخزون", value: 0, tooltip: "إجمالي قيمة المخزون بالتكلفة المتوسطة" },
	{ title: "# الأصناف", value: 0, tooltip: "عدد الأصناف في التقرير" },
	{ title: "إجمالي الكمية", value: 0, tooltip: "إجمالي كمية المخزون" },
	{ title: "متوسط التكلفة", value: 0, tooltip: "متوسط تكلفة الوحدة عبر الأصناف" },
	{ title: "أعلى قيمة", value: 0, tooltip: "الصنف الأعلى قيمةً في المخزون" },
];

// إحصاءات تبويب المستودعات — قيم ثابتة الآن
export const WAREHOUSES_STATS: StatItem[] = [
	{ title: "# المستودعات", value: 0, tooltip: "إجمالي المستودعات النشطة" },
	{ title: "المستودع الافتراضي", value: 0, tooltip: "المستودع المستقبِل لحركات البيع" },
	{ title: "# المنتجات", value: 0, tooltip: "عدد المنتجات المسجّلة" },
	{ title: "إجمالي الكمية", value: 0, tooltip: "إجمالي كمية المخزون عبر المستودعات" },
	{ title: "قيمة المخزون", value: 0, tooltip: "إجمالي قيمة المخزون" },
];

// إحصاءات تبويب الموردين — قيم ثابتة الآن (تُربط بـ endpoint لاحقًا)
export const SUPPLIERS_STATS: StatItem[] = [
	{
		title: "# الموردين",
		value: 0,
		tooltip: "إجمالي عدد الموردين المسجّلين",
	},
	{
		title: "نشطين",
		value: 0,
		tooltip: "الموردون النشطون حاليًا",
	},
	{
		title: "# الطلبات",
		value: 0,
		tooltip: "إجمالي عدد أوامر الشراء",
	},
	{
		title: "# المشتريات",
		value: 0,
		tooltip: "إجمالي قيمة المشتريات من الموردين",
	},
	{
		title: "متوسط التقييم",
		value: 0,
		tooltip: "متوسط تقييم الموردين",
	},
];

// إحصاءات تبويب نقطة البيع — قيم ثابتة الآن
export const POS_STATS: StatItem[] = [
	{
		title: "إجمالي المبيعات",
		value: 0,
		tooltip: "إجمالي قيمة المبيعات",
	},
	{
		title: "فواتير مدفوعة",
		value: 0,
		tooltip: "عدد الفواتير المدفوعة",
	},
	{
		title: "# الطلبات",
		value: 0,
		tooltip: "إجمالي عدد الطلبات",
	},
	{
		title: "# المشتريات",
		value: 0,
		tooltip: "إجمالي قيمة المشتريات",
	},
	{
		title: "فواتير معلقة",
		value: 0,
		tooltip: "عدد الفواتير المعلقة",
	},
];
