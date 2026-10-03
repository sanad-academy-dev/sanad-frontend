import { DeferredType } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
export type DeferredRunResult = {
    periodStartDate: Date;
    periodEndDate: Date;
    recognized: {
        type: DeferredType;
        itemId: string;
        invoiceNo: string;
        itemName: string;
        amount: string;
        journalEntryId: string | null;
    }[];
    errors: {
        itemId: string;
        invoiceNo: string;
        message: string;
    }[];
    totalAmount: string;
};
export declare function runDeferredAccounting(params: {
    clinicId: string;
    periodStartDate: Date;
    periodEndDate: Date;
    type?: DeferredType | null;
    actor: AccountingActor;
}): Promise<DeferredRunResult>;
