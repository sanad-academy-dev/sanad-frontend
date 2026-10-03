import type {
	GroomingAccent,
	GroomingColumn,
} from "@/features/care/grooming/data/grooming-columns";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<GroomingAccent, string> = {
	neutral: "text-muted-foreground",
	amber: "text-amber-500",
	rose: "text-rose-500",
	indigo: "text-indigo-500",
	blue: "text-blue-500",
	green: "text-green-600",
};

export function GroomingColumnHeader({ column }: { column: GroomingColumn }) {
	return (
		<div className="flex items-center justify-between px-2 py-2">
			<div className="flex items-center gap-2">
				<span className={cn(ACCENT_TEXT[column.accent] ?? ACCENT_TEXT.neutral)}>
					{column.icon}
				</span>
				<span className="font-semibold text-foreground text-sm">{column.name}</span>
				<span className="font-medium text-muted-foreground text-xs">{column.count}</span>
			</div>
		</div>
	);
}
