import { useState, useMemo, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
	IconDots,
	IconAlertCircle,
	IconArrowUp,
	IconArrowDown,
	IconAntennaBars3,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface PriorityOption {
	id: string;
	name: string;
	shortcut: string;
	icon: React.ReactNode;
	pillIcon: React.ReactNode;
	color: string;
}

// مستويات الأولوية مطابقة تماماً للتصميم المرفق (الصورة b52ca17c)
export const PRIORITY_OPTIONS: PriorityOption[] = [
	{
		id: "none",
		name: "بدون أولوية",
		shortcut: "0",
		icon: <IconDots className="size-3.5 text-muted-foreground/60 shrink-0" />,
		pillIcon: <IconDots className="size-3 text-muted-foreground/60 shrink-0" />,
		color: "text-muted-foreground",
	},
	{
		id: "urgent",
		name: "عاجلة",
		shortcut: "1",
		icon: <IconAlertCircle className="size-3.5 text-rose-500 shrink-0" />,
		pillIcon: <IconAlertCircle className="size-3 text-rose-500 shrink-0" />,
		color: "text-rose-500",
	},
	{
		id: "high",
		name: "مرتفعة",
		shortcut: "2",
		icon: <IconArrowUp className="size-3.5 text-orange-500 stroke-[2.5] shrink-0" />,
		pillIcon: <IconArrowUp className="size-3 text-orange-500 stroke-[2.5] shrink-0" />,
		color: "text-orange-500",
	},
	{
		id: "medium",
		name: "متوسطة",
		shortcut: "3",
		icon: <IconAntennaBars3 className="size-3.5 text-amber-500 shrink-0" />,
		pillIcon: <IconAntennaBars3 className="size-3 text-amber-500 shrink-0" />,
		color: "text-amber-500",
	},
	{
		id: "low",
		name: "منخفضة",
		shortcut: "4",
		icon: <IconArrowDown className="size-3.5 text-slate-400 stroke-[2.5] shrink-0" />,
		pillIcon: <IconArrowDown className="size-3 text-slate-400 stroke-[2.5] shrink-0" />,
		color: "text-slate-400",
	},
];

interface PriorityPickerPopoverProps {
	value: string;
	onChange: (priorityName: string) => void;
	className?: string;
}

export function PriorityPickerPopover({
	value,
	onChange,
	className,
}: PriorityPickerPopoverProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// الخيار المختار حالياً
	const currentOption = useMemo(() => {
		return (
			PRIORITY_OPTIONS.find(
				(p) => p.name === value || p.id === value,
			) || PRIORITY_OPTIONS[0]
		);
	}, [value]);

	// تصفية الأولويات بالبحث
	const filteredOptions = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		if (!q) return PRIORITY_OPTIONS;
		return PRIORITY_OPTIONS.filter((p) => p.name.toLowerCase().includes(q));
	}, [searchQuery]);

	// دعم اختصارات لوحة المفاتيح (0-4)
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = PRIORITY_OPTIONS.find((p) => p.shortcut === e.key);
			if (target) {
				e.preventDefault();
				onChange(target.name);
				setOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onChange]);

	return (
		<Popover
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) setSearchQuery("");
			}}
		>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"h-6.5 px-2 rounded-md border text-[10.5px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer select-none",
						currentOption.id !== "none"
							? "border-border/90 bg-muted/70 text-foreground font-semibold"
							: "border-border/80 bg-background hover:bg-muted text-foreground",
						className,
					)}
				>
					{currentOption.pillIcon}
					<span>{currentOption.name}</span>
				</button>
			</PopoverTrigger>

			<PopoverContent
				side="top"
				align="start"
				sideOffset={8}
				className="z-[99] w-44 sm:w-48 p-1 bg-popover text-popover-foreground border border-border/80 shadow-2xl rounded-xl select-none"
				dir="rtl"
			>
				{/* ─── الترويسة مع حقل البحث المطابق للتصميم ──────────────── */}
				<div className="px-2 py-1 border-b border-border/50 mb-0.5">
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="حدد الأولوية..."
						className="h-6 text-[11px] bg-transparent border-0 shadow-none focus-visible:ring-0 px-0.5 text-right placeholder:text-muted-foreground/70"
						autoFocus
					/>
				</div>

				{/* ─── قائمة مستويات الأولوية ───────────────────────────────── */}
				<div className="space-y-0.5 py-0.5">
					{filteredOptions.map((opt) => {
						const isSelected = currentOption.id === opt.id;

						return (
							<button
								key={opt.id}
								type="button"
								onClick={() => {
									onChange(opt.name);
									setOpen(false);
								}}
								className={cn(
									"w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-right group",
									isSelected
										? "bg-muted/90 font-bold text-foreground"
										: "hover:bg-muted/60 text-foreground",
								)}
							>
								{/* اليمين: الأيقونة + الاسم */}
								<div className="flex items-center gap-2 min-w-0">
									{opt.icon}
									<span className="truncate">{opt.name}</span>
								</div>

								{/* الشمال: رقم الاختصار مطابق للصورة b52ca17c */}
								<span className="text-[11px] text-muted-foreground/50 font-mono shrink-0">
									{opt.shortcut}
								</span>
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
