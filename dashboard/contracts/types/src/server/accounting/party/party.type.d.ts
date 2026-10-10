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
export declare const PARTY_TYPES: readonly [{
    readonly key: "Owner";
    readonly side: "RECEIVABLE";
    readonly labelAr: "عميل (وليّ أمر)";
    readonly labelEn: "Customer (Owner)";
}, {
    readonly key: "Supplier";
    readonly side: "PAYABLE";
    readonly labelAr: "مورّد";
    readonly labelEn: "Supplier";
}, {
    readonly key: "Staff";
    readonly side: "PAYABLE";
    readonly labelAr: "موظف";
    readonly labelEn: "Employee (Staff)";
}, {
    readonly key: "Insurer";
    readonly side: "RECEIVABLE";
    readonly labelAr: "شركة تأمين";
    readonly labelEn: "Insurer";
}];
export type PartyTypeKey = (typeof PARTY_TYPES)[number]["key"];
export declare function isPartyType(value: string): value is PartyTypeKey;
export declare function partySideOf(partyType: PartyTypeKey): PartySide;
export type PartyRef = {
    partyType: PartyTypeKey;
    partyId: string;
};
export declare const partyAccountSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly accountId: true;
    readonly account: {
        readonly select: {
            readonly accountName: true;
            readonly accountNumber: true;
            readonly accountType: true;
        };
    };
};
export type PartyAccountResponse = Prisma.PartyAccountGetPayload<{
    select: typeof partyAccountSelect;
}>;
export declare const partyCreditLimitSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly creditLimit: true;
    readonly bypassCreditLimitCheck: true;
};
export type PartyCreditLimitResponse = Prisma.PartyCreditLimitGetPayload<{
    select: typeof partyCreditLimitSelect;
}>;
export declare const partyAccountingConfigSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly defaultCurrencyCode: true;
    readonly paymentTermsTemplateId: true;
    readonly isFrozen: true;
    readonly disabled: true;
};
export type PartyAccountingConfigResponse = Prisma.PartyAccountingConfigGetPayload<{
    select: typeof partyAccountingConfigSelect;
}>;
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
/**
 * `isInternal`/`representsCompany` exist in the schema but are deliberately NOT PATCHable
 * until inter-company lands (P8+) — no API-only fields without a UI (the [P2-fix] lesson).
 */
export declare const updatePartyAccountingSchema: z.ZodObject<{
    accountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    defaultCurrencyCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    creditLimit: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bypassCreditLimitCheck: z.ZodOptional<z.ZodBoolean>;
    isFrozen: z.ZodOptional<z.ZodBoolean>;
    disabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type UpdatePartyAccountingFormInput = z.infer<typeof updatePartyAccountingSchema>;
