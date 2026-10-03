import { IconDots, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type {
	RadiologyAccent,
	RadiologyColumn,
} from "@/features/services/radiology/types/radiology.types";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<RadiologyAccent, string> = {
	neutral: "text-muted-foreground",
	amber: "text-amber-500",
	rose: "text-rose-500",
	indigo: "text-indigo-500",
	blue: "text-blue-500",
	green: "text-green-600",
};

export function RadiologyColumnHeader({ column }: { column: RadiologyColumn }) {
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
