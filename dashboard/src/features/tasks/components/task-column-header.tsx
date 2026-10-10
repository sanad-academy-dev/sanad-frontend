import { IconDots, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import type { TaskColumn } from "@/features/tasks/types/task.types";

export function TaskColumnHeader({ column }: { column: TaskColumn }) {
	return (
		<div className="flex items-center justify-between px-2 py-2">
			<div className="flex items-center gap-2">
				{column.icon}
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
