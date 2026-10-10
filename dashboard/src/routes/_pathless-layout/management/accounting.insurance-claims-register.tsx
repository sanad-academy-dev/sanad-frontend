import { createFileRoute } from "@tanstack/react-router";

import { InsuranceClaimsRegisterReportPage } from "@/features/accounting/reports/components/mi-reports-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/insurance-claims-register",
)({
	component: InsuranceClaimsRegisterReportPage,
});
