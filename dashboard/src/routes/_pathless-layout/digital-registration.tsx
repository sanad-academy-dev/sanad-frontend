import { createFileRoute } from "@tanstack/react-router";

import { CampaignsStats } from "@/features/digital-registration/components/campaigns-stats";
import { CampaignsTable } from "@/features/digital-registration/components/campaigns-table";
import { CampaignsToolbar } from "@/features/digital-registration/components/campaigns-toolbar";
import { DigitalRegistrationHeader } from "@/features/digital-registration/components/digital-registration-header";
import { mockCampaigns } from "@/features/digital-registration/data/mock-campaigns";

export const Route = createFileRoute("/_pathless-layout/digital-registration")({
	component: DigitalRegistrationRoute,
});

function DigitalRegistrationRoute() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<DigitalRegistrationHeader />
			<CampaignsStats />
			<CampaignsToolbar />
			<CampaignsTable data={mockCampaigns} />
		</div>
	);
}

