/**
 * [P13.4] Opening trial-balance importer — the PURE half (parse + validate + balance check).
 *
 * WHAT IT IS FOR. A clinic leaving another system arrives with one artefact that matters: the
 * trial balance on the changeover date. Every other migration path in this module already
 * exists — the chart of accounts through the [P1.3] CSV importer, open AR/AP through the
 * [P12A.1] Opening Invoice Creation Tool — and this closes the last gap: every remaining
 * balance-sheet account, in one opening journal entry.
 *
 * IT REFUSES AN UNBALANCED FILE, AND THAT IS THE WHOLE POINT. Every other validation here is
 * convenience; this one is the reason the tool exists. An opening entry that does not foot
 * means the clinic's very first balance sheet is wrong, and it will stay wrong through every
 * period after it because nothing downstream re-derives an opening. Importing "most of" a
 * trial balance is strictly worse than importing none — the books look plausible and are not.
 * So the difference is reported in the error, with both totals, rather than absorbed into a
 * rounding account: a mismatch is a fact about THEIR data that only they can resolve.
 *
 * Pure by design — no DB, no env — so the parse, the per-row rules and the balance check run
 * in the fast CI tier, where a migration tool's correctness is cheapest to keep.
 */
export declare const OPENING_BALANCE_COLUMNS: readonly ["Account Number", "Debit", "Credit", "Party Type", "Party", "Remark"];
export declare const OPENING_BALANCE_TEMPLATE = "Account Number,Debit,Credit,Party Type,Party,Remark\n1010,15000,,,,\u0631\u0635\u064A\u062F \u0627\u0644\u0628\u0646\u0643 \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A\n1200,8000,,Owner,OWNER-CODE,\u0630\u0645\u0645 \u0639\u0645\u064A\u0644 \u0645\u064F\u0631\u062D\u0651\u0644\u0629\n2100,,5000,Supplier,SUP-CODE,\u0630\u0645\u0645 \u0645\u0648\u0631\u0651\u062F \u0645\u064F\u0631\u062D\u0651\u0644\u0629\n3000,,18000,,,\u062D\u0642\u0648\u0642 \u0627\u0644\u0645\u0644\u0643\u064A\u0629 \u0627\u0644\u0627\u0641\u062A\u062A\u0627\u062D\u064A\u0629\n";
export type OpeningBalanceRow = {
    line: number;
    accountNumber: string;
    debit: string;
    credit: string;
    partyType: string | null;
    partyRef: string | null;
    remark: string | null;
};
export type OpeningBalanceError = {
    line: number;
    message: string;
};
export type OpeningBalancePlan = {
    rows: OpeningBalanceRow[];
    totalDebit: string;
    totalCredit: string;
    /** debit − credit; anything but "0" makes the plan unusable */
    difference: string;
    balanced: boolean;
    errors: OpeningBalanceError[];
};
export declare function parseOpeningBalances(csv: string): OpeningBalancePlan;
