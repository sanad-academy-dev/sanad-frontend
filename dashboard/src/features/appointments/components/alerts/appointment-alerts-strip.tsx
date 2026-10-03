import { LiveBadge } from "@/components/common/live-badge";
import { AppointmentAlertPill } from "@/features/appointments/components/alerts/appointment-alert-pill";
import { AppointmentAlertsMorePopover } from "@/features/appointments/components/alerts/appointment-alerts-more-popover";
import { useAppointmentAlerts } from "@/features/appointments/hooks/use-appointment-alerts";

export function AppointmentAlertsStrip() {
	const { visible, overflow, liveState } = useAppointmentAlerts();

	return (
		<div className="flex items-center gap-3 px-4 min-h-8">
			<LiveBadge state={liveState} />
			<div className="flex flex-wrap items-center gap-1.5">
				{visible.map((alert) => (
					<AppointmentAlertPill
						key={alert.appointmentId}
						alert={alert}
					/>
				))}
				{overflow.length > 0 && <AppointmentAlertsMorePopover overflow={overflow} />}
			</div>
		</div>
	);
}
