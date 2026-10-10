import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { INBOX_VOLUME_OPTIONS } from "@/features/settings/notifications/data/inbox-volume-options";
import type { InboxVolumeActionProps } from "@/features/settings/notifications/types/inbox-action.types";

export const InboxVolumeAction = ({
	soundEnabled,
	soundVolume,
	isPending,
	onVolumeChange,
}: InboxVolumeActionProps) => {
	return (
		<Select
			value={String(soundVolume)}
			onValueChange={(value) => onVolumeChange(Number(value))}
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
				{INBOX_VOLUME_OPTIONS.map((option) => (
					<SelectItem
						key={option.value}
						value={String(option.value)}
						dir="rtl"
					>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
