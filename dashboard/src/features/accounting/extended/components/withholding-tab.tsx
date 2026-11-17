import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import { useWithholdingSummary } from "@/features/accounting/extended/hooks/use-extended";

/**
 * [P12.14] Tab «الاستقطاع الضريبي» (BR-8.2) — withholding by category and party.
 *
 * Shows the actual withheld amount and effective rate per party and category for the selected
 * period, matching the server report contract.
 */

const today = () => new Date().toISOString().slice(0, 10);
const yearStart = () => `${new Date().getUTCFullYear()}-01-01`;

export const WithholdingTab = () => {
	const [from, setFrom] = useState(yearStart);
	const [to, setTo] = useState(today);
	const { rows, isLoading } = useWithholdingSummary(from, to);

	return (
		<>
			<TabIntro
				title="ملخّص الاستقطاع الضريبي"
				hint="ما استُقطع من كل مورّد في المدى المحدَّد، مجمّعًا بالفئة. العتبات تُحسب تراكميًا على المورّد لا على الفاتورة، فمورّد تحت العتبة اليوم قد يتجاوزها بفاتورة غد."
			/>
			<div className="flex flex-wrap items-center gap-2 border-b px-4 py-2">
				<DateField
					value={from}
					onChange={setFrom}
					placeholder="من تاريخ"
				/>
				<DateField
					value={to}
					onChange={setTo}
					placeholder="إلى تاريخ"
				/>
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "الفئة" },
						{ label: "الطرف" },
						{ label: "عدد المستندات", className: "w-24 text-end" },
						{ label: "الوعاء", className: "w-32 text-end" },
						{ label: "المستقطع", className: "w-32 text-end" },
						{ label: "النسبة الفعلية", className: "w-28 text-end" },
					]}
					rows={rows}
					isLoading={isLoading}
					emptyMessage="لا استقطاعات في هذا المدى. يُسجَّل القيد حين تُرحَّل فاتورة مشتريات على مورّد له فئة استقطاع تجاوزت عتبتها."
					rowKey={(row) => `${row.categoryTitle}:${row.partyType}:${row.partyId}`}
					renderRow={(row) => (
						<>
							<TableCell className="truncate">{row.categoryTitle}</TableCell>
							<TableCell className="truncate">{row.partyId}</TableCell>
							<TableCell className="text-end">{row.documentCount}</TableCell>
							<TableCell className="text-end tabular-nums">{row.taxableAmount}</TableCell>
							<TableCell className="text-end font-medium tabular-nums">
								{row.taxAmount}
							</TableCell>
							<TableCell className="text-end tabular-nums">{row.effectiveRate}%</TableCell>
						</>
					)}
				/>
			</TabShell>
		</>
	);
};
