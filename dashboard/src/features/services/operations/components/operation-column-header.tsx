import { IconDots, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type {
	OperationAccent,
	OperationColumn,
} from "@/features/services/operations/types/operations.types";
import { notifyPlaceholder } from "@/features/services/operations/utils/placeholder-notice";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<OperationAccent, string> = {
	amber: "text-amber-500",
	orange: "text-orange-500",
	rose: "text-rose-500",
	indigo: "text-indigo-500",
	violet: "text-violet-500",
	blue: "text-blue-500",
	teal: "text-teal-500",
	green: "text-green-600",
};

export function OperationColumnHeader({ column }: { column: OperationColumn }) {
	return (
		<div className="flex items-center justify-between px-2 py-2">
			<div className="flex items-center gap-2">
				<span className={cn(ACCENT_TEXT[column.accent])}>{column.icon}</span>
				<span className="text-sm font-semibold text-foreground">{column.name}</span>
				<span className="text-xs font-medium text-muted-foreground">{column.count}</span>
			</div>

			<div className="flex items-center gap-1">
				<Button
					size="icon-xs"
					variant="ghost"
					onClick={notifyPlaceholder}
				>
					<IconPlus />
				</Button>
				<Button
					size="icon-xs"
					variant="ghost"
					onClick={notifyPlaceholder}
				>
					<IconDots />
				</Button>
			</div>
		</div>
	);
}
