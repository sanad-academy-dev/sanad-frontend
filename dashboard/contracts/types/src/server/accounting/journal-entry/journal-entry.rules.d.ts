import type { AccountReportType, AccountType } from "@/generated/prisma/enums";
import type { JeVoucherType } from "@/server/accounting/journal-entry/journal-entry.type";
/**
 * [P2.4] Pure Journal Entry rules (BRD §7.1) — no DB imports. The doc-level guards that run
 * BEFORE the §6 engine sees the gl_map: per-voucher_type behavior for the party-less types
 * P2 supports, one-sided rows, and the strict document balance (the engine's 0.05 allowance
 * is a safety net, not a UX contract — a JE the user submits must balance exactly at
 * currency precision, which is also what the grid's difference indicator shows).
 */
export type JeRuleRow = {
    debit: string;
    credit: string;
    /** classification of the row's account, resolved by the service */
    accountType: AccountType | null;
    reportType: AccountReportType;
    accountName: string;
    /** [P3.3] party carried by the row (BR-4.3.3) */
    partyType?: string | null;
    partyId?: string | null;
};
/**
 * Document-level §7.1 validation. `precision` = company currency fractionUnits; the strict
 * balance compares at that precision (sub-cent dust is the engine's round-off business).
 */
export declare function validateJournalEntryDoc(voucherType: JeVoucherType, rows: JeRuleRow[], header: {
    chequeNo?: string | null;
    chequeDate?: Date | null;
}, precision: number): void;
