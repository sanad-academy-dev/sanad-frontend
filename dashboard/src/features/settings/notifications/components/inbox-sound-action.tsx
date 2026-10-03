import { IconPlayerPlayFilled } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { INBOX_SOUND_LABELS, playInboxSound } from "@/features/inbox/utils/inbox-sound";
import type { InboxSoundActionProps } from "@/features/settings/notifications/types/inbox-action.types";
import type { InboxSoundName } from "@/generated/prisma/enums";

const SOUND_NAMES = Object.keys(INBOX_SOUND_LABELS) as InboxSoundName[];

// ترتيب DOM في RTL: أوّل عنصر يمينًا — بصريًا من اليسار: [مفتاح] [تجربة] [النغمة]
export const InboxSoundAction = ({
	soundEnabled,
	soundName,
	soundVolume,
	isPending,
	onEnabledChange,
	onSoundChange,
}: InboxSoundActionProps) => {
	return (
		<div className="flex items-center gap-2">
			<Select
				value={soundName}
				onValueChange={(value) => onSoundChange(value as InboxSoundName)}
				disabled={isPending || !soundEnabled}
				dir="rtl"
			>
				<SelectTrigger
					size="sm"
					className="w-fit justify-between rounded-md text-xs"
				>
					<SelectValue />
				</SelectTrigger>
				<SelectContent position="popper">
					{SOUND_NAMES.map((name) => (
						<SelectItem
							key={name}
							value={name}
							dir="rtl"
						>
							{INBOX_SOUND_LABELS[name]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<Button
				type="button"
				variant="outline"
				size="icon-sm"
				disabled={!soundEnabled}
				aria-label="تجربة النغمة"
				// التجربة محلية بالكامل — النغمة تُولَّد في المتصفّح بلا طلب شبكة
				onClick={() => playInboxSound(soundName, soundVolume)}
			>
				<IconPlayerPlayFilled className="size-3" />
			</Button>

			<Switch
				size="sm"
				checked={soundEnabled}
				disabled={isPending}
				onCheckedChange={onEnabledChange}
			/>
		</div>
	);
};
