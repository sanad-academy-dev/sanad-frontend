import { IconDots, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { STATUS_META } from "@/features/appointments/data/status-meta";
import type { AppointmentColumn } from "@/features/appointments/types/appointment.types";
import { COLUMN_TO_STATUS } from "@/features/appointments/utils/map-appointment-card";
import type { AppointmentStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<string, string> = {
	neutral: "text-muted-foreground",
	amber: "text-amber-500",
	indigo: "text-indigo-500",
	blue: "text-blue-500",
	green: "text-green-600",
	purple: "text-purple-500",
	orange: "text-orange-500",
	emerald: "text-emerald-600",
	red: "text-red-500",
};

const COLUMN_ORDER: AppointmentStatus[] = [
	"WAITING",
	"SCHEDULED",
	"CHECK_IN",
	"IN_SERVICE",
	"HOSPITALIZED",
	"AWAITING_PAYMENT",
	"DONE",
	"CANCELLED",
];

const STATUS_TO_COLUMN_ID = Object.fromEntries(
	Object.entries(COLUMN_TO_STATUS).map(([col, status]) => [status, col]),
) as Record<AppointmentStatus, AppointmentColumn["id"]>;

export const APPOINTMENT_COLUMNS: AppointmentColumn[] = COLUMN_ORDER.map((status) => {
	const meta = STATUS_META[status];
	const Icon = meta.icon;
	return {
		id: STATUS_TO_COLUMN_ID[status],
		name: meta.label,
		count: 0,
		icon: <Icon className="size-4" />,
		accent: meta.accent,
	};
});

export function AppointmentColumnHeader({ column }: { column: AppointmentColumn }) {
	return (
		<div className="flex items-center justify-between px-2 py-2">
			<div className="flex items-center gap-2">
				<span className={cn(ACCENT_TEXT[column.accent] ?? ACCENT_TEXT.neutral)}>
					{column.icon}
				</span>
				<span className="text-sm font-semibold text-foreground">{column.name}</span>
				<span className="text-xs font-medium text-muted-foreground">{column.count}</span>
			</div>

			<div className="flex items-center gap-1">
				<Button
					size="icon-xs"
					variant="ghost"
				>
					<IconPlus />
				</Button>
				<Button
					size="icon-xs"
					variant="ghost"
				>
					<IconDots />
				</Button>
			</div>
		</div>
	);
}
