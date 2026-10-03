import { IconDownload, IconEye, IconPlus, IconWallet } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { FiltersMenu } from "@/components/common/filters-menu";
import { TablePagination } from "@/components/common/table-pagination";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { EndOfServiceDialog } from "@/features/services/staff/components/payroll/end-of-service-dialog";
import { OffCycleDialog } from "@/features/services/staff/components/payroll/off-cycle-dialog";
import { PayrollActionsMenu } from "@/features/services/staff/components/payroll/payroll-actions-menu";
import { PayrollHistoryDialog } from "@/features/services/staff/components/payroll/payroll-history-dialog";
import { PayrollReportSheet } from "@/features/services/staff/components/payroll/payroll-report-sheet";
import { PayrollRunWizard } from "@/features/services/staff/components/payroll/payroll-run-wizard";
import {
	PayrollStat,
	RunStatusPill,
} from "@/features/services/staff/components/payroll/payroll-shared";
import { currentPeriod } from "@/features/services/staff/components/payroll/payroll-ui";
import { usePayrollRun, usePayrollRuns } from "@/features/services/staff/hooks/use-payroll";
import { useStaff } from "@/features/services/staff/hooks/use-staff";
import { useStaffFilters } from "@/features/services/staff/hooks/use-staff-filters";
import { exportStaffCsv } from "@/features/services/staff/utils/export-staff";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";

// شارة القيمة الافتراضية للأعمدة المالية قبل تشغيل مسير الرواتب
const EMPTY_MONEY = "00 ر.س";

// أعمدة جدول مسير الرواتب (RTL: من اليمين لليسار)
const PAYROLL_COLUMNS = [
	"الراتب الأساسي",
	"البدلات",
	"الخصومات",
	"الإستقطاعات",
	"الصافي",
	"الحالة",
	"الإجراءات",
] as const;

function StaffAvatar({ name }: { name: string }) {
	const initials = name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
	return (
		<div className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-normal text-white">
			{initials}
		</div>
	);
}

export function PayrollView() {
	const { format } = useCurrency();
	const { staff, isLoading } = useStaff();
	const { filterGroups, applyStaffFilters } = useStaffFilters(staff);
	const [search, setSearch] = useState("");
	// معالج تشغيل مسير الرواتب
	const [wizardOpen, setWizardOpen] = useState(false);
	// حاسبة نهاية الدورة
	const [eosOpen, setEosOpen] = useState(false);
	// السجل التاريخي للرواتب
	const [historyOpen, setHistoryOpen] = useState(false);
	// مسير الفترة الحالية — مصدر القيم المعروضة في الجدول
	const period = currentPeriod();
	const { runs } = usePayrollRuns();
	const currentRun = runs.find(
		(r) =>
			r.periodYear === period.year &&
			r.periodMonth === period.month &&
			r.type === "REGULAR" &&
			r.status !== "CANCELLED",
	);
	const { run } = usePayrollRun(currentRun?.id ?? null);
	const lineByStaff = useMemo(
		() => new Map((run?.lines ?? []).map((l) => [l.staffId, l])),
		[run],
	);
	// التقرير الكامل للمسير الحالي
	const [reportOpen, setReportOpen] = useState(false);
	const [offCycleOpen, setOffCycleOpen] = useState(false);

	const rows = useMemo(() => {
		const q = search.trim().toLowerCase();
		const list = applyStaffFilters(staff);
		if (!q) return list;
		return list.filter(
			(s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
		);
	}, [staff, search, applyStaffFilters]);

	// ترقيم الصفحات
	const [pageSize, setPageSize] = useState(15);
	const [pageIndex, setPageIndex] = useState(0);
	const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
	const safePage = Math.min(pageIndex, pageCount - 1);
	const pagedRows = rows.slice(safePage * pageSize, safePage * pageSize + pageSize);
	const fromRow = rows.length === 0 ? 0 : safePage * pageSize + 1;
	const toRow = Math.min((safePage + 1) * pageSize, rows.length);

	const stats = [
		{
			title: "إجمالي الاستحقاقات",
			value: run ? format(run.totalGross) : EMPTY_MONEY,
		},
		{
			title: "استقطاعات الموظفين",
			value: run ? format(run.totalEmployeeGosi) : EMPTY_MONEY,
		},
		{
			title: "حصة الشركة (تأمينات)",
			value: run ? format(run.totalCompanyGosi) : EMPTY_MONEY,
		},
		{
			title: "صافي المسير",
			value: run ? format(run.totalNet) : EMPTY_MONEY,
		},
		{ title: "إجمالي الموظفين", value: String(staff.length).padStart(2, "0") },
	];

	const isEmpty = !isLoading && rows.length === 0;

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir="rtl"
		>
			{/* التقرير الكامل — يقرأ من لقطة المسير */}
			<PayrollReportSheet
				run={run}
				open={reportOpen}
				onClose={() => setReportOpen(false)}
			/>

			{/* معالج تشغيل مسير الرواتب */}
			<PayrollRunWizard
				open={wizardOpen}
				onClose={() => setWizardOpen(false)}
				staff={staff}
				existingRunId={currentRun?.id ?? null}
			/>

			{/* حاسبة نهاية الدورة */}
			<EndOfServiceDialog
				open={eosOpen}
				onClose={() => setEosOpen(false)}
				staff={staff}
			/>

			{/* السجل التاريخي للرواتب */}
			<PayrollHistoryDialog
				open={historyOpen}
				onClose={() => setHistoryOpen(false)}
			/>

			{/* مسير خارج الدورة — مبالغ يدوية */}
			<OffCycleDialog
				open={offCycleOpen}
				onOpenChange={setOffCycleOpen}
				staff={staff}
			/>

			{/* بطاقات إحصائية */}
			<div className="grid grid-cols-5 gap-[6px] px-[9px] py-1.5">
				{stats.map((s) => (
					<PayrollStat
						key={s.title}
						label={s.title}
						value={s.value}
					/>
				))}
			</div>

			{/* شريط الأدوات */}
			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث عن المدرّب بالاسم،المعرف..."
				searchValue={search}
				onSearchChange={(v) => {
					setSearch(v);
					setPageIndex(0);
				}}
				// نفس ترتيب صفحة الموظفين: [التصفية] [تصدير] بمقاس xs موحّد
				buttonSize="xs"
				showFilter={false}
				showView={false}
				showExport={false}
				leftExtra={
					<>
						<FiltersMenu groups={filterGroups} />
						{/* ترتيب DOM في RTL: بعد التصفية فيظهر على يسارها */}
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={() => exportStaffCsv(rows)}
							disabled={rows.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
					</>
				}
				actions={
					<PayrollActionsMenu
						hasCurrentRun={!!currentRun}
						onRun={() => setWizardOpen(true)}
						onOffCycle={() => setOffCycleOpen(true)}
						onEndOfService={() => setEosOpen(true)}
						onHistory={() => setHistoryOpen(true)}
					/>
				}
			/>

			{/* جدول مسير الرواتب */}
			<div className="min-h-0 flex-1 overflow-auto bg-card">
				<table className="w-full border-collapse">
					<thead className="sticky top-0 z-10 bg-card">
						<tr className="border-y border-border">
							<th className="h-[34px] px-[9px] text-start">
								<div className="flex items-center gap-3">
									<span className="size-[18px] shrink-0 rounded-[4px] border-[1.5px] border-border bg-card" />
									<span className="text-[11px] font-medium text-muted-foreground">
										اسم / المعرّف
									</span>
								</div>
							</th>
							{PAYROLL_COLUMNS.map((col) => (
								<th
									key={col}
									className={cn(
										"h-[34px] px-[9px] text-start text-[11px] font-medium text-muted-foreground",
										col === "الإجراءات" && "text-left",
									)}
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{!isEmpty &&
							pagedRows.map((s) => {
								const line = lineByStaff.get(s.id);
								return (
									<tr
										key={s.id}
										className="border-b border-border"
									>
										<td className="h-[44px] px-[9px]">
											<div className="flex items-center gap-3">
												<span className="size-[18px] shrink-0 rounded-[4px] border-[1.5px] border-border bg-card" />
												<div className="flex items-center gap-1.5">
													<StaffAvatar name={s.name} />
													<div className="flex flex-col leading-tight">
														<span className="text-xs font-medium text-foreground">
															{s.name}
														</span>
														<span className="text-[10px] text-muted-foreground tabular-nums">
															{s.code}
														</span>
													</div>
												</div>
											</div>
										</td>
										<td className="px-[9px] text-start text-xs font-medium text-foreground tabular-nums">
											{line ? format(line.baseSalary) : EMPTY_MONEY}
										</td>
										<td className="px-[9px] text-start text-xs text-primary tabular-nums">
											{line ? format(line.allowancesTotal) : EMPTY_MONEY}
										</td>
										<td className="px-[9px] text-start text-xs font-medium text-foreground tabular-nums">
											{line ? format(line.leaveDeduction) : EMPTY_MONEY}
										</td>
										<td className="px-[9px] text-start text-xs text-destructive tabular-nums">
											{line ? format(line.employeeGosi) : EMPTY_MONEY}
										</td>
										<td className="px-[9px] text-start text-xs font-semibold text-foreground tabular-nums">
											{line ? format(line.netPay) : EMPTY_MONEY}
										</td>
										<td className="px-[9px] text-start">
											{line && run ? (
												<RunStatusPill status={run.status} />
											) : (
												<span className="inline-flex h-6 items-center rounded bg-muted px-2 text-[11px] text-muted-foreground">
													لم يُحتسب
												</span>
											)}
										</td>
										<td className="px-[9px] text-left">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="size-7 text-muted-foreground"
												onClick={() => setReportOpen(true)}
												disabled={!run}
												aria-label="عرض تقرير المسير"
											>
												<IconEye className="size-4" />
											</Button>
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>

				{/* الحالة الفارغة — لا يوجد موظفين */}
				{isEmpty && (
					<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
						<div className="flex size-[88px] items-center justify-center rounded-full bg-primary/[0.08] text-primary">
							<IconWallet
								className="size-10"
								stroke={1.5}
							/>
						</div>
						<div className="flex flex-col items-center gap-1">
							<h2 className="text-[14px] font-bold text-foreground">
								لا يوجد أي توظيف حتى الآن
							</h2>
							<p className="max-w-[280px] text-[12px] font-medium leading-[18px] text-foreground">
								أضف الموظفين لتظهر رواتبهم وبدلاتهم هنا للتمكن من إدارة الرواتب بالكامل من هنا.
							</p>
						</div>
						<Button
							type="button"
							className="h-[37px] gap-1.5 rounded-[4px] text-[12px]"
						>
							<IconPlus className="size-3.5" />
							إضافة أول موظف
						</Button>
					</div>
				)}
			</div>

			{/* ترقيم الصفحات */}
			{!isEmpty && (
				<TablePagination
					page={safePage}
					pageCount={pageCount}
					pageSize={pageSize}
					totalRows={rows.length}
					fromRow={fromRow}
					toRow={toRow}
					onPageChange={setPageIndex}
					onPageSizeChange={setPageSize}
				/>
			)}
		</div>
	);
}
