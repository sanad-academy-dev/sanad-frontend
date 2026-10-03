import type { LedgerAccountResponse } from "@/server/accounting/account/account.type";

export type AccountTreeNode = LedgerAccountResponse & {
	depth: number;
	children: AccountTreeNode[];
};

/**
 * [P1.2] Build the nested tree from the flat, lft-ordered account list the API returns.
 * Pure — unit-testable. Because the input is ordered by `lft`, every parent precedes its
 * children, so depth is known by the time a child is attached.
 */
export function buildAccountTree(flat: LedgerAccountResponse[]): AccountTreeNode[] {
	const byId = new Map<string, AccountTreeNode>();
	for (const a of flat) byId.set(a.id, { ...a, depth: 0, children: [] });

	const roots: AccountTreeNode[] = [];
	for (const a of flat) {
		const node = byId.get(a.id);
		if (!node) continue;
		const parent = a.parentAccountId ? byId.get(a.parentAccountId) : undefined;
		if (parent) {
			node.depth = parent.depth + 1;
			parent.children.push(node);
		} else {
			roots.push(node);
		}
	}
	return roots;
}
