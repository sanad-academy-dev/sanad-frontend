import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { StockVoucherType } from "@/generated/prisma/enums";

export type { StockVoucherType };

// ─── Ledger ──────────────────────────────────────────────
export const stockLedgerSelect = {
	id: true,
	itemId: true,
	warehouseId: true,
	qtyChange: true,
	balanceQty: true,
	voucherType: true,
	voucherId: true,
	note: true,
	createdAt: true,
	warehouse: { select: { id: true, name: true } },
	item: { select: { id: true, name: true, code: true } },
} as const;

export type StockLedgerResponse = Prisma.StockLedgerEntryGetPayload<{
	select: typeof stockLedgerSelect;
}>;

// ─── Warehouse ───────────────────────────────────────────
export const warehouseSelect = {
	id: true,
	code: true,
	name: true,
	branchId: true,
	// إعدادات الفرع تُمكِّن الواجهة من معرفة القدرات المتاحة (مثل طلبات الشراء)
	branch: { select: { name: true, settings: true } },
	isDefault: true,
	// [MC1.1] مستودع مركبة متنقلة — تعرضه شاشة المستودعات بشارة وتمنع عليه الإجراءات التي
	// لا معنى لها في مركبة (تعيينه افتراضيًّا، أو حذفه من هنا بدل حذف مركبته).
	isMobile: true,
	active: true,
	editsCount: true,
	createdAt: true,
} as const;

export type WarehouseResponse = Prisma.WarehouseGetPayload<{
	select: typeof warehouseSelect;
}>;

export const createWarehouseSchema = z.object({
	name: z.string({ error: "اسم المستودع مطلوب" }).min(1, "اسم المستودع مطلوب"),
	isDefault: z.boolean().optional(),
});
export type CreateWarehouseFormInput = z.infer<typeof createWarehouseSchema>;

export const updateWarehouseSchema = z.object({
	name: z.string().min(1, "اسم المستودع مطلوب").optional(),
	isDefault: z.boolean().optional(),
	active: z.boolean().optional(),
});
export type UpdateWarehouseFormInput = z.infer<typeof updateWarehouseSchema>;

// ─── Bin (per item × warehouse) ──────────────────────────
export const stockBinSelect = {
	id: true,
	itemId: true,
	warehouseId: true,
	qty: true,
	updatedAt: true,
	warehouse: { select: { id: true, name: true, code: true } },
	item: { select: { id: true, name: true, code: true } },
} as const;

export type StockBinResponse = Prisma.StockBinGetPayload<{
	select: typeof stockBinSelect;
}>;

// ─── Valuation report ────────────────────────────────────
export const valuationItemSelect = {
	id: true,
	code: true,
	name: true,
	category: true,
	stock: true,
	valuationRate: true,
} as const;

type ValuationItemBase = Prisma.InventoryItemGetPayload<{
	select: typeof valuationItemSelect;
}>;

// السطر يضيف قيمة المخزون المحسوبة (الكمية × متوسط التكلفة)
export type ValuationItem = Omit<ValuationItemBase, "valuationRate"> & {
	valuationRate: number;
	stockValue: number;
};

export interface ValuationReport {
	items: ValuationItem[];
	totalValue: number;
	totalQty: number;
}

// فلاتر دفتر الحركات (voucherType نصّي من الـ query ويُضيَّق داخل الـ DAO)
export interface LedgerFilters {
	itemId?: string;
	warehouseId?: string;
	voucherType?: string;
	from?: string;
	to?: string;
}

// أعمار المخزون (Stock Ageing)
export interface StockAgeingItem {
	itemId: string;
	name: string;
	code: string;
	d0_30: number;
	d31_60: number;
	d61_90: number;
	d90plus: number;
	total: number;
}

export interface StockAgeingReport {
	items: StockAgeingItem[];
	totals: Omit<StockAgeingItem, "itemId" | "name" | "code">;
}

// ملخّص لوحة المخزون (بطاقات حيّة + تنبيهات)
export interface StockOverview {
	totalProducts: number;
	outOfStock: number;
	belowReorder: number;
	stockValue: number;
	todayMovements: number;
	nearExpiry: number;
	expired: number;
}

// ─── Batch (lot × expiry) ────────────────────────────────
export const stockBatchSelect = {
	id: true,
	batchNo: true,
	qty: true,
	expiryDate: true,
	productionDate: true,
	createdAt: true,
	item: { select: { id: true, name: true, code: true } },
	warehouse: { select: { id: true, name: true } },
} as const;

export type StockBatchResponse = Prisma.StockBatchGetPayload<{
	select: typeof stockBatchSelect;
}>;

// تسوية مخزون: الكمية الفعلية لكل صنف في مستودع → فروقات ADJUSTMENT
export const reconcileSchema = z.object({
	warehouseId: z.string({ error: "المستودع مطلوب" }).min(1, "المستودع مطلوب"),
	reason: z.string().max(300).optional(),
	lines: z
		.array(
			z.object({
				itemId: z.string().min(1),
				actualQty: z.coerce
					.number({ error: "الكمية يجب أن تكون رقمًا" })
					.int("الكمية يجب أن تكون عددًا صحيحًا")
					.min(0, "الكمية يجب ألا تكون سالبة"),
			}),
		)
		.min(1, "لا توجد أصناف للجرد"),
});
export type ReconcileFormInput = z.infer<typeof reconcileSchema>;

export const writeOffBatchSchema = z.object({
	qty: z.coerce
		.number({ error: "الكمية يجب أن تكون رقمًا" })
		.int("الكمية يجب أن تكون عددًا صحيحًا")
		.min(1, "الكمية يجب أن تكون 1 على الأقل"),
	reason: z.string().max(300).optional(),
});
export type WriteOffBatchFormInput = z.infer<typeof writeOffBatchSchema>;

// ─── Forms (Zod source of truth) ─────────────────────────
const movementLineSchema = z.object({
	itemId: z.string({ error: "المنتج مطلوب" }).min(1, "المنتج مطلوب"),
	qty: z.coerce
		.number({ error: "الكمية يجب أن تكون رقمًا" })
		.int("الكمية يجب أن تكون عددًا صحيحًا")
		.min(1, "الكمية يجب أن تكون 1 على الأقل"),
});

/** استلام أو صرف لمستودع واحد */
export const createMovementSchema = z.object({
	warehouseId: z.string({ error: "المستودع مطلوب" }).min(1, "المستودع مطلوب"),
	type: z.enum(["RECEIPT", "ISSUE"], { error: "نوع الحركة مطلوب" }),
	note: z.string().max(500).optional(),
	lines: z.array(movementLineSchema).min(1, "أضف منتجًا واحدًا على الأقل"),
});
export type CreateMovementFormInput = z.infer<typeof createMovementSchema>;

/** تحويل بين مستودعين */
export const createTransferSchema = z
	.object({
		fromWarehouseId: z
			.string({ error: "المستودع المصدر مطلوب" })
			.min(1, "المستودع المصدر مطلوب"),
		toWarehouseId: z.string({ error: "المستودع الهدف مطلوب" }).min(1, "المستودع الهدف مطلوب"),
		note: z.string().max(500).optional(),
		lines: z.array(movementLineSchema).min(1, "أضف منتجًا واحدًا على الأقل"),
	})
	.refine((d) => d.fromWarehouseId !== d.toWarehouseId, {
		error: "لا يمكن التحويل إلى نفس المستودع",
		path: ["toWarehouseId"],
	});
export type CreateTransferFormInput = z.infer<typeof createTransferSchema>;

export const MOVEMENT_TYPES = ["RECEIPT", "ISSUE", "TRANSFER"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

/**
 * مخطّط موحّد لنموذج الواجهة (يغطّي استلام/صرف/تحويل في شاشة واحدة).
 * مسطّح + superRefine ليتوافق مع react-hook-form عند تبديل نوع الحركة.
 */
export const stockMovementFormSchema = z
	.object({
		type: z.enum(MOVEMENT_TYPES, { error: "نوع الحركة مطلوب" }),
		warehouseId: z.string().optional(), // للاستلام/الصرف
		fromWarehouseId: z.string().optional(), // للتحويل
		toWarehouseId: z.string().optional(),
		note: z.string().max(500).optional(),
		lines: z.array(movementLineSchema).min(1, "أضف منتجًا واحدًا على الأقل"),
	})
	.superRefine((d, ctx) => {
		if (d.type === "TRANSFER") {
			if (!d.fromWarehouseId)
				ctx.addIssue({
					code: "custom",
					path: ["fromWarehouseId"],
					message: "المستودع المصدر مطلوب",
				});
			if (!d.toWarehouseId)
				ctx.addIssue({
					code: "custom",
					path: ["toWarehouseId"],
					message: "المستودع الهدف مطلوب",
				});
			if (d.fromWarehouseId && d.toWarehouseId && d.fromWarehouseId === d.toWarehouseId)
				ctx.addIssue({
					code: "custom",
					path: ["toWarehouseId"],
					message: "لا يمكن التحويل إلى نفس المستودع",
				});
		} else if (!d.warehouseId) {
			ctx.addIssue({ code: "custom", path: ["warehouseId"], message: "المستودع مطلوب" });
		}
	});
export type StockMovementFormInput = z.infer<typeof stockMovementFormSchema>;
