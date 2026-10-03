import { describe, expect, it } from "vitest";

import {
	FINANCE_NAV_GROUPS,
	type FinanceNavItem,
} from "@/features/finance/navigation/finance-nav";
import {
	activeGroupKeyOf,
	landingFor,
	MAX_VISIBLE_TABS,
	resolveWorkspaceEntry,
	splitOverflow,
	visibleGroupsFor,
	workspaceGroupLinks,
} from "@/features/finance/navigation/finance-workspace";
import { accountingPermission } from "@sanad/contracts/accounting/permissions";

/**
 * [NAV-3] locks the workspace behaviors across BOTH renderers after the split — the sidebar
 * owns the groups (`workspaceGroupLinks`), the header owns the tabs (`splitOverflow`). Route
 * → active-group resolution and landing-memory validation are shared by the two.
 */

const seeEverything = (_item: FinanceNavItem) => true;

const holding =
	(slugs: string[]) =>
	(item: FinanceNavItem): boolean => {
		if (item.gate.kind === "accounting")
			return slugs.includes(accountingPermission(item.gate.doctype, "read"));
		if (item.gate.kind === "permission") return slugs.includes(item.gate.permission);
		return slugs.includes(`${item.gate.resource}.view_full`);
	};

describe("finance workspace — active group from route", () => {
	it("resolves an accounting route to its group", () => {
		expect(activeGroupKeyOf("/management/accounting/journal-entries", undefined)).toBe(
			"books",
		);
		expect(activeGroupKeyOf("/management/accounting/trial-balance", undefined)).toBe(
			"reports",
		);
	});

	it("disambiguates the legacy hub by ?tab= (default: invoices)", () => {
		expect(activeGroupKeyOf("/management/finance", undefined)).toBe("dailyOperations");
		expect(activeGroupKeyOf("/management/finance", "expenses")).toBe("dailyOperations");
	});

	it("resolves إعدادات المحاسبة inside the workspace, and unknown routes to null", () => {
		// [NAV-4] no longer a link-out: the screen moved under the accounting layout, so the
		// tab renders ACTIVE like any other instead of ejecting the user to the settings shell
		expect(activeGroupKeyOf("/management/accounting/settings", undefined)).toBe("settings");
		// the old settings path is a redirect now — it belongs to no group
		expect(activeGroupKeyOf("/management/settings/accounts", undefined)).toBeNull();
		expect(activeGroupKeyOf("/management/inventory", undefined)).toBeNull();
	});
});

describe("finance workspace — landing", () => {
	const books = FINANCE_NAV_GROUPS.find((g) => g.key === "books");
	if (!books) throw new Error("books group missing");

	it("lands on the remembered tab when it is still in the group", () => {
		const remembered = { url: "/management/accounting/cost-centers" };
		expect(landingFor(books, remembered)).toEqual(remembered);
	});

	it("falls back to the first tab when the memory points elsewhere", () => {
		const target = landingFor(books, { url: "/management/accounting/nonexistent" });
		expect(target?.url).toBe(books.items[0]?.url);
	});

	it("resolveWorkspaceEntry: full permissions + no memory → default home (الفواتير)", () => {
		const entry = resolveWorkspaceEntry(null, {}, seeEverything);
		expect(entry.url).toBe("/management/finance");
		expect(entry.search?.tab).toBe("invoices");
	});

	it("resolveWorkspaceEntry: memory wins while still permitted", () => {
		const entry = resolveWorkspaceEntry(
			"books",
			{ books: { url: "/management/accounting/journal-entries" } },
			seeEverything,
		);
		expect(entry.url).toBe("/management/accounting/journal-entries");
	});

	it("resolveWorkspaceEntry: a receptionist's memory of a lost group degrades safely", () => {
		const receptionist = holding(["finance_invoices.view_full"]);
		const entry = resolveWorkspaceEntry(
			"books",
			{ books: { url: "/management/accounting/journal-entries" } },
			receptionist,
		);
		// books is invisible to them — land on their one permitted destination instead
		expect(entry.url).toBe("/management/finance");
		expect(entry.search?.tab).toBe("invoices");
	});
});

describe("finance workspace — visibility + overflow", () => {
	it("drops empty groups", () => {
		const groups = visibleGroupsFor(holding(["finance_invoices.view_full"]));
		expect(groups).toHaveLength(1);
		expect(groups[0]?.key).toBe("dailyOperations");
		expect(groups[0]?.items).toHaveLength(1);
	});

	it("splits deterministically at MAX_VISIBLE_TABS", () => {
		const eight = Array.from({ length: 8 }, (_, i) => i);
		const { visible, overflow } = splitOverflow(eight);
		expect(visible).toHaveLength(MAX_VISIBLE_TABS);
		expect(overflow).toEqual([6, 7]);

		const six = Array.from({ length: 6 }, (_, i) => i);
		expect(splitOverflow(six).overflow).toHaveLength(0);
	});
});

describe("[NAV-3] sidebar sub-menu — workspaceGroupLinks", () => {
	it("gives one link per visible group, in config order", () => {
		const links = workspaceGroupLinks(seeEverything, {}, null);
		expect(links?.map((l) => l.key)).toEqual([
			"dailyOperations",
			"membershipInsurance",
			// [LY-P0] «الولاء» — مجموعةٌ شقيقة للعضويات (Loyalty BRD §10.1)
			"loyalty",
			"books",
			"reports",
			"settings",
		]);
	});

	it("each link lands on the group's first tab when there is no memory", () => {
		const links = workspaceGroupLinks(seeEverything, {}, null);
		const books = FINANCE_NAV_GROUPS.find((g) => g.key === "books");
		expect(links?.find((l) => l.key === "books")?.url).toBe(books?.items[0]?.url);
	});

	it("a group's remembered destination wins over its first tab", () => {
		const links = workspaceGroupLinks(
			seeEverything,
			{ books: { url: "/management/accounting/cost-centers" } },
			null,
		);
		expect(links?.find((l) => l.key === "books")?.url).toBe(
			"/management/accounting/cost-centers",
		);
	});

	it("marks exactly the active group", () => {
		const links = workspaceGroupLinks(seeEverything, {}, "reports");
		expect(links?.filter((l) => l.isActive).map((l) => l.key)).toEqual(["reports"]);
	});

	it("returns null for a single-group user so the entry stays a plain link (State-4)", () => {
		expect(workspaceGroupLinks(holding(["finance_invoices.view_full"]), {}, null)).toBeNull();
	});

	it("returns null when the user can see nothing", () => {
		expect(workspaceGroupLinks(() => false, {}, null)).toBeNull();
	});

	it("hides a group the user lost, keeping the rest a real tree", () => {
		// everything except the ledger-read gated reports group
		const withoutLedger = holding([
			"finance_invoices.view_full",
			"finance_expenses.view_full",
			accountingPermission("journal_entry", "read"),
			accountingPermission("fiscal_year", "read"),
		]);
		const links = workspaceGroupLinks(withoutLedger, {}, null);
		expect(links?.map((l) => l.key)).not.toContain("reports");
		expect((links?.length ?? 0) >= 2).toBe(true);
	});
});
