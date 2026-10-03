import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { MembershipBenefitType } from "@/generated/prisma/enums";

/**
 * [MI-P1] Membership Plan types (MI BRD §4.1, §4.2). BROWSER-SAFE: Prisma appears as a
 * TYPE only. The zod schema is the single source of the BR-M4.2.1 field matrix — the
 * TypeBox model validates shapes and the service parses through THIS schema, so the rule
 * is enforced at the model layer AND the service (BR-M4.2.1's own requirement).
 */

// money as decimal-strings (contract C2 — no JS floats anywhere near amounts)
const money = z
	.string()
	.trim()
	.regex(/^\d+(\.\d{1,2})?$/, "قيمة مالية غير صالحة (رقم موجب بمنزلتين كحدّ أقصى)");
const percent = z
	.string()
	.trim()
	.regex(/^\d+(\.\d{1,2})?$/, "نسبة غير صالحة")
	.refine((value) => Number(value) >= 0 && Number(value) <= 100, "النسبة بين 0 و100");

export const membershipBenefitRowSchema = z
	.object({
		benefitType: z.enum(MembershipBenefitType, { error: "نوع الميزة مطلوب" }),
		serviceId: z.string().trim().min(1).nullish(),
		discountPercent: percent.nullish(),
		discountAmount: money.nullish(),
		unitsPerPeriod: z.coerce.number().int("عدد صحيح").min(1, "الوحدات 1 على الأقل").nullish(),
		labelAr: z.string().trim().min(1).nullish(),
	})
	.superRefine((row, ctx) => {
		const issue = (message: string) => ctx.addIssue({ code: "custom", message });
		const hasPercent = row.discountPercent != null;
		const hasAmount = row.discountAmount != null;
		switch (row.benefitType) {
			case "SERVICE_DISCOUNT":
				if (!row.serviceId) issue("خصم الدورة يتطلب تحديد دورة (أو فئة)");
				if (hasPercent === hasAmount)
					issue("خصم الدورة يتطلب نسبة أو مبلغًا ثابتًا — أحدهما بالضبط");
				if (row.unitsPerPeriod != null) issue("الوحدات لا تخص خصم الدورة");
				if (row.labelAr != null) issue("الوصف الحر يخص الامتيازات فقط");
				break;
			case "PRODUCT_DISCOUNT":
				if (!hasPercent) issue("خصم المنتجات يتطلب نسبة");
				if (hasAmount) issue("خصم المنتجات لا يقبل مبلغًا ثابتًا");
				if (row.serviceId != null) issue("خصم المنتجات لا يرتبط بدورة");
				if (row.unitsPerPeriod != null) issue("الوحدات لا تخص خصم المنتجات");
				if (row.labelAr != null) issue("الوصف الحر يخص الامتيازات فقط");
				break;
			case "INCLUDED_UNITS":
				if (!row.serviceId) issue("الوحدات المشمولة تتطلب تحديد دورة");
				if (row.unitsPerPeriod == null) issue("الوحدات المشمولة تتطلب عدد وحدات لكل فترة");
				if (hasPercent || hasAmount) issue("الوحدات المشمولة لا تقبل خصمًا");
				if (row.labelAr != null) issue("الوصف الحر يخص الامتيازات فقط");
				break;
			case "PRIORITY_BOOKING":
				if (row.serviceId != null || hasPercent || hasAmount || row.unitsPerPeriod != null)
					issue("أولوية الحجز علامة بلا حقول إضافية");
				if (row.labelAr != null) issue("الوصف الحر يخص الامتيازات فقط");
				break;
			case "PERK":
				if (!row.labelAr) issue("الامتياز يتطلب وصفًا عربيًا");
				if (row.serviceId != null || hasPercent || hasAmount || row.unitsPerPeriod != null)
					issue("الامتياز وصف حر بلا حقول أخرى");
				break;
		}
	});

export const createMembershipPlanSchema = z.object({
	name: z.string({ error: "اسم الخطة مطلوب" }).trim().min(1, "اسم الخطة مطلوب"),
	description: z.string().trim().min(1).nullish(),
	tierRank: z.coerce.number({ error: "ترتيب الفئة رقم" }).int("عدد صحيح").min(0).default(0),
	// BRD §4.1: plans bill monthly or yearly only — a deliberate subset of the engine enum
	billingInterval: z.enum(["MONTH", "YEAR"], { error: "دورية الفوترة شهرية أو سنوية" }),
	intervalCount: z.coerce.number().int("عدد صحيح").min(1, "1 على الأقل").default(1),
	fee: money, // BR-M4.1.1: fee ≥ 0 — the regex already forbids negatives
	enrollmentFee: money.default("0"),
	deferRevenue: z.boolean().default(false),
	maxPatients: z.coerce.number().int("عدد صحيح").min(1).nullish(), // inert in v1 ([P2] UI)
	autoRenew: z.boolean().default(true),
	graceDays: z.coerce.number().int("عدد صحيح").min(0).default(7),
	benefits: z.array(membershipBenefitRowSchema).default([]),
});

export type CreateMembershipPlanFormInput = z.infer<typeof createMembershipPlanSchema>;
export type MembershipBenefitRowInput = z.infer<typeof membershipBenefitRowSchema>;

/* ── selects (server truth) ───────────────────────────────────────────────────────────── */

export const membershipPlanBenefitSelect = {
	id: true,
	idx: true,
	benefitType: true,
	serviceId: true,
	service: { select: { id: true, name: true } },
	discountPercent: true,
	discountAmount: true,
	unitsPerPeriod: true,
	labelAr: true,
} as const satisfies Prisma.MembershipPlanBenefitSelect;

export const membershipPlanSelect = {
	id: true,
	code: true,
	name: true,
	description: true,
	tierRank: true,
	billingInterval: true,
	intervalCount: true,
	fee: true,
	enrollmentFee: true,
	deferRevenue: true,
	maxPatients: true,
	autoRenew: true,
	graceDays: true,
	status: true,
	createdAt: true,
	benefits: { select: membershipPlanBenefitSelect, orderBy: { idx: "asc" } },
	_count: { select: { memberships: true } },
} as const satisfies Prisma.MembershipPlanSelect;

export type MembershipPlanResponse = Prisma.MembershipPlanGetPayload<{
	select: typeof membershipPlanSelect;
}>;
