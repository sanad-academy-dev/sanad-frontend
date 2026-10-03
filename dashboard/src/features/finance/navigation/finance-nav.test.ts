import { describe, expect, it } from "vitest";

import {
	FINANCE_NAV_GROUPS,
	FINANCE_NAV_ITEMS,
	FINANCE_NAV_READ_PERMISSIONS,
	type FinanceNavItem,
} from "@/features/finance/navigation/finance-nav";
import { MAX_VISIBLE_TABS } from "@/features/finance/navigation/finance-workspace";
import { FINANCE_RESOURCES } from "@/lib/permissions";
import {
	ACCOUNTING_DOCTYPES,
	accountingPermission,
} from "@sanad/contracts/accounting/permissions";

/**
 * The unified «المالية» nav is the contract's single source for money destinations, so these
 * lock the two properties reviewers actually rely on: every item is gated, and gating
 * degrades to exactly the groups a narrow role can reach.
 */

/** Mirrors `finance-workspace-header.tsx`: accounting items gate on doctype read, legacy on canView. */
const visibleGroups = (held: string[]) =>
	FINANCE_NAV_GROUPS.map((group) => ({
		titleKey: group.titleKey,
		items: group.items.filter((item: FinanceNavItem) => {
			if (item.gate.kind === "accounting")
				return held.includes(accountingPermission(item.gate.doctype, "read"));
			// [LY-P0] بوابة الصلاحية المباشرة: لا «محدود» لها
			if (item.gate.kind === "permission") return held.includes(item.gate.permission);
			return (
				held.includes(`${item.gate.resource}.view_full`) ||
				held.includes(`${item.gate.resource}.view_limited`)
			);
		}),
	})).filter((group) => group.items.length > 0);

describe("finance nav config", () => {
	it("gates every destination", () => {
		for (const item of FINANCE_NAV_ITEMS) {
			if (item.gate.kind === "accounting") {
				expect(ACCOUNTING_DOCTYPES.map((d) => d.key)).toContain(item.gate.doctype);
			} else if (item.gate.kind === "permission") {
				// [LY-P0] صلاحية مباشرة من كتالوج المكتب الأمامي — تكفي أنّها غير فارغة
				expect(item.gate.permission.length).toBeGreaterThan(0);
			} else {
				expect(Object.values(FINANCE_RESOURCES)).toContain(item.gate.resource);
			}
		}
	});

	it("declares the six workflow groups in order", () => {
		// [MI-NAV] «العضويات والتأمين» joined as a sibling group (MI BRD §17.2 row 10,
		// owner 2026-08-24) — MI is a full module and gets module-level navigation.
		// [LY-P0] «الولاء» joined next to it on the same reasoning (Loyalty BRD §10.1):
		// a full module, and its complement — membership is bought, loyalty accrues.
		expect(FINANCE_NAV_GROUPS.map((g) => g.titleKey)).toEqual([
			"finance.nav.groups.dailyOperations",
			"finance.nav.groups.membershipInsurance",
			"finance.nav.groups.loyalty",
			"finance.nav.groups.books",
			"finance.nav.groups.reports",
			"finance.nav.groups.settings",
		]);
	});

	it("keeps the MI group inside the visible-tab cap, so claims is never in «المزيد»", () => {
		// This is the half of the overflow finding the move actually fixes: as daily
		// operations' 7th item, «المطالبات التأمينية» fell into «المزيد». In its own group it
		// is the 3rd of 3 and always visible.
		//
		// NOT asserted: that daily operations now fits the cap. It does not — losing the
		// three MI items takes it from 14 to 11, still 5 over. books (7), reports (15) and
		// settings (8) are over it too. That is pre-existing and outside this change.
		const mi = FINANCE_NAV_GROUPS.find((g) => g.key === "membershipInsurance");
		expect(mi?.items.length).toBeLessThanOrEqual(MAX_VISIBLE_TABS);
	});

	it("puts the three MI screens in the MI group and nowhere else", () => {
		const mi = [
			"accounting.nav.memberships",
			"accounting.nav.insurance",
			"accounting.nav.insuranceClaims",
		];
		const group = FINANCE_NAV_GROUPS.find((g) => g.key === "membershipInsurance");
		expect(group?.items.map((i) => i.titleKey)).toEqual(mi);
		for (const other of FINANCE_NAV_GROUPS.filter((g) => g.key !== "membershipInsurance")) {
			expect(other.items.map((i) => i.titleKey).filter((k) => mi.includes(k))).toEqual([]);
		}
	});

	it("keeps the MI reports with the other financial reports", () => {
		const reports = FINANCE_NAV_GROUPS.find((g) => g.key === "reports");
		expect(reports?.items.map((i) => i.titleKey)).toEqual(
			expect.arrayContaining([
				"accounting.nav.insuranceClaimsRegister",
				"accounting.nav.membershipRevenue",
			]),
		);
	});

	it("hides the MI group entirely from a role holding none of its permissions", () => {
		// no new gating mechanism: empty groups vanish, so unrelated staff see no empty shell
		const groups = visibleGroups([`${FINANCE_RESOURCES.invoices}.view_full`]);
		expect(groups.map((g) => g.titleKey)).not.toContain(
			"finance.nav.groups.membershipInsurance",
		);
	});

	it("addresses every legacy destination by ?tab= so it deep-links", () => {
		const legacy = FINANCE_NAV_ITEMS.filter((item) => item.gate.kind === "resource");
		expect(legacy.length).toBeGreaterThan(0);
		for (const item of legacy) {
			expect(item.url).toBe("/management/finance");
			expect(item.search?.tab).toBeTruthy();
		}
	});

	it("shows a receptionist holding invoices only ONE group with ONE item", () => {
		const groups = visibleGroups([`${FINANCE_RESOURCES.invoices}.view_full`]);
		expect(groups).toHaveLength(1);
		expect(groups[0]?.titleKey).toBe("finance.nav.groups.dailyOperations");
		expect(groups[0]?.items.map((i) => i.titleKey)).toEqual(["finance.nav.invoices"]);
	});

	it("shows an accountant holding every read permission all non-empty groups", () => {
		const groups = visibleGroups(FINANCE_NAV_READ_PERMISSIONS);
		// P2.6/P2.7 landed دفتر الأستاذ + ميزان المراجعة into reports; [MI-NAV] added the MI
		// group and [LY-P0] the loyalty one — all six render for a reader who holds everything
		expect(groups.map((g) => g.titleKey)).toEqual([
			"finance.nav.groups.dailyOperations",
			"finance.nav.groups.membershipInsurance",
			"finance.nav.groups.loyalty",
			"finance.nav.groups.books",
			"finance.nav.groups.reports",
			"finance.nav.groups.settings",
		]);
		expect(groups.flatMap((g) => g.items)).toHaveLength(FINANCE_NAV_ITEMS.length);
	});

	it("hides the reports group from a role without any ledger read", () => {
		// gating degrades per item: the reports group is ledger-read gated (gl_entry for
		// GL/TB/party-TB, payment_ledger_entry for the PLE audit — P3.6) plus the §18.4
		// registers, which read the invoice vouchers themselves ([P5.8] sales, [P6.5] purchase),
		// and the [P12A.2e] §C3 parallel-run report, which reads adapter_posting.
		//
		// THIS LIST IS THE INVENTORY of every read that grants a reports item, and it must
		// grow with each new report — [MI-P6] added three that read their own doctypes
		// (a claims register reads claims, the membership reports read memberships; gating
		// them on gl_entry instead would hand ledger readers reports they have no business
		// in and hide them from the manager who does). The ASSERTION is unchanged: strip
		// every report-granting read and the group must disappear.
		const ledgerReads = [
			accountingPermission("gl_entry", "read"),
			accountingPermission("payment_ledger_entry", "read"),
			accountingPermission("sales_invoice", "read"),
			accountingPermission("purchase_invoice", "read"),
			accountingPermission("payment_entry", "read"),
			accountingPermission("adapter_posting", "read"),
			accountingPermission("insurance_claim", "read"),
			accountingPermission("membership", "read"),
		];
		const withoutLedger = FINANCE_NAV_READ_PERMISSIONS.filter(
			(slug) => !ledgerReads.includes(slug),
		);
		const groups = visibleGroups(withoutLedger);
		expect(groups.map((g) => g.titleKey)).not.toContain("finance.nav.groups.reports");
	});

	it("hides the whole area from a role holding none of it", () => {
		expect(visibleGroups([])).toHaveLength(0);
	});
});
