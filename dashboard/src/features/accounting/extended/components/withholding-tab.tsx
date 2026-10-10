import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Badge } from "@/components/ui/badge";
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
 * «شهادات ناقصة» is the actionable column and is highlighted when non-zero. Withheld tax the
 * supplier has no certificate for is money they cannot reclaim, and it turns into a dispute
 * months later — surfacing the count is the difference between a report and a to-do list.
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
						{ label: "عدد القيود", className: "w-24 text-end" },
						{ label: "الوعاء", className: "w-32 text-end" },
						{ label: "المستقطع", className: "w-32 text-end" },
						{ label: "شهادات ناقصة", className: "w-28 text-end" },
					]}
					rows={rows}
					isLoading={isLoading}
					emptyMessage="لا استقطاعات في هذا المدى. يُسجَّل القيد حين تُرحَّل فاتورة مشتريات على مورّد له فئة استقطاع تجاوزت عتبتها."
					rowKey={(row) => `${row.categoryId}:${row.partyType}:${row.partyId}`}
					renderRow={(row) => (
						<>
							<TableCell className="truncate">{row.categoryName}</TableCell>
							<TableCell className="truncate">{row.partyId}</TableCell>
							<TableCell className="text-end">{row.entries}</TableCell>
							<TableCell className="text-end tabular-nums">{row.taxableAmount}</TableCell>
							<TableCell className="text-end font-medium tabular-nums">
								{row.taxAmount}
							</TableCell>
							<TableCell className="text-end">
								{row.missingCertificates > 0 ? (
									<Badge variant="destructive">{row.missingCertificates}</Badge>
								) : (
									<span className="text-muted-foreground">٠</span>
								)}
							</TableCell>
						</>
					)}
				/>
			</TabShell>
		</>
	);
};
