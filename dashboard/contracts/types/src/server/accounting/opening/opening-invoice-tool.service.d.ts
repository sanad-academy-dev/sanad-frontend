import type { CreateOpeningInvoicesFormInput, OpeningInvoiceToolResult, OpeningToolStatus } from "@/server/accounting/opening/opening-invoice-tool.type";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/** find-or-create the clinic's TEMPORARY leaf the P5.2 GL redirect needs */
export declare function ensureTemporaryOpeningAccount(clinicId: string): Promise<{
    id: string;
    accountName: string;
}>;
export declare function getOpeningToolStatus(clinicId: string): Promise<OpeningToolStatus>;
export declare function createOpeningInvoices(clinicId: string, input: CreateOpeningInvoicesFormInput, actor: AccountingActor): Promise<OpeningInvoiceToolResult>;
