import { cn } from "@/lib/utils";

// حلقة تقدّم دائرية (SVG stroke-dasharray) — نسبة الإكمال 0..100.
// أخضر للنجاح افتراضيًا؛ تعرض النسبة في المنتصف.
export function CompletionRing({
	value,
	size = 44,
	strokeWidth = 4,
	className,
	color = "#16A34A",
	trackColor = "#E7E7EE",
	colorClassName,
	trackClassName,
	labelClassName,
}: {
	value: number;
	size?: number;
	strokeWidth?: number;
	className?: string;
	color?: string;
	trackColor?: string;
	// أصناف Tailwind (stroke-*) تتجاوز الألوان الثابتة — لازمة لألوان الثيم/الوضع الليلي
	colorClassName?: string;
	trackClassName?: string;
	labelClassName?: string;
}) {
	const pct = Math.max(0, Math.min(100, Math.round(value)));
	const r = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * r;
	const offset = circumference * (1 - pct / 100);

	return (
		<div
			className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				// التدوير ليبدأ التعبئة من الأعلى؛ الاتجاه بصري لا يتأثر بـ RTL
				className="-rotate-90"
				aria-hidden
			>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={trackColor}
					strokeWidth={strokeWidth}
					className={trackClassName}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={color}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					className={cn(
						"transition-[stroke-dashoffset] duration-500 ease-out",
						colorClassName,
					)}
				/>
			</svg>
			<span
				className={cn(
					"absolute text-[10px] font-bold tabular-nums text-foreground",
					labelClassName,
				)}
			>
				{pct}%
			</span>
		</div>
	);
}
