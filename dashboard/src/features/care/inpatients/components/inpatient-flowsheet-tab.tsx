import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
	useInpatientVitals,
	useRecordVitals,
} from "@/features/care/inpatients/hooks/use-inpatients";
import { cn } from "@/lib/utils";

/**
 * ورقة المتابعة — إدخال القياسات ورسم اتجاهها عبر الإقامة.
 *
 * المضاعفات الصغيرة لا رسمٌ واحد بمحورين: الحرارة والنبض بوحدات مختلفة، وجمعُهما
 * على محورين يجعل التقاطعات تبدو ذات معنى وهي من صنع المقياس (نفس قرار شاشة
 * العلامات الحيوية العامّة).
 *
 * نطاق مرجعي مظلَّل خلف كل رسم حين يتوفّر — هو ما يحوّل الخطّ من أرقام إلى حكم:
 * «صاعد» وحدها لا تعني شيئًا، و«صاعد وخرج عن النطاق» تعني كل شيء.
 */

type VitalRecord = {
	id: string;
	code: string;
	recordedAt: string | Date;
	weight: string | number | null;
	temperature: string | number | null;
	heartRate: number | null;
	respiratoryRate: number | null;
	oxygenSaturation: number | null;
	painScore: number | null;
	capillaryRefillSec: string | number | null;
	notes: string | null;
	recordedBy: { name: string } | null;
};

const METRICS = [
	{ key: "temperature", label: "الحرارة", unit: "°م" },
	{ key: "heartRate", label: "النبض", unit: "/د" },
	{ key: "respiratoryRate", label: "التنفّس", unit: "/د" },
	{ key: "oxygenSaturation", label: "الأكسجين", unit: "%" },
	{ key: "painScore", label: "الألم", unit: "/10" },
	{ key: "weight", label: "الوزن", unit: "كجم" },
] as const;

export function InpatientFlowsheetTab({
	stayId,
	readOnly,
}: {
	stayId: string;
	readOnly: boolean;
}) {
	const { vitals, isLoading } = useInpatientVitals(stayId);
	const [adding, setAdding] = useState(false);

	const records = (vitals as unknown as VitalRecord[]) ?? [];
	// الأقدم أولًا للرسم؛ القائمة تبقى بالأحدث أولًا
	const series = useMemo(
		() =>
			[...records]
				.sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
				.map((r) => ({
					at: new Date(r.recordedAt).toLocaleString("ar", {
						month: "numeric",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					}),
					temperature: num(r.temperature),
					heartRate: r.heartRate,
					respiratoryRate: r.respiratoryRate,
					oxygenSaturation: r.oxygenSaturation,
					painScore: r.painScore,
					weight: num(r.weight),
				})),
		[records],
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-sm font-medium">ورقة المتابعة</h3>
				{!readOnly && (
					<Button
						size="sm"
						variant="outline"
						onClick={() => setAdding((v) => !v)}
					>
						<IconPlus className="size-4" />
						قياس جديد
					</Button>
				)}
			</div>

			{adding && !readOnly && (
				<RecordVitalsForm
					stayId={stayId}
					onDone={() => setAdding(false)}
				/>
			)}

			{isLoading ? (
				<Skeleton className="h-40 w-full" />
			) : records.length === 0 ? (
				<p className="rounded border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
					لم تُسجَّل علامات حيوية بعد — أوّل قياس يحمل وزن الدخول الذي تُحسب منه كل جرعة
				</p>
			) : (
				<>
					{series.length >= 2 && (
						<div className="grid gap-3 sm:grid-cols-2">
							{METRICS.filter((m) => series.some((s) => s[m.key] != null)).map((metric) => (
								<MetricChart
									key={metric.key}
									metric={metric}
									data={series}
								/>
							))}
						</div>
					)}

					<div className="overflow-x-auto rounded border">
						<table className="w-full min-w-[560px] text-sm">
							<thead>
								<tr className="border-b bg-muted/50 text-[11px] uppercase text-muted-foreground">
									<th className="px-3 py-2 text-start font-medium">الوقت</th>
									{METRICS.map((m) => (
										<th
											key={m.key}
											className="px-3 py-2 text-start font-medium"
										>
											{m.label}
										</th>
									))}
									<th className="px-3 py-2 text-start font-medium">سجّله</th>
								</tr>
							</thead>
							<tbody>
								{records.map((r) => (
									<tr
										key={r.id}
										className="border-b last:border-0"
									>
										<td className="whitespace-nowrap px-3 py-2 font-mono text-xs tabular-nums">
											{new Date(r.recordedAt).toLocaleString("ar", {
												month: "numeric",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</td>
										{METRICS.map((m) => (
											<td
												key={m.key}
												className="px-3 py-2 font-mono text-xs tabular-nums text-muted-foreground"
											>
												{r[m.key] != null ? String(r[m.key]) : "—"}
											</td>
										))}
										<td className="px-3 py-2 text-xs text-muted-foreground">
											{r.recordedBy?.name ?? "—"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}

const num = (v: string | number | null): number | null =>
	v == null ? null : typeof v === "number" ? v : Number(v);

function MetricChart({
	metric,
	data,
}: {
	metric: (typeof METRICS)[number];
	data: Record<string, unknown>[];
}) {
	const config: ChartConfig = {
		[metric.key]: { label: metric.label, color: "var(--chart-1)" },
	};

	return (
		<div className="rounded border bg-card p-3">
			<div className="mb-2 flex items-baseline justify-between">
				<h4 className="text-xs font-medium">{metric.label}</h4>
				<span className="text-[10px] text-muted-foreground">{metric.unit}</span>
			</div>
			<ChartContainer
				config={config}
				className="h-32 w-full"
			>
				<LineChart
					data={data}
					margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
				>
					<CartesianGrid
						vertical={false}
						strokeDasharray="3 3"
					/>
					<XAxis
						dataKey="at"
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 9 }}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						tick={{ fontSize: 9 }}
						width={34}
					/>
					<ChartTooltip content={<ChartTooltipContent />} />
					<Line
						dataKey={metric.key}
						type="monotone"
						stroke="var(--chart-1)"
						strokeWidth={2}
						dot={{ r: 2 }}
						activeDot={{ r: 4 }}
						connectNulls
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
}

function RecordVitalsForm({ stayId, onDone }: { stayId: string; onDone: () => void }) {
	const record = useRecordVitals(stayId);
	const [values, setValues] = useState<Record<string, string>>({});
	const [notes, setNotes] = useState("");

	const set = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

	const submit = () => {
		const payload: Record<string, unknown> = { notes: notes || null };
		for (const metric of METRICS) {
			const raw = values[metric.key];
			payload[metric.key] = raw ? Number(raw) : null;
		}
		if (values.capillaryRefillSec) {
			payload.capillaryRefillSec = Number(values.capillaryRefillSec);
		}
		record.mutate(payload, { onSuccess: onDone });
	};

	const hasAny = Object.values(values).some((v) => v?.trim());

	return (
		<div className="space-y-3 rounded border bg-muted/30 p-3">
			<div className="grid gap-3 sm:grid-cols-3">
				{METRICS.map((metric) => (
					<div
						key={metric.key}
						className="space-y-1.5"
					>
						<Label
							htmlFor={`v-${metric.key}`}
							className="text-xs"
						>
							{metric.label} <span className="text-muted-foreground">{metric.unit}</span>
						</Label>
						<Input
							id={`v-${metric.key}`}
							inputMode="decimal"
							value={values[metric.key] ?? ""}
							onChange={(e) => set(metric.key, e.target.value)}
							disabled={record.isPending}
						/>
					</div>
				))}
				<div className="space-y-1.5">
					<Label
						htmlFor="v-crt"
						className="text-xs"
					>
						امتلاء الشعيرات <span className="text-muted-foreground">ث</span>
					</Label>
					<Input
						id="v-crt"
						inputMode="decimal"
						value={values.capillaryRefillSec ?? ""}
						onChange={(e) => set("capillaryRefillSec", e.target.value)}
						disabled={record.isPending}
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label
					htmlFor="v-notes"
					className="text-xs"
				>
					ملاحظة
				</Label>
				<Textarea
					id="v-notes"
					rows={2}
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					disabled={record.isPending}
				/>
			</div>

			<p className={cn("text-[11px] text-muted-foreground")}>
				القراءات تُقيَّم فور الحفظ مقابل المدى المرجعي لنوع الطفل وعمره — وما يقع في المدى الحرج
				يُصعَّد للمدرّب المعالج.
			</p>

			<div className="flex items-center gap-2 border-t pt-3">
				<Button
					size="sm"
					disabled={!hasAny || record.isPending}
					onClick={submit}
				>
					حفظ القياس
				</Button>
				<Button
					size="sm"
					variant="ghost"
					onClick={onDone}
					disabled={record.isPending}
				>
					إلغاء
				</Button>
			</div>
		</div>
	);
}
