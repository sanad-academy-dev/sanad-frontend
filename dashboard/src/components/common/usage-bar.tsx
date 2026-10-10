import { Progress } from "@/components/ui/progress";

interface UsageBarProps {
	count: number;
	max: number;
}

export function UsageBar({ count, max }: UsageBarProps) {
	const pct = max > 0 ? Math.round((count / max) * 100) : 0;

	return (
		<div className="flex w-full items-center gap-2 px-1">
			<Progress
				value={pct}
				className="flex-1"
			/>
			<span className="w-8 shrink-0 tabular-nums text-right text-xs text-muted-foreground/60">
				{pct}%
			</span>
		</div>
	);
}
