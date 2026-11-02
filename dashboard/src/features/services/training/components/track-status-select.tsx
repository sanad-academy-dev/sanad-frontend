import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { TrackStatus } from "./tracks-view";

const STATUS_CONFIG: Record<
	TrackStatus,
	{ label: string; text: string; dot: string; border: string; bg: string }
> = {
	ACTIVE: {
		label: "نشط",
		text: "text-emerald-700 dark:text-emerald-300",
		dot: "bg-emerald-500",
		border: "border-emerald-300 dark:border-emerald-800",
		bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
	},
	PENDING: {
		label: "جاري",
		text: "text-blue-700 dark:text-blue-300",
		dot: "bg-blue-500",
		border: "border-blue-300 dark:border-blue-800",
		bg: "bg-blue-50/70 dark:bg-blue-950/30",
	},
	COMPLETED: {
		label: "مكتمل",
		text: "text-purple-700 dark:text-purple-300",
		dot: "bg-purple-500",
		border: "border-purple-300 dark:border-purple-800",
		bg: "bg-purple-50/70 dark:bg-purple-950/30",
	},
	DRAFT: {
		label: "مسودة",
		text: "text-muted-foreground",
		dot: "bg-muted-foreground",
		border: "border-border",
		bg: "bg-muted/40",
	},
};

interface TrackStatusSelectProps {
	status: TrackStatus;
	onChange: (newStatus: TrackStatus) => void;
	disabled?: boolean;
	className?: string;
}

export function TrackStatusSelect({
	status,
	onChange,
	disabled = false,
	className,
}: TrackStatusSelectProps) {
	const currentCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;

	return (
		<div onClick={(e) => e.stopPropagation()}>
			<Select
				value={status}
				onValueChange={(val) => {
					if (val && val !== status) {
						onChange(val as TrackStatus);
					}
				}}
				disabled={disabled}
				dir="rtl"
			>
				<SelectTrigger
					size="sm"
					dir="rtl"
					className={cn(
						"!h-6 !py-0 px-2 text-[11px] font-medium rounded-md border transition-all cursor-pointer gap-1.5 [&_svg]:!size-3 justify-between w-auto min-w-[84px]",
						currentCfg.border,
						currentCfg.bg,
						currentCfg.text,
						className,
					)}
				>
					<div className="flex items-center gap-1.5">
						<span className={cn("size-1.5 rounded-full shrink-0", currentCfg.dot)} />
						<span>{currentCfg.label}</span>
					</div>
				</SelectTrigger>
				<SelectContent
					position="popper"
					align="start"
					className="min-w-32 p-1 z-[9999]"
					dir="rtl"
				>
					{(Object.keys(STATUS_CONFIG) as TrackStatus[]).map((key) => {
						const cfg = STATUS_CONFIG[key];
						return (
							<SelectItem
								key={key}
								value={key}
								className="text-xs cursor-pointer py-1.5 rounded-md hover:bg-muted"
							>
								<div className="flex items-center gap-2">
									<span className={cn("size-2 rounded-full shrink-0", cfg.dot)} />
									<span className={cn("font-medium", cfg.text)}>{cfg.label}</span>
								</div>
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}

