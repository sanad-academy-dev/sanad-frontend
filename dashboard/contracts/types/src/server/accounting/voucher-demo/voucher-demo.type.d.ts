import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
import type { VoucherDemoRecord } from "@/server/accounting/voucher/voucher.demo";
/**
 * [P0.2 UI] Types for the `voucher_demo` endpoints.
 *
 * The response shape is the lifecycle service's own `VoucherDemoRecord` — the demo screen
 * must not get a second, drifting view of the row it is driving.
 */
export type { VoucherDemoRecord };
export { DocStatus };
export declare const createVoucherDemoSchema: z.ZodObject<{
    title: z.ZodString;
    amount: z.ZodString;
    postingDate: z.ZodString;
}, z.core.$strip>;
export type CreateVoucherDemoFormInput = z.infer<typeof createVoucherDemoSchema>;
/**
 * Edit form. `amount` is only accepted while the document is a Draft — the whitelist that
 * enforces it lives with the voucher config (AR-1), not here; this shape just allows both
 * fields and lets the lifecycle service reject the illegal one.
 */
export declare const updateVoucherDemoSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateVoucherDemoFormInput = z.infer<typeof updateVoucherDemoSchema>;
export type ListVoucherDemoFilter = {
    docstatus?: DocStatus;
    limit?: number;
};
export type CreateVoucherDemoInput = Pick<Prisma.VoucherDemoUncheckedCreateInput, "clinicId" | "title" | "amount" | "postingDate"> & Partial<Pick<Prisma.VoucherDemoUncheckedCreateInput, "createdById">>;
