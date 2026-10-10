import { IconChartBar, IconShieldExclamation, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { OperationsMetricsResponse } from "@/server/operations/operations.type";

const CANCEL_KIND_LABELS: Record<string, string> = {
	OWNER: "وليّ الأمر",
	CLINIC: "الأكاديمية",
	CLINICAL: "سبب سريري",
};

const TIER_SHORT: Record<string, string> = {
	MINOR: "صغرى",
	INTERMEDIATE: "متوسطة",
	MAJOR: "كبرى",
};

const GRADE_SHORT: Record<string, string> = {
	GRADE_I: "I",
	GRADE_II: "II",
	GRADE_IIIA: "IIIa",
	GRADE_IIIB: "IIIb",
	GRADE_IVA: "IVa",
	GRADE_IVB: "IVb",
	GRADE_V: "V",
};

const dateTimeFormatter = new Intl.DateTimeFormat("ar", {
	dateStyle: "short",
	timeStyle: "short",
});

function MetricTile({
	title,
	value,
	hint,
	tone = "default",
}: {
	title: string;
	value: string;
	hint?: string;
	tone?: "default" | "good" | "warn";
}) {
	return (
		<div className="flex flex-col gap-0.5 rounded-[4px] border p-3">
			<span className="text-[11px] text-muted-foreground">{title}</span>
			<span
				className={
					tone === "good"
						? "text-lg font-semibold tabular-nums text-emerald-600"
						: tone === "warn"
							? "text-lg font-semibold tabular-nums text-amber-600"
							: "text-lg font-semibold tabular-nums"
				}
			>
				{value}
			</span>
			{hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
		</div>
	);
}

export function OperationsMetricsDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { data, isLoading } = useQuery<OperationsMetricsResponse>({
		queryKey: ["operations", "metrics"],
		queryFn: async () => {
			const res = await api.operations.metrics.get({ query: {} });
			if (res.error) throw new Error("فشل جلب المؤشرات");
			return res.data as OperationsMetricsResponse;
		},
		enabled: open,
	});

	const pct = (v: number | null) => (v == null ? "—" : `${v}%`);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="max-h-[85vh] w-full max-w-2xl gap-0 overflow-y-auto p-0"
			>
				<div className="flex items-center justify-between gap-2 border-b px-4 py-2">
					<DialogTitle className="flex items-center gap-2 text-sm font-semibold">
						<IconChartBar className="size-4 text-muted-foreground" />
						مؤشرات العمليات — آخر {data?.rangeDays ?? 90} يومًا
					</DialogTitle>
					<Button
						size="icon"
						variant="ghost"
						className="size-8"
						onClick={() => onOpenChange(false)}
					>
						<IconX className="size-4" />
					</Button>
				</div>

				{isLoading || !data ? (
					<div className="flex flex-col gap-3 p-4">
						<Skeleton className="h-24 w-full rounded-[4px]" />
						<Skeleton className="h-24 w-full rounded-[4px]" />
					</div>
				) : (
					<div className="flex flex-col gap-4 p-4">
						{/* تشغيلي */}
						<div className="grid grid-cols-4 gap-2">
							<MetricTile
								title="إجمالي الحالات"
								value={String(data.totalCases)}
							/>
							<MetricTile
								title="مكتملة"
								value={String(data.completedCases)}
								tone="good"
							/>
							<MetricTile
								title="ملغاة"
								value={String(data.cancelledCases)}
								hint={Object.entries(data.cancellationByKind)
									.map(([k, v]) => `${CANCEL_KIND_LABELS[k] ?? k}: ${v}`)
									.join(" · ")}
								tone={data.cancelledCases > 0 ? "warn" : "default"}
							/>
							<MetricTile
								title="فرق المدة عن التقدير"
								value={
									data.avgDurationDeltaMin == null
										? "—"
										: `${data.avgDurationDeltaMin > 0 ? "+" : ""}${data.avgDurationDeltaMin} د`
								}
								hint="الفعلية (شق→إغلاق) مقابل المقدّرة"
							/>
						</div>

						<div className="flex flex-wrap gap-1.5">
							{Object.entries(data.casesByTier).map(([tier, count]) => (
								<Badge
									key={tier}
									variant="outline"
									className="tabular-nums"
								>
									{TIER_SHORT[tier] ?? tier}: {count}
								</Badge>
							))}
						</div>

						{/* الأمان والالتزام */}
						<h4 className="text-sm font-semibold">الأمان والالتزام</h4>
						<div className="grid grid-cols-4 gap-2">
							<MetricTile
								title="التزام قوائم التحقق"
								value={pct(data.checklistCompletionRatePct)}
								hint="المكتملة إلى المتوقعة (WHO — S1)"
								tone={
									data.checklistCompletionRatePct != null &&
									data.checklistCompletionRatePct < 100
										? "warn"
										: "good"
								}
							/>
							<MetricTile
								title="المضاد الوقائي قبل الشق"
								value={pct(data.abxProphylaxisRatePct)}
								hint="حالات التخدير العام (S9)"
							/>
							<MetricTile
								title="فروق العدّ الموثقة"
								value={String(data.countDiscrepancies)}
								tone={data.countDiscrepancies > 0 ? "warn" : "good"}
							/>
							<MetricTile
								title="تجاوزات البوابات"
								value={String(data.gateOverrides.count)}
								hint="break-glass — للمراجعة أدناه"
								tone={data.gateOverrides.count > 0 ? "warn" : "good"}
							/>
						</div>

						{/* النتائج السريرية */}
						<h4 className="text-sm font-semibold">النتائج السريرية</h4>
						<div className="grid grid-cols-4 gap-2">
							<MetricTile
								title="نسبة المضاعفات"
								value={pct(data.complicationRatePct)}
							/>
							<MetricTile
								title="المضاعفات"
								value={String(data.complications.total)}
								hint={Object.entries(data.complications.byGrade)
									.map(([g, v]) => `${GRADE_SHORT[g] ?? g}: ${v}`)
									.join(" · ")}
							/>
							<MetricTile
								title="عدوى موضع الجراحة"
								value={String(data.complications.ssi)}
								hint="ضمن نافذة الترصّد (S18)"
								tone={data.complications.ssi > 0 ? "warn" : "good"}
							/>
							<MetricTile
								title="الوفيات (Clavien V)"
								value={String(data.complications.mortality)}
								tone={data.complications.mortality > 0 ? "warn" : "good"}
							/>
						</div>

						{/* قائمة مراجعة تجاوزات البوابات */}
						{data.gateOverrides.entries.length > 0 && (
							<div className="flex flex-col gap-1.5">
								<h4 className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
									<IconShieldExclamation className="size-4" />
									مراجعة تجاوزات بوابات الأمان (S21)
								</h4>
								{data.gateOverrides.entries.map((entry, i) => (
									<div
										key={`${entry.caseCode}-${i}`}
										className="flex items-center gap-2 rounded-[4px] border border-red-100 bg-red-50/50 px-2.5 py-1.5 text-xs dark:border-red-900 dark:bg-red-950/30"
									>
										<span className="shrink-0 font-medium tabular-nums">{entry.caseCode}</span>
										<span className="truncate">{entry.detail}</span>
										<span className="ms-auto shrink-0 text-[10px] text-muted-foreground">
											{entry.authorName ? `${entry.authorName} — ` : ""}
											{dateTimeFormatter.format(new Date(entry.at))}
										</span>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
