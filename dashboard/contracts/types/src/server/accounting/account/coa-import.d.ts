import { AccountRootType, AccountType } from "@/generated/prisma/enums";
/**
 * [P1.3] Pure Chart-of-Accounts CSV importer (BRD FR-4.3.5) — no DB/env imports so parsing
 * and validation are unit-testable in isolation.
 *
 * Columns (header row, order-independent, case-insensitive):
 *   Account Name · Parent Account · Account Number · Is Group · Account Type · Root Type · Currency
 * "Parent Account" references the parent by its **Account Number** (roots leave it blank).
 */
export declare const COA_IMPORT_COLUMNS: readonly ["Account Name", "Parent Account", "Account Number", "Is Group", "Account Type", "Root Type", "Currency"];
export declare const COA_IMPORT_TEMPLATE = "Account Name,Parent Account,Account Number,Is Group,Account Type,Root Type,Currency\n\u0627\u0644\u0623\u0635\u0648\u0644,,1000,Yes,,Asset,\n\u0627\u0644\u0646\u0642\u062F \u0641\u064A \u0627\u0644\u0628\u0646\u0643,1000,1010,No,Bank,Asset,SAR\n\u0627\u0644\u0625\u064A\u0631\u0627\u062F\u0627\u062A,,4000,Yes,,Income,\n\u0625\u064A\u0631\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A,4000,4100,No,Income Account,Income,SAR\n";
export type PlannedAccount = {
    accountName: string;
    accountNumber: string | null;
    parentNumber: string | null;
    isGroup: boolean;
    rootType: AccountRootType;
    accountType: AccountType | null;
    currencyCode: string | null;
};
export type ImportRowError = {
    line: number;
    message: string;
};
export type ImportPlan = {
    /** rows ordered so a parent always precedes its children (safe to create in order) */
    accounts: PlannedAccount[];
    errors: ImportRowError[];
};
/** Minimal RFC-4180-ish CSV parser: handles quoted fields, embedded commas/quotes/newlines. */
export declare function parseCsv(text: string): string[][];
/**
 * Parse + validate a CSV against the existing chart. `existing` maps an existing Account
 * Number to whether it is a group and its root type (for parent resolution of rows whose
 * parent already lives in the DB). Returns an ordered create-plan plus row-level errors.
 */
export declare function planCoaImport(text: string, existing?: Map<string, {
    isGroup: boolean;
    rootType: AccountRootType;
}>): ImportPlan;
