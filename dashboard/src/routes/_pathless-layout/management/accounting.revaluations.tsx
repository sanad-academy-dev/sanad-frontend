import { createFileRoute } from "@tanstack/react-router";

import { RevaluationsPage } from "@/features/accounting/revaluations/components/revaluations-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/revaluations")({
	component: RevaluationsPage,
});
