import { IconDownload } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTrialBalance } from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

/** [P2.7] Trial Balance — simple variant (BRD §18.2): opening/period/closing per account,
 * totals row that MUST foot equal. Zero-balance rows hidden from view, present in export. */
export const TrialBalancePage = () => {
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [search, setSearch] = useState("");

	const { report, isLoading } = useTrialBalance({ fromDate, toDate });

	const foots =
		!!report &&
		report.totals.closingDebit === report.totals.closingCredit &&
		report.totals.periodDebit === report.totals.periodCredit &&
		report.totals.openingDebit === report.totals.openingCredit;

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "حركة الفترة (مدين)",
				value: 0,
				valueLabel: report?.totals.periodDebit ?? "0",
				tooltip: "مجموع مدين الفترة عبر كل الحسابات.",
			},
			{
				title: "حركة الفترة (دائن)",
				value: 0,
				valueLabel: report?.totals.periodCredit ?? "0",
				tooltip: "مجموع دائن الفترة عبر كل الحسابات.",
			},
			{
				title: "التوازن",
				value: 0,
				valueLabel: report ? (foots ? "متوازن ✓" : "غير متوازن!") : "—",
				tooltip: "ميزان المراجعة يجب أن يتساوى مدينه ودائنه في كل أزواجه.",
			},
		],
		[report, foots],
	);

	const activeRows = useMemo(() => {
		const rows = (report?.rows ?? []).filter(
			(row) =>
				row.openingDebit !== "0" ||
				row.openingCredit !== "0" ||
				row.periodDebit !== "0" ||
				row.periodCredit !== "0" ||
				row.closingDebit !== "0" ||
				row.closingCredit !== "0",
		);
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				row.accountName.toLowerCase().includes(q) ||
				(row.accountNumber ?? "").toLowerCase().includes(q),
		);
	}, [report, search]);

	const exportCsv = () =>
		downloadCsv(
			"trial-balance",
			[
				"الحساب",
				"الرقم",
				"افتتاحي مدين",
				"افتتاحي دائن",
				"الفترة مدين",
				"الفترة دائن",
				"إقفال مدين",
				"إقفال دائن",
			],
			(report?.rows ?? []).map((row) => [
				row.accountName,
				row.accountNumber ?? "",
				row.openingDebit,
				row.openingCredit,
				row.periodDebit,
				row.periodCredit,
				row.closingDebit,
				row.closingCredit,
			]),
		);

	const amountCell = (value: string) => (
		<TableCell
			className="text-end tabular-nums"
			dir="ltr"
		>
			{value === "0" ? "—" : value}
		</TableCell>
	);

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">ميزان المراجعة</h1>
				<p className="text-muted-foreground text-sm">
					افتتاحي / حركة الفترة / إقفال لكل حساب — ويجب أن يتوازن (§18.2).
				</p>
			</div>

			<Stats
				className="px-4 grid-cols-3"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchPlaceholder="ابحث بالحساب أو الرقم..."
				searchValue={search}
				onSearchChange={setSearch}
				buttonSize="xs"
				showExport={false}
				leftExtra={
					<>
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={exportCsv}
							disabled={!report || report.rows.length === 0}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
						<Field className="w-36">
							<DateField
								value={fromDate}
								onChange={setFromDate}
								placeholder="من"
							/>
						</Field>
						<Field className="w-36">
							<DateField
								value={toDate}
								onChange={setToDate}
								placeholder="إلى"
							/>
						</Field>
					</>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>الحساب</TableHead>
							<TableHead className="text-end">افتتاحي مدين</TableHead>
							<TableHead className="text-end">افتتاحي دائن</TableHead>
							<TableHead className="text-end">الفترة مدين</TableHead>
							<TableHead className="text-end">الفترة دائن</TableHead>
							<TableHead className="text-end">إقفال مدين</TableHead>
							<TableHead className="text-end">إقفال دائن</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!isLoading && activeRows.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={7}
									className="py-8 text-center text-muted-foreground text-sm"
								>
									لا أرصدة في الفترة المحددة.
								</TableCell>
							</TableRow>
						)}
						{activeRows.map((row) => (
							<TableRow key={row.accountId}>
								<TableCell>
									{row.accountNumber && (
										<span
											dir="ltr"
											className="me-2 font-mono text-muted-foreground text-xs"
										>
											{row.accountNumber}
										</span>
									)}
									{row.accountName}
								</TableCell>
								{amountCell(row.openingDebit)}
								{amountCell(row.openingCredit)}
								{amountCell(row.periodDebit)}
								{amountCell(row.periodCredit)}
								{amountCell(row.closingDebit)}
								{amountCell(row.closingCredit)}
							</TableRow>
						))}
						{report && (
							<TableRow
								className={foots ? "bg-muted/40 font-bold" : "bg-destructive/10 font-bold"}
							>
								<TableCell>الإجمالي {foots ? "✓" : "— غير متوازن!"}</TableCell>
								{amountCell(report.totals.openingDebit)}
								{amountCell(report.totals.openingCredit)}
								{amountCell(report.totals.periodDebit)}
								{amountCell(report.totals.periodCredit)}
								{amountCell(report.totals.closingDebit)}
								{amountCell(report.totals.closingCredit)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
