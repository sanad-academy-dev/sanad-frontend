import { cn } from "@/lib/utils";

export interface AvatarCircleItem {
	id: string | number;
	name: string;
	title?: string;
}

// ألوان الباستيل الناعمة للطلاب مطابقة تماماً للتصميم المرفق (خوخي، وردي، نعناعي، حشيشي، بنفسجي، كهرماني)
const PASTEL_PALETTE = [
	{
		bg: "bg-[#FDE8E1]",
		text: "text-[#9A3412]",
		darkBg: "dark:bg-[#7C2D12]/35",
		darkText: "dark:text-[#FDBA74]",
	}, // Peach / Apricot
	{
		bg: "bg-[#FCE7F3]",
		text: "text-[#BE185D]",
		darkBg: "dark:bg-[#831843]/35",
		darkText: "dark:text-[#F472B6]",
	}, // Pink / Rose
	{
		bg: "bg-[#CCFBF1]",
		text: "text-[#0F766E]",
		darkBg: "dark:bg-[#134E4A]/35",
		darkText: "dark:text-[#5EEAD4]",
	}, // Mint / Teal
	{
		bg: "bg-[#DCFCE7]",
		text: "text-[#166534]",
		darkBg: "dark:bg-[#14532D]/35",
		darkText: "dark:text-[#86EFAC]",
	}, // Sage / Green
	{
		bg: "bg-[#EDE9FE]",
		text: "text-[#6D28D9]",
		darkBg: "dark:bg-[#4C1D95]/35",
		darkText: "dark:text-[#C4B5FD]",
	}, // Lavender / Violet
	{
		bg: "bg-[#FEF3C7]",
		text: "text-[#B45309]",
		darkBg: "dark:bg-[#78350F]/35",
		darkText: "dark:text-[#FCD34D]",
	}, // Amber / Cream
];

function getInitialLetter(name?: string | null): string {
	if (!name) return "—";
	const trimmed = name.trim();
	if (!trimmed) return "—";
	return Array.from(trimmed)[0].toUpperCase();
}

function getPastelColor(index: number, name?: string) {
	if (name) {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = (hash << 5) - hash + name.charCodeAt(i);
		}
		return PASTEL_PALETTE[Math.abs(hash) % PASTEL_PALETTE.length];
	}
	return PASTEL_PALETTE[index % PASTEL_PALETTE.length];
}

export interface AvatarCirclesStackProps {
	items: AvatarCircleItem[];
	maxVisible?: number;
	variant?: "pastel" | "mauve";
	className?: string;
	emptyText?: string;
	onItemClick?: (item: AvatarCircleItem) => void;
}

export function AvatarCirclesStack({
	items,
	maxVisible = 3,
	variant = "pastel",
	className,
	emptyText = "—",
	onItemClick,
}: AvatarCirclesStackProps) {
	if (!items || items.length === 0) {
		return <span className="text-muted-foreground text-xs select-none">{emptyText}</span>;
	}

	const visible = items.slice(0, maxVisible);
	const overflow = items.length - visible.length;

	return (
		<div
			className={cn("flex items-center gap-1.5 w-fit", className)}
			dir="rtl"
		>
			<div className="flex items-center -space-x-2 space-x-reverse">
				{visible.map((item, idx) => {
					const initial = getInitialLetter(item.name);
					const tooltip = item.title || item.name;

					if (variant === "mauve") {
						return (
							<div
								key={item.id ?? idx}
								className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background bg-[#EDE9FE] text-[#7C3AED] dark:bg-[#7C3AED]/25 dark:text-[#DDD6FE] text-xs font-semibold shadow-2xs transition-transform hover:scale-110 hover:z-20 cursor-default select-none"
								title={tooltip}
								onClick={(e) => {
									if (onItemClick) {
										e.stopPropagation();
										onItemClick(item);
									}
								}}
							>
								{initial}
							</div>
						);
					}

					const color = getPastelColor(idx, item.name);
					return (
						<div
							key={item.id ?? idx}
							className={cn(
								"flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background text-xs font-semibold shadow-2xs transition-transform hover:scale-110 hover:z-20 cursor-default select-none",
								color.bg,
								color.text,
								color.darkBg,
								color.darkText,
							)}
							title={tooltip}
							onClick={(e) => {
								if (onItemClick) {
									e.stopPropagation();
									onItemClick(item);
								}
							}}
						>
							{initial}
						</div>
					);
				})}
			</div>
			{overflow > 0 && (
				<span
					className="text-xs font-semibold text-muted-foreground select-none tabular-nums"
					title={items.slice(maxVisible).map((it) => it.name).join("، ")}
				>
					+{overflow}
				</span>
			)}
		</div>
	);
}
