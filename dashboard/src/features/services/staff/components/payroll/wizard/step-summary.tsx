// المرحلة 4 — ملخص المسير: بطاقات الإجماليات + جدول الموظفين.
// عمود "الفرق عن الشهر السابق" يظهر فقط عند وجود مسير معتمد سابق فعلًا.
import { IconArrowDownRight, IconArrowUpRight, IconWallet } from "@tabler/icons-react";
import type { ReactNode } from "react";
import {
	DataTable,
	PayrollStat,
} from "@/features/services/staff/components/payroll/payroll-shared";
import { defaultPayDateLabel } from "@/features/services/staff/components/payroll/payroll-ui";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import type { PayrollLineResponse, PayrollRunDetail } from "@/server/payroll/payroll.type";

// مؤشر الفرق عن صافي الشهر السابق — يُخفى كليًا إن لم توجد مقارنة
function VarianceCell({
	current,
	previous,
}: {
	current: number;
	previous?: number;
}): ReactNode {
	if (previous === undefined || previous <= 0) {
		return <span className="text-[11px] text-muted-foreground">—</span>;
	}
	const delta = (current / previous - 1) * 100;
	if (Math.abs(delta) < 0.5) {
		return <span className="text-[11px] text-muted-foreground">بلا تغيير</span>;
	}
	const up = delta > 0;
	return (
		<span
			className={cn(
				"flex items-center gap-0.5 text-[11px] font-medium tabular-nums",
				up ? "text-destructive" : "text-emerald-600",
			)}
		>
			{up ? (
				<IconArrowUpRight className="size-3.5" />
			) : (
				<IconArrowDownRight className="size-3.5" />
			)}
			{Math.abs(delta).toFixed(1)}%
		</span>
	);
}

export function StepSummary({
	run,
	lines,
	previousNets,
}: {
	run: PayrollRunDetail | null;
	lines: PayrollLineResponse[];
	// null = لا يوجد مسير معتمد سابق ⇒ يُخفى عمود الفرق
	previousNets?: Record<string, number> | null;
}) {
	const { format } = useCurrency();
	if (!run) return null;

	const showVariance = !!previousNets;

	const payDate = run.payDate
		? new Date(run.payDate).toISOString().slice(0, 10)
		: defaultPayDateLabel(run.periodYear, run.periodMonth);

	// تفاصيل الدفع: من الاستحقاقات إلى إجمالي ما تتحمّله الشركة
	const paymentRows = [
		{ label: "إجمالي الاستحقاقات", value: run.totalGross },
		{ label: "استقطاعات الموظفين (تأمينات)", value: run.totalEmployeeGosi, negative: true },
		{ label: "صافي الرواتب المصروفة", value: run.totalNet, strong: true },
		{ label: "حصة الشركة (تأمينات)", value: run.totalCompanyGosi },
	];

	return (
		<div className="flex flex-col gap-4">
			{/* بانر الصرف — الرقم الأبرز في الشاشة */}
			<div className="flex items-start gap-3 rounded-lg bg-primary/[0.08] p-5">
				<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
					<IconWallet className="size-5" />
				</span>
				<div className="flex flex-col gap-1">
					<span className="text-xs text-foreground">
						سيتم صرف رواتب <span className="font-bold tabular-nums">{lines.length} موظف</span>{" "}
						بتاريخ <span className="font-bold tabular-nums">{payDate}</span>
					</span>
					<span className="font-heading text-3xl font-bold text-primary tabular-nums">
						{format(run.totalNet)}
					</span>
					<span className="text-[11px] text-muted-foreground tabular-nums">
						إجمالي تكلفة الشركة شاملة التأمينات: {format(run.totalCompanyCost)}
					</span>
				</div>
			</div>

			{/* تفاصيل الدفع */}
			<div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
				<span className="font-heading text-sm font-bold text-foreground">تفاصيل الدفع</span>
				{paymentRows.map((row) => (
					<div
						key={row.label}
						className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0"
					>
						<span
							className={cn(
								"text-xs",
								row.strong ? "font-medium text-foreground" : "text-muted-foreground",
							)}
						>
							{row.label}
						</span>
						<span
							className={cn(
								"text-xs tabular-nums",
								row.strong ? "font-bold text-foreground" : "text-foreground",
								row.negative && "text-destructive",
							)}
						>
							{row.negative ? "−" : ""}
							{format(row.value)}
						</span>
					</div>
				))}
				<div className="mt-1 flex items-center justify-between border-t border-border pt-3">
					<span className="text-sm font-bold text-foreground">إجمالي تكلفة المسير</span>
					<span className="font-heading text-lg font-bold text-primary tabular-nums">
						{format(run.totalCompanyCost)}
					</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
				<PayrollStat
					label="عدد الموظفين"
					value={String(lines.length)}
				/>
				<PayrollStat
					label="إجمالي الاستحقاقات"
					value={format(run.totalGross)}
				/>
				<PayrollStat
					label="استقطاعات الموظفين"
					value={format(run.totalEmployeeGosi)}
				/>
				<PayrollStat
					label="حصة الشركة (تأمينات)"
					value={format(run.totalCompanyGosi)}
				/>
				<PayrollStat
					label="إجمالي تكلفة الشركة"
					value={format(run.totalCompanyCost)}
				/>
				<PayrollStat
					label="صافي المسير"
					value={format(run.totalNet)}
					accent
				/>
			</div>

			<DataTable
				headers={
					showVariance
						? ["الموظف", "صافي الراتب", "الفرق عن الشهر السابق"]
						: ["الموظف", "صافي الراتب"]
				}
			>
				{lines.map((line) => (
					<tr
						key={line.id}
						className="border-t border-border"
					>
						<td className="px-3 py-3">
							<div className="flex flex-col">
								<span className="text-xs font-medium text-foreground">{line.staffName}</span>
								<span className="text-[10px] text-muted-foreground tabular-nums">
									{line.staffCode}
								</span>
							</div>
						</td>
						<td className="px-3 py-2.5 text-xs font-semibold text-foreground tabular-nums">
							{format(line.netPay)}
						</td>
						{showVariance && (
							<td className="px-3 py-3">
								<VarianceCell
									current={Number(line.netPay)}
									previous={previousNets?.[line.staffId]}
								/>
							</td>
						)}
					</tr>
				))}
			</DataTable>
		</div>
	);
}
