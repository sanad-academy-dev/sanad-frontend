import { createFileRoute } from "@tanstack/react-router";

import { PurchaseRegisterPage } from "@/features/accounting/reports/components/purchase-register-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/purchase-register",
)({
	component: PurchaseRegisterPage,
});
