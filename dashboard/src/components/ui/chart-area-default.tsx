"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type ChartAreaDefaultDatum = {
	month: string;
	revenue: number;
};

const defaultChartData: ChartAreaDefaultDatum[] = [
	{ month: "يناير", revenue: 18000 },
	{ month: "فبراير", revenue: 22500 },
	{ month: "مارس", revenue: 19800 },
	{ month: "أبريل", revenue: 25400 },
	{ month: "مايو", revenue: 23100 },
	{ month: "يونيو", revenue: 27900 },
	{ month: "يوليو", revenue: 24800 },
	{ month: "أغسطس", revenue: 28600 },
	{ month: "سبتمبر", revenue: 26700 },
	{ month: "أكتوبر", revenue: 29400 },
	{ month: "نوفمبر", revenue: 28100 },
	{ month: "ديسمبر", revenue: 31800 },
];

const chartConfig = {
	revenue: {
		label: "الإيرادات",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function ChartAreaDefault({
	data = defaultChartData,
	className,
}: {
	data?: ChartAreaDefaultDatum[];
	className?: string;
}) {
	return (
		<ChartContainer
			config={chartConfig}
			className={cn("h-56 w-full aspect-auto justify-stretch", className)}
		>
			<AreaChart
				accessibilityLayer
				data={data}
				margin={{ top: 8, right: -30, left: 20, bottom: 0 }}
			>
				<CartesianGrid vertical={false} />
				<YAxis
					orientation="right"
					tickLine={false}
					axisLine={false}
					allowDecimals={false}
					width={44}
					tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
				/>
				<XAxis
					dataKey="month"
					reversed
					tickLine={false}
					axisLine={false}
					tickMargin={10}
					interval={0}
				/>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent indicator="line" />}
				/>
				<Area
					dataKey="revenue"
					type="natural"
					fill="var(--color-revenue)"
					fillOpacity={0.24}
					stroke="var(--color-revenue)"
					strokeWidth={2}
				/>
			</AreaChart>
		</ChartContainer>
	);
}
