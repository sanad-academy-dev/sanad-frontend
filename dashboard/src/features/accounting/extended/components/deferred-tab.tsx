import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import {
	useDeferredSchedule,
	useRunDeferred,
} from "@/features/accounting/extended/hooks/use-extended";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [P12.14] Tab «الاستحقاق المؤجل» (§15) — the recognition schedule and its monthly run.
 *
 * The run takes an EXPLICIT period rather than assuming "last month", because recognition is
 * the one job an accountant re-runs deliberately for a period they already closed and
 * reopened. It is idempotent at the database level — a second run over the same period writes
 * nothing — which is what makes exposing it as an ordinary button safe.
 */

export const DeferredTab = () => {
	const { schedule, isLoading } = useDeferredSchedule();
	const { runDeferred, isPending } = useRunDeferred();
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");

	const rows = schedule?.rows ?? [];

	return (
		<>
			<TabIntro
				title="الاستحقاق المؤجل"
				hint="الإيراد أو المصروف المؤجّل يُركن في حساب ميزانية عند الفوترة، ثم يُنقل شهرًا بشهر إلى الإيراد أو المصروف على مدى فترة الدورة. التشغيل على الفترة نفسها مرّتين لا يُضاعف الاعتراف."
			/>
			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
				<DateField
					value={from}
					onChange={setFrom}
					placeholder="بداية الفترة"
				/>
				<DateField
					value={to}
					onChange={setTo}
					placeholder="نهاية الفترة"
				/>
				<Button
					size="sm"
					disabled={isPending || !from || !to}
					onClick={() => runDeferred({ periodStartDate: from, periodEndDate: to })}
				>
					تشغيل الاعتراف
				</Button>
				{(!from || !to) && (
					<span className="text-muted-foreground text-xs">
						حدّد بداية الفترة ونهايتها — الاعتراف يخصّ فترة بعينها لا «الشهر الماضي» ضمنًا
					</span>
				)}
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "النوع", className: "w-24" },
						{ label: "المستند", className: "w-32" },
						{ label: "الصنف" },
						{ label: "من", className: "w-28" },
						{ label: "إلى", className: "w-28" },
						{ label: "الإجمالي", className: "w-28 text-end" },
						{ label: "المُعترف به", className: "w-28 text-end" },
						{ label: "المتبقّي", className: "w-28 text-end" },
					]}
					rows={rows}
					isLoading={isLoading}
					emptyMessage="لا سطور مؤجّلة. السطر يصير مؤجّلًا حين تُفعَّل عليه خانة التأجيل في الفاتورة مع تاريخَي بداية الدورة ونهايتها."
					rowKey={(row) => row.itemId}
					renderRow={(row) => (
						<>
							<TableCell>
								<Badge variant={row.type === "REVENUE" ? "default" : "secondary"}>
									{row.type === "REVENUE" ? "إيراد" : "مصروف"}
								</Badge>
							</TableCell>
							<TableCell className="truncate">{row.invoiceNo}</TableCell>
							<TableCell className="truncate">{row.itemName}</TableCell>
							<TableCell>{formatDisplayDate(row.serviceStartDate)}</TableCell>
							<TableCell>{formatDisplayDate(row.serviceEndDate)}</TableCell>
							<TableCell className="text-end tabular-nums">
								{String(row.totalAmount)}
							</TableCell>
							<TableCell className="text-end tabular-nums">
								{String(row.postedAmount)}
							</TableCell>
							<TableCell className="text-end font-medium tabular-nums">
								{String(row.pendingAmount)}
							</TableCell>
						</>
					)}
				/>
			</TabShell>
		</>
	);
};
