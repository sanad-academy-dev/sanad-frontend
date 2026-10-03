import { IconInfoCircle } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

type StatsVariant = "default" | "inventory" | "compact";

// تلميح موحّد لكل بطاقات الإحصائيات: أيقونة InfoCircle + محتوى أكبر قليلًا.
// مصدر واحد يضمن تطابق التلميحات في كل مكان بالتطبيق.
function StatTooltip({ tooltip }: { tooltip: string }) {
	return (
		<Tooltip>
			<TooltipTrigger>
				<IconInfoCircle
					className="size-4 text-[#08090A]"
					stroke={1.5}
				/>
			</TooltipTrigger>
			<TooltipContent className="max-w-[300px] px-4 py-2.5 text-sm leading-relaxed">
				<p>{tooltip}</p>
			</TooltipContent>
		</Tooltip>
	);
}

export function Stats({
	className,
	stats,
	variant = "default",
}: {
	className?: string;
	stats: StatItem[];
	variant?: StatsVariant;
}) {
	return (
		<div
			// حشوة رأسية موحّدة ومتساوية (أعلى=أسفل) لصف بطاقات الإحصائيات في كل النظام
			className={cn("grid gap-1.5 py-1.5", variant === "inventory" && "gap-[6px]", className)}
			style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
		>
			{stats.map((stat) => {
				if (variant === "inventory")
					return (
						<InventoryStatCard
							key={stat.title}
							{...stat}
						/>
					);
				if (variant === "compact")
					return (
						<CompactStatCard
							key={stat.title}
							{...stat}
						/>
					);
				return (
					<StatCard
						key={stat.title}
						{...stat}
					/>
				);
			})}
		</div>
	);
}

function StatCard({ title, value, tooltip, valueLabel }: StatItem) {
	return (
		<div className="flex items-center justify-between p-3 border rounded-[4px]">
			<p className="text-sm font-medium flex items-center gap-2">
				{title}
				<StatTooltip tooltip={tooltip} />
			</p>

			<p className="text-lg font-bold">{valueLabel ?? value}</p>
		</div>
	);
}

// بطاقة مضغوطة (45px) — القيم البصرية حرفية من Figma node 4558-470961
function CompactStatCard({ title, value, tooltip, valueLabel }: StatItem) {
	return (
		<div className="flex h-[45px] items-center justify-between rounded-[4px] border border-[#E5E5E5] bg-white px-3">
			{/* التسمية — يمين (12px / 500 / #08090A) */}
			<p className="flex items-center gap-2 text-[12px] font-medium leading-[18px] text-[#08090A]">
				{title}
				<StatTooltip tooltip={tooltip} />
			</p>

			{/* القيمة — يسار (14px / 700 / #08090A) */}
			<span className="text-[14px] font-bold leading-[21px] text-[#08090A] tabular-nums">
				{valueLabel ?? value}
			</span>
		</div>
	);
}

// القيم البصرية حرفية من get_code (Figma node 1080-34617)
function InventoryStatCard({ title, value, tooltip, valueLabel }: StatItem) {
	return (
		<div className="flex h-[55px] items-center justify-between rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[9px]">
			{/* label — يمين (12px / 500 / #08090A) */}
			<p className="flex items-center gap-[4px] text-[12px] font-medium leading-[16px] text-[#08090A]">
				{title}
				<StatTooltip tooltip={tooltip} />
			</p>

			{/* value — يسار (14px / 700 / #08090A) */}
			<span className="text-[14px] font-bold leading-[21px] text-[#08090A]">
				{valueLabel ?? value}
			</span>
		</div>
	);
}
