import {
	IconAlertTriangleFilled,
	IconCalendarOff,
	IconClockExclamation,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import type { OperationCardData } from "@/features/services/operations/types/operations.types";
import { isOperationDue } from "@sanad/contracts/runtime/server/operations/operations.workflow";

const MAX_VISIBLE = 6;

type OperationAlert = {
	id: string;
	patientName: string;
	label: string;
	tone: "urgent" | "warn";
};

const ACTIVE_COLUMNS = new Set(["SCHEDULED", "PREP", "ANESTHESIA", "SURGERY", "RECOVERY"]);

// شريط تنبيهات العمليات: الفورية/العاجلة، وغير المجدولة، والمتأخرة عن موعدها.
// تنبيهات البوابات (موافقة ناقصة، صيام غير موثَّق...) تنضم في OP2.
const buildAlerts = (cards: OperationCardData[]): OperationAlert[] =>
	cards.flatMap((operation) => {
		if (!ACTIVE_COLUMNS.has(operation.column)) return [];
		const alerts: OperationAlert[] = [];
		if (operation.isUrgent)
			alerts.push({
				id: `${operation.id}-urgent`,
				patientName: operation.patient.name,
				label: `${operation.name} · ${operation.timeLabel}`,
				tone: "urgent",
			});
		if (!operation.raw.scheduledAt)
			alerts.push({
				id: `${operation.id}-unscheduled`,
				patientName: operation.patient.name,
				label: "بلا موعد",
				tone: "warn",
			});
		else if (operation.column === "SCHEDULED" && isOperationDue(operation.raw.scheduledAt))
			alerts.push({
				id: `${operation.id}-overdue`,
				patientName: operation.patient.name,
				label: `تأخّرت عن موعدها ${operation.timeLabel}`,
				tone: "warn",
			});
		return alerts;
	});

export function OperationsAlertsStrip({ cards }: { cards: OperationCardData[] }) {
	const alerts = buildAlerts(cards);
	const visible = alerts.slice(0, MAX_VISIBLE);
	const overflow = alerts.length - visible.length;

	return (
		<div className="flex items-center gap-3 px-4 min-h-8">
			{alerts.length > 0 && (
				<Badge className="shrink-0 gap-1 border-red-200 bg-red-50 py-0.5 text-[10px] text-red-700">
					<IconAlertTriangleFilled className="size-3" />
					تنبيهات العمليات
				</Badge>
			)}

			<div className="flex flex-wrap items-center gap-1.5">
				{visible.map((alert) => (
					<span
						key={alert.id}
						className={
							alert.tone === "urgent"
								? "flex items-center gap-1.5 rounded-[4px] border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] text-red-700"
								: "flex items-center gap-1.5 rounded-[4px] border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700"
						}
					>
						<span className="font-semibold">{alert.patientName}</span>
						<span className={alert.tone === "urgent" ? "text-red-600" : "text-amber-600"}>
							•
						</span>
						{alert.tone === "warn" &&
							(alert.label === "بلا موعد" ? (
								<IconCalendarOff className="size-3" />
							) : (
								<IconClockExclamation className="size-3" />
							))}
						<span>{alert.label}</span>
					</span>
				))}
				{overflow > 0 && (
					<span className="text-[11px] text-muted-foreground">+{overflow} أخرى</span>
				)}
			</div>
		</div>
	);
}
