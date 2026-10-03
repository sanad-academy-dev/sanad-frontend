import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import type { StockVoucherType } from "@/generated/prisma/enums";
export type { StockVoucherType };
export declare const stockLedgerSelect: {
    readonly id: true;
    readonly itemId: true;
    readonly warehouseId: true;
    readonly qtyChange: true;
    readonly balanceQty: true;
    readonly voucherType: true;
    readonly voucherId: true;
    readonly note: true;
    readonly createdAt: true;
    readonly warehouse: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly item: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
        };
    };
};
export type StockLedgerResponse = Prisma.StockLedgerEntryGetPayload<{
    select: typeof stockLedgerSelect;
}>;
export declare const warehouseSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly branchId: true;
    readonly branch: {
        readonly select: {
            readonly name: true;
            readonly settings: true;
        };
    };
    readonly isDefault: true;
    readonly isMobile: true;
    readonly active: true;
    readonly editsCount: true;
    readonly createdAt: true;
};
export type WarehouseResponse = Prisma.WarehouseGetPayload<{
    select: typeof warehouseSelect;
}>;
export declare const createWarehouseSchema: z.ZodObject<{
    name: z.ZodString;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateWarehouseFormInput = z.infer<typeof createWarehouseSchema>;
export declare const updateWarehouseSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    isDefault: z.ZodOptional<z.ZodBoolean>;
    active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdateWarehouseFormInput = z.infer<typeof updateWarehouseSchema>;
export declare const stockBinSelect: {
    readonly id: true;
    readonly itemId: true;
    readonly warehouseId: true;
    readonly qty: true;
    readonly updatedAt: true;
    readonly warehouse: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
        };
    };
    readonly item: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
        };
    };
};
export type StockBinResponse = Prisma.StockBinGetPayload<{
    select: typeof stockBinSelect;
}>;
export declare const valuationItemSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly category: true;
    readonly stock: true;
    readonly valuationRate: true;
};
type ValuationItemBase = Prisma.InventoryItemGetPayload<{
    select: typeof valuationItemSelect;
}>;
export type ValuationItem = Omit<ValuationItemBase, "valuationRate"> & {
    valuationRate: number;
    stockValue: number;
};
export interface ValuationReport {
    items: ValuationItem[];
    totalValue: number;
    totalQty: number;
}
export interface LedgerFilters {
    itemId?: string;
    warehouseId?: string;
    voucherType?: string;
    from?: string;
    to?: string;
}
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
export interface StockOverview {
    totalProducts: number;
    outOfStock: number;
    belowReorder: number;
    stockValue: number;
    todayMovements: number;
    nearExpiry: number;
    expired: number;
}
export declare const stockBatchSelect: {
    readonly id: true;
    readonly batchNo: true;
    readonly qty: true;
    readonly expiryDate: true;
    readonly productionDate: true;
    readonly createdAt: true;
    readonly item: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly code: true;
        };
    };
    readonly warehouse: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type StockBatchResponse = Prisma.StockBatchGetPayload<{
    select: typeof stockBatchSelect;
}>;
export declare const reconcileSchema: z.ZodObject<{
    warehouseId: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        actualQty: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ReconcileFormInput = z.infer<typeof reconcileSchema>;
export declare const writeOffBatchSchema: z.ZodObject<{
    qty: z.ZodCoercedNumber<unknown>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WriteOffBatchFormInput = z.infer<typeof writeOffBatchSchema>;
/** استلام أو صرف لمستودع واحد */
export declare const createMovementSchema: z.ZodObject<{
    warehouseId: z.ZodString;
    type: z.ZodEnum<{
        RECEIPT: "RECEIPT";
        ISSUE: "ISSUE";
    }>;
    note: z.ZodOptional<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        qty: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateMovementFormInput = z.infer<typeof createMovementSchema>;
/** تحويل بين مستودعين */
export declare const createTransferSchema: z.ZodObject<{
    fromWarehouseId: z.ZodString;
    toWarehouseId: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        qty: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateTransferFormInput = z.infer<typeof createTransferSchema>;
export declare const MOVEMENT_TYPES: readonly ["RECEIPT", "ISSUE", "TRANSFER"];
export type MovementType = (typeof MOVEMENT_TYPES)[number];
/**
 * مخطّط موحّد لنموذج الواجهة (يغطّي استلام/صرف/تحويل في شاشة واحدة).
 * مسطّح + superRefine ليتوافق مع react-hook-form عند تبديل نوع الحركة.
 */
export declare const stockMovementFormSchema: z.ZodObject<{
    type: z.ZodEnum<{
        TRANSFER: "TRANSFER";
        RECEIPT: "RECEIPT";
        ISSUE: "ISSUE";
    }>;
    warehouseId: z.ZodOptional<z.ZodString>;
    fromWarehouseId: z.ZodOptional<z.ZodString>;
    toWarehouseId: z.ZodOptional<z.ZodString>;
    note: z.ZodOptional<z.ZodString>;
    lines: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        qty: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type StockMovementFormInput = z.infer<typeof stockMovementFormSchema>;
