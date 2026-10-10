import { createFileRoute } from "@tanstack/react-router";

import { FiscalYearsPage } from "@/features/accounting/fiscal-years/components/fiscal-years-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/fiscal-years")({
	component: FiscalYearsPage,
});
