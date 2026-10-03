import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { InventoryCategory } from "@/generated/prisma/enums";
export type { InventoryCategory };
export declare const createInventorySchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodEnum<{
        readonly ANTIBIOTIC: "ANTIBIOTIC";
        readonly ANTI_INFLAMMATORY: "ANTI_INFLAMMATORY";
        readonly VACCINE: "VACCINE";
        readonly HORMONE: "HORMONE";
        readonly SUPPLEMENT: "SUPPLEMENT";
        readonly CRUSTACEAN: "CRUSTACEAN";
        readonly SURGICAL_TOOLS: "SURGICAL_TOOLS";
        readonly SUPPLIES: "SUPPLIES";
    }>;
    supplier: z.ZodOptional<z.ZodString>;
    sku: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    stock: z.ZodCoercedNumber<unknown>;
    reorderPoint: z.ZodCoercedNumber<unknown>;
    maxQuantity: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    unitCost: z.ZodCoercedNumber<unknown>;
    price: z.ZodCoercedNumber<unknown>;
    expiryDate: z.ZodString;
    productionDate: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    tracksBatches: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    active: z.ZodBoolean;
    warehouseId: z.ZodOptional<z.ZodString>;
    catalogProductId: z.ZodOptional<z.ZodString>;
    itemTaxTemplateId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateInventoryFormInput = z.infer<typeof createInventorySchema>;
export type CreateInventoryInput = Pick<Prisma.InventoryItemUncheckedCreateInput, "clinicId" | "name" | "category" | "supplier" | "sku" | "barcode" | "stock" | "reorderPoint" | "maxQuantity" | "unitCost" | "price" | "productionDate" | "expiryDate" | "location" | "notes" | "tracksBatches" | "active" | "catalogProductId" | "itemTaxTemplateId"> & {
    /** مستودع الرصيد الافتتاحي (ليس عمودًا على المنتج) — الافتراضي عند الغياب */
    warehouseId?: string | null;
};
export type UpdateInventoryInput = Partial<Pick<CreateInventoryFormInput, "name" | "category" | "stock" | "reorderPoint" | "price" | "active" | "tracksBatches">> & {
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
export declare const inventorySelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly category: true;
    readonly supplier: true;
    readonly sku: true;
    readonly barcode: true;
    readonly stock: true;
    readonly reorderPoint: true;
    readonly maxQuantity: true;
    readonly unitCost: true;
    readonly valuationRate: true;
    readonly price: true;
    readonly productionDate: true;
    readonly expiryDate: true;
    readonly location: true;
    readonly notes: true;
    readonly tracksBatches: true;
    readonly active: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly itemTaxTemplateId: true;
    readonly catalogProductId: true;
    readonly catalogProduct: {
        readonly select: {
            readonly id: true;
            readonly registerNumber: true;
            readonly tradeName: true;
            readonly genericName: true;
            readonly authorizationStatus: true;
            readonly withdrawalPeriod: true;
            readonly standard: {
                readonly select: {
                    readonly code: true;
                    readonly nameAr: true;
                    readonly nameEn: true;
                    readonly sourceUrl: true;
                };
            };
        };
    };
    readonly bins: {
        readonly select: {
            readonly qty: true;
            readonly warehouse: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type InventoryResponse = Prisma.InventoryItemGetPayload<{
    select: typeof inventorySelect;
}>;
export declare const inventoryAlertSelect: {
    readonly id: true;
    readonly name: true;
    readonly stock: true;
    readonly reorderPoint: true;
};
export type InventoryAlertResponse = Prisma.InventoryItemGetPayload<{
    select: typeof inventoryAlertSelect;
}>;
export type ProductActivityEntry = {
    id: string;
    type: "ledger" | "purchase" | "product";
    label: string;
    at: Date;
};
