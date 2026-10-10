import { createFileRoute } from "@tanstack/react-router";

import { InsuranceClaimsPage } from "@/features/accounting/insurance/components/insurance-claims-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/insurance-claims",
)({
	component: InsuranceClaimsPage,
});
