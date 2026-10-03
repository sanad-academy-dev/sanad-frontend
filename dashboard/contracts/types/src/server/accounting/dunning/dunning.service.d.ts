import { Prisma } from "@/generated/prisma/client";
import { DunningStatus } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export type OverdueInvoiceRow = {
    salesInvoiceId: string;
    invoiceNo: string;
    dueDate: Date;
    postingDate: Date;
    grandTotal: string;
    outstanding: string;
    overdueDays: number;
};
/**
 * Submitted, unpaid, past-due invoices for one party. Draft and cancelled invoices are
 * excluded for the usual reason (they owe nothing), and an invoice inside its payment terms
 * is excluded because being unpaid on day 3 of net-30 is not a delinquency.
 */
export declare function listOverdueInvoices(params: {
    clinicId: string;
    partyType: string;
    partyId: string;
    asOf: Date;
}): Promise<OverdueInvoiceRow[]>;
export type CreateDunningInput = {
    clinicId: string;
    typeId?: string | null;
    partyType: string;
    partyId: string;
    postingDate: Date;
    /** empty ⇒ every overdue invoice the party has as of `postingDate` */
    salesInvoiceIds?: string[];
    /** empty ⇒ the type's defaults */
    rateOfInterest?: string | null;
    dunningFee?: string | null;
    createdById?: string | null;
};
export declare function createDunning(input: CreateDunningInput): Promise<{
    overdues: {
        id: string;
        dueDate: Date;
        outstanding: import("@prisma/client-runtime-utils").Decimal;
        salesInvoiceId: string;
        invoiceNo: string;
        overdueDays: number;
        interest: import("@prisma/client-runtime-utils").Decimal;
        dunningId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: DunningStatus;
    partyType: string;
    partyId: string;
    postingDate: Date;
    journalEntryId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    typeId: string | null;
    totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
    totalInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
/**
 * Submit: post the fee + interest as a receivable, move to UNRESOLVED.
 *
 * A dunning worth nothing (no interest, no fee — a pure reminder letter) posts no JE. Booking
 * a zero-value voucher would fail the §6 balance check for no gain and would litter the
 * ledger with entries that move nothing.
 */
export declare function submitDunning(params: {
    clinicId: string;
    id: string;
    actor: AccountingActor;
}): Promise<{
    overdues: {
        id: string;
        dueDate: Date;
        outstanding: import("@prisma/client-runtime-utils").Decimal;
        salesInvoiceId: string;
        invoiceNo: string;
        overdueDays: number;
        interest: import("@prisma/client-runtime-utils").Decimal;
        dunningId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: DunningStatus;
    partyType: string;
    partyId: string;
    postingDate: Date;
    journalEntryId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    typeId: string | null;
    totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
    totalInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
/**
 * Resolution is DERIVED, never asserted: a dunning is resolved when every invoice it names
 * has zero outstanding AND its own interest charge is collected. A manual "mark resolved"
 * button would let a clinic close a dunning whose money never arrived.
 */
export declare function refreshDunningStatus(clinicId: string, id: string): Promise<{
    overdues: {
        salesInvoiceId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: DunningStatus;
    partyType: string;
    partyId: string;
    postingDate: Date;
    journalEntryId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    typeId: string | null;
    totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
    totalInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare function cancelDunning(params: {
    clinicId: string;
    id: string;
    actor: AccountingActor;
}): Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: DunningStatus;
    partyType: string;
    partyId: string;
    postingDate: Date;
    journalEntryId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    typeId: string | null;
    totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
    totalInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
export declare function listDunnings(clinicId: string, filter?: {
    status?: DunningStatus;
}): Prisma.PrismaPromise<({
    type: {
        id: string;
        title: string;
    } | null;
    overdues: {
        id: string;
        dueDate: Date;
        outstanding: import("@prisma/client-runtime-utils").Decimal;
        salesInvoiceId: string;
        invoiceNo: string;
        overdueDays: number;
        interest: import("@prisma/client-runtime-utils").Decimal;
        dunningId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: DunningStatus;
    partyType: string;
    partyId: string;
    postingDate: Date;
    journalEntryId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    typeId: string | null;
    totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
    totalInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningAmount: import("@prisma/client-runtime-utils").Decimal;
})[]>;
export declare function getDunning(clinicId: string, id: string): Promise<{
    type: {
        id: string;
        clinicId: string;
        disabled: boolean;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        incomeAccountId: string | null;
        rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
        dunningFee: import("@prisma/client-runtime-utils").Decimal;
        letterBody: string | null;
    } | null;
    overdues: {
        id: string;
        dueDate: Date;
        outstanding: import("@prisma/client-runtime-utils").Decimal;
        salesInvoiceId: string;
        invoiceNo: string;
        overdueDays: number;
        interest: import("@prisma/client-runtime-utils").Decimal;
        dunningId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: DunningStatus;
    partyType: string;
    partyId: string;
    postingDate: Date;
    journalEntryId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    typeId: string | null;
    totalOutstanding: import("@prisma/client-runtime-utils").Decimal;
    totalInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningAmount: import("@prisma/client-runtime-utils").Decimal;
}>;
export type UpsertDunningTypeInput = {
    title: string;
    rateOfInterest: string;
    dunningFee: string;
    letterBody?: string | null;
    incomeAccountId?: string | null;
    disabled?: boolean;
};
export declare function listDunningTypes(clinicId: string): Prisma.PrismaPromise<{
    id: string;
    clinicId: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    incomeAccountId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    letterBody: string | null;
}[]>;
export declare function createDunningType(clinicId: string, input: UpsertDunningTypeInput): Prisma.Prisma__DunningTypeClient<{
    id: string;
    clinicId: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    incomeAccountId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    letterBody: string | null;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
export declare function updateDunningType(clinicId: string, id: string, input: UpsertDunningTypeInput): Promise<{
    id: string;
    clinicId: string;
    disabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    incomeAccountId: string | null;
    rateOfInterest: import("@prisma/client-runtime-utils").Decimal;
    dunningFee: import("@prisma/client-runtime-utils").Decimal;
    letterBody: string | null;
}>;
