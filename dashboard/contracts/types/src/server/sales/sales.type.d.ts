import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { PaymentMethod, type SaleStatus } from "@/generated/prisma/enums";
export type { PaymentMethod, SaleStatus };
export declare const saleItemSchema: z.ZodObject<{
    inventoryItemId: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    unitPrice: z.ZodCoercedNumber<unknown>;
    quantity: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const createSaleSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        inventoryItemId: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        unitPrice: z.ZodCoercedNumber<unknown>;
        quantity: z.ZodCoercedNumber<unknown>;
    }, z.core.$strip>>;
    discount: z.ZodDefault<z.ZodOptional<z.ZodCoercedNumber<unknown>>>;
    discountCode: z.ZodOptional<z.ZodString>;
    partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    paymentMethod: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly CASH: "CASH";
        readonly CARD: "CARD";
        readonly TRANSFER: "TRANSFER";
    }>>>;
    customerName: z.ZodOptional<z.ZodString>;
    customerPhone: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    fulfillment: z.ZodOptional<z.ZodEnum<{
        readonly AT_PAYMENT: "AT_PAYMENT";
        readonly ON_DISPENSE: "ON_DISPENSE";
    }>>;
    redeemPoints: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type CreateSaleFormInput = z.infer<typeof createSaleSchema>;
export declare const paySaleSchema: z.ZodObject<{
    paymentMethod: z.ZodOptional<z.ZodEnum<{
        readonly CASH: "CASH";
        readonly CARD: "CARD";
        readonly TRANSFER: "TRANSFER";
    }>>;
}, z.core.$strip>;
export type PaySaleFormInput = z.infer<typeof paySaleSchema>;
export declare const refundSaleSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export type RefundSaleFormInput = z.infer<typeof refundSaleSchema>;
export declare const saleSelect: {
    readonly id: true;
    readonly code: true;
    readonly status: true;
    readonly subtotal: true;
    readonly discount: true;
    readonly discountCode: true;
    readonly netTotal: true;
    readonly taxRate: true;
    readonly taxAmount: true;
    readonly total: true;
    readonly taxTemplateId: true;
    readonly cogsAmount: true;
    readonly taxes: {
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly rate: true;
            readonly taxAmount: true;
            readonly description: true;
            readonly includedInPrintRate: true;
        };
        readonly orderBy: {
            readonly idx: "asc";
        };
    };
    readonly paymentMethod: true;
    readonly customerName: true;
    readonly customerPhone: true;
    readonly notes: true;
    readonly paidAt: true;
    readonly fulfillment: true;
    readonly dispensedAt: true;
    readonly refundedAt: true;
    readonly refundReason: true;
    readonly createdAt: true;
    readonly items: {
        readonly select: {
            readonly id: true;
            readonly inventoryItemId: true;
            readonly name: true;
            readonly unitPrice: true;
            readonly quantity: true;
            readonly lineTotal: true;
        };
    };
};
export type SaleResponse = Prisma.SaleGetPayload<{
    select: typeof saleSelect;
}>;
