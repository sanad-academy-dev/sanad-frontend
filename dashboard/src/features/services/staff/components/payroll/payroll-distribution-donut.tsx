// توزيع تكلفة الشركة — يقرأ من لقطة distribution المثبّتة عند الاعتماد،
// لا من إعادة احتساب، حتى لا يتغيّر تقرير مسير معتمد.
import type { ReactNode } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useCurrency } from "@/hooks/use-currency";

// اللقطة المحفوظة على المسير عند الاعتماد
export interface PayrollDistribution {
	baseSalaries: number;
	allowances: number;
	overtime: number;
	additionalEarnings: number;
	leaveDeductions: number;
	employeeGosi: number;
	companyGosi: number;
}

// سبع فئات على التوكنز 1–7؛ 6 و7 أُضيفتا بألوان متمايزة عن تدرّج الأزرق
const SLICES: { key: keyof PayrollDistribution; label: string; color: string }[] = [
	{ key: "baseSalaries", label: "رواتب أساسية", color: "var(--color-chart-3)" },
	{ key: "allowances", label: "بدلات", color: "var(--color-chart-1)" },
	{ key: "overtime", label: "عمل إضافي", color: "var(--color-chart-2)" },
	{ key: "additionalEarnings", label: "استحقاقات إضافية", color: "var(--color-chart-6)" },
	{ key: "companyGosi", label: "حصة الشركة", color: "var(--color-chart-4)" },
	{ key: "employeeGosi", label: "استقطاعات الموظفين", color: "var(--color-chart-5)" },
	{ key: "leaveDeductions", label: "خصومات الإجازات", color: "var(--color-chart-7)" },
];

export function PayrollDistributionDonut({
	distribution,
	title = "توزيع تكلفة الشركة",
	action,
}: {
	distribution: PayrollDistribution | null;
	title?: string;
	action?: ReactNode;
}) {
	const { format } = useCurrency();
	if (!distribution) return null;

	const data = SLICES.map((s) => ({
		key: s.key,
		label: s.label,
		value: Math.max(0, Number(distribution[s.key] ?? 0)),
		fill: s.color,
	})).filter((d) => d.value > 0);

	const total = data.reduce((sum, d) => sum + d.value, 0);
	if (total === 0) return null;

	const chartConfig = Object.fromEntries(
		data.map((d) => [d.key, { label: d.label, color: d.fill }]),
	) satisfies ChartConfig;

	return (
		<div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
			<div className="flex items-center justify-between gap-2">
				<span className="font-heading text-sm font-bold text-foreground">{title}</span>
				{action}
			</div>

			<div className="flex flex-col items-center gap-3 sm:flex-row">
				<ChartContainer
					config={chartConfig}
					className="aspect-square h-[180px] w-[180px] shrink-0"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={data}
							dataKey="value"
							nameKey="label"
							innerRadius={52}
							strokeWidth={4}
						>
							<Label
								content={({ viewBox }) => {
									if (!viewBox || !("cx" in viewBox)) return null;
									return (
										<text
											x={viewBox.cx}
											y={viewBox.cy}
											textAnchor="middle"
											dominantBaseline="middle"
										>
											<tspan
												x={viewBox.cx}
												y={viewBox.cy}
												className="fill-foreground text-[13px] font-bold"
											>
												{Math.round(total).toLocaleString("en-US")}
											</tspan>
											<tspan
												x={viewBox.cx}
												y={(viewBox.cy ?? 0) + 16}
												className="fill-muted-foreground text-[10px]"
											>
												ر.س
											</tspan>
										</text>
									);
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>

				{/* الوسيلة مع النِسَب — الفئات كثيرة فلا تكفي الألوان وحدها */}
				<div className="grid w-full grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
					{data.map((d) => (
						<div
							key={d.key}
							className="flex items-center justify-between gap-2"
						>
							<span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
								<span
									className="size-[8px] shrink-0 rounded-[4px]"
									style={{ backgroundColor: d.fill }}
								/>
								{d.label}
							</span>
							<span className="text-[11px] text-foreground tabular-nums">
								{format(d.value)}
								<span className="ms-1 text-[10px] text-muted-foreground">
									({((d.value / total) * 100).toFixed(1)}%)
								</span>
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
