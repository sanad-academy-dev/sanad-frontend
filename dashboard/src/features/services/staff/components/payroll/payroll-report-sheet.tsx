// التقرير الكامل للمسير — يقرأ من لقطة المسير المعتمد لا من إعادة احتساب.
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type PayrollDistribution,
	PayrollDistributionDonut,
} from "@/features/services/staff/components/payroll/payroll-distribution-donut";
import {
	formatPeriod,
	getInitials,
} from "@/features/services/staff/components/payroll/payroll-ui";
import { useCurrency } from "@/hooks/use-currency";
import { useI18n } from "@/hooks/use-i18n";
import { type PayrollRunDetail, RUN_STATUS_LABEL } from "@sanad/contracts/runtime/server/payroll/payroll.type";
import { PAYROLL_PAYMENT_METHOD_LABEL } from "@sanad/contracts/runtime/server/staff-compensation/staff-compensation.type";

function InfoCell({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col gap-0.5 rounded-md border border-border bg-card p-2.5">
			<span className="text-[10px] text-muted-foreground">{label}</span>
			<span className="text-xs font-bold text-foreground tabular-nums">{value}</span>
		</div>
	);
}

export function PayrollReportSheet({
	run,
	open,
	onClose,
}: {
	run: PayrollRunDetail | null;
	open: boolean;
	onClose: () => void;
}) {
	const { format } = useCurrency();
	const { isRtl } = useI18n();
	// الاتجاه مشتق من اللغة لا مثبّت، فالتقرير يفتح من الجهة الصحيحة في الحالتين
	const side = isRtl ? "left" : "right";

	if (!run) return null;

	const distribution = run.distribution as PayrollDistribution | null;
	const included = run.lines.filter((l) => !l.excluded);

	const totalEmployeeDeductions = included.reduce((s, l) => s + Number(l.employeeGosi), 0);
	const totalCompanyDeductions = included.reduce((s, l) => s + Number(l.companyGosi), 0);

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) onClose();
			}}
		>
			<SheetContent
				side={side}
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-xl!"
				dir="rtl"
			>
				<div className="flex items-center justify-between border-b px-4 py-2">
					<div className="flex flex-col">
						<SheetTitle className="font-heading text-base font-bold text-foreground">
							تقرير مسير {formatPeriod(run.periodYear, run.periodMonth)}
						</SheetTitle>
						<SheetDescription className="text-[11px] text-muted-foreground">
							{run.code} · {RUN_STATUS_LABEL[run.status]}
						</SheetDescription>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="size-8"
						onClick={onClose}
						aria-label="إغلاق"
					>
						<IconX className="size-4" />
					</Button>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
					<Tabs
						defaultValue="overview"
						dir="rtl"
					>
						<TabsList className="w-full justify-start">
							<TabsTrigger
								value="overview"
								className="text-xs"
							>
								نظرة عامة
							</TabsTrigger>
							<TabsTrigger
								value="deductions"
								className="text-xs"
							>
								الاستقطاعات
							</TabsTrigger>
							<TabsTrigger
								value="staff"
								className="text-xs"
							>
								الموظفون
							</TabsTrigger>
						</TabsList>

						<TabsContent
							value="overview"
							className="mt-3 flex flex-col gap-3"
						>
							<div className="grid grid-cols-2 gap-2">
								<InfoCell
									label="فترة المسير"
									value={formatPeriod(run.periodYear, run.periodMonth)}
								/>
								<InfoCell
									label="تاريخ الصرف"
									value={
										run.payDate
											? new Date(run.payDate).toISOString().slice(0, 10)
											: formatPeriod(run.periodYear, run.periodMonth)
									}
								/>
								<InfoCell
									label="عدد الموظفين"
									value={String(included.length)}
								/>
								<InfoCell
									label="نوع المسير"
									value={run.type === "REGULAR" ? "مسير عادي" : "مسير استثنائي"}
								/>
							</div>

							{/* صافي المسير والاستقطاعات وحصة الشركة */}
							<div className="grid grid-cols-3 gap-2">
								<div className="flex flex-col gap-0.5 rounded-md bg-primary/[0.08] p-3">
									<span className="text-[10px] text-muted-foreground">صافي المسير</span>
									<span className="font-heading text-lg font-bold text-primary tabular-nums">
										{format(run.totalNet)}
									</span>
								</div>
								<InfoCell
									label="إجمالي الاستقطاعات"
									value={format(totalEmployeeDeductions)}
								/>
								<InfoCell
									label="حصة الشركة"
									value={format(totalCompanyDeductions)}
								/>
							</div>

							<PayrollDistributionDonut distribution={distribution} />
						</TabsContent>

						<TabsContent
							value="deductions"
							className="mt-3"
						>
							<div className="overflow-hidden rounded-lg border border-border">
								<table className="w-full">
									<thead className="bg-muted/60">
										<tr>
											<th className="px-3 py-2 text-start text-[11px] font-medium text-muted-foreground">
												الوصف
											</th>
											<th className="px-3 py-2 text-start text-[11px] font-medium text-muted-foreground">
												على الموظف
											</th>
											<th className="px-3 py-2 text-start text-[11px] font-medium text-muted-foreground">
												على الشركة
											</th>
										</tr>
									</thead>
									<tbody>
										<tr className="border-t border-border">
											<td className="px-3 py-2.5 text-xs text-foreground">
												التأمينات الاجتماعية
											</td>
											<td className="px-3 py-2.5 text-xs tabular-nums text-destructive">
												{format(totalEmployeeDeductions)}
											</td>
											<td className="px-3 py-2.5 text-xs tabular-nums text-foreground">
												{format(totalCompanyDeductions)}
											</td>
										</tr>
										<tr className="border-t border-border">
											<td className="px-3 py-2.5 text-xs text-foreground">خصومات الإجازات</td>
											<td className="px-3 py-2.5 text-xs tabular-nums text-destructive">
												{format(distribution?.leaveDeductions ?? 0)}
											</td>
											<td className="px-3 py-2.5 text-xs text-muted-foreground">—</td>
										</tr>
										<tr className="border-t border-border bg-muted/60">
											<td className="px-3 py-2.5 text-xs font-bold text-foreground">
												الإجمالي
											</td>
											<td className="px-3 py-2.5 text-xs font-bold tabular-nums text-foreground">
												{format(
													totalEmployeeDeductions + (distribution?.leaveDeductions ?? 0),
												)}
											</td>
											<td className="px-3 py-2.5 text-xs font-bold tabular-nums text-foreground">
												{format(totalCompanyDeductions)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</TabsContent>

						<TabsContent
							value="staff"
							className="mt-3"
						>
							<div className="flex flex-col gap-2">
								{included.map((line) => {
									const earnings = line.earnings.reduce((s, e) => s + Number(e.amount), 0);
									return (
										<div
											key={line.id}
											className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3"
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
														{getInitials(line.staffName)}
													</span>
													<div className="flex flex-col leading-tight">
														<span className="text-xs text-foreground">{line.staffName}</span>
														<span className="text-[10px] text-muted-foreground tabular-nums">
															{line.staffCode} ·{" "}
															{
																PAYROLL_PAYMENT_METHOD_LABEL[
																	line.paymentMethodOverride ?? line.paymentMethodSuggested
																]
															}
														</span>
													</div>
												</div>
												<span className="text-[13px] font-bold text-foreground tabular-nums">
													{format(line.netPay)}
												</span>
											</div>

											<div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
												{[
													{ label: "الأساسي", value: line.baseSalary },
													{ label: "البدلات", value: line.allowancesTotal },
													{ label: "الإضافي", value: line.overtimePay },
													{ label: "استحقاقات", value: earnings },
													{ label: "خصم الإجازات", value: line.leaveDeduction },
													{ label: "التأمينات", value: line.employeeGosi },
													{ label: "حصة الشركة", value: line.companyGosi },
													{ label: "تكلفة الشركة", value: line.companyCost },
												].map((f) => (
													<div
														key={f.label}
														className="flex items-center justify-between gap-1"
													>
														<span className="text-[10px] text-muted-foreground">
															{f.label}
														</span>
														<span className="text-[11px] text-foreground tabular-nums">
															{format(f.value)}
														</span>
													</div>
												))}
											</div>

											{line.note && (
												<span className="text-[10px] text-muted-foreground">
													ملاحظة: {line.note}
												</span>
											)}
										</div>
									);
								})}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</SheetContent>
		</Sheet>
	);
}
