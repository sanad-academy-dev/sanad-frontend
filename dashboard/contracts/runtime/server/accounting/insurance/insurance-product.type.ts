import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/**
 * [MI-P3] Insurance Product types (MI §8.2, FR-I8.2). Percentages Decimal(5,2) per NFR-2
 * (33.33% representable, 33.333% is not — confirmed at owner review 2026-08-22); money
 * Decimal(10,2). `requiresPreAuthAbove` is [P2] in the BRD and deliberately absent.
 * Coverage rows: serviceId + percent, 0 = excluded; duplicates are DEFINED behavior —
 * BR-M4.2.2 tie-breaks by row idx, so no duplicate guard is invented here.
 */

const money = z
	.string()
	.trim()
	.regex(/^\d+(\.\d{1,2})?$/, "قيمة مالية غير صالحة (رقم موجب بمنزلتين كحدّ أقصى)");
const percent = z
	.string()
	.trim()
	.regex(/^\d+(\.\d{1,2})?$/, "نسبة غير صالحة")
	.refine((value) => Number(value) >= 0 && Number(value) <= 100, "النسبة بين 0 و100");

export const coverageRowSchema = z.object({
	serviceId: z
		.string({ error: "دورة صف التغطية مطلوبة" })
		.trim()
		.min(1, "دورة صف التغطية مطلوبة"),
	// 0 = مستثناة من التغطية صراحةً (MI §8.2)
	coveragePercent: percent,
});

export const insuranceProductSchema = z.object({
	insurerId: z.string({ error: "شركة التأمين مطلوبة" }).trim().min(1, "شركة التأمين مطلوبة"),
	name: z.string({ error: "اسم المنتج مطلوب" }).trim().min(1, "اسم المنتج مطلوب"),
	coveragePercentDefault: percent,
	annualCap: money.nullish(),
	perClaimCap: money.nullish(),
	deductibleFixed: money.default("0"),
	deductiblePercent: percent.default("0"),
	coverageRows: z.array(coverageRowSchema).default([]),
});

export type InsuranceProductFormInput = z.infer<typeof insuranceProductSchema>;
export type CoverageRowFormInput = z.infer<typeof coverageRowSchema>;

export const insuranceProductSelect = {
	id: true,
	code: true,
	name: true,
	insurerId: true,
	insurer: { select: { id: true, name: true } },
	coveragePercentDefault: true,
	annualCap: true,
	perClaimCap: true,
	deductibleFixed: true,
	deductiblePercent: true,
	active: true,
	createdAt: true,
	coverageRows: {
		select: {
			id: true,
			idx: true,
			serviceId: true,
			coveragePercent: true,
			service: { select: { id: true, name: true, level: true } },
		},
		orderBy: { idx: "asc" },
	},
	_count: { select: { policies: true } },
} as const satisfies Prisma.InsuranceProductSelect;

export type InsuranceProductResponse = Prisma.InsuranceProductGetPayload<{
	select: typeof insuranceProductSelect;
}>;
