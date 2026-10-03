import { Prisma } from "@/generated/prisma/client";
import type { AllocationRowInput } from "@/server/accounting/cost-center-allocation/cost-center-allocation.type";
/** Exact decimal sum of the row percentages. */
export declare function sumPercentages(rows: readonly AllocationRowInput[]): Prisma.Decimal;
/**
 * Document-level validation applied on both save and submit (BRD §4.4):
 *  - at least one row,
 *  - every percentage strictly positive,
 *  - no cost center repeated,
 *  - the percentages sum to EXACTLY 100.
 * DB-dependent rules (leaf children, no allocation chains) live in the service.
 */
export declare function assertAllocationRowsValid(rows: readonly AllocationRowInput[]): void;
