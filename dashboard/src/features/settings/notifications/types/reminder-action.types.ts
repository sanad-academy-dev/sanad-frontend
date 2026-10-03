export interface ReminderActionProps {
	enabled: boolean;
	hours?: number;
	isPending?: boolean;
	onEnabledChange: (enabled: boolean) => void;
	onHoursChange?: (hours: number) => void;
}
