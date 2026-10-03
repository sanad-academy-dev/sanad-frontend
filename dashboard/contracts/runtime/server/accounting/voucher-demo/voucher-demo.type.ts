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

/** Amounts are entered and sent as strings: no JS float ever touches a ledger amount (C2). */
const amountSchema = z
	.string({ error: "المبلغ مطلوب" })
	.min(1, "المبلغ مطلوب")
	.regex(/^-?\d+(\.\d{1,9})?$/, "المبلغ يجب أن يكون رقمًا بحد أقصى 9 منازل عشرية");

export const createVoucherDemoSchema = z.object({
	title: z.string({ error: "العنوان مطلوب" }).min(1, "العنوان مطلوب"),
	amount: amountSchema,
	postingDate: z
		.string({ error: "تاريخ الترحيل مطلوب" })
		.regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الترحيل مطلوب"),
});

export type CreateVoucherDemoFormInput = z.infer<typeof createVoucherDemoSchema>;

/**
 * Edit form. `amount` is only accepted while the document is a Draft — the whitelist that
 * enforces it lives with the voucher config (AR-1), not here; this shape just allows both
 * fields and lets the lifecycle service reject the illegal one.
 */
export const updateVoucherDemoSchema = z.object({
	title: z.string({ error: "العنوان مطلوب" }).min(1, "العنوان مطلوب").optional(),
	amount: amountSchema.optional(),
});

export type UpdateVoucherDemoFormInput = z.infer<typeof updateVoucherDemoSchema>;

export type ListVoucherDemoFilter = {
	docstatus?: DocStatus;
	limit?: number;
};

export type CreateVoucherDemoInput = Pick<
	Prisma.VoucherDemoUncheckedCreateInput,
	"clinicId" | "title" | "amount" | "postingDate"
> &
	Partial<Pick<Prisma.VoucherDemoUncheckedCreateInput, "createdById">>;
