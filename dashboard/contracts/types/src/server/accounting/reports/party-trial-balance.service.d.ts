import { type PartySide } from "@/server/accounting/party/party.type";
/**
 * [P3.6] Trial Balance for Party (BRD §18.2): party-wise opening / period / closing within
 * ONE AR or AP account type. Computed over LIVE gl_entry rows (isCancelled = false) whose
 * account carries the selected type — the same math discipline as the account Trial
 * Balance (P2.7), pivoted on the party columns instead of the account.
 */
export type PartyTrialBalanceRow = {
    partyType: string;
    partyId: string;
    partyName: string;
    opening: string;
    periodDebit: string;
    periodCredit: string;
    closing: string;
};
export type PartyTrialBalanceReport = {
    side: PartySide;
    rows: PartyTrialBalanceRow[];
    totals: {
        opening: string;
        periodDebit: string;
        periodCredit: string;
        closing: string;
    };
};
export declare function partyTrialBalanceReport(params: {
    clinicId: string;
    side: PartySide;
    fromDate: Date;
    toDate: Date;
}): Promise<PartyTrialBalanceReport>;
