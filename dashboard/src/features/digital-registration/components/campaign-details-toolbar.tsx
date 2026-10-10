import {
	IconBolt,
	IconDownload,
	IconFilter,
	IconLayoutGrid,
	IconPlus,
	IconQuestionMark,
	IconSearch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";

export function CampaignDetailsToolbar() {
	return (
		<div className="flex items-center justify-between gap-3 px-4">
			<div className="flex items-center gap-2">
				{/* <InputGroup className="w-64">
					
					<InputGroupAddon align="inline-end">
						<Kbd className="text-primary bg-primary/10">/</Kbd>
						<IconBolt className="text-primary" />
					</InputGroupAddon>

				</InputGroup>				 */}
			</div>

		</div>
	);
}
