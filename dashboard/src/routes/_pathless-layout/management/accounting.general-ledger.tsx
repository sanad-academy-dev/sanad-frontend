import { createFileRoute } from "@tanstack/react-router";

import { GeneralLedgerPage } from "@/features/accounting/reports/components/general-ledger-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/general-ledger")(
	{
		component: GeneralLedgerPage,
		// [P9.5] §18.2 drill-through target — statements/ageing rows link here with ?accountId
		validateSearch: (search: Record<string, unknown>): { accountId?: string } => ({
			accountId: typeof search.accountId === "string" ? search.accountId : undefined,
		}),
	},
);
