// المرحلة 2 — الاحتساب. يستدعي الخادم ويعرض النتيجة الفعلية.
import { IconAlertTriangle, IconCalculator, IconCheck } from "@tabler/icons-react";
import type { UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	type LineActions,
	PayrollLinesTable,
} from "@/features/services/staff/components/payroll/wizard/payroll-lines-table";
import { StepLeaves } from "@/features/services/staff/components/payroll/wizard/step-leaves";
import { useCurrency } from "@/hooks/use-currency";
import type { PayrollRunDetail } from "@/server/payroll/payroll.type";

// نتيجة الاحتساب: إمّا تأكيد مطلوب لحذف أسطر عليها تعديلات يدوية، وإمّا تم
type CalcResult =
	| { status: "NEEDS_CONFIRMATION"; removals: { staffName: string; reasons: string[] }[] }
	| { status: "CALCULATED"; lineCount: number; removedCount: number };

const REASON_LABEL: Record<string, string> = {
	override: "تعديل يدوي",
	note: "ملاحظة",
	earnings: "استحقاقات إضافية",
};

export function StepCalculate({
	runId,
	run,
	isLoading,
	calculate,
	actions,
	totalHoursByStaff,
}: {
	runId: string | null;
	run: PayrollRunDetail | null;
	isLoading: boolean;
	calculate: UseMutationResult<unknown, Error, { confirmRemovals?: boolean }>;
	actions: LineActions;
	totalHoursByStaff?: Map<string, number>;
}) {
	const { format } = useCurrency();
	const [pendingRemovals, setPendingRemovals] = useState<
		{ staffName: string; reasons: string[] }[] | null
	>(null);

	const calculated = run?.status !== "DRAFT" && (run?.lines.length ?? 0) > 0;

	const runCalculation = async (confirmRemovals?: boolean) => {
		const result = (await calculate.mutateAsync({ confirmRemovals })) as CalcResult;
		setPendingRemovals(result.status === "NEEDS_CONFIRMATION" ? result.removals : null);
	};

	if (!runId || isLoading) {
		return (
			<div className="flex h-[220px] items-center justify-center">
				<Spinner />
			</div>
		);
	}

	const readOnly = run?.status === "APPROVED" || run?.status === "PAID";

	return (
		<div className="flex flex-col gap-3">
			{/* شريط علوي: حالة الاحتساب + إعادة الاحتساب */}
			<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
				<div className="flex items-center gap-2">
					<span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						{calculate.isPending ? (
							<Spinner className="size-4" />
						) : calculated ? (
							<IconCheck className="size-4" />
						) : (
							<IconCalculator className="size-4" />
						)}
					</span>
					<div className="flex flex-col leading-tight">
						<span className="text-xs font-bold text-foreground">
							{calculate.isPending
								? "جارٍ الاحتساب..."
								: calculated
									? `${run?.lines.length} موظف · صافي ${format(run?.totalNet)}`
									: "لم يُحتسب بعد"}
						</span>
						<span className="text-[10px] text-muted-foreground">
							إعادة الاحتساب لا تمسّ التعديلات اليدوية
						</span>
					</div>
				</div>

				{!readOnly && (
					<Button
						type="button"
						size="sm"
						variant={calculated ? "outline" : "default"}
						className="h-8 text-[11px]"
						onClick={() => runCalculation()}
						disabled={calculate.isPending}
					>
						{calculated ? "إعادة الاحتساب" : "بدء الاحتساب"}
					</Button>
				)}
			</div>

			{/* موظفون خرجوا من النطاق وعليهم تعديلات يدوية — لا تُحذف بصمت */}
			{pendingRemovals && pendingRemovals.length > 0 && (
				<div className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
					<span className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
						<IconAlertTriangle className="size-4" />
						سيُحذف {pendingRemovals.length} سطرًا عليه تعديلات يدوية
					</span>
					<ul className="flex flex-col gap-1">
						{pendingRemovals.map((r) => (
							<li
								key={r.staffName}
								className="text-[11px] text-amber-800"
							>
								{r.staffName} — {r.reasons.map((x) => REASON_LABEL[x] ?? x).join("، ")}
							</li>
						))}
					</ul>
					<div className="flex gap-2">
						<Button
							type="button"
							size="sm"
							variant="outline"
							className="h-8 text-[11px]"
							onClick={() => setPendingRemovals(null)}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							size="sm"
							className="h-8 text-[11px]"
							onClick={() => runCalculation(true)}
							disabled={calculate.isPending}
						>
							تأكيد الحذف والمتابعة
						</Button>
					</div>
				</div>
			)}

			{calculated ? (
				<Tabs
					defaultValue="lines"
					dir="rtl"
				>
					<TabsList className="w-full justify-start">
						<TabsTrigger
							value="lines"
							className="text-xs"
						>
							الاستحقاقات
						</TabsTrigger>
						<TabsTrigger
							value="leaves"
							className="text-xs"
						>
							الإجازات
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="lines"
						className="mt-3"
					>
						<PayrollLinesTable
							lines={run?.lines ?? []}
							actions={actions}
							readOnly={readOnly}
							totalHoursByStaff={totalHoursByStaff}
						/>
					</TabsContent>

					<TabsContent
						value="leaves"
						className="mt-3"
					>
						<StepLeaves
							run={run}
							period={{ year: run?.periodYear ?? 0, month: run?.periodMonth ?? 0 }}
						/>
					</TabsContent>
				</Tabs>
			) : (
				<div className="flex flex-col items-center gap-2 py-10 text-center">
					<span className="text-sm font-medium text-foreground">جاهز للاحتساب</span>
					<span className="max-w-[380px] text-[11px] leading-[17px] text-muted-foreground">
						سيُحتسب الراتب من ملف تعويضات كل موظف وسجلات الحضور والإجازات المعتمدة خلال الفترة.
					</span>
				</div>
			)}
		</div>
	);
}
