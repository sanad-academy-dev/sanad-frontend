import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { PurchaseOrderStatus } from "@/generated/prisma/enums";
export type { PurchaseOrderStatus };
export declare const purchaseOrderSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly notes: true;
    readonly expectedAt: true;
    readonly createdAt: true;
    readonly supplier: {
        readonly select: {
            readonly id: true;
            readonly legalName: true;
            readonly code: true;
            readonly email: true;
            readonly phone: true;
            readonly city: true;
            readonly country: true;
        };
    };
    readonly warehouse: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly itemId: true;
            readonly qtyOrdered: true;
            readonly qtyReceived: true;
            readonly unitCost: true;
            readonly item: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly code: true;
                    readonly tracksBatches: true;
                };
            };
        };
    };
};
export type PurchaseOrderResponse = Prisma.PurchaseOrderGetPayload<{
    select: typeof purchaseOrderSelect;
}>;
export declare const itemPurchaseOrderSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly createdAt: true;
    readonly supplier: {
        readonly select: {
            readonly id: true;
            readonly legalName: true;
            readonly email: true;
        };
    };
    readonly items: {
        readonly select: {
            readonly itemId: true;
            readonly qtyOrdered: true;
            readonly qtyReceived: true;
            readonly unitCost: true;
        };
    };
};
type RawItemPurchaseOrder = Prisma.PurchaseOrderGetPayload<{
    select: typeof itemPurchaseOrderSelect;
}>;
export type ItemPurchaseOrderResponse = Pick<RawItemPurchaseOrder, "id" | "code" | "status" | "createdAt" | "supplier"> & {
    total: number;
    qtyOrdered: number;
    qtyReceived: number;
    lineTotal: number;
};
export declare const createPurchaseOrderSchema: z.ZodObject<{
    supplierId: z.ZodString;
    warehouseId: z.ZodString;
    expectedAt: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        qtyOrdered: z.ZodCoercedNumber<unknown>;
        unitCost: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreatePurchaseOrderFormInput = z.infer<typeof createPurchaseOrderSchema>;
export declare const receivePurchaseOrderSchema: z.ZodObject<{
    lines: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        qty: z.ZodCoercedNumber<unknown>;
        batchNo: z.ZodOptional<z.ZodString>;
        expiryDate: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ReceivePurchaseOrderFormInput = z.infer<typeof receivePurchaseOrderSchema>;
