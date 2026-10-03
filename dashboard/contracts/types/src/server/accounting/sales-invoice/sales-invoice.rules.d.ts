/**
 * [P5.2] Pure §7.2 document rules (BR-7.2.2..7.2.5, BR-4.9.2). DB-dependent checks —
 * return qty caps vs the original (P5.6), credit limit (BR-7.2.4, submit-time), duplicate
 * PO control (BR-7.2.3, submit-time) — live in the service/submit path; everything here is
 * deterministic on the document alone so it unit-tests without a database.
 *
 * [P6.2] Types are STRUCTURAL (only the fields the rules read), so the purchase invoice —
 * whose §7.3 sign/flag/discount rules are the exact mirror — reuses every assert here.
 */
export type RuleItemRow = {
    itemName: string;
    qty: string;
    rate: string;
    isFreeItem: boolean;
};
export type RuleTaxRow = {
    chargeType: string;
    rate: string;
    taxAmount: string;
    rowId?: number | null;
    includedInPrintRate: boolean;
    description: string;
};
/** Non-return invoices carry positive quantities; returns store NEGATIVE qty (BR-7.2.2). */
export declare function assertItemRows(items: RuleItemRow[], isReturn: boolean): void;
/** BR-7.2.2 — return flags must be coherent before any DB work. */
export declare function assertReturnFlags(doc: {
    isReturn: boolean;
    returnAgainstId?: string | null;
    updateOutstandingForSelf: boolean;
}): void;
/** BR-4.9.2 — the due date can never precede the posting date. */
export declare function assertDueDateRule(postingDate: Date, dueDate: Date | null | undefined): void;
/** §7.2 row 10 — a write-off amount needs its account. */
export declare function assertWriteOffShape(doc: {
    writeOffAmount: string;
    writeOffAccountId?: string | null;
}): void;
/** §8 step 8 — one discount input at a time; cash/non-trade discounts need an account. */
export declare function assertDiscountShape(doc: {
    additionalDiscountPercentage: string;
    discountAmount: string;
    isCashOrNonTradeDiscount: boolean;
    additionalDiscountAccountId?: string | null;
}): void;
/** §8 step-2 save-time tax-row checks — the same P4 rules the templates enforce. */
export declare function assertTaxRows(taxes: RuleTaxRow[]): void;
/** The full pure pass — one call from create/update/submit paths. */
export declare function validateSalesInvoiceDoc(doc: {
    postingDate: Date;
    dueDate?: Date | null;
    isReturn: boolean;
    returnAgainstId?: string | null;
    updateOutstandingForSelf: boolean;
    isOpening: boolean;
    writeOffAmount: string;
    writeOffAccountId?: string | null;
    additionalDiscountPercentage: string;
    discountAmount: string;
    isCashOrNonTradeDiscount: boolean;
    additionalDiscountAccountId?: string | null;
    items: RuleItemRow[];
    taxes: RuleTaxRow[];
}): void;
