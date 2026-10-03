import { IconAlertTriangle, IconClock } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type VitalsFreshness, vitalsFreshness } from "@sanad/contracts/runtime/server/vital-signs/vital-signs.type";

/** صياغة عمر القياس بالعربية — الدقّة تنقص كلما بعُد الوقت، فالساعة تكفي بعد يوم */
export function formatVitalsAge(recordedAt: Date | string, now = new Date()): string {
	const minutes = Math.floor((now.getTime() - new Date(recordedAt).getTime()) / 60_000);
	if (minutes < 0) return "مؤرَّخ للمستقبل";
	if (minutes < 1) return "الآن";
	if (minutes < 60) return `منذ ${minutes} دقيقة`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `منذ ${hours} ساعة`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `منذ ${days} يوم`;

	const months = Math.floor(days / 30);
	if (months < 12) return `منذ ${months} شهر`;
	return `منذ ${Math.floor(months / 12)} سنة`;
}

const VARIANT: Record<VitalsFreshness, "primary" | "sub" | "destructive"> = {
	FRESH: "primary",
	AGING: "sub",
	STALE: "destructive",
};

interface VitalsFreshnessBadgeProps {
	recordedAt: Date | string;
	className?: string;
	/** يخفي الأيقونة في المساحات الضيّقة كخلايا الجدول */
	iconless?: boolean;
}

export function VitalsFreshnessBadge({
	recordedAt,
	className,
	iconless = false,
}: VitalsFreshnessBadgeProps) {
	const freshness = vitalsFreshness(recordedAt);
	const Icon = freshness === "STALE" ? IconAlertTriangle : IconClock;

	return (
		<Badge
			variant={VARIANT[freshness]}
			className={cn("gap-1", className)}
		>
			{!iconless && <Icon />}
			{formatVitalsAge(recordedAt)}
		</Badge>
	);
}
