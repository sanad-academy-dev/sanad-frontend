import { IconBell } from "@tabler/icons-react";

import type { AlertsLiveState } from "@/features/appointments/hooks/use-appointment-alerts";
import { cn } from "@/lib/utils";

type LiveBadgeProps = {
	state: AlertsLiveState;
};

export function LiveBadge({ state }: LiveBadgeProps) {
	const live = state === "live";
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 text-xs",
				!live && "text-muted-foreground",
			)}
			title={live ? "تحديث مباشر كل دقيقة" : "تعذّر الاتصال — قد تكون التنبيهات غير محدّثة"}
		>
			<span
				className={cn(
					"font-bold text-[10px]",
					live ? "text-foreground" : "text-muted-foreground",
				)}
			>
				{live ? "مباشر" : "غير متصل"}
			</span>
			<IconBell
				className={cn("size-4 shrink-0", live ? "text-red-400" : "text-muted-foreground/50")}
				stroke={1.75}
			/>
		</div>
	);
}
