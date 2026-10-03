import { IconDownload } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Stats } from "@/components/common/stats";
import { TableToolbar } from "@/components/common/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useItemWiseSalesRegister,
	useSalesRegister,
} from "@/features/accounting/reports/hooks/use-accounting-reports";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { StatItem } from "@/features/dashboard/types/dashboard.types";
import { cn } from "@/lib/utils";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const TABS = [
	{ value: "invoices", label: "سجل المبيعات" },
	{ value: "items", label: "تفصيلي بالأصناف" },
] as const;
type RegisterTab = (typeof TABS)[number]["value"];

/**
 * [P5.8] §18.4 — Sales Register (invoice-level, one column per tax account) and the
 * Item-wise register (line-level off the persisted item_wise_tax_detail). Figures are
 * stored §8 outputs + PLE-derived outstanding — the screen adds nothing.
 */
export const SalesRegisterPage = () => {
	const [tab, setTab] = useState<RegisterTab>("invoices");
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [search, setSearch] = useState("");

	const { report, isLoading } = useSalesRegister({ fromDate, toDate });
	const { report: itemReport, isLoading: itemsLoading } = useItemWiseSalesRegister({
		fromDate,
		toDate,
	});

	const stats = useMemo<StatItem[]>(
		() => [
			{
				title: "الفواتير",
				value: report?.rows.length ?? 0,
				tooltip: "فواتير معتمدة في النطاق (الملغاة مستبعدة).",
			},
			{
				title: "الصافي",
				// C2 — the exact server string renders via valueLabel; no JS float touches it
				value: 0,
				valueLabel: formatAmount(report?.totals.netTotal ?? "0"),
				tooltip: "مجموع صافي الفواتير قبل الضرائب.",
			},
			{
				title: "الضرائب",
				// C2 — the exact server string renders via valueLabel; no JS float touches it
				value: 0,
				valueLabel: formatAmount(report?.totals.totalTaxesAndCharges ?? "0"),
				tooltip: "مجموع الضرائب والرسوم.",
			},
			{
				title: "المتبقي",
				// C2 — the exact server string renders via valueLabel; no JS float touches it
				value: 0,
				valueLabel: formatAmount(report?.totals.outstandingAmount ?? "0"),
				tooltip: "مجموع المتبقي — من سجل الذمم (BR-5.2.2).",
			},
		],
		[report],
	);

	const visibleInvoices = useMemo(() => {
		const rows = report?.rows ?? [];
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				(row.documentNo ?? "").toLowerCase().includes(q) ||
				(row.partyName ?? "").toLowerCase().includes(q),
		);
	}, [report, search]);

	const visibleItems = useMemo(() => {
		const rows = itemReport?.rows ?? [];
		const q = search.trim().toLowerCase();
		if (!q) return rows;
		return rows.filter(
			(row) =>
				(row.documentNo ?? "").toLowerCase().includes(q) ||
				(row.partyName ?? "").toLowerCase().includes(q) ||
				row.itemName.toLowerCase().includes(q),
		);
	}, [itemReport, search]);

	const exportCsv = () => {
		if (tab === "invoices") {
			const columns = report?.taxColumns ?? [];
			downloadCsv(
				"sales-register",
				[
					"المستند",
					"التاريخ",
					"العميل",
					"حساب الذمم",
					"الصافي",
					...columns.map((column) => column.accountName),
					"إجمالي الضرائب",
					"الإجمالي",
					"المتبقي",
					"الحالة",
				],
				visibleInvoices.map((row) => [
					row.documentNo ?? "",
					isoDay(row.postingDate.toString()),
					row.partyName ?? "",
					row.debitToAccount,
					row.netTotal,
					...columns.map((column) => row.taxByAccount[column.accountId] ?? "0"),
					row.totalTaxesAndCharges,
					row.grandTotal,
					row.outstandingAmount,
					row.status,
				]),
			);
			return;
		}
		const columns = itemReport?.taxColumns ?? [];
		downloadCsv(
			"item-wise-sales-register",
			[
				"المستند",
				"التاريخ",
				"العميل",
				"الصنف",
				"حساب الإيراد",
				"الكمية",
				"السعر",
				"الصافي",
				...columns.map((column) => column.accountName),
				"إجمالي الضريبة",
				"الإجمالي",
			],
			visibleItems.map((row) => [
				row.documentNo ?? "",
				isoDay(row.postingDate.toString()),
				row.partyName ?? "",
				row.itemName,
				row.incomeAccount,
				row.qty,
				row.rate,
				row.netAmount,
				...columns.map((column) => row.taxByAccount[column.accountId]?.amount ?? "0"),
				row.totalTax,
				row.total,
			]),
		);
	};

	const loading = tab === "invoices" ? isLoading : itemsLoading;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">سجل المبيعات</h1>
				<p className="text-muted-foreground text-sm">
					§18.4 — على مستوى الفاتورة بعمود لكل حساب ضريبة، أو تفصيليًا بالأصناف من
					item_wise_tax_detail.
				</p>
			</div>

			<Stats
				className="grid-cols-4 px-4"
				stats={stats}
			/>

			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث بالمستند أو العميل أو الصنف..."
				buttonSize="xs"
				showExport={false}
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
						<Button
							type="button"
							variant="outline"
							size="xs"
							onClick={exportCsv}
							className="gap-1.5 px-2"
						>
							<IconDownload className="size-3.5" />
							تصدير
						</Button>
					</div>
				}
			/>

			<div className="min-h-0 flex-1 overflow-auto border-t">
				{loading ? (
					<p className="py-10 text-center text-muted-foreground text-sm">جارٍ التحميل...</p>
				) : tab === "invoices" ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المستند</TableHead>
								<TableHead>التاريخ</TableHead>
								<TableHead>العميل</TableHead>
								<TableHead className="text-end">الصافي</TableHead>
								{(report?.taxColumns ?? []).map((column) => (
									<TableHead
										key={column.accountId}
										className="text-end"
									>
										{column.accountName}
									</TableHead>
								))}
								<TableHead className="text-end">الإجمالي</TableHead>
								<TableHead className="text-end">المتبقي</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleInvoices.map((row) => (
								<TableRow key={row.invoiceId}>
									<TableCell dir="ltr">
										{row.documentNo}
										{row.isReturn ? <Badge variant="secondary">مرتجع</Badge> : null}
									</TableCell>
									<TableCell dir="ltr">{isoDay(row.postingDate.toString())}</TableCell>
									<TableCell>{row.partyName ?? row.partyId}</TableCell>
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{row.netTotal}
									</TableCell>
									{(report?.taxColumns ?? []).map((column) => (
										<TableCell
											key={column.accountId}
											className="text-end"
											dir="ltr"
										>
											{row.taxByAccount[column.accountId] ?? "0"}
										</TableCell>
									))}
									<TableCell
										className="text-end font-medium"
										dir="ltr"
									>
										{row.grandTotal}
									</TableCell>
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{row.outstandingAmount}
									</TableCell>
								</TableRow>
							))}
							{report && visibleInvoices.length > 0 ? (
								<TableRow className="bg-muted/40 font-medium">
									<TableCell colSpan={3}>الإجمالي</TableCell>
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{report.totals.netTotal}
									</TableCell>
									{report.taxColumns.map((column) => (
										<TableCell
											key={column.accountId}
											className="text-end"
											dir="ltr"
										>
											{report.totals.taxByAccount[column.accountId] ?? "0"}
										</TableCell>
									))}
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{report.totals.grandTotal}
									</TableCell>
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{report.totals.outstandingAmount}
									</TableCell>
								</TableRow>
							) : null}
							{visibleInvoices.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6 + (report?.taxColumns.length ?? 0)}
										className="py-8 text-center text-muted-foreground"
									>
										لا فواتير في النطاق.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>المستند</TableHead>
								<TableHead>العميل</TableHead>
								<TableHead>الصنف</TableHead>
								<TableHead>حساب الإيراد</TableHead>
								<TableHead className="text-end">الكمية</TableHead>
								<TableHead className="text-end">الصافي</TableHead>
								{(itemReport?.taxColumns ?? []).map((column) => (
									<TableHead
										key={column.accountId}
										className="text-end"
									>
										{column.accountName}
									</TableHead>
								))}
								<TableHead className="text-end">الإجمالي</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visibleItems.map((row, index) => (
								<TableRow key={`${row.invoiceId}-${index}`}>
									<TableCell dir="ltr">{row.documentNo}</TableCell>
									<TableCell>{row.partyName ?? ""}</TableCell>
									<TableCell>{row.itemName}</TableCell>
									<TableCell>{row.incomeAccount}</TableCell>
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{row.qty}
									</TableCell>
									<TableCell
										className="text-end"
										dir="ltr"
									>
										{row.netAmount}
									</TableCell>
									{(itemReport?.taxColumns ?? []).map((column) => (
										<TableCell
											key={column.accountId}
											className="text-end"
											dir="ltr"
										>
											{row.taxByAccount[column.accountId]?.amount ?? "0"}
										</TableCell>
									))}
									<TableCell
										className="text-end font-medium"
										dir="ltr"
									>
										{row.total}
									</TableCell>
								</TableRow>
							))}
							{visibleItems.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7 + (itemReport?.taxColumns.length ?? 0)}
										className="py-8 text-center text-muted-foreground"
									>
										لا سطور في النطاق.
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
