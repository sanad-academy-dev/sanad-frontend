// المرحلة 6 — إنهاء التشغيل: بطاقات النتيجة + توزيع تكلفة الشركة + التقرير الكامل.
import {
	IconCalendarPlus,
	IconCash,
	IconCircleCheck,
	IconFileText,
	IconWallet,
} from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	type PayrollDistribution,
	PayrollDistributionDonut,
} from "@/features/services/staff/components/payroll/payroll-distribution-donut";
import { PayrollReportSheet } from "@/features/services/staff/components/payroll/payroll-report-sheet";
import { PayrollStat } from "@/features/services/staff/components/payroll/payroll-shared";
import { useCurrency } from "@/hooks/use-currency";
import type { PayrollRunDetail } from "@/server/payroll/payroll.type";

const formatDate = (value: Date | string | null): string => {
	if (!value) return "—";
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? "—" : d.toISOString().slice(0, 10);
};

export function StepFinish({ run, period }: { run: PayrollRunDetail | null; period: string }) {
	const { format } = useCurrency();
	const [reportOpen, setReportOpen] = useState(false);

	if (!run) return null;

	// تاريخ الصرف غير مضبوط على المسير حاليًا، فيُعرض اسم الفترة بديلًا
	const payDate = formatDate(run.payDate) !== "—" ? formatDate(run.payDate) : period;

	return (
		<div className="flex flex-col gap-4">
			<PayrollReportSheet
				run={run}
				open={reportOpen}
				onClose={() => setReportOpen(false)}
			/>

			<div className="flex flex-col items-center gap-2 py-1 text-center">
				<span className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
					<IconCircleCheck className="size-6" />
				</span>
				<h3 className="font-heading text-lg font-bold text-foreground">
					تم إنشاء المسير بنجاح
				</h3>
				<span className="text-xs text-muted-foreground">
					سيتم صرف {format(run.totalNet)} لـ {run._count.lines} موظف بتاريخ {payDate}
				</span>
			</div>

			<div className="grid grid-cols-3 gap-2.5">
				<PayrollStat
					icon={<IconWallet className="size-4" />}
					label="صافي المسير"
					value={format(run.totalNet)}
					accent
				/>
				<PayrollStat
					icon={<IconCalendarPlus className="size-4" />}
					label="تاريخ الإنشاء"
					value={formatDate(run.createdAt)}
				/>
				<PayrollStat
					icon={<IconCash className="size-4" />}
					label="تاريخ الصرف"
					value={payDate}
				/>
			</div>

			<PayrollDistributionDonut
				distribution={run.distribution as PayrollDistribution | null}
				action={
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-8 gap-1.5 text-[11px]"
						onClick={() => setReportOpen(true)}
					>
						<IconFileText className="size-3.5" />
						عرض التقرير الكامل
					</Button>
				}
			/>
		</div>
	);
}
