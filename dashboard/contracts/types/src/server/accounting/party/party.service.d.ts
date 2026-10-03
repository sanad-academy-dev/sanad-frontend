import type { Prisma } from "@/generated/prisma/client";
import { type PartyRef, type PartySide, type PartyTypeKey, type UpdatePartyAccountingFormInput } from "@/server/accounting/party/party.type";
import { type AccountingActor } from "@/server/accounting/permissions/accounting-permissions.guard";
/**
 * [P3.1] Party resolution & guards (BRD §4.10).
 *
 * - BR-4.10.1 — control-account resolution order: doc-level account → party's per-company
 *   account → company default receivable/payable. The resolved account MUST match the
 *   required account_type and belong to the company, and must be postable.
 * - BR-4.10.2 — party GL currency: once a party has ledger entries in an account currency,
 *   further postings must use the same currency unless the §19 multi-currency-per-party
 *   flag is on. (P3 runs single-currency — the guard is live but only bites once P8 opens
 *   foreign-currency accounts.)
 * - BR-4.10.3 — frozen party: only the Credit Controller role may post; a disabled party
 *   never posts. (The credit-limit half of BR-4.10.3 lands with Sales Invoice, BR-7.2.4.)
 */
type Tx = Prisma.TransactionClient;
type ResolvedAccount = {
    id: string;
    accountName: string;
    accountType: string | null;
    accountCurrencyCode: string;
    isGroup: boolean;
    freezeAccount: boolean;
    disabled: boolean;
};
export declare function assertKnownPartyType(value: string): asserts value is PartyTypeKey;
/** The party must exist in its operational master, tenant-scoped. */
export declare function assertPartyExists(tx: Tx, clinicId: string, party: PartyRef): Promise<{
    name: string;
}>;
/**
 * BR-4.10.1 — resolve the AR/AP control account for a party.
 * `docAccountId` = the document-level override (debit_to / credit_to), highest priority.
 */
export declare function resolvePartyAccount(tx: Tx, params: {
    clinicId: string;
    party: PartyRef;
    /** which side the voucher needs; defaults to the party type's natural side */
    side?: PartySide;
    docAccountId?: string | null;
}): Promise<ResolvedAccount>;
/** BR-4.10.3 — disabled parties never post; frozen parties need the Credit Controller. */
export declare function assertPartyPostable(tx: Tx, clinicId: string, party: PartyRef, actor: AccountingActor): Promise<void>;
/**
 * BR-4.10.2 — once the party has ledger entries on this account in some currency, further
 * postings must use the same account currency unless the §19 flag allows mixing.
 */
export declare function assertPartyGlCurrency(tx: Tx, clinicId: string, party: PartyRef, accountCurrencyCode: string): Promise<void>;
/**
 * [P3.4] Open vouchers of a party — feeds the JE «تسوية مقابل» picker: every voucher the
 * party still owes (or is owed) through the PLE, i.e. non-delinked rows grouped by
 * against-voucher with a non-zero sum (BR-5.2.2 semantics).
 */
/**
 * [MI-P6] What this party owes RIGHT NOW, in one figure — the counter-facing read behind
 * «رصيد مفتوح» on the owner profile and the pay screen.
 *
 * It sums {@link listPartyOpenVouchers} rather than querying the PLE again: that seam
 * already carries the §5.2 signs and the BR-7.3.2 hold filter, and a second aggregate
 * over the same rows is a second truth waiting to disagree. Only POSITIVE rows count —
 * an unallocated credit is not a debt, and netting it in would under-report what the
 * receptionist must actually collect (the credit is visible in the reconciliation tool,
 * where it can be applied deliberately).
 *
 * The figure exists because of the MI-P5 §10.3a decision: a re-billed insurance rejection
 * leaves real owner debt in the ledger while the operational invoice stays PAID, so the
 * invoice alone can no longer tell the front desk what is owed.
 */
export declare function getPartyOpenBalance(clinicId: string, partyType: string, partyId: string): Promise<{
    outstanding: string;
    voucherCount: number;
}>;
export declare function listPartyOpenVouchers(clinicId: string, partyType: string, partyId: string): Promise<{
    voucherType: string;
    voucherId: string;
    voucherNo: string | null;
    outstanding: string;
}[]>;
/** PATCH surface: validate then upsert the three children in one transaction-ish sweep. */
export declare function updatePartyAccounting(clinicId: string, partyType: string, partyId: string, input: UpdatePartyAccountingFormInput): Promise<{
    account: {
        account: {
            accountName: string;
            accountNumber: string | null;
            accountType: import("@/generated/prisma/client").AccountType | null;
        };
        id: string;
        clinicId: string;
        accountId: string;
        partyType: string;
        partyId: string;
    } | null;
    creditLimit: {
        id: string;
        clinicId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        bypassCreditLimitCheck: boolean;
        partyType: string;
        partyId: string;
    } | null;
    config: {
        id: string;
        clinicId: string;
        disabled: boolean;
        defaultCurrencyCode: string | null;
        partyType: string;
        partyId: string;
        paymentTermsTemplateId: string | null;
        isFrozen: boolean;
    } | null;
}>;
export {};
