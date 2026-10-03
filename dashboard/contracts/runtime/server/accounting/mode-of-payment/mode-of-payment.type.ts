import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { ModeOfPaymentType } from "@/generated/prisma/enums";

export { ModeOfPaymentType };

/**
 * [P1.7] Types for Mode of Payment (BRD §4.8). Clinic-scoped master; the per-company default
 * account collapses to one nullable `defaultAccountId` (company = clinicId, contract C5).
 */

export const modeOfPaymentSelect = {
	id: true,
	clinicId: true,
	modeOfPaymentName: true,
	type: true,
	enabled: true,
	defaultAccountId: true,
	createdAt: true,
	updatedAt: true,
	defaultAccount: {
		select: { id: true, accountName: true, accountNumber: true },
	},
} as const satisfies Prisma.ModeOfPaymentSelect;

export type ModeOfPaymentResponse = Prisma.ModeOfPaymentGetPayload<{
	select: typeof modeOfPaymentSelect;
}>;

export const createModeOfPaymentSchema = z.object({
	modeOfPaymentName: z
		.string({ error: "اسم طريقة الدفع مطلوب" })
		.trim()
		.min(1, "اسم طريقة الدفع مطلوب"),
	type: z.enum(ModeOfPaymentType).default(ModeOfPaymentType.GENERAL),
	enabled: z.boolean().optional().default(true),
	defaultAccountId: z.string().trim().min(1).nullish(),
});
export type CreateModeOfPaymentFormInput = z.input<typeof createModeOfPaymentSchema>;
export type CreateModeOfPaymentFormValues = z.output<typeof createModeOfPaymentSchema>;

export const updateModeOfPaymentSchema = z.object({
	modeOfPaymentName: z.string().trim().min(1).optional(),
	type: z.enum(ModeOfPaymentType).optional(),
	enabled: z.boolean().optional(),
	defaultAccountId: z.string().trim().min(1).nullish(),
});
export type UpdateModeOfPaymentFormInput = z.infer<typeof updateModeOfPaymentSchema>;

type ModeOfPaymentCreateFields = Prisma.ModeOfPaymentUncheckedCreateInput;
export type CreateModeOfPaymentInput = Pick<
	ModeOfPaymentCreateFields,
	"clinicId" | "modeOfPaymentName"
> &
	Partial<
		Pick<ModeOfPaymentCreateFields, "type" | "enabled" | "defaultAccountId" | "createdById">
	>;
export type UpdateModeOfPaymentInput = Partial<
	Pick<
		ModeOfPaymentCreateFields,
		"modeOfPaymentName" | "type" | "enabled" | "defaultAccountId"
	>
>;
