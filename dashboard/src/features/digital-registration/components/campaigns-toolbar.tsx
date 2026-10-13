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
					<Button
						type="button"
							size="sm"
							className="h-8 gap-1.5 text-xs font-bold"
						onClick={() => setIsSheetOpen(true)}>
						<IconPlus   className="size-3.5" />
						حملة جديدة
					</Button>
				}
			/>
			<AddCampaignSheet open={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
		</>
	);
}
