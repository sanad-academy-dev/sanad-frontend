export type WithholdingDetailRow = {
    id: string;
    postingDate: Date;
    voucherType: string;
    voucherNo: string;
    partyType: string;
    partyId: string;
    categoryTitle: string;
    taxableAmount: string;
    rate: string;
    taxAmount: string;
    certificateNo: string | null;
};
export type WithholdingSummaryRow = {
    partyType: string;
    partyId: string;
    categoryTitle: string;
    documentCount: number;
    taxableAmount: string;
    taxAmount: string;
    /** derived, not the category's nominal rate — they differ under tax-on-excess */
    effectiveRate: string;
};
export declare function withholdingDetailsReport(params: {
    clinicId: string;
    fromDate?: Date | null;
    toDate?: Date | null;
}): Promise<WithholdingDetailRow[]>;
export declare function withholdingSummaryReport(params: {
    clinicId: string;
    fromDate?: Date | null;
    toDate?: Date | null;
}): Promise<WithholdingSummaryRow[]>;
