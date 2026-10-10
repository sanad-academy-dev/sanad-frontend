import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import type { AccountType } from "@/generated/prisma/enums";

/**
 * [P3.1] Party accounting types (BRD §4.10, contract C6). BROWSER-SAFE: this file is
 * imported by the client — Prisma appears as a TYPE only, never a value.
 *
 * Party = polymorphic (partyType, partyId). The registry below is the closed list of
 * party types (C6): Owner and Insurer are the customer/receivable side; Supplier and Staff
 * sit on the payable side. Their §4.10 accounting fields live in accounting-owned child tables —
 * the operational masters are never altered (strangler C3).
 */

export type PartySide = Extract<AccountType, "RECEIVABLE" | "PAYABLE">;

export type PartyTypeDefinition = {
	/** the value stored in gl_entry.partyType / the child tables */
	key: string;
	/** which AR/AP side the party's control account must be (BR-4.10.1 type check) */
	side: PartySide;
	labelAr: string;
	labelEn: string;
};

export const PARTY_TYPES = [
	{ key: "Owner", side: "RECEIVABLE", labelAr: "عميل (وليّ أمر)", labelEn: "Customer (Owner)" },
	{ key: "Supplier", side: "PAYABLE", labelAr: "مورّد", labelEn: "Supplier" },
	{ key: "Staff", side: "PAYABLE", labelAr: "موظف", labelEn: "Employee (Staff)" },
	// [MI-P0] BR-I8.1.1 — the insurer's claim share is an AR receivable (MI BRD §8.1)
	{ key: "Insurer", side: "RECEIVABLE", labelAr: "شركة تأمين", labelEn: "Insurer" },
] as const satisfies readonly PartyTypeDefinition[];

export type PartyTypeKey = (typeof PARTY_TYPES)[number]["key"];

export function isPartyType(value: string): value is PartyTypeKey {
	return PARTY_TYPES.some((definition) => definition.key === value);
}

export function partySideOf(partyType: PartyTypeKey): PartySide {
	const definition = PARTY_TYPES.find((d) => d.key === partyType);
	if (!definition) throw new Error(`نوع طرف غير مدعوم: ${partyType}`);
	return definition.side;
}

export type PartyRef = { partyType: PartyTypeKey; partyId: string };

/* ── child-table selects (server truth) ───────────────────────────────────────────────── */

export const partyAccountSelect = {
	id: true,
	clinicId: true,
	partyType: true,
	partyId: true,
	accountId: true,
	account: { select: { accountName: true, accountNumber: true, accountType: true } },
} as const satisfies Prisma.PartyAccountSelect;

export type PartyAccountResponse = Prisma.PartyAccountGetPayload<{
	select: typeof partyAccountSelect;
}>;

export const partyCreditLimitSelect = {
	id: true,
	clinicId: true,
	partyType: true,
	partyId: true,
	creditLimit: true,
	bypassCreditLimitCheck: true,
} as const satisfies Prisma.PartyCreditLimitSelect;

export type PartyCreditLimitResponse = Prisma.PartyCreditLimitGetPayload<{
	select: typeof partyCreditLimitSelect;
}>;

export const partyAccountingConfigSelect = {
	id: true,
	clinicId: true,
	partyType: true,
	partyId: true,
	defaultCurrencyCode: true,
	paymentTermsTemplateId: true,
	isFrozen: true,
	disabled: true,
} as const satisfies Prisma.PartyAccountingConfigSelect;

export type PartyAccountingConfigResponse = Prisma.PartyAccountingConfigGetPayload<{
	select: typeof partyAccountingConfigSelect;
}>;

/* ── list rows (master + config composition) ──────────────────────────────────────────── */

/**
 * One party row on the «حسابات الأطراف» screen: identity from the operational master
 * (Owner/Supplier/Staff — no single schema source exists for the union, so the identity
 * fields are declared here and each DAO maps its master into them) + the accounting
 * children when present.
 */
export type PartyListRow = {
	partyType: PartyTypeKey;
	partyId: string;
	name: string;
	code: string | null;
	account: PartyAccountResponse | null;
	creditLimit: PartyCreditLimitResponse | null;
	config: PartyAccountingConfigResponse | null;
};

/* ── PATCH schema (upsert of the three children in one call) ──────────────────────────── */

/**
 * `isInternal`/`representsCompany` exist in the schema but are deliberately NOT PATCHable
 * until inter-company lands (P8+) — no API-only fields without a UI (the [P2-fix] lesson).
 */
export const updatePartyAccountingSchema = z.object({
	accountId: z.string().trim().min(1).nullish(),
	defaultCurrencyCode: z
		.string()
		.trim()
		.regex(/^[A-Z]{3}$/, "رمز العملة يجب أن يكون 3 أحرف")
		.nullish(),
	// decimal-as-string (contract C2)
	creditLimit: z
		.string()
		.trim()
		.regex(/^\d+(\.\d+)?$/, "قيمة غير صالحة")
		.nullish(),
	bypassCreditLimitCheck: z.boolean().optional(),
	isFrozen: z.boolean().optional(),
	disabled: z.boolean().optional(),
});

export type UpdatePartyAccountingFormInput = z.infer<typeof updatePartyAccountingSchema>;
