import { describe, expect, it } from "vitest";

import {
	type AccountTreeNode,
	buildAccountTree,
} from "@/features/accounting/chart-of-accounts/data/build-account-tree";
import type { LedgerAccountResponse } from "@/server/accounting/account/account.type";

// minimal fixture: only the fields buildAccountTree reads
const acc = (id: string, parentAccountId: string | null): LedgerAccountResponse =>
	({ id, parentAccountId }) as LedgerAccountResponse;

const depthOf = (roots: AccountTreeNode[], id: string): number | undefined => {
	const walk = (nodes: AccountTreeNode[]): number | undefined => {
		for (const n of nodes) {
			if (n.id === id) return n.depth;
			const d = walk(n.children);
			if (d !== undefined) return d;
		}
		return undefined;
	};
	return walk(roots);
};

describe("buildAccountTree", () => {
	it("يبني الشجرة من قائمة مسطّحة مرتّبة بـ lft ويحسب العمق", () => {
		// assets > current > cash ; liabilities
		const flat = [
			acc("assets", null),
			acc("current", "assets"),
			acc("cash", "current"),
			acc("liab", null),
		];
		const roots = buildAccountTree(flat);
		expect(roots.map((r) => r.id)).toEqual(["assets", "liab"]);
		expect(depthOf(roots, "assets")).toBe(0);
		expect(depthOf(roots, "current")).toBe(1);
		expect(depthOf(roots, "cash")).toBe(2);
		// cash nested under current under assets
		const assets = roots.find((r) => r.id === "assets")!;
		expect(assets.children[0].id).toBe("current");
		expect(assets.children[0].children[0].id).toBe("cash");
	});

	it("يعامل الحساب ذا الأب المفقود كجذر", () => {
		const roots = buildAccountTree([acc("orphan", "ghost")]);
		expect(roots.map((r) => r.id)).toEqual(["orphan"]);
	});
});
