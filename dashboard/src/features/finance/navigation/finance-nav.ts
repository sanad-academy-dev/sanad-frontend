import {
	IconArrowsExchange,
	IconArrowsSplit,
	IconBook2,
	IconBuildingBank,
	IconCalendarDollar,
	IconCalendarStats,
	IconCash,
	IconCashBanknote,
	IconChecklist,
	IconCoins,
	IconExchange,
	IconFileDollar,
	IconFileInvoice,
	IconFileShredder,
	IconHeartHandshake,
	IconHierarchy,
	IconHourglass,
	IconIdBadge2,
	IconReceipt2,
	IconReceiptTax,
	IconRepeat,
	IconReportAnalytics,
	IconReportMoney,
	IconReportSearch,
	IconRosetteDiscount,
	IconScale,
	IconSettings,
	IconShieldCog,
	IconShoppingCart,
	IconSitemap,
	IconUsersGroup,
	IconWand,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { FINANCE_RESOURCES, type FinanceResource, PERMISSIONS } from "@/lib/permissions";
import type { AccountingDoctypeKey } from "@sanad/contracts/accounting/permissions";
import { accountingPermission } from "@sanad/contracts/accounting/permissions";

/**
 * THE finance navigation config — the single place every money destination is declared,
 * legacy operational-billing and double-entry accounting alike. The main sidebar's one
 * «المالية» entry and the workspace header (`finance-workspace-header.tsx`, mounted through
 * the area layout by BOTH `finance.tsx` and `accounting.tsx`) render from this array;
 * nothing else may declare a money link.
 *
 * Structure is workflow-first (contract §10 as amended by [NAV-2]): four groups — daily
 * operations, books, reports, settings — rendered as Level-1 sub-workspaces in the header,
 * each group's items as Level-2 tabs. Later phases APPEND items to an existing group; the
 * contract fixes which group each P2–P12 destination joins, so placement is never
 * re-decided per phase.
 *
 * Two gate kinds, because the two halves authenticate differently and neither is being
 * rewritten in v1 (contract C3 strangler pattern):
 *  - `accounting` → `accounting.{doctype}.read`, the same doctype the route's API enforces;
 *  - `resource`   → the repo's `canView(resource)` view-level model, for the legacy screens.
 */
export type FinanceNavGate =
	| { kind: "accounting"; doctype: AccountingDoctypeKey }
	| { kind: "resource"; resource: FinanceResource }
	/**
	 * [LY-P0] بوابةٌ على **صلاحية مباشرة** من كتالوج المكتب الأمامي.
	 *
	 * لماذا نوعٌ ثالث: وحدة الولاء تقع في هذا التجميع (BRD §10.1) وصلاحياتها أماميّة لا
	 * محاسبية (§12) — فلا `doctype` لها. والنوع `resource` لا يصلح بديلًا: `FinanceResource`
	 * قائمةٌ مغلقة، وكل عضوٍ فيها يدخل تلقائيًا في `FINANCE_DEFAULT_GRANT` الممنوح لكل دورٍ
	 * قائم — فإضافة الولاء إليها كانت ستمنح رؤيته للجميع، وهو نقيض مرساة §12 (المنح مقصور
	 * على من يحمل `patients_owners.edit`).
	 */
	| { kind: "permission"; permission: string };

export type FinanceNavItem = {
	/** i18n key under `finance.nav.*` / `accounting.nav.*` */
	titleKey: string;
	url: string;
	/**
	 * Search params for hub destinations. The legacy finance screen is ONE route with a tab
	 * strip, so its four destinations are addressed by `?tab=` — deep-linkable without the
	 * route churn a split would cost (see the contract's cleanup list).
	 */
	search?: Record<string, string>;
	icon: ComponentType<{ className?: string }>;
	gate: FinanceNavGate;
};

export type FinanceNavGroupKey =
	| "dailyOperations"
	| "membershipInsurance"
	| "loyalty"
	| "books"
	| "reports"
	| "settings";

export type FinanceNavGroup = {
	/** stable key — the workspace store and active-group resolution address groups by it */
	key: FinanceNavGroupKey;
	/** i18n key under `finance.nav.groups.*` */
	titleKey: string;
	items: FinanceNavItem[];
};

const FINANCE_ROUTE = "/management/finance";

/** [NAV-4] «إعدادات المحاسبة» inside the workspace; `/management/settings/accounts` redirects here. */
export const ACCOUNTING_SETTINGS_URL = "/management/accounting/settings";

export const FINANCE_NAV_GROUPS: FinanceNavGroup[] = [
	{
		key: "dailyOperations",
		titleKey: "finance.nav.groups.dailyOperations",
		items: [
			{
				titleKey: "finance.nav.invoices",
				url: FINANCE_ROUTE,
				search: { tab: "invoices" },
				icon: IconFileInvoice,
				gate: { kind: "resource", resource: FINANCE_RESOURCES.invoices },
			},
			{
				titleKey: "finance.nav.expenses",
				url: FINANCE_ROUTE,
				search: { tab: "expenses" },
				icon: IconReceipt2,
				gate: { kind: "resource", resource: FINANCE_RESOURCES.expenses },
			},
			{
				titleKey: "finance.nav.carePlans",
				url: FINANCE_ROUTE,
				search: { tab: "care-plans" },
				icon: IconHeartHandshake,
				gate: { kind: "resource", resource: FINANCE_RESOURCES.carePlans },
			},
			{
				titleKey: "finance.nav.enrollments",
				url: FINANCE_ROUTE,
				search: { tab: "enrollments" },
				icon: IconRepeat,
				gate: { kind: "resource", resource: FINANCE_RESOURCES.carePlans },
			},
			{
				// [P5.7] «فواتير المبيعات» (المحاسبية) joins العمليات اليومية per the §10.3
				// placement law — contract C3: the legacy operational invoices keep their tab
				titleKey: "accounting.nav.salesInvoices",
				url: "/management/accounting/sales-invoices",
				icon: IconFileDollar,
				gate: { kind: "accounting", doctype: "sales_invoice" },
			},
			{
				// [P6.5] «فواتير المشتريات» joins العمليات اليومية per the §10.3 placement law —
				// contract C3: the legacy «المصروفات» expense tab is untouched
				titleKey: "accounting.nav.purchaseInvoices",
				url: "/management/accounting/purchase-invoices",
				icon: IconShoppingCart,
				gate: { kind: "accounting", doctype: "purchase_invoice" },
			},
			{
				// [P7.9] «سندات القبض والصرف» joins العمليات اليومية per the owner directive
				titleKey: "accounting.nav.paymentEntries",
				url: "/management/accounting/payment-entries",
				icon: IconCashBanknote,
				gate: { kind: "accounting", doctype: "payment_entry" },
			},
			{
				// [P7.9] «تسوية المدفوعات» — placement judgment (logged): it is day-to-day
				// cash matching work, so it sits beside the vouchers it matches, not in
				// reports (it WRITES settlement; reports only read)
				titleKey: "accounting.nav.paymentReconciliation",
				url: "/management/accounting/payment-reconciliation",
				icon: IconArrowsExchange,
				gate: { kind: "accounting", doctype: "payment_entry" },
			},
			{
				// [P11.3] «التسوية البنكية» — daily cash matching sits beside تسوية المدفوعات (§10.3)
				titleKey: "accounting.nav.bankReconciliation",
				url: "/management/accounting/bank-reconciliation",
				icon: IconBuildingBank,
				gate: { kind: "accounting", doctype: "bank_transaction" },
			},
			{
				// [P11.4] «مقاصة البنك» — placement judgment (logged): it WRITES clearance stamps
				// on the vouchers, so it sits in العمليات اليومية beside التسوية البنكية, not in
				// reports (same judgment as تسوية المدفوعات — reports only read)
				titleKey: "accounting.nav.bankClearance",
				url: "/management/accounting/bank-clearance",
				icon: IconChecklist,
				gate: { kind: "accounting", doctype: "bank_transaction" },
			},
			{
				// [P12A.3] «قواعد البنك» — placement judgment (logged): the FR-14.3 rules
				// automate the daily bank-rec sweep, so they sit in العمليات اليومية beside
				// التسوية البنكية they feed; the screen itself banners while the §19 engine
				// flag is off
				titleKey: "accounting.nav.bankRules",
				url: "/management/accounting/bank-rules",
				icon: IconWand,
				gate: { kind: "accounting", doctype: "bank_transaction" },
			},
		],
	},
	{
		/**
		 * [MI-NAV] «العضويات والتأمين» — the module's OWN group (MI BRD §11 as amended,
		 * §17.2 row 10, owner 2026-08-24).
		 *
		 * §11 used to say «no new sidebar groups» and these three screens sat among the
		 * العمليات اليومية tabs. The owner overruled that: MI is a full module and gets
		 * module-level navigation, the way grooming and nutrition surface. Two things fall
		 * out of the move, both wanted — «المطالبات التأمينية» is no longer buried under the
		 * «المزيد» overflow (it was the 7th item against `MAX_VISIBLE_TABS = 6`), and daily
		 * operations drops back inside that cap.
		 *
		 * Gating is the ordinary mechanism, not a new one: each item hides on its own doctype
		 * read, and the group itself disappears for anyone holding none of them because
		 * `visibleGroupsFor` drops empty groups. The §12 reports stay in «التقارير المالية»
		 * with the other financial reports.
		 */
		key: "membershipInsurance",
		titleKey: "finance.nav.groups.membershipInsurance",
		items: [
			{
				titleKey: "accounting.nav.memberships",
				url: "/management/accounting/memberships",
				search: { tab: "members" },
				icon: IconIdBadge2,
				gate: { kind: "accounting", doctype: "membership" },
			},
			{
				// the hub's own three tabs (بوالص الأطفال / المنتجات / الشركات) are unchanged
				titleKey: "accounting.nav.insurance",
				url: "/management/accounting/insurance",
				search: { tab: "policies" },
				icon: IconShieldCog,
				gate: { kind: "accounting", doctype: "patient_policy" },
			},
			{
				// still visually distinct from the accounting «المطالبات» (dunning) — two
				// different documents, per the §11 naming warning
				titleKey: "accounting.nav.insuranceClaims",
				url: "/management/accounting/insurance-claims",
				icon: IconFileShredder,
				gate: { kind: "accounting", doctype: "insurance_claim" },
			},
		],
	},
	{
		key: "loyalty",
		titleKey: "finance.nav.groups.loyalty",
		items: [
			{
				// [LY-P0] §10.2 — قواعد البرنامج ومستوياته ومفتاح الوحدة.
				// «حركة النقاط» (§10.1) تصل مع الدفتر في LY-P1؛ صفٌّ يشير إلى مسارٍ غير
				// موجود ليس عنصرًا نائبًا بل ٤٠٤ يجده المستخدم قبلنا.
				titleKey: "loyalty.nav.program",
				url: "/management/loyalty-program",
				icon: IconRosetteDiscount,
				gate: { kind: "permission", permission: PERMISSIONS.LOYALTY_SETTINGS_VIEW_FULL },
			},
			{
				// [LY-P5] §10.5 — كشف الحركة عبر أولياء الأمور، ومعه التسوية اليدوية (BR-L9.2)
				titleKey: "loyalty.nav.ledger",
				url: "/management/loyalty-ledger",
				icon: IconCoins,
				gate: { kind: "permission", permission: PERMISSIONS.LOYALTY_LEDGER_VIEW_FULL },
			},
			{
				// [LY-P4] §11.1/§11.2 — الالتزام القائم وحركة النقاط. خلف صلاحية الدفتر
				// لا الإعدادات: التقريران يجمعان أرصدة كل أولياء الأمور.
				titleKey: "loyalty.nav.reports",
				url: "/management/loyalty-reports",
				icon: IconReportAnalytics,
				gate: { kind: "permission", permission: PERMISSIONS.LOYALTY_LEDGER_VIEW_FULL },
			},
		],
	},
	{
		key: "books",
		titleKey: "finance.nav.groups.books",
		items: [
			{
				titleKey: "accounting.nav.journalEntries",
				url: "/management/accounting/journal-entries",
				icon: IconBook2,
				gate: { kind: "accounting", doctype: "journal_entry" },
			},
			{
				// [P8.4] «إعادة تقييم العملات» — placement judgment (logged): a period-end
				// BOOK-revaluation instrument whose output IS a journal entry, so it sits
				// in الدفاتر beside قيود اليومية rather than in daily cash operations
				titleKey: "accounting.nav.revaluations",
				url: "/management/accounting/revaluations",
				icon: IconScale,
				gate: { kind: "accounting", doctype: "exchange_rate_revaluation" },
			},
			{
				titleKey: "accounting.nav.accounts",
				url: "/management/accounting/accounts",
				icon: IconSitemap,
				gate: { kind: "accounting", doctype: "account" },
			},
			{
				titleKey: "accounting.nav.costCenters",
				url: "/management/accounting/cost-centers",
				icon: IconHierarchy,
				gate: { kind: "accounting", doctype: "cost_center" },
			},
			{
				titleKey: "accounting.nav.costCenterAllocations",
				url: "/management/accounting/cost-center-allocations",
				icon: IconArrowsSplit,
				gate: { kind: "accounting", doctype: "cost_center_allocation" },
			},
			{
				// [P3.1] «حسابات الأطراف» joins الدفاتر per the contract §10.3 placement law
				titleKey: "accounting.nav.parties",
				url: "/management/accounting/parties",
				icon: IconUsersGroup,
				gate: { kind: "accounting", doctype: "party_account" },
			},
			{
				// [P11.1] «البنوك والحسابات البنكية» — §14 masters live in الدفاتر beside
				// دليل الحسابات per the §10.3 placement law
				titleKey: "accounting.nav.banks",
				url: "/management/accounting/banks",
				icon: IconBuildingBank,
				gate: { kind: "accounting", doctype: "bank" },
			},
		],
	},
	{
		key: "reports",
		titleKey: "finance.nav.groups.reports",
		items: [
			{
				// [P9.5] «القوائم المالية» — the §18.1 statements join التقارير المالية (§10.3)
				titleKey: "accounting.nav.financialStatements",
				url: "/management/accounting/financial-statements",
				icon: IconReportMoney,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				// [P9.5] «أعمار الذمم» — §18.3 on the PLE
				titleKey: "accounting.nav.receivables",
				url: "/management/accounting/receivables",
				icon: IconHourglass,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				titleKey: "accounting.nav.generalLedger",
				url: "/management/accounting/general-ledger",
				icon: IconReportAnalytics,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				titleKey: "accounting.nav.trialBalance",
				url: "/management/accounting/trial-balance",
				icon: IconScale,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				// [MI-P6] MI §12 FR-R12.1 — the claims register REPORT (ageing vs settlementDays);
				// the operational «المطالبات التأمينية» list stays in العمليات اليومية
				titleKey: "accounting.nav.insuranceClaimsRegister",
				url: "/management/accounting/insurance-claims-register",
				icon: IconFileShredder,
				gate: { kind: "accounting", doctype: "insurance_claim" },
			},
			{
				// [MI-P6] MI §12 FR-R12.3
				titleKey: "accounting.nav.membershipRevenue",
				url: "/management/accounting/membership-revenue",
				icon: IconReportMoney,
				gate: { kind: "accounting", doctype: "membership" },
			},
			{
				// [MI-P6] MI §12 FR-R12.4
				titleKey: "accounting.nav.benefitUsage",
				url: "/management/accounting/benefit-usage",
				icon: IconReportAnalytics,
				gate: { kind: "accounting", doctype: "membership" },
			},
			{
				// [P3.6] «ميزان مراجعة الأطراف» joins التقارير المالية per §10.3
				titleKey: "accounting.nav.partyTrialBalance",
				url: "/management/accounting/party-trial-balance",
				icon: IconUsersGroup,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				// [P3.6] «سجل الذمم» audit joins التقارير المالية per §10.3
				titleKey: "accounting.nav.paymentLedger",
				url: "/management/accounting/payment-ledger",
				icon: IconReceipt2,
				gate: { kind: "accounting", doctype: "payment_ledger_entry" },
			},
			{
				// [P5.8] §18.4 registers join التقارير المالية per §10.3 (invoice-level +
				// item-wise share ONE tab with an in-page pill strip — §7.8 hub rule)
				titleKey: "accounting.nav.salesRegister",
				url: "/management/accounting/sales-register",
				icon: IconFileDollar,
				gate: { kind: "accounting", doctype: "sales_invoice" },
			},
			{
				// [P6.5] «سجل المشتريات» joins التقارير المالية per §10.3 — same one-tab +
				// in-page pill strip shape as the sales register
				titleKey: "accounting.nav.purchaseRegister",
				url: "/management/accounting/purchase-register",
				icon: IconShoppingCart,
				gate: { kind: "accounting", doctype: "purchase_invoice" },
			},
			{
				// [P7.9] payment reports (فترات السداد + ملخص المقبوضات) — one tab, in-page pills
				titleKey: "accounting.nav.paymentReports",
				url: "/management/accounting/payment-reports",
				icon: IconReportMoney,
				gate: { kind: "accounting", doctype: "payment_entry" },
			},
			{
				// [P9.4] «تحليلات الدفاتر» — party summaries + gross profit + trends + debug pair
				titleKey: "accounting.nav.ledgerAnalytics",
				url: "/management/accounting/ledger-analytics",
				icon: IconReportSearch,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				// [P11.4] the §18 bank reports (كشف التسوية البنكية + ملخص المقاصة) join
				// التقارير المالية per §10.3 — one tab, in-page pills (§7.8 hub rule)
				titleKey: "accounting.nav.bankReports",
				url: "/management/accounting/bank-reports",
				icon: IconBuildingBank,
				gate: { kind: "accounting", doctype: "gl_entry" },
			},
			{
				// [P12A.2e] «تقرير المطابقة» — the §C3 parallel-run zero-diff report joins
				// التقارير المالية per §10.3; it gates the external pilot (adapter DoD)
				titleKey: "accounting.nav.adapterReconciliation",
				url: "/management/accounting/adapter-reconciliation",
				icon: IconArrowsExchange,
				gate: { kind: "accounting", doctype: "adapter_posting" },
			},
		],
	},
	{
		key: "settings",
		titleKey: "finance.nav.groups.settings",
		items: [
			{
				titleKey: "accounting.nav.fiscalYears",
				url: "/management/accounting/fiscal-years",
				icon: IconCalendarStats,
				gate: { kind: "accounting", doctype: "fiscal_year" },
			},
			{
				titleKey: "accounting.nav.currencyExchanges",
				url: "/management/accounting/currency-exchanges",
				icon: IconExchange,
				gate: { kind: "accounting", doctype: "currency_exchange" },
			},
			{
				titleKey: "accounting.nav.modesOfPayment",
				url: "/management/accounting/modes-of-payment",
				icon: IconCash,
				gate: { kind: "accounting", doctype: "mode_of_payment" },
			},
			{
				// [P3.5] «قوالب شروط الدفع» joins الإعدادات المالية per the §10.3 placement law
				titleKey: "accounting.nav.paymentTerms",
				url: "/management/accounting/payment-terms",
				icon: IconCalendarDollar,
				gate: { kind: "accounting", doctype: "payment_terms_template" },
			},
			{
				// [P4.4] ONE «الضرائب» hub per the §10.3 placement law — internal ?tab= strip
				titleKey: "accounting.nav.taxes",
				url: "/management/accounting/taxes",
				icon: IconReceiptTax,
				gate: { kind: "accounting", doctype: "sales_taxes_and_charges_template" },
			},
			{
				// [P11.6] ONE «الحوكمة» hub — governance instruments (periods/closing/budgets/
				// dimensions) join الإعدادات المالية beside السنوات المالية per §10.3;
				// hub-with-pills per the الضرائب precedent
				titleKey: "accounting.nav.governance",
				url: "/management/accounting/governance",
				icon: IconShieldCog,
				gate: { kind: "accounting", doctype: "accounting_period" },
			},
			{
				// [P12.14] ONE «العمليات الممتدّة» hub — the Phase-12 Extended features (POS
				// shifts, subscriptions, deferred recognition, dunning, statements,
				// withholding, repost). They are periodic or exceptional operations, so they
				// sit beside الحوكمة rather than among the daily screens; hub-with-pills per
				// the الضرائب precedent. Gated on sales_invoice: every tab either reads or
				// posts against invoices.
				titleKey: "accounting.nav.extended",
				url: "/management/accounting/extended",
				icon: IconRepeat,
				gate: { kind: "accounting", doctype: "sales_invoice" },
			},
			{
				// [NAV-4] a real in-workspace tab, no longer a link-out: it used to point into
				// the settings shell, which swapped the sub-sidebar and ejected the user from
				// «المالية». The screen moved under the accounting layout; the old settings
				// path redirects here.
				titleKey: "finance.nav.accountingSettings",
				url: ACCOUNTING_SETTINGS_URL,
				icon: IconSettings,
				gate: { kind: "accounting", doctype: "company_accounting_settings" },
			},
		],
	},
];

/** Flat view, for gating and landing decisions. */
export const FINANCE_NAV_ITEMS: FinanceNavItem[] = FINANCE_NAV_GROUPS.flatMap(
	(group) => group.items,
);

/** The permission slug that reveals a single destination. */
export const financeNavItemPermission = (item: FinanceNavItem): string => {
	if (item.gate.kind === "accounting") return accountingPermission(item.gate.doctype, "read");
	if (item.gate.kind === "permission") return item.gate.permission;
	return `${item.gate.resource}.view_full`;
};

/**
 * Any one of these reveals the «المالية» entry. Legacy resources contribute BOTH view
 * levels because `canView` treats limited and full alike for visibility.
 */
export const FINANCE_NAV_READ_PERMISSIONS: string[] = FINANCE_NAV_ITEMS.flatMap((item) => {
	if (item.gate.kind === "accounting")
		return [accountingPermission(item.gate.doctype, "read")];
	// [LY-P0] بوابة الصلاحية المباشرة تُسهم بصلاحيةٍ واحدة: لا «محدود» لها أصلًا
	if (item.gate.kind === "permission") return [item.gate.permission];
	return [`${item.gate.resource}.view_full`, `${item.gate.resource}.view_limited`];
});

/** Where the top-level «المالية» entry lands. */
export const FINANCE_HOME_URL = FINANCE_ROUTE;

/**
 * Where `/management/accounting` (a section, not a page) lands. Kept pointing at the first
 * accounting destination so existing links and bookmarks still resolve.
 */
export const ACCOUNTING_HOME_URL = "/management/accounting/accounts";
