import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { PurchaseOrderStatus } from "@/generated/prisma/enums";

export type { PurchaseOrderStatus };

// ─── Response shapes ─────────────────────────────────────
export const purchaseOrderSelect = {
	id: true,
	code: true,
	status: true,
	notes: true,
	expectedAt: true,
	createdAt: true,
	supplier: {
		select: {
			id: true,
			legalName: true,
			code: true,
			email: true,
			phone: true,
			city: true,
			country: true,
		},
	},
	warehouse: { select: { id: true, name: true } },
	items: {
		select: {
			id: true,
			itemId: true,
			qtyOrdered: true,
			qtyReceived: true,
			unitCost: true,
			item: { select: { id: true, name: true, code: true, tracksBatches: true } },
		},
	},
} as const;

export type PurchaseOrderResponse = Prisma.PurchaseOrderGetPayload<{
	select: typeof purchaseOrderSelect;
}>;

// ─── أوامر الشراء الخاصة بمنتج محدّد (تبويب طلبات الشراء داخل المنتج) ───
export const itemPurchaseOrderSelect = {
	id: true,
	code: true,
	status: true,
	createdAt: true,
	supplier: { select: { id: true, legalName: true, email: true } },
	items: { select: { itemId: true, qtyOrdered: true, qtyReceived: true, unitCost: true } },
} as const;

type RawItemPurchaseOrder = Prisma.PurchaseOrderGetPayload<{
	select: typeof itemPurchaseOrderSelect;
}>;

// شكل مسطّح: إجمالي الطلب + سطر هذا المنتج تحديدًا
export type ItemPurchaseOrderResponse = Pick<
	RawItemPurchaseOrder,
	"id" | "code" | "status" | "createdAt" | "supplier"
> & {
	total: number;
	qtyOrdered: number;
	qtyReceived: number;
	lineTotal: number;
};

// ─── Forms (Zod source of truth) ─────────────────────────
const poLineSchema = z.object({
	itemId: z.string({ error: "المنتج مطلوب" }).min(1, "المنتج مطلوب"),
	qtyOrdered: z.coerce
		.number({ error: "الكمية يجب أن تكون رقمًا" })
		.int("الكمية يجب أن تكون عددًا صحيحًا")
		.min(1, "الكمية يجب أن تكون 1 على الأقل"),
	unitCost: z.coerce
		.number({ error: "التكلفة يجب أن تكون رقمًا" })
		.min(0, "التكلفة يجب ألا تكون سالبة"),
});

export const createPurchaseOrderSchema = z.object({
	supplierId: z.string({ error: "المورد مطلوب" }).min(1, "المورد مطلوب"),
	warehouseId: z.string({ error: "المستودع مطلوب" }).min(1, "المستودع مطلوب"),
	expectedAt: z.string().optional(),
	notes: z.string().max(500).optional(),
	lines: z.array(poLineSchema).min(1, "أضف منتجًا واحدًا على الأقل"),
});
export type CreatePurchaseOrderFormInput = z.infer<typeof createPurchaseOrderSchema>;

// استلام: كمية مستلمة لكل سطر (قد تكون جزئية) + بيانات الدفعة للأصناف المتتبّعة
export const receivePurchaseOrderSchema = z.object({
	lines: z
		.array(
			z.object({
				itemId: z.string().min(1),
				qty: z.coerce.number().int().min(0),
				batchNo: z.string().max(100).optional(),
				expiryDate: z.string().optional(),
			}),
		)
		.min(1, "لا توجد أسطر للاستلام"),
});
export type ReceivePurchaseOrderFormInput = z.infer<typeof receivePurchaseOrderSchema>;
