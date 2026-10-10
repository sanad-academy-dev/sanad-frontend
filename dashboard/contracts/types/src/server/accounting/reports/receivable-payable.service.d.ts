import type { Prisma } from "@/generated/prisma/client";
import { type AgeingBasedOn } from "@/server/accounting/reports/ageing-buckets";
/**
 * [P9.3] §18.3 — Accounts Receivable / Payable, built on the PLE ONLY (the law).
 *
 * One in-memory pass over the non-delinked PLE rows of the side's control accounts:
 * per (voucherType, voucherId) — invoiced = Σ positive rows (the voucher's own debits),
 * paid = Σ negative rows sourced from payments/JEs, creditNotes = Σ negative rows
 * sourced from invoice-type vouchers (CN/DN), outstanding = the §5.2 net. Vouchers whose
 * outstanding rounds to zero drop out. Display fields (document no, dates) come from the
 * [P7.1] reference loaders; amounts carry BOTH account currency and base (P8).
 *
 * Ageing: `basedOn` Posting | Due (Bill falls back to Posting until the loaders carry
 * billDate — logged assumption); buckets per the PURE [P9.3] engine. The acceptance
 * identities — AR total = Σ open PLE and buckets Σ = outstanding — hold by construction
 * and are pinned in the suite.
 */
type Tx = Prisma.TransactionClient;
export type ArApSide = "RECEIVABLE" | "PAYABLE";
export type ArApRow = {
    voucherType: string;
    voucherId: string;
    voucherNo: string | null;
    postingDate: Date | null;
    dueDate: Date | null;
    billNo: string | null;
    partyType: string | null;
    partyId: string | null;
    partyName: string | null;
    accountId: string;
    accountCurrencyCode: string;
    /** account-currency figures (§18.3 party-currency columns) */
    invoiced: string;
    paid: string;
    creditNotes: string;
    outstanding: string;
    /** base-currency outstanding (P8 dual columns) */
    outstandingBase: string;
    ageDays: number;
    bucketIndex: number;
};
export type ArApReport = {
    asOf: Date;
    basedOn: AgeingBasedOn;
    bucketLabels: string[];
    rows: ArApRow[];
    /**
     * BASE-currency bucket totals (index-aligned with bucketLabels) — dossier risk 4:
     * cross-row roll-ups sum base only, since P8 rows may carry different account currencies.
     */
    bucketTotals: string[];
    /** Σ account-currency outstanding — only meaningful when all rows share one currency */
    totalOutstanding: string;
    totalOutstandingBase: string;
};
export declare function receivablePayableReport(params: {
    clinicId: string;
    side: ArApSide;
    asOf: Date;
    basedOn?: AgeingBasedOn;
    ranges?: number[];
    partyType?: string;
    partyId?: string;
    tx?: Tx;
}): Promise<ArApReport>;
export type ArApSummaryRow = {
    partyType: string | null;
    partyId: string | null;
    partyName: string | null;
    outstanding: string;
    buckets: string[];
};
/**
 * §18.3 summary variant — per-party roll-up of the detail rows. Sums BASE currency only
 * (dossier risk 4): one party may hold accounts in several currencies since P8, and only
 * the base figures are addable across them.
 */
export declare function summarizeByParty(report: ArApReport): ArApSummaryRow[];
export {};
