import type { Prisma } from "@/generated/prisma/client";
import { type AccountingDimensionResponse, type UpsertAccountingDimensionFormInput, type UpsertDimensionFilterFormInput } from "@/server/accounting/accounting-dimension/accounting-dimension.type";
import type { WorkingRow } from "@/server/accounting/gl/gl-map";
/**
 * [P10.4] Accounting Dimensions (BRD §4.5) — ACTIVATION of the dim1..dim4 columns that
 * every voucher table and gl_entry have carried since P1.9/P2.1. The master maps a slot
 * to its meaning (config-driven labels, clinic-collapsed per-company defaults); this
 * service also owns the three §6 enforcement pieces:
 *
 *  - {@link applyDimensionDefaults} — fills an EMPTY dimN with the dimension's
 *    per-company default before any check runs;
 *  - {@link assertDimensionRules}  — BR-4.5.2 mandatory-for-BS/PL (report type from the
 *    account's rootType) + the Dimension Filter allow/deny map, engine step 7;
 *  - {@link buildDimensionOffsets} — BR-4.5.3: for each auto-balancing dimension, one
 *    offsetting row per imbalanced dimension VALUE (party stripped) so every value nets
 *    to zero; the appended rows sum to zero because the batch itself balances.
 */
type Tx = Prisma.TransactionClient;
export declare const DIMENSION_SLOTS: readonly [1, 2, 3, 4];
export type DimensionSlot = (typeof DIMENSION_SLOTS)[number];
type DimField = "dim1" | "dim2" | "dim3" | "dim4";
export declare const dimFieldOf: (slot: number) => DimField;
export declare function listAccountingDimensions(clinicId: string): Promise<AccountingDimensionResponse[]>;
export declare function upsertAccountingDimension(clinicId: string, input: UpsertAccountingDimensionFormInput, createdById: string | null): Promise<AccountingDimensionResponse>;
export declare function setDimensionFilter(clinicId: string, dimensionId: string, input: UpsertDimensionFilterFormInput, createdById: string | null): Promise<AccountingDimensionResponse>;
export declare function clearDimensionFilter(clinicId: string, dimensionId: string): Promise<void>;
export type ActiveDimension = Prisma.AccountingDimensionGetPayload<{
    select: {
        id: true;
        slot: true;
        dimensionName: true;
        mandatoryForBalanceSheet: true;
        mandatoryForProfitAndLoss: true;
        defaultDimensionValue: true;
        autoPostBalancingEntry: true;
        offsettingAccountId: true;
        filters: {
            select: {
                allowOnly: true;
                disabled: true;
                accounts: {
                    select: {
                        accountId: true;
                    };
                };
                values: {
                    select: {
                        dimValue: true;
                    };
                };
            };
        };
    };
}>;
export declare function loadActiveDimensions(tx: Tx, clinicId: string): Promise<ActiveDimension[]>;
/** fill empty dimN slots with the dimension's per-company default (BR-4.5, in place) */
export declare function applyDimensionDefaults(rows: WorkingRow[], dimensions: ActiveDimension[]): void;
/**
 * BR-4.5.3 — one offsetting row per (auto-balancing dimension, imbalanced value) on the
 * opposite side, party stripped, same dim value. Appended rows sum to zero.
 */
export declare function buildDimensionOffsets(rows: WorkingRow[], dimensions: ActiveDimension[]): WorkingRow[];
/** BR-4.5.2 + Dimension Filter map — engine step 7 (post-merge rows). */
export declare function assertDimensionRules(tx: Tx, clinicId: string, rows: WorkingRow[]): Promise<void>;
export {};
