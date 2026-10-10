import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/**
 * [P1.10] Types for Finance Book (BRD §4.6). Master only — the ledger starts consuming
 * finance books at P8/P10; until then the doctype stays effectively flagged off (no screen,
 * nothing references it).
 */
export declare const financeBookSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly financeBookName: true;
    readonly disabled: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type FinanceBookResponse = Prisma.FinanceBookGetPayload<{
    select: typeof financeBookSelect;
}>;
export declare const createFinanceBookSchema: z.ZodObject<{
    financeBookName: z.ZodString;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type CreateFinanceBookFormInput = z.input<typeof createFinanceBookSchema>;
export type CreateFinanceBookFormValues = z.output<typeof createFinanceBookSchema>;
type FinanceBookCreateFields = Prisma.FinanceBookUncheckedCreateInput;
export type CreateFinanceBookInput = Pick<FinanceBookCreateFields, "clinicId" | "financeBookName"> & Partial<Pick<FinanceBookCreateFields, "disabled" | "createdById">>;
export type UpdateFinanceBookInput = Partial<Pick<FinanceBookCreateFields, "financeBookName" | "disabled">>;
export {};
