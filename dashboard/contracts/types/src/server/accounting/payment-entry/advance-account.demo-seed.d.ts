/**
 * [P12.6] The FR-11.3 seeded scenario (CLAUDE.md rule 10a) — the two accounts a clinic needs
 * before it can book an advance separately, and nothing else.
 *
 * IT DOES NOT TURN THE FLAG ON. Every other pack in this seed makes the feature it seeds
 * work; this one deliberately stops one step short, because
 * `book_advance_payments_in_separate_party_account` changes where real money lands on every
 * subsequent payment. A demo seed that silently flipped it would rewrite the posting
 * behaviour of a clinic that ran `db:seed:accounting-demo` to look at POS data — and the
 * owner would discover it as a customer deposit sitting in a liability nobody expected.
 * Enabling it is a decision, so it stays a decision: «المحاسبة ← الإعدادات».
 *
 * WHAT IT DOES DO is remove the only obstacle that is pure setup. Without these two accounts
 * the feature refuses at save with «اضبطه في إعدادات المحاسبة» — a correct refusal, and a
 * dead end for anyone trying to evaluate the feature, because creating a liability account
 * and pasting its id into a setting is the least interesting part of the story.
 *
 * DEDICATED ACCOUNTS, per rule 10a, so figures the owner verifies once never move when other
 * demo packs change. Idempotent: matched by (clinicId, accountName), so re-running the seed
 * changes nothing — including the flag, which it never writes either way.
 */
export declare const ADVANCE_DEMO: {
    readonly receivedAccountName: "دفعات مقدمة مقبوضة (عرض)";
    readonly paidAccountName: "دفعات مقدمة مدفوعة (عرض)";
};
export declare function seedAdvanceAccountDemo(clinicId: string): Promise<{
    created: string[];
    existing: string[];
}>;
