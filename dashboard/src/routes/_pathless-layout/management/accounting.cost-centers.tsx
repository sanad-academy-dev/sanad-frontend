import { createFileRoute } from "@tanstack/react-router";

import { CostCentersPage } from "@/features/accounting/cost-centers/components/cost-centers-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/cost-centers")({
	component: CostCentersPage,
});
