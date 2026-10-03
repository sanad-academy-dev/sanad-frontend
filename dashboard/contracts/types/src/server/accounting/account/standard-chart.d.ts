import type { AccountType } from "@/generated/prisma/enums";
import { AccountRootType } from "@/generated/prisma/enums";
/**
 * [P1.2/P1.3] "Standard" seed Chart of Accounts (BRD FR-4.3.5), Arabic labels. Used to make
 * the CoA tree screen reviewable with real-looking data now, and reused as one of the
 * importer's seed charts in P1.3. ~40 accounts across the five root types.
 */
export type ChartSeedNode = {
    number: string;
    name: string;
    isGroup?: boolean;
    accountType?: AccountType;
    children?: ChartSeedNode[];
};
export declare const STANDARD_CHART: {
    rootType: AccountRootType;
    root: ChartSeedNode;
}[];
/**
 * Seed the Standard chart for a clinic. Idempotent: does nothing if the clinic already has
 * any accounts. Inserts top-down so parents exist before children.
 */
export declare function seedStandardChart(clinicId: string): Promise<void>;
