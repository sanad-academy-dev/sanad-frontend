import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
/** [P11.1] Bank + Bank Account types (BRD §14). */
export declare const bankSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly bankName: true;
    readonly swiftNumber: true;
    readonly website: true;
    readonly disabled: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type BankResponse = Prisma.BankGetPayload<{
    select: typeof bankSelect;
}>;
export declare const bankAccountSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly bankId: true;
    readonly accountName: true;
    readonly isCompanyAccount: true;
    readonly glAccountId: true;
    readonly accountType: true;
    readonly accountSubtype: true;
    readonly iban: true;
    readonly branchCode: true;
    readonly bankAccountNo: true;
    readonly partyType: true;
    readonly partyId: true;
    readonly integrationId: true;
    readonly disabled: true;
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly bank: {
        readonly select: {
            readonly bankName: true;
        };
    };
    readonly glAccount: {
        readonly select: {
            readonly accountName: true;
            readonly accountCurrencyCode: true;
        };
    };
};
export type BankAccountResponse = Prisma.BankAccountGetPayload<{
    select: typeof bankAccountSelect;
}>;
export declare const upsertBankSchema: z.ZodObject<{
    bankName: z.ZodString;
    swiftNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type UpsertBankFormInput = z.infer<typeof upsertBankSchema>;
export declare const upsertBankAccountSchema: z.ZodObject<{
    bankId: z.ZodString;
    accountName: z.ZodString;
    isCompanyAccount: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    glAccountId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accountType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    accountSubtype: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    iban: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    branchCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bankAccountNo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyType: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    partyId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    disabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type UpsertBankAccountFormInput = z.infer<typeof upsertBankAccountSchema>;
export type CreateBankInput = Pick<Prisma.BankUncheckedCreateInput, "clinicId" | "bankName" | "swiftNumber" | "website" | "disabled" | "createdById">;
export type CreateBankAccountInput = Pick<Prisma.BankAccountUncheckedCreateInput, "clinicId" | "bankId" | "accountName" | "isCompanyAccount" | "glAccountId" | "accountType" | "accountSubtype" | "iban" | "branchCode" | "bankAccountNo" | "partyType" | "partyId" | "disabled" | "createdById">;
