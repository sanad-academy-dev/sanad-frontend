import { IconAlertTriangle, IconClock } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useRadiologyMetrics } from "@/features/services/radiology/hooks/use-radiology-extras";
import { useSelectedRadiologyOrderStore } from "@/features/services/radiology/stores/selected-radiology-order.store";
import type { RadiologyStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { RADIOLOGY_STATUS_LABELS } from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

// مؤشّرات زمن الإنجاز. الوسيط لا المتوسّط: فحص واحد منسيّ أسبوعًا يجرّ
// المتوسّط وحده ويخفي أن أغلب العمل يمضي في ساعات.

/** الدقائق إلى نصّ مقروء — الساعات والأيام أوضح من عدّ الدقائق */
const durationLabel = (minutes: number | null) => {
	if (minutes == null) return "—";
	if (minutes < 60) return `${minutes} دقيقة`;
	const hours = minutes / 60;
	if (hours < 24) return `${hours.toFixed(1)} ساعة`;
	return `${(hours / 24).toFixed(1)} يوم`;
};

function Metric({
	label,
	value,
	hint,
	tone,
}: {
	label: string;
	value: string;
	hint?: string;
	tone?: "warn";
}) {
	return (
		<div className="flex flex-col gap-0.5 rounded-[4px] border p-3">
			<span className="text-[11px] text-muted-foreground">{label}</span>
			<span
				className={cn(
					"text-lg font-semibold tabular-nums",
					tone === "warn" && "text-amber-700",
				)}
			>
				{value}
			</span>
			{hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
		</div>
	);
}

export function RadiologyMetricsDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { metrics, isLoading } = useRadiologyMetrics(open);
	const select = useSelectedRadiologyOrderStore((s) => s.select);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				className="max-h-[88vh] gap-0 overflow-hidden p-0 sm:max-w-2xl"
				dir="rtl"
			>
				<div className="flex flex-col gap-0.5 border-b px-4 py-2 pe-10">
					<DialogTitle className="flex items-center gap-2 text-sm font-semibold">
						<IconClock className="size-4" />
						مؤشّرات زمن الإنجاز
					</DialogTitle>
					<DialogDescription className="text-xs">
						من إنشاء الطلب إلى اعتماد التقرير — على آخر ٥٠٠ فحص مكتمل.
					</DialogDescription>
				</div>

				<div className="max-h-[70vh] overflow-y-auto px-4 py-3">
					{isLoading || !metrics ? (
						<div className="flex flex-col gap-3">
							<Skeleton className="h-20 w-full rounded-[4px]" />
							<Skeleton className="h-40 w-full rounded-[4px]" />
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
								<Metric
									label="الوسيط"
									value={durationLabel(metrics.medianMinutes)}
									hint="نصف الفحوصات أسرع منه"
								/>
								<Metric
									label="الشريحة ٩٠٪"
									value={durationLabel(metrics.p90Minutes)}
									hint="٩ من كل ١٠ أسرع منه"
								/>
								<Metric
									label="فحوصات مكتملة"
									value={String(metrics.completedCount)}
									hint="أساس الحساب"
								/>
								<Metric
									label="تجاوزت ٢٤ ساعة"
									value={String(metrics.overdueCount)}
									hint="قائمة ولم تكتمل"
									tone={metrics.overdueCount > 0 ? "warn" : undefined}
								/>
							</div>

							{/* توزيع الفحوصات القائمة — أين يتكدّس العمل الآن */}
							{Object.keys(metrics.openByStatus).length > 0 && (
								<div className="flex flex-col gap-1.5">
									<p className="text-xs font-semibold text-muted-foreground">
										الفحوصات القائمة حسب المرحلة
									</p>
									<div className="flex flex-wrap gap-1.5">
										{Object.entries(metrics.openByStatus).map(([status, count]) => (
											<Badge
												key={status}
												variant="outline"
												className="gap-1.5 rounded-sm text-[11px]"
											>
												{RADIOLOGY_STATUS_LABELS[status as RadiologyStatus] ?? status}
												<span className="tabular-nums font-semibold">{count}</span>
											</Badge>
										))}
									</div>
								</div>
							)}

							{/* أطول الفحوصات انتظارًا — قائمة عمل لا رقم مجرّد */}
							{metrics.oldestOpen.length > 0 && (
								<div className="flex flex-col gap-1.5">
									<p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
										<IconAlertTriangle className="size-3.5" />
										أطول الفحوصات انتظارًا
									</p>
									<div className="flex flex-col gap-1">
										{metrics.oldestOpen.map((row) => (
											<div
												key={row.itemId}
												className="flex items-center justify-between gap-2 rounded-[4px] border px-2.5 py-1.5"
											>
												<div className="flex min-w-0 flex-col gap-0.5">
													<span className="truncate text-xs font-medium">
														{row.serviceName} — {row.patientName}
													</span>
													<span className="text-[11px] text-muted-foreground">
														{row.accession} ·{" "}
														{RADIOLOGY_STATUS_LABELS[row.status as RadiologyStatus] ??
															row.status}
													</span>
												</div>
												<div className="flex shrink-0 items-center gap-2">
													<span
														className={cn(
															"text-[11px] tabular-nums",
															row.waitingMinutes > 24 * 60
																? "font-semibold text-amber-700"
																: "text-muted-foreground",
														)}
													>
														{durationLabel(row.waitingMinutes)}
													</span>
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="h-7 text-[11px]"
														onClick={() => {
															select(row.orderId, { itemId: row.itemId });
															onOpenChange(false);
														}}
													>
														فتح
													</Button>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onOpenChange(false)}
					>
						إغلاق
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
