/**
 * [P0.3] Accounting roles & permissions matrix (BRD NFR-5, §19, FR-12.1, BR-4.10.3, FR-6.9).
 *
 * Two kinds of authority, both expressed as permission slugs so they ride the repo's
 * existing mechanism (`StaffRole.permissions` → session → {@link ALL_PERMISSIONS}) instead
 * of introducing a second role registry:
 *
 *  1. **Per-doctype actions** — `accounting.{doctype}.{read|write|submit|cancel}`.
 *     Which actions a doctype exposes is decided by its {@link AccountingDoctypeKind}:
 *     only submittable vouchers can be submitted or cancelled, and the two ledgers are
 *     read-only to users entirely (they are append-only and written exclusively by the
 *     posting engine — BRD AR-2/AR-4).
 *  2. **Special roles** — {@link ACCOUNTING_ROLES}: ERPNext's `frozen_accounts_modifier`,
 *     credit controller, over-billing and repost roles. P0 ships them as declared
 *     capabilities (placeholders); the checks that consume them land with their phases
 *     (frozen date P2.8, credit limit P5, over-billing P5/P6, repost P12.9).
 *
 * This module is intentionally **pure** — string constants only, no DB/session/env imports
 * — so it is safe to import from the client (roles editor) as well as the server guard.
 * Enforcement lives in `accounting-permissions.guard.ts`.
 *
 * Tenant scoping (NFR-5 "company-level user permissions filter every list/report") is a
 * separate concern already handled by the `requireClinic` macro: every accounting query is
 * scoped by `clinicId` (= BRD company, contract C5). Permissions decide *what* a user may
 * do; `clinicId` decides *whose* data they may do it to.
 */
/** The four actions of the BRD permission matrix. */
export declare const ACCOUNTING_ACTIONS: readonly ["read", "write", "submit", "cancel"];
export type AccountingAction = (typeof ACCOUNTING_ACTIONS)[number];
/**
 * What a doctype is, which fixes the actions it can grant:
 * - `voucher` — submittable document with the AR-1 lifecycle → read/write/submit/cancel
 * - `master`  — reference data, no docstatus → read/write
 * - `ledger`  — append-only ledger written only by the posting engine → read
 * - `log`     — system-written record (job status, audit) → read
 */
export type AccountingDoctypeKind = "voucher" | "master" | "ledger" | "log" | "tool";
export declare const ACTIONS_BY_KIND: {
    readonly voucher: readonly ["read", "write", "submit", "cancel"];
    readonly master: readonly ["read", "write"];
    readonly ledger: readonly ["read"];
    readonly log: readonly ["read"];
    readonly tool: readonly ["read", "submit"];
};
export type AccountingDoctype = {
    /** slug segment + `@@map` table name where one exists */
    key: string;
    kind: AccountingDoctypeKind;
    labelAr: string;
    labelEn: string;
    /** the phase task that introduces the doctype — the matrix is declared up front */
    phase: string;
    /** governing BRD section(s) */
    brd: string;
};
/**
 * The doctype registry. Declared for the whole core build (P0–P11) so roles can be
 * designed once rather than re-cut every phase; the [P2]-deferred extended pack (P12
 * — TDS, POS, dunning, subscriptions, reposting docs) is added when that phase lands.
 *
 * Reports are NOT separate doctypes: each financial report reads a ledger or a voucher and
 * is gated by that doctype's `read` (e.g. General Ledger / Trial Balance / Balance Sheet →
 * `accounting.gl_entry.read`, AR/AP ageing → `accounting.payment_ledger_entry.read`).
 */
export declare const ACCOUNTING_DOCTYPES: readonly [{
    readonly key: "gl_entry";
    readonly kind: "ledger";
    readonly labelAr: "قيود الأستاذ العام";
    readonly labelEn: "GL Entry";
    readonly phase: "P2.1";
    readonly brd: "§5.1";
}, {
    readonly key: "payment_ledger_entry";
    readonly kind: "ledger";
    readonly labelAr: "سجل الذمم";
    readonly labelEn: "Payment Ledger Entry";
    readonly phase: "P3.2";
    readonly brd: "§5.2";
}, {
    readonly key: "accounting_job";
    readonly kind: "log";
    readonly labelAr: "مهام المحاسبة الخلفية";
    readonly labelEn: "Accounting Job";
    readonly phase: "P0.5";
    readonly brd: "AR-7";
}, {
    readonly key: "voucher_demo";
    readonly kind: "voucher";
    readonly labelAr: "مستند تجريبي";
    readonly labelEn: "Voucher Demo";
    readonly phase: "P0.2";
    readonly brd: "AR-1";
}, {
    readonly key: "journal_entry";
    readonly kind: "voucher";
    readonly labelAr: "قيد يومية";
    readonly labelEn: "Journal Entry";
    readonly phase: "P2.4";
    readonly brd: "§7.1";
}, {
    readonly key: "sales_invoice";
    readonly kind: "voucher";
    readonly labelAr: "فاتورة مبيعات";
    readonly labelEn: "Sales Invoice";
    readonly phase: "P5.1";
    readonly brd: "§7.2";
}, {
    readonly key: "purchase_invoice";
    readonly kind: "voucher";
    readonly labelAr: "فاتورة مشتريات";
    readonly labelEn: "Purchase Invoice";
    readonly phase: "P6.1";
    readonly brd: "§7.3";
}, {
    readonly key: "payment_entry";
    readonly kind: "voucher";
    readonly labelAr: "سند قبض/صرف";
    readonly labelEn: "Payment Entry";
    readonly phase: "P7.1";
    readonly brd: "§7.4";
}, {
    readonly key: "cost_center_allocation";
    readonly kind: "voucher";
    readonly labelAr: "توزيع مراكز التكلفة";
    readonly labelEn: "Cost Center Allocation";
    readonly phase: "P1.6";
    readonly brd: "§4.4";
}, {
    readonly key: "exchange_rate_revaluation";
    readonly kind: "voucher";
    readonly labelAr: "إعادة تقييم أسعار الصرف";
    readonly labelEn: "Exchange Rate Revaluation";
    readonly phase: "P8.4";
    readonly brd: "FR-9.3";
}, {
    readonly key: "accounting_period";
    readonly kind: "voucher";
    readonly labelAr: "فترة محاسبية";
    readonly labelEn: "Accounting Period";
    readonly phase: "P10.1";
    readonly brd: "FR-12.2";
}, {
    readonly key: "period_closing_voucher";
    readonly kind: "voucher";
    readonly labelAr: "سند إقفال الفترة";
    readonly labelEn: "Period Closing Voucher";
    readonly phase: "P10.2";
    readonly brd: "FR-12.3";
}, {
    readonly key: "budget";
    readonly kind: "voucher";
    readonly labelAr: "الموازنة";
    readonly labelEn: "Budget";
    readonly phase: "P10.3";
    readonly brd: "§13";
}, {
    readonly key: "bank_transaction";
    readonly kind: "voucher";
    readonly labelAr: "حركة بنكية";
    readonly labelEn: "Bank Transaction";
    readonly phase: "P11.2";
    readonly brd: "§14";
}, {
    readonly key: "company_accounting_settings";
    readonly kind: "master";
    readonly labelAr: "الافتراضيات المحاسبية للمنشأة";
    readonly labelEn: "Company Accounting Defaults";
    readonly phase: "P0.1";
    readonly brd: "§4.1";
}, {
    readonly key: "accounts_settings";
    readonly kind: "master";
    readonly labelAr: "إعدادات الحسابات";
    readonly labelEn: "Accounts Settings";
    readonly phase: "P0.4";
    readonly brd: "§19";
}, {
    readonly key: "currency";
    readonly kind: "master";
    readonly labelAr: "العملات";
    readonly labelEn: "Currency";
    readonly phase: "P0.1";
    readonly brd: "§4.7";
}, {
    readonly key: "currency_exchange";
    readonly kind: "master";
    readonly labelAr: "أسعار الصرف";
    readonly labelEn: "Currency Exchange";
    readonly phase: "P1.8";
    readonly brd: "§4.7";
}, {
    readonly key: "account";
    readonly kind: "master";
    readonly labelAr: "دليل الحسابات";
    readonly labelEn: "Account";
    readonly phase: "P1.1";
    readonly brd: "§4.3";
}, {
    readonly key: "fiscal_year";
    readonly kind: "master";
    readonly labelAr: "السنة المالية";
    readonly labelEn: "Fiscal Year";
    readonly phase: "P1.4";
    readonly brd: "§4.2";
}, {
    readonly key: "cost_center";
    readonly kind: "master";
    readonly labelAr: "مراكز التكلفة";
    readonly labelEn: "Cost Center";
    readonly phase: "P1.5";
    readonly brd: "§4.4";
}, {
    readonly key: "mode_of_payment";
    readonly kind: "master";
    readonly labelAr: "طرق الدفع";
    readonly labelEn: "Mode of Payment";
    readonly phase: "P1.7";
    readonly brd: "§4.8";
}, {
    readonly key: "accounting_dimension";
    readonly kind: "master";
    readonly labelAr: "الأبعاد المحاسبية";
    readonly labelEn: "Accounting Dimension";
    readonly phase: "P1.9";
    readonly brd: "§4.5";
}, {
    readonly key: "finance_book";
    readonly kind: "master";
    readonly labelAr: "الدفاتر المالية";
    readonly labelEn: "Finance Book";
    readonly phase: "P1.10";
    readonly brd: "§4.6";
}, {
    readonly key: "party_account";
    readonly kind: "master";
    readonly labelAr: "حسابات الأطراف";
    readonly labelEn: "Party Account";
    readonly phase: "P3.1";
    readonly brd: "§4.10";
}, {
    readonly key: "payment_terms_template";
    readonly kind: "master";
    readonly labelAr: "قوالب شروط الدفع";
    readonly labelEn: "Payment Terms Template";
    readonly phase: "P3.5";
    readonly brd: "§4.9";
}, {
    readonly key: "sales_taxes_and_charges_template";
    readonly kind: "master";
    readonly labelAr: "قوالب ضرائب المبيعات";
    readonly labelEn: "Sales Taxes and Charges Template";
    readonly phase: "P4.1";
    readonly brd: "§4.11";
}, {
    readonly key: "purchase_taxes_and_charges_template";
    readonly kind: "master";
    readonly labelAr: "قوالب ضرائب المشتريات";
    readonly labelEn: "Purchase Taxes and Charges Template";
    readonly phase: "P4.1";
    readonly brd: "§4.11";
}, {
    readonly key: "item_tax_template";
    readonly kind: "master";
    readonly labelAr: "قوالب ضريبة الأصناف";
    readonly labelEn: "Item Tax Template";
    readonly phase: "P4.1";
    readonly brd: "§4.11";
}, {
    readonly key: "tax_category";
    readonly kind: "master";
    readonly labelAr: "فئات الضريبة";
    readonly labelEn: "Tax Category";
    readonly phase: "P4.1";
    readonly brd: "§4.11";
}, {
    readonly key: "tax_rule";
    readonly kind: "master";
    readonly labelAr: "قواعد الضريبة";
    readonly labelEn: "Tax Rule";
    readonly phase: "P4.1";
    readonly brd: "§4.11";
}, {
    readonly key: "bank";
    readonly kind: "master";
    readonly labelAr: "البنوك";
    readonly labelEn: "Bank";
    readonly phase: "P11.1";
    readonly brd: "§14";
}, {
    readonly key: "bank_account";
    readonly kind: "master";
    readonly labelAr: "الحسابات البنكية";
    readonly labelEn: "Bank Account";
    readonly phase: "P11.1";
    readonly brd: "§14";
}, {
    readonly key: "insurer";
    readonly kind: "master";
    readonly labelAr: "شركات التأمين";
    readonly labelEn: "Insurer";
    readonly phase: "MI-P0";
    readonly brd: "MI §8.1";
}, {
    readonly key: "insurance_product";
    readonly kind: "master";
    readonly labelAr: "منتجات التأمين";
    readonly labelEn: "Insurance Product";
    readonly phase: "MI-P3";
    readonly brd: "MI §8.2";
}, {
    readonly key: "patient_policy";
    readonly kind: "master";
    readonly labelAr: "بوالص الأطفال";
    readonly labelEn: "Patient Policy";
    readonly phase: "MI-P3";
    readonly brd: "MI §8.3";
}, {
    readonly key: "insurance_claim";
    readonly kind: "voucher";
    readonly labelAr: "المطالبات التأمينية";
    readonly labelEn: "Insurance Claim";
    readonly phase: "MI-P4";
    readonly brd: "MI §9.2";
}, {
    readonly key: "membership_plan";
    readonly kind: "master";
    readonly labelAr: "خطط العضويات";
    readonly labelEn: "Membership Plan";
    readonly phase: "MI-P1";
    readonly brd: "MI §4.1";
}, {
    readonly key: "membership";
    readonly kind: "voucher";
    readonly labelAr: "العضويات";
    readonly labelEn: "Membership";
    readonly phase: "MI-P1";
    readonly brd: "MI §5";
}, {
    readonly key: "opening_invoice_creation_tool";
    readonly kind: "tool";
    readonly labelAr: "أداة فواتير الافتتاح";
    readonly labelEn: "Opening Invoice Creation Tool";
    readonly phase: "P12A.1";
    readonly brd: "FR-17.3";
}, {
    readonly key: "clinic_invoice";
    readonly kind: "voucher";
    readonly labelAr: "فاتورة أكاديمية (محول)";
    readonly labelEn: "Clinic Invoice (adapter)";
    readonly phase: "P12A.2";
    readonly brd: "§C3";
}, {
    readonly key: "expense";
    readonly kind: "voucher";
    readonly labelAr: "مصروف تشغيلي (محول)";
    readonly labelEn: "Operational Expense (adapter)";
    readonly phase: "P12A.2";
    readonly brd: "§C3";
}, {
    readonly key: "adapter_posting";
    readonly kind: "tool";
    readonly labelAr: "ترحيلات المحولات";
    readonly labelEn: "Adapter Postings";
    readonly phase: "P12A.2";
    readonly brd: "§C3";
}];
export type AccountingDoctypeKey = (typeof ACCOUNTING_DOCTYPES)[number]["key"];
export declare function findAccountingDoctype(key: string): AccountingDoctype | undefined;
/** The permission slug for a doctype action, e.g. `accounting.journal_entry.submit`. */
export declare function accountingPermission(doctype: AccountingDoctypeKey, action: AccountingAction): string;
/** Whether a doctype's kind exposes this action at all (JE can submit, Account cannot). */
export declare function doctypeSupportsAction(doctype: AccountingDoctypeKey, action: AccountingAction): boolean;
/**
 * Special roles (BRD NFR-5). ERPNext models these as named roles; this repo has no global
 * role registry (clinic-defined `StaffRole` rows only), so each maps to a permission slug
 * that any staff role may be granted — the mapping recorded per standing rule #4.
 */
export declare const ACCOUNTING_ROLES: {
    /** Post/cancel on or before `accounts_frozen_upto` (BRD FR-12.1) — enforced in P2.8. */
    readonly FROZEN_ACCOUNTS_MODIFIER: "accounting.role.frozen_accounts_modifier";
    /** Transact for a frozen party / bypass credit limit (BRD BR-4.10.3) — P3/P5. */
    readonly CREDIT_CONTROLLER: "accounting.role.credit_controller";
    /** Bill beyond `over_billing_allowance` (BRD §19) — P5/P6. */
    readonly OVER_BILLING: "accounting.role.over_billing";
    /** Run Repost Accounting Ledger on submitted docs (BRD FR-6.9) — P12.9. */
    readonly REPOST: "accounting.role.repost";
};
export type AccountingRole = (typeof ACCOUNTING_ROLES)[keyof typeof ACCOUNTING_ROLES];
export declare const ALL_ACCOUNTING_ROLES: AccountingRole[];
/** Arabic/English labels for the special roles (for the roles editor + API docs). */
export declare const ACCOUNTING_ROLE_LABELS: Record<AccountingRole, {
    ar: string;
    en: string;
}>;
/** Every accounting slug: the full doctype×action matrix plus the four special roles. */
export declare const ALL_ACCOUNTING_PERMISSIONS: string[];
