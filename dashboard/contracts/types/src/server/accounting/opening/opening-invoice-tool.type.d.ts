import { z } from "zod";
export declare const openingInvoiceRowSchema: z.ZodObject<{
    invoiceType: z.ZodEnum<{
        sales: "sales";
        purchase: "purchase";
    }>;
    partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyId: z.ZodString;
    postingDate: z.ZodString;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    legacyNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    outstanding: z.ZodString;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const createOpeningInvoicesSchema: z.ZodObject<{
    rows: z.ZodArray<z.ZodObject<{
        invoiceType: z.ZodEnum<{
            sales: "sales";
            purchase: "purchase";
        }>;
        partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        partyId: z.ZodString;
        postingDate: z.ZodString;
        dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        legacyNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        outstanding: z.ZodString;
        costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OpeningInvoiceRowInput = z.infer<typeof openingInvoiceRowSchema>;
export type CreateOpeningInvoicesFormInput = z.infer<typeof createOpeningInvoicesSchema>;
export type OpeningInvoiceToolResult = {
    temporaryOpeningAccountId: string;
    created: {
        rowNumber: number;
        invoiceType: "sales" | "purchase";
        id: string;
        documentNo: string | null;
        partyId: string;
        outstanding: string;
    }[];
    errors: {
        rowNumber: number;
        message: string;
    }[];
};
export type OpeningToolStatus = {
    temporaryOpeningAccount: {
        id: string;
        accountName: string;
    } | null;
    defaultCostCenterId: string | null;
    /** BR-4.10.1 readiness per side — null means that side needs configuring first */
    defaultReceivableAccountId: string | null;
    defaultPayableAccountId: string | null;
    openingSalesInvoices: number;
    openingPurchaseInvoices: number;
};
