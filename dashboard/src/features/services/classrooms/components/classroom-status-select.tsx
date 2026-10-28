import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ClassroomStatusSelectProps {
	active: boolean;
	onChange: (newActive: boolean) => void;
	disabled?: boolean;
	className?: string;
}

export function ClassroomStatusSelect({
	active,
	onChange,
	disabled = false,
	className,
}: ClassroomStatusSelectProps) {
	return (
		<Select
			value={active ? "active" : "inactive"}
			onValueChange={(val) => {
				const next = val === "active";
				if (next !== active) {
					onChange(next);
				}
			}}
			disabled={disabled}
			dir="rtl"
		>
			<SelectTrigger
				size="sm"
				dir="rtl"
				className={cn(
					"!h-6 !py-0 px-2 text-[11px] font-medium rounded-md border-dashed transition-all cursor-pointer gap-1.5 [&_svg]:!size-3 justify-between w-auto min-w-[76px]",
					active
						? "border-emerald-400 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/60 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
						: "border-rose-300 bg-rose-50/50 text-rose-700 hover:bg-rose-100/60 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300",
					className,
				)}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent position="popper" align="start" className="min-w-28 p-1 z-[9999]" dir="rtl">
				<SelectItem value="active" className="text-xs cursor-pointer py-1.5 rounded-md hover:bg-muted">
					<span className="font-semibold text-emerald-700 dark:text-emerald-300">نشط</span>
				</SelectItem>
				<SelectItem value="inactive" className="text-xs cursor-pointer py-1.5 rounded-md hover:bg-muted">
					<span className="font-semibold text-rose-700 dark:text-rose-300">غير نشط</span>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

