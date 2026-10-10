/**
 * [P1.1] Pure nested-set helpers for the Chart of Accounts (BRD §4.3) — no DB/env imports
 * so the tree maths is unit-testable in isolation.
 *
 * `parentAccountId` (adjacency list) is the structural source of truth; these functions
 * project it onto `lft`/`rgt` (rebuilt on every structural change, ERPNext's rebuild_tree
 * approach) so reports get O(1) subtree aggregation (`parent.lft < child.lft < parent.rgt`).
 */
export type TreeNode = {
    id: string;
    parentAccountId: string | null;
};
export type NestedSetPosition = {
    id: string;
    lft: number;
    rgt: number;
};
/**
 * Depth-first nested-set assignment. Sibling order follows the input array order (callers
 * pass nodes pre-sorted by accountNumber then accountName for stable, deterministic trees).
 * Throws on a cycle or an orphan (parent id not present) rather than silently corrupting.
 */
export declare function computeNestedSet(nodes: readonly TreeNode[]): NestedSetPosition[];
/**
 * True if re-parenting `nodeId` under `newParentId` would create a cycle — i.e. the new
 * parent is the node itself or one of its descendants. Uses the adjacency list only.
 */
export declare function wouldCreateCycle(nodes: readonly TreeNode[], nodeId: string, newParentId: string | null): boolean;
