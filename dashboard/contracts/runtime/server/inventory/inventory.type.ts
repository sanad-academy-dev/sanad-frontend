import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { InventoryCategory } from "@/generated/prisma/enums";

export type { InventoryCategory };

export const createInventorySchema = z.object({
	// معلومات الأساسية
	name: z.string({ error: "اسم المنتج مطلوب" }).min(1, "اسم المنتج مطلوب"),
	category: z.enum(InventoryCategory, { error: "فئة المنتج مطلوبة" }),
	supplier: z.string().optional(),
	sku: z.string().optional(),
	barcode: z.string().optional(),
	// التسعير
	stock: z.coerce
		.number({ error: "الكمية مطلوبة" })
		.int("الكمية يجب أن تكون عددًا صحيحًا")
		.min(0, "الكمية لا يمكن أن تكون سالبة"),
	reorderPoint: z.coerce
		.number({ error: "نقطة إعادة الطلب مطلوبة" })
		.int("نقطة إعادة الطلب يجب أن تكون عددًا صحيحًا")
		.min(0, "نقطة إعادة الطلب لا يمكن أن تكون سالبة"),
	maxQuantity: z.coerce
		.number()
		.int("الحد الأقصى يجب أن يكون عددًا صحيحًا")
		.min(0, "الحد الأقصى لا يمكن أن يكون سالبًا")
		.optional(),
	unitCost: z.coerce
		.number({ error: "تكلفة الوحدة مطلوبة" })
		.min(0, "تكلفة الوحدة لا يمكن أن تكون سالبة"),
	price: z.coerce
		.number({ error: "سعر البيع مطلوب" })
		.min(0, "سعر البيع لا يمكن أن يكون سالبًا"),
	// تفاصيل إضافية
	expiryDate: z.string({ error: "تاريخ الصلاحية مطلوب" }).min(1, "تاريخ الصلاحية مطلوب"),
	productionDate: z.string().optional(),
	location: z.string().optional(),
	notes: z.string().optional(),
	tracksBatches: z.boolean().optional().default(false),
	active: z.boolean(),
	// مستودع الرصيد الافتتاحي — يسقط للمستودع الافتراضي عند عدم التحديد
	warehouseId: z.string().optional(),
	// المستحضر المسجَّل الذي اختير منه الصنف (كتالوج الجهة الرقابية) — اختياري
	catalogProductId: z.string().optional(),
	// [P12B.3] قالب ضريبة الصنف — يجعل سلّة نقطة البيع المختلطة صحيحة (§8 خطوة 5)
	itemTaxTemplateId: z.string().nullish(),
});

export type CreateInventoryFormInput = z.infer<typeof createInventorySchema>;

export type CreateInventoryInput = Pick<
	Prisma.InventoryItemUncheckedCreateInput,
	| "clinicId"
	| "name"
	| "category"
	| "supplier"
	| "sku"
	| "barcode"
	| "stock"
	| "reorderPoint"
	| "maxQuantity"
	| "unitCost"
	| "price"
	| "productionDate"
	| "expiryDate"
	| "location"
	| "notes"
	| "tracksBatches"
	| "active"
	| "catalogProductId"
	| "itemTaxTemplateId"
> & {
	/** مستودع الرصيد الافتتاحي (ليس عمودًا على المنتج) — الافتراضي عند الغياب */
	warehouseId?: string | null;
};

// مشتق من مدخلات النموذج (Zod): price/unitCost أرقام وتواريخ نصية (JSON)،
// بخلاف أنواع Prisma (Decimal/Date). يبقى متوافقًا مع prisma.update في الـ DAO.
export type UpdateInventoryInput = Partial<
	Pick<
		CreateInventoryFormInput,
		"name" | "category" | "stock" | "reorderPoint" | "price" | "active" | "tracksBatches"
	>
> & {
	supplier?: string | null;
	sku?: string | null;
	barcode?: string | null;
	maxQuantity?: number | null;
	unitCost?: number | null;
	productionDate?: string | null;
	expiryDate?: string | null;
	location?: string | null;
	notes?: string | null;
	itemTaxTemplateId?: string | null;
};

export const inventorySelect = {
	id: true,
	code: true,
	name: true,
	category: true,
	supplier: true,
	sku: true,
	barcode: true,
	stock: true,
	reorderPoint: true,
	maxQuantity: true,
	unitCost: true,
	valuationRate: true,
	price: true,
	productionDate: true,
	expiryDate: true,
	location: true,
	notes: true,
	tracksBatches: true,
	active: true,
	editsCount: true,
	createdAt: true,
	updatedAt: true,
	// [P12B.3] قالب ضريبة الصنف — يقرؤه محرّك تسعير نقطة البيع، ويُعرَض في نموذج المنتج
	itemTaxTemplateId: true,
	// المستحضر المسجَّل المرتبط — يُظهر رقم التسجيل والجهة على بطاقة المنتج
	catalogProductId: true,
	catalogProduct: {
		select: {
			id: true,
			registerNumber: true,
			tradeName: true,
			genericName: true,
			authorizationStatus: true,
			withdrawalPeriod: true,
			standard: { select: { code: true, nameAr: true, nameEn: true, sourceUrl: true } },
		},
	},
	// أرصدة المنتج لكل مستودع — لعرض "المستودع" في الجدول
	bins: {
		select: {
			qty: true,
			warehouse: { select: { id: true, name: true } },
		},
	},
} as const;

export type InventoryResponse = Prisma.InventoryItemGetPayload<{
	select: typeof inventorySelect;
}>;

export const inventoryAlertSelect = {
	id: true,
	name: true,
	stock: true,
	reorderPoint: true,
} as const;

export type InventoryAlertResponse = Prisma.InventoryItemGetPayload<{
	select: typeof inventoryAlertSelect;
}>;

// سجل نشاط المنتج (تبويب النشاط) — مُجمّع/مُشتقّ من أحداث حقيقية متعددة المصادر
export type ProductActivityEntry = {
	id: string;
	type: "ledger" | "purchase" | "product";
	label: string;
	at: Date;
};
