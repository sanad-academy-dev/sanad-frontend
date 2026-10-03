// المرحلة 5 — اعتماد المسير. خطوة واحدة، والمعتمِد هو المستخدم الحالي.
// الاعتماد يجمّد الأسطر ويثبّت لقطة التوزيع التي يقرأ منها التقرير.
import { IconCheck, IconLock } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	PayrollStat,
	SectionHeader,
} from "@/features/services/staff/components/payroll/payroll-shared";
import { useCurrency } from "@/hooks/use-currency";
import type { PayrollRunDetail } from "@/server/payroll/payroll.type";

export function StepApproval({
	run,
	onApprove,
	isPending,
}: {
	run: PayrollRunDetail | null;
	onApprove: () => void;
	isPending: boolean;
}) {
	const { format } = useCurrency();
	if (!run) return null;

	const approved = run.status === "APPROVED" || run.status === "PAID";
	const step = run.approvalSteps[0];

	return (
		<div className="flex flex-col gap-4">
			<SectionHeader
				title="الاعتماد"
				description="الاعتماد يجمّد المسير نهائيًا ولا يمكن تعديله بعده"
			/>

			<div className="grid grid-cols-2 gap-2.5">
				<PayrollStat
					label="صافي المسير"
					value={format(run.totalNet)}
				/>
				<PayrollStat
					label="عدد الموظفين"
					value={String(run._count.lines)}
				/>
			</div>

			<div
				className={`flex flex-col gap-3 rounded-lg border p-4 ${
					approved
						? "border-emerald-500/30 bg-emerald-500/[0.06]"
						: "border-primary/30 bg-primary/[0.04]"
				}`}
			>
				<div className="flex items-center gap-2.5">
					<span
						className={`flex size-9 items-center justify-center rounded-full ${
							approved ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
						}`}
					>
						{approved ? <IconCheck className="size-5" /> : <IconLock className="size-5" />}
					</span>
					<div className="flex flex-col">
						<span className="text-sm font-bold text-foreground">
							{step?.title ?? "اعتماد المسير"}
						</span>
						<span className="text-[11px] text-muted-foreground">
							{approved
								? `اعتُمد بواسطة ${step?.approver?.name ?? "المستخدم الحالي"}${
										step?.actedAt
											? ` · ${new Date(step.actedAt).toLocaleString("ar", {
													dateStyle: "medium",
													timeStyle: "short",
												})}`
											: ""
									}`
								: "سيُسجَّل اعتمادك باسمك وتاريخه ووقته"}
						</span>
					</div>
				</div>

				{!approved && (
					<Button
						type="button"
						size="sm"
						className="h-9 w-fit text-xs"
						onClick={onApprove}
						disabled={isPending}
					>
						اعتماد المسير
					</Button>
				)}
			</div>
		</div>
	);
}
