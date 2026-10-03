"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type ChartBarMultipleDatum = {
	day: string;
	newCases: number;
	followUps: number;
};

const defaultChartData: ChartBarMultipleDatum[] = [
	{ day: "الأحد", newCases: 14, followUps: 8 },
	{ day: "الاثنين", newCases: 18, followUps: 11 },
	{ day: "الثلاثاء", newCases: 12, followUps: 9 },
	{ day: "الأربعاء", newCases: 20, followUps: 13 },
	{ day: "الخميس", newCases: 17, followUps: 10 },
	{ day: "الجمعة", newCases: 9, followUps: 6 },
	{ day: "السبت", newCases: 11, followUps: 7 },
];

const chartConfig = {
	newCases: {
		label: "حالات جديدة",
		color: "var(--chart-1)",
	},
	followUps: {
		label: "متابعات",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export function ChartBarMultiple({
	data = defaultChartData,
	className,
}: {
	data?: ChartBarMultipleDatum[];
	className?: string;
}) {
	return (
		<ChartContainer
			config={chartConfig}
			className={cn("h-56 w-full aspect-auto justify-stretch", className)}
		>
			<BarChart
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
				<Bar dataKey="newCases" fill="var(--color-newCases)" radius={6} />
				<Bar dataKey="followUps" fill="var(--color-followUps)" radius={6} />
			</BarChart>
		</ChartContainer>
	);
}
