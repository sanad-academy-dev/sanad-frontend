import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { FinanceAreaLayout } from "@/features/finance/components/finance-area-layout";

export const Route = createFileRoute("/_pathless-layout/management/accounting")({
	component: AccountingLayout,
});

function AccountingSkeleton() {
	return (
		<div className="flex flex-col gap-6 px-6 py-6">
			<Skeleton className="h-6 w-40" />
			{Array.from({ length: 4 }).map((_, i) => (
				<div
					key={i}
					className="flex flex-col gap-2"
				>
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-9 w-full" />
				</div>
			))}
		</div>
	);
}

/** The accounting screens are the "books/reports/settings" half of the «المالية» area —
 * they mount the SAME shell as `finance.tsx`, so the sub-sidebar persists across both. */
function AccountingLayout() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	return (
		<FinanceAreaLayout>{isLoading ? <AccountingSkeleton /> : <Outlet />}</FinanceAreaLayout>
	);
}
