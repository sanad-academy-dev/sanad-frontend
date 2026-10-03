import { IconAlertTriangle, IconClock, IconUserOff } from "@tabler/icons-react";

import type { AppointmentAlert } from "@/features/appointments/hooks/use-appointment-alerts";
import { useSelectedAppointmentStore } from "@/features/appointments/stores/selected-appointment.store";
import { cn } from "@/lib/utils";

type AppointmentAlertPillProps = {
	alert: AppointmentAlert;
};

const textColors: Record<AppointmentAlert["category"], string> = {
	emergency: "text-red-500",
	"no-show": "text-orange-500",
	"long-wait": "text-amber-500",
};

const Icon = ({ category }: { category: AppointmentAlert["category"] }) => {
	if (category === "emergency") return <IconAlertTriangle className="size-3.5" />;
	if (category === "no-show") return <IconUserOff className="size-3.5" />;
	return <IconClock className="size-3.5" />;
};

const renderLabel = (alert: AppointmentAlert): string => {
	const name = alert.card.patientName;
	if (alert.category === "emergency") {
		return alert.alsoLongWait
			? `حالة طوارئ ${name} - انتظار ${alert.minutes} دقيقة!`
			: `حالة طوارئ ${name}`;
	}
	if (alert.category === "no-show") {
		return `غائب ${name} - متأخر ${alert.minutes} دقيقة!`;
	}
	return `${name} - انتظار ${alert.minutes} دقيقة!`;
};

export function AppointmentAlertPill({ alert }: AppointmentAlertPillProps) {
	const selectCard = useSelectedAppointmentStore((s) => s.select);

	return (
		<button
			type="button"
			onClick={() => selectCard(alert.card)}
			className={cn(
				"inline-flex items-center gap-1.5 rounded-[4px] border border-border bg-background px-2 py-1 text-xs font-normal transition-colors cursor-pointer hover:bg-muted",
				textColors[alert.category],
			)}
		>
			<Icon category={alert.category} />
			<span>{renderLabel(alert)}</span>
		</button>
	);
}
