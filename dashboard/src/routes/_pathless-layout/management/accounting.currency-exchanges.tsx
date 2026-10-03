import { createFileRoute } from "@tanstack/react-router";

import { CurrencyExchangesPage } from "@/features/accounting/currency-exchanges/components/currency-exchanges-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/currency-exchanges",
)({
	component: CurrencyExchangesPage,
});
