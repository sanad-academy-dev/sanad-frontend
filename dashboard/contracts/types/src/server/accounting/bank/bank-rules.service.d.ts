import { BankRuleDirection } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export type BankRuleUpsert = {
    id?: string;
    ruleName: string;
    priority?: number;
    disabled?: boolean;
    descriptionContains?: string | null;
    direction?: BankRuleDirection;
    minAmount?: string | null;
    maxAmount?: string | null;
    bankAccountId?: string | null;
    contraAccountId: string;
};
export declare function listBankRules(clinicId: string): Promise<({
    contraAccount: {
        accountName: string;
    };
} & {
    priority: number;
    id: string;
    clinicId: string;
    disabled: boolean;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    bankAccountId: string | null;
    ruleName: string;
    descriptionContains: string | null;
    direction: BankRuleDirection;
    minAmount: import("@prisma/client-runtime-utils").Decimal | null;
    maxAmount: import("@prisma/client-runtime-utils").Decimal | null;
    contraAccountId: string;
})[]>;
export declare function upsertBankRule(clinicId: string, input: BankRuleUpsert, createdById: string | null): Promise<{
    priority: number;
    id: string;
    clinicId: string;
    disabled: boolean;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    bankAccountId: string | null;
    ruleName: string;
    descriptionContains: string | null;
    direction: BankRuleDirection;
    minAmount: import("@prisma/client-runtime-utils").Decimal | null;
    maxAmount: import("@prisma/client-runtime-utils").Decimal | null;
    contraAccountId: string;
}>;
export declare function deleteBankRule(clinicId: string, id: string): Promise<void>;
export type RuleRunResult = {
    scanned: number;
    settled: {
        bankTransactionId: string;
        ruleName: string;
    }[];
};
/** FR-14.3 — sweep unreconciled transactions; first matching rule books + settles. */
export declare function applyBankTransactionRules(clinicId: string, actor: AccountingActor, onlyTransactionId?: string): Promise<RuleRunResult>;
/** post-import hook: run the sweep only when BOTH flags are on */
export declare function maybeAutoRunRules(clinicId: string, actor: AccountingActor): Promise<RuleRunResult | null>;
