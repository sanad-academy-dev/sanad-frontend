import type { Prisma } from "@/generated/prisma/client";
import { Prisma as PrismaNs } from "@/generated/prisma/client";
import type { StatementPeriod } from "@/server/accounting/reports/statement-engine/period-list";
import type { StatementTreeNode } from "@/server/accounting/reports/statement-engine/tree-aggregate";
/**
 * [P9.1] §18.1 — the data layer: one aggregate per period (+ one opening aggregate) per
 * load, grouped by account. Prisma-portable date bucketing (dossier risk 1: SQL date
 * bucketing rejected in favor of per-period aggregates; NFR-3 tuning is P13.1's with the
 * 1M-GLE generator).
 *
 * Opening semantics (§18.1):
 *  - BS-nature loads (`includeOpening`) take EVERYTHING before the range as an opening
 *    bucket — the caller folds it into cumulative presentation.
 *  - P&L loads exclude `isOpening` rows entirely (`excludeOpeningEntries`) — opening
 *    balance uploads never contaminate performance figures. (PCV-closing exclusion joins
 *    at P10.2 through the same filter object.)
 */
type Tx = Prisma.TransactionClient;
export type StatementRootType = StatementTreeNode["rootType"];
export type StatementData = {
    nodes: StatementTreeNode[];
    /** SIGNED nets (debit − credit) per LEAF per period — `aggregateTree`'s input */
    leafSums: Map<string, PrismaNs.Decimal[]>;
    /** pre-range SIGNED net per LEAF (empty map when `includeOpening` is false) */
    opening: Map<string, PrismaNs.Decimal>;
};
export declare function loadStatementData(params: {
    clinicId: string;
    rootTypes: StatementRootType[];
    periods: StatementPeriod[];
    includeOpening: boolean;
    excludeOpeningEntries: boolean;
    /**
     * [P10.2] voucher types dropped from the load — P&L and Cash Flow pass
     * ["period_closing_voucher"] so closed periods keep their performance figures
     * (closing entries are pure book transfers); the BS keeps them.
     */
    excludeVoucherTypes?: string[];
    /**
     * [P10.2] §5.3 BS fast-path — when set, the opening bucket reads the Account Closing
     * Balance snapshots AT this date plus only the GLEs AFTER it (instead of scanning
     * everything before the range). Caller resolves the latest eligible snapshot date and
     * honors `ignore_account_closing_balance`.
     */
    snapshotCutoff?: Date;
    tx?: Tx;
}): Promise<StatementData>;
/** fold each leaf's opening into period 0 — cumulative (BS) presentation feeds on this */
export declare function foldOpeningIntoFirstPeriod(data: StatementData): void;
export {};
