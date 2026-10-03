"use client";

import { Label, Pie, PieChart } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type ChartPieDonutDatum = {
	key: string;
	label: string;
	value: number;
	fill: string;
};

export function ChartPieDonut({
	data,
	className,
	centerLabel,
	centerValue,
}: {
	data: ChartPieDonutDatum[];
	className?: string;
	centerLabel?: string;
	centerValue?: string;
}) {
	const chartConfig: ChartConfig = Object.fromEntries(
		data.map((item) => [
			item.key,
			{
				label: item.label,
				color: item.fill,
			},
		]),
	);

	return (
		<ChartContainer
			config={chartConfig}
			className={cn("mx-auto h-52 w-full max-w-[220px] aspect-square", className)}
		>
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel nameKey="key" />}
				/>
				<Pie
					data={data}
					dataKey="value"
					nameKey="key"
					innerRadius={62}
					paddingAngle={3}
					cornerRadius={10}
					stroke="var(--background)"
					strokeWidth={4}
				>
					{centerValue || centerLabel ? (
						<Label
							content={({ viewBox }) => {
								if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
									return null;
								}

								return (
									<text
										x={viewBox.cx}
										y={viewBox.cy}
										textAnchor="middle"
										dominantBaseline="middle"
									>
										{centerValue ? (
											<tspan
												x={viewBox.cx}
												y={viewBox.cy}
												className="fill-foreground text-base font-semibold"
											>
												{centerValue}
											</tspan>
										) : null}
										{centerLabel ? (
											<tspan
												x={viewBox.cx}
												y={viewBox.cy + (centerValue ? 18 : 0)}
												className="fill-muted-foreground text-[11px]"
											>
												{centerLabel}
											</tspan>
										) : null}
									</text>
								);
							}}
						/>
					) : null}
				</Pie>
			</PieChart>
		</ChartContainer>
	);
}
