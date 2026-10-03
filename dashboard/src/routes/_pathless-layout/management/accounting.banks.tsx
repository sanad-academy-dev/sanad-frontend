import { createFileRoute } from "@tanstack/react-router";

import { BanksPage } from "@/features/accounting/bank/components/banks-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/banks")({
	component: BanksPage,
});
