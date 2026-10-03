import { createFileRoute } from "@tanstack/react-router";

import { BenefitUsageReportPage } from "@/features/accounting/reports/components/mi-reports-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/benefit-usage")({
	component: BenefitUsageReportPage,
});
