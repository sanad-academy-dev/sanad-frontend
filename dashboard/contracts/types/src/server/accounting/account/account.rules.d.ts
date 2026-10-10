import { AccountReportType, AccountRootType } from "@/generated/prisma/enums";
/**
 * [P1.1] Pure Chart-of-Accounts rules (BRD §4.3) — no DB imports.
 */
/** report_type is derived from root_type: Income/Expense → P&L, otherwise Balance Sheet. */
export declare function reportTypeForRootType(root: AccountRootType): AccountReportType;
/**
 * BR-4.3.1 — a posting target must be a leaf (non-group), non-frozen, non-disabled account.
 * Groups never receive postings. Used by the posting engine from P2; lives here so the
 * rule has one home. Throws an Arabic client-facing error.
 */
export declare function assertPostableAccount(account: {
    accountName: string;
    isGroup: boolean;
    freezeAccount: boolean;
    disabled: boolean;
}): void;
