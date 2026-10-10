import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type SpendDatum = { day: string; spend: number };

const DEFAULT_DATA: SpendDatum[] = [
	{ day: "6 يوليو", spend: 12 },
	{ day: "7 يوليو", spend: 30 },
	{ day: "8 يوليو", spend: 18 },
	{ day: "9 يوليو", spend: 45 },
	{ day: "10 يوليو", spend: 60 },
	{ day: "11 يوليو", spend: 22 },
	{ day: "12 يوليو", spend: 15 },
];

const chartConfig = {
	spend: { label: "الإنفاق (ر.س)", color: "var(--chart-1)" },
} satisfies ChartConfig;

// مخطط إجمالي الإنفاق اليومي (frame 4170)
export const AgentUsageChart = ({
	data = DEFAULT_DATA,
	className,
}: {
	data?: SpendDatum[];
	className?: string;
}) => (
	<ChartContainer
		config={chartConfig}
		className={cn("h-56 w-full aspect-auto justify-stretch", className)}
	>
		<AreaChart
			accessibilityLayer
			data={data}
			margin={{ top: 8, right: -50, left: 0, bottom: 0 }}
		>
			<CartesianGrid vertical={false} />
			<YAxis
				orientation="right"
				tickLine={false}
				axisLine={false}
				allowDecimals={false}
			/>
			<XAxis
				dataKey="day"
				reversed
				tickLine={false}
				tickMargin={10}
				axisLine={false}
				interval={0}
			/>
			<ChartTooltip
				cursor={false}
				content={<ChartTooltipContent indicator="dashed" />}
			/>
			<Area
				dataKey="spend"
				type="natural"
				fill="var(--color-spend)"
				fillOpacity={0.2}
				stroke="var(--color-spend)"
			/>
		</AreaChart>
	</ChartContainer>
);
