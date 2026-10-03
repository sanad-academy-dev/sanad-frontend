import { IconCheck, IconDeviceHeartMonitor, IconInfoCircle } from "@tabler/icons-react";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useAssignLabAnalyzer,
	useLabAnalyzers,
} from "@/features/services/lab-tests/hooks/use-lab-analyzers";
import { cn } from "@/lib/utils";
import type { LabTestItemResponse } from "@/server/lab-tests/lab-tests.type";

// خطوة تعيين جهاز التحليل — تعرض كل أجهزة الفرع بإشغالها.
// الجهاز المعطَّل أو الممتلئ لا يُختار، والخادم يتحقّق من الاثنين أيضًا.

export function LabAnalyzerAssignment({
	item,
	registerSave,
}: {
	item: LabTestItemResponse;
	registerSave?: (fn: (() => Promise<unknown>) | null) => void;
}) {
	const { analyzers, isLoading } = useLabAnalyzers(item.id);
	const { assignAnalyzer, isPending } = useAssignLabAnalyzer();
	const selectedId = item.sampleCollection?.analyzerId ?? null;

	// التعيين يُحفظ فور الاختيار، فلا شيء إضافي يحفظه «التالي»
	useEffect(() => {
		if (!registerSave) return;
		registerSave(null);
		return () => registerSave(null);
	});

	const choose = (analyzerId: string) => {
		// الضغط على المعيَّن يُلغي التعيين
		const next = selectedId === analyzerId ? null : analyzerId;
		void assignAnalyzer({ itemId: item.id, analyzerId: next }).catch(() => {});
	};

	return (
		<section className="rounded-md border">
			<header className="flex items-center gap-1.5 border-b px-4 py-2 text-sm font-semibold">
				<Badge
					variant="outline"
					className="size-5 justify-center p-0 text-[10px] tabular-nums"
				>
					٥
				</Badge>
				تعيين جهاز التحليل
			</header>

			<div className="space-y-4 p-4">
				<p className="flex items-center gap-1.5 rounded-md border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
					<IconInfoCircle className="size-3.5 shrink-0" />
					يشغل التحليل مكانًا في الجهاز حتى تخرج نتائجه من المختبر.
				</p>

				{isLoading ? (
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton
								key={i}
								className="h-16 rounded-md"
							/>
						))}
					</div>
				) : analyzers.length === 0 ? (
					<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
						لا توجد أجهزة تحليل لهذا الفرع — أضِفها من إعدادات الفرع ← التحليلات ← أجهزة
						التحليل.
					</p>
				) : (
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
						{analyzers.map((analyzer) => {
							const isSelected = selectedId === analyzer.id;
							// المعيَّن حاليًا يبقى قابلًا للضغط ليُلغى تعيينه
							const isDisabled = isPending || (!analyzer.available && !isSelected);
							return (
								<button
									key={analyzer.id}
									type="button"
									aria-pressed={isSelected}
									disabled={isDisabled}
									title={analyzer.blockedReason ?? undefined}
									onClick={() => choose(analyzer.id)}
									className={cn(
										"flex flex-col items-start gap-1 rounded-md border p-3 text-start transition-colors",
										isSelected
											? "border-primary bg-primary/10"
											: "hover:border-muted-foreground/40",
										isDisabled && !isSelected && "cursor-not-allowed opacity-60",
									)}
								>
									<div className="flex w-full items-center gap-1.5">
										<IconDeviceHeartMonitor
											className={cn(
												"size-4 shrink-0",
												isSelected ? "text-primary" : "text-muted-foreground",
											)}
										/>
										<span
											className={cn(
												"truncate text-xs font-bold",
												isSelected && "text-primary",
											)}
										>
											{analyzer.name}
										</span>
										{isSelected && (
											<IconCheck className="ms-auto size-3.5 shrink-0 text-primary" />
										)}
									</div>

									<div className="flex w-full items-center justify-between gap-2">
										<span className="truncate text-[10px] text-muted-foreground">
											{analyzer.category}
										</span>
										{analyzer.blockedReason ? (
											<Badge
												variant="outline"
												className="border-red-200 bg-red-50 text-[10px] text-red-700"
											>
												{analyzer.blockedReason}
											</Badge>
										) : (
											<Badge
												variant="outline"
												className="border-emerald-200 bg-emerald-50 text-[10px] tabular-nums text-emerald-700"
											>
												{analyzer.used}/{analyzer.slots} مكان
											</Badge>
										)}
									</div>
								</button>
							);
						})}
					</div>
				)}

				{selectedId && (
					<p className="text-[11px] text-muted-foreground">
						الجهاز المعيَّن:{" "}
						<span className="font-medium text-foreground">
							{item.sampleCollection?.analyzerName ?? "—"}
						</span>{" "}
						— اضغطه مرة أخرى لإلغاء التعيين.
					</p>
				)}
			</div>
		</section>
	);
}
