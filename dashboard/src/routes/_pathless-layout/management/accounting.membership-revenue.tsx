import { createFileRoute } from "@tanstack/react-router";

import { MembershipRevenueReportPage } from "@/features/accounting/reports/components/mi-reports-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/membership-revenue",
)({
	component: MembershipRevenueReportPage,
});
