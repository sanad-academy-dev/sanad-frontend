import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CampaignDetailsStats } from "@/features/digital-registration/components/campaign-details-stats";
import { CampaignDetailsHeader, type CampaignView } from "@/features/digital-registration/components/campaign-details-header";
import { CampaignDetailsToolbar } from "@/features/digital-registration/components/campaign-details-toolbar";
import { CampaignRequestsKanban } from "@/features/digital-registration/components/campaign-requests-kanban";
import { CampaignInfo } from "@/features/digital-registration/components/campaign-info";

export const Route = createFileRoute("/_pathless-layout/digital-registration_/$campaignId")({
	component: CampaignDetailsRoute,
});

function CampaignDetailsRoute() {
	const { campaignId } = Route.useParams();
	const [view, setView] = useState<CampaignView>("requests");

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CampaignDetailsHeader 
				campaignId={campaignId} 
				activeView={view}
				onChangeView={setView}
			/>
			
			{view === "requests" && (
				<>
					<CampaignDetailsToolbar />
					<hr className="my-2" />
					<CampaignRequestsKanban />
				</>
			)}

			{view === "stats" && <CampaignDetailsStats />}

			{view === "info" && <CampaignInfo />}
		</div>
	);
}

