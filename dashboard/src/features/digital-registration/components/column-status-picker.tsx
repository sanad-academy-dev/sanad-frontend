import { useState, useMemo, useEffect } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
	IconClock,
	IconCircleCheck,
	IconCircleX,
	IconHourglass,
	IconClipboardCheck,
	IconActivity,
	IconCopy,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface ColumnStatusOption {
	id: string;
	name: string;
	shortcut: string;
	icon: React.ReactNode;
	pillIcon: React.ReactNode;
}

// حالات وأعمدة نظام التسجيل الرقمي الـ 8 المعتمدة بالأكاديمية
export const SYSTEM_REGISTRATION_COLUMNS: ColumnStatusOption[] = [
	{
		id: "queue",
		name: "طابور",
		shortcut: "1",
		icon: <IconClock className="size-3.5 text-blue-500 shrink-0" />,
		pillIcon: <IconClock className="size-2 text-blue-500" />,
	},
	{
		id: "shortlist",
		name: "قائمة مختصرة",
		shortcut: "2",
		icon: <IconClipboardCheck className="size-3.5 text-slate-500 shrink-0" />,
		pillIcon: <IconClipboardCheck className="size-2 text-slate-500" />,
	},
	{
		id: "waitlist",
		name: "قائمة الانتظار",
		shortcut: "3",
		icon: <IconClock className="size-3.5 text-amber-500 shrink-0" />,
		pillIcon: <IconClock className="size-2 text-amber-500" />,
	},
	{
		id: "interview",
		name: "المقابلة الشخصية",
		shortcut: "4",
		icon: <IconActivity className="size-3.5 text-indigo-500 shrink-0" />,
		pillIcon: <IconActivity className="size-2 text-indigo-500" />,
	},
	{
		id: "awaiting-payment",
		name: "بانتظار الدفع",
		shortcut: "5",
		icon: <IconHourglass className="size-3.5 text-purple-500 shrink-0" />,
		pillIcon: <IconHourglass className="size-2 text-purple-500" />,
	},
	{
		id: "accepted",
		name: "مقبول",
		shortcut: "6",
		icon: <IconCircleCheck className="size-3.5 text-emerald-500 shrink-0" />,
		pillIcon: <IconCircleCheck className="size-2 text-emerald-500" />,
	},
	{
		id: "rejected",
		name: "مرفوض",
		shortcut: "7",
		icon: <IconCircleX className="size-3.5 text-rose-500 shrink-0" />,
		pillIcon: <IconCircleX className="size-2 text-rose-500" />,
	},
	{
		id: "duplicate",
		name: "مكرر",
		shortcut: "8",
		icon: <IconCopy className="size-3.5 text-orange-500 shrink-0" />,
		pillIcon: <IconCopy className="size-2 text-orange-500" />,
	},
];

interface ColumnStatusPickerProps {
	value: string;
	onChange: (columnName: string) => void;
	className?: string;
	allowedIds?: string[];
}

export function ColumnStatusPicker({
	value,
	onChange,
	className,
	allowedIds,
}: ColumnStatusPickerProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// إيجاد العمود المختار حالياً لعرض أيقونته المناسبة داخل الحبة
	const currentColumn = useMemo(() => {
		return (
			SYSTEM_REGISTRATION_COLUMNS.find(
				(c) => c.name === value || c.id === value,
			) || SYSTEM_REGISTRATION_COLUMNS[0]
		);
	}, [value]);

	// تصفية الحالات بالبحث
	const filteredColumns = useMemo(() => {
		const q = searchQuery.trim().toLowerCase();
		const allowed = allowedIds
			? SYSTEM_REGISTRATION_COLUMNS.filter((c) => allowedIds.includes(c.id))
			: SYSTEM_REGISTRATION_COLUMNS;
		if (!q) return allowed;
		return allowed.filter((c) =>
			c.name.toLowerCase().includes(q),
		);
	}, [searchQuery, allowedIds]);

	// دعم الاختصار عبر لوحة المفاتيح عند فتح القائمة (0-7)
	useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = filteredColumns.find(
				(c) => c.shortcut === e.key,
			);
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
						"h-6.5 px-2 rounded-md border border-border/80 bg-background hover:bg-muted text-[10.5px] font-medium text-foreground flex items-center gap-1.5 transition-colors cursor-pointer select-none",
						className,
					)}
				>
					<span>{currentColumn.name}</span>
					{currentColumn.pillIcon}
				</button>
			</PopoverTrigger>

			<PopoverContent
				side="top"
				align="start"
				sideOffset={8}
				className="z-[99] w-48 sm:w-52 p-1 bg-popover text-popover-foreground border border-border/80 shadow-2xl rounded-xl select-none"
				dir="rtl"
			>
				{/* ─── الترويسة مع حقل البحث المطابق للتصميم ──────────────── */}
				<div className="px-2 py-1 border-b border-border/50 mb-0.5">
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="تغيير الحالة..."
						className="h-6 text-[11px] bg-transparent border-0 shadow-none focus-visible:ring-0 px-0.5 text-right placeholder:text-muted-foreground/70"
						autoFocus
					/>
				</div>

				{/* ─── قائمة الحالات المرتبطة بنظام التسجيل الرقمي ───────────── */}
				<div className="space-y-0.5 py-0.5">
					{filteredColumns.map((col) => {
						const isSelected =
							currentColumn.name === col.name || currentColumn.id === col.id;

						return (
							<button
								key={col.id}
								type="button"
								onClick={() => {
									onChange(col.name);
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
									{col.icon}
									<span className="truncate">{col.name}</span>
								</div>

								{/* الشمال: رقم الاختصار مطابق للصورة 837d7289 */}
								<span className="text-[11px] text-muted-foreground/50 font-mono shrink-0">
									{col.shortcut}
								</span>
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
}
