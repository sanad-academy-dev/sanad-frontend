import type { ReactNode } from "react";

import { FinanceWorkspaceHeader } from "@/features/finance/navigation/finance-workspace-header";

/**
 * The «المالية» area shell — [NAV-2]: the sub-sidebar is gone; the area is a WORKSPACE
 * navigated entirely through the header (two-level: sub-workspace segmented control +
 * screen tabs), so content gets the full width. Mounted by BOTH `finance.tsx` and the
 * `accounting.tsx` layout route so every money screen carries the same header.
 *
 * Mounting the shell twice (rather than moving `/management/finance` under the accounting
 * layout route) is deliberate: it unifies the navigation with ZERO route churn. Collapsing
 * the two into a real parent layout route is on the contract's cleanup list.
 */
export function FinanceAreaLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto">
			<FinanceWorkspaceHeader />
			<div className="min-h-auto">{children}</div>
		</div>
	);
}
