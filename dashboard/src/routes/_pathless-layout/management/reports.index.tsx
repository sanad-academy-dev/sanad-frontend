import { createFileRoute } from "@tanstack/react-router";

import { ReportsListPage } from "@/features/reports/components/reports-list-page";

export const Route = createFileRoute("/_pathless-layout/management/reports/")({
	component: ReportsListPage,
});
