import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { REMINDER_OPTIONS } from "@/features/settings/notifications/data/reminder-options";
import type { ReminderActionProps } from "@/features/settings/notifications/types/reminder-action.types";

export const ReminderAction = ({
	enabled,
	hours,
	isPending,
	onEnabledChange,
	onHoursChange,
}: ReminderActionProps) => {
	return (
		<div className="flex items-center gap-2">
			{onHoursChange && (
				<Select
					value={String(hours ?? 24)}
					onValueChange={(v) => onHoursChange(Number(v))}
					disabled={isPending || !enabled}
					dir="rtl"
				>
					<SelectTrigger
						size="sm"
						className="w-fit justify-between rounded-md text-xs"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{REMINDER_OPTIONS.map((option) => (
							<SelectItem
								key={option}
								value={String(option)}
								dir="rtl"
							>
								توقيت الإرسال: {option} ساعة
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}

			<Switch
				size="sm"
				checked={enabled}
				disabled={isPending}
				onCheckedChange={onEnabledChange}
			/>
		</div>
	);
};
