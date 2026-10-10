import { createFileRoute } from "@tanstack/react-router";

import { BankRulesPage } from "@/features/accounting/bank/components/bank-rules-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/bank-rules")({
	component: BankRulesPage,
});
