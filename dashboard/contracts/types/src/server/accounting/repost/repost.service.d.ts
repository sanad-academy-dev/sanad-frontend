import { RepostStatus } from "@/generated/prisma/enums";
import type { AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P12.9] FR-6.9 «Repost Accounting Ledger» — rebuild a submitted voucher's ledger impact
 * after its accounts were corrected.
 *
 * REVERSE-AND-REPOST, NEVER DELETE-AND-RECREATE. The BRD offers both; only one of them is
 * defensible. Deleting the original entries erases the evidence that the ledger ever said
 * something else — which is precisely what an auditor is looking for when they ask why a
 * balance moved. Appending reversals and then fresh entries costs more rows and answers the
 * question. This is the same AR-2 discipline every cancel in this module already follows, so
 * it also needs no new machinery.
 *
 * A REPOST IS ONE TRANSACTION PER VOUCHER (NFR-1). A voucher that fails mid-repost must not
 * be left with its old entries reversed and no new ones — that is a voucher that silently
 * vanished from the trial balance. Each voucher reverses and re-posts inside a single
 * serializable transaction; a failure rolls that voucher back completely and is recorded on
 * its row, while the rest of the batch continues.
 *
 * IT REFUSES ANYTHING NOT SUBMITTED. A draft has posted nothing to repost; a cancelled
 * voucher's reversal is the intended final state and re-posting it would resurrect entries
 * the clinic deliberately took back.
 *
 * THE REASON IS MANDATORY. Reposting rewrites what the ledger says about a document someone
 * already signed off. Requiring a sentence is the cheapest possible audit trail, and its
 * absence is the difference between a correction and an unexplained restatement.
 */
export type RepostVoucherResult = {
    voucherType: string;
    voucherId: string;
    voucherNo: string | null;
    ok: boolean;
    glCountAfter?: number;
    error?: string;
};
/** Reverse then rebuild ONE voucher's ledger, atomically. */
export declare function repostVoucher(params: {
    clinicId: string;
    voucherType: string;
    voucherId: string;
    actor: AccountingActor;
}): Promise<RepostVoucherResult>;
export declare function createRepost(params: {
    clinicId: string;
    reason: string;
    vouchers: {
        voucherType: string;
        voucherId: string;
        voucherNo?: string | null;
    }[];
    createdById?: string | null;
}): Promise<{
    items: {
        id: string;
        status: RepostStatus;
        voucherType: string;
        voucherId: string;
        voucherNo: string | null;
        errorMessage: string | null;
        glCountAfter: number | null;
        repostId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    reason: string;
    status: RepostStatus;
    errorMessage: string | null;
    completedAt: Date | null;
}>;
/** Run every queued item; one failure never aborts the rest. */
export declare function runRepost(params: {
    clinicId: string;
    repostId: string;
    actor: AccountingActor;
}): Promise<{
    repostId: string;
    results: RepostVoucherResult[];
}>;
export declare function listReposts(clinicId: string): import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
    items: {
        id: string;
        status: RepostStatus;
        voucherType: string;
        voucherId: string;
        voucherNo: string | null;
        errorMessage: string | null;
        glCountAfter: number | null;
        repostId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    reason: string;
    status: RepostStatus;
    errorMessage: string | null;
    completedAt: Date | null;
})[]>;
export declare function getRepost(clinicId: string, id: string): Promise<{
    items: {
        id: string;
        status: RepostStatus;
        voucherType: string;
        voucherId: string;
        voucherNo: string | null;
        errorMessage: string | null;
        glCountAfter: number | null;
        repostId: string;
    }[];
} & {
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    reason: string;
    status: RepostStatus;
    errorMessage: string | null;
    completedAt: Date | null;
}>;
/**
 * [P12.15] Submitted vouchers of one repostable type, newest first — what the repost builder
 * offers to pick from.
 *
 * ONE UNIFORM SHAPE FOR FOUR DOCTYPES, resolved on the server. The four list endpoints each
 * return their own payload with their own idea of "the amount" (grand total, total debit,
 * paid amount), and a picker that had to union them client-side would grow a branch per
 * doctype in the UI — the exact place a fifth repostable type would be forgotten. Here, the
 * only thing a new type costs is a case in this switch, right beside the registry that
 * decides what is repostable at all.
 *
 * DRAFTS AND CANCELLED DOCUMENTS ARE NOT OFFERED, because `repostVoucher` refuses them: a
 * picker that lists a document the action will reject is a trap, not a choice.
 */
export type RepostCandidate = {
    voucherId: string;
    voucherNo: string | null;
    postingDate: Date;
    amount: string;
    label: string | null;
};
export declare function listRepostCandidates(params: {
    clinicId: string;
    voucherType: string;
    limit?: number;
}): Promise<RepostCandidate[]>;
