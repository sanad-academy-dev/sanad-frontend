import { IconDownload } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import { DateField } from "@/components/common/date-field";
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
import { AccountingAmount } from "@/features/accounting/components/accounting-amount";
import {
	usePaymentPeriodReport,
	useSalesPaymentSummary,
} from "@/features/accounting/reports/hooks/use-accounting-reports";
import { PAYMENT_TYPE_APPEARANCE } from "@/features/accounting/utils/accounting-status";
import { downloadCsv, isoDay } from "@/features/accounting/utils/export-csv";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { PaymentType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

function yearStart(): string {
	return `${new Date().getFullYear()}-01-01`;
}
function today(): string {
	return new Date().toISOString().slice(0, 10);
}

const TABS = [
	{ value: "period", label: "فترات السداد حسب تاريخ الفاتورة" },
	{ value: "summary", label: "ملخص المقبوضات" },
] as const;
type ReportTab = (typeof TABS)[number]["value"];

/**
 * [P7.9] Payment reports — the two the phases file names: Payment Period Based on
 * Invoice Date (collection age per settled reference) and Sales Payment Summary
 * (Receive payments by day × mode). Same one-tab + in-page pill anatomy as the
 * registers (§7.8 hub rule).
 */
export const PaymentReportsPage = () => {
	const [tab, setTab] = useState<ReportTab>("period");
	const [fromDate, setFromDate] = useState(yearStart());
	const [toDate, setToDate] = useState(today());
	const [search, setSearch] = useState("");

	const { rows: periodRows, isLoading: periodLoading } = usePaymentPeriodReport({
		fromDate,
		toDate,
	});
	const { rows: summaryRows, isLoading: summaryLoading } = useSalesPaymentSummary({
		fromDate,
		toDate,
	});

	const visiblePeriod = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return periodRows;
		return periodRows.filter(
			(row) =>
				(row.paymentNo ?? "").toLowerCase().includes(q) ||
				(row.referenceNo ?? "").toLowerCase().includes(q) ||
				(row.partyName ?? "").toLowerCase().includes(q),
		);
	}, [periodRows, search]);

	const exportCsv = () => {
		if (tab === "period") {
			downloadCsv(
				"payment-period",
				[
					"السند",
					"تاريخ السند",
					"النوع",
					"الطرف",
					"المستند",
					"تاريخ الفاتورة",
					"المخصص",
					"العمر (يوم)",
				],
				visiblePeriod.map((row) => [
					row.paymentNo ?? "",
					isoDay(row.paymentDate.toString()),
					row.paymentType,
					row.partyName ?? "",
					row.referenceNo ?? "",
					row.invoiceDate ? isoDay(row.invoiceDate.toString()) : "",
					row.allocatedAmount,
					row.ageDays == null ? "" : String(row.ageDays),
				]),
			);
			return;
		}
		downloadCsv(
			"sales-payment-summary",
			["التاريخ", "وسيلة الدفع", "عدد السندات", "المقبوض", "المخصص", "غير المخصص"],
			summaryRows.map((row) => [
				isoDay(row.postingDate.toString()),
				row.modeOfPayment,
				String(row.paymentCount),
				row.paidAmount,
				row.allocatedAmount,
				row.unallocatedAmount,
			]),
		);
	};

	const loading = tab === "period" ? periodLoading : summaryLoading;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">تقارير المدفوعات</h1>
				<p className="text-muted-foreground text-sm">
					عمر التحصيل لكل تخصيص، وملخص المقبوضات اليومي حسب وسيلة الدفع.
				</p>
			</div>

			<TableToolbar
				className="border-t"
				searchValue={search}
				onSearchChange={setSearch}
				searchPlaceholder="ابحث بالسند أو المستند أو الطرف..."
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
				) : tab === "period" ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>السند</TableHead>
								<TableHead>تاريخ السند</TableHead>
								<TableHead>النوع</TableHead>
								<TableHead>الطرف</TableHead>
								<TableHead>المستند المسدد</TableHead>
								<TableHead>تاريخ الفاتورة</TableHead>
								<TableHead className="text-end">المخصص</TableHead>
								<TableHead className="text-end">العمر (يوم)</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{visiblePeriod.map((row, index) => (
								<TableRow key={`${row.paymentId}-${index}`}>
									<TableCell dir="ltr">{row.paymentNo}</TableCell>
									<TableCell dir="ltr">
										{formatDisplayDate(row.paymentDate.toString())}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												PAYMENT_TYPE_APPEARANCE[row.paymentType as PaymentType]?.variant ??
												"secondary"
											}
										>
											{PAYMENT_TYPE_APPEARANCE[row.paymentType as PaymentType]?.label ??
												row.paymentType}
										</Badge>
									</TableCell>
									<TableCell>{row.partyName ?? ""}</TableCell>
									<TableCell dir="ltr">{row.referenceNo ?? ""}</TableCell>
									<TableCell dir="ltr">
										{row.invoiceDate ? formatDisplayDate(row.invoiceDate.toString()) : "—"}
									</TableCell>
									<TableCell className="text-end">
										<AccountingAmount value={row.allocatedAmount} />
									</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{row.ageDays ?? "—"}
									</TableCell>
								</TableRow>
							))}
							{visiblePeriod.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className="py-8 text-center text-muted-foreground"
									>
										لا تخصيصات في النطاق.
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>التاريخ</TableHead>
								<TableHead>وسيلة الدفع</TableHead>
								<TableHead className="text-end">عدد السندات</TableHead>
								<TableHead className="text-end">المقبوض</TableHead>
								<TableHead className="text-end">المخصص</TableHead>
								<TableHead className="text-end">غير المخصص</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{summaryRows.map((row, index) => (
								<TableRow key={`${row.modeOfPayment}-${index}`}>
									<TableCell dir="ltr">
										{formatDisplayDate(row.postingDate.toString())}
									</TableCell>
									<TableCell>{row.modeOfPayment}</TableCell>
									<TableCell
										className="text-end tabular-nums"
										dir="ltr"
									>
										{row.paymentCount}
									</TableCell>
									<TableCell className="text-end">
										<AccountingAmount value={row.paidAmount} />
									</TableCell>
									<TableCell className="text-end">
										<AccountingAmount value={row.allocatedAmount} />
									</TableCell>
									<TableCell className="text-end">
										<AccountingAmount value={row.unallocatedAmount} />
									</TableCell>
								</TableRow>
							))}
							{summaryRows.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="py-8 text-center text-muted-foreground"
									>
										لا مقبوضات في النطاق.
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
