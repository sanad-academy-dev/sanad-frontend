import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
export { DocStatus };
/**
 * §7.1 voucher_type values supported in P2 (party-less). The full 16 arrive with P3/P5+.
 * Declared HERE (not in .rules) because this file is imported by the browser bundle and
 * must stay free of Prisma VALUE imports — .rules uses Prisma.Decimal at runtime.
 */
export declare const JE_VOUCHER_TYPES: readonly ["Journal Entry", "Bank Entry", "Cash Entry", "Contra Entry", "Opening Entry", "Exchange Gain Or Loss", "Exchange Rate Revaluation"];
export type JeVoucherType = (typeof JE_VOUCHER_TYPES)[number];
export declare function isJeVoucherType(value: string): value is JeVoucherType;
/** [P2.4] Types for Journal Entry (BRD §7.1). */
export declare const journalEntrySelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly postingDate: true;
    readonly amendedFromId: true;
    readonly voucherType: true;
    readonly chequeNo: true;
    readonly chequeDate: true;
    readonly remark: true;
    readonly multiCurrency: true;
    readonly isSystemGenerated: true;
    readonly totalDebit: true;
    readonly totalCredit: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly rows: {
        readonly orderBy: {
            readonly idx: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly idx: true;
            readonly accountId: true;
            readonly debit: true;
            readonly credit: true;
            readonly exchangeRate: true;
            readonly debitInAccountCurrency: true;
            readonly creditInAccountCurrency: true;
            readonly costCenterId: true;
            readonly dim1: true;
            readonly dim2: true;
            readonly dim3: true;
            readonly dim4: true;
            readonly userRemark: true;
            readonly partyType: true;
            readonly partyId: true;
            readonly referenceType: true;
            readonly referenceId: true;
            readonly account: {
                readonly select: {
                    readonly accountName: true;
                    readonly accountNumber: true;
                    readonly accountType: true;
                };
            };
        };
    };
};
export type JournalEntryResponse = Prisma.JournalEntryGetPayload<{
    select: typeof journalEntrySelect;
}>;
declare const jeRowSchema: z.ZodObject<{
    accountId: z.ZodString;
    debit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    credit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    exchangeRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    debitInAccountCurrency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    creditInAccountCurrency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dim1: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dim2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dim3: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dim4: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    userRemark: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    referenceType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    referenceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const createJournalEntrySchema: z.ZodObject<{
    voucherType: z.ZodDefault<z.ZodEnum<{
        "Journal Entry": "Journal Entry";
        "Exchange Rate Revaluation": "Exchange Rate Revaluation";
        "Exchange Gain Or Loss": "Exchange Gain Or Loss";
        "Bank Entry": "Bank Entry";
        "Cash Entry": "Cash Entry";
        "Contra Entry": "Contra Entry";
        "Opening Entry": "Opening Entry";
    }>>;
    postingDate: z.ZodString;
    chequeNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    chequeDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    remark: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    multiCurrency: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    rows: z.ZodArray<z.ZodObject<{
        accountId: z.ZodString;
        debit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        credit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        exchangeRate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        debitInAccountCurrency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        creditInAccountCurrency: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        costCenterId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dim1: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dim2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dim3: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        dim4: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        userRemark: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        referenceType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        referenceId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CreateJournalEntryFormInput = z.input<typeof createJournalEntrySchema>;
export type CreateJournalEntryFormValues = z.output<typeof createJournalEntrySchema>;
export type JournalEntryRowInput = z.output<typeof jeRowSchema>;
export type CreateJournalEntryInput = {
    clinicId: string;
    voucherType: string;
    postingDate: Date;
    chequeNo?: string | null;
    chequeDate?: Date | null;
    remark?: string | null;
    multiCurrency?: boolean;
    rows: JournalEntryRowInput[];
    createdById?: string | null;
};
export type ListJournalEntryFilter = {
    docstatus?: DocStatus;
    voucherType?: string;
    limit?: number;
};
export declare const journalEntryTemplateSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly templateTitle: true;
    readonly voucherType: true;
    readonly accountIds: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type JournalEntryTemplateResponse = Prisma.JournalEntryTemplateGetPayload<{
    select: typeof journalEntryTemplateSelect;
}>;
export declare const createJournalEntryTemplateSchema: z.ZodObject<{
    templateTitle: z.ZodString;
    voucherType: z.ZodDefault<z.ZodEnum<{
        "Journal Entry": "Journal Entry";
        "Exchange Rate Revaluation": "Exchange Rate Revaluation";
        "Exchange Gain Or Loss": "Exchange Gain Or Loss";
        "Bank Entry": "Bank Entry";
        "Cash Entry": "Cash Entry";
        "Contra Entry": "Contra Entry";
        "Opening Entry": "Opening Entry";
    }>>;
    accountIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreateJournalEntryTemplateFormInput = z.input<typeof createJournalEntryTemplateSchema>;
export type CreateJournalEntryTemplateFormValues = z.output<typeof createJournalEntryTemplateSchema>;
