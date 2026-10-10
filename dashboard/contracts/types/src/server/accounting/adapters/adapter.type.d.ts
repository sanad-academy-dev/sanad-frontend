import type { Prisma } from "@/generated/prisma/client";
import type { GlMapRow } from "@/server/accounting/gl/gl-map";
/**
 * [P12A.2] C3 posting adapters — the shared source-module seam (design doc
 * docs/planning/P12A2-adapter-design.md, binding). An adapter DESCRIBES its documents;
 * the generic runner owns flags, chunked transactions, idempotency and reversals — so a
 * POS adapter later is a registry entry, not a new pipeline.
 */
export type AdapterKey = "clinic_invoice" | "expense" | "pos_sale";
type Tx = Prisma.TransactionClient;
/** §4.1 account legs resolved once per run; adapters pick what they need */
export type AdapterAccountLegs = {
    cashAccountId: string | null;
    bankAccountId: string | null;
    incomeAccountId: string | null;
    expenseAccountId: string | null;
    /** `adapter_vat_account_id` setting — required only when a doc carries VAT */
    vatAccountId: string | null;
    /**
     * [P12B.5] `adapter_cogs_account_id` / `adapter_stock_account_id` — the BRD §7.2 row 5
     * pair. Required only by an adapter whose documents move stock, which today is the POS
     * one; the other two never touch them.
     */
    cogsAccountId: string | null;
    stockAccountId: string | null;
    defaultCostCenterId: string | null;
};
/** one eligible operational document, normalized for the runner */
export type AdapterSourceDoc = {
    sourceId: string;
    sourceCode: string;
    postingDate: Date;
    /** signed base-currency total the posting must carry (source-side truth) */
    amount: string;
};
/**
 * why a posting is reversal-eligible ([P12A-fix5]):
 *  · `source_reversed` — the source document entered its reversing state (CANCELED / VOIDED
 *    / REFUNDED — [P12B.1] added the refund trigger for paid docs)
 *  · `source_missing`  — the source document no longer exists (hard-deleted). Without this
 *    case a deleted source left a permanent orphan the product could never re-zero.
 */
export type AdapterReversalReason = "source_reversed" | "source_missing";
export type AdapterReversal = {
    postingId: string;
    sourceId: string;
    sourceCode: string;
    reason: AdapterReversalReason;
};
export type SourceModuleAdapter = {
    key: AdapterKey;
    /** accounts-settings kill-switch — OFF means the runner refuses (reversibility) */
    flagKey: "enable_clinic_invoice_adapter" | "enable_expense_adapter" | "enable_pos_sale_adapter";
    labelAr: string;
    /** eligible docs in range, minus already-posted (anti-join adapter_posting) */
    collectPending(tx: Tx, clinicId: string, range: {
        fromDate: Date;
        toDate: Date;
    }): Promise<AdapterSourceDoc[]>;
    /** posted (unreversed) docs whose source has since been voided/cancelled OR deleted */
    collectReversals(tx: Tx, clinicId: string): Promise<AdapterReversal[]>;
    /** pure, balanced §6 rows for ONE doc — throwing marks the doc failed, never the run */
    buildGlMap(doc: AdapterSourceDoc, legs: AdapterAccountLegs, tx: Tx): Promise<GlMapRow[]>;
    /**
     * [P12B.4-fix] The accounts whose DEBIT total equals Σ(document amount) for this
     * adapter — the report's third leg.
     *
     * WHY THIS IS NOW DECLARED RATHER THAN ASSUMED. The zero-diff report used to sum EVERY
     * debit under the adapter's voucherType, on the reasoning that "debits and credits are
     * symmetric, so Σdebit is the posting volume". That held while every adapter posted one
     * value leg. The POS adapter posts TWO debits — the cash receipt AND the COGS leg
     * ([P12B.5]) — so Σdebit became total + cogs and every POS sale read a permanent
     * residual of exactly its cost. Caught by the executed walkthrough (rule 12); it would
     * have shipped as a report that could never reach zero.
     *
     * Nulls are tolerated and skipped, so an adapter may name legs the clinic has not
     * configured.
     */
    glValueAccountIds(legs: AdapterAccountLegs): (string | null)[];
    /**
     * [MI-P4] رِجل القيمة قد تعتمد على المستند نفسه: فاتورة مؤمَّنة قيمتها على النقد
     * (copay) وعلى حساب ذمم المؤمِّن (insurerShare) معًا. عند غيابها يستعمل المشغّل
     * القائمة الثابتة أعلاه — لا تغيير على المحولات القائمة.
     */
    glValueAccountIdsForDoc?(doc: AdapterSourceDoc, legs: AdapterAccountLegs, tx: Tx): Promise<(string | null)[]>;
    /** source-side rows for the parallel-run report (eligible docs, posted or not) */
    collectSourceRows(tx: Tx, clinicId: string, range: {
        fromDate: Date;
        toDate: Date;
    }): Promise<AdapterSourceDoc[]>;
};
export type AdapterRunResult = {
    adapterKey: AdapterKey;
    posted: {
        sourceId: string;
        sourceCode: string;
        amount: string;
    }[];
    reversed: {
        sourceId: string;
        sourceCode: string;
        reason: AdapterReversalReason;
    }[];
    errors: {
        sourceId: string;
        sourceCode: string;
        message: string;
    }[];
};
export type AdapterReconciliationRow = {
    sourceId: string;
    sourceCode: string;
    postingDate: Date;
    sourceAmount: string;
    postedAmount: string | null;
    diff: string;
};
/** THE deliverable — zero-diff ⇔ residual "0" AND both lists empty */
export type AdapterReconciliationReport = {
    adapterKey: AdapterKey;
    fromDate: Date;
    toDate: Date;
    sourceTotal: string;
    postedTotal: string;
    /** Σ live GL rows under this adapter's voucherType — the third leg of the check */
    glTotal: string;
    unpostedDocs: AdapterReconciliationRow[];
    orphanPostings: {
        sourceId: string;
        sourceCode: string;
        postedAmount: string;
    }[];
    /** sourceTotal − glTotal */
    residual: string;
    rows: AdapterReconciliationRow[];
};
export {};
