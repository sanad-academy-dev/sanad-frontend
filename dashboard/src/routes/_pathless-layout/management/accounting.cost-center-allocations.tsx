import { createFileRoute } from "@tanstack/react-router";

import { CostCenterAllocationsPage } from "@/features/accounting/cost-center-allocations/components/cost-center-allocations-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/cost-center-allocations",
)({
	component: CostCenterAllocationsPage,
});
