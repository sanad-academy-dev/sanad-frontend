import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
import { type CreateJournalEntryInput, type JournalEntryResponse } from "@/server/accounting/journal-entry/journal-entry.type";
import { type VoucherActor, type VoucherConfig } from "@/server/accounting/voucher/voucher.service";
/**
 * [P2.4] Journal Entry service (BRD §7.1). The FIRST voucher whose submit actually moves
 * money: the P0.2 lifecycle owns docstatus/numbering/audit, and its onSubmit/onCancel hooks
 * hand the §6 engine a gl_map — the JE itself never writes gl_entry rows (AR-4).
 *
 * The lifecycle config is built PER CALL (`jeConfig(actor)`) because the engine needs the
 * acting user for the FR-12.1 frozen-date bypass, and the P0.2 hook signature deliberately
 * carries no actor (background posters pass SYSTEM_ACTOR explicitly).
 */
type Tx = Prisma.TransactionClient;
/** Create a Draft JE with its grid rows (no ledger impact, no number). */
export declare function createJournalEntry(input: CreateJournalEntryInput): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
/** Replace a Draft JE's header + rows (AR-1: only drafts are editable; amend after that). */
export declare function updateJournalEntry(clinicId: string, id: string, input: Omit<CreateJournalEntryInput, "clinicId" | "createdById">): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
/** Delete a Draft JE (drafts have no ledger footprint; submitted docs cancel instead). */
export declare function deleteJournalEntry(clinicId: string, id: string): Promise<void>;
/** Per-call lifecycle config — captures the actor for the engine's FR-12.1 check. */
export declare function jeConfig(actor: VoucherActor): VoucherConfig<JournalEntryResponse>;
export declare const submitJournalEntry: (id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare const cancelJournalEntry: (id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
/** [P8.2] tx-level lifecycle — system JEs booked atomically inside another submit. */
export declare const submitJournalEntryInTx: (tx: Tx, id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare const cancelJournalEntryInTx: (tx: Tx, id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare const amendJournalEntry: (id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    rows: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/enums").AccountType | null;
        };
        id: string;
        idx: number;
        costCenterId: string | null;
        accountId: string;
        debit: import("@prisma/client-runtime-utils").Decimal;
        credit: import("@prisma/client-runtime-utils").Decimal;
        debitInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        creditInAccountCurrency: import("@prisma/client-runtime-utils").Decimal;
        partyType: string | null;
        partyId: string | null;
        dim1: string | null;
        dim2: string | null;
        dim3: string | null;
        dim4: string | null;
        userRemark: string | null;
        exchangeRate: import("@prisma/client-runtime-utils").Decimal;
        referenceType: string | null;
        referenceId: string | null;
    }[];
    voucherType: string;
    documentNo: string | null;
    chequeNo: string | null;
    chequeDate: Date | null;
    remark: string | null;
    multiCurrency: boolean;
    isSystemGenerated: boolean;
    totalDebit: import("@prisma/client-runtime-utils").Decimal;
    totalCredit: import("@prisma/client-runtime-utils").Decimal;
}>;
export {};
