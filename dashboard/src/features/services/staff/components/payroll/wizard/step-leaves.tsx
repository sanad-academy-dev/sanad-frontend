// قسم الإجازات ضمن مرحلة الاحتساب — أيام كل نوع خلال الفترة والرصيد المتبقي.
// الأيام مشتقّة من طلبات الإجازة المعتمدة، فتُعرض للمراجعة لا للتحرير المباشر:
// تعديلها يتم من طلب الإجازة نفسه حتى يبقى مصدر الحقيقة واحدًا.
import { Spinner } from "@/components/ui/spinner";
import { useRunLeaves } from "@/features/services/staff/hooks/use-payroll";
import { cn } from "@/lib/utils";
import type { PayrollRunDetail } from "@/server/payroll/payroll.type";

export function StepLeaves({
	run,
	period,
}: {
	run: PayrollRunDetail | null;
	period: { year: number; month: number };
}) {
	const { leaves, isLoading } = useRunLeaves(run?.id ?? null);

	if (isLoading) {
		return (
			<div className="flex h-[200px] items-center justify-center">
				<Spinner />
			</div>
		);
	}

	if (!leaves || leaves.rows.length === 0) {
		return (
			<div className="py-10 text-center text-xs text-muted-foreground">
				لا توجد بيانات إجازات لهذه الفترة
			</div>
		);
	}

	// الأنواع التي لها أيام فعلية في هذه الفترة فقط — لتفادي جدول فارغ عريض
	const activeSlugs = new Set(
		leaves.rows.flatMap((r) => r.leaves.filter((l) => l.periodDays > 0).map((l) => l.slug)),
	);
	const columns = leaves.rows[0].leaves.filter((l) => activeSlugs.has(l.slug));

	if (columns.length === 0) {
		return (
			<div className="py-10 text-center text-xs text-muted-foreground">
				لا توجد إجازات معتمدة خلال فترة {period.month}/{period.year}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="text-[11px] leading-[17px] text-muted-foreground">
				الأيام مشتقّة من طلبات الإجازة المعتمدة ومقصوصة على حدود الفترة. لتعديلها عدّل الطلب نفسه
				ثم أعد الاحتساب.
			</p>

			<div className="overflow-x-auto rounded-lg border border-border">
				<table className="w-full min-w-[560px]">
					<thead className="bg-muted/60">
						<tr>
							<th className="px-3 py-2 text-start text-[11px] font-medium text-muted-foreground">
								الموظف
							</th>
							{columns.map((c) => (
								<th
									key={c.slug}
									className="px-3 py-2 text-start text-[11px] font-medium text-muted-foreground"
								>
									{c.name}
									{c.payPercent < 100 && (
										<span className="ms-1 text-[10px] text-amber-600">({c.payPercent}%)</span>
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{leaves.rows.map((row) => (
							<tr
								key={row.staffId}
								className="border-t border-border"
							>
								<td className="px-3 py-2.5 text-xs text-foreground">{row.staffName}</td>
								{columns.map((c) => {
									const cell = row.leaves.find((l) => l.slug === c.slug);
									if (!cell)
										return (
											<td
												key={c.slug}
												className="px-3 py-2.5"
											/>
										);
									return (
										<td
											key={c.slug}
											className="px-3 py-2.5"
										>
											<div className="flex flex-col leading-tight">
												<span
													className={cn(
														"text-xs tabular-nums",
														cell.periodDays > 0
															? "font-medium text-foreground"
															: "text-muted-foreground",
													)}
												>
													{cell.periodDays > 0 ? `${cell.periodDays} يوم` : "—"}
												</span>
												{/* الرصيد غير المتتبَّع (entitlementDays = null) لا يعرض سطر المتبقي */}
												{cell.remaining !== null && (
													<span className="text-[10px] text-muted-foreground tabular-nums">
														المتبقي: {cell.remaining}
													</span>
												)}
											</div>
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
