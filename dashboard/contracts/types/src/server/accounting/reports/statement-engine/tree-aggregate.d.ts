import { Prisma } from "@/generated/prisma/client";
export type StatementTreeNode = {
    id: string;
    accountName: string;
    accountNumber: string | null;
    lft: number;
    rgt: number;
    isGroup: boolean;
    rootType: "ASSET" | "LIABILITY" | "INCOME" | "EXPENSE" | "EQUITY";
};
export type StatementRow = {
    accountId: string;
    accountName: string;
    accountNumber: string | null;
    depth: number;
    isGroup: boolean;
    /** presentation values per period (credit-nature roots negated to read positive) */
    values: string[];
    /** Σ of `values` across the periods */
    total: string;
};
/** debit-nature roots keep (debit − credit); credit-nature roots present the negation */
export declare const CREDIT_NATURE: ReadonlySet<StatementTreeNode["rootType"]>;
export declare function aggregateTree(params: {
    nodes: StatementTreeNode[];
    /** SIGNED nets per LEAF account id, one Decimal per period */
    leafSums: Map<string, Prisma.Decimal[]>;
    periodCount: number;
    /** drop rows whose every period value rounds to zero at `precision` (default on) */
    dropZeroRows?: boolean;
    precision?: number;
}): StatementRow[];
/** §18.1 accumulated_values — running sum across period columns (pure post-pass) */
export declare function accumulateValues(rows: StatementRow[]): StatementRow[];
/** per-root grand total across the given rows' LEAF entries (composers' totals row) */
export declare function sumLeafRows(rows: StatementRow[], periodCount: number): string[];
