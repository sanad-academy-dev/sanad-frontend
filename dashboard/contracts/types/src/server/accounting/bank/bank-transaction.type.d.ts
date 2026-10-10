import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { BankRuleDirection, BankTransactionStatus, DocStatus } from "@/generated/prisma/enums";
export { BankRuleDirection, BankTransactionStatus, DocStatus };
/** [P11.2] Bank Transaction types (BRD §14). */
/**
 * [P12A-fix5] At or above this candidate score, booking a NEW Payment Entry for a bank
 * transaction plausibly double-books money the books already carry, so the server refuses
 * without an explicit `confirmDuplicate` and the dialog shows what it would duplicate.
 *
 * 80 is the exact-amount award in the §19 matcher scoring — deliberately the AMOUNT term
 * alone rather than amount+same-day (100): the row that produced the owner's duplicate
 * scored 90 (exact amount, date within three days), so a 100 gate would have waved it
 * through. It lives in the shared type module, not the service, because the dialog needs
 * it too and importing the service into a client component would pull `@/lib/db` into the
 * browser bundle.
 */
export declare const DUPLICATE_CANDIDATE_SCORE = 80;
export declare const bankTransactionSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly postingDate: true;
    readonly amendedFromId: true;
    readonly bankAccountId: true;
    readonly deposit: true;
    readonly withdrawal: true;
    readonly currencyCode: true;
    readonly description: true;
    readonly referenceNumber: true;
    readonly transactionId: true;
    readonly status: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly allocatedAmount: true;
    readonly unallocatedAmount: true;
    readonly pairedTransactionId: true;
    readonly importId: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly bankAccount: {
        readonly select: {
            readonly accountName: true;
        };
    };
    readonly payments: {
        readonly orderBy: {
            readonly createdAt: "asc";
        };
        readonly select: {
            readonly id: true;
            readonly paymentDocument: true;
            readonly paymentEntryId: true;
            readonly paymentRowId: true;
            readonly allocatedAmount: true;
        };
    };
};
export type BankTransactionResponse = Prisma.BankTransactionGetPayload<{
    select: typeof bankTransactionSelect;
}>;
export declare const createBankTransactionSchema: z.ZodObject<{
    postingDate: z.ZodString;
    bankAccountId: z.ZodString;
    deposit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    withdrawal: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    referenceNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    transactionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type CreateBankTransactionFormInput = z.infer<typeof createBankTransactionSchema>;
export declare const importStatementSchema: z.ZodObject<{
    bankAccountId: z.ZodString;
    fileName: z.ZodString;
    format: z.ZodEnum<{
        csv: "csv";
        xlsx: "xlsx";
    }>;
    content: z.ZodString;
    mappingId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    presetKey: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type ImportStatementFormInput = z.infer<typeof importStatementSchema>;
/** shared with `listBankRules` so the response type never drifts from the query */
export declare const bankRuleInclude: {
    readonly contraAccount: {
        readonly select: {
            readonly accountName: true;
        };
    };
};
export type BankRuleResponse = Prisma.BankTransactionRuleGetPayload<{
    include: typeof bankRuleInclude;
}>;
export declare const upsertBankRuleSchema: z.ZodObject<{
    ruleName: z.ZodString;
    priority: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    disabled: z.ZodDefault<z.ZodBoolean>;
    descriptionContains: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    direction: z.ZodDefault<z.ZodEnum<{
        readonly ANY: "ANY";
        readonly DEPOSIT: "DEPOSIT";
        readonly WITHDRAWAL: "WITHDRAWAL";
    }>>;
    minAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    maxAmount: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bankAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    contraAccountId: z.ZodString;
}, z.core.$strip>;
export type UpsertBankRuleFormInput = z.infer<typeof upsertBankRuleSchema>;
export type ImportStatementResult = {
    importId: string;
    totalRows: number;
    importedRows: number;
    duplicateRows: number;
    errorRows: number;
    errors: {
        rowNumber: number;
        message: string;
    }[];
};
