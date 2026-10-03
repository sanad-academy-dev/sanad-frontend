// جدول الاحتساب التفاعلي — سطر لكل موظف مع تعديل يدوي مباشر.
// كل تعديل يُحفظ على الخادم، والصافي يعود محسوبًا منه لا محسوبًا هنا.

import { IconClock } from "@tabler/icons-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DataTable,
	EmptyRow,
} from "@/features/services/staff/components/payroll/payroll-shared";
import {
	effectiveOvertime,
	effectivePayment,
	getInitials,
	lineIssues,
} from "@/features/services/staff/components/payroll/payroll-ui";
import {
	EarningsEditor,
	NoteEditor,
	OverrideNumberEditor,
} from "@/features/services/staff/components/payroll/wizard/line-editors";
import { useCurrency } from "@/hooks/use-currency";
import { cn } from "@/lib/utils";
import type {
	PayrollEarningType,
	PayrollLineResponse,
	PayrollPaymentMethod,
} from "@/server/payroll/payroll.type";
import { PAYROLL_PAYMENT_METHOD_LABEL } from "@sanad/contracts/runtime/server/staff-compensation/staff-compensation.type";

const PAYMENT_METHODS: PayrollPaymentMethod[] = ["TRANSFER", "CASH", "CHECK"];

export interface LineActions {
	setOvertime: (lineId: string, hours: number) => void;
	clearOvertime: (lineId: string) => void;
	setPaymentMethod: (lineId: string, method: PayrollPaymentMethod) => void;
	setNote: (lineId: string, note: string | null) => void;
	addEarning: (lineId: string, type: PayrollEarningType, amount: number, note: string) => void;
	removeEarning: (earningId: string) => void;
}

export function PayrollLinesTable({
	lines,
	actions,
	readOnly,
	totalHoursByStaff,
}: {
	lines: PayrollLineResponse[];
	actions: LineActions;
	readOnly?: boolean;
	// إجمالي ساعات الحضور غير مخزّن على السطر، فيُوصل من معاينة الفترة نفسها
	totalHoursByStaff?: Map<string, number>;
}) {
	const { format } = useCurrency();
	return (
		<DataTable
			minWidth="880px"
			headers={[
				"الموظف",
				"ساعات العمل",
				"استحقاقات إضافية",
				"صافي السطر",
				"طريقة الدفع",
				"ملاحظة",
			]}
		>
			{lines.map((line) => {
				const issues = lineIssues(line);
				const blocking = issues.filter((i) => i.blocking);
				const disabled = readOnly || line.excluded;

				return (
					<tr
						key={line.id}
						className={cn("border-t border-border", line.excluded && "bg-muted/40 opacity-60")}
					>
						<td className="px-3 py-2.5">
							<div className="flex items-center gap-2">
								<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
									{getInitials(line.staffName)}
								</span>
								<div className="flex flex-col leading-tight">
									<span className="text-xs font-medium text-foreground">{line.staffName}</span>
									{/* السطر الثانوي: الكود والراتب الأساسي */}
									<span className="text-[10px] text-muted-foreground tabular-nums">
										{line.staffCode} · {format(line.baseSalary)}/شهر
									</span>
									{blocking.length > 0 && (
										<span className="text-[10px] text-destructive">{blocking[0].message}</span>
									)}
								</div>
							</div>
						</td>

						<td className="px-3 py-2.5">
							{line.excluded ? (
								<span className="text-[11px] text-muted-foreground">—</span>
							) : (
								<div className="flex flex-col gap-1">
									<span className="flex items-center gap-1 text-xs text-foreground tabular-nums">
										<IconClock className="size-3.5 text-muted-foreground" />
										{totalHoursByStaff?.get(line.staffId) ?? 0} ساعة
										<span className="text-[10px] text-muted-foreground">إجمالي</span>
									</span>
									<OverrideNumberEditor
										suggested={Number(line.overtimeHoursSuggested)}
										override={
											line.overtimeHoursOverride === null
												? null
												: Number(line.overtimeHoursOverride)
										}
										unit="ساعة"
										label="إضافي"
										addLabel="إضافة إضافي"
										onSave={(v) => actions.setOvertime(line.id, v)}
										onClear={() => actions.clearOvertime(line.id)}
										disabled={disabled}
									/>
								</div>
							)}
						</td>

						<td className="px-3 py-2.5">
							{line.excluded ? (
								<span className="text-[11px] text-muted-foreground">—</span>
							) : (
								<EarningsEditor
									line={line}
									onAdd={(t, a, n) => actions.addEarning(line.id, t, a, n)}
									onRemove={actions.removeEarning}
									disabled={disabled}
								/>
							)}
						</td>

						<td className="px-3 py-2.5">
							<div className="flex flex-col leading-tight">
								<span
									className={cn(
										"text-[12px] font-semibold tabular-nums",
										line.excluded ? "text-muted-foreground" : "text-foreground",
									)}
								>
									{line.excluded ? "مستثنى" : format(line.netPay)}
								</span>
								{!line.excluded && Number(line.overtimePay) > 0 && (
									<span className="text-[10px] text-primary tabular-nums">
										+{format(line.overtimePay)} إضافي
									</span>
								)}
								{!line.excluded && Number(line.leaveDeduction) > 0 && (
									<span className="text-[10px] text-destructive tabular-nums">
										−{format(line.leaveDeduction)} إجازات
									</span>
								)}
							</div>
						</td>

						<td className="px-3 py-2.5">
							{line.excluded ? (
								<span className="text-[11px] text-muted-foreground">—</span>
							) : (
								<div className="flex flex-col gap-0.5">
									<Select
										value={effectivePayment(line)}
										onValueChange={(v) =>
											actions.setPaymentMethod(line.id, v as PayrollPaymentMethod)
										}
										disabled={disabled}
										dir="rtl"
									>
										<SelectTrigger
											size="sm"
											className="h-7 w-[110px] text-[11px]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent dir="rtl">
											{PAYMENT_METHODS.map((m) => (
												<SelectItem
													key={m}
													value={m}
												>
													{PAYROLL_PAYMENT_METHOD_LABEL[m]}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{line.paymentMethodOverride !== null && (
										<span className="text-[10px] text-muted-foreground">
											المقترح: {PAYROLL_PAYMENT_METHOD_LABEL[line.paymentMethodSuggested]}
										</span>
									)}
								</div>
							)}
						</td>

						<td className="px-3 py-2.5">
							{line.excluded ? (
								<span className="text-[11px] text-muted-foreground">—</span>
							) : (
								<NoteEditor
									note={line.note}
									onSave={(v) => actions.setNote(line.id, v)}
									disabled={disabled}
								/>
							)}
						</td>
					</tr>
				);
			})}
			{lines.length === 0 && (
				<EmptyRow
					colSpan={6}
					message="لم تُحتسب أسطر بعد"
				/>
			)}
		</DataTable>
	);
}

// مُصدَّرة للاستعمال في خطوة الإجازات
export { effectiveOvertime };
