import { createFileRoute } from "@tanstack/react-router";

import { PartiesPage } from "@/features/accounting/parties/components/parties-page";

export const Route = createFileRoute("/_pathless-layout/management/accounting/parties")({
	component: PartiesPage,
});
