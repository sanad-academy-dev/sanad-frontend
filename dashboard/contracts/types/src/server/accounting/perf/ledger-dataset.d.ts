export type GeneratedDataset = {
    glEntries: number;
    pleEntries: number;
    fromDate: Date;
    toDate: Date;
    elapsedMs: number;
};
export declare function generateLedgerDataset(params: {
    clinicId: string;
    /** total GL rows to create — always even, since rows are written in balanced pairs */
    targetRows: number;
    debitAccountId: string;
    creditAccountId: string;
    receivableAccountId?: string | null;
    partyType?: string;
    partyId?: string;
    costCenterId?: string | null;
    /** ledger currency stamped on every row — the fixture's company currency */
    accountCurrencyCode?: string;
    fromDate: Date;
    /** rows per insert — Postgres parameter limits make very large batches counterproductive */
    batchSize?: number;
}): Promise<GeneratedDataset>;
/** remove everything the generator wrote for a clinic — voucherNo prefix is the marker */
export declare function clearLedgerDataset(clinicId: string): Promise<void>;
