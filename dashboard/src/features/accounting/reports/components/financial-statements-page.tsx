import { IconDownload, IconFileSpreadsheet, IconPrinter } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { DateField } from "@/components/common/date-field";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ReportPresetBar } from "@/features/accounting/reports/components/report-preset-bar";
import {
	useBalanceSheet,
	useCashFlow,
	useProfitAndLoss,
} from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv } from "@/features/accounting/utils/export-csv";
import { downloadXlsx } from "@/features/accounting/utils/export-xlsx";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { useReportPrint } from "@/features/accounting/utils/report-print";
import { cn } from "@/lib/utils";
import type { StatementRow } from "@/server/accounting/reports/statement-engine/tree-aggregate";

/**
 * [P9.5] «القوائم المالية» — BS / P&L / Cash Flow on the §18.1 engine, one page with
 * in-page pills (§7.8 hub rule). The BS shows the provisional-profit line and a balance
 * indicator; every figure is server-computed (the screen never sums money — C2).
 */

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const TABS = [
	{ value: "bs", label: "الميزانية العمومية" },
	{ value: "pnl", label: "قائمة الدخل" },
	{ value: "cf", label: "التدفقات النقدية" },
] as const;
type Tab = (typeof TABS)[number]["value"];
const isTab = (value: string | undefined): value is Tab =>
	TABS.some((entry) => entry.value === value);

/**
 * [P12.11] صفوف المجاميع تُطبَع بخطّ عريض. تُطابَق بالنصّ لأن `exportRows()` تُسطِّح
 * الشجرة إلى صفوف بلا وسم، وإضافة وسم لها كانت ستغيّر شكل CSV و Excel معًا لأجل
 * الطباعة وحدها.
 */
const TOTAL_ROW_LABELS = new Set([
	"إجمالي الأصول",
	"إجمالي الالتزامات وحقوق الملكية",
	"الربح المؤقت (قبل الإقفال)",
	"إجمالي الإيرادات",
	"إجمالي المصروفات",
	"صافي الربح",
	"صافي التغير النقدي",
	"النقد أول المدة",
	"النقد آخر المدة",
]);

const PERIODICITIES = [
	{ value: "Monthly", label: "شهري" },
	{ value: "Quarterly", label: "ربع سنوي" },
	{ value: "Half-Yearly", label: "نصف سنوي" },
	{ value: "Yearly", label: "سنوي" },
] as const;

const SectionRows = ({ rows, periodCount }: { rows: StatementRow[]; periodCount: number }) => (
	<>
		{rows.map((row) => (
			<TableRow key={row.accountId}>
				<TableCell
					className={cn(row.isGroup && "font-semibold")}
					style={{ paddingInlineStart: `${row.depth * 1.25 + 0.75}rem` }}
				>
					{row.accountNumber ? (
						<span
							dir="ltr"
							className="me-1 text-muted-foreground text-xs"
						>
							{row.accountNumber}
						</span>
					) : null}
					{row.isGroup ? (
						row.accountName
					) : (
						// §18.1 drill-through — every leaf statement row lands on the GL report
						<Link
							to="/management/accounting/general-ledger"
							search={{ accountId: row.accountId }}
							className="underline-offset-2 hover:text-primary hover:underline"
						>
							{row.accountName}
						</Link>
					)}
				</TableCell>
				{Array.from({ length: periodCount }, (_, i) => (
					<TableCell
						key={`${row.accountId}-${i}`}
						className="text-end tabular-nums"
						dir="ltr"
					>
						{formatAmount(row.values[i] ?? "0")}
					</TableCell>
				))}
			</TableRow>
		))}
	</>
);

const TotalRow = ({
	label,
	values,
	emphasize,
}: {
	label: string;
	values: string[];
	emphasize?: boolean;
}) => (
	<TableRow className={cn(emphasize ? "bg-muted/60 font-semibold" : "font-medium")}>
		<TableCell>{label}</TableCell>
		{values.map((value, i) => (
			<TableCell
				key={`${label}-${i}`}
				className="text-end tabular-nums"
				dir="ltr"
			>
				{formatAmount(value)}
			</TableCell>
		))}
	</TableRow>
);

export const FinancialStatementsPage = () => {
	const [tab, setTab] = useState<Tab>("bs");
	const [search, setSearch] = useState("");
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [periodicity, setPeriodicity] = useState("Yearly");
	const { printDocument, printReport } = useReportPrint();

	const range = { fromDate, toDate, periodicity };
	const { report: bs, isLoading: bsLoading } = useBalanceSheet(range);
	const { report: pnl, isLoading: pnlLoading } = useProfitAndLoss(range);
	const { report: cf, isLoading: cfLoading } = useCashFlow(range);

	const periods =
		(tab === "bs" ? bs?.periods : tab === "pnl" ? pnl?.periods : cf?.periods) ?? [];
	const q = search.trim().toLowerCase();
	const match = (row: StatementRow) =>
		!q ||
		row.accountName.toLowerCase().includes(q) ||
		(row.accountNumber ?? "").toLowerCase().includes(q);
	const loading = tab === "bs" ? bsLoading : tab === "pnl" ? pnlLoading : cfLoading;

	const exportRows = (): { headers: string[]; rows: string[][]; name: string } => {
		const headers = ["البند", ...periods.map((p) => p.label)];
		if (tab === "bs" && bs) {
			const flat = (rows: StatementRow[]) =>
				rows.map((row) => [row.accountName, ...row.values]);
			return {
				name: "balance-sheet",
				headers,
				rows: [
					...flat(bs.assets.rows),
					["إجمالي الأصول", ...bs.assets.totals],
					...flat(bs.liabilities.rows),
					...flat(bs.equity.rows),
					["الربح المؤقت (قبل الإقفال)", ...bs.provisionalProfit],
					["إجمالي الالتزامات وحقوق الملكية", ...bs.totalLiabilitiesAndEquity],
				],
			};
		}
		if (tab === "pnl" && pnl) {
			return {
				name: "profit-and-loss",
				headers,
				rows: [
					...pnl.income.rows.map((row) => [row.accountName, ...row.values]),
					["إجمالي الإيرادات", ...pnl.income.totals],
					...pnl.expense.rows.map((row) => [row.accountName, ...row.values]),
					["إجمالي المصروفات", ...pnl.expense.totals],
					["صافي الربح", ...pnl.netProfit],
				],
			};
		}
		if (cf) {
			return {
				name: "cash-flow",
				headers,
				rows: [
					...cf.rows.map((row) => [row.label, ...row.values]),
					["صافي التغير النقدي", ...cf.netChange],
					["النقد أول المدة", ...cf.openingCash],
					["النقد آخر المدة", ...cf.closingCash],
				],
			};
		}
		return { name: "statement", headers, rows: [] };
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			{printDocument}
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">القوائم المالية</h1>
				<p className="text-muted-foreground text-sm">
					§18.1 — الميزانية العمومية (بربح مؤقت قبل الإقفال)، قائمة الدخل، والتدفقات النقدية
					غير المباشرة — كلها من محرك القوائم الموحد.
				</p>
			</div>

			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث باسم الحساب..."
				showFilter={false}
				showExport={false}
				buttonSize="xs"
				leftExtra={
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1">
							{TABS.map((entry) => (
								<button
									key={entry.value}
									type="button"
									onClick={() => setTab(entry.value)}
									className={cn(
										"rounded-full border border-border px-2.5 py-0.5 text-xs transition-colors",
										tab === entry.value
											? "border-primary bg-primary text-primary-foreground"
											: "text-muted-foreground hover:bg-muted",
									)}
								>
									{entry.label}
								</button>
							))}
						</div>
						<DateField
							value={fromDate}
							onChange={setFromDate}
							placeholder="من تاريخ"
						/>
						<DateField
							value={toDate}
							onChange={setToDate}
							placeholder="إلى تاريخ"
						/>
						<div className="w-32">
							<Select
								value={periodicity}
								onValueChange={setPeriodicity}
								dir="rtl"
							>
								<SelectTrigger className="h-8">
									<SelectValue />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{PERIODICITIES.map((entry) => (
										<SelectItem
											key={entry.value}
											value={entry.value}
										>
											{entry.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<ReportPresetBar
							reportKey="financial-statements"
							values={{ tab, fromDate, toDate, periodicity }}
							onApply={(saved) => {
								// الفلاتر تُقرأ واحدًا واحدًا لا بالانتشار: عرضٌ محفوظ قبل
								// إضافة فلتر جديد لا يحمل مفتاحه، والقيمة الحالية تبقى
								if (isTab(saved.tab)) setTab(saved.tab);
								if (saved.fromDate) setFromDate(saved.fromDate);
								if (saved.toDate) setToDate(saved.toDate);
								if (saved.periodicity) setPeriodicity(saved.periodicity);
							}}
						/>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5 px-2"
							onClick={() => {
								const data = exportRows();
								printReport({
									title: TABS.find((entry) => entry.value === tab)?.label ?? "قائمة مالية",
									subtitle: `من ${fromDate} إلى ${toDate} — ${
										PERIODICITIES.find((entry) => entry.value === periodicity)?.label ??
										periodicity
									}`,
									headers: data.headers,
									rows: data.rows,
									// صفوف المجاميع تُبرَز: هي ما يقرأه المحاسب أولًا على الورق
									emphasizedRowIndexes: data.rows
										.map((row, index) => (TOTAL_ROW_LABELS.has(String(row[0])) ? index : -1))
										.filter((index) => index >= 0),
								});
							}}
						>
							<IconPrinter className="size-3.5" /> PDF
						</Button>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5 px-2"
							onClick={() => {
								const data = exportRows();
								downloadCsv(data.name, data.headers, data.rows);
							}}
						>
							<IconDownload className="size-3.5" /> CSV
						</Button>
						<Button
							type="button"
							variant="outline"
							size="xs"
							className="gap-1.5 px-2"
							onClick={() => {
								const data = exportRows();
								void downloadXlsx(data.name, "التقرير", data.headers, data.rows);
							}}
						>
							<IconFileSpreadsheet className="size-3.5" /> Excel
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{loading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="min-w-64">البند</TableHead>
								{periods.map((p) => (
									<TableHead
										key={p.key}
										className="text-end"
										dir="ltr"
									>
										{p.label}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{tab === "bs" && bs ? (
								<>
									<SectionRows
										rows={bs.assets.rows.filter(match)}
										periodCount={periods.length}
									/>
									<TotalRow
										label="إجمالي الأصول"
										values={bs.assets.totals}
										emphasize
									/>
									<SectionRows
										rows={bs.liabilities.rows.filter(match)}
										periodCount={periods.length}
									/>
									<SectionRows
										rows={bs.equity.rows.filter(match)}
										periodCount={periods.length}
									/>
									<TotalRow
										label="الربح المؤقت (قبل الإقفال)"
										values={bs.provisionalProfit}
									/>
									<TotalRow
										label="إجمالي الالتزامات وحقوق الملكية"
										values={bs.totalLiabilitiesAndEquity}
										emphasize
									/>
									<TotalRow
										label="الفرق (يجب أن يكون صفرًا)"
										values={bs.differences}
									/>
								</>
							) : null}
							{tab === "pnl" && pnl ? (
								<>
									<SectionRows
										rows={pnl.income.rows.filter(match)}
										periodCount={periods.length}
									/>
									<TotalRow
										label="إجمالي الإيرادات"
										values={pnl.income.totals}
										emphasize
									/>
									<SectionRows
										rows={pnl.expense.rows.filter(match)}
										periodCount={periods.length}
									/>
									<TotalRow
										label="إجمالي المصروفات"
										values={pnl.expense.totals}
										emphasize
									/>
									<TotalRow
										label="صافي الربح"
										values={pnl.netProfit}
										emphasize
									/>
								</>
							) : null}
							{tab === "cf" && cf ? (
								<>
									{cf.rows.map((row) => (
										<TotalRow
											key={row.label}
											label={row.label}
											values={row.values}
										/>
									))}
									<TotalRow
										label="صافي التغير النقدي"
										values={cf.netChange}
										emphasize
									/>
									<TotalRow
										label="النقد أول المدة"
										values={cf.openingCash}
									/>
									<TotalRow
										label="النقد آخر المدة"
										values={cf.closingCash}
										emphasize
									/>
								</>
							) : null}
							{!loading && periods.length === 0 ? (
								<TableRow>
									<TableCell className="py-8 text-center text-muted-foreground">
										لا بيانات في النطاق.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
};
