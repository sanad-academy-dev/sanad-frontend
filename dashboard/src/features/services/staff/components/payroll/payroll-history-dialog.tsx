// السجل التاريخي لمسير الرواتب — قائمة الفترات مع فتح تفاصيل كل مسير.
// عرض رئيسي/تفصيلي (master-detail) داخل حوار واحد، بيانات حقيقية من الخادم.
import { IconChevronLeft, IconWallet, IconX } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { formatPeriod } from "@/features/services/staff/components/payroll/payroll-ui";
import { StepSummary } from "@/features/services/staff/components/payroll/wizard/step-summary";
import {
	usePayrollRun,
	usePayrollRuns,
	usePreviousNets,
} from "@/features/services/staff/hooks/use-payroll";
import { useCurrency } from "@/hooks/use-currency";
import { RUN_STATUS_LABEL } from "@sanad/contracts/runtime/server/payroll/payroll.type";

function DetailView({ runId }: { runId: string }) {
	const { run, isLoading } = usePayrollRun(runId);
	const { previousNets } = usePreviousNets(runId);

	if (isLoading) {
		return (
			<div className="flex h-[240px] items-center justify-center">
				<Spinner />
			</div>
		);
	}
	if (!run) return null;

	return (
		<StepSummary
			run={run}
			lines={run.lines.filter((l) => !l.excluded)}
			previousNets={previousNets}
		/>
	);
}

export function PayrollHistoryDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const { format } = useCurrency();
	const { runs, isLoading } = usePayrollRuns();
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const handleClose = () => {
		onClose();
		setTimeout(() => setSelectedId(null), 200);
	};

	const selected = runs.find((r) => r.id === selectedId);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) handleClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				className="flex max-h-[92vh] w-full max-w-3xl! flex-col gap-0 overflow-hidden p-0"
				dir="rtl"
			>
				<div className="flex items-center justify-between px-5 pt-4 pb-3">
					<div className="flex items-center gap-2">
						{selectedId && (
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => setSelectedId(null)}
								aria-label="رجوع"
							>
								{/* في RTL يشير سهم الرجوع لليسار */}
								<IconChevronLeft className="size-4 rotate-180" />
							</Button>
						)}
						<div className="flex flex-col">
							<DialogTitle className="text-[16px] font-bold text-foreground">
								{selected
									? `مسير ${formatPeriod(selected.periodYear, selected.periodMonth)}`
									: "سجل مسيرات الرواتب"}
							</DialogTitle>
							<DialogDescription className="text-[12px] text-muted-foreground">
								{selected ? selected.code : "الفترات السابقة وتفاصيل كل مسير"}
							</DialogDescription>
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={handleClose}
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<Separator />

				<div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
					{selectedId ? (
						<DetailView runId={selectedId} />
					) : isLoading ? (
						<div className="flex h-[240px] items-center justify-center">
							<Spinner />
						</div>
					) : runs.length === 0 ? (
						<div className="flex flex-col items-center gap-2 py-12 text-center">
							<span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
								<IconWallet className="size-6" />
							</span>
							<span className="text-[13px] font-medium text-foreground">
								لا توجد مسيرات سابقة
							</span>
							<span className="text-[11px] text-muted-foreground">
								شغّل أول مسير رواتب ليظهر هنا
							</span>
						</div>
					) : (
						<div className="overflow-hidden rounded-[4px] border border-border">
							<table className="w-full">
								<thead className="bg-muted/60">
									<tr>
										<th className="px-3 py-2 text-right text-[11px] font-medium text-muted-foreground">
											الفترة
										</th>
										<th className="px-3 py-2 text-right text-[11px] font-medium text-muted-foreground">
											عدد الموظفين
										</th>
										<th className="px-3 py-2 text-right text-[11px] font-medium text-muted-foreground">
											صافي المسير
										</th>
										<th className="px-3 py-2 text-right text-[11px] font-medium text-muted-foreground">
											الحالة
										</th>
									</tr>
								</thead>
								<tbody>
									{runs.map((run) => (
										<tr
											key={run.id}
											onClick={() => setSelectedId(run.id)}
											className="cursor-pointer border-t border-border hover:bg-muted/60"
										>
											<td className="px-3 py-2.5">
												<div className="flex flex-col">
													<span className="text-[12px] text-foreground">
														{formatPeriod(run.periodYear, run.periodMonth)}
													</span>
													<span className="text-[10px] text-muted-foreground tabular-nums">
														{run.code}
													</span>
												</div>
											</td>
											<td className="px-3 py-2.5 text-[12px] text-muted-foreground tabular-nums">
												{run._count.lines}
											</td>
											<td className="px-3 py-2.5 text-[12px] font-semibold text-foreground tabular-nums">
												{format(run.totalNet)}
											</td>
											<td className="px-3 py-2.5">
												<span className="inline-flex items-center rounded-[4px] bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
													{RUN_STATUS_LABEL[run.status]}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
