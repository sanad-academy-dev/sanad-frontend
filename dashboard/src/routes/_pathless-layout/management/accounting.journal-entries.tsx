import { createFileRoute } from "@tanstack/react-router";

import { JournalEntriesPage } from "@/features/accounting/journal-entries/components/journal-entries-page";

export const Route = createFileRoute(
	"/_pathless-layout/management/accounting/journal-entries",
)({
	component: JournalEntriesPage,
});
