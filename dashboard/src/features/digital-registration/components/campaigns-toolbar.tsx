import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { AddCampaignSheet } from "@/features/digital-registration/components/add-campaign-sheet";

export function CampaignsToolbar() {
	const [isSheetOpen, setIsSheetOpen] = useState(false);

	return (
		<>
			<TableToolbar
				searchPlaceholder="ابحث بالحملة أو الرمز..."
				actions={
					<Button className="rounded-md" onClick={() => setIsSheetOpen(true)}>
						<IconPlus size={16} className="me-2" />
						حملة جديدة
					</Button>
				}
			/>
			<AddCampaignSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
		</>
	);
}
