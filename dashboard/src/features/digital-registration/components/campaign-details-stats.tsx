import {
	IconClock,
	IconClipboardCheck,
	IconHourglass,
	IconCheck,
	IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface RegistrationStatsProps {
	queueCount?: number;
	evaluationCount?: number;
	waitingCount?: number;
	acceptedCount?: number;
	rejectedCount?: number;
}

export function RegistrationStatsBar({
	queueCount = 0,
	evaluationCount = 0,
	waitingCount = 0,
	acceptedCount = 0,
	rejectedCount = 0,
}: RegistrationStatsProps) {
	const items = [
		{
			id: "queue",
			label: "الطابور",
			count: queueCount,
			icon: IconClock,
			color: "text-blue-600 dark:text-blue-400",
		},
		{
			id: "evaluation",
			label: "داخل التقييم",
			count: evaluationCount,
			icon: IconClipboardCheck,
			color: "text-amber-600 dark:text-amber-400",
		},
		{
			id: "waiting",
			label: "بالإنتظار",
			count: waitingCount,
			icon: IconHourglass,
			color: "text-purple-600 dark:text-purple-400",
		},
		{
			id: "accepted",
			label: "مقبولين",
			count: acceptedCount,
			icon: IconCheck,
			color: "text-emerald-600 dark:text-emerald-400",
		},
		{
			id: "rejected",
			label: "المرفوضين",
			count: rejectedCount,
			icon: IconX,
			color: "text-rose-600 dark:text-rose-400",
		},
	];

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 px-3 pt-2 pb-1 select-none" dir="rtl">
			{items.map((item) => (
				<div
					key={item.id}
					className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3 py-1.5 shadow-2xs hover:border-primary/40 transition-colors"
				>
					<span className="text-base font-bold text-foreground tabular-nums">
						{item.count}
					</span>
					<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
						<span># {item.label}</span>
						<item.icon className={cn("size-3", item.color)} />
					</div>
				</div>
			))}
		</div>
	);
}

// Preserve existing detail stats component for compatibility
export { RegistrationStatsBar as CampaignDetailsStats };
