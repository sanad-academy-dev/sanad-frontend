import { IconArrowDown, IconArrowUp, IconMinus, IconScale } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useLabPriors } from "@/features/services/lab-tests/hooks/use-lab-priors";
import { buildComparisonRows } from "@/features/services/lab-tests/utils/compare-results";
import { LabResultFlag } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { LAB_FLAG_LABELS, type LabTestItemResponse } from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";

// مقارنة نتيجة التحليل بنتيجة سابقة للطفل نفسه في التحليل نفسه.
//
// طريقة العرض هنا رقمية لا بصرية (بخلاف الأشعة): ما يهمّ المدرّب في التحاليل
// هو مقدار التغيّر واتجاهه لكل مُحلِّل، لا صورة تُقارَن بالعين. لذا نعرض
// جدول فروق: القيمة السابقة ← الحالية، والفرق ونسبته، وهل خرجت عن النطاق.

const dateLabel = (value: Date | string | null) =>
	value
		? new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium", calendar: "gregory" }).format(
				new Date(value),
			)
		: "—";

const FLAG_CLASS: Record<LabResultFlag, string> = {
	[LabResultFlag.NORMAL]: "border-emerald-200 bg-emerald-50 text-emerald-700",
	[LabResultFlag.LOW]: "border-amber-200 bg-amber-50 text-amber-700",
	[LabResultFlag.HIGH]: "border-red-200 bg-red-50 text-red-700",
};

export function LabResultComparison({ item }: { item: LabTestItemResponse }) {
	const { priors, isLoading } = useLabPriors(item.id, item.results.length > 0);
	const [priorId, setPriorId] = useState<string | null>(null);

	const prior = priors.find((p) => p.id === priorId) ?? priors[0] ?? null;

	// المنطق في وحدة نقية مختبَرة — المطابقة بالمُحلِّل واتجاه التغيّر
	const rows = useMemo(
		() => (prior ? buildComparisonRows(item.results, prior.results) : []),
		[item.results, prior],
	);

	if (isLoading || !prior || item.results.length === 0) return null;

	const matched = rows.filter((r) => r.previous).length;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
					<IconScale className="size-3.5" />
					مقارنة بنتيجة سابقة
					<span className="font-normal">
						({matched} من {item.results.length} مُحلِّل مطابق)
					</span>
				</p>
				{priors.length > 1 && (
					<select
						value={prior.id}
						onChange={(e) => setPriorId(e.target.value)}
						aria-label="اختر النتيجة السابقة للمقارنة"
						className="rounded-[4px] border bg-background px-2 py-1 text-[11px]"
					>
						{priors.map((p) => (
							<option
								key={p.id}
								value={p.id}
							>
								{dateLabel(p.completedAt ?? p.createdAt)} — {p.order.code}
							</option>
						))}
					</select>
				)}
			</div>

			<div className="rounded-[4px] border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">المُحلِّل</TableHead>
							<TableHead className="text-center">
								السابقة
								<span className="ms-1 font-normal text-muted-foreground">
									{dateLabel(prior.completedAt ?? prior.createdAt)}
								</span>
							</TableHead>
							<TableHead className="text-center">الحالية</TableHead>
							<TableHead className="text-center">التغيّر</TableHead>
							<TableHead className="text-center">الحالة</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map(({ current, previous, delta, percent, worsened, improved }) => {
							return (
								<TableRow key={current.id}>
									<TableCell className="text-sm font-medium">
										{current.name}
										{current.unit && (
											<span className="ms-1 text-[11px] font-normal text-muted-foreground">
												{current.unit}
											</span>
										)}
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums text-muted-foreground">
										{previous ? previous.value || "—" : "لم يُقَس"}
									</TableCell>
									<TableCell className="text-center text-sm font-semibold tabular-nums">
										{current.value || "—"}
									</TableCell>
									<TableCell className="text-center">
										{delta == null ? (
											<span className="text-xs text-muted-foreground">—</span>
										) : (
											<span
												className={cn(
													"inline-flex items-center gap-1 text-xs tabular-nums",
													// اللون يتبع تغيّر الحالة لا اتجاه الرقم: الارتفاع
													// ليس سيّئًا بذاته، والخروج عن النطاق هو ما يهمّ
													worsened
														? "font-semibold text-red-700"
														: improved
															? "font-semibold text-emerald-700"
															: "text-muted-foreground",
												)}
											>
												{delta > 0 ? (
													<IconArrowUp className="size-3" />
												) : delta < 0 ? (
													<IconArrowDown className="size-3" />
												) : (
													<IconMinus className="size-3" />
												)}
												{delta > 0 ? "+" : ""}
												{Number(delta.toFixed(2))}
												{percent != null && Math.abs(percent) >= 1 && (
													<span className="text-[10px]">
														({percent > 0 ? "+" : ""}
														{Math.round(percent)}%)
													</span>
												)}
											</span>
										)}
									</TableCell>
									<TableCell className="text-center">
										<div className="flex flex-col items-center gap-0.5">
											<Badge
												variant="outline"
												className={cn("text-[10px]", FLAG_CLASS[current.flag])}
											>
												{LAB_FLAG_LABELS[current.flag]}
											</Badge>
											{worsened && (
												<span className="text-[10px] font-medium text-red-700">
													خرج عن النطاق
												</span>
											)}
											{improved && (
												<span className="text-[10px] font-medium text-emerald-700">
													عاد للنطاق
												</span>
											)}
										</div>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{prior.report && (
				<p className="whitespace-pre-wrap rounded-[4px] border bg-muted/30 p-2.5 text-[11px] leading-relaxed text-muted-foreground">
					<span className="font-semibold">تقرير النتيجة السابقة: </span>
					{prior.report}
				</p>
			)}
		</div>
	);
}
