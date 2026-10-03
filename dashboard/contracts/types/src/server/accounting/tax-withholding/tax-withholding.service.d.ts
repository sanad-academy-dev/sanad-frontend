import { Prisma } from "@/generated/prisma/client";
import { type WithholdingResult } from "@/server/accounting/tax-withholding/tax-withholding.rules";
export type ResolvedWithholding = WithholdingResult & {
    categoryId: string | null;
    categoryTitle: string | null;
    accountId: string | null;
};
/** the supplier's default category, used when the document does not pin one */
export declare function defaultCategoryIdForParty(clinicId: string, partyType: string, partyId: string): Promise<string | null>;
export declare function resolvePurchaseWithholding(params: {
    clinicId: string;
    categoryId: string | null;
    partyType: string;
    partyId: string;
    postingDate: Date;
    netTotal: Prisma.Decimal | string | number;
    grandTotal: Prisma.Decimal | string | number;
    excludeInvoiceId?: string | null;
}): Promise<ResolvedWithholding>;
/**
 * Record the withholding actually applied to a submitted document. Unique per voucher, so a
 * re-submit after amendment replaces rather than duplicates — the certificate must name one
 * amount per document, not a history of attempts.
 */
export declare function recordWithholdingEntry(tx: Prisma.TransactionClient, params: {
    clinicId: string;
    categoryId: string;
    partyType: string;
    partyId: string;
    voucherType: string;
    voucherId: string;
    voucherNo: string;
    postingDate: Date;
    result: WithholdingResult;
    createdById?: string | null;
}): Promise<void>;
