import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

/**
 * [MI-P3] Insurer resource types (MI §8.1, FR-I8.1). The table itself landed in MI-P0;
 * these are the shapes for its endpoints. Correction #8 binds: NO account field anywhere
 * here — a per-insurer AR override is a `party_account` row managed by the party screen
 * («حسابات الأطراف»), and the fall-back is the side default. Zero new account machinery.
 */

export const insurerSchema = z.object({
	name: z.string({ error: "اسم شركة التأمين مطلوب" }).trim().min(1, "اسم شركة التأمين مطلوب"),
	phone: z.string().trim().min(1).nullish(),
	email: z.string().trim().email("البريد الإلكتروني غير صحيح").nullish(),
	contactPerson: z.string().trim().min(1).nullish(),
	address: z.string().trim().min(1).nullish(),
	settlementDays: z.coerce
		.number({ error: "مهلة السداد رقم" })
		.int("مهلة السداد عدد صحيح")
		.min(0, "مهلة السداد لا تقل عن صفر")
		.default(30),
	notes: z.string().trim().min(1).nullish(),
});

export type InsurerFormInput = z.infer<typeof insurerSchema>;

export const insurerSelect = {
	id: true,
	code: true,
	name: true,
	phone: true,
	email: true,
	contactPerson: true,
	address: true,
	settlementDays: true,
	notes: true,
	active: true,
	createdAt: true,
	_count: { select: { products: true } },
} as const satisfies Prisma.InsurerSelect;

export type InsurerResponse = Prisma.InsurerGetPayload<{ select: typeof insurerSelect }>;
