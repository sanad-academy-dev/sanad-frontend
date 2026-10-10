// المرحلة 3 — اكتشاف المشاكل قبل الاعتماد.
// المشاكل تأتي من المحرك محفوظةً على كل سطر، وتُعاد كتابتها في كل احتساب.
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	DataTable,
	SectionHeader,
} from "@/features/services/staff/components/payroll/payroll-shared";
import { cn } from "@/lib/utils";

export interface WizardIssue {
	lineId: string;
	code: string;
	message: string;
	severity: "error" | "warning";
	blocking: boolean;
	staffName: string;
}

export function StepIssues({
	issues,
	ignored,
	onToggleIgnore,
}: {
	issues: WizardIssue[];
	ignored: Set<string>;
	onToggleIgnore: (id: string) => void;
}) {
	if (issues.length === 0) {
		return (
			<div className="flex flex-col items-center gap-3 py-10">
				<span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
					<IconCircleCheck className="size-7" />
				</span>
				<h3 className="font-heading text-base font-bold text-foreground">لا توجد مشاكل</h3>
				<span className="text-xs text-muted-foreground">جميع الأسطر جاهزة للاعتماد</span>
			</div>
		);
	}

	const blocking = issues.filter((i) => i.blocking && !ignored.has(`${i.lineId}-${i.code}`));
	// المانعة أولًا: هي ما يوقف الاعتماد فيجب أن تُقرأ قبل التحذيرات
	const ordered = [...issues].sort(
		(a, b) =>
			Number(b.blocking) - Number(a.blocking) || a.staffName.localeCompare(b.staffName),
	);

	return (
		<div className="flex flex-col gap-3">
			<SectionHeader
				title="اكتشاف المشاكل"
				description="المشاكل المانعة توقف الاعتماد حتى تُحلّ؛ التنبيهات لا تمنع المتابعة"
			/>

			<div
				className={cn(
					"flex items-center gap-2 rounded-lg border px-3 py-2.5",
					blocking.length > 0
						? "border-destructive/30 bg-destructive/[0.06]"
						: "border-amber-300 bg-amber-50",
				)}
			>
				<IconAlertTriangle
					className={cn("size-4", blocking.length > 0 ? "text-destructive" : "text-amber-600")}
				/>
				<span
					className={cn(
						"text-xs font-medium",
						blocking.length > 0 ? "text-destructive" : "text-amber-800",
					)}
				>
					{blocking.length > 0
						? `${blocking.length} مشكلة مانعة يجب حلّها قبل المتابعة`
						: `${issues.length} تنبيه غير مانع — يمكنك المتابعة`}
				</span>
			</div>

			<DataTable headers={["المشكلة", "الموظف", "الإجراء"]}>
				{ordered.map((issue) => {
					const key = `${issue.lineId}-${issue.code}`;
					const isIgnored = ignored.has(key);
					return (
						<tr
							key={key}
							className={cn("border-t border-border", isIgnored && "opacity-50")}
						>
							<td className="px-3 py-3">
								<span className="flex items-center gap-2 text-xs text-foreground">
									<span
										className={cn(
											"size-[6px] shrink-0 rounded-full",
											issue.severity === "error" ? "bg-destructive" : "bg-amber-500",
										)}
									/>
									{issue.message}
								</span>
							</td>
							<td className="px-3 py-2.5 text-xs text-muted-foreground">{issue.staffName}</td>
							<td className="px-3 py-3">
								{/* المانعة لا تُتجاهل — تُحل من ملف الموظف أو باستثنائه من المسير */}
								{issue.blocking ? (
									<span className="text-[11px] text-destructive">تُحل من ملف الموظف</span>
								) : (
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-7 text-[11px]"
										onClick={() => onToggleIgnore(key)}
									>
										{isIgnored ? "إلغاء التجاهل" : "تجاهل"}
									</Button>
								)}
							</td>
						</tr>
					);
				})}
			</DataTable>
		</div>
	);
}
