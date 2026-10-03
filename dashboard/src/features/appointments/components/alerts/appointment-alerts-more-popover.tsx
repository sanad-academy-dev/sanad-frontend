import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppointmentAlertPill } from "@/features/appointments/components/alerts/appointment-alert-pill";
import type { AppointmentAlert } from "@/features/appointments/hooks/use-appointment-alerts";

type AppointmentAlertsMorePopoverProps = {
	overflow: AppointmentAlert[];
};

const groupOrder: AppointmentAlert["category"][] = ["emergency", "no-show", "long-wait"];

const groupLabels: Record<AppointmentAlert["category"], string> = {
	emergency: "حالات طوارئ",
	"no-show": "غياب",
	"long-wait": "انتظار طويل",
};

export function AppointmentAlertsMorePopover({ overflow }: AppointmentAlertsMorePopoverProps) {
	const grouped = groupOrder
		.map((category) => ({
			category,
			items: overflow.filter((a) => a.category === category),
		}))
		.filter((g) => g.items.length > 0);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/70 transition-colors cursor-pointer"
				>
					+{overflow.length}
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-80 max-h-96 overflow-y-auto"
			>
				{grouped.map((g) => (
					<div
						key={g.category}
						className="flex flex-col gap-1.5"
					>
						<div className="text-xs font-medium text-muted-foreground px-1">
							{groupLabels[g.category]} ({g.items.length})
						</div>
						<div className="flex flex-wrap gap-1.5">
							{g.items.map((alert) => (
								<AppointmentAlertPill
									key={alert.appointmentId}
									alert={alert}
								/>
							))}
						</div>
					</div>
				))}
			</PopoverContent>
		</Popover>
	);
}
