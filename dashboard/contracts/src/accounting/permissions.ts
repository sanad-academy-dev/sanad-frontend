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
export const ACCOUNTING_ACTIONS = ["read", "write", "submit", "cancel"] as const;
export type AccountingAction = (typeof ACCOUNTING_ACTIONS)[number];

/**
 * What a doctype is, which fixes the actions it can grant:
 * - `voucher` — submittable document with the AR-1 lifecycle → read/write/submit/cancel
 * - `master`  — reference data, no docstatus → read/write
 * - `ledger`  — append-only ledger written only by the posting engine → read
 * - `log`     — system-written record (job status, audit) → read
 */
export type AccountingDoctypeKind = "voucher" | "master" | "ledger" | "log" | "tool";

export const ACTIONS_BY_KIND = {
	voucher: ["read", "write", "submit", "cancel"],
	master: ["read", "write"],
	ledger: ["read"],
	log: ["read"],
	// [P12A-fix] process TOOLS read their state and RUN — "submit" gates the run that
	// posts documents. Registering a runnable tool as `log` made its POST unreachable for
	// every user (doctypeSupportsAction is checked BEFORE the ADMIN bypass), which is how
	// both P12A marquee features shipped 403 for everyone.
	tool: ["read", "submit"],
} as const satisfies Record<AccountingDoctypeKind, readonly AccountingAction[]>;

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
export const ACCOUNTING_DOCTYPES = [
	// ── ledgers (BRD §5) ────────────────────────────────────────────────────────────────
	{
		key: "gl_entry",
		kind: "ledger",
		labelAr: "قيود الأستاذ العام",
		labelEn: "GL Entry",
		phase: "P2.1",
		brd: "§5.1",
	},
	{
		key: "payment_ledger_entry",
		kind: "ledger",
		labelAr: "سجل الذمم",
		labelEn: "Payment Ledger Entry",
		phase: "P3.2",
		brd: "§5.2",
	},

	// ── logs (system-written) ───────────────────────────────────────────────────────────
	{
		key: "accounting_job",
		kind: "log",
		labelAr: "مهام المحاسبة الخلفية",
		labelEn: "Accounting Job",
		phase: "P0.5",
		brd: "AR-7",
	},

	// ── vouchers (BRD §7, §12, §13, §14) ────────────────────────────────────────────────
	{
		key: "voucher_demo",
		kind: "voucher",
		labelAr: "مستند تجريبي",
		labelEn: "Voucher Demo",
		phase: "P0.2",
		brd: "AR-1",
	},
	{
		key: "journal_entry",
		kind: "voucher",
		labelAr: "قيد يومية",
		labelEn: "Journal Entry",
		phase: "P2.4",
		brd: "§7.1",
	},
	{
		key: "sales_invoice",
		kind: "voucher",
		labelAr: "فاتورة مبيعات",
		labelEn: "Sales Invoice",
		phase: "P5.1",
		brd: "§7.2",
	},
	{
		key: "purchase_invoice",
		kind: "voucher",
		labelAr: "فاتورة مشتريات",
		labelEn: "Purchase Invoice",
		phase: "P6.1",
		brd: "§7.3",
	},
	{
		key: "payment_entry",
		kind: "voucher",
		labelAr: "سند قبض/صرف",
		labelEn: "Payment Entry",
		phase: "P7.1",
		brd: "§7.4",
	},
	{
		key: "cost_center_allocation",
		kind: "voucher",
		labelAr: "توزيع مراكز التكلفة",
		labelEn: "Cost Center Allocation",
		phase: "P1.6",
		brd: "§4.4",
	},
	{
		key: "exchange_rate_revaluation",
		kind: "voucher",
		labelAr: "إعادة تقييم أسعار الصرف",
		labelEn: "Exchange Rate Revaluation",
		phase: "P8.4",
		brd: "FR-9.3",
	},
	{
		key: "accounting_period",
		kind: "voucher",
		labelAr: "فترة محاسبية",
		labelEn: "Accounting Period",
		phase: "P10.1",
		brd: "FR-12.2",
	},
	{
		key: "period_closing_voucher",
		kind: "voucher",
		labelAr: "سند إقفال الفترة",
		labelEn: "Period Closing Voucher",
		phase: "P10.2",
		brd: "FR-12.3",
	},
	{
		key: "budget",
		kind: "voucher",
		labelAr: "الموازنة",
		labelEn: "Budget",
		phase: "P10.3",
		brd: "§13",
	},
	{
		key: "bank_transaction",
		kind: "voucher",
		labelAr: "حركة بنكية",
		labelEn: "Bank Transaction",
		phase: "P11.2",
		brd: "§14",
	},

	// ── masters (BRD §4) ────────────────────────────────────────────────────────────────
	{
		key: "company_accounting_settings",
		kind: "master",
		labelAr: "الافتراضيات المحاسبية للمنشأة",
		labelEn: "Company Accounting Defaults",
		phase: "P0.1",
		brd: "§4.1",
	},
	{
		key: "accounts_settings",
		kind: "master",
		labelAr: "إعدادات الحسابات",
		labelEn: "Accounts Settings",
		phase: "P0.4",
		brd: "§19",
	},
	{
		key: "currency",
		kind: "master",
		labelAr: "العملات",
		labelEn: "Currency",
		phase: "P0.1",
		brd: "§4.7",
	},
	{
		key: "currency_exchange",
		kind: "master",
		labelAr: "أسعار الصرف",
		labelEn: "Currency Exchange",
		phase: "P1.8",
		brd: "§4.7",
	},
	{
		key: "account",
		kind: "master",
		labelAr: "دليل الحسابات",
		labelEn: "Account",
		phase: "P1.1",
		brd: "§4.3",
	},
	{
		key: "fiscal_year",
		kind: "master",
		labelAr: "السنة المالية",
		labelEn: "Fiscal Year",
		phase: "P1.4",
		brd: "§4.2",
	},
	{
		key: "cost_center",
		kind: "master",
		labelAr: "مراكز التكلفة",
		labelEn: "Cost Center",
		phase: "P1.5",
		brd: "§4.4",
	},
	{
		key: "mode_of_payment",
		kind: "master",
		labelAr: "طرق الدفع",
		labelEn: "Mode of Payment",
		phase: "P1.7",
		brd: "§4.8",
	},
	{
		key: "accounting_dimension",
		kind: "master",
		labelAr: "الأبعاد المحاسبية",
		labelEn: "Accounting Dimension",
		phase: "P1.9",
		brd: "§4.5",
	},
	{
		key: "finance_book",
		kind: "master",
		labelAr: "الدفاتر المالية",
		labelEn: "Finance Book",
		phase: "P1.10",
		brd: "§4.6",
	},
	{
		key: "party_account",
		kind: "master",
		labelAr: "حسابات الأطراف",
		labelEn: "Party Account",
		phase: "P3.1",
		brd: "§4.10",
	},
	{
		key: "payment_terms_template",
		kind: "master",
		labelAr: "قوالب شروط الدفع",
		labelEn: "Payment Terms Template",
		phase: "P3.5",
		brd: "§4.9",
	},
	{
		key: "sales_taxes_and_charges_template",
		kind: "master",
		labelAr: "قوالب ضرائب المبيعات",
		labelEn: "Sales Taxes and Charges Template",
		phase: "P4.1",
		brd: "§4.11",
	},
	{
		key: "purchase_taxes_and_charges_template",
		kind: "master",
		labelAr: "قوالب ضرائب المشتريات",
		labelEn: "Purchase Taxes and Charges Template",
		phase: "P4.1",
		brd: "§4.11",
	},
	{
		key: "item_tax_template",
		kind: "master",
		labelAr: "قوالب ضريبة الأصناف",
		labelEn: "Item Tax Template",
		phase: "P4.1",
		brd: "§4.11",
	},
	{
		key: "tax_category",
		kind: "master",
		labelAr: "فئات الضريبة",
		labelEn: "Tax Category",
		phase: "P4.1",
		brd: "§4.11",
	},
	{
		key: "tax_rule",
		kind: "master",
		labelAr: "قواعد الضريبة",
		labelEn: "Tax Rule",
		phase: "P4.1",
		brd: "§4.11",
	},
	{
		key: "bank",
		kind: "master",
		labelAr: "البنوك",
		labelEn: "Bank",
		phase: "P11.1",
		brd: "§14",
	},
	{
		key: "bank_account",
		kind: "master",
		labelAr: "الحسابات البنكية",
		labelEn: "Bank Account",
		phase: "P11.1",
		brd: "§14",
	},
	{
		// [MI-P0] registered ahead of its MI-P3 routes (owner decision, MI-P0 Q1) —
		// data-only and inert until endpoints exist; rule-12 403 tests land with them
		key: "insurer",
		kind: "master",
		labelAr: "شركات التأمين",
		labelEn: "Insurer",
		phase: "MI-P0",
		brd: "MI §8.1",
	},
	{
		key: "insurance_product",
		kind: "master",
		labelAr: "منتجات التأمين",
		labelEn: "Insurance Product",
		phase: "MI-P3",
		brd: "MI §8.2",
	},
	{
		key: "patient_policy",
		kind: "master",
		labelAr: "بوالص الأطفال",
		labelEn: "Patient Policy",
		phase: "MI-P3",
		brd: "MI §8.3",
	},
	{
		// [MI-P4] §13: read/write/submit/cancel — شبه سند (CLM- عند الإرسال، C7)
		key: "insurance_claim",
		kind: "voucher",
		labelAr: "المطالبات التأمينية",
		labelEn: "Insurance Claim",
		phase: "MI-P4",
		brd: "MI §9.2",
	},
	{
		key: "membership_plan",
		kind: "master",
		labelAr: "خطط العضويات",
		labelEn: "Membership Plan",
		phase: "MI-P1",
		brd: "MI §4.1",
	},
	{
		// [MI-P1] §13 grants membership read/write/cancel. Registered as `voucher` because
		// `master` cannot grant cancel (ACTIONS_BY_KIND) and cancel-with-reason is a real
		// lifecycle action here (BR-M5.2.1); `submit` gates the daily-run endpoint, the
		// same way subscriptions gate /run behind a submit slug.
		key: "membership",
		kind: "voucher",
		labelAr: "العضويات",
		labelEn: "Membership",
		phase: "MI-P1",
		brd: "MI §5",
	},
	{
		// a process tool, not a document — "submit" gates the mass-create-and-submit run
		key: "opening_invoice_creation_tool",
		kind: "tool",
		labelAr: "أداة فواتير الافتتاح",
		labelEn: "Opening Invoice Creation Tool",
		phase: "P12A.1",
		brd: "FR-17.3",
	},
	{
		// [P12A.2] §C3 — adapter-posted GLEs carry this voucherType, so accounting
		// periods can close it like any voucher
		key: "clinic_invoice",
		kind: "voucher",
		labelAr: "فاتورة أكاديمية (محول)",
		labelEn: "Clinic Invoice (adapter)",
		phase: "P12A.2",
		brd: "§C3",
	},
	{
		key: "expense",
		kind: "voucher",
		labelAr: "مصروف تشغيلي (محول)",
		labelEn: "Operational Expense (adapter)",
		phase: "P12A.2",
		brd: "§C3",
	},
	{
		// run-control + zero-diff report permissions; "submit" gates a posting run
		key: "adapter_posting",
		kind: "tool",
		labelAr: "ترحيلات المحولات",
		labelEn: "Adapter Postings",
		phase: "P12A.2",
		brd: "§C3",
	},
] as const satisfies readonly AccountingDoctype[];

export type AccountingDoctypeKey = (typeof ACCOUNTING_DOCTYPES)[number]["key"];

const DOCTYPE_BY_KEY = new Map<string, AccountingDoctype>(
	ACCOUNTING_DOCTYPES.map((d) => [d.key, d]),
);

export function findAccountingDoctype(key: string): AccountingDoctype | undefined {
	return DOCTYPE_BY_KEY.get(key);
}

/** The permission slug for a doctype action, e.g. `accounting.journal_entry.submit`. */
export function accountingPermission(
	doctype: AccountingDoctypeKey,
	action: AccountingAction,
): string {
	return `accounting.${doctype}.${action}`;
}

/** Whether a doctype's kind exposes this action at all (JE can submit, Account cannot). */
export function doctypeSupportsAction(
	doctype: AccountingDoctypeKey,
	action: AccountingAction,
): boolean {
	const entry = DOCTYPE_BY_KEY.get(doctype);
	if (!entry) return false;
	return (ACTIONS_BY_KIND[entry.kind] as readonly AccountingAction[]).includes(action);
}

/**
 * Special roles (BRD NFR-5). ERPNext models these as named roles; this repo has no global
 * role registry (clinic-defined `StaffRole` rows only), so each maps to a permission slug
 * that any staff role may be granted — the mapping recorded per standing rule #4.
 */
export const ACCOUNTING_ROLES = {
	/** Post/cancel on or before `accounts_frozen_upto` (BRD FR-12.1) — enforced in P2.8. */
	FROZEN_ACCOUNTS_MODIFIER: "accounting.role.frozen_accounts_modifier",
	/** Transact for a frozen party / bypass credit limit (BRD BR-4.10.3) — P3/P5. */
	CREDIT_CONTROLLER: "accounting.role.credit_controller",
	/** Bill beyond `over_billing_allowance` (BRD §19) — P5/P6. */
	OVER_BILLING: "accounting.role.over_billing",
	/** Run Repost Accounting Ledger on submitted docs (BRD FR-6.9) — P12.9. */
	REPOST: "accounting.role.repost",
} as const;

export type AccountingRole = (typeof ACCOUNTING_ROLES)[keyof typeof ACCOUNTING_ROLES];

export const ALL_ACCOUNTING_ROLES = Object.values(ACCOUNTING_ROLES) as AccountingRole[];

/** Arabic/English labels for the special roles (for the roles editor + API docs). */
export const ACCOUNTING_ROLE_LABELS: Record<AccountingRole, { ar: string; en: string }> = {
	[ACCOUNTING_ROLES.FROZEN_ACCOUNTS_MODIFIER]: {
		ar: "تعديل الفترات المجمّدة",
		en: "Frozen Accounts Modifier",
	},
	[ACCOUNTING_ROLES.CREDIT_CONTROLLER]: {
		ar: "مراقب الائتمان",
		en: "Credit Controller",
	},
	[ACCOUNTING_ROLES.OVER_BILLING]: {
		ar: "تجاوز حد الفوترة",
		en: "Over Billing",
	},
	[ACCOUNTING_ROLES.REPOST]: {
		ar: "إعادة ترحيل القيود",
		en: "Repost Accounting Ledger",
	},
};

/** Every accounting slug: the full doctype×action matrix plus the four special roles. */
export const ALL_ACCOUNTING_PERMISSIONS: string[] = [
	...ACCOUNTING_DOCTYPES.flatMap((doctype) =>
		ACTIONS_BY_KIND[doctype.kind].map((action) => accountingPermission(doctype.key, action)),
	),
	...ALL_ACCOUNTING_ROLES,
];
